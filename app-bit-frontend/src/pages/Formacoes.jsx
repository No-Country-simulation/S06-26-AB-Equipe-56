import React, { useState } from 'react';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Play, 
  Award,
  Sparkles,
  X,
  BookMarked
} from 'lucide-react';

const INITIAL_TRILHAS = [
  {
    id: 'TR-001',
    categoria: 'Core RH',
    obrigatoria: true,
    titulo: 'Recrutamento Sem Viés',
    duracao: '120 min',
    progresso: 40,
    modulosCount: 2,
    modulos: [
      { id: 'M1', titulo: 'Conceitos de Viés Inconsciente', concluido: true },
      { id: 'M2', titulo: 'Técnicas de Entrevista Cega', concluido: false }
    ]
  },
  {
    id: 'TR-002',
    categoria: 'Inicie por aqui',
    obrigatoria: false,
    titulo: 'Cultura Inclusiva no Trabalho',
    duracao: '90 min',
    progresso: 20,
    modulosCount: 1,
    modulos: [
      { id: 'M1', titulo: 'Comunicação Empática e Diversidade', concluido: false }
    ]
  },
  {
    id: 'TR-003',
    categoria: 'Mitigação de Viés',
    obrigatoria: true,
    titulo: 'Mitigação de Viés',
    duracao: '60 min',
    progresso: 75,
    modulosCount: 1,
    modulos: [
      { id: 'M1', titulo: 'Estratégias de Equidade de Gênero', concluido: false }
    ]
  }
];

