import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { LuBadgeAlert } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import styles from './EventoDetalhes.module.css';

export default function EspacoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [espaco, setEspaco] = useState(null);
  const [tags, setTags] = useState(null);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [mostrarAlertaExclusao, setMostrarAlertaExclusao] = useState(false);
  const [mostrarAlertaSucessoExclusao, setMostrarAlertaSucessoExclusao] = useState(false);
  const [mostrarAlertaSucessoAtualizacao, setMostrarAlertaSucessoAtualizacao] = useState(false);

  useEffect(() => {
    async function buscarEspaco() {
      try {
        const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/spaces/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar evento');
        const dados = await res.json();
        const item = dados.items[0];
        setEspaco(item);
        setNovoNome(item.title);
        setNovaDescricao(item.description);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar os dados do evento.');
      }
    }

    const buscarTags = async () => {
      const response = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/tags/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setTags(data.items);
    };

    buscarEspaco();
    buscarTags();
  }, [id]);

  async function handleUpdate() {
    const tagsId = espaco.tags.split(',').map(tag => {
      const category = tags.find((cat) => cat.name.toLowerCase() === tag.trim().toLowerCase());
      return category?.id;
    });

    try {
      const payload = {
        host_id: espaco.host_id,
        title: novoNome,
        description: novaDescricao,
        address: espaco.address,
        price: espaco.price,
        capacity: espaco.capacity,
        tags: tagsId,
      };

      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/spaces/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setEspaco((prev) => ({ ...prev, title: novoNome, description: novaDescricao }));
      setEditando(false);
      setMostrarAlertaSucessoAtualizacao(true);
      setTimeout(() => setMostrarAlertaSucessoAtualizacao(false), 3000);
    } catch (err) {
      console.log(err);
      alert('Erro ao atualizar o espaço.');
    }
  }

  async function handleDelete() {
    setMostrarAlertaExclusao(true);
  }

  async function confirmarDelete() {
    setMostrarAlertaExclusao(false);
    try {
      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/spaces/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setMostrarAlertaSucessoExclusao(true);
      setTimeout(() => {
        navigate('/meus-espacos');
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar o espaço.');
    }
  }

  if (!espaco) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.detailsCard}>
          <h1>{espaco.title}</h1>
          <p><strong>Descrição:</strong> {espaco.description}</p>
          <p><strong>Endereço:</strong> {espaco.address}</p>
          <p><strong>Capacidade: </strong> {espaco.capacity}</p>
          <p><strong>Preço: </strong>R$ {espaco.price}/dia</p>
          <p><strong>Tags: </strong> {espaco.tags}</p>
          <p><strong>Informações do dono:</strong></p>
          <div className={styles.spaceDetailsCard}>
            <div>
              <strong>Nome:</strong> {espaco.host_name} {espaco.host_last_name}
            </div>
            <div>
              <strong>Telefone:</strong> {espaco.host_phone_number}
            </div>
            <div>
              <strong>E-mail:</strong> {espaco.host_email}
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.editButton} onClick={() => setEditando(true)}>Editar</button>
            <button className={styles.deleteButton} onClick={handleDelete}>Deletar</button>
            <button className={styles.returnButton} onClick={() => navigate('/meus-espacos')}>Voltar</button>
          </div>

          {editando && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2>Editar espaço</h2>
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

      {/* Modal de confirmação de exclusão */}
      {mostrarAlertaExclusao && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <LuBadgeAlert  size={120} color='red'/>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja deletar este espaço?</p>
            <div className={styles.alertButtons}>
              <button onClick={confirmarDelete}>Sim, deletar</button>
              <button onClick={() => setMostrarAlertaExclusao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de sucesso na exclusão */}
      {mostrarAlertaSucessoExclusao && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <FaCheckCircle size={120} color='green'/>
            <h2>Exclusão feita!</h2>
            <p>Espaço deletado com sucesso.</p>
          </div>
        </div>
      )}

      {/* Alerta de sucesso na atualização */}
      {mostrarAlertaSucessoAtualizacao && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <FaCheckCircle size={120} color='green'/>
            <h2>Atualizado!</h2>
            <p>Espaço atualizado com sucesso.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
