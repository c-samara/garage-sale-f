import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import logo from '/img/logo.png';

export default function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.imgLogo} src={logo} alt="Logo" />

      <nav className={styles.nav}>
        <Link to="/">Início</Link>
        <Link to="/meus-eventos">Eventos</Link>
        <Link to="/meus-espacos">Espaços</Link>

        {/* Bloco com destaque, foto antes do nome */}
        <div className={styles.userInfo}>
          <img className={styles.userPhoto} src="/img/samara.jpeg" alt="Samara" />
          <span className={styles.userGreeting}>Bem-vinda, Samara!</span>
        </div>
      </nav>
    </header>
  );
}
