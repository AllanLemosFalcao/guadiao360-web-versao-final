const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:5173' 
}));

// Configuração da conexão com o MySQL
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin', // Sua senha do MySQL
    database: 'gestao_usuarios_db' // O nome do seu banco
});

// Conecta ao banco
dbConnection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao MySQL com o ID ' + dbConnection.threadId);
});

// ===============================================
// ROTA DE STATS DE OCORRÊNCIAS (A rota nova/corrigida)
// ===============================================
app.get('/api/ocorrencias/stats', (req, res) => {
    
    // 1. Pegue os filtros (exceto 'status')
    const { regiao, dataInicio, dataFinal } = req.query;

    // 2. Construa a query SQL
    let sqlQuery = `
        SELECT 
            status, 
            COUNT(*) as count 
        FROM tb_ocorrencias
    `;
    
    const whereClauses = [];
    const params = [];

    // 3. Adicione os filtros
    if (regiao) {
        whereClauses.push("regiao = ?");
        params.push(regiao);
    }
    if (dataInicio) {
        whereClauses.push("data_hora >= ?");
        params.push(`${dataInicio} 00:00:00`);
    }
    if (dataFinal) {
        whereClauses.push("data_hora <= ?");
        params.push(`${dataFinal} 23:59:59`);
    }

    if (whereClauses.length > 0) {
        sqlQuery += " WHERE " + whereClauses.join(" AND ");
    }

    // 4. Agrupe por status
    sqlQuery += " GROUP BY status";

    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) {
            console.error("Erro na query SQL (stats):", err);
            return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
        
        // 5. Formate os dados com a lógica de "Aberto = Total" e "Pendente = Andamento"
        const stats = {
            Aberto: 0,
            Pendente: 0,
            Concluído: 0,
            Cancelado: 0
        };
        let totalCount = 0;

        results.forEach(row => {
            totalCount += row.count;
            if (row.status === 'Concluído') {
                stats.Concluído = row.count;
            } else if (row.status === 'Cancelado') {
                stats.Cancelado = row.count;
            } else if (row.status === 'Andamento') {
                stats.Pendente = row.count; // "Pendente" usa a contagem de "Andamento"
            }
        });
        
        stats.Aberto = totalCount; // "Aberto" é o total
        
        res.json(stats);
    });
});

// ===============================================
// ROTAS AUXILIARES (PARA OS SELECTS)
// ===============================================
app.get('/api/perfis', (req, res) => {
    dbConnection.query("SELECT * FROM perfis", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/unidades', (req, res) => {
    dbConnection.query("SELECT * FROM unidades", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ===============================================
// ROTA DE USUÁRIOS (LISTAR COM FILTROS E PAGINAÇÃO)
// ===============================================
app.get('/api/usuarios', (req, res) => {
    const { perfil, unidade, status, posto, page } = req.query;
    
    const limit = 10; // Máximo de 10 registros por página
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limit;

    let sqlQuery = `
        SELECT 
            u.id, u.nome_completo, u.matricula, u.posto_graduacao, u.status,
            p.nome_perfil, un.nome_unidade
        FROM usuarios u
        LEFT JOIN perfis p ON u.perfil_id = p.id
        LEFT JOIN unidades un ON u.unidade_id = un.id
    `;
    
    const whereClauses = [];
    const params = [];

    if (perfil) { whereClauses.push("u.perfil_id = ?"); params.push(perfil); }
    if (unidade) { whereClauses.push("u.unidade_id = ?"); params.push(unidade); }
    if (status) { whereClauses.push("u.status = ?"); params.push(status); }
    if (posto) { whereClauses.push("u.posto_graduacao = ?"); params.push(posto); }

    if (whereClauses.length > 0) {
        sqlQuery += " WHERE " + whereClauses.join(" AND ");
    }

    // Query de Contagem (para paginação)
    const countQuery = `SELECT COUNT(*) as total FROM usuarios u ${whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : ""}`;

    dbConnection.query(countQuery, params, (err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const totalCount = countResult[0].total;
        const totalPages = Math.ceil(totalCount / limit);

        // Query de Dados
        sqlQuery += " ORDER BY u.nome_completo ASC LIMIT ? OFFSET ?";
        const dataParams = [...params, limit, offset];

        dbConnection.query(sqlQuery, dataParams, (err, dataResults) => {
            if (err) return res.status(500).json({ error: err.message });
            
            res.json({
                data: dataResults,
                pagination: { page: pageNum, totalPages, totalCount }
            });
        });
    });
});

// ===============================================
// ROTAS DE AÇÃO (CRIAR, EDITAR, EXCLUIR)
// ===============================================

// CRIAR
// Necessário instalar body-parser: npm install body-parser
// Ou usar: app.use(express.json()); no topo do arquivo
app.post('/api/usuarios', (req, res) => {
    const { nome, matricula, posto, status, perfil_id, unidade_id } = req.body;
    const sql = "INSERT INTO usuarios (nome_completo, matricula, posto_graduacao, status, perfil_id, unidade_id) VALUES (?, ?, ?, ?, ?, ?)";
    
    dbConnection.query(sql, [nome, matricula, posto, status, perfil_id, unidade_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuário criado com sucesso!", id: result.insertId });
    });
});

// EXCLUIR
app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    dbConnection.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuário excluído com sucesso!" });
    });
});

// EDITAR (Atualizar)
app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, matricula, posto, status, perfil_id, unidade_id } = req.body;
    const sql = "UPDATE usuarios SET nome_completo=?, matricula=?, posto_graduacao=?, status=?, perfil_id=?, unidade_id=? WHERE id=?";
    
    dbConnection.query(sql, [nome, matricula, posto, status, perfil_id, unidade_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuário atualizado com sucesso!" });
    });
});

