import React from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from '/img/logo.png';

export default function Header() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <img className={styles.imgLogo} src={logo} alt="Logo" />
      <nav className={styles.nav}>
        <Link to="/">Início</Link>
        <Link to="/meus-eventos">Meus eventos</Link>
        <Link to="/perto-de-mim">Eventos perto de mim</Link>
        <Link to="/cadastro">Cadastrar meu espaço</Link>
        <Link to="/meus-espacos">Meus espaços</Link>
        <button className={styles.loginButton} onClick={handleLogin}>Login</button>
      </nav>
    </header>
  );
}
