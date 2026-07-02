import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Compass,
  BarChart3
} from 'lucide-react';

const METRICS = [
  { id: 1, label: 'Índice de Inclusão', val: '88%', desc: 'Clima e pertencimento', trend: '+4% vs trim. anterior', isUp: true },
  { id: 2, label: 'Taxa de Retenção', val: '94%', desc: 'Talentos diversos', trend: '+1.5% este mês', isUp: true },
  { id: 3, label: 'Equidade Salarial', val: '98%', desc: 'Relação de remuneração', trend: 'Estável', isUp: false }
];

const SaudeTime = () => {
  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Welcome Banner */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Sparkles size={12} />
            <span>Saúde do Time</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Indicadores de Clima e Saúde Corporativa
          </h1>
          <p className="text-muted text-xs max-w-xl leading-relaxed">
            Monitore o pertencimento, equidade e a retenção de talentos diversos dentro da sua organização de forma anônima e segura.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {METRICS.map((metric) => (
          <div 
            key={metric.id} 
            className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden premium-card-gradient"
          >
            <div className="space-y-2">
              <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">{metric.label}</span>
              <h3 className="text-2xl font-extrabold text-text tracking-tight">{metric.val}</h3>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted font-semibold block">{metric.desc}</span>
                <span className={`text-[8px] font-bold flex items-center gap-0.5 ${metric.isUp ? 'text-secondary' : 'text-muted'}`}>
                  {metric.isUp && <TrendingUp size={10} />}
                  <span>{metric.trend}</span>
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-bg rounded-xl border border-border text-muted group-hover:text-primary group-hover:border-primary/20 transition-all">
              {metric.id === 1 && <Heart size={20} />}
              {metric.id === 2 && <Activity size={20} />}
              {metric.id === 3 && <Compass size={20} />}
            </div>
          </div>
        ))}
      </div>

      {/* Details placeholder */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card max-w-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between premium-card-gradient relative overflow-hidden">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-primary/10 border border-primary/10 rounded-2xl text-primary">
            <BarChart3 size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text">Relatório Anual de Impacto ESG</h4>
            <p className="text-[10px] text-muted leading-relaxed font-medium mt-0.5">
              Baixe a análise analítica consolidada de indicadores de diversidade e inclusão do último ano fiscal.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 py-2.5 px-4 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0">
          <span>Exportar PDF</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default SaudeTime;
