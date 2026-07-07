import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Sparkles, 
  ChevronRight, 
  ClipboardList,
  Search,
  Filter,
  ArrowUpRight,
  FolderKanban,
  Brain,
  MapPin,
  Calendar
} from 'lucide-react';

const Pipelines = () => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [seniorityFilter, setSeniorityFilter] = useState('Todos');

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        setLoading(true);
        const [candidaturasRes, vagasRes] = await Promise.all([
          api.get('/candidaturas'),
          api.get('/vagas')
        ]);
        setCandidaturas(candidaturasRes.data || []);
        setVagas(vagasRes.data || []);
        
        // Auto-select first vacancy if available
        if (vagasRes.data && vagasRes.data.length > 0) {
          setSelectedVaga(vagasRes.data[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar dados no pipeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPipelineData();
  }, []);

  const getCounts = (statusList) => {
    let triagem = 0;
    let teste = 0;
    let entrevista = 0;
    let contratado = 0;

    statusList.forEach(c => {
      const s = (c.status || '').toLowerCase();
      if (s.includes('analise') || s.includes('triagem') || s.includes('pendente')) {
        triagem++;
      } else if (s.includes('teste')) {
        teste++;
      } else if (s.includes('entrevista')) {
        entrevista++;
      } else if (s.includes('contratado') || s.includes('aprovado')) {
        contratado++;
      }
    });

    return { triagem, teste, entrevista, contratado };
  };

  const getCandidatosCountForVaga = (vagaId) => {
    return candidaturas.filter(c => c.vaga_id === vagaId).length;
  };

  // Vacancies filtering logic
  const filteredVagas = vagas.filter(vaga => {
    const matchesSearch = 
      vaga.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vaga.cargo && vaga.cargo.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesSeniority = true;
    if (seniorityFilter !== 'Todos') {
      const vSeniority = (vaga.senioridade || '').toLowerCase();
      const vTitle = vaga.titulo.toLowerCase();
      
      if (seniorityFilter === 'Estágio') {
        matchesSeniority = 
          vTitle.includes('estágio') || 
          vTitle.includes('estagio') || 
          vTitle.includes('estagiário') || 
          vTitle.includes('estagiario') || 
          vSeniority.includes('estágio') || 
          vSeniority.includes('estagio');
      } else {
        matchesSeniority = vSeniority.includes(seniorityFilter.toLowerCase()) || vTitle.includes(seniorityFilter.toLowerCase());
      }
    }

    return matchesSearch && matchesSeniority;
  });

  const activeVagaCandidaturas = selectedVaga 
    ? candidaturas.filter(c => c.vaga_id === selectedVaga.vaga_id)
    : [];

  const counts = getCounts(activeVagaCandidaturas);

  const PIPELINE_ETAPAS = [
    { id: 1, nome: 'Triagem Inicial', count: counts.triagem, color: 'border-l-primary' },
    { id: 2, nome: 'Teste Técnico', count: counts.teste, color: 'border-l-secondary' },
    { id: 3, nome: 'Entrevista Cultural', count: counts.entrevista, color: 'border-l-accent' },
    { id: 4, nome: 'Proposta / Contratação', count: counts.contratado, color: 'border-l-green-500' }
  ];

  const seniorityOptions = ['Todos', 'Estágio', 'Júnior', 'Pleno', 'Sênior'];

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

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Search & Vacancies List (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface border border-border rounded-card p-5 shadow-card space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">Vagas Ativas</h3>
              <p className="text-[10px] text-muted font-medium">Filtre e selecione a vaga desejada.</p>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 px-3 py-2 bg-bg border border-border rounded-xl focus-within:border-primary transition-all">
              <Search size={14} className="text-muted" />
              <input
                type="text"
                placeholder="Buscar por cargo ou título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-text outline-none w-full"
              />
            </div>

            {/* Seniority Selector Filter Pills */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Filter size={10} />
                <span>Nível / Senioridade:</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {seniorityOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setSeniorityFilter(option)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer select-none ${
                      seniorityFilter === option
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-bg text-muted hover:text-text hover:bg-surface-hover border border-border/80'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vacancies Cards List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 text-center text-xs text-muted font-medium">
                Carregando vagas...
              </div>
            ) : filteredVagas.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted font-medium bg-surface rounded-card border border-border">
                Nenhuma vaga encontrada para os filtros aplicados.
              </div>
            ) : (
              filteredVagas.map(vaga => {
                const count = getCandidatosCountForVaga(vaga.vaga_id);
                const isSelected = selectedVaga && selectedVaga.vaga_id === vaga.vaga_id;

                return (
                  <div
                    key={vaga.vaga_id}
                    onClick={() => setSelectedVaga(vaga)}
                    className={`cursor-pointer rounded-card p-4 border transition-all duration-200 select-none flex items-center justify-between gap-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-surface border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-text truncate leading-snug" title={vaga.titulo}>
                        {vaga.titulo}
                      </h4>
                      <div className="flex items-center flex-wrap gap-1 text-[9px] text-muted font-medium">
                        <span>{vaga.cargo || 'Cargo indefinido'}</span>
                        <span>•</span>
                        <span>{vaga.senioridade || 'Geral'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-bg border border-border rounded text-text">
                        {count} cand.
                      </span>
                      <ChevronRight size={14} className={`text-muted transition-transform ${isSelected ? 'translate-x-0.5 text-primary' : ''}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed Funnel and Metrics (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {selectedVaga ? (
            <div className="bg-surface border border-border rounded-card p-6 shadow-card space-y-6">
              {/* Vaga Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/80">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-muted flex items-center gap-1">
                    <Calendar size={10} />
                    Publicada em {new Date(selectedVaga.data_cadastro).toLocaleDateString()}
                  </span>
                  <h2 className="text-base font-bold text-text leading-snug">{selectedVaga.titulo}</h2>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVaga.modalidade && (
                      <span className="text-[9px] font-bold px-2 py-0.5 badge-secondary rounded flex items-center gap-1">
                        <MapPin size={9} />
                        {selectedVaga.modalidade}
                      </span>
                    )}
                    {selectedVaga.recrutador_responsavel && (
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-bg border border-border rounded text-muted">
                        Resp: {selectedVaga.recrutador_responsavel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-3.5 py-2 bg-bg border border-border rounded-xl text-center shrink-0 w-full sm:w-auto">
                  <span className="text-[9px] text-muted block uppercase tracking-wider font-bold">Total no Processo</span>
                  <span className="text-base font-black text-primary">{activeVagaCandidaturas.length} candidatos</span>
                </div>
              </div>

              {/* Pipeline Funnel Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {PIPELINE_ETAPAS.map((etapa) => (
                  <div 
                    key={etapa.id} 
                    className={`bg-bg rounded-xl p-4 border border-border border-l-4 ${etapa.color} flex flex-col justify-between h-28 shadow-sm`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-muted block uppercase tracking-wider font-extrabold">Etapa {etapa.id}</span>
                      <h4 className="text-[10px] font-bold text-text truncate leading-relaxed">
                        {etapa.nome}
                      </h4>
                    </div>
                    
                    <div>
                      <span className="text-xl font-black text-text">{loading ? '...' : etapa.count}</span>
                      <span className="text-[8px] text-muted font-bold block mt-0.5">Ativos</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button Link to Matching */}
              <div className="pt-2">
                <Link
                  to={`/dashboard/vagas/${selectedVaga.vaga_id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] select-none"
                >
                  <Brain size={14} className="shrink-0" />
                  <span>Gerenciar Candidatos & Triagem IA</span>
                  <ArrowUpRight size={14} className="shrink-0" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-card p-12 border border-border shadow-card flex flex-col items-center justify-center text-center min-h-[360px] text-text">
              <div className="p-4 dashboard-icon-primary rounded-2xl mb-4">
                <FolderKanban size={28} />
              </div>
              <h3 className="text-sm font-bold">Nenhuma Vaga Selecionada</h3>
              <p className="text-xs text-muted max-w-xs mt-1.5 leading-relaxed font-medium">
                Selecione uma vaga na lista ao lado para carregar as métricas de contratação e transições de etapas.
              </p>
            </div>
          )}

          {/* Kanban / Info Card */}
          <div className="bg-surface rounded-card p-5 border border-border shadow-card flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between premium-card-gradient relative overflow-hidden">
            <div className="flex gap-4 items-center">
              <div className="p-3 dashboard-icon-neutral rounded-2xl shrink-0">
                <ClipboardList size={22} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text">Gerenciar Candidatos e Metas ESG</h4>
                <p className="text-[10px] text-muted leading-relaxed font-medium mt-0.5">
                  Mova candidatos entre as fases e contrate profissionais na tela de matching para atualizar os relatórios ESG em tempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipelines;
