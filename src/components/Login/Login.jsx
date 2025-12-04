// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  
  const navigate = useNavigate(); // Hook de navegação

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // AQUI VIRIA A LÓGICA DE AUTENTICAÇÃO COM O BACK-END (API)
    // Por enquanto, vamos simular que deu certo e redirecionar:
    console.log('Login efetuado:', { email, senha, lembrar });
    
    // Redireciona para a página inicial (Ocorrências)
    navigate('/'); 
  };

  const Logo = (
    <div className={styles.logoContainer}>
      {/* Imagem do logo (Brasão) */}
      <img 
        src="https://i.postimg.cc/28YgB6z9/Gemini-Generated-Image-tr1uhatr1uhatr1u-8.png" 
        alt="Brasão Guardião 360"
        style={{ width: '200px', height: 'auto', marginBottom: '10px' }} // Estilo inline para ajuste rápido
      />
      <h1 className={styles.tituloGuardiao}>GUARDIÃO 360°</h1>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2>FAÇA LOGIN</h2>
        <p className={styles.acessoRestrito}>ACESSO RESTRITO: GESTÃO INTERNA</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Email ou matrícula</label>
          <input
            id="email"
            type="text"
            placeholder="seu.email@cbm.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.inputField}
          />

          <div className={styles.lembrarMe}>
            <input
              id="lembrar"
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
            />
            <label htmlFor="lembrar">LEMBRAR-ME</label>
          </div>

          <button type="submit" className={styles.botaoEntrar}>
            ENTRAR
          </button>

          <a href="#" className={styles.linkEsqueciSenha}>
            Esqueceu a Senha?
          </a>
        </form>
      </div>

      {Logo}
    </div>
  );
}

export default Login;