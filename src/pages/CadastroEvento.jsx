import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './CadastroEvento.module.css';

export default function CadastroEvento() {
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    tipoEvento: 'venda_garagem',
    categorias: [],
    descricao: '',
    espacoId: '',
    imagens: []
  });

  const [imagemPreview, setImagemPreview] = useState(null);
  const [espacosDisponiveis, setEspacosDisponiveis] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const dadosFicticios = [
      { id: 1, nome: 'Salão Comunitário', endereco: 'Rua das Flores, 123 - Centro', preco: 150 },
      { id: 2, nome: 'Garagem Vila Mariana', endereco: 'Av. Paulista, 1000 - Vila Mariana', preco: 80 },
      { id: 3, nome: 'Espaço Cultural', endereco: 'Rua Augusta, 500 - Consolação', preco: 200 }
    ];
    setEspacosDisponiveis(dadosFicticios);
  }, []);

  const categoriasOpcoes = [
    { id: 'roupas', nome: 'Roupas e Acessórios' },
    { id: 'livros', nome: 'Livros e Revistas' },
    { id: 'eletronicos', nome: 'Eletrônicos' },
    { id: 'moveis', nome: 'Móveis' },
    { id: 'brinquedos', nome: 'Brinquedos' },
    { id: 'artesanato', nome: 'Artesanato' },
    { id: 'outros', nome: 'Outros' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoriaChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categorias: [...formData.categorias, value]
      });
    } else {
      setFormData({
        ...formData,
        categorias: formData.categorias.filter(cat => cat !== value)
      });
    }
  };

  const handleImagemChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSizeMB = 25;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    alert(`O tamanho da imagem excede o máximo permitido de ${maxSizeMB}MB.`);
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setImagemPreview(reader.result);
    setFormData({
      ...formData,
      imagens: [reader.result]
    });
  };
  reader.readAsDataURL(file);
};


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do evento:', formData);
    alert('Evento cadastrado com sucesso!');
  };

  const calcularPrecoTotal = () => {
    const espacoSelecionado = espacosDisponiveis.find(
      espaco => espaco.id === parseInt(formData.espacoId)
    );
    return espacoSelecionado ? espacoSelecionado.preco : 0;
  };

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const selecionarEspaco = (espacoId) => {
    setFormData({
      ...formData,
      espacoId: espacoId.toString()
    });
    fecharModal();
  };

  const espacoSelecionado = espacosDisponiveis.find(
    e => e.id === parseInt(formData.espacoId)
  );

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1>Cadastrar Novo Evento</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <section className={styles.formSection}>
              <h2>Informações Básicas</h2>

              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome do Evento</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Bazar de Livros Usados"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="data">Data</label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="horarioInicio">Horário de Início</label>
                  <input
                    type="time"
                    id="horarioInicio"
                    name="horarioInicio"
                    value={formData.horarioInicio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="horarioFim">Horário de Término</label>
                  <input
                    type="time"
                    id="horarioFim"
                    name="horarioFim"
                    value={formData.horarioFim}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tipoEvento">Tipo de Evento</label>
                <select
                  id="tipoEvento"
                  name="tipoEvento"
                  value={formData.tipoEvento}
                  onChange={handleChange}
                  required
                >
                  <option value="venda_garagem">Venda de Garagem</option>
                  <option value="bazar">Bazar</option>
                  <option value="feira">Feira</option>
                  <option value="troca">Evento de Troca</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="descricao">Descrição do Evento</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Descreva seu evento, o que será vendido, público-alvo, etc."
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imagem">Imagem do Evento</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                />
                {imagemPreview && (
                  <img
                    src={imagemPreview}
                    alt="Pré-visualização"
                    style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '8px' }}
                  />
                )}
              </div>
            </section>

            <section className={styles.formSection}>
              <h2>Categorias de Produtos</h2>
              <p className={styles.sectionDescription}>
                Selecione as categorias de produtos que estarão disponíveis no seu evento:
              </p>

              <div className={styles.categoriasGrid}>
                {categoriasOpcoes.map(categoria => (
                  <div key={categoria.id} className={styles.categoriaCheckbox}>
                    <input
                      type="checkbox"
                      id={`categoria-${categoria.id}`}
                      name="categorias"
                      value={categoria.id}
                      checked={formData.categorias.includes(categoria.id)}
                      onChange={handleCategoriaChange}
                    />
                    <label htmlFor={`categoria-${categoria.id}`}>{categoria.nome}</label>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.formSection}>
              <h2>Local do Evento</h2>
              <div className={styles.formGroup}>
                <button type="button" onClick={abrirModal} className={styles.selectButton}>
                  Selecionar Espaço
                </button>
                {espacoSelecionado && (
                  <p className={styles.espacoSelecionado}>
                    Espaço escolhido: <strong>{espacoSelecionado.nome}</strong> – {espacoSelecionado.endereco}
                  </p>
                )}
              </div>
            </section>

            <section className={styles.resumoSection}>
              <h2>Resumo do Pedido</h2>
              <div className={styles.resumoCard}>
                <div className={styles.resumoItem}>
                  <span>Aluguel do espaço:</span>
                  <span>
                    {espacoSelecionado ? `R$ ${espacoSelecionado.preco},00` : 'Selecione um espaço'}
                  </span>
                </div>

                <div className={styles.resumoTotal}>
                  <span>Total:</span>
                  <span>R$ {calcularPrecoTotal()},00</span>
                </div>
              </div>
            </section>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Cadastrar Evento
              </button>
            </div>
          </form>
        </div>
      </main>

      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Selecione um Espaço</h3>
              <button onClick={fecharModal} className={styles.fecharModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              {espacosDisponiveis.map(espaco => (
                <div key={espaco.id} className={styles.espacoItem}>
                  <p>
                    <strong>{espaco.nome}</strong> <br />
                    {espaco.endereco} <br />
                    R$ {espaco.preco},00 / dia
                  </p>
                  <button onClick={() => selecionarEspaco(espaco.id)}>
                    Selecionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
