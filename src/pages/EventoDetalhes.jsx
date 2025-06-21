import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './EventoDetalhes.module.css';

export default function EventoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');

  useEffect(() => {
    async function buscarEvento() {
      try {
        const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar evento');
        const dados = await res.json();
        const item = dados.items[0];
        setEvento(item);
        setNovoNome(item.name);
        setNovaDescricao(item.description);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar os dados do evento.');
      }
    }
    buscarEvento();
  }, [id]);

  async function handleUpdate() {
    try {
      const payload = {
        owner_id: evento.owner_id,
        space_id: evento.space_id,
        name: novoNome,
        description: novaDescricao,
        product_categories: evento.product_category?.split(',').map((cat) => cat.trim()).map(() => 22), // substitua com lógica real se necessário
        event_date: evento.event_date,
        event_type: evento.event_type,
        begins_at: evento.begins_at,
        finishes_at: evento.finishes_at
      };

      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      alert('Evento atualizado com sucesso.');
      setEditando(false);
      setEvento((prev) => ({ ...prev, name: novoNome, description: novaDescricao }));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o evento.');
    }
  }

  async function handleDelete() {
    const confirmacao = window.confirm('Tem certeza que deseja deletar este evento?');
    if (!confirmacao) return;

    try {
      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      alert('Evento deletado com sucesso.');
      navigate('/meus-eventos');
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

          <div className={styles.buttonGroup}>
            <button className={styles.editButton} onClick={() => setEditando(true)}>Editar</button>
            <button className={styles.deleteButton} onClick={handleDelete}>Deletar</button>
          </div>

          {editando && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>Editar Evento</h2>
                <label>
                  Nome:
                  <input
                    className={styles.input}
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                </label>
                <label>
                  Descrição:
                  <textarea
                    className={styles.textarea}
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                  />
                </label>
                <div className={styles.buttonGroup}>
                  <button className={styles.saveButton} onClick={handleUpdate}>Salvar</button>
                  <button className={styles.cancelButton} onClick={() => setEditando(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
