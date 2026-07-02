import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getDiversityStats } from '../services/matchingService';
import { 
  Briefcase, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const [vagasCount, setVagasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const stats = getDiversityStats();

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
            <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">Meta ESG Anual</span>
            <h3 className="text-2xl font-extrabold text-text tracking-tight">
              {stats.esgTarget}%
            </h3>
            <span className="text-[10px] text-muted block font-medium">
              Representação em cargos tech
            </span>
          </div>
          <div className="p-3 dashboard-icon-neutral rounded-xl transition-all">
            <Target size={20} />
          </div>
        </div>

        {/* Index Card */}
        <div className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between group cursor-pointer relative overflow-hidden premium-card-gradient">
          <div className="space-y-2">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-bold">Índice de Diversidade</span>
            <h3 className="text-2xl font-extrabold text-primary tracking-tight">
              {stats.currentProgress}%
            </h3>
            <span className="text-[10px] text-secondary flex items-center gap-1 font-bold">
              <TrendingUp size={12} />
              <span>+2.4% este mês</span>
            </span>
          </div>
          <div className="p-3 dashboard-icon-primary rounded-xl transition-all">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Grid: ESG Stats & Algorithms Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ESG Goals Progress - Left Column (3/5) */}
        <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card lg:col-span-3 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-text">Indicadores de Diversidade e Metas ESG</h3>
              <p className="text-xs text-muted mt-1 leading-snug">Acompanhamento de representatividade de minorias em tecnologia.</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-muted block uppercase tracking-wider">Status Geral</span>
              <span className="text-xs font-extrabold text-primary mt-0.5 block">{stats.currentProgress}% de {stats.esgTarget}%</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-5">
            {/* Mulheres */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-text">Mulheres</span>
                <span className="text-muted">{stats.mulheres}% <span className="text-muted/60">/ Meta: 50%</span></span>
              </div>
              <div className="w-full h-2.5 bg-bg border border-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000" style={{ width: `${stats.mulheres}%` }}></div>
              </div>
            </div>

            {/* Negros */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-text">Negros / Pardos</span>
                <span className="text-muted">{stats.negros}% <span className="text-muted/60">/ Meta: 45%</span></span>
              </div>
              <div className="w-full h-2.5 bg-bg border border-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000" style={{ width: `${stats.negros}%` }}></div>
              </div>
            </div>

            {/* LGBTQIA+ */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-text">LGBTQIA+</span>
                <span className="text-muted">{stats.lgbt}% <span className="text-muted/60">/ Meta: 20%</span></span>
              </div>
              <div className="w-full h-2.5 bg-bg border border-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000" style={{ width: `${stats.lgbt}%` }}></div>
              </div>
            </div>

            {/* Baixa Renda */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-text">Ensino Público / Baixa Renda</span>
                <span className="text-muted">{stats.baixaRenda}% <span className="text-muted/60">/ Meta: 30%</span></span>
              </div>
              <div className="w-full h-2.5 bg-bg border border-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000" style={{ width: `${stats.baixaRenda}%` }}></div>
              </div>
            </div>

            {/* PCD */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-text">Pessoas com Deficiência (PCD)</span>
                <span className="text-muted">{stats.pcd}% <span className="text-muted/60">/ Meta: 10%</span></span>
              </div>
              <div className="w-full h-2.5 bg-bg border border-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000" style={{ width: `${stats.pcd}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Explainability / AI Engine Core values - Right Column (2/5) */}
        <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card lg:col-span-2 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 badge-primary rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-sm font-bold text-text">Filtro Anti-Viés Inclusi.va</h4>
            </div>

            <p className="text-muted text-xs leading-relaxed font-medium">
              O motor de matching do Inclusi.va foi construído para blindar a triagem de candidatos de vieses inconscientes de forma inteligente.
            </p>

            <ul className="space-y-3.5 text-xs text-text">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                <p className="leading-relaxed">
                  <strong className="font-bold text-text">Explicabilidade Algorítmica:</strong> Entenda o motivo de cada score com base nas competências e fit real.
                </p>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                <p className="leading-relaxed">
                  <strong className="font-bold text-text">Blindagem de Dados:</strong> Análise ética que separa marcadores de diversidade de avaliações de mérito técnico.
                </p>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                <p className="leading-relaxed">
                  <strong className="font-bold text-text">Apoio a Metas ESG:</strong> Recomendação ponderada inteligente que alinha a contratação às metas da empresa.
                </p>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-bg border border-border rounded-xl flex items-center gap-3">
            <HeartHandshake size={20} className="text-primary shrink-0" />
            <p className="text-[10px] text-muted leading-relaxed font-medium">
              Alinhado ao programa <strong className="text-text font-bold">Hackathon Wongola</strong> para democratizar oportunidades em tecnologia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
