import React from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

const PIPELINE_ETAPAS = [
  { id: 1, nome: 'Triagem Inicial', count: 12, color: 'border-l-primary' },
  { id: 2, nome: 'Teste Técnico', count: 5, color: 'border-l-secondary' },
  { id: 3, nome: 'Entrevista Cultural', count: 3, color: 'border-l-accent' },
  { id: 4, nome: 'Proposta / Contratação', count: 2, color: 'border-l-green-500' }
];

const Pipelines = () => {
  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Welcome Banner */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Sparkles size={12} />
            <span>Pipelines de Recrutamento</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Funil de Contratação Inclusiva
          </h1>
          <p className="text-muted text-xs max-w-xl leading-relaxed">
            Acompanhe a distribuição de candidatos pelas etapas do processo seletivo estruturado e blindado contra vieses inconscientes.
          </p>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PIPELINE_ETAPAS.map((etapa) => (
          <div 
            key={etapa.id} 
            className={`bg-surface rounded-card p-5 border border-border border-l-4 ${etapa.color} shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-44`}
          >
            <div className="space-y-2">
              <span className="text-[10px] text-muted block uppercase tracking-wider font-extrabold">Etapa {etapa.id}</span>
              <h3 className="text-sm font-bold text-text truncate leading-snug">
                {etapa.nome}
              </h3>
            </div>
            
            <div className="flex justify-between items-end border-t border-border/60 pt-4 mt-2">
              <div>
                <span className="text-2xl font-black text-text">{etapa.count}</span>
                <span className="text-[9px] text-muted font-bold block">Candidatos ativos</span>
              </div>
              <button className="p-2 bg-bg hover:bg-primary/5 border border-border rounded-xl text-muted hover:text-primary transition-all cursor-pointer">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card max-w-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between premium-card-gradient relative overflow-hidden">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-primary/10 border border-primary/10 rounded-2xl text-primary">
            <ClipboardList size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text">Gerenciar painel Kanban</h4>
            <p className="text-[10px] text-muted leading-relaxed font-medium mt-0.5">
              Visualize seus candidatos no formato de cartões e arraste-os para atualizar o status instantaneamente.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 py-2.5 px-4 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0">
          <span>Abrir Kanban</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Pipelines;
