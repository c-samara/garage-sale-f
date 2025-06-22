import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './CadastroEvento.module.css';

export default function CadastroEvento() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    tipoEvento: '',
    categorias: [],
    descricao: '',
    espacoId: ''
  });
  const [espacosDisponiveis, setEspacosDisponiveis] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriasOpcoes, setCategoriasOpcoes] = useState([]);

  useEffect(() => {

    const buscarEspacos = async() => {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/spaces/');
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const { items } = await res.json();
        setEspacosDisponiveis(
          items.map((it) => ({
            id: it.id,
            nome: it.title,
            descricao: it.description,
            endereco: it.address,
            preco: it.price
          }))
        );
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar espaços.');
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

    buscarCategorias();
    buscarEspacos();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

   const handleCategoriaChange = (e) => {
    const id = Number(e.target.value); 
    setFormData((prev) => {
      const selected = prev.categorias.includes(id);
      const newCategories = selected
        ? prev.categorias.filter((catId) => catId !== id)
        : [...prev.categorias, id];

      return {
        ...prev,
        categorias: newCategories,
      };
    });
  };


  const selecionarEspaco = (id) => {
    setFormData((p) => ({ ...p, espacoId: id.toString() }));
    setModalAberto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(espacosDisponiveis)

    // validações básicas
    if (!formData.nome || !formData.data || !formData.horarioInicio || !formData.horarioFim || !formData.tipoEvento || !formData.descricao) {
      return alert('Preencha todos os campos obrigatórios.');
    }

    if (!formData.espacoId || !espacosDisponiveis.some((esp) => esp.id === parseInt(formData.espacoId))) {
      return alert('Selecione um espaço válido antes de cadastrar.');
    }

    if (!formData.categorias.length) {
      return alert('Selecione ao menos uma categoria válida.');
    }

    const [ano, mes, dia] = formData.data.split('-');
    const payload = {
      owner_id: 61,
      space_id: parseInt(formData.espacoId, 10),
      name: formData.nome.trim(),
      description: formData.descricao.trim(),
      product_categories: formData.categorias,
      event_date: `${dia}/${mes}/${ano}`,
      event_type: formData.tipoEvento,
      begins_at: formData.horarioInicio,
      finishes_at: formData.horarioFim
    };

    console.log('Payload enviado:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/events/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        console.error('Erro:', erroTexto);
        return alert('Erro ao cadastrar evento.\n' + erroTexto);
      }

      alert('Evento cadastrado com sucesso!');
      navigate('/meus-eventos');
    } catch (err) {
      console.error(err);
      alert('Falha de conexão.');
    }
  };

  const espacoSelecionado = espacosDisponiveis.find((e) => e.id === +formData.espacoId);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Cadastrar Novo Evento</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Nome<input name="nome" value={formData.nome} onChange={handleChange} required /></label>
          <label>Data<input type="date" name="data" value={formData.data} onChange={handleChange} required /></label>
          <label>Início<input type="time" name="horarioInicio" value={formData.horarioInicio} onChange={handleChange} required /></label>
          <label>Fim<input type="time" name="horarioFim" value={formData.horarioFim} onChange={handleChange} required /></label>

          <label>Tipo
            <select name="tipoEvento" value={formData.tipoEvento} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Bazar">Bazar</option>
              <option value="Feira">Feira</option>
              <option value="Evento de trocas">Troca</option>
              <option value="Venda de garagem">Venda de Garagem</option>
            </select>
          </label>

          <button type="button" onClick={() => setModalAberto(true)}>Selecionar Espaço</button>
          {espacoSelecionado && <p>Espaço: <strong>{espacoSelecionado.nome}</strong></p>}

          <label>Descrição<textarea name="descricao" value={formData.descricao} onChange={handleChange} required /></label>

          <fieldset>
            <legend>Categorias</legend>
            <div className={styles.tagsGrid}>
              {categoriasOpcoes.map((categoria) => (
                <label key={categoria.id} className={styles.categoriaCheckbox}>
                  <input
                    type="checkbox"
                    value={categoria.id}
                    checked={formData.categorias.includes(categoria.id)}
                    onChange={handleCategoriaChange}
                  />{" "}
                  {categoria.name}
                </label>
              ))}
            </div>
          </fieldset>
          

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate('/meus-eventos')}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>Cadastrar Evento</button>
          </div>
        </form>
      </main>

      {modalAberto && (
        <div className={styles.modalOverlay}
        onClick={() => setModalAberto(false)}>
          
          <div className={styles.modalContent}
           onClick={(e) => e.stopPropagation()}>
            <h2>Escolher Espaço</h2>
            {espacosDisponiveis.map((esp) => (
            <div className={styles.spaceDetailsCard}>  
              <div key={esp.id}>
                <div><strong>Título: </strong>{esp.nome}</div>
                <div><strong>Endereço: </strong> {esp.endereco}</div>
                <div><strong>Preço: </strong> R$ {esp.preco},00</div>
                <div><strong>Descrição: </strong> {esp.descricao}</div>
                <button onClick={() => selecionarEspaco(esp.id)}>Selecionar</button>
              </div>
            </div> 
            ))}
            <button onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
