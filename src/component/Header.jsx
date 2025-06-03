import React from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();

    const handleLogin = () =>{
        navigate('/login');
    }
    return (

        <header className={styles.header}>

            <img className={styles.imgLogo} src="../public/img/logo.png"></img>
            <nav className={styles.nav}>
            <a href='#'>Início</a>
            <a href='#'>Meus eventos</a>
            <a href='#'>Eventos perto de mim</a>
            <a href='#'>Cadastrar meu espaço</a>
            <a href='#'>Meus espaços</a>
            <button className={styles.loginButton} onClick={handleLogin}>Login</button>


            </nav>

        </header>
    )
}