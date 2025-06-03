import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEspacos.module.css';

export default function MeusEspacos() {
  // Estado para armazenar a lista de espaços
  const [espacos, setEspacos] = useState([
    {
      id: 1,
      nome: 'Salão Comunitário',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo',
      tamanho: '80m²',
      preco: 150.00,
      disponivel: true,
      imagens: ['/img/espaco1-1.jpg', '/img/espaco1-2.jpg'],
      descricao: 'Espaço amplo e arejado, ideal para pequenos eventos e bazares.'
    },
    {
      id: 2,
      nome: 'Garagem Vila Mariana',
      endereco: 'Av. Paulista, 1000 - Vila Mariana, São Paulo',
      tamanho: '40m²',
      preco: 80.00,
      disponivel: false,
      imagens: ['/img/espaco2-1.jpg'],
      descricao: 'Garagem coberta com acesso fácil, perfeita para pequenas vendas.'
    }
  ]);

  // Estado para controlar o modal de cadastro/edição
  const [showModal, setShowModal] = useState(false);
  const [currentEspaco, setCurrentEspaco] = useState({
    nome: '',
    endereco: '',
    tamanho: '',
    preco: '',
    disponivel: true,
    imagens: [],
    descricao: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Função para abrir o modal de cadastro
  const handleOpenNewModal = () => {
    setCurrentEspaco({
      nome: '',
      endereco: '',
      tamanho: '',
      preco: '',
      disponivel: true,
      imagens: [],
      descricao: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Função para abrir o modal de edição
  const handleOpenEditModal = (espaco) => {
    setCurrentEspaco({...espaco});
    setIsEditing(true);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEspaco({
      ...currentEspaco,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Atualizar espaço existente
      setEspacos(espacos.map(espaco => 
        espaco.id === currentEspaco.id ? {...currentEspaco} : espaco
      ));
      alert('Espaço atualizado com sucesso!');
    } else {
      // Adicionar novo espaço
      const newEspaco = {
        ...currentEspaco,
        id: Date.now(), // ID temporário
        imagens: ['/img/espaco-default.jpg'] // Imagem padrão
      };
      setEspacos([...espacos, newEspaco]);
      alert('Espaço cadastrado com sucesso!');
    }
    
    setShowModal(false);
  };

  // Função para remover um espaço
  const handleRemoveEspaco = (id) => {
    if (window.confirm('Tem certeza que deseja remover este espaço?')) {
      setEspacos(espacos.filter(espaco => espaco.id !== id));
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
            onClick={handleOpenNewModal}
          >
            + Cadastrar Novo Espaço
          </button>
        </div>
        
        {espacos.length > 0 ? (
          <div className={styles.espacosGrid}>
            {espacos.map((espaco) => (
              <div key={espaco.id} className={styles.espacoCard}>
                <div className={styles.espacoImageContainer}>
                  <img 
                    src={espaco.imagens[0]} 
                    alt={espaco.nome} 
                    className={styles.espacoImage}
                  />
                  <span className={`${styles.statusBadge} ${espaco.disponivel ? styles.disponivel : styles.indisponivel}`}>
                    {espaco.disponivel ? 'Disponível' : 'Alugado'}
                  </span>
                </div>
                
                <div className={styles.espacoContent}>
                  <h2>{espaco.nome}</h2>
                  <p className={styles.espacoEndereco}>{espaco.endereco}</p>
                  <div className={styles.espacoDetails}>
                    <span>Tamanho: {espaco.tamanho}</span>
                    <span>Preço: R$ {espaco.preco}/dia</span>
                  </div>
                  <p className={styles.espacoDescricao}>{espaco.descricao}</p>
                  
                  <div className={styles.espacoActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleOpenEditModal(espaco)}
                    >
                      Editar
                    </button>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveEspaco(espaco.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Você ainda não possui espaços cadastrados.</p>
            <p>Clique em "Cadastrar Novo Espaço" para começar.</p>
          </div>
        )}
      </main>
      
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{isEditing ? 'Editar Espaço' : 'Cadastrar Novo Espaço'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome do Espaço</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={currentEspaco.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="endereco">Endereço Completo</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={currentEspaco.endereco}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tamanho">Tamanho (m²)</label>
                  <input
                    type="text"
                    id="tamanho"
                    name="tamanho"
                    value={currentEspaco.tamanho}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="preco">Preço por Dia (R$)</label>
                  <input
                    type="number"
                    id="preco"
                    name="preco"
                    min="0"
                    step="0.01"
                    value={currentEspaco.preco}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={currentEspaco.descricao}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className={styles.formCheckbox}>
                <input
                  type="checkbox"
                  id="disponivel"
                  name="disponivel"
                  checked={currentEspaco.disponivel}
                  onChange={handleChange}
                />
                <label htmlFor="disponivel">Disponível para aluguel</label>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Espaço'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
