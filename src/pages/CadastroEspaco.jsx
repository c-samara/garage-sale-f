import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaCheckCircle } from "react-icons/fa";
import styles from './CadastroEspaco.module.css';

export default function CadastroEspaco() {
  const navigate = useNavigate();

  const blankEspaco = {
    host_id: 81,
    titulo: '',
    descricao: '',
    endereco: '',
    preco: '',
    capacidade: '',
    tags: [],
    imagemUrl: ''
  };

  const [currentEspaco, setCurrentEspaco] = useState(blankEspaco);
  const [tagOptions, setTagOptions] = useState([]);
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const [mostrarAlertaSucesso, setMostrarAlertaSucesso] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState('');

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/tags/');
        const data = await res.json();
        setTagOptions(data.items);
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

  const uploadParaImgur = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('https://cors-anywhere.herokuapp.com/https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID a32b7f3f56b55fb'
        },
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('Erro no Imgur, continuando sem imagem:', errorText);
        return '';
      }

      const data = await res.json();
      if (data.success) {
        return data.data.link;
      } else {
        console.warn('Imgur falhou, mas continuando sem imagem.');
        return '';
      }
    } catch (error) {
      console.warn('Erro ao enviar para Imgur, continuando sem imagem.', error);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagIds = currentEspaco.tags
      .map((tagName) => tagOptions.find((t) => t.name === tagName)?.id)
      .filter(Boolean);

    let imagemUrl = '';
    if (imagemArquivo) {
      imagemUrl = await uploadParaImgur(imagemArquivo);
    }

    const payload = {
      host_id: currentEspaco.host_id,
      title: currentEspaco.titulo,
      description: currentEspaco.descricao,
      address: currentEspaco.endereco,
      price: Number(currentEspaco.preco),
      capacity: currentEspaco.capacidade,
      tags: tagIds,
      imagens: imagemUrl ? [imagemUrl] : []
    };

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());
      setMensagemAlerta('Espaço cadastrado com sucesso!');
      setMostrarAlertaSucesso(true);
      setTimeout(() => {
        setMostrarAlertaSucesso(false);
        navigate('/meus-espacos');
      }, 2000);
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
                <label>Título do Espaço</label>
                <input type="text" name="titulo" value={currentEspaco.titulo} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Endereço</label>
                <input type="text" name="endereco" value={currentEspaco.endereco} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Capacidade</label>
                <input type="text" name="capacidade" value={currentEspaco.capacidade} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Preço (R$)</label>
                <input type="number" name="preco" value={currentEspaco.preco} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Descrição</label>
                <textarea name="descricao" value={currentEspaco.descricao} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Imagem do Espaço</label>
                <input type="file" accept="image/*" onChange={(e) => setImagemArquivo(e.target.files[0])} />
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
              <button type="submit" className={styles.saveButton}>Cadastrar</button>
              <button type="button" className={styles.cancelButton} onClick={() => navigate('/meus-espacos')}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
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
