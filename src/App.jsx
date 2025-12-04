// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Usuarios from './pages/Usuarios/Usuarios';
import Relatorios from './pages/Relatorios/Relatorios';
import DetalhesOcorrencia from './pages/DetalhesOcorrencia/DetalhesOcorrencia';
import Ocorrencias from './pages/Ocorrencias/Ocorrencias';
import Auditoria from './pages/Auditoria/Auditoria';
import Ajustes from './pages/Ajustes/Ajustes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login (Pode ser a inicial ou específica) */}
        <Route path="/login" element={<Login />} />
        {/* Rota base: Lista de Ocorrências */}
        <Route path="/" element={<Ocorrencias />} />
        
        {/* Rotas secundárias */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/ajustes" element={<Ajustes />} />

        <Route path="/ocorrencia/:id" element={<DetalhesOcorrencia />} />
        <Route path="/ocorrencia/:id/editar" element={<h1>Página de Edição (Em Breve)</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;