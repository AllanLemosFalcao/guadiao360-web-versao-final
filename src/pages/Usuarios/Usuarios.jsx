// pages/Usuarios/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainHeader from '../../components/Header/MainHeader';
import styles from './usuarios.module.css';
import '../../styles/global.css';

const Usuarios = () => {
    // Estados de Dados
    const [usuarios, setUsuarios] = useState([]);
    const [perfis, setPerfis] = useState([]);
    const [unidades, setUnidades] = useState([]);
    
    // Estados de Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Estados de Filtro
    const [filtroPerfil, setFiltroPerfil] = useState('');
    const [filtroUnidade, setFiltroUnidade] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroPosto, setFiltroPosto] = useState('');

    // Estados do Modal (Adicionar/Editar)
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        id: null, nome: '', matricula: '', posto: '', status: 'Ativo', perfil_id: '', unidade_id: ''
    });

    // 1. Carregar dados iniciais (Selects e Lista)
    useEffect(() => {
        fetchSelects();
        fetchUsuarios(1);
    }, []);

    // 2. Monitorar mudanças nos filtros para recarregar a lista
    useEffect(() => {
        fetchUsuarios(1);
    }, [filtroPerfil, filtroUnidade, filtroStatus, filtroPosto]);

    const fetchSelects = async () => {
        try {
            const resPerfis = await fetch('http://localhost:3001/api/perfis');
            const resUnidades = await fetch('http://localhost:3001/api/unidades');
            setPerfis(await resPerfis.json());
            setUnidades(await resUnidades.json());
        } catch (error) { console.error("Erro ao carregar selects:", error); }
    };

    const fetchUsuarios = async (page) => {
        const params = new URLSearchParams({
            page,
            perfil: filtroPerfil,
            unidade: filtroUnidade,
            status: filtroStatus,
            posto: filtroPosto
        });
        
        try {
            const response = await fetch(`http://localhost:3001/api/usuarios?${params.toString()}`);
            const data = await response.json();
            setUsuarios(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        } catch (error) { console.error("Erro ao buscar usuários:", error); }
    };

    // --- AÇÕES DO CRUD ---

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
        
        try {
            await fetch(`http://localhost:3001/api/usuarios/${id}`, { method: 'DELETE' });
            fetchUsuarios(currentPage); // Recarrega a tabela
        } catch (error) { console.error("Erro ao excluir:", error); }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const url = isEditing 
            ? `http://localhost:3001/api/usuarios/${currentUser.id}` 
            : 'http://localhost:3001/api/usuarios';
        
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentUser)
            });
            setShowModal(false);
            fetchUsuarios(currentPage);
        } catch (error) { console.error("Erro ao salvar:", error); }
    };

    const openModalAdd = () => {
        setIsEditing(false);
        setCurrentUser({ id: null, nome: '', matricula: '', posto: '', status: 'Ativo', perfil_id: '', unidade_id: '' });
        setShowModal(true);
    };

    const openModalEdit = (user) => {
        setIsEditing(true);
        // Mapeia os dados da tabela para o formato do formulário
        // Precisamos encontrar os IDs correspondentes se eles não vierem na query principal (no SQL atual não vem, então teria que ajustar o SQL ou buscar pelo nome. Para simplificar, vou assumir que o usuário vai reselecionar no select se precisar).
        // *Melhoria:* O ideal seria que o `api/usuarios` retornasse perfil_id e unidade_id também.
        setCurrentUser({ 
            id: user.id, 
            nome: user.nome_completo, 
            matricula: user.matricula, 
            posto: user.posto_graduacao, 
            status: user.status, 
            perfil_id: '', // Você precisaria retornar perfil_id do backend para preencher isso auto
            unidade_id: '' // Idem
        });
        setShowModal(true);
    };

    return (
        <div className="dashboardContainer">
            <Sidebar />
            <main className="mainContent">
                <MainHeader title="Gestão de Usuários" actions={<></>} />

                {/* Botão Adicionar */}
                <section className={styles.buttonContainer}>
                    <button className={styles.btnAddUser} onClick={openModalAdd}>
                        <i className="fa-solid fa-plus"></i> Adicionar Novo Usuário
                    </button>
                </section>

                {/* Filtros */}
                <section className={`${styles.filtersSection} ${styles.userFilters}`}>
                    <div className={styles.filterGroup}>
                        <label>Perfil/Acesso:</label>
                        <select value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)}>
                            <option value="">Todos</option>
                            {perfis.map(p => <option key={p.id} value={p.id}>{p.nome_perfil}</option>)}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Unidade/Lotação:</label>
                        <select value={filtroUnidade} onChange={e => setFiltroUnidade(e.target.value)}>
                            <option value="">Todas</option>
                            {unidades.map(u => <option key={u.id} value={u.id}>{u.nome_unidade}</option>)}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Status:</label>
                        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Posto/Graduação:</label>
                        <select value={filtroPosto} onChange={e => setFiltroPosto(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Soldado">Soldado</option>
                            <option value="Cabo">Cabo</option>
                            <option value="Sargento">Sargento</option>
                            {/* ... adicione outros postos ... */}
                        </select>
                    </div>
                </section>

                {/* Tabela */}
                <section className={styles.tableContainer}>
                    <h3 className={styles.tableTitle}>Registro de Usuários do Sistema</h3>
                    <div className={styles.tableWrapper}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome Completo</th>
                                    <th>Matrícula</th>
                                    <th>Posto</th>
                                    <th>Unidade</th>
                                    <th>Perfil</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.nome_completo}</td>
                                        <td>{user.matricula}</td>
                                        <td>{user.posto_graduacao}</td>
                                        <td>{user.nome_unidade}</td>
                                        <td>{user.nome_perfil}</td>
                                        <td className={user.status === 'Ativo' ? styles.statusAtivo : styles.statusInativo}>
                                            {user.status}
                                        </td>
                                        <td className={styles.actions}>
                                            <button onClick={() => openModalEdit(user)} style={{border:'none', background:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}}>Editar</button> / 
                                            <button onClick={() => handleDelete(user.id)} style={{border:'none', background:'none', color:'red', cursor:'pointer', textDecoration:'underline'}}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <footer className={styles.paginationFooter}>
                        <span className={styles.pageInfo}>Página {currentPage} de {totalPages || 1}</span>
                        <div className={styles.pageNav}>
                            <button className={styles.prev} disabled={currentPage===1} onClick={() => fetchUsuarios(currentPage-1)}>
                                <i className="fa-solid fa-chevron-left"></i> Anterior
                            </button>
                            <button className={styles.next} disabled={currentPage>=totalPages} onClick={() => fetchUsuarios(currentPage+1)}>
                                Próxima <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </footer>
                </section>

                {/* --- MODAL (SIMPLIFICADO) --- */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{background: 'white', padding: '20px', borderRadius: '8px', width: '400px'}}>
                            <h3>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                            <form onSubmit={handleSaveUser} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <input placeholder="Nome" value={currentUser.nome} onChange={e => setCurrentUser({...currentUser, nome: e.target.value})} required />
                                <input placeholder="Matrícula" value={currentUser.matricula} onChange={e => setCurrentUser({...currentUser, matricula: e.target.value})} required />
                                <input placeholder="Posto/Graduação" value={currentUser.posto} onChange={e => setCurrentUser({...currentUser, posto: e.target.value})} required />
                                
                                <select value={currentUser.perfil_id} onChange={e => setCurrentUser({...currentUser, perfil_id: e.target.value})} required>
                                    <option value="">Selecione Perfil</option>
                                    {perfis.map(p => <option key={p.id} value={p.id}>{p.nome_perfil}</option>)}
                                </select>

                                <select value={currentUser.unidade_id} onChange={e => setCurrentUser({...currentUser, unidade_id: e.target.value})} required>
                                    <option value="">Selecione Unidade</option>
                                    {unidades.map(u => <option key={u.id} value={u.id}>{u.nome_unidade}</option>)}
                                </select>

                                <select value={currentUser.status} onChange={e => setCurrentUser({...currentUser, status: e.target.value})}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>

                                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                                    <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" style={{backgroundColor: '#1a73e8', color: 'white', border: 'none', padding: '5px 15px'}}>Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Usuarios;