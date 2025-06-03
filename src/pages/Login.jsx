import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './Login.module.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    senha: '',
    nome: '',
    tipo: 'organizador' // 'organizador' ou 'proprietario'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login com:', form.email, form.senha);
      // Lógica de login seria implementada aqui
      alert('Login realizado com sucesso!');
    } else {
      console.log('Registro:', form);
      // Lógica de registro seria implementada aqui
      alert('Registro realizado com sucesso!');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h2>{isLogin ? 'Login' : 'Registro'}</h2>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={form.nome}
                onChange={handleChange}
                required={!isLogin}
              />
            )}
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            
            {!isLogin && (
              <div className={styles.radioGroup}>
                <p>Você é:</p>
                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="organizador"
                    checked={form.tipo === 'organizador'}
                    onChange={handleChange}
                  />
                  Organizador de eventos
                </label>
                <label>
                  <input
                    type="radio"
                    name="tipo"
                    value="proprietario"
                    checked={form.tipo === 'proprietario'}
                    onChange={handleChange}
                  />
                  Proprietário de espaço
                </label>
              </div>
            )}
            
            <button type="submit" className={styles.submitButton}>
              {isLogin ? 'Entrar' : 'Registrar'}
            </button>
          </form>
          
          <p className={styles.toggleText}>
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button 
              type="button" 
              className={styles.toggleButton} 
              onClick={toggleForm}
            >
              {isLogin ? 'Registre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
