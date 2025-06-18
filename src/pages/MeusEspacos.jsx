import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEspacos.module.css';

export default function MeusEspacos() {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEspaco, setSelectedEspaco] = useState(null);
  const [currentEspaco, setCurrentEspaco] = useState({
    nome: '',
    endereco: '',
    capacidade: '',
    preco: '',
    descricao: ''
  });

  const fetchEspacos = async () => {
    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/');
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();

      const adaptado = data.items.map((item) => ({
        id: item.id,
        nome: item.title,
        endereco: item.address,
        capacidade: item.capacity,
        preco: item.price,
        descricao: item.description,
        imagem: item.image_url || '/img/espaco-default.jpg',
        tags: item.tags
      }));

      setEspacos(adaptado);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspacos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEspaco((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const payload = {
      host_id: 63,
      title: currentEspaco.nome,
      description: currentEspaco.descricao,
      address: currentEspaco.endereco,
      price: parseFloat(currentEspaco.preco),
      capacity: currentEspaco.capacidade,
      tags: [22]
    };

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Erro ao cadastrar: ${res.status}`);

      alert('Espaço cadastrado!');
      setShowCreateModal(false);
      await fetchEspacos();
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const openDetails = (espaco) => {
    setSelectedEspaco(espaco);
    setShowDetailsModal(true);
  };

  const deleteEspaco = async (id) => {
    if (!window.confirm('Confirma exclusão deste espaço?')) return;

    try {
      const res = await fetch(
        `https://apex.oracle.com/pls/apex/garage_sale/api/spaces/${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error(`Erro ao deletar: ${res.status}`);

      alert('Excluído com sucesso!');
      setShowDetailsModal(false);
      await fetchEspacos();
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Meus Espaços</h1>
          <button
            className={styles.addButton}
            onClick={() => {
              setCurrentEspaco({ nome:'', endereco:'', capacidade:'', preco:'', descricao:'' });
              setShowCreateModal(true);
            }}
          >
            + Cadastrar Novo Espaço
          </button>
        </div>

        {loading ? (
          <p>Carregando…</p>
        ) : error ? (
          <p>Erro: {error}</p>
        ) : espacos.length ? (
          <div className={styles.espacosGrid}>
            {espacos.map((e) => (
              <div
                key={e.id}
                className={styles.espacoCard}
                onClick={() => openDetails(e)}
              >
                <img src={e.imagem} alt={e.nome} className={styles.cardImage}/>
                <div className={styles.espacoContent}>
                  <h2>{e.nome}</h2>
                  <p>{e.endereco}</p>
                  <div className={styles.espacoDetails}>
                    <span>Cap: {e.capacidade}</span>
                    <span>R$ {e.preco}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum espaço encontrado.</p>
        )}
      </main>

      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Novo Espaço</h2>
            <form onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input name="nome" value={currentEspaco.nome} onChange={handleChange} required/>
              </div>
              <div className={styles.formGroup}>
                <label>Endereço</label>
                <input name="endereco" value={currentEspaco.endereco} onChange={handleChange} required/>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Capacidade</label>
                  <input name="capacidade" value={currentEspaco.capacidade} onChange={handleChange} required/>
                </div>
                <div className={styles.formGroup}>
                  <label>Preço (R$)</label>
                  <input type="number" name="preco" value={currentEspaco.preco} onChange={handleChange} required/>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Descrição</label>
                <textarea name="descricao" rows="3" value={currentEspaco.descricao} onChange={handleChange} required/>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>Salvar</button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowCreateModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedEspaco && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.detailsHeader}>
              <img src={selectedEspaco.imagem} alt={selectedEspaco.nome} className={styles.headerImg}/>
              <button
                className={styles.trashButton}
                title="Excluir espaço"
                onClick={() => deleteEspaco(selectedEspaco.id)}
              >
                🗑️
              </button>
            </div>

            <div className={styles.detailsBody}>
              <h2>{selectedEspaco.nome}</h2>
              <p><strong>Endereço:</strong> {selectedEspaco.endereco}</p>
              <p><strong>Capacidade:</strong> {selectedEspaco.capacidade}</p>
              <p><strong>Preço:</strong> R$ {selectedEspaco.preco}</p>
              <p><strong>Descrição:</strong></p>
              <p>{selectedEspaco.descricao}</p>
            </div>

            <div className={styles.formActions}>
              <button className={styles.cancelButton} onClick={() => setShowDetailsModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
