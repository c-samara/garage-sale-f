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
        <Link to="/meus-eventos">Eventos</Link>
        <Link to="/meus-espacos">Espaços</Link>
        <button className={styles.loginButton} onClick={handleLogin}>Login</button>
      </nav>
    </header>
  );
}
