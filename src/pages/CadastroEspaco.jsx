import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './CadastroEspaco.module.css';

export default function CadastroEspaco() {
  const navigate = useNavigate();

  const blankEspaco = {
    host_id: 61,
    host_name: '',
    host_last_name: '',
    host_phone_number: '',
    host_email: '',
    host_cpf: '',
    titulo: '',
    descricao: '',
    endereco: '',
    preco: '',
    capacidade: '',
    tags: []
  };

  const [currentEspaco, setCurrentEspaco] = useState(blankEspaco);
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/tags/');
        const data = await res.json();
        setTagOptions(data.items); // deve conter { id, name }
      } catch {
        alert('Erro ao carregar tags');
      }
    }
    fetchTags();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

    if (name === 'tags') {
      setCurrentEspaco((prev) => ({
        ...prev,
        tags: checked
          ? [...prev.tags, value]
          : prev.tags.filter((t) => t !== value)
      }));
    } else {
      setCurrentEspaco((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte nomes de tags em IDs
    const tagIds = currentEspaco.tags
      .map((tagName) => tagOptions.find((t) => t.name === tagName)?.id)
      .filter(Boolean); // remove undefined

    const payload = {
      host_id: currentEspaco.host_id,
      title: currentEspaco.titulo,
      description: currentEspaco.descricao,
      address: currentEspaco.endereco,
      price: Number(currentEspaco.preco),
      capacity: currentEspaco.capacidade,
      tags: tagIds
    };

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());
      alert('Espaço cadastrado com sucesso!');
      navigate('/meus-espacos');
    } catch (err) {
      alert(`Erro ao cadastrar: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <h1>Cadastrar Novo Espaço</h1>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome do Host</label>
                <input
                  type="text"
                  name="host_name"
                  value={currentEspaco.host_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Sobrenome do Host</label>
                <input
                  type="text"
                  name="host_last_name"
                  value={currentEspaco.host_last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email do Host</label>
                <input
                  type="email"
                  name="host_email"
                  value={currentEspaco.host_email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone do Host</label>
                <input
                  type="text"
                  name="host_phone_number"
                  value={currentEspaco.host_phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>CPF do Host</label>
                <input
                  type="text"
                  name="host_cpf"
                  value={currentEspaco.host_cpf}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Título do Espaço</label>
                <input
                  type="text"
                  name="titulo"
                  value={currentEspaco.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={currentEspaco.endereco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Capacidade</label>
                <input
                  type="text"
                  name="capacidade"
                  value={currentEspaco.capacidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Preço (R$)</label>
                <input
                  type="number"
                  name="preco"
                  value={currentEspaco.preco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={currentEspaco.descricao}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <fieldset>
              <legend>Tags</legend>
              <div className={styles.tagsGrid}>
                {tagOptions.map((tag) => (
                  <label key={tag.id}>
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag.name}
                      checked={currentEspaco.tags.includes(tag.name)}
                      onChange={handleChange}
                    />{' '}
                    {tag.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>
                Cadastrar
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate('/meus-espacos')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
