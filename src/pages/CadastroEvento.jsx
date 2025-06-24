import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './CadastroEvento.module.css';
import { FaCheckCircle } from "react-icons/fa";

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
  const [erros, setErros] = useState({});
  const [mostrarAlertaSucesso, setMostrarAlertaSucesso] = useState(false);

  useEffect(() => {
    const buscarEspacos = async () => {
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
    };

    const buscarCategorias = async () => {
      const response = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/product-categories/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      setCategoriasOpcoes(data.items);
    };

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
    const novosErros = {};

    if (!formData.nome) novosErros.nome = 'Nome é obrigatório.';
    if (!formData.data) novosErros.data = 'Data é obrigatória.';
    if (!formData.horarioInicio) novosErros.horarioInicio = 'Horário de início é obrigatório.';
    if (!formData.horarioFim) novosErros.horarioFim = 'Horário de fim é obrigatório.';
    if (!formData.tipoEvento) novosErros.tipoEvento = 'Tipo de evento é obrigatório.';
    if (!formData.descricao) novosErros.descricao = 'Descrição é obrigatória.';

    const hoje = new Date();
    const dataEvento = new Date(formData.data + 'T00:00:00');

    if (formData.data && dataEvento < new Date(hoje.toDateString())) {
      novosErros.data = 'A data do evento não pode ser anterior à data atual.';
    }

    if (formData.horarioInicio && formData.horarioFim) {
      const inicio = new Date(`${formData.data}T${formData.horarioInicio}`);
      const fim = new Date(`${formData.data}T${formData.horarioFim}`);
      if (fim <= inicio) {
        novosErros.horarioFim = 'O horário de término deve ser maior que o de início.';
      }
    }

    if (!formData.espacoId || !espacosDisponiveis.some((esp) => esp.id === parseInt(formData.espacoId))) {
      novosErros.espacoId = 'Selecione um espaço válido.';
    }

    if (!formData.categorias.length) {
      novosErros.categorias = 'Selecione ao menos uma categoria.';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({}); // limpa os erros

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

    try {
      const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/events/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        return setErros({ geral: 'Erro ao cadastrar evento: ' + erroTexto });
      }
      setMostrarAlertaSucesso(true);
      setTimeout(() => {
        navigate('/meus-eventos');
      }, 3000); // redireciona após 3 segundos

    } catch (err) {
      console.error(err);
      setErros({ geral: 'Falha de conexão com o servidor.' });
    }
  };

  const espacoSelecionado = espacosDisponiveis.find((e) => e.id === +formData.espacoId);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Cadastrar Novo Evento</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Nome
            <input name="nome" value={formData.nome} onChange={handleChange} />
          </label>
          {erros.nome && <p className={styles.erro}>{erros.nome}</p>}

          <label>
            Data
            <input type="date" name="data" value={formData.data} onChange={handleChange} />
          </label>
          {erros.data && <p className={styles.erro}>{erros.data}</p>}

          <label>
            Início
            <input type="time" name="horarioInicio" value={formData.horarioInicio} onChange={handleChange} />
          </label>
          {erros.horarioInicio && <p className={styles.erro}>{erros.horarioInicio}</p>}

          <label>
            Fim
            <input type="time" name="horarioFim" value={formData.horarioFim} onChange={handleChange} />
          </label>
          {erros.horarioFim && <p className={styles.erro}>{erros.horarioFim}</p>}

          <label>
            Tipo
            <select name="tipoEvento" value={formData.tipoEvento} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Bazar">Bazar</option>
              <option value="Feira">Feira</option>
              <option value="Evento de trocas">Troca</option>
              <option value="Venda de garagem">Venda de Garagem</option>
            </select>
          </label>
          {erros.tipoEvento && <p className={styles.erro}>{erros.tipoEvento}</p>}

          <div className={styles.espacoSelecionado}>
            <button type="button" onClick={() => setModalAberto(true)}>Selecionar Espaço</button>
            {formData.espacoId && espacoSelecionado && (
              <div className={styles.spaceSummary}>
                <p><strong>Espaço Selecionado:</strong></p>
                <p><strong>Nome:</strong> {espacoSelecionado.nome}</p>
                <p><strong>Endereço:</strong> {espacoSelecionado.endereco}</p>
                <p><strong>Preço:</strong> R$ {espacoSelecionado.preco},00</p>
                <p><strong>Descrição:</strong> {espacoSelecionado.descricao}</p>
              </div>
            )}
            {erros.espacoId && <p className={styles.erro}>{erros.espacoId}</p>}
          </div>
          <label>
            Descrição
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} />
          </label>
          {erros.descricao && <p className={styles.erro}>{erros.descricao}</p>}

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
          {erros.categorias && <p className={styles.erro}>{erros.categorias}</p>}

          {erros.geral && <p className={styles.erro}>{erros.geral}</p>}

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
        <div className={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Escolher Espaço</h2>
            {espacosDisponiveis.map((esp) => (
              <div key={esp.id} className={styles.spaceDetailsCard}>
                <div>
                  <div><strong>Título: </strong>{esp.nome}</div>
                  <div><strong>Endereço: </strong>{esp.endereco}</div>
                  <div><strong>Preço: </strong>R$ {esp.preco},00</div>
                  <div><strong>Descrição: </strong>{esp.descricao}</div>
                  <button onClick={() => selecionarEspaco(esp.id)}>Selecionar</button>
                </div>
              </div>
            ))}
            <button onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}
      {mostrarAlertaSucesso && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <FaCheckCircle  size={120} color='green'/>
            <h2>Parabéns!</h2>
            <p>Evento cadastrado com sucesso !!!</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
