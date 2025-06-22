import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './EventoDetalhes.module.css';

export default function EspacoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [espaco, setEspaco] = useState(null);
  const [tags, setTags] = useState(null);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  
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

    const buscarTags = async() => {
       const response = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/tags/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await response.json();
      setTags(data.items);
    }

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      alert('Espaço atualizado com sucesso.');
      setEspaco((prev) => ({ ...prev, title: novoNome, description: novaDescricao }));
      setEditando(false);
    } catch (err) {
      console.log(err);
      alert('Erro ao atualizar o espaço.');
    }
  }

  async function handleDelete() {
    const confirmacao = window.confirm('Tem certeza que deseja deletar este espaço?');
    if (!confirmacao) return;

    try {
      const res = await fetch(`https://apex.oracle.com/pls/apex/garage_sale/api/spaces/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      alert('Espaco deletado com sucesso.');
      navigate('/meus-espacos');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar o espaco.');
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

      <Footer />
    </div>
  );
}
