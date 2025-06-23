import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaCheckCircle } from 'react-icons/fa';
import { LuBadgeAlert } from "react-icons/lu";
import styles from './EventoDetalhes.module.css';

export default function EventoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [categoriasOpcoes, setCategoriasOpcoes] = useState([]);
  const [espacoEvento, setEspacoEvento] = useState([]);
  const [mostrarAlertaSucesso, setMostrarAlertaSucesso] = useState(false);
  const [mostrarAlertaExclusao, setMostrarAlertaExclusao] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState(''); 
  
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

      const buscarCategorias = async() => {
       const response = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/product-categories/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await response.json();
      setCategoriasOpcoes(data.items);
    }

    buscarEvento();
    buscarCategorias();
  }, [id]);

  useEffect(() => {
  if (!evento?.space_id) return;

  async function buscarEspaco() {
    try {
      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/spaces/${evento.space_id}`);
      if (!res.ok) throw new Error('Erro ao buscar espaço');
      const data = await res.json();
      setEspacoEvento(data.items[0]);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar espaço do evento.');
    }
  }

  buscarEspaco();
}, [evento]);

  async function handleUpdate() {

    const categoriesIds = evento.product_category.split(',').map(nome => {
      const category = categoriasOpcoes.find((cat) => cat.name.toLowerCase() === nome.trim().toLowerCase());
      return category?.id;
    });
    
    try {
      const payload = {
        owner_id: evento.owner_id,
        space_id: evento.space_id,
        name: novoNome,
        description: novaDescricao,
        product_categories: categoriesIds,
        event_date: evento.event_date,
        event_type: evento.event_type,
        begins_at: evento.begins_at,
        finishes_at: evento.finishes_at
      };
      console.log(espacoEvento)


      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setMensagemAlerta('Evento atualizado com sucesso!');
      setMostrarAlertaSucesso(true);
      setTimeout(() => {
        setMostrarAlertaSucesso(false);
        setEditando(false);
        setEvento((prev) => ({ ...prev, name: novoNome, description: novaDescricao }));
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o evento.');
    }
  }

  async function handleDelete() {
    setMostrarAlertaExclusao(true);
  }
  
  async function confirmarDelete() {
    setMostrarAlertaExclusao(false);
    try {
      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/events/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setMensagemAlerta('Evento deletado com sucesso!');
      setMostrarAlertaSucesso(true);
      setTimeout(() => {
        setMostrarAlertaSucesso(false);
        navigate('/meus-eventos');
      }, 2000);
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
          <p><strong>Espaço:</strong></p>
          <div className={styles.spaceDetailsCard}>
            <h3>
                Título: {espacoEvento.title}
            </h3>
            <div>
                Descrição: {espacoEvento.description}
            </div>
          </div>

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

      {/* Alerta de confirmação de exclusão */}
      {mostrarAlertaExclusao && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <LuBadgeAlert size={120} color='red'/>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja deletar este evento?</p>
            <div className={styles.alertButtons}>
              <button onClick={confirmarDelete}>Sim, deletar</button>
              <button onClick={() => setMostrarAlertaExclusao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de sucesso */}
      {mostrarAlertaSucesso && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <FaCheckCircle size={120} color='green'/>
            <h2>Sucesso!</h2>
            <p>{mensagemAlerta}</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
