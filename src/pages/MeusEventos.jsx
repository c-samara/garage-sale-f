import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';      // ⇤️ novo
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaBan } from 'react-icons/fa';
import styles from './MeusEventos.module.css';

export default function MeusEventos() {
  const [eventos, setEventos] = useState([]);
  const [ordenacao, setOrdenacao] = useState('cadastro');
  const [mostrarAlertaLimite, setMostrarAlertaLimite] = useState(false);
  
  const LIMITE_EVENTOS = 5; // Constante para o limite de eventos por usuário

  /* ---------- CARREGAR EVENTOS ---------- */
  useEffect(() => {
    async function carregarEventos() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/events/');
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const dados = await res.json();

        // Apenas eventos do usuário (owner_id = 61) e sem duplicados
        const eventosDoUsuario = dados.items.filter(e => e.owner_id === 61);
        const eventosUnicos = Array.from(new Map(eventosDoUsuario.map(e => [e.id, e])).values());
        setEventos(eventosUnicos);
      } catch (err) {
        console.error('Erro:', err);
        alert('Falha ao carregar eventos.');
      }
    }
    carregarEventos();
  }, []);

  /* ---------- ORDENAR EVENTOS ---------- */
  const ordenarEventos = () => {
    const copia = [...eventos];
    return ordenacao === 'nome'
      ? copia.sort((a, b) => a.name.localeCompare(b.name))
      : copia.sort((a, b) => b.id - a.id);
  };

  /* ---------- UI ---------- */
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Meus Eventos</h1>

          <div>
            <select
              value={ordenacao}
              onChange={e => setOrdenacao(e.target.value)}
              className={styles.selectOrdenacao}
            >
              <option value="cadastro">Ordem de Cadastro</option>
              <option value="nome">Ordem Alfabética</option>
            </select>

            <button
              className={styles.novoEventoButton}
              onClick={() => {
                if (eventos.length >= LIMITE_EVENTOS) {
                  setMostrarAlertaLimite(true);
                } else {
                  window.location.href = '/cadastro-evento';
                }
              }}
            >
              + Novo Evento
            </button>
          </div>
        </div>

        {/* ---------- LISTA DE CARDS ---------- */}
        <div className={styles.cardsContainer}>
          {ordenarEventos().map(evento => (
            <Link
              key={evento.id}
              to={`/evento/${evento.id}`}          // ⬅️ abre página de detalhes
              className={styles.card}
            >
              <h2>{evento.name}</h2>
              <p><strong>Data:</strong> {evento.event_date}</p>
              <p><strong>Tipo:</strong> {evento.event_type}</p>
              <p><strong>Horário:</strong> {evento.begins_at} - {evento.finishes_at}</p>
              <p><strong>Categoria:</strong> {evento.product_category}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* Alerta de limite de eventos atingido */}
      {mostrarAlertaLimite && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <FaBan size={120} color='red'/>
            <h2>Limite de Eventos Atingido</h2>
            <p>Você já possui {eventos.length} eventos cadastrados. O limite é de {LIMITE_EVENTOS} eventos por usuário.</p>
            <p>Para cadastrar um novo evento, exclua algum dos eventos existentes.</p>
            <div className={styles.alertButtons}>
              <button onClick={() => setMostrarAlertaLimite(false)}>Entendi</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
