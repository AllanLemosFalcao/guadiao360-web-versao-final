// pages/DetalhesOcorrencia/DetalhesOcorrencia.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './detalhes.module.css'; // Importa os estilos modulares locais
import '../../styles/global.css'; // Importa estilos de layout global

// Dados mockados (inicial)
const mockOccurrence = {
    id: '#2023-1254',
    type: 'Incêndio Estrutural',
    status: 'Em Atendimento',
    zona: 'Central',
    prioridade: 'Alta',
    dataHora: '15/05/2023 10:30',
    solicitante: 'Maria Silva',
    endereco: 'Rua das Flores, 123, Santo Antônio',
    historico: [
        '10:32: Chamado recebido e registrado.',
        '11:45: Equipe despachada (VTR 123)',
        '12:00: Em rescaldo e avaliação.',
        '14:36: Incêndio Controlado',
    ],
    midias: [
        { id: 1, type: 'image', name: 'foto_do_local.jpg', src: 'https://i.postimg.cc/sDmtrrp1/image-4.png' },
        { id: 2, type: 'video', name: 'video_ocorrencia.mp4', src: 'https://i.postimg.cc/fbySMmkG/videodolocal.png' },
        { id: 3, type: 'audio', name: 'chamada_193.mp3', icon: 'fa-file-audio', iconClass: styles.faFileAudio },
        { id: 4, type: 'pdf', name: 'relatorio_inicial.pdf', icon: 'fa-file-pdf', iconClass: styles.faFilePdf },
    ],
};

