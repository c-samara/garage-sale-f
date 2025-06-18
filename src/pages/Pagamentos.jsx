import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEspacos.module.css';

export default function MeusEspacos() {
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const blankEspaco = {
  host_id: 61,
  host_last_name: '',
  host_phone_number: '',
  host_email: '',
  host_cpf: '',
  proprietario_nome: '',
  proprietario_telefone: '',
  proprietario_email: '',
  nome: '',
  descricao: '',
  endereco: '',
  preco: '',
  capacidade: '',
  tags: [],
  disponivel: true,
  imagens: []
};


  const [currentEspaco, setCurrentEspaco] = useState(blankEspaco);

  useEffect(() => {
    async function fetchData() {
      try {
        const [espacosRes, tagsRes] = await Promise.all([
          fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/'),
          fetch('https://apex.oracle.com/pls/apex/garage_sale/api/tags/')
        ]);

        if (!espacosRes.ok || !tagsRes.ok) throw new Error('Erro ao carregar dados');

        const espacosData = await espacosRes.json();
        const tagsData = await tagsRes.json();

        setEspacos(
          espacosData.items.map(it => ({
            id: it.id,
            nome: it.title,
            descricao: it.description,
            endereco: it.address,
            capacidade: it.capacity,
            preco: it.price,
            tags: Array.isArray(it.tags) ? it.tags : [],
            disponivel: true,
            imagens: ['/img/espaco-default.jpg']
          }))
        );

        setTagOptions(tagsData.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'tags') {
      const updatedTags = checked
        ? [...currentEspaco.tags, value]
        : currentEspaco.tags.filter(t => t !== value);
      setCurrentEspaco(prev => ({ ...prev, tags: updatedTags }));
    } else {
      setCurrentEspaco(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      host_id: currentEspaco.host_id,
      host_last_name: currentEspaco.host_last_name,
      host_phone_number: currentEspaco.host_phone_number,
      host_email: currentEspaco.host_email,
      host_cpf: currentEspaco.host_cpf,
      owner_name: currentEspaco.proprietario_nome,
      owner_phone: currentEspaco.proprietario_telefone,
      owner_email: currentEspaco.proprietario_email,
      title: currentEspaco.nome,
      description: currentEspaco.descricao,
      address: currentEspaco.endereco,
      price: Number(currentEspaco.preco),
      capacity: currentEspaco.capacidade,
      tags: currentEspaco.tags.join(', ')
    };

    console.log("Payload enviado:", payload);

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resultText = await res.text();
      if (!res.ok) throw new Error(`Erro ${res.status}: ${resultText}`);
      const novo = JSON.parse(resultText);

      const adaptado = {
        id: novo.id,
        nome: novo.title,
        descricao: novo.description,
        endereco: novo.address,
        capacidade: novo.capacity,
        preco: novo.price,
        tags: novo.tags,
        disponivel: true,
        imagens: ['/img/espaco-default.jpg']
      };

      setEspacos([...espacos, adaptado]);
      setShowModal(false);
    } catch (err) {
      alert(`Falha ao cadastrar: ${err.message}`);
    }
  };

  const handleOpenNewModal = () => {
    setCurrentEspaco(blankEspaco);
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Meus Espaços</h1>
          <button onClick={handleOpenNewModal}>+ Cadastrar Novo Espaço</button>
        </div>

        {loading ? (
          <p>Carregando espaços…</p>
        ) : error ? (
          <p className={styles.error}>⚠️ {error}</p>
        ) : (
          <div className={styles.espacosGrid}>
            {espacos.map((esp) => (
              <div key={esp.id} className={styles.espacoCard}>
                <img src={esp.imagens[0]} alt={esp.nome} />
                <h2>{esp.nome}</h2>
                <p>{esp.endereco}</p>
                <p>Capacidade: {esp.capacidade}</p>
                <p>Preço: R$ {esp.preco}/dia</p>
                <p>Tags: {esp.tags?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Cadastrar Novo Espaço</h2>
            <form onSubmit={handleSubmit}>
              <label>Nome
                <input type="text" name="nome" value={currentEspaco.nome} onChange={handleChange} required />
              </label>
              <label>Sobrenome do Host
                <input type="text" name="host_last_name" value={currentEspaco.host_last_name} onChange={handleChange} required />
              </label>
              <label>Email do Host
                <input type="email" name="host_email" value={currentEspaco.host_email} onChange={handleChange} required />
              </label>
              <label>Telefone do Host
                <input type="text" name="host_phone_number" value={currentEspaco.host_phone_number} onChange={handleChange} required />
              </label>
              <label>CPF do Host
                <input type="text" name="host_cpf" value={currentEspaco.host_cpf} onChange={handleChange} required />
              </label>
              <label>Nome do Proprietário
                <input type="text" name="proprietario_nome" value={currentEspaco.proprietario_nome} onChange={handleChange} required />
              </label>
              <label>Telefone do Proprietário
                <input type="text" name="proprietario_telefone" value={currentEspaco.proprietario_telefone} onChange={handleChange} required />
              </label>
              <label>Email do Proprietário
                <input type="email" name="proprietario_email" value={currentEspaco.proprietario_email} onChange={handleChange} required />
              </label>
              <label>Endereço
                <input type="text" name="endereco" value={currentEspaco.endereco} onChange={handleChange} required />
              </label>
              <label>Capacidade
                <input type="text" name="capacidade" value={currentEspaco.capacidade} onChange={handleChange} required />
              </label>
              <label>Preço (R$)
                <input type="number" name="preco" value={currentEspaco.preco} onChange={handleChange} required />
              </label>
              <label>Descrição
                <textarea name="descricao" value={currentEspaco.descricao} onChange={handleChange} required />
              </label>
              <fieldset>
                <legend>Tags</legend>
                {tagOptions.map(tag => (
                  <label key={tag.id}>
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag.name}
                      checked={currentEspaco.tags.includes(tag.name)}
                      onChange={handleChange}
                    /> {tag.name}
                  </label>
                ))}
              </fieldset>
              <button type="submit">Cadastrar</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
