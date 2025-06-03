import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './Perfil.module.css';

export default function Perfil() {
  // Dados de exemplo do usuário - normalmente viriam de um contexto ou API
  const [userData, setUserData] = useState({
    nome: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefone: '(11) 98765-4321',
    tipo: 'organizador', // 'organizador' ou 'proprietario'
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    fotoPerfil: '/img/profile-placeholder.jpg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});

  // Dados de atividades do usuário - normalmente viriam de uma API
  const atividades = [
    { id: 1, tipo: 'evento', nome: 'Feira de Livros Usados', data: '15/06/2025', status: 'confirmado' },
    { id: 2, tipo: 'evento', nome: 'Bazar de Roupas Vintage', data: '22/06/2025', status: 'pendente' },
    { id: 3, tipo: 'espaco', nome: 'Salão Comunitário', data: '10/07/2025', status: 'alugado' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({...formData});
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.profileContainer}>
          <section className={styles.profileHeader}>
            <div className={styles.profileImageContainer}>
              <img 
                src={userData.fotoPerfil} 
                alt="Foto de perfil" 
                className={styles.profileImage} 
              />
            </div>
            <div className={styles.profileInfo}>
              <h1>{userData.nome}</h1>
              <p className={styles.userType}>
                {userData.tipo === 'organizador' ? 'Organizador de Eventos' : 'Proprietário de Espaço'}
              </p>
              {!isEditing && (
                <button 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </section>

          {isEditing ? (
            <section className={styles.editForm}>
              <h2>Editar Perfil</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveButton}>
                    Salvar Alterações
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => {
                      setFormData({...userData});
                      setIsEditing(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <section className={styles.profileDetails}>
              <h2>Informações Pessoais</h2>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email:</span>
                <span>{userData.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Telefone:</span>
                <span>{userData.telefone}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Endereço:</span>
                <span>{userData.endereco}</span>
              </div>
            </section>
          )}
          
          <section className={styles.activitySection}>
            <h2>Histórico de Atividades</h2>
            {atividades.length > 0 ? (
              <div className={styles.activityList}>
                {atividades.map((atividade) => (
                  <div key={atividade.id} className={styles.activityCard}>
                    <div className={styles.activityIcon}>
                      {atividade.tipo === 'evento' ? '🎪' : '🏠'}
                    </div>
                    <div className={styles.activityInfo}>
                      <h3>{atividade.nome}</h3>
                      <p>Data: {atividade.data}</p>
                      <span className={`${styles.status} ${styles[atividade.status]}`}>
                        {atividade.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Nenhuma atividade registrada.</p>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
