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

  /* ---------- CARREGA ESPAÇOS ---------- */
  useEffect(() => {
    async function fetchEspacos() {
      try {
        const res = await fetch(
          'https://apex.oracle.com/pls/apex/garage_sale/api/spaces/'
        );
        if (!res.ok) throw new Error('Erro ao carregar espaços');

        const data = await res.json();

        setEspacos(
          data.items.map((it) => ({
            id: it.id,
            nome: it.title,
            endereco: it.address,
            capacidade: it.capacity,
            preco: it.price,
            descricao: it.description,
            /*  👇 Converte string "tag1, tag2" em array ['tag1','tag2'] */
            tags:
              typeof it.tags === 'string'
                ? it.tags.split(',').map((tag) => tag.trim())
                : [],
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

          <button
            className={styles.saveButton}
            onClick={() => navigate('/meus-espacos/novo')}
          >
            + Novo Espaço
          </button>
        </div>

        {loading && <p>Carregando espaços…</p>}
        {error && <p className={styles.error}>⚠️ {error}</p>}

        {!loading && !error && (
          <div className={styles.espacosGrid}>
            {espacos.map((esp) => (
              <div key={esp.id} className={styles.espacoCard}>
                <h2>{esp.nome}</h2>

                <p>
                  <strong>Endereço:</strong> {esp.endereco || '—'}
                </p>

                <p>
                  <strong>Capacidade:</strong>{' '}
                  {esp.capacidade ? `${esp.capacidade} pessoas` : '—'}
                </p>

                <p>
                  <strong>Preço:</strong>{' '}
                  {esp.preco ? `R$ ${esp.preco}/dia` : '—'}
                </p>

                <p>
                  <strong>Tags:</strong>{' '}
                  {esp.tags.length ? esp.tags.join(', ') : '—'}
                </p>

                {esp.descricao && (
                  <p>
                    <strong>Descrição:</strong> {esp.descricao}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
