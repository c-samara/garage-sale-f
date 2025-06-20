import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './EventoDetalhes.module.css';

export default function EventoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    async function buscarEvento() {
      try {
        const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar evento');
        const dados = await res.json();
        setEvento(dados.items[0]);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar os dados do evento.');
      }
    }

    buscarEvento();
  }, [id]);

  async function handleDelete() {
    const confirmacao = window.confirm('Tem certeza que deseja deletar este evento?');
    if (!confirmacao) return;

    try {
      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      alert('Evento deletado com sucesso.');
      navigate('/meus-eventos'); // redireciona após deletar
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar o evento.');
    }
  }

  if (!evento) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.detailsCard}>
          <h1>{evento.name}</h1>
          <p><strong>Data:</strong> {evento.event_date}</p>
          <p><strong>Horário:</strong> {evento.begins_at} - {evento.finishes_at}</p>
          <p><strong>Tipo:</strong> {evento.event_type}</p>
          <p><strong>Categoria:</strong> {evento.product_category}</p>
          <p><strong>Descrição:</strong> {evento.description}</p>
          <p><strong>Espaço:</strong> {evento.space_title}</p>

          <button className={styles.deleteButton} onClick={handleDelete}>
            Deletar Evento
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
