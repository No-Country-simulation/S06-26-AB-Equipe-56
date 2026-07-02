import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Building2, FileText, User, Mail, Lock, AlertCircle, CheckCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const RegisterEmpresa = () => {
  const navigate = useNavigate();

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Company details
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');

  // Step 2: Admin Recruiter details
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validate step 1
  const handleNextStep = (e) => {
    e.preventDefault();
    if (!nomeEmpresa || !razaoSocial || !cnpj) {
      setError('Por favor, preencha todos os dados da empresa.');
      return;
    }
    // Basic CNPJ length validation
    const cleanCnpj = cnpj.replace(/\D/g, '');
    if (cleanCnpj.length < 14) {
      setError('CNPJ deve conter 14 dígitos.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeResponsavel || !email || !senha) {
      setError('Por favor, preencha todos os dados do responsável.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Create company
      const empresaRes = await api.post('/empresas', {
        nome: nomeEmpresa,
        razao_social: razaoSocial,
        cnpj: cnpj.replace(/\D/g, '') // Send clean CNPJ digits
      });

      const { empresa_id } = empresaRes.data;

      if (!empresa_id) {
        throw new Error('Falha ao obter ID da empresa cadastrada.');
      }

      // 2. Create admin recruiter (permissao_id = 1)
      await api.post('/recrutadores', {
        nome: nomeResponsavel,
        email: email,
        senha: senha,
        empresa_id: parseInt(empresa_id, 10),
        permissao_id: 1 // Force Admin permission level 1
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensagem || 
        'Erro ao processar o cadastro. Verifique se o CNPJ ou E-mail já estão em uso.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCnpjChange = (e) => {
    let value = e.target.value;
    // Apply CNPJ mask: 00.000.000/0000-00
    value = value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    setCnpj(value);
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white flex items-center justify-center py-12 px-4 relative overflow-hidden">
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

      {/* Painel Unificado de Fundo */}
      <div className="w-full max-w-5xl bg-[#151026]/45 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 my-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Informational (Desktop Only) */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-center text-left text-white pr-4">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4 group cursor-pointer">
                <svg className="w-8 h-8 transition-transform group-hover:scale-105" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 37V20" stroke="#7B5EC4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <path d="M20 28C16 25 10 23 8 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M20 28C24 25 30 23 32 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="#5B3EA6"/>
                  <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="#0B9484"/>
                  <polygon points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="#0B9484"/>
                  <circle cx="20" cy="16" r="2.5" fill="#C44D30"/>
                </svg>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-white/90">Inclusi<span className="text-[#7B5EC4]">.va</span></span>
              </Link>
              <h2 className="text-3xl font-black tracking-tight leading-tight mb-4 font-display">
                Sua empresa no centro da <span className="text-[#7B5EC4]">transformação</span>.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Cadastre sua empresa na Inclusi.va para publicar vagas com matching inteligente, mapear talentos por região e monitorar seus indicadores de diversidade e ESG.
              </p>
            </div>
          
          {/* Bullet points with nice icons */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7B5EC4] shrink-0 shadow-md">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">IA Explicável &amp; Anti-viés</h4>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">
                  Nossa inteligência artificial analisa habilidades eliminando preconceitos inconscientes na triagem.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0B9484] shrink-0 shadow-md">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Relatórios ESG Auditáveis</h4>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">
                  Gere relatórios automatizados de representatividade corporativa para investidores e reguladores.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C44D30] shrink-0 shadow-md">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Ecossistema de Integração</h4>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">
                  Crie trilhas de mentoria e ofereça suporte à saúde emocional dos novos talentos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="col-span-1 md:col-span-7 flex flex-col items-center justify-center w-full">
          
          {/* Mobile-only logo */}
          <Link to="/" className="flex flex-col items-center justify-center mb-6 md:hidden group cursor-pointer text-center w-full">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-3 shadow-md backdrop-blur-md group-hover:border-[#7B5EC4]/40 transition-colors">
              <svg className="w-10 h-10" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 37V20" stroke="#7B5EC4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M20 28C16 25 10 23 8 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M20 28C24 25 30 23 32 18" stroke="#7B5EC4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="#5B3EA6"/>
                <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="#0B9484"/>
                <circle cx="20" cy="16" r="2.5" fill="#C44D30"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Inclusi<span className="text-[#7B5EC4]">.va</span></h1>
          </Link>

          <div className="bg-[#0F0A1E]/70 rounded-2xl p-8 border border-white/5 w-full shadow-lg">
            {success ? (
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Empresa Credenciada!</h3>
                  <p className="text-sm text-white/60 mt-2">
                    A empresa <strong>{nomeEmpresa}</strong> e seu Administrador foram cadastrados com sucesso.
                  </p>
                  <p className="text-xs text-[#7B5EC4] font-medium mt-4 animate-pulse">
                    Redirecionando para a tela de login...
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {/* Form step headers */}
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 1 ? 'text-[#7B5EC4]' : 'text-white/40'}`}>
                    1. Dados da Empresa
                  </span>
                  <ArrowRight size={14} className="text-white/40" />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 2 ? 'text-[#7B5EC4]' : 'text-white/40'}`}>
                    2. Administrador
                  </span>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Step 1 */}
                {step === 1 && (
                  <form onSubmit={handleNextStep} className="space-y-4">
                    <div>
                      <label htmlFor="nomeEmpresa" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                        Nome Fantasia
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                          <Building2 size={16} />
                        </div>
                        <input
                          type="text"
                          id="nomeEmpresa"
                          value={nomeEmpresa}
                          onChange={(e) => setNomeEmpresa(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 text-xs bg-[#0F0A1E]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7B5EC4] focus:border-[#7B5EC4] transition-colors text-white placeholder-white/30"
                          placeholder="Ex: Minha Empresa Tech"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="razaoSocial" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                        Razão Social
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                          <FileText size={16} />
                        </div>
                        <input
                          type="text"
                          id="razaoSocial"
                          value={razaoSocial}
                          onChange={(e) => setRazaoSocial(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 text-xs bg-[#0F0A1E]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7B5EC4] focus:border-[#7B5EC4] transition-colors text-white placeholder-white/30"
                          placeholder="Ex: Minha Empresa Serviços Ltda"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cnpj" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                        CNPJ
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                          <Building2 size={16} />
                        </div>
                        <input
                          type="text"
                          id="cnpj"
                          value={cnpj}
                          onChange={handleCnpjChange}
                          maxLength={18}
                          className="block w-full pl-10 pr-3 py-2.5 text-xs bg-[#0F0A1E]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7B5EC4] focus:border-[#7B5EC4] transition-colors text-white placeholder-white/30"
                          placeholder="00.000.000/0000-00"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-[#5B3EA6] to-[#7C3AED] hover:from-[#4C308E] hover:to-[#6D28D9] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(91,62,166,0.3)] transition-all duration-150 flex items-center justify-center gap-1.5 tracking-wider uppercase cursor-pointer"
                    >
                      Avançar para Responsável <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* Form Step 2 */}
                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="nomeResponsavel" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                        Nome do Administrador
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          id="nomeResponsavel"
                          value={nomeResponsavel}
                          onChange={(e) => setNomeResponsavel(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 text-xs bg-[#0F0A1E]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7B5EC4] focus:border-[#7B5EC4] transition-colors text-white placeholder-white/30"
                          placeholder="Ex: Ana Souza"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                        E-mail Corporativo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 text-xs bg-[#0F0A1E]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7B5EC4] focus:border-[#7B5EC4] transition-colors text-white placeholder-white/30"
                          placeholder="responsavel@empresa.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="senha" className="block text-[10px] font-bold text-white/60 mb-1.5 uppercase tracking-wider">
                        Senha de Acesso
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                          <Lock size={16} />
                        </div>
                        <input
                          type="password"
                          id="senha"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 text-xs bg-[#0F0A1E]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7B5EC4] focus:border-[#7B5EC4] transition-colors text-white placeholder-white/30"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="w-1/3 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 tracking-wider uppercase cursor-pointer"
                      >
                        <ArrowLeft size={14} /> Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 bg-gradient-to-r from-[#5B3EA6] to-[#7C3AED] hover:from-[#4C308E] hover:to-[#6D28D9] disabled:from-[#5B3EA6]/50 disabled:to-[#7C3AED]/50 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(91,62,166,0.3)] transition-all duration-150 flex items-center justify-center gap-1.5 tracking-wider uppercase cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Processando...
                          </>
                        ) : (
                          'Concluir'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-xs text-white/40">
              Já tem uma conta credenciada?{' '}
              <Link to="/login" className="text-[#7B5EC4] hover:text-[#5B3EA6] font-bold transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RegisterEmpresa;
