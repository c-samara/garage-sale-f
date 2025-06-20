import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEventos.module.css';

export default function MeusEventos() {
  const [eventos, setEventos] = useState([]);
  const [ordenacao, setOrdenacao] = useState('cadastro');

  useEffect(() => {
    async function carregarEventos() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/events/');
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const dados = await res.json();
        const eventosDoUsuario = dados.items.filter((evento) => evento.owner_id === 61);
        const eventosUnicos = Array.from(new Map(eventosDoUsuario.map(e => [e.id, e])).values());
        setEventos(eventosUnicos);
      } catch (err) {
        console.error('Erro:', err);
        alert('Falha ao carregar eventos.');
      }
    }
    carregarEventos();
  }, []);

  const ordenarEventos = () => {
    const copia = [...eventos];
    if (ordenacao === 'nome') {
      return copia.sort((a, b) => a.name.localeCompare(b.name));
    }
    return copia.sort((a, b) => b.id - a.id);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Meus Eventos</h1>
          <div>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className={styles.selectOrdenacao}
            >
              <option value="cadastro">Ordem de Cadastro</option>
              <option value="nome">Ordem Alfabética</option>
            </select>
            <button 
              className={styles.novoEventoButton}
              onClick={() => window.location.href = '/cadastro-evento'}
            >
              + Novo Evento
            </button>
          </div>
        </div>

        <div className={styles.cardsContainer}>
          {ordenarEventos().map((evento) => (
            <div key={evento.id} className={styles.card}>
              <h2>{evento.name}</h2>
              <p><strong>Data:</strong> {evento.event_date}</p>
              <p><strong>Tipo:</strong> {evento.event_type}</p>
              <p><strong>Horário:</strong> {evento.begins_at} - {evento.finishes_at}</p>
              <p><strong>Categoria:</strong> {evento.product_category}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
