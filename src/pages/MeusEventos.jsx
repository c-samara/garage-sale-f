import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './MeusEventos.module.css';

export default function MeusEventos() {
  // Estado para armazenar os eventos do usuário
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nome: 'Feira de Livros Usados',
      data: '2025-06-15',
      horario: '10:00 - 18:00',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo',
      status: 'confirmado',
      participantes: 15,
      categorias: ['livros', 'artesanato']
    },
    {
      id: 2,
      nome: 'Bazar de Roupas Vintage',
      data: '2025-06-22',
      horario: '09:00 - 17:00',
      endereco: 'Av. Paulista, 1000 - Vila Mariana, São Paulo',
      status: 'pendente',
      participantes: 0,
      categorias: ['roupas']
    },
    {
      id: 3,
      nome: 'Feira de Eletrônicos',
      data: '2025-04-28',
      horario: '10:00 - 16:00',
      endereco: 'Rua Augusta, 500 - Consolação, São Paulo',
      status: 'concluido',
      categorias: ['eletronicos']
    }
  ]);

  // Estado para controlar o modal de detalhes
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Estado para controlar o filtro de status
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Estado para controlar a ordenação
  const [ordenacao, setOrdenacao] = useState('data-asc');

  // Função para abrir o modal de detalhes
  const abrirModal = (evento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };

  // Função para fechar o modal de detalhes
  const fecharModal = () => {
    setModalAberto(false);
    setEventoSelecionado(null);
  };

  // Função para cancelar um evento
  const cancelarEvento = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este evento?')) {
      setEventos(eventos.map(evento => 
        evento.id === id ? { ...evento, status: 'cancelado' } : evento
      ));
      fecharModal();
    }
  };

  // Função para editar um evento
  const editarEvento = (id) => {
    // Aqui redirecionaria para a página de edição do evento
    alert(`Redirecionando para edição do evento ${id}`);
  };

  // Função para filtrar eventos por status
  const filtrarEventos = () => {
    if (filtroStatus === 'todos') {
      return eventos;
    }
    return eventos.filter(evento => evento.status === filtroStatus);
  };

  // Função para ordenar eventos
  const ordenarEventos = (eventosParaOrdenar) => {
    return [...eventosParaOrdenar].sort((a, b) => {
      switch (ordenacao) {
        case 'data-asc':
          return new Date(a.data) - new Date(b.data);
        case 'data-desc':
          return new Date(b.data) - new Date(a.data);
        case 'nome-asc':
          return a.nome.localeCompare(b.nome);
        case 'nome-desc':
          return b.nome.localeCompare(a.nome);
        default:
          return 0;
      }
    });
  };

  // Eventos filtrados e ordenados
  const eventosFiltrados = ordenarEventos(filtrarEventos());

  // Função para formatar a data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para formatar moeda

  // Função para obter a classe CSS de acordo com o status
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmado':
        return styles.statusConfirmado;
      case 'pendente':
        return styles.statusPendente;
      case 'concluido':
        return styles.statusConcluido;
      case 'cancelado':
        return styles.statusCancelado;
      default:
        return '';
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Meus Eventos</h1>
          <button 
            className={styles.novoEventoButton}
            onClick={() => window.location.href = '/cadastro-evento'}
          >
            + Novo Evento
          </button>
        </div>
        
        <div className={styles.filtrosContainer}>
          <div className={styles.filtros}>
            <div className={styles.filtroGroup}>
              <label htmlFor="filtroStatus">Status:</label>
              <select
                id="filtroStatus"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className={styles.select}
              >
                <option value="todos">Todos</option>
                <option value="confirmado">Confirmados</option>
                <option value="pendente">Pendentes</option>
                <option value="concluido">Concluídos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="ordenacao">Ordenar por:</label>
              <select
                id="ordenacao"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className={styles.select}
              >
                <option value="data-asc">Data (mais próxima)</option>
                <option value="data-desc">Data (mais distante)</option>
                <option value="nome-asc">Nome (A-Z)</option>
                <option value="nome-desc">Nome (Z-A)</option>
              </select>
            </div>
          </div>
          
          <div className={styles.resultadoCount}>
            {eventosFiltrados.length} evento(s) encontrado(s)
          </div>
        </div>
        
        <div className={styles.eventosContainer}>
          {eventosFiltrados.length > 0 ? (
            <div className={styles.eventosTable}>
              <div className={styles.tableHeader}>
                <div className={styles.thNome}>Nome do Evento</div>
                <div className={styles.thData}>Data</div>
                <div className={styles.thLocal}>Local</div>
                <div className={styles.thStatus}>Status</div>
                <div className={styles.thParticipantes}>Participantes</div>
                <div className={styles.thAcoes}>Ações</div>
              </div>
              
              {eventosFiltrados.map(evento => (
                <div key={evento.id} className={styles.tableRow}>
                  <div className={styles.tdNome}>{evento.nome}</div>
                  <div className={styles.tdData}>{formatarData(evento.data)}</div>
                  <div className={styles.tdLocal}>{evento.endereco}</div>
                  <div className={styles.tdStatus}>
                    <span className={`${styles.statusBadge} ${getStatusClass(evento.status)}`}>
                      {getStatusText(evento.status)}
                    </span>
                  </div>
                  <div className={styles.tdParticipantes}>{evento.participantes}</div>
                  <div className={styles.tdAcoes}>
                    <button 
                      className={styles.detalhesButton}
                      onClick={() => abrirModal(evento)}
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Nenhum evento encontrado com os filtros selecionados.</p>
              <p>Crie um novo evento ou ajuste seus filtros para ver mais resultados.</p>
            </div>
          )}
        </div>
      </main>
      
      {modalAberto && eventoSelecionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Detalhes do Evento</h2>
              <button 
                className={styles.fecharButton}
                onClick={fecharModal}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.eventoDetalhes}>
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Nome:</span>
                  <span className={styles.detalheValor}>{eventoSelecionado.nome}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Data:</span>
                  <span className={styles.detalheValor}>{formatarData(eventoSelecionado.data)}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Horário:</span>
                  <span className={styles.detalheValor}>{eventoSelecionado.horario}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Local:</span>
                  <span className={styles.detalheValor}>{eventoSelecionado.endereco}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Status:</span>
                  <span className={`${styles.detalheValor} ${getStatusClass(eventoSelecionado.status)}`}>
                    {getStatusText(eventoSelecionado.status)}
                  </span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Participantes:</span>
                  <span className={styles.detalheValor}>{eventoSelecionado.participantes}</span>
                </div>
                
                
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Categorias:</span>
                  <div className={styles.categoriasList}>
                    {eventoSelecionado.categorias.map(categoria => (
                      <span key={categoria} className={styles.categoriaTag}>
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.estatisticas}>
                <h3>Estatísticas do Evento</h3>
                
                <div className={styles.estatisticasGrid}>
                  <div className={styles.estatisticaCard}>
                    <div className={styles.estatisticaValor}>{eventoSelecionado.participantes}</div>
                    <div className={styles.estatisticaLabel}>Participantes</div>
                  </div>
                  
                 
                  
                  <div className={styles.estatisticaCard}>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              {eventoSelecionado.status !== 'cancelado' && eventoSelecionado.status !== 'concluido' && (
                <>
                  <button 
                    className={styles.editarButton}
                    onClick={() => editarEvento(eventoSelecionado.id)}
                  >
                    Editar Evento
                  </button>
                  
                  <button 
                    className={styles.cancelarButton}
                    onClick={() => cancelarEvento(eventoSelecionado.id)}
                  >
                    Cancelar Evento
                  </button>
                </>
              )}
              
              <button 
                className={styles.fecharModalButton}
                onClick={fecharModal}
              >
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
