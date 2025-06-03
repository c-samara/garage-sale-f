import React, { useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styles from './CadastroForm.module.css';

const CadastroForm = () => {
  // Estado para o formulário
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'organizador',
    telefone: '',
    cpf: '',
    termos: false
  });

  // Estado para mensagens de erro
  const [erros, setErros] = useState({});
  
  // Estado para controlar o sucesso do cadastro
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpar erro do campo quando o usuário digita
    if (erros[name]) {
      setErros({
        ...erros,
        [name]: ''
      });
    }
  };

  // Função para validar o formulário
  const validarFormulario = () => {
    const novosErros = {};
    
    // Validar nome
    if (!form.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }
    
    // Validar email
    if (!form.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      novosErros.email = 'Email inválido';
    }
    
    // Validar senha
    if (!form.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (form.senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    // Validar confirmação de senha
    if (form.senha !== form.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }
    
    // Validar telefone
    if (!form.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    }
    
    // Validar CPF
    if (!form.cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    }
    
    // Validar termos
    if (!form.termos) {
      novosErros.termos = 'Você deve aceitar os termos e condições';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      // Aqui seria feita a integração com o backend
      console.log('Dados cadastrados:', form);
      setCadastroSucesso(true);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.cadastroContainer}>
          <div className={styles.cadastroHeader}>
            <h1>Crie sua conta</h1>
            <p>Preencha os campos abaixo para se cadastrar</p>
          </div>
          
          {cadastroSucesso ? (
            <div className={styles.sucessoContainer}>
              <div className={styles.sucessoIcon}>✓</div>
              <h2>Cadastro realizado com sucesso!</h2>
              <p>Enviamos um email de confirmação para {form.email}.</p>
              <p>Verifique sua caixa de entrada para ativar sua conta.</p>
              <a href="/login" className={styles.loginButton}>Ir para Login</a>
            </div>
          ) : (
            <form className={styles.cadastroForm} onSubmit={handleSubmit}>
              <div className={styles.tipoUsuario}>
                <h3>Tipo de Usuário</h3>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="tipo"
                      value="organizador"
                      checked={form.tipo === 'organizador'}
                      onChange={handleChange}
                    />
                    <span>Organizador de Eventos</span>
                  </label>
                  
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="tipo"
                      value="proprietario"
                      checked={form.tipo === 'proprietario'}
                      onChange={handleChange}
                    />
                    <span>Proprietário de Espaço</span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={erros.nome ? styles.inputError : styles.input}
                />
                {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={erros.email ? styles.inputError : styles.input}
                  />
                  {erros.email && <span className={styles.erro}>{erros.email}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className={erros.telefone ? styles.inputError : styles.input}
                  />
                  {erros.telefone && <span className={styles.erro}>{erros.telefone}</span>}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className={erros.cpf ? styles.inputError : styles.input}
                />
                {erros.cpf && <span className={styles.erro}>{erros.cpf}</span>}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="senha">Senha</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    className={erros.senha ? styles.inputError : styles.input}
                  />
                  {erros.senha && <span className={styles.erro}>{erros.senha}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmarSenha">Confirmar Senha</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    className={erros.confirmarSenha ? styles.inputError : styles.input}
                  />
                  {erros.confirmarSenha && <span className={styles.erro}>{erros.confirmarSenha}</span>}
                </div>
              </div>
              
              <div className={styles.termos}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    name="termos"
                    checked={form.termos}
                    onChange={handleChange}
                  />
                  <span>Li e concordo com os <a href="#" className={styles.termosLink}>Termos e Condições</a> e <a href="#" className={styles.termosLink}>Política de Privacidade</a></span>
                </label>
                {erros.termos && <span className={styles.erro}>{erros.termos}</span>}
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.cadastrarButton}>Cadastrar</button>
                <p className={styles.loginText}>Já tem uma conta? <a href="/login" className={styles.loginLink}>Faça login</a></p>
              </div>
            </form>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CadastroForm;
