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
    tipoEvento: 'venda_garagem',
    categorias: [],
    descricao: '',
    espacoId: '',
    imagens: []
  });

  const [imagemPreview, setImagemPreview] = useState(null);
  const [espacosDisponiveis, setEspacosDisponiveis] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para feedback visual
  const [feedback, setFeedback] = useState({
    mostrar: false,
    tipo: '', // 'sucesso' ou 'erro'
    mensagem: ''
  });
  
  // Estados para consulta de eventos existentes
  const [eventosExistentes, setEventosExistentes] = useState([]);
  const [formatosExistentes, setFormatosExistentes] = useState(null);

  useEffect(() => {
    const dadosFicticios = [
      { id: 1, nome: 'Salão Comunitário', endereco: 'Rua das Flores, 123 - Centro', preco: 150 },
      { id: 2, nome: 'Garagem Vila Mariana', endereco: 'Av. Paulista, 1000 - Vila Mariana', preco: 80 },
      { id: 3, nome: 'Espaço Cultural', endereco: 'Rua Augusta, 500 - Consolação', preco: 200 }
    ];
    setEspacosDisponiveis(dadosFicticios);
    
    buscarEventos();
    buscarMetadados();
  }, []);

  // Função para buscar eventos existentes e analisar formatos
  const buscarEventos = async () => {
    try {
      console.log("Buscando eventos existentes para analisar formatos...");
      const response = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/events/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEventosExistentes(data);
        console.log("Eventos recuperados:", data);
        
        // Verificar se há eventos para analisar formatos
        if (data && data.items && data.items.length > 0) {
          const formatos = {
            event_date: data.items[0].event_date,
            begins_at: data.items[0].begins_at,
            finishes_at: data.items[0].finishes_at
          };
          
          setFormatosExistentes(formatos);
          console.log("Formatos identificados dos eventos existentes:", formatos);
        } else {
          console.log("Nenhum evento encontrado para análise.");
        }
      } else {
        console.error("Erro ao buscar eventos:", response.status);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos existentes:", error);
    }
  };
  
  // Função para buscar metadados do endpoint para descobrir o formato esperado
  const buscarMetadados = async () => {
    try {
      console.log("Buscando metadados do endpoint de eventos...");
      // Tentando acessar metadados da API para descobrir os tipos de dados esperados
      const response = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/events/metadata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Metadados do endpoint:", data);
        // Analisar os metadados para entender o formato esperado para begins_at e finishes_at
      } else {
        console.log("Metadados não disponíveis. Status: " + response.status + ". Tentando alternativa...");
        // Tentar descobrir pelo schema
        const schemaResponse = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/events/schema", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (schemaResponse.ok) {
          const schemaData = await schemaResponse.json();
          console.log("Schema do endpoint:", schemaData);
        } else {
          console.log("Schema não disponível. Status:", schemaResponse.status);
          
          // Última tentativa: obter dados de descrição da tabela
          try {
            // No Oracle APEX REST, tentar buscar descrição via introspection
            const descResponse = await fetch("https://apex.oracle.com/pls/apex/garage_sale/api/events/describe", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });
            
            if (descResponse.ok) {
              const descData = await descResponse.json();
              console.log("Descrição do endpoint:", descData);
            } else {
              console.log("Descrição não disponível. Status:", descResponse.status);
            }
          } catch (descError) {
            console.error("Erro ao buscar descrição:", descError);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar metadados:", error);
    }
  };

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

  // Função para validar o formulário
  const validarFormulario = () => {
    // Objeto para armazenar erros de validação
    const erros = [];
    
    // Verificar se algum espaço foi selecionado
    if (!formData.espacoId || formData.espacoId === '') {
      erros.push('Selecione um espaço para o evento.');
    }

    // Verificar se pelo menos uma categoria foi selecionada
    if (formData.categorias.length === 0) {
      erros.push('Selecione pelo menos uma categoria para o evento.');
    }

    // Verificar campos obrigatórios
    if (!formData.nome) {
      erros.push('O nome do evento é obrigatório.');
    } else if (formData.nome.length < 3) {
      erros.push('O nome do evento deve ter pelo menos 3 caracteres.');
    }
    
    if (!formData.data) {
      erros.push('A data do evento é obrigatória.');
    } else {
      // Verificar se a data está no futuro
      const dataEvento = new Date(formData.data);
      const dataAtual = new Date();
      dataAtual.setHours(0, 0, 0, 0); // Reset das horas para comparar apenas a data
      
      if (dataEvento < dataAtual) {
        erros.push('A data do evento deve ser no futuro.');
      }
    }
    
    if (!formData.horarioInicio) {
      erros.push('O horário de início é obrigatório.');
    }
    
    if (!formData.horarioFim) {
      erros.push('O horário de término é obrigatório.');
    } else if (formData.horarioInicio && formData.horarioFim <= formData.horarioInicio) {
      erros.push('O horário de término deve ser posterior ao horário de início.');
    }
    
    if (!formData.descricao) {
      erros.push('A descrição do evento é obrigatória.');
    } else if (formData.descricao.length < 10) {
      erros.push('A descrição deve ter pelo menos 10 caracteres.');
    }

    // Se houver erros, exibir o primeiro erro e retornar false
    if (erros.length > 0) {
      // Mostrar o feedback com o primeiro erro
      setFeedback({
        mostrar: true,
        tipo: 'erro',
        mensagem: erros[0]
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validar formulário antes de enviar
  if (!validarFormulario()) {
    return;
  }
  
  setIsSubmitting(true); // Inicia o estado de carregamento
  
  // Garantir que as categorias sejam um array de números
  // No exemplo de MeusEspacos.jsx que funciona, é enviado [22]
  let categoriasProcessadas = [22]; // Categoria padrão que sabemos que existe
  
  // Se o usuário selecionou categorias, usar elas
  if (formData.categorias && formData.categorias.length > 0) {
    // Converter para números (se necessário) e garantir que são valores válidos
    categoriasProcessadas = formData.categorias
      .filter(c => c) // Remover valores vazios
      .map(categoria => {
        if (typeof categoria === 'number') return categoria;
        if (/^\d+$/.test(categoria)) return parseInt(categoria);
        return 22; // Categoria padrão para valores inválidos
      });
  }
  
  // ID do usuário - usando o mesmo do exemplo que funciona
  const usuarioId = 63;
  
  // FORMATAÇÃO RIGOROSA para todos os dados Date/Time seguindo exatamente o formato que o Oracle espera
  
  // ÚLTIMA TENTATIVA: vamos usar um formato de data/hora que o Oracle certamente aceitará
  
  // Para data, mantenha o formato ISO YYYY-MM-DD sem timezone
  let dataFormatada = '2025-01-01'; // data padrão segura
  
  if (formData.data) {
    try {
      // Converter para objeto Date e garantir formato YYYY-MM-DD
      const data = new Date(formData.data);
      if (!isNaN(data.getTime())) {
        // Extrair ano, mês e dia e formatar manualmente
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        // Voltando ao formato YYYY-MM-DD que parece ser o padrão dos registros existentes
        dataFormatada = `${ano}-${mes}-${dia}`;  // Formato ISO: YYYY-MM-DD (ex: 2025-06-19)
      }
    } catch (e) {
      console.error('Erro ao formatar data:', e);
    }
  }
  
  console.log('Data formatada final:', dataFormatada);
  
  // Função auxiliar para extrair e formatar horários
  const extrairHorario = (horarioString, padrao) => {
    if (!horarioString || horarioString.trim() === '') {
      return { horaPadrao: padrao };
    }
    
    try {
      // Extrair horas e minutos
      let hora = 0, minuto = 0;
      
      if (horarioString.includes(':')) {
        const partes = horarioString.split(':');
        hora = parseInt(partes[0]) || 0;
        minuto = parseInt(partes[1]) || 0;
      } else {
        hora = parseInt(horarioString) || 0;
      }
      
      // Garantir limites válidos
      hora = Math.min(Math.max(hora, 0), 23);
      minuto = Math.min(Math.max(minuto, 0), 59);
      
      // Retornar objeto com múltiplos formatos
      const horaStr = String(hora).padStart(2, '0');
      const minutoStr = String(minuto).padStart(2, '0');
      
      return {
        hora, minuto,
        horaPadrao: padrao,
        formatoHHMM: `${horaStr}:${minutoStr}`,
        formatoHHMMSS: `${horaStr}:${minutoStr}:00`,
        formatoNumerico: `${horaStr}${minutoStr}`,
        formatoFaixa: `${horaStr}:${minutoStr} - ${horaStr}:${minutoStr}`
      };
      
    } catch (e) {
      console.error(`Erro ao extrair horário ${horarioString}:`, e);
      return { horaPadrao: padrao };
    }
  };
  
  // Extrair horário - duplicação removida
  // Esta função foi movida para o nível superior do componente
  
  // Extrair informações de horário
  const horarioInicio = extrairHorario(formData.horarioInicio, '09:00');
  const horarioFim = extrairHorario(formData.horarioFim, '18:00');
  
  // Criar formato de faixa horária
  const faixaHoraria = `${horarioInicio.formatoHHMM} - ${horarioFim.formatoHHMM}`;
  
  // ===== NOVOS FORMATOS DE HORA PARA ORACLE =====
  
  // 1. Data ISO completa - YYYY-MM-DDTHH:MM:SS (formato ISO 8601)
  const dataObj = new Date(dataFormatada); // Usar a data do formulário como base
  dataObj.setHours(horarioInicio.hora, horarioInicio.minuto, 0, 0);
  const horarioIsoInicio = dataObj.toISOString().split('.')[0]; // Remove milissegundos
  
  dataObj.setHours(horarioFim.hora, horarioFim.minuto, 0, 0);
  const horarioIsoFim = dataObj.toISOString().split('.')[0]; // Remove milissegundos
  
  // 2. Data Oracle - Texto numérico (yyyymmdd)
  const dataNumericaBase = dataFormatada.replace(/-/g, '');
  
  // 3. Timestamp UNIX em segundos (epoch)
  const timestampInicio = Math.floor(new Date(dataFormatada + 'T' + horarioInicio.formatoHHMMSS).getTime() / 1000);
  const timestampFim = Math.floor(new Date(dataFormatada + 'T' + horarioFim.formatoHHMMSS).getTime() / 1000);
  
  // 4. Formato Oracle TO_DATE style (DD-MON-YY HH.MI.SS)
  const meses = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dataObj2 = new Date(dataFormatada);
  const dia = String(dataObj2.getDate()).padStart(2, '0');
  const mes = meses[dataObj2.getMonth()];
  const ano = String(dataObj2.getFullYear()).substring(2); // últimos 2 dígitos do ano
  
  const oracleFormatoDataInicio = `${dia}-${mes}-${ano} ${horarioInicio.hora}.${horarioInicio.minuto}.00`;
  const oracleFormatoDataFim = `${dia}-${mes}-${ano} ${horarioFim.hora}.${horarioFim.minuto}.00`;
  
  // 5. Formato 24h sem separadores (decimal hours)
  const decimalHoursInicio = horarioInicio.hora + (horarioInicio.minuto / 60);
  const decimalHoursFim = horarioFim.hora + (horarioFim.minuto / 60);
  
  // Usar o formato padrão de HH:MM:SS para o payload inicial
  const horarioInicioFormatado = horarioInicio.formatoHHMMSS;
  const horarioFimFormatado = horarioFim.formatoHHMMSS;
  
  // Registrar os diferentes formatos disponíveis para depuração
  console.log('Formatos calculados:', {
    standard: {
      inicio: horarioInicioFormatado,
      fim: horarioFimFormatado
    },
    iso8601: {
      inicio: horarioIsoInicio,
      fim: horarioIsoFim
    },
    unix: {
      inicio: timestampInicio,
      fim: timestampFim
    },
    oracleFormat: {
      inicio: oracleFormatoDataInicio,
      fim: oracleFormatoDataFim
    },
    decimalHours: {
      inicio: decimalHoursInicio,
      fim: decimalHoursFim
    },
    faixaHoraria
  });
  
  console.log('Horário início formatado:', horarioInicioFormatado);
  console.log('Horário fim formatado:', horarioFimFormatado);
  
  // NOVO TESTE: Payload "espelho" replicando EXATAMENTE o formato dos eventos existentes
  // visto nas capturas de tela do Postman
  const payload = {
    "owner_id": 61,
    "space_id": 89,
    "name": formData.nome || 'Evento sem nome',
    "description": formData.descricao || 'Sem descrição',
    "product_category": categoriasProcessadas.length ? categoriasProcessadas : [22],
    "event_date": dataFormatada,
    "event_type": formData.tipoEvento || 'venda_garagem'
  };
  
  // FORMATO CORRETO CONFIRMADO PELO BACKEND: HH:MM (formato 24h)
  // Formato confirmado pelo desenvolvedor: "12:00", "17:00" ou "06:00"
  
  // Formatando hora e minuto para o formato esperado pelo backend
  const formatoHoraBackend = (hora, minuto) => {
    const h = hora.toString().padStart(2, '0');
    const m = minuto.toString().padStart(2, '0');
    return `${h}:${m}`;
  };
  
  // TESTE FINAL: Remover completamente os campos begins_at e finishes_at
  // Sem adicionar nenhum resquício desses campos
  
  // Log da estratégia atual de teste
  console.log('TESTE FINAL: Omitindo completamente os campos begins_at e finishes_at');
  console.log('owner_id e space_id configurados com IDs válidos');
  
  // Log detalhado para DEBUG
  console.log('=== PAYLOAD COMPLETO ===', JSON.stringify(payload, null, 2));
  
  // Log simplificado
  console.log('Payload:', payload);
  
  try {
    // URL completa do backend conforme documentação fornecida
    const apiUrl = 'https://apex.oracle.com/pls/apex/garage_sale/api/events/';
    
    console.log(`Enviando requisição POST para: ${apiUrl}`);
    
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      // Log do status de erro
      console.error('Erro na requisição:', res.status, res.statusText);
      
      // Verificar o tipo de conteúdo da resposta
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // É uma resposta JSON
        try {
          const errorData = await res.json();
          console.error('Detalhes do erro (JSON):', errorData);
          
          // Extrair mensagem de erro de diferentes formatos possíveis
          const errorMessage = errorData.message || 
                             errorData.error || 
                             errorData.error_description || 
                             JSON.stringify(errorData);
                             
          throw new Error(`Erro da API: ${errorMessage}`);
        } catch (e) {
          // Erro ao processar o JSON
          console.error('Erro ao processar resposta JSON:', e);
          throw new Error(`Erro ao cadastrar evento: Status ${res.status}`);
        }
      } else {
        // Não é JSON, obter como texto
        try {
          const errorText = await res.text();
          console.error('Detalhes do erro (texto):', errorText);
          throw new Error(`Erro ao cadastrar evento: ${res.status} - ${errorText.substring(0, 100)}`);
        } catch (e) {
          // Erro ao processar texto
          console.error('Erro ao processar resposta como texto:', e);
          throw new Error(`Erro ao cadastrar evento: Status ${res.status}`);
        }
      }
    }
    
    // Processar a resposta de sucesso
    const data = await res.json();
    console.log('Evento cadastrado com sucesso:', data);
    
    // Limpar formulário após sucesso
    setFormData({
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
    
    setImagemPreview(null);
    
    // Exibir feedback de sucesso
    setFeedback({
      mostrar: true,
      tipo: 'sucesso',
      mensagem: 'Evento cadastrado com sucesso! Redirecionando...'
    });
    
    // Redirecionar para página de meus eventos após 2 segundos
    setTimeout(() => {
      navigate('/meus-eventos');
    }, 2000);
    
  } catch (err) {
    console.error('Erro ao cadastrar evento:', err);
    
    // Exibir feedback de erro
    setFeedback({
      mostrar: true,
      tipo: 'erro',
      mensagem: `Erro ao cadastrar evento: ${err.message}`
    });
  } finally {
    setIsSubmitting(false); // Finaliza o estado de carregamento independentemente do resultado
  }
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
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Evento'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      {/* Notificação de feedback */}
      {feedback.mostrar && (
        <div className={`${styles.notificacao} ${feedback.tipo === 'sucesso' ? styles.sucesso : styles.erro}`}>
          <div className={styles.notificacaoConteudo}>
            <span>{feedback.mensagem}</span>
            <button 
              onClick={() => setFeedback({...feedback, mostrar: false})} 
              className={styles.fecharNotificacao}
            >
              ×
            </button>
          </div>
        </div>
      )}

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
