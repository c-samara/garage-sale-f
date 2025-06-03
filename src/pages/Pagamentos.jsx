import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './Pagamentos.module.css';

export default function Pagamentos() {
  // Estado para armazenar as transações
  const [transacoes, setTransacoes] = useState([
    {
      id: 1,
      tipo: 'entrada',
      descricao: 'Pagamento de evento: Feira de Livros Usados',
      valor: 750.00,
      data: '2025-06-01',
      status: 'concluido',
      metodoPagamento: 'cartao',
      evento: 'Feira de Livros Usados',
      comprovante: '#TX123456789'
    },
    {
      id: 2,
      tipo: 'saida',
      descricao: 'Aluguel de espaço: Salão Vila Mariana',
      valor: 350.00,
      data: '2025-06-02',
      status: 'concluido',
      metodoPagamento: 'pix',
      evento: 'Feira de Livros Usados',
      comprovante: '#TX987654321'
    },
    {
      id: 3,
      tipo: 'entrada',
      descricao: 'Pagamento de evento: Bazar de Roupas Vintage',
      valor: 500.00,
      data: '2025-06-15',
      status: 'pendente',
      metodoPagamento: 'boleto',
      evento: 'Bazar de Roupas Vintage',
      comprovante: '#TX456789123'
    },
    {
      id: 4,
      tipo: 'saida',
      descricao: 'Aluguel de equipamentos: 10 mesas e 20 cadeiras',
      valor: 200.00,
      data: '2025-06-15',
      status: 'pendente',
      metodoPagamento: 'pix',
      evento: 'Bazar de Roupas Vintage',
      comprovante: '#TX789123456'
    },
    {
      id: 5,
      tipo: 'entrada',
      descricao: 'Pagamento de evento: Feira de Eletrônicos',
      valor: 1280.00,
      data: '2025-04-28',
      status: 'concluido',
      metodoPagamento: 'cartao',
      evento: 'Feira de Eletrônicos',
      comprovante: '#TX234567891'
    }
  ]);

  // Estado para controlar o modal de detalhes
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  
  // Estado para controlar o modal de nova transação
  const [novaTransacaoModalAberto, setNovaTransacaoModalAberto] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({
    tipo: 'entrada',
    descricao: '',
    valor: '',
    data: '',
    metodoPagamento: 'pix',
    evento: ''
  });

  // Estado para controlar os filtros
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    status: 'todos',
    dataInicio: '',
    dataFim: '',
    evento: ''
  });

  // Função para abrir o modal de detalhes
  const abrirModal = (transacao) => {
    setTransacaoSelecionada(transacao);
    setModalAberto(true);
  };

  // Função para fechar o modal de detalhes
  const fecharModal = () => {
    setModalAberto(false);
    setTransacaoSelecionada(null);
  };

  // Função para abrir o modal de nova transação
  const abrirNovaTransacaoModal = () => {
    setNovaTransacaoModalAberto(true);
  };

  // Função para fechar o modal de nova transação
  const fecharNovaTransacaoModal = () => {
    setNovaTransacaoModalAberto(false);
    setNovaTransacao({
      tipo: 'entrada',
      descricao: '',
      valor: '',
      data: '',
      metodoPagamento: 'pix',
      evento: ''
    });
  };

  // Função para lidar com mudanças nos campos da nova transação
  const handleNovaTransacaoChange = (e) => {
    const { name, value } = e.target;
    setNovaTransacao({
      ...novaTransacao,
      [name]: name === 'valor' ? parseFloat(value) || '' : value
    });
  };

  // Função para adicionar nova transação
  const adicionarTransacao = (e) => {
    e.preventDefault();
    
    const novaTransacaoCompleta = {
      ...novaTransacao,
      id: transacoes.length + 1,
      status: 'pendente',
      comprovante: `#TX${Math.floor(Math.random() * 1000000000)}`
    };
    
    setTransacoes([...transacoes, novaTransacaoCompleta]);
    fecharNovaTransacaoModal();
  };

  // Função para lidar com mudanças nos filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  // Função para limpar os filtros
  const limparFiltros = () => {
    setFiltros({
      tipo: 'todos',
      status: 'todos',
      dataInicio: '',
      dataFim: '',
      evento: ''
    });
  };

  // Função para filtrar transações
  const filtrarTransacoes = () => {
    return transacoes.filter(transacao => {
      // Filtro por tipo
      if (filtros.tipo !== 'todos' && transacao.tipo !== filtros.tipo) {
        return false;
      }
      
      // Filtro por status
      if (filtros.status !== 'todos' && transacao.status !== filtros.status) {
        return false;
      }
      
      // Filtro por data de início
      if (filtros.dataInicio && new Date(transacao.data) < new Date(filtros.dataInicio)) {
        return false;
      }
      
      // Filtro por data de fim
      if (filtros.dataFim && new Date(transacao.data) > new Date(filtros.dataFim)) {
        return false;
      }
      
      // Filtro por evento
      if (filtros.evento && !transacao.evento.toLowerCase().includes(filtros.evento.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  // Transações filtradas
  const transacoesFiltradas = filtrarTransacoes();

  // Cálculo do saldo
  const calcularSaldo = () => {
    return transacoes.reduce((acc, transacao) => {
      if (transacao.tipo === 'entrada') {
        return acc + transacao.valor;
      } else {
        return acc - transacao.valor;
      }
    }, 0);
  };

  // Cálculo do total de entradas
  const calcularTotalEntradas = () => {
    return transacoes
      .filter(t => t.tipo === 'entrada')
      .reduce((acc, t) => acc + t.valor, 0);
  };

  // Cálculo do total de saídas
  const calcularTotalSaidas = () => {
    return transacoes
      .filter(t => t.tipo === 'saida')
      .reduce((acc, t) => acc + t.valor, 0);
  };

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
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para obter a classe CSS de acordo com o status
  const getStatusClass = (status) => {
    switch (status) {
      case 'concluido':
        return styles.statusConcluido;
      case 'pendente':
        return styles.statusPendente;
      case 'cancelado':
        return styles.statusCancelado;
      default:
        return '';
    }
  };

  // Função para obter a classe CSS de acordo com o tipo
  const getTipoClass = (tipo) => {
    return tipo === 'entrada' ? styles.tipoEntrada : styles.tipoSaida;
  };

  // Função para obter o texto do método de pagamento
  const getMetodoPagamentoText = (metodo) => {
    switch (metodo) {
      case 'pix':
        return 'PIX';
      case 'cartao':
        return 'Cartão de Crédito';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return metodo;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Pagamentos</h1>
          <button 
            className={styles.novaTransacaoButton}
            onClick={abrirNovaTransacaoModal}
          >
            + Nova Transação
          </button>
        </div>
        
        <div className={styles.resumoContainer}>
          <div className={styles.resumoCard}>
            <div className={styles.resumoTitulo}>Saldo Total</div>
            <div className={`${styles.resumoValor} ${calcularSaldo() >= 0 ? styles.saldoPositivo : styles.saldoNegativo}`}>
              {formatarMoeda(calcularSaldo())}
            </div>
          </div>
          
          <div className={styles.resumoCard}>
            <div className={styles.resumoTitulo}>Total de Entradas</div>
            <div className={`${styles.resumoValor} ${styles.entradaValor}`}>
              {formatarMoeda(calcularTotalEntradas())}
            </div>
          </div>
          
          <div className={styles.resumoCard}>
            <div className={styles.resumoTitulo}>Total de Saídas</div>
            <div className={`${styles.resumoValor} ${styles.saidaValor}`}>
              {formatarMoeda(calcularTotalSaidas())}
            </div>
          </div>
        </div>
        
        <div className={styles.filtrosContainer}>
          <h2>Filtros</h2>
          
          <div className={styles.filtrosForm}>
            <div className={styles.filtroGroup}>
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                name="tipo"
                value={filtros.tipo}
                onChange={handleFiltroChange}
                className={styles.select}
              >
                <option value="todos">Todos</option>
                <option value="entrada">Entradas</option>
                <option value="saida">Saídas</option>
              </select>
            </div>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={filtros.status}
                onChange={handleFiltroChange}
                className={styles.select}
              >
                <option value="todos">Todos</option>
                <option value="concluido">Concluído</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="dataInicio">Data Início</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={filtros.dataInicio}
                onChange={handleFiltroChange}
                className={styles.input}
              />
            </div>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="dataFim">Data Fim</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={filtros.dataFim}
                onChange={handleFiltroChange}
                className={styles.input}
              />
            </div>
            
            <div className={styles.filtroGroup}>
              <label htmlFor="evento">Evento</label>
              <input
                type="text"
                id="evento"
                name="evento"
                value={filtros.evento}
                onChange={handleFiltroChange}
                placeholder="Nome do evento"
                className={styles.input}
              />
            </div>
            
            <button 
              className={styles.limparFiltrosButton}
              onClick={limparFiltros}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
        
        <div className={styles.transacoesContainer}>
          <h2>Transações ({transacoesFiltradas.length})</h2>
          
          {transacoesFiltradas.length > 0 ? (
            <div className={styles.transacoesTable}>
              <div className={styles.tableHeader}>
                <div className={styles.thTipo}>Tipo</div>
                <div className={styles.thDescricao}>Descrição</div>
                <div className={styles.thValor}>Valor</div>
                <div className={styles.thData}>Data</div>
                <div className={styles.thStatus}>Status</div>
                <div className={styles.thAcoes}>Ações</div>
              </div>
              
              {transacoesFiltradas.map(transacao => (
                <div key={transacao.id} className={styles.tableRow}>
                  <div className={`${styles.tdTipo} ${getTipoClass(transacao.tipo)}`}>
                    {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </div>
                  <div className={styles.tdDescricao}>{transacao.descricao}</div>
                  <div className={styles.tdValor}>
                    <span className={transacao.tipo === 'entrada' ? styles.valorEntrada : styles.valorSaida}>
                      {formatarMoeda(transacao.valor)}
                    </span>
                  </div>
                  <div className={styles.tdData}>{formatarData(transacao.data)}</div>
                  <div className={styles.tdStatus}>
                    <span className={`${styles.statusBadge} ${getStatusClass(transacao.status)}`}>
                      {transacao.status === 'concluido' ? 'Concluído' : 
                       transacao.status === 'pendente' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </div>
                  <div className={styles.tdAcoes}>
                    <button 
                      className={styles.detalhesButton}
                      onClick={() => abrirModal(transacao)}
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Nenhuma transação encontrada com os filtros selecionados.</p>
              <p>Tente ajustar seus filtros para ver mais resultados.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal de Detalhes da Transação */}
      {modalAberto && transacaoSelecionada && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Detalhes da Transação</h2>
              <button 
                className={styles.fecharButton}
                onClick={fecharModal}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.transacaoDetalhes}>
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Tipo:</span>
                  <span className={`${styles.detalheValor} ${getTipoClass(transacaoSelecionada.tipo)}`}>
                    {transacaoSelecionada.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Descrição:</span>
                  <span className={styles.detalheValor}>{transacaoSelecionada.descricao}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Valor:</span>
                  <span className={`${styles.detalheValor} ${transacaoSelecionada.tipo === 'entrada' ? styles.valorEntrada : styles.valorSaida}`}>
                    {formatarMoeda(transacaoSelecionada.valor)}
                  </span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Data:</span>
                  <span className={styles.detalheValor}>{formatarData(transacaoSelecionada.data)}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Status:</span>
                  <span className={`${styles.detalheValor} ${getStatusClass(transacaoSelecionada.status)}`}>
                    {transacaoSelecionada.status === 'concluido' ? 'Concluído' : 
                     transacaoSelecionada.status === 'pendente' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Método de Pagamento:</span>
                  <span className={styles.detalheValor}>
                    {getMetodoPagamentoText(transacaoSelecionada.metodoPagamento)}
                  </span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Evento:</span>
                  <span className={styles.detalheValor}>{transacaoSelecionada.evento}</span>
                </div>
                
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Comprovante:</span>
                  <span className={styles.detalheValor}>{transacaoSelecionada.comprovante}</span>
                </div>
              </div>
              
              <div className={styles.comprovanteContainer}>
                <h3>Comprovante de Pagamento</h3>
                <div className={styles.comprovantePlaceholder}>
                  <p>Comprovante {transacaoSelecionada.comprovante}</p>
                  <p>Transação {transacaoSelecionada.status === 'concluido' ? 'confirmada' : 'pendente'}</p>
                  <p>Data: {formatarData(transacaoSelecionada.data)}</p>
                  <p>Valor: {formatarMoeda(transacaoSelecionada.valor)}</p>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              {transacaoSelecionada.status === 'pendente' && (
                <button className={styles.confirmarButton}>
                  Confirmar Pagamento
                </button>
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
      
      {/* Modal de Nova Transação */}
      {novaTransacaoModalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Nova Transação</h2>
              <button 
                className={styles.fecharButton}
                onClick={fecharNovaTransacaoModal}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={adicionarTransacao}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="tipo">Tipo de Transação</label>
                  <div className={styles.radioGroup}>
                    <div className={styles.radioOption}>
                      <input
                        type="radio"
                        id="tipoEntrada"
                        name="tipo"
                        value="entrada"
                        checked={novaTransacao.tipo === 'entrada'}
                        onChange={handleNovaTransacaoChange}
                      />
                      <label htmlFor="tipoEntrada">Entrada</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                      <input
                        type="radio"
                        id="tipoSaida"
                        name="tipo"
                        value="saida"
                        checked={novaTransacao.tipo === 'saida'}
                        onChange={handleNovaTransacaoChange}
                      />
                      <label htmlFor="tipoSaida">Saída</label>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="descricao">Descrição</label>
                  <input
                    type="text"
                    id="descricao"
                    name="descricao"
                    value={novaTransacao.descricao}
                    onChange={handleNovaTransacaoChange}
                    placeholder="Descreva a transação"
                    required
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="valor">Valor (R$)</label>
                  <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={novaTransacao.valor}
                    onChange={handleNovaTransacaoChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0.01"
                    required
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="data">Data</label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={novaTransacao.data}
                    onChange={handleNovaTransacaoChange}
                    required
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="metodoPagamento">Método de Pagamento</label>
                  <select
                    id="metodoPagamento"
                    name="metodoPagamento"
                    value={novaTransacao.metodoPagamento}
                    onChange={handleNovaTransacaoChange}
                    required
                    className={styles.select}
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="boleto">Boleto Bancário</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="evento">Evento Relacionado</label>
                  <input
                    type="text"
                    id="evento"
                    name="evento"
                    value={novaTransacao.evento}
                    onChange={handleNovaTransacaoChange}
                    placeholder="Nome do evento relacionado"
                    className={styles.input}
                  />
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button 
                  type="submit"
                  className={styles.salvarButton}
                >
                  Salvar Transação
                </button>
                
                <button 
                  type="button"
                  className={styles.fecharModalButton}
                  onClick={fecharNovaTransacaoModal}
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
