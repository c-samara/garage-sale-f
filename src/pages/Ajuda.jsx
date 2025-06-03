import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './Ajuda.module.css';

export default function Ajuda() {
  // Estado para controlar as perguntas expandidas
  const [expandedFaqs, setExpandedFaqs] = useState([]);
  
  // Estado para controlar a pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para controlar o formulário de contato
  const [contatoForm, setContatoForm] = useState({
    nome: '',
    email: '',
    assunto: 'duvida',
    mensagem: ''
  });
  
  // Estado para controlar o envio do formulário
  const [formEnviado, setFormEnviado] = useState(false);
  
  // Categorias de FAQ
  const categorias = [
    { id: 'geral', nome: 'Informações Gerais' },
    { id: 'organizadores', nome: 'Para Organizadores' },
    { id: 'proprietarios', nome: 'Para Proprietários' },
    { id: 'pagamentos', nome: 'Pagamentos' },
    { id: 'eventos', nome: 'Eventos' }
  ];
  
  // Lista de perguntas frequentes
  const faqs = [
    {
      id: 1,
      pergunta: 'O que é o Garage Sale?',
      resposta: 'O Garage Sale é uma plataforma que conecta proprietários de espaços disponíveis para aluguel com pessoas interessadas em organizar eventos de venda de garagem, bazares, feiras e outros eventos similares. Nossa missão é facilitar a organização de eventos locais, promover a venda de produtos novos e usados, incentivar o uso sustentável de espaços e gerar renda extra para proprietários.',
      categoria: 'geral'
    },
    {
      id: 2,
      pergunta: 'Como funciona para quem quer organizar um evento?',
      resposta: 'Para organizar um evento, você precisa criar uma conta como organizador. Depois de fazer login, você pode navegar pelos espaços disponíveis, escolher um local adequado para seu evento, selecionar a data e horário desejados, e fazer a reserva. Você também pode adicionar equipamentos extras como mesas e cadeiras, se necessário. Após a confirmação do pagamento, seu evento estará oficialmente agendado.',
      categoria: 'organizadores'
    },
    {
      id: 3,
      pergunta: 'Como funciona para quem tem um espaço para alugar?',
      resposta: 'Se você possui um espaço que gostaria de disponibilizar para eventos, crie uma conta como proprietário. Após o login, acesse a seção "Meus Espaços" para cadastrar seu espaço, incluindo fotos, descrição, endereço, capacidade, preço e disponibilidade. Quando um organizador se interessar pelo seu espaço, você receberá uma notificação para aprovar a reserva. Os pagamentos são processados pela plataforma, e você recebe o valor acordado após a realização do evento.',
      categoria: 'proprietarios'
    },
    {
      id: 4,
      pergunta: 'Quais são as formas de pagamento aceitas?',
      resposta: 'Aceitamos diversas formas de pagamento, incluindo cartão de crédito, PIX e boleto bancário. Todos os pagamentos são processados de forma segura através da nossa plataforma integrada com o MercadoPago. Para os proprietários, os pagamentos são realizados em até 3 dias úteis após a conclusão do evento.',
      categoria: 'pagamentos'
    },
    {
      id: 5,
      pergunta: 'Como faço para cancelar um evento?',
      resposta: 'Para cancelar um evento, acesse a seção "Meus Eventos" no seu perfil, localize o evento que deseja cancelar e clique no botão "Cancelar Evento". O cancelamento está sujeito à política de reembolso: se cancelado com mais de 7 dias de antecedência, você recebe 100% do valor; entre 3 e 7 dias, 50% do valor; com menos de 3 dias, não há reembolso. Os proprietários são notificados automaticamente sobre o cancelamento.',
      categoria: 'eventos'
    },
    {
      id: 6,
      pergunta: 'Posso modificar meu espaço após cadastrá-lo?',
      resposta: 'Sim, você pode modificar as informações do seu espaço a qualquer momento através da seção "Meus Espaços". No entanto, alterações de preço e disponibilidade não afetarão reservas já confirmadas. Recomendamos manter as informações sempre atualizadas para evitar conflitos de agenda e garantir a satisfação dos organizadores.',
      categoria: 'proprietarios'
    },
    {
      id: 7,
      pergunta: 'Como funciona a taxa da plataforma?',
      resposta: 'A Garage Sale cobra uma taxa de serviço de 10% sobre o valor total da reserva. Esta taxa é dividida entre organizadores (4%) e proprietários (6%). A taxa cobre os custos operacionais da plataforma, processamento de pagamentos, suporte ao cliente e marketing. Todos os valores exibidos para os organizadores já incluem esta taxa.',
      categoria: 'pagamentos'
    },
    {
      id: 8,
      pergunta: 'É possível alugar equipamentos para o evento?',
      resposta: 'Sim, oferecemos a opção de alugar equipamentos adicionais para o seu evento, como mesas, cadeiras e tendas. Durante o processo de reserva do espaço, você encontrará a seção "Equipamentos Adicionais" onde poderá selecionar os itens necessários e as quantidades. O valor será adicionado ao custo total do evento.',
      categoria: 'organizadores'
    },
    {
      id: 9,
      pergunta: 'Como encontro eventos próximos à minha localização?',
      resposta: 'Na página "Eventos Próximos", você pode visualizar todos os eventos agendados em um mapa interativo. Utilize os filtros disponíveis para refinar sua busca por data, distância máxima e categorias de produtos. Ao clicar em um evento, você verá informações detalhadas, incluindo data, horário, endereço e tipos de produtos que serão comercializados.',
      categoria: 'eventos'
    },
    {
      id: 10,
      pergunta: 'Preciso de autorização da prefeitura para realizar um evento?',
      resposta: 'As exigências legais variam de acordo com a cidade e o tipo de evento. Em geral, eventos pequenos e privados não necessitam de autorização especial. No entanto, para eventos maiores ou em espaços públicos, pode ser necessário obter licenças específicas. Recomendamos verificar as regulamentações locais antes de organizar seu evento. A Garage Sale não se responsabiliza pela obtenção dessas autorizações.',
      categoria: 'organizadores'
    },
    {
      id: 11,
      pergunta: 'Como garantir a segurança durante o evento?',
      resposta: 'Recomendamos algumas medidas básicas de segurança: verifique as condições do espaço antes do evento, estabeleça regras claras para expositores e visitantes, tenha um controle de entrada se necessário, e considere contratar segurança para eventos maiores. Também sugerimos ter um kit de primeiros socorros disponível. A plataforma oferece um seguro básico para eventos, mas coberturas adicionais podem ser contratadas separadamente.',
      categoria: 'organizadores'
    },
    {
      id: 12,
      pergunta: 'Posso divulgar meu evento na plataforma?',
      resposta: 'Sim, todos os eventos confirmados são automaticamente listados na seção "Eventos Próximos", visível para todos os usuários da plataforma. Além disso, oferecemos opções de destaque para aumentar a visibilidade do seu evento mediante uma taxa adicional. Você também recebe um link exclusivo para compartilhar seu evento nas redes sociais.',
      categoria: 'eventos'
    }
  ];
  
  // Função para alternar a expansão de uma FAQ
  const toggleFaq = (faqId) => {
    if (expandedFaqs.includes(faqId)) {
      setExpandedFaqs(expandedFaqs.filter(id => id !== faqId));
    } else {
      setExpandedFaqs([...expandedFaqs, faqId]);
    }
  };
  
  // Função para filtrar FAQs por termo de pesquisa e categoria
  const filtrarFaqs = (categoria = 'todas') => {
    let faqsFiltradas = faqs;
    
    // Filtrar por termo de pesquisa
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      faqsFiltradas = faqsFiltradas.filter(faq => 
        faq.pergunta.toLowerCase().includes(termo) || 
        faq.resposta.toLowerCase().includes(termo)
      );
    }
    
    // Filtrar por categoria
    if (categoria !== 'todas') {
      faqsFiltradas = faqsFiltradas.filter(faq => faq.categoria === categoria);
    }
    
    return faqsFiltradas;
  };
  
  // Função para lidar com mudanças no formulário de contato
  const handleContatoChange = (e) => {
    const { name, value } = e.target;
    setContatoForm({
      ...contatoForm,
      [name]: value
    });
  };
  
  // Função para enviar o formulário de contato
  const enviarFormulario = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para enviar o formulário para o backend
    console.log('Formulário enviado:', contatoForm);
    setFormEnviado(true);
    
    // Resetar o formulário após 3 segundos
    setTimeout(() => {
      setFormEnviado(false);
      setContatoForm({
        nome: '',
        email: '',
        assunto: 'duvida',
        mensagem: ''
      });
    }, 3000);
  };
  
  // Estado para controlar a categoria selecionada
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Central de Ajuda</h1>
          <p>Encontre respostas para suas dúvidas ou entre em contato conosco</p>
        </div>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Pesquisar dúvidas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              Buscar
            </button>
          </div>
        </div>
        
        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <div className={styles.categoriasList}>
              <h2>Categorias</h2>
              
              <button
                className={`${styles.categoriaButton} ${categoriaSelecionada === 'todas' ? styles.categoriaAtiva : ''}`}
                onClick={() => setCategoriaSelecionada('todas')}
              >
                Todas as Perguntas
              </button>
              
              {categorias.map(categoria => (
                <button
                  key={categoria.id}
                  className={`${styles.categoriaButton} ${categoriaSelecionada === categoria.id ? styles.categoriaAtiva : ''}`}
                  onClick={() => setCategoriaSelecionada(categoria.id)}
                >
                  {categoria.nome}
                </button>
              ))}
            </div>
            
            <div className={styles.contatoBox}>
              <h2>Precisa de mais ajuda?</h2>
              <p>Nossa equipe está pronta para te ajudar</p>
              <a href="#contato" className={styles.contatoButton}>
                Fale Conosco
              </a>
            </div>
          </aside>
          
          <section className={styles.faqSection}>
            <h2>
              {categoriaSelecionada === 'todas' 
                ? 'Perguntas Frequentes' 
                : categorias.find(cat => cat.id === categoriaSelecionada)?.nome || 'Perguntas Frequentes'}
            </h2>
            
            <div className={styles.faqList}>
              {filtrarFaqs(categoriaSelecionada).length > 0 ? (
                filtrarFaqs(categoriaSelecionada).map(faq => (
                  <div 
                    key={faq.id} 
                    className={`${styles.faqItem} ${expandedFaqs.includes(faq.id) ? styles.expanded : ''}`}
                  >
                    <div 
                      className={styles.faqPergunta}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h3>{faq.pergunta}</h3>
                      <span className={styles.expandIcon}>
                        {expandedFaqs.includes(faq.id) ? '−' : '+'}
                      </span>
                    </div>
                    
                    {expandedFaqs.includes(faq.id) && (
                      <div className={styles.faqResposta}>
                        <p>{faq.resposta}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhuma pergunta encontrada com os filtros selecionados.</p>
                  <p>Tente ajustar sua pesquisa ou entre em contato conosco.</p>
                </div>
              )}
            </div>
          </section>
        </div>
        
        <section id="contato" className={styles.contatoSection}>
          <h2>Fale Conosco</h2>
          <p>Não encontrou o que procurava? Envie sua mensagem</p>
          
          <div className={styles.contatoContainer}>
            <div className={styles.contatoInfo}>
              <div className={styles.infoItem}>
                <h3>Email</h3>
                <p>contato@garagesale.com.br</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3>Telefone</h3>
                <p>(11) 9999-9999</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3>Horário de Atendimento</h3>
                <p>Segunda a Sexta, 9h às 18h</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3>Redes Sociais</h3>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialLink}>Instagram</a>
                  <a href="#" className={styles.socialLink}>Facebook</a>
                  <a href="#" className={styles.socialLink}>Twitter</a>
                </div>
              </div>
            </div>
            
            <div className={styles.contatoForm}>
              {formEnviado ? (
                <div className={styles.formSuccess}>
                  <h3>Mensagem Enviada!</h3>
                  <p>Agradecemos seu contato. Responderemos em breve.</p>
                </div>
              ) : (
                <form onSubmit={enviarFormulario}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nome">Nome</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={contatoForm.nome}
                      onChange={handleContatoChange}
                      required
                      className={styles.input}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contatoForm.email}
                      onChange={handleContatoChange}
                      required
                      className={styles.input}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="assunto">Assunto</label>
                    <select
                      id="assunto"
                      name="assunto"
                      value={contatoForm.assunto}
                      onChange={handleContatoChange}
                      required
                      className={styles.select}
                    >
                      <option value="duvida">Dúvida</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="problema">Problema</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="mensagem">Mensagem</label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={contatoForm.mensagem}
                      onChange={handleContatoChange}
                      required
                      rows="5"
                      className={styles.textarea}
                    ></textarea>
                  </div>
                  
                  <button type="submit" className={styles.submitButton}>
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