const Formacoes = () => {
  const [trilhas, setTrilhas] = useState(INITIAL_TRILHAS);
  const [selectedTrilha, setSelectedTrilha] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenTrilha = (trilha) => {
    setSelectedTrilha(trilha);
    setModalOpen(true);
  };

  const handleToggleModulo = (trilhaId, moduloId) => {
    const updatedTrilhas = trilhas.map(t => {
      if (t.id === trilhaId) {
        const updatedModulos = t.modulos.map(m => {
          if (m.id === moduloId) {
            return { ...m, concluido: !m.concluido };
          }
          return m;
        });
        
        // Calculate new progress based on concluded modules
        const concluidosCount = updatedModulos.filter(m => m.concluido).length;
        const newProgress = Math.round((concluidosCount / updatedModulos.length) * 100);
        
        return {
          ...t,
          modulos: updatedModulos,
          progresso: newProgress
        };
      }
      return t;
    });

    setTrilhas(updatedTrilhas);
    // Update selected trilha state to update modal view immediately
    const updatedSelected = updatedTrilhas.find(t => t.id === trilhaId);
    setSelectedTrilha(updatedSelected);
  };

  // Calculate overall stats
  const totalTrilhas = trilhas.length;
  const concluídasCount = trilhas.filter(t => t.progresso === 100).length;
  const totalProgressoPercent = Math.round(
    trilhas.reduce((acc, curr) => acc + curr.progresso, 0) / totalTrilhas
  );

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Top Welcome / Metric section */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Sparkles size={12} />
            <span>Formações ESG & Cultura</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Trilhas de conhecimento e capacitação
          </h1>
          <p className="text-muted text-xs max-w-xl leading-relaxed">
            Acompanhe seu progresso em ESG, diversidade e inclusão com trilhas estruturadas para fortalecer a cultura interna.
          </p>
        </div>

        {/* Global Progress Box */}
        <div className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl shrink-0 z-10 min-w-[200px] flex justify-between items-center group hover:border-primary/20 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-extrabold">Progresso Geral</span>
            <div className="text-2xl font-black text-primary tracking-tight">
              {totalProgressoPercent}%
            </div>
            <span className="text-[9px] text-muted font-bold block uppercase mt-0.5">
              {concluídasCount} de {totalTrilhas} trilhas concluídas
            </span>
          </div>
          <div className="h-10 w-10 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Grid of Trails */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trilhas.map((trilha) => (
          <div 
            key={trilha.id}
            className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between gap-6 group cursor-pointer relative overflow-hidden premium-card-gradient"
            onClick={() => handleOpenTrilha(trilha)}
          >
            {/* Upper tags & Code */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-[10px] font-mono font-black text-muted block uppercase tracking-wider">
                  CÓD: {trilha.id}
                </span>
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-bg border border-border rounded-md text-muted uppercase">
                    {trilha.categoria}
                  </span>
                  {trilha.obrigatoria && (
                    <span className="text-[9px] font-bold px-2 py-0.5 badge-primary rounded-md uppercase">
                      Obrigatória
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors leading-snug">
                {trilha.titulo}
              </h3>

              {/* Duration with Clock */}
              <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold">
                <Clock size={12} className="text-muted" />
                <span>{trilha.duracao}</span>
              </div>
            </div>

            {/* Progress Area */}
            <div className="space-y-2 border-t border-border/60 pt-4">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-muted">Progresso</span>
                <span className="text-primary">{trilha.progresso}%</span>
              </div>
              <div className="w-full h-2 bg-bg border border-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${trilha.progresso}%` }}
                ></div>
              </div>
            </div>

            {/* Bottom count & Button */}
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-muted font-bold flex items-center gap-1.5">
                <BookOpen size={12} className="text-muted" />
                <span>{trilha.modulosCount} módulos</span>
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenTrilha(trilha);
                }}
                className="flex items-center gap-1.5 py-2 px-4 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                <span>{trilha.progresso === 100 ? 'Revisar' : 'Iniciar trilha'}</span>
                <Play size={10} fill="white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trilha Details / Interaction Modal */}
      {modalOpen && selectedTrilha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          
          <div className="w-full max-w-lg bg-surface border border-border rounded-card overflow-hidden shadow-card z-10 animate-scaleIn">
            {/* Header */}
            <div className="h-16 border-b border-border px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookMarked size={18} className="text-primary" />
                <div className="text-xs">
                  <span className="text-muted font-bold uppercase tracking-wider block text-[9px]">Módulos de Formação</span>
                  <span className="text-text font-black">{selectedTrilha.titulo}</span>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-text transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info grid */}
              <div className="flex justify-between items-center flex-wrap gap-3 bg-bg border border-border p-4 rounded-2xl">
                <div className="text-[10px]">
                  <span className="text-muted block uppercase tracking-wider font-bold">Identificação da Trilha</span>
                  <span className="font-mono text-text block truncate select-all mt-0.5 font-bold">{selectedTrilha.id}</span>
                </div>
                <div className="text-[10px] text-right">
                  <span className="text-muted block uppercase tracking-wider font-bold">Duração Estimada</span>
                  <span className="text-primary block mt-0.5 font-black">{selectedTrilha.duracao}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-text">Progresso Atual</span>
                  <span className="text-primary">{selectedTrilha.progresso}%</span>
                </div>
                <div className="w-full h-2 bg-bg border border-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                    style={{ width: `${selectedTrilha.progresso}%` }}
                  ></div>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Conteúdo da Trilha</h4>
                <div className="space-y-2.5">
                  {selectedTrilha.modulos.map((modulo) => (
                    <div 
                      key={modulo.id}
                      onClick={() => handleToggleModulo(selectedTrilha.id, modulo.id)}
                      className="p-3.5 bg-bg hover:bg-surface border border-border hover:border-primary/20 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                          modulo.concluido 
                            ? 'bg-secondary/15 border-secondary text-secondary' 
                            : 'border-border text-muted group-hover:border-primary/40'
                        }`}>
                          {modulo.concluido && <CheckCircle size={12} fill="currentColor" className="text-surface" />}
                        </div>
                        <span className={`text-xs font-bold transition-all ${
                          modulo.concluido ? 'text-muted line-through' : 'text-text group-hover:text-primary'
                        }`}>
                          {modulo.titulo}
                        </span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        modulo.concluido 
                          ? 'bg-secondary/10 border-secondary/10 text-secondary' 
                          : 'bg-bg/40 border-border text-muted'
                      }`}>
                        {modulo.concluido ? 'Concluído' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="h-16 border-t border-border px-6 flex items-center justify-between">
              <p className="text-[9px] text-muted leading-relaxed font-bold max-w-[280px]">
                💡 Dica: Clique nos módulos acima para simular a conclusão e atualizar o progresso!
              </p>
              <button 
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Concluir Trilha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Formacoes;
