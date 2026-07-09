import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('carlos.silva@nexus.com.br');
  const [senha, setSenha] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensagem || 
        'Credenciais inválidas ou erro ao conectar com o servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      {/* Background hex texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='70' viewBox='0 0 60 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,2 58,17 58,53 30,68 2,53 2,17' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 70px'
        }}
      ></div>

      {/* Background glowing orbs */}
      <div 
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(91, 62, 166, 0.4) 0%, transparent 70%)' }}
      ></div>
      <div 
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(11, 148, 132, 0.35) 0%, transparent 70%)' }}
      ></div>
      <div 
        className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(196, 77, 48, 0.25) 0%, transparent 70%)' }}
      ></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group cursor-pointer">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md group-hover:border-[#7B5EC4]/40 transition-all duration-350">
              <svg className="w-12 h-12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 37V20" stroke="#7B5EC4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M20 28C16 25 10 23 8 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M20 28C24 25 30 23 32 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M20 22C16 19 13 14 12 10" stroke="#7B5EC4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M20 22C24 19 27 14 28 10" stroke="#7B5EC4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                
                <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="#5B3EA6"/>
                <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="#0B9484"/>
                <polygon points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="#0B9484"/>
                <circle cx="20" cy="16" r="2.5" fill="#C44D30"/>
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1.5 font-display">
              Inclusi<span className="text-[#7B5EC4]">.va</span>
            </h1>
          </Link>
          <p className="text-white/50 text-[10px] mt-1.5 font-bold uppercase tracking-widest">
            Recrutamento Inteligente, Inclusivo e ESG
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#151026]/75 backdrop-blur-xl rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">
            Acesse sua conta
          </h2>

          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                E-mail Corporativo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0F0A1E]/80 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#7B5EC4] focus:ring-1 focus:ring-[#7B5EC4] transition-colors text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="senha" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider">
                  Senha
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <Lock size={16} />
                </span>
                <input
                  id="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0F0A1E]/80 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#7B5EC4] focus:ring-1 focus:ring-[#7B5EC4] transition-colors text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#5B3EA6] to-[#7C3AED] hover:from-[#4C308E] hover:to-[#6D28D9] disabled:from-[#5B3EA6]/50 disabled:to-[#7C3AED]/50 text-white font-bold rounded-xl text-xs transition-all cursor-pointer active:scale-[0.98] shadow-[0_4px_20px_rgba(91,62,166,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          {/* Quick Help for Evaluation Panel */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-white/40 font-medium">
              Ambiente de Avaliação. Use credenciais homologadas:
            </p>
            <div className="mt-2 text-[10px] font-mono text-white/80 bg-[#0F0A1E]/60 p-3 rounded-lg border border-white/10 inline-block text-left">
              <div><span className="text-[#7B5EC4] font-bold">Admin:</span> carlos.silva@nexus.com.br</div>
              <div><span className="text-[#7B5EC4] font-bold">Senha:</span> 123456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