const DetalhesOcorrencia = () => {
    const { id } = useParams();
    
    // Estados para os dados (para poder editar)
    const [occurrence, setOccurrence] = useState(mockOccurrence);
    const [midias, setMidias] = useState(mockOccurrence.midias);

    // Estados dos Modais
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);

    // Estado temporário para o formulário de edição
    const [editForm, setEditForm] = useState({});

    // --- HANDLERS ---

    // Abrir modal de edição e carregar dados
    const handleOpenEdit = () => {
        setEditForm(occurrence);
        setShowEditModal(true);
    };

    // Salvar edição
    const handleSaveEdit = (e) => {
        e.preventDefault();
        setOccurrence(editForm);
        setShowEditModal(false);
        alert("Dados atualizados com sucesso!");
    };

    // Excluir mídia (Simulado)
    const handleDeleteMedia = (mediaId) => {
        if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
            setMidias(midias.filter(m => m.id !== mediaId));
        }
    };

    // Upload de mídia (Simulado)
    const handleUpload = () => {
        const novoArquivo = { 
            id: Date.now(), 
            type: 'image', 
            name: 'nova_foto_upload.jpg', 
            src: 'https://via.placeholder.com/150' 
        };
        setMidias([...midias, novoArquivo]);
        alert("Arquivo enviado com sucesso!");
    };

    return (
        <div className="dashboardContainer">
            <Sidebar />
            <main className={`mainContent grayBackground ${styles.mainContentOverride}`}>
                
                {/* Header Customizado */}
                <header className={`mainHeader ${styles.detailsHeader}`}>
                    <div className={styles.headerTitleGroup}>
                        <h1>Detalhes da Ocorrência</h1>
                        <h2 className={styles.occurrenceId}>{occurrence.id}</h2>
                    </div>
                    <div className="headerActions">
                        {/* Botão "Atualizar Status" REMOVIDO */}
                        <div className="userProfile">
                            <i className="fa-solid fa-bell"></i>
                            <span className="userGreet">Olá, Admin</span>
                        </div>
                    </div>
                </header>

                {/* Grid Principal */}
                <div className={styles.detailsGrid}>
                    
                    {/* Coluna da Esquerda */}
                    <div className={styles.detailsColLeft}>
                        
                        {/* Card Info Principal */}
                        <div className={`${styles.infoCard} ${styles.infoPrincipal}`}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px'}}>
                                <h3 style={{border: 'none', margin: 0, padding: 0}}>Informações Principais</h3>
                                <button onClick={handleOpenEdit} style={{border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '0.9rem'}}>
                                    <i className="fa-solid fa-pen"></i> Editar
                                </button>
                            </div>

                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Tipo:</span>
                                    <span className={styles.infoValue}>{occurrence.type}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Status:</span>
                                    <span className={styles.infoValue}>
                                        <span className={`${styles.statusDot} ${styles.statusAtendimento}`}></span>
                                        {occurrence.status}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Zona:</span>
                                    <span className={styles.infoValue}>{occurrence.zona}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Prioridade:</span>
                                    <span className={styles.infoValue}>{occurrence.prioridade}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Data/Hora:</span>
                                    <span className={styles.infoValue}>{occurrence.dataHora}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Solicitante:</span>
                                    <span className={styles.infoValue}>{occurrence.solicitante}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Localização */}
                        <div className={`${styles.infoCard} ${styles.cardLocalizacao}`}>
                            <div className={styles.cardHeader}>
                                <h3>Localização</h3>
                                <i className={`fa-solid fa-arrows-rotate ${styles.refreshIcon}`}></i>
                            </div>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3603071803923!2d-34.88245778921003!3d-8.064681991929543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18b991a6d277%3A0xda5638ae78a7fbdc!2sR.%20das%20Fl%C3%B4res%20-%20Santo%20Ant%C3%B4nio%2C%20Recife%20-%20PE%2C%2052021-210!5e0!3m2!1sen!2sbr!4v1761126336330!5m2!1sen!2sbr" 
                                width="100%" 
                                height="400"
                                style={{ border:0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                            <p className={styles.address}>
                                {occurrence.endereco}
                            </p>
                            <button className={styles.btnSecondary}>
                                <i className="fa-solid fa-file-lines"></i> Gerar Relatório Parcial
                            </button>
                        </div>
                    </div>

                    {/* Coluna da Direita */}
                    <div className={styles.detailsColRight}>
                        
                        {/* Card Mídias */}
                        <div className={styles.infoCard}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px'}}>
                                <h3 style={{border: 'none', margin: 0, padding: 0}}>Mídias e Anexos</h3>
                                <button onClick={() => setShowMediaModal(true)} style={{border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '0.9rem'}}>
                                    <i className="fa-solid fa-folder-open"></i> Gerenciar
                                </button>
                            </div>

                            <div className={styles.mediaGrid}>
                                {midias.slice(0, 4).map((media, index) => ( // Mostra apenas os 4 primeiros no card
                                    <div className={styles.mediaItem} key={index}>
                                        {media.type === 'image' || media.type === 'video' ? (
                                            <img src={media.src} alt={media.name} className={styles.mediaThumbnail} />
                                        ) : (
                                            <i className={`fa-solid ${media.icon} ${styles.mediaIcon} ${media.iconClass}`}></i>
                                        )}
                                        <span>{media.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Timeline */}
                        <div className={styles.infoCard}>
                            <h3>Timeline/Histórico de Ações</h3>
                            <ul className={styles.timelineList}>
                                {occurrence.historico.map((item, index) => {
                                    const parts = item.split(':');
                                    const time = parts[0];
                                    const action = parts.slice(1).join(':');
                                    return (
                                        <li key={index}>
                                            <strong>{time}:</strong>{action}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Ícone Flutuante */}
                <Link to="/" className={styles.floatingActionIcon} title="Voltar para Ocorrências">
                    <i className="fa-solid fa-arrow-left"></i>
                </Link>

                {/* --- MODAL DE EDIÇÃO DE DADOS --- */}
                {showEditModal && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3>Editar Informações</h3>
                            <form onSubmit={handleSaveEdit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <div style={formGroupStyle}>
                                    <label>Tipo:</label>
                                    <input value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label>Status:</label>
                                    <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                                        <option>Aberto</option>
                                        <option>Em Atendimento</option>
                                        <option>Concluído</option>
                                        <option>Cancelado</option>
                                    </select>
                                </div>
                                <div style={formGroupStyle}>
                                    <label>Zona:</label>
                                    <input value={editForm.zona} onChange={e => setEditForm({...editForm, zona: e.target.value})} />
                                </div>
                                <div style={formGroupStyle}>
                                    <label>Prioridade:</label>
                                    <select value={editForm.prioridade} onChange={e => setEditForm({...editForm, prioridade: e.target.value})}>
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                    </select>
                                </div>
                                <div style={modalActionsStyle}>
                                    <button type="button" onClick={() => setShowEditModal(false)} style={btnCancelStyle}>Cancelar</button>
                                    <button type="submit" style={btnSaveStyle}>Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MODAL DE GERENCIAMENTO DE MÍDIAS --- */}
                {showMediaModal && (
                    <div style={modalOverlayStyle}>
                        <div style={{...modalContentStyle, maxWidth: '800px', width: '90%'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                                <h3>Gerenciar Mídias</h3>
                                <button onClick={handleUpload} style={btnSaveStyle}>
                                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Novo Arquivo
                                </button>
                            </div>
                            
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', maxHeight: '400px', overflowY: 'auto'}}>
                                {midias.map((media) => (
                                    <div key={media.id} style={{border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center'}}>
                                        <div style={{height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', background: '#f9f9f9'}}>
                                            {media.type === 'image' || media.type === 'video' ? (
                                                <img src={media.src} alt={media.name} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                                            ) : (
                                                <i className={`fa-solid ${media.icon}`} style={{fontSize: '3rem', color: '#777'}}></i>
                                            )}
                                        </div>
                                        <p style={{fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{media.name}</p>
                                        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px'}}>
                                            <button title="Visualizar" style={{border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer'}}><i className="fa-solid fa-eye"></i></button>
                                            <button onClick={() => handleDeleteMedia(media.id)} title="Excluir" style={{border: 'none', background: 'none', color: '#e74c3c', cursor: 'pointer'}}><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{marginTop: '20px', textAlign: 'right'}}>
                                <button onClick={() => setShowMediaModal(false)} style={btnCancelStyle}>Fechar</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

// --- Estilos Inline para os Modais (Para não precisar mexer no CSS agora) ---
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalContentStyle = {
    background: 'white', padding: '25px', borderRadius: '10px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
};
const formGroupStyle = {
    display: 'flex', flexDirection: 'column', gap: '5px'
};
const modalActionsStyle = {
    display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px'
};
const btnSaveStyle = {
    padding: '10px 20px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
};
const btnCancelStyle = {
    padding: '10px 20px', background: '#f1f1f1', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer'
};

export default DetalhesOcorrencia;