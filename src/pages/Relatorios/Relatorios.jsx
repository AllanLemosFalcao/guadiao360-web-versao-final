// pages/Relatorios/Relatorios.jsx
import React, { useState } from 'react'; // Não precisamos mais do useEffect
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './relatorios.module.css';
import '../../styles/global.css';

// ❌ REMOVIDOS: Imports do 'react-chartjs-2' e 'chart.js'

// Função para formatar o tempo (continua necessária)
const formatarTempoMedio = (minutos) => {
    if (!minutos) return "N/A";
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h}h ${m}m`;
};

const Relatorios = () => {
    // 1. Estados para os filtros
    const [dataInicio, setDataInicio] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroRegiao, setFiltroRegiao] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    
    // 2. Estado APENAS para a tabela de resumo
    const [summaryData, setSummaryData] = useState([]); // Começa vazio
    
    // 3. Função para buscar os dados (só busca o resumo)
    const handleGerarRelatorio = () => {
        // Constrói os parâmetros da URL
        const params = new URLSearchParams();
        if (filtroTipo) params.append('tipo', filtroTipo);
        if (filtroRegiao) params.append('regiao', filtroRegiao);
        if (filtroStatus) params.append('status', filtroStatus);
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFinal) params.append('dataFinal', dataFinal);

        const queryString = params.toString();
        
        // API URL (ajuste para o ngrok se necessário)
        const API_URL = 'http://localhost:3001';

        // ❌ REMOVIDO: Fetch para o gráfico
        
        // B. Buscar dados para a Tabela de Resumo
        fetch(`${API_URL}/api/reports/resumo-por-tipo?${queryString}`)
            .then(res => res.json())
            .then(apiData => {
                // Atualiza os dados do resumo
                const dadosFormatados = apiData.map(item => ({
                    num: item.numero_ocorrencias,
                    tipo: item.tipo_ocorrencia,
                    regiao: item.regiao,
                    tempo: formatarTempoMedio(item.tempo_medio_minutos)
                }));
                setSummaryData(dadosFormatados);
            })
            .catch(err => console.error("Erro ao buscar dados do resumo:", err));
    };


  return (
    <div className="dashboardContainer">
      <Sidebar />
      <main className="mainContent grayBackground">
        
        <MainHeader 
          title="Relatórios Analíticos"
          actions={<></>}
        />
        
        {/* Botão "Gerar Relatórios" (conectado ao handler) */}
        <section className={styles.buttonContainer}>
          <button className={`btn ${styles.btnAddUser}`} onClick={handleGerarRelatorio}>
            <i className="fa-solid"></i> Gerar Relatórios
          </button>
        </section>

        {/* Container de Filtros (conectado aos states) */}
<section className={styles.filtersContainerReports}>

          {/* 1. FILTROS DE CIMA (OS 3 CLICÁVEIS) */}
          <div className={styles.filterGrid}>
            
            <div className={styles.filterItem}>
              <label htmlFor="tipo-ocorrencia-1">Tipo de Ocorrência:</label>
              <select id="tipo-ocorrencia-1" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Selecione o Tipo</option>
                <option value="Resgate">Resgate</option>
                <option value="Incêndio">Incêndio</option>
                <option value="Acidente Veicular">Acidente Veicular</option>
              </select>
            </div>
            
            <div className={styles.filterItem}>
              <label htmlFor="regiao-1">Região:</label>
              <select id="regiao-1" value={filtroRegiao} onChange={(e) => setFiltroRegiao(e.target.value)}>
                <option value="">Selecione a Região</option>
                <option value="Norte">Norte</option>
                <option value="Sul">Sul</option>
                <option value="Centro">Centro</option>
                <option value="Oeste">Oeste</option>
                <option value="Jaboatão">Jaboatão</option>
              </select>
            </div>
            
            <div className={styles.filterItem}>
              <label htmlFor="status-1">Status:</label>
              <select id="status-1" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="">Selecione o Status</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div> {/* Fim do grid de cima */}

          {/* 2. FILTROS DE BAIXO (PERÍODO) */}
          <div className={styles.filterGridBottom}>
            <div className={styles.filterItem}>
                <label htmlFor="data-inicio">Período (Início):</label>
                <input type="date" id="data-inicio" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            
            <div className={styles.filterItem}>
                <label htmlFor="data-final">Período (Final):</label>
                <input type="date" id="data-final" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
            </div>
          </div> {/* Fim do grid de baixo */}


          {/* Botões de Exportação (sem mudança) */}
          <div className={styles.exportButtons}>
            <button className={`${styles.btnExport} ${styles.btnPdf}`}>
              <i className="fa-solid fa-file-pdf"></i> Exportar (PDF)
            </button>
            <button className={`${styles.btnExport} ${styles.btnCsv}`}>
              <i className="fa-solid fa-file-csv"></i> Exportar (CSV)
            </button>
          </div>
        </section>
        
        {/* Container de Métricas (Estático, como solicitado) */}
        <section className={styles.metricsContainer}>
            <h4>Métricas a Incluir</h4>
            <div className={styles.metricsGrid}>
                {/* ... (Seu JSX de checkboxes estáticos aqui) ... */}
                <div className={styles.metricItem}>
                    <input type="checkbox" id="metrica1" />
                    <label htmlFor="metrica1">Tempo Médio de Resposta</label>
                </div>
                <div className={styles.metricItem}>
                    <input type="checkbox" id="metrica2" />
                    <label htmlFor="metrica2">Tempo médio por Tipo</label>
                </div>
                <div className={styles.metricItem}>
                    <input type="checkbox" id="metrica3" />
                    <label htmlFor="metrica3">Uso de Recursos</label>
                </div>
                <div className={styles.metricItem}>
                    <input type="checkbox" id="metrica4" />
                    <label htmlFor="metrica4">Uso de Recursos</label>
                </div>
            </div>
        </section>

        {/* Grid de Pré-Visualização (Gráfico estático, Tabela dinâmica) */}
        <section className={styles.previewGrid}>
          
          <div className={styles.previewCard}>
            <h5>Pré-Visualização:</h5>
            
            {/* 4. GRÁFICO SVG ESTÁTICO (exatamente como no HTML) */}
            <svg
              className={styles.chartPlaceholder}
              width="100%"
              viewBox="0 0 500 150"
              preserveAspectRatio="xMidYMid meet"
            >
              <line x1="30" y1="130" x2="480" y2="130" stroke="#aaa" strokeWidth="1" />
              <line x1="30" y1="10" x2="30" y2="130" stroke="#aaa" strokeWidth="1" />
              <text x="10" y="130" fontSize="10" fill="#555">10</text>
              <text x="10" y="105" fontSize="10" fill="#555">20</text>
              <text x="10" y="80" fontSize="10" fill="#555">30</text>
              <text x="10" y="55" fontSize="10" fill="#555">40</text>
              <text x="10" y="30" fontSize="10" fill="#555">50</text>
              <text x="40" y="145" fontSize="10" fill="#555">Jan</text>
              <text x="80" y="145" fontSize="10" fill="#555">Fev</text>
              <text x="120" y="145" fontSize="10" fill="#555">Mar</text>
              <text x="160" y="145" fontSize="10" fill="#555">Abr</text>
              <text x="200" y="145" fontSize="10" fill="#555">Mai</text>
              <text x="240" y="145" fontSize="10" fill="#555">Jun</text>
              <text x="280" y="145" fontSize="10" fill="#555">Jul</text>
              <text x="320" y="145" fontSize="10" fill="#555">Ago</text>
              <text x="360" y="145" fontSize="10" fill="#555">Set</text>
              <polyline
                points="40,105 80,95 120,80 200,50 240,80 280,115 360,70"
                fill="none"
                stroke="#8E44AD"
                strokeWidth="2"
              />
              <circle cx="40" cy="105" r="3" fill="#8E44AD" />
              <circle cx="80" cy="95" r="3" fill="#8E44AD" />
              <circle cx="120" cy="80" r="3" fill="#8E44AD" />
              <circle cx="200" cy="50" r="3" fill="#8E44AD" />
              <circle cx="240" cy="80" r="3" fill="#8E44AD" />
              <circle cx="280" cy="115" r="3" fill="#8E44AD" />
              <circle cx="360" cy="70" r="3" fill="#8E44AD" />
            </svg>
          </div>
          
          {/* Card da Tabela de Resumo (Dinâmica) */}
          <div className={styles.previewCard}>
            <h5>Resumo (Tempo Médio por Tipo/Região)</h5>
            <table className={styles.summaryTable}>
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Tipo de ocorrência</th>
                  <th>Região</th>
                  <th>Tempo Médio</th>
                </tr>
              </thead>
              <tbody>
                {/* 5. Mapeia os dados do state 'summaryData' */}
                {summaryData.length > 0 ? (
                    summaryData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.num}</td>
                        <td>{item.tipo}</td>
                        <td>{item.regiao}</td>
                        <td>{item.tempo}</td>
                      </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{textAlign: 'center'}}>
                            Clique em "Gerar Relatórios" para ver o resumo.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Relatorios;