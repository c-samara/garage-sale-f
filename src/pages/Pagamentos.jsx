import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEspacos.module.css';

export default function MeusEspacos() {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 👉 Carrega espaços já cadastrados
  useEffect(() => {
    async function fetchEspacos() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/');
        if (!res.ok) throw new Error('Erro ao carregar espaços');
        const data = await res.json();

        setEspacos(
          data.items.map((it) => ({
            id: it.id,
            nome: it.title,
            descricao: it.description,
            endereco: it.address,
            capacidade: it.capacity,
            preco: it.price,
            tags: Array.isArray(it.tags) ? it.tags : [],
            imagens: ['/img/espaco-default.jpg'],
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEspacos();
  }, []);

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Meus Espaços</h1>
          
        </div>

        {loading && <p>Carregando espaços…</p>}
        {error && <p className={styles.error}>⚠️ {error}</p>}

        {!loading && !error && (
          <div className={styles.espacosGrid}>
            {espacos.map((esp) => (
              <div key={esp.id} className={styles.espacoCard}>
                <img src={esp.imagens[0]} alt={esp.nome} />
                <h2>{esp.nome}</h2>
                <p>{esp.endereco}</p>
                <p>Capacidade: {esp.capacidade}</p>
                <p>Preço: R$ {esp.preco}/dia</p>
                <p>Tags: {esp.tags.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </main>
        <button onClick={() => navigate('/meus-espacos/novo')}>
            + Cadastrar Novo Espaço
          </button>
      <Footer />
    </div>
  );
}
