import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './EventosProximos.module.css';

export default function EventosProximos() {
  // Estado para armazenar os eventos
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nome: 'Feira de Livros Usados',
      data: '2025-06-15',
      horario: '10:00 - 18:00',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo',
      distancia: 1.2,
      categorias: ['livros', 'artesanato'],
      imagem: '/img/evento1.jpg'
    },
    {
      id: 2,
      nome: 'Bazar de Roupas Vintage',
      data: '2025-06-22',
      horario: '09:00 - 17:00',
      endereco: 'Av. Paulista, 1000 - Vila Mariana, São Paulo',
      distancia: 2.5,
      categorias: ['roupas'],
      imagem: '/img/evento2.jpg'
    },
    {
      id: 3,
      nome: 'Feira de Eletrônicos',
      data: '2025-06-28',
      horario: '10:00 - 16:00',
      endereco: 'Rua Augusta, 500 - Consolação, São Paulo',
      distancia: 3.7,
      categorias: ['eletronicos'],
      imagem: '/img/evento3.jpg'
    },
    {
      id: 4,
      nome: 'Bazar de Móveis Antigos',
      data: '2025-07-05',
      horario: '09:00 - 19:00',
      endereco: 'Alameda Santos, 800 - Jardins, São Paulo',
      distancia: 4.1,
      categorias: ['moveis'],
      imagem: '/img/evento4.jpg'
    },
    {
      id: 5,
      nome: 'Feira de Artesanato Local',
      data: '2025-07-12',
      horario: '10:00 - 20:00',
      endereco: 'Rua Oscar Freire, 300 - Jardins, São Paulo',
      distancia: 5.3,
      categorias: ['artesanato'],
      imagem: '/img/evento5.jpg'
    }
  ]);

  // Estado para armazenar os filtros
  const [filtros, setFiltros] = useState({
    data: '',
    distanciaMaxima: 10,
    categorias: []
  });

  // Opções para categorias de produtos
  const categoriasOpcoes = [
    { id: 'roupas', nome: 'Roupas e Acessórios' },
    { id: 'livros', nome: 'Livros e Revistas' },
    { id: 'eletronicos', nome: 'Eletrônicos' },
    { id: 'moveis', nome: 'Móveis' },
    { id: 'brinquedos', nome: 'Brinquedos' },
    { id: 'artesanato', nome: 'Artesanato' },
    { id: 'outros', nome: 'Outros' }
  ];

  // Função para lidar com mudanças nos filtros
  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'categoria') {
      if (checked) {
        setFiltros({
          ...filtros,
          categorias: [...filtros.categorias, value]
        });
      } else {
        setFiltros({
          ...filtros,
          categorias: filtros.categorias.filter(cat => cat !== value)
        });
      }
    } else {
      setFiltros({
        ...filtros,
        [name]: value
      });
    }
  };

  // Função para filtrar eventos
  const filtrarEventos = () => {
    return eventos.filter(evento => {
      // Filtro por data
      if (filtros.data && evento.data !== filtros.data) {
        return false;
      }
      
      // Filtro por distância
      if (evento.distancia > filtros.distanciaMaxima) {
        return false;
      }
      
      // Filtro por categorias
      if (filtros.categorias.length > 0) {
        const temCategoria = evento.categorias.some(cat => 
          filtros.categorias.includes(cat)
        );
        if (!temCategoria) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Eventos filtrados
  const eventosFiltrados = filtrarEventos();

  // Função para formatar a data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para obter o nome da categoria
  const getNomeCategoria = (categoriaId) => {
    const categoria = categoriasOpcoes.find(cat => cat.id === categoriaId);
    return categoria ? categoria.nome : categoriaId;
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Eventos Próximos a Você</h1>
        </div>
        
        <div className={styles.content}>
          <aside className={styles.filtros}>
            <h2>Filtros</h2>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="data">Data</label>
              <input
                type="date"
                id="data"
                name="data"
                value={filtros.data}
                onChange={handleFiltroChange}
              />
            </div>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="distanciaMaxima">
                Distância máxima: {filtros.distanciaMaxima} km
              </label>
              <input
                type="range"
                id="distanciaMaxima"
                name="distanciaMaxima"
                min="1"
                max="50"
                value={filtros.distanciaMaxima}
                onChange={handleFiltroChange}
              />
            </div>
            
            <div className={styles.filtroGroup}>
              <label>Categorias</label>
              <div className={styles.categoriasList}>
                {categoriasOpcoes.map(categoria => (
                  <div key={categoria.id} className={styles.categoriaCheckbox}>
                    <input
                      type="checkbox"
                      id={`categoria-${categoria.id}`}
                      name="categoria"
                      value={categoria.id}
                      checked={filtros.categorias.includes(categoria.id)}
                      onChange={handleFiltroChange}
                    />
                    <label htmlFor={`categoria-${categoria.id}`}>{categoria.nome}</label>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          
          <section className={styles.eventosSection}>
            <div className={styles.mapaContainer}>
              <div className={styles.mapa}>
                <div className={styles.mapaPlaceholder}>
                  <p>Mapa interativo será exibido aqui</p>
                  <p>Encontrados {eventosFiltrados.length} eventos próximos a você</p>
                </div>
              </div>
            </div>
            
            <div className={styles.eventosLista}>
              <h2>Eventos Encontrados ({eventosFiltrados.length})</h2>
              
              {eventosFiltrados.length > 0 ? (
                <div className={styles.eventosGrid}>
                  {eventosFiltrados.map(evento => (
                    <div key={evento.id} className={styles.eventoCard}>
                      <div className={styles.eventoImageContainer}>
                        <img 
                          src={evento.imagem} 
                          alt={evento.nome} 
                          className={styles.eventoImage}
                        />
                      </div>
                      
                      <div className={styles.eventoContent}>
                        <h3>{evento.nome}</h3>
                        
                        <div className={styles.eventoInfo}>
                          <div className={styles.eventoInfoItem}>
                            <span className={styles.eventoInfoIcon}>📅</span>
                            <span>{formatarData(evento.data)}</span>
                          </div>
                          
                          <div className={styles.eventoInfoItem}>
                            <span className={styles.eventoInfoIcon}>⏰</span>
                            <span>{evento.horario}</span>
                          </div>
                          
                          <div className={styles.eventoInfoItem}>
                            <span className={styles.eventoInfoIcon}>📍</span>
                            <span>{evento.endereco}</span>
                          </div>
                          
                          <div className={styles.eventoInfoItem}>
                            <span className={styles.eventoInfoIcon}>🚶</span>
                            <span>{evento.distancia} km de você</span>
                          </div>
                        </div>
                        
                        <div className={styles.eventoCategorias}>
                          {evento.categorias.map(categoriaId => (
                            <span key={categoriaId} className={styles.categoriaTag}>
                              {getNomeCategoria(categoriaId)}
                            </span>
                          ))}
                        </div>
                        
                        <button className={styles.verDetalhesButton}>
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhum evento encontrado com os filtros selecionados.</p>
                  <p>Tente ajustar seus filtros para ver mais resultados.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
