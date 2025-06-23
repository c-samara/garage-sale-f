import React from "react";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import logo from '/img/logo.png';
import { BsFillSuitDiamondFill } from "react-icons/bs";

export default function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.imgLogo} src={logo} alt="Logo" />

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? styles.activeLink : undefined}
        >
          Início
        </NavLink>

        <NavLink
          to="/meus-eventos"
          className={({ isActive }) => isActive ? styles.activeLink : undefined}
        >
          Eventos
        </NavLink>

        <NavLink
          to="/meus-espacos"
          className={({ isActive }) => isActive ? styles.activeLink : undefined}
        >
          Espaços
        </NavLink>

        {/* Bloco com destaque, foto antes do nome */}
        <div className={styles.userInfo}>
          <img className={styles.userPhoto} src="/img/samara.jpeg" alt="Samara" />
          <div className={styles.userText}>
            <span className={styles.userGreeting}>Bem-vinda, Samara!</span>
            <p className={styles.userPlan}>
              <BsFillSuitDiamondFill size={10} color="green" /> Plano Básico
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