// ===============================================
// ROTA DA TABELA DE OCORRÊNCIAS (A rota que sumiu)
// ===============================================
app.get('/api/ocorrencias', (req, res) => {
    
    // 1. Pegue os filtros (status, regiao, datas)
    const { status, regiao, dataInicio, dataFinal } = req.query;

    // 2. Construa a query (selecionando as colunas corretas)
    let sqlQuery = "SELECT id, tipo_ocorrencia, icone_classe, status, localizacao FROM tb_ocorrencias";
    
    const whereClauses = [];
    const params = []; 

    // 3. Adicione os filtros
    if (status) {
        whereClauses.push("status = ?");
        params.push(status);
    }
    if (regiao) {
        whereClauses.push("regiao = ?");
        params.push(regiao);
    }
    if (dataInicio) {
        whereClauses.push("data_hora >= ?");
        params.push(`${dataInicio} 00:00:00`);
    }
    if (dataFinal) {
        whereClauses.push("data_hora <= ?");
        params.push(`${dataFinal} 23:59:59`);
    }

    if (whereClauses.length > 0) {
        sqlQuery += " WHERE " + whereClauses.join(" AND ");
    }

    sqlQuery += " ORDER BY data_hora DESC";

    // 5. Execute a query
    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) {
            console.error("Erro na query SQL (ocorrencias):", err);
            return res.status(500).json({ error: 'Erro ao buscar ocorrências' });
        }
        
        // 6. Envie os resultados (que vão para a tabela)
        res.json(results);
    });
});

// ===============================================
// ROTA DE AUDITORIA (Sem mudanças)
// ===============================================
app.get('/api/auditoria', (req, res) => {
    
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { descricao, evento, dataInicio, dataFinal } = req.query;

    let whereClauses = [];
    let params = [];
    
    if (descricao) {
        whereClauses.push("detalhes LIKE ?");
        params.push(`%${descricao}%`);
    }
    if (evento) {
        whereClauses.push("evento_tipo = ?");
        params.push(evento);
    }
    if (dataInicio) {
        whereClauses.push("data_hora >= ?");
        params.push(`${dataInicio} 00:00:00`);
    }
    if (dataFinal) {
        whereClauses.push("data_hora <= ?");
        params.push(`${dataFinal} 23:59:59`);
    }

    const whereString = whereClauses.length > 0 ? " WHERE " + whereClauses.join(" AND ") : "";

    const countQuery = `SELECT COUNT(*) as totalCount FROM tb_auditoria${whereString}`;
    
    dbConnection.query(countQuery, params, (err, countResult) => {
        if (err) {
            console.error("Erro na query SQL (count):", err);
            return res.status(500).json({ error: 'Erro ao buscar contagem' });
        }

        const totalCount = countResult[0].totalCount;
        const totalPages = Math.ceil(totalCount / limit);
        const dataQuery = `SELECT * FROM tb_auditoria${whereString} ORDER BY data_hora DESC LIMIT ? OFFSET ?`;
        const dataParams = [...params, limit, offset]; 

        dbConnection.query(dataQuery, dataParams, (err, dataResults) => {
            if (err) {
                console.error("Erro na query SQL (data):", err);
                return res.status(500).json({ error: 'Erro ao buscar dados' });
            }

            res.json({
                data: dataResults,
                pagination: {
                    page: page,
                    totalPages: totalPages,
                    totalCount: totalCount
                }
            });
        });
    });
});

// ===============================================
// INICIA O SERVIDOR
// ===============================================
app.listen(port, () => {
    console.log(`API do Guardião rodando em http://localhost:${port}`);
});

// ===============================================
// ROTA 2: PARA A TABELA DE RESUMO (TEMPO MÉDIO)
// ===============================================
app.get('/api/reports/resumo-por-tipo', (req, res) => {
    
    const { status, regiao, tipo, dataInicio, dataFinal } = req.query;

    let sqlQuery = `
        SELECT 
            tipo_ocorrencia,
            regiao,
            COUNT(*) as numero_ocorrencias,
            /* Calcula a média em minutos */
            AVG(TIMESTAMPDIFF(MINUTE, data_hora, data_conclusao)) as tempo_medio_minutos
        FROM 
            tb_ocorrencias
    `;
    
    const whereClauses = [];
    const params = [];

    // Filtra apenas por ocorrências que *têm* um tempo de conclusão
    whereClauses.push("data_conclusao IS NOT NULL");

    // Adiciona os filtros
    if (status) { whereClauses.push("status = ?"); params.push(status); }
    if (regiao) { whereClauses.push("regiao = ?"); params.push(regiao); }
    if (tipo) { whereClauses.push("tipo_ocorrencia = ?"); params.push(tipo); }
    if (dataInicio) { whereClauses.push("data_hora >= ?"); params.push(`${dataInicio} 00:00:00`); }
    if (dataFinal) { whereClauses.push("data_hora <= ?"); params.push(`${dataFinal} 23:59:59`); }

    sqlQuery += " WHERE " + whereClauses.join(" AND ");
    sqlQuery += " GROUP BY tipo_ocorrencia, regiao";

    dbConnection.query(sqlQuery, params, (err, results) => {
        if (err) {
            console.error("Erro na query SQL (reports/resumo):", err);
            return res.status(500).json({ error: 'Erro ao buscar dados do resumo' });
        }
        res.json(results);
    });
});