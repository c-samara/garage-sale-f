import React from "react";
import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© 2025 Garage Sale Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}