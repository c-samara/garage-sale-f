import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEspacos.module.css';
import { Link } from 'react-router-dom';

export default function MeusEspacos() {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEspacos() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/');
        if (!res.ok) throw new Error('Erro ao carregar espaços');
        const data = await res.json();

        setEspacos(data.items.map((it) => ({
          id: it.id,
          nome: it.title,
          endereco: it.address,
          capacidade: it.capacity,
          preco: it.price,
          descricao: it.description,
          tags: typeof it.tags === 'string' ? it.tags.split(',').map(tag => tag.trim()) : []
        })));
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
          <button className={styles.saveButton} onClick={() => navigate('/meus-espacos/novo')}>
            + Novo Espaço
          </button>
        </div>

        {loading && <p>Carregando espaços…</p>}
        {error && <p className={styles.error}>⚠️ {error}</p>}

        <div className={styles.espacosGrid}>
          {espacos.map((esp) => (
             <Link
                key={esp.id}
                to={`/espaco/${esp.id}`}
                className={styles.espacoCard}
              >
              <h2>{esp.nome}</h2>
              <p><strong>Endereço:</strong> {esp.endereco}</p>
              <p><strong>Capacidade:</strong> {esp.capacidade} pessoas</p>
              <p><strong>Preço:</strong> R$ {esp.preco}/dia</p>
              <p><strong>Tags:</strong> {esp.tags.join(', ')}</p>
              <p className={styles.espacoDescricao}><strong>Descrição:</strong> {esp.descricao}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
