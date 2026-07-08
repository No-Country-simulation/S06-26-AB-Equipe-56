import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const INITIAL_MENTORIAS = [
  { id: 1, mentor: 'Juliana Barbosa', area: 'Arquitetura de Soft.', status: 'Agendada', data: 'Amanhã às 14h', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120' },
  { id: 2, mentor: 'Fernando Costa', area: 'Product Management', status: 'Disponível', data: 'Quinta às 16h', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120' },
  { id: 3, mentor: 'Camila Santos', area: 'Engenharia de Dados (STEM)', status: 'Disponível', data: 'Sexta às 10h', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120' }
];

const Mentoria = () => {
  const { user } = useAuth();
  const [mentorias, setMentorias] = useState(INITIAL_MENTORIAS);
  const [successMsg, setSuccessMsg] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRequestMentoria = (id) => {
    setMentorias(prev => prev.map(m => {
      if (m.id === id) {
        const isAvailable = m.status === 'Disponível';
        return {
          ...m,
          status: isAvailable ? 'Solicitada' : 'Disponível'
        };
      }
      return m;
    }));

    const session = mentorias.find(m => m.id === id);
    if (session && session.status === 'Disponível') {
      triggerNotification(`Solicitação enviada com sucesso para mentoria com ${session.mentor}!`);
    }
  };

  const handleRegisterAsMentor = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      triggerNotification('Obrigado! Sua solicitação para atuar como mentor foi enviada. Nossa equipe entrará em contato em breve.');
    }, 1000);
  };

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Welcome Banner */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Sparkles size={12} />
            <span>Mentoria Integrada</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Programa de Mentoria e Aceleração
          </h1>
          <p className="text-muted text-xs max-w-xl leading-relaxed">
            Conecte talentos diversos com líderes de tecnologia e promova o desenvolvimento profissional de forma contínua.
          </p>
        </div>
      </div>

      {/* Interactive alert toast */}
      {successMsg && (
        <div className="bg-secondary/15 border border-secondary/20 text-secondary p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn max-w-2xl">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sessions list */}
      <div className="space-y-4 max-w-3xl">
        <h3 className="text-sm font-bold text-text flex items-center gap-2">
          <span>Sessões de Mentoria em Destaque</span>
          <span className="text-[9px] font-bold px-2 py-0.5 badge-secondary rounded-full">
            Novos Mentores
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentorias.map((sessao) => (
            <div 
              key={sessao.id} 
              className="bg-surface rounded-card p-5 border border-border shadow-card hover:border-primary/25 transition-all flex justify-between items-center gap-4 group"
            >
              <div className="flex gap-4 items-center overflow-hidden">
                <img 
                  src={sessao.avatar} 
                  alt={sessao.mentor} 
                  className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120";
                  }}
                />
                <div className="overflow-hidden space-y-1">
                  <h4 className="text-xs font-bold text-text truncate group-hover:text-primary transition-colors">{sessao.mentor}</h4>
                  <p className="text-[10px] text-muted truncate font-medium">{sessao.area}</p>
                  <span className="text-[9px] text-primary flex items-center gap-1 font-bold pt-0.5">
                    <Calendar size={10} />
                    <span>{sessao.data}</span>
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => handleRequestMentoria(sessao.id)}
                className={`py-2 px-3 border rounded-xl text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                  sessao.status === 'Agendada' 
                    ? 'bg-secondary/10 border-secondary/15 text-secondary cursor-default'
                    : sessao.status === 'Solicitada'
                    ? 'bg-accent/15 border-accent/20 text-accent'
                    : 'bg-bg hover:bg-primary border-border hover:border-primary text-text hover:text-white'
                }`}
                disabled={sessao.status === 'Agendada'}
              >
                {sessao.status === 'Agendada' ? 'Agendada' : sessao.status === 'Solicitada' ? 'Cancelar' : 'Solicitar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card max-w-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between premium-card-gradient relative overflow-hidden">
        <div className="flex gap-4 items-center">
          <div className="p-3 dashboard-icon-primary rounded-2xl">
            <HeartHandshake size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text">Cadastre-se como mentor</h4>
            <p className="text-[10px] text-muted leading-relaxed font-medium mt-0.5">
              Compartilhe seu conhecimento técnico e impulsione a carreira de outros colaboradores da empresa.
            </p>
          </div>
        </div>
        <button 
          onClick={handleRegisterAsMentor}
          disabled={isRegistering}
          className="flex items-center gap-1.5 py-2.5 px-4 bg-primary hover:bg-primary-strong disabled:opacity-50 text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          <span>{isRegistering ? 'Processando...' : 'Quero ser Mentor'}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Mentoria;
