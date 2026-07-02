import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, Key, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const RegisterConvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token') || '';
    const emailParam = searchParams.get('email') || '';
    setToken(tokenParam);
    setEmail(emailParam);

    if (!tokenParam) {
      setError('Token de convite não encontrado na URL. Solicite um novo convite ao Administrador.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Token de convite inválido ou ausente.');
      return;
    }
    if (!nome || !senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/convites/aceitar', {
        token,
        nome,
        senha,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensagem || 
        'Erro ao processar o cadastro via convite. Verifique se o convite já foi aceito ou expirou.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      {/* Background hex texture (visible light purple style for light theme) */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='70' viewBox='0 0 60 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,2 58,17 58,53 30,68 2,53 2,17' fill='none' stroke='%235b3ea6' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 70px'
        }}
      ></div>

      {/* Background glow effects (restored with standard RGBA radial-gradients) */}
      <div 
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(91, 62, 166, 0.4) 0%, transparent 70%)' }}
      ></div>
      <div 
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(11, 148, 132, 0.3) 0%, transparent 70%)' }}
      ></div>
      <div 
        className="absolute top-[30%] left-[25%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(196, 77, 48, 0.2) 0%, transparent 70%)' }}
      ></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-transparent mb-3">
            <svg className="w-12 h-12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 37V20" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M20 28C16 25 10 23 8 18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M20 28C24 25 30 23 32 18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M20 22C16 19 13 14 12 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M20 22C24 19 27 14 28 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              
              <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="var(--color-primary-strong)"/>
              <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="var(--color-secondary)"/>
              <polygon points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="var(--color-secondary)"/>
              <circle cx="20" cy="16" r="2.5" fill="var(--color-accent)"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-text mt-1.5 font-display">
            Inclusi<span className="text-primary">.va</span>
          </h1>
          <p className="text-muted text-[10px] mt-1.5 font-bold uppercase tracking-widest">
            Registro de Recrutador Corporativo
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-card p-8 shadow-card border border-border">
          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center p-3 bg-secondary/10 border border-secondary/20 rounded-full mb-4 text-secondary">
                <CheckCircle size={48} className="animate-bounce" />
              </div>
              <h2 className="text-xl font-bold text-text mb-2">Conta Criada!</h2>
              <p className="text-muted text-xs mb-6">
                Cadastro realizado com sucesso. Você será redirecionado para a tela de login em alguns segundos...
              </p>
              <Link 
                to="/login"
                className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-strong text-white font-semibold rounded-xl text-xs transition-all"
              >
                Ir para o Login agora
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-base font-bold text-text mb-6">
                Complete seus dados
              </h2>

              {error && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Blocked/Hidden Token Field */}
                <input
                  type="hidden"
                  value={token}
                  readOnly
                />

                {/* Token Display */}
                {token && (
                  <div className="p-3 bg-bg border border-border rounded-xl flex items-center gap-3">
                    <Key size={14} className="text-primary" />
                    <div className="text-[10px] overflow-hidden">
                      <span className="text-muted block uppercase tracking-wider font-bold">Token de Convite Validado</span>
                      <span className="font-mono text-text block truncate select-all mt-0.5">{token}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="nome" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <User size={16} />
                    </span>
                    <input
                      id="nome"
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full pl-9 pr-4 py-2.5 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary transition-colors text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    E-mail de Cadastro (Convidado)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!email}
                      placeholder="nome@empresa.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-bg border border-border rounded-xl text-text placeholder-muted disabled:bg-bg/40 disabled:text-muted disabled:cursor-not-allowed focus:outline-none focus:border-primary transition-colors text-xs"
                    />
                  </div>
                  <p className="text-[9px] text-muted mt-1 leading-snug">
                    Nota: O e-mail registrado será o mesmo definido originalmente no convite gerado.
                  </p>
                </div>

                <div>
                  <label htmlFor="senha" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    Crie sua Senha
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <Lock size={16} />
                    </span>
                    <input
                      id="senha"
                      type="password"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-9 pr-4 py-2.5 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary transition-colors text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-strong disabled:bg-primary/50 text-white font-bold rounded-xl text-xs transition-all cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Concluir Cadastro'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-xs text-muted hover:text-primary transition-colors font-medium">
                  Já tem uma conta? <span className="text-primary hover:underline font-bold">Fazer Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterConvite;
