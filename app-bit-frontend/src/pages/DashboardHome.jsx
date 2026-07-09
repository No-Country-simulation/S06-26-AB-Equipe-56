import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Briefcase, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardEsgAderencia from '../components/DashboardEsgAderencia';

const DashboardHome = () => {
  const { user } = useAuth();
  const [vagasCount, setVagasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [esgData, setEsgData] = useState(null);
  const [esgError, setEsgError] = useState(null);
  const [esgLoading, setEsgLoading] = useState(true);

  const fetchEsgReport = async () => {
    try {
      const response = await api.get('/metas/relatorio');
      setEsgData(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatorio ESG:', error);
      setEsgError('Não foi possível carregar os dados de aderência ESG do servidor backend.');
    } finally {
      setEsgLoading(false);
    }
  };

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await api.get('/vagas');
        setVagasCount(response.data.length);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
    fetchEsgReport();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Welcome Banner */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Sparkles size={12} />
            <span>Motor de Recrutamento Ativo</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Olá, {user?.nome}!
          </h1>
          <p className="text-muted text-xs max-w-xl leading-relaxed">
            Bem-vindo ao painel estratégico do <strong className="font-extrabold text-text">Inclusi<span className="text-primary">.va</span></strong>. Acompanhe os indicadores de diversidade e gerencie vagas com matching inteligente anti-viés.
          </p>
        </div>

        <div className="flex gap-3 z-10 shrink-0">
          <Link
            to="/dashboard/vagas"
            className="flex items-center gap-2 py-2.5 px-5 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-lg hover:shadow-primary/10 cursor-pointer active:scale-95"
          >
            <span>Ver Vagas</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist Widget */}
      {(!esgLoading && !loading && ((esgData && esgData.length === 0) || vagasCount === 0)) && (
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-surface rounded-card p-6 border-2 border-primary/20 shadow-lg relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 badge-secondary rounded-lg">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text uppercase tracking-wider">
                Guia de Integração B2B
              </h2>
              <p className="text-[11px] text-muted font-medium mt-0.5">
                Complete as etapas recomendadas abaixo para acelerar a estratégia de diversidade da sua empresa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1: ESG Goals */}
            <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
              esgData && esgData.length > 0 
                ? 'bg-secondary/5 border-secondary/20 text-text' 
                : 'bg-surface border-border hover:border-primary/30'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted font-mono">Passo 1</span>
                  {esgData && esgData.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase bg-secondary/15 text-secondary px-2 py-0.5 rounded-md border border-secondary/10">
                      Concluído
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase bg-accent/15 text-accent px-2 py-0.5 rounded-md border border-accent/10 animate-pulse">
                      Pendente
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-text">Definir Metas ESG</h4>
                <p className="text-[10px] text-muted leading-relaxed font-medium">
                  Cadastre as metas de diversidade da empresa para habilitar os cálculos de aderência e triagem Inteligente.
                </p>
              </div>
              {!(esgData && esgData.length > 0) && (
                <button
                  onClick={() => {
                    const btn = document.querySelector('[data-open-esg-modal]');
                    if (btn) {
                      btn.click();
                    } else {
                      // Fallback: scroll to bottom where the goals list is
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                  className="w-full text-center py-2 px-3 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer"
                >
                  Configurar Metas
                </button>
              )}
            </div>

            {/* Step 2: Publish Job */}
            <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
              vagasCount > 0 
                ? 'bg-secondary/5 border-secondary/20 text-text' 
                : 'bg-surface border-border hover:border-primary/30'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted font-mono">Passo 2</span>
                  {vagasCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase bg-secondary/15 text-secondary px-2 py-0.5 rounded-md border border-secondary/10">
                      Concluído
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase bg-accent/15 text-accent px-2 py-0.5 rounded-md border border-accent/10">
                      Pendente
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-text">Publicar Vaga</h4>
                <p className="text-[10px] text-muted leading-relaxed font-medium">
                  Abra uma oportunidade com requisitos e veja a IA do Inclusi.va retornar a shortlist de candidatos recomendados.
                </p>
              </div>
              {vagasCount === 0 && (
                <Link
                  to="/dashboard/vagas"
                  className="w-full text-center py-2 px-3 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-[10px] transition-all text-xs"
                >
                  Ir para Vagas
                </Link>
              )}
            </div>

            {/* Step 3: Invite Team */}
            <div className="p-4 bg-surface border border-border hover:border-primary/30 rounded-xl transition-all flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted font-mono">Passo 3</span>
                  <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase bg-bg text-muted px-2 py-0.5 rounded-md border border-border">
                    Equipe
                  </span>
                </div>
                <h4 className="text-xs font-bold text-text">Convidar Recrutadores</h4>
                <p className="text-[10px] text-muted leading-relaxed font-medium">
                  Adicione outros membros do time de RH e colabore na gestão de pipelines e contratação afirmativa.
                </p>
              </div>
              <Link
                to="/dashboard/equipe"
                className="w-full text-center py-2 px-3 bg-bg hover:bg-surface border border-border text-text font-bold rounded-xl text-[10px] transition-all"
              >
                Convidar Membros
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vagas Card */}
        <div className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden premium-card-gradient">
          <div className="space-y-2">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">Vagas Cadastradas</span>
            <h3 className="text-2xl font-extrabold text-text tracking-tight">
              {loading ? '...' : vagasCount}
            </h3>
            <span className="text-[10px] text-muted block group-hover:text-primary transition-colors font-medium">
              Processo seletivo ativo
            </span>
          </div>
          <div className="p-3 dashboard-icon-neutral rounded-xl transition-all">
            <Briefcase size={20} />
          </div>
        </div>

        {/* ESG Target Card */}
        <div className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden premium-card-gradient">
          <div className="space-y-2">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">Meta ESG Média</span>
            <h3 className="text-2xl font-extrabold text-text tracking-tight">
              {esgLoading ? '...' : (esgData && esgData.length > 0 ? `${Math.round(esgData.reduce((acc, curr) => acc + parseFloat(curr.meta || 0), 0) / esgData.length)}%` : '0%')}
            </h3>
            <span className="text-[10px] text-muted block font-medium">
              {esgData && esgData.length > 0 ? 'Média das metas salvas' : 'Defina metas abaixo'}
            </span>
          </div>
          <div className="p-3 dashboard-icon-neutral rounded-xl transition-all">
            <Target size={20} />
          </div>
        </div>

        {/* Index Card */}
        <div className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden premium-card-gradient">
          <div className="space-y-2">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">Aderência ESG Média</span>
            <h3 className="text-2xl font-extrabold text-primary tracking-tight">
              {esgLoading ? '...' : (esgData && esgData.length > 0 ? `${Math.min(100, Math.round(esgData.reduce((acc, curr) => {
                const metaVal = parseFloat(curr.meta || 0);
                const progress = metaVal > 0 ? (parseInt(curr.contratacoes_realizadas || 0, 10) / metaVal) * 100 : 0;
                return acc + progress;
              }, 0) / esgData.length))}%` : '0%')}
            </h3>
            <span className="text-[10px] text-secondary flex items-center gap-1 font-bold">
              {esgData && esgData.length > 0 ? (
                <>
                  <TrendingUp size={12} />
                  <span>Progresso das metas</span>
                </>
              ) : (
                <span className="text-muted">Aguardando metas</span>
              )}
            </span>
          </div>
          <div className="p-3 dashboard-icon-primary rounded-xl transition-all">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      {/* Dashboard de Aderência ESG */}
      <DashboardEsgAderencia 
        dados={esgData} 
        erro={esgError} 
        loading={esgLoading} 
        onMetaAdicionada={fetchEsgReport}
        isAdmin={user?.permissao_id === 1}
      />

      {/* Filtro Anti-Viés Explanation */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 badge-primary rounded-xl">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-text">Filtro Anti-Viés Inclusi.va</h4>
          </div>

          <p className="text-muted text-xs leading-relaxed font-medium">
            O motor de matching do Inclusi.va foi construído para blindar a triagem de candidatos de vieses inconscientes de forma inteligente.
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text pt-2">
            <li className="flex items-start gap-2.5 bg-bg/50 border border-border/40 p-3.5 rounded-xl">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
              <p className="leading-relaxed">
                <strong className="font-bold text-text block mb-0.5">Explicabilidade Algorítmica:</strong> Entenda o motivo de cada score com base nas competências e fit real.
              </p>
            </li>
            <li className="flex items-start gap-2.5 bg-bg/50 border border-border/40 p-3.5 rounded-xl">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
              <p className="leading-relaxed">
                <strong className="font-bold text-text block mb-0.5">Blindagem de Dados:</strong> Análise ética que separa marcadores de diversidade de avaliações de mérito técnico.
              </p>
            </li>
            <li className="flex items-start gap-2.5 bg-bg/50 border border-border/40 p-3.5 rounded-xl">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
              <p className="leading-relaxed">
                <strong className="font-bold text-text block mb-0.5">Apoio a Metas ESG:</strong> Recomendação ponderada inteligente que alinha a contratação às metas da empresa.
              </p>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-bg border border-border rounded-xl flex items-center gap-3 self-center md:max-w-xs shrink-0">
          <HeartHandshake size={20} className="text-primary shrink-0" />
          <p className="text-[10px] text-muted leading-relaxed font-medium">
            Alinhado ao programa <strong className="text-text font-bold">Hackathon Wongola</strong> para democratizar oportunidades em tecnologia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
