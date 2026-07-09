import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Play, 
  Award,
  Sparkles,
  X,
  BookMarked,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Video,
  FileText,
  Volume2,
  Maximize,
  Check,
  AlertCircle
} from 'lucide-react';

const getVideoCredits = (trilhaId) => {
  switch (Number(trilhaId)) {
    case 1:
      return "Pod Ser Humano";
    case 2:
      return "Sebrae Talks";
    case 3:
      return "Boitempo";
    case 4:
      return "MCIO Brasil";
    case 5:
      return "Claudia Elisa Oficial";
    default:
      return "YouTube";
  }
};

const parseDescricao = (text) => {
  if (!text) return { intro: [], sections: [], bibliografia: '' };
  
  const lines = text.split('\n');
  let intro = [];
  let sections = [];
  let currentSection = null;
  let bibliografia = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.toLowerCase().startsWith('fonte bibliográfica:')) {
      bibliografia = line.replace(/^[Ff]onte\s+bibliográfica:\s*/i, '').trim();
      continue;
    }

    const sectionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (sectionMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        number: sectionMatch[1],
        title: sectionMatch[2],
        content: [],
        bullets: []
      };
      continue;
    }

    if (currentSection) {
      if (line.startsWith('•')) {
        const bulletContent = line.substring(1).trim();
        const splitIdx = bulletContent.indexOf(':');
        if (splitIdx !== -1) {
          const title = bulletContent.substring(0, splitIdx).trim();
          const desc = bulletContent.substring(splitIdx + 1).trim();
          currentSection.bullets.push({ title, desc });
        } else {
          currentSection.bullets.push({ title: '', desc: bulletContent });
        }
      } else {
        currentSection.content.push(line);
      }
    } else {
      if (!line.includes('---')) {
        intro.push(line);
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { intro, sections, bibliografia };
};

const Formacoes = () => {
  // Catalog State
  const [trilhas, setTrilhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSectionIdx, setOpenSectionIdx] = useState(0);
  const [error, setError] = useState('');

  // Course Player State
  const [playerMode, setPlayerMode] = useState(false);
  const [selectedTrilha, setSelectedTrilha] = useState(null);
  const [activeModuloId, setActiveModuloId] = useState(null);
  const [activeStep, setActiveStep] = useState('video'); // 'video', 'leitura', 'quiz'
  
  const [moduloDetalhes, setModuloDetalhes] = useState(null);
  const [loadingModulo, setLoadingModulo] = useState(false);
  const [errorModulo, setErrorModulo] = useState('');

  // Sub-step completion states
  const [videoWatchedMap, setVideoWatchedMap] = useState({});
  const [readingCompletedMap, setReadingCompletedMap] = useState({});

  // Quiz Attempt State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [retakingQuiz, setRetakingQuiz] = useState(false);

  // Video Mock State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(30); // percentage
  const [videoSpeed, setVideoSpeed] = useState('1.0x');

  const fetchTrilhas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/trilhas');
      setTrilhas(response.data || []);
      
      // Update selectedTrilha in background if we are inside player mode
      if (selectedTrilha) {
        const updatedSelected = (response.data || []).find(t => t.id === selectedTrilha.id);
        if (updatedSelected) {
          setSelectedTrilha(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar trilhas:', err);
      setError('Erro ao carregar as trilhas do servidor. Verifique a conexão com o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrilhas();
  }, []);

  const handleOpenTrilha = (trilha) => {
    setSelectedTrilha(trilha);
    setPlayerMode(true);
    // Automatically select the first module
    if (trilha.modulos && trilha.modulos.length > 0) {
      handleSelectModulo(trilha.modulos[0].id, 'video');
    }
  };

  const handleSelectModulo = async (moduloId, step = 'video') => {
    try {
      setLoadingModulo(true);
      setErrorModulo('');
      setQuizAnswers({});
      setQuizResult(null);
      setRetakingQuiz(false);
      setIsPlaying(false);
      setVideoProgress(15);
      setOpenSectionIdx(0);

      const res = await api.get(`/trilhas/modulos/${moduloId}/detalhes`);
      const details = res.data;
      setModuloDetalhes(details);
      setActiveModuloId(moduloId);
      setActiveStep(step);

      // If the module is already completed in the DB, pre-check video and reading
      if (details.modulo.concluido) {
        setVideoWatchedMap(prev => ({ ...prev, [moduloId]: true }));
        setReadingCompletedMap(prev => ({ ...prev, [moduloId]: true }));
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes do módulo:', err);
      setErrorModulo('Erro ao carregar os detalhes do módulo do servidor.');
    } finally {
      setLoadingModulo(false);
    }
  };

  const handleToggleModuloLeitura = async () => {
    if (!moduloDetalhes) return;
    
    // Toggle state locally
    const currentVal = !!readingCompletedMap[activeModuloId];
    setReadingCompletedMap(prev => ({ ...prev, [activeModuloId]: !currentVal }));

    // If the module has NO questionnaire, marking reading completed can toggle the module completion in DB
    if (!moduloDetalhes.questionario) {
      try {
        setLoadingModulo(true);
        await api.post(`/trilhas/modulos/${activeModuloId}/toggle`);
        
        // Refresh details and catalog
        const res = await api.get(`/trilhas/modulos/${activeModuloId}/detalhes`);
        setModuloDetalhes(res.data);
        await fetchTrilhas();
      } catch (err) {
        console.error('Erro ao alternar progresso:', err);
      } finally {
        setLoadingModulo(false);
      }
    }
  };

  const handleSelectAlternative = (questaoId, alternativaId) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questaoId]: alternativaId
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!moduloDetalhes || !moduloDetalhes.questionario) return;
    
    // Format answers array
    const respostas = Object.entries(quizAnswers).map(([qId, aId]) => ({
      questao_id: parseInt(qId, 10),
      alternativa_id: aId
    }));

    try {
      setSubmittingQuiz(true);
      const res = await api.post(`/trilhas/questionarios/${moduloDetalhes.questionario.id}/submeter`, {
        respostas
      });
      setQuizResult(res.data);
      
      // Update details to get completion status updated and refresh general progress
      const resDetails = await api.get(`/trilhas/modulos/${activeModuloId}/detalhes`);
      setModuloDetalhes(resDetails.data);
      await fetchTrilhas();
    } catch (err) {
      console.error('Erro ao enviar questionário:', err);
      alert('Erro ao enviar respostas do quiz. Tente novamente.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Navigate to next module in the trail
  const handleNextModulo = () => {
    if (!selectedTrilha || !selectedTrilha.modulos) return;
    const currentIndex = selectedTrilha.modulos.findIndex(m => m.id === activeModuloId);
    if (currentIndex !== -1 && currentIndex < selectedTrilha.modulos.length - 1) {
      handleSelectModulo(selectedTrilha.modulos[currentIndex + 1].id, 'video');
    }
  };

  // Catalog overall stats
  const totalTrilhas = trilhas.length;
  const concluídasCount = trilhas.filter(t => t.progresso === 100).length;
  const totalProgressoPercent = totalTrilhas > 0
    ? Math.round(trilhas.reduce((acc, curr) => acc + curr.progresso, 0) / totalTrilhas)
    : 0;

  // Render Catalog view
  if (!playerMode) {
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
              Acompanhe seu progresso em ESG, diversidade e inclusão com trilhas estruturadas para fortalecer a cultura interna e o recrutamento inclusivo.
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
            <div className="h-10 w-10 dashboard-icon-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award size={20} />
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-surface rounded-card border border-border">
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="text-xs text-muted font-semibold">Carregando formações corporativas...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-surface rounded-card border border-red-500/10 text-center space-y-2">
            <p className="text-xs text-red-500 font-bold">{error}</p>
            <button 
              onClick={fetchTrilhas}
              className="py-1.5 px-3 bg-primary text-white text-[10px] font-bold rounded-lg"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          /* Grid of Trails */
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
                      CÓD: TR-00{trilha.id}
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
                <div className="space-y-2 border-t border-border/30 pt-4">
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
        )}
      </div>
    );
  }

  // Render Course Player View (playerMode === true)
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn text-text min-h-[calc(100vh-140px)]">
      
      {/* Sidebar: Course Outline & Progress */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
        
        {/* Back Button */}
        <div>
          <button 
            onClick={() => {
              setPlayerMode(false);
              setSelectedTrilha(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-text transition-colors bg-surface border border-border py-2.5 px-4 rounded-xl shadow-sm cursor-pointer w-full justify-center"
          >
            <ArrowLeft size={14} />
            <span>Voltar para Formações</span>
          </button>
        </div>

        {/* Trail Card with Progress */}
        <div className="bg-surface rounded-card p-5 border border-border shadow-card space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary-strong bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              {selectedTrilha.categoria}
            </span>
            <h2 className="text-sm font-extrabold text-text leading-snug pt-1">
              {selectedTrilha.titulo}
            </h2>
          </div>

          <div className="space-y-2 border-t border-border/30 pt-3">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-muted">Progresso na Trilha</span>
              <span className="text-primary">{selectedTrilha.progresso}%</span>
            </div>
            <div className="w-full h-2 bg-bg border border-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                style={{ width: `${selectedTrilha.progresso}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Modules Navigation Panel */}
        <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
          <div className="p-4 bg-bg border-b border-border">
            <h3 className="text-xs font-black text-text uppercase tracking-wider">Conteúdo do Curso</h3>
          </div>
          <div className="divide-y divide-border/60 max-h-[450px] overflow-y-auto">
            {selectedTrilha.modulos && selectedTrilha.modulos.map((mod, idx) => {
              const isActive = activeModuloId === mod.id;
              return (
                <div key={mod.id} className={`p-4 transition-all ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                  <div 
                    onClick={() => handleSelectModulo(mod.id, 'video')}
                    className="cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-muted uppercase">Módulo {idx + 1}</span>
                      <h4 className={`text-xs font-bold leading-tight group-hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text'}`}>
                        {mod.titulo}
                      </h4>
                    </div>
                    <div className={`h-5 w-5 rounded-full shrink-0 flex items-center justify-center border transition-all ${
                      mod.concluido 
                        ? 'bg-secondary border-secondary text-white' 
                        : 'border-border text-muted'
                    }`}>
                      {mod.concluido ? <Check size={12} strokeWidth={3} /> : <span className="text-[9px] font-bold">{idx + 1}</span>}
                    </div>
                  </div>

                  {/* Submenu for active module: Video -> Leitura -> Quiz steps */}
                  {isActive && (
                    <div className="mt-3 pl-2 space-y-1.5 border-l border-border/80 ml-2 animate-fadeIn">
                      <button 
                        onClick={() => handleSelectModulo(mod.id, 'video')}
                        className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all ${
                          activeStep === 'video' 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted hover:bg-bg'
                        }`}
                      >
                        <Video size={12} />
                        <span>1. Aula em Vídeo</span>
                        {videoWatchedMap[mod.id] && (
                          <Check size={10} className="text-secondary ml-auto" strokeWidth={3} />
                        )}
                      </button>

                      <button 
                        onClick={() => handleSelectModulo(mod.id, 'leitura')}
                        className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all ${
                          activeStep === 'leitura' 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted hover:bg-bg'
                        }`}
                      >
                        <FileText size={12} />
                        <span>2. Material de Leitura</span>
                        {readingCompletedMap[mod.id] && (
                          <Check size={10} className="text-secondary ml-auto" strokeWidth={3} />
                        )}
                      </button>

                      {moduloDetalhes?.questionario && (
                        <button 
                          onClick={() => handleSelectModulo(mod.id, 'quiz')}
                          className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all ${
                            activeStep === 'quiz' 
                              ? 'bg-primary/10 text-primary' 
                              : 'text-muted hover:bg-bg'
                          }`}
                        >
                          <HelpCircle size={12} />
                          <span>3. Quiz de Avaliação</span>
                          {moduloDetalhes?.resultadoAnterior?.aprovado && (
                            <Check size={10} className="text-secondary ml-auto" strokeWidth={3} />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-surface border border-border rounded-card shadow-card p-6 lg:p-8 flex flex-col justify-between relative">
        
        {/* Subtle top loading bar (non-blocking) */}
        {loadingModulo && (
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-card overflow-hidden z-10">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[shimmer_1.2s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Floating mini-spinner in corner */}
        {loadingModulo && (
          <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 text-[9px] font-bold text-muted bg-surface border border-border/60 px-2 py-1 rounded-full shadow-sm">
            <Loader2 size={10} className="animate-spin text-primary" />
            <span>carregando...</span>
          </div>
        )}

        {errorModulo ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <AlertCircle className="text-red-500" size={36} />
            <p className="text-xs text-red-500 font-bold">{errorModulo}</p>
            <button 
              onClick={() => handleSelectModulo(activeModuloId, activeStep)}
              className="py-1.5 px-4 bg-primary text-white text-xs font-bold rounded-xl"
            >
              Tentar Novamente
            </button>
          </div>
        ) : moduloDetalhes ? (
          
          <div className={`space-y-6 transition-opacity duration-200 ${loadingModulo ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Header info of active modulo */}
            <div className="border-b border-border/80 pb-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block">
                Módulo {moduloDetalhes.modulo.ordem} • {
                  activeStep === 'video' ? 'Aula em Vídeo' : 
                  activeStep === 'leitura' ? 'Material de Leitura' : 
                  'Quiz de Avaliação'
                }
              </span>
              <h2 className="text-base lg:text-lg font-black text-text leading-tight">
                {moduloDetalhes.modulo.nome}
              </h2>
            </div>

            {/* STEP 1: VIDEO */}
            {activeStep === 'video' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Video Player */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border border-border/20 shadow-lg">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`${moduloDetalhes.modulo.conteudo_url}?rel=0`}
                    title={moduloDetalhes.modulo.nome}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="p-4 bg-bg border border-border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-text">Instruções para o módulo</h4>
                    <p className="text-[11px] text-muted leading-relaxed font-medium">
                      Assista a esta vídeo-aula interativa sobre os conceitos fundamentais do módulo antes de avançar para a leitura do material complementar.
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-muted bg-surface border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center">
                    <span>Créditos do vídeo:</span>
                    <span className="text-primary">{getVideoCredits(moduloDetalhes.modulo.trilha_id)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LEITURA */}
            {activeStep === 'leitura' && (
              <div className="space-y-6 animate-fadeIn">
                {(() => {
                  const parsed = parseDescricao(moduloDetalhes.modulo.descricao);
                  return (
                    <>
                      {/* Hero Banner Area */}
                      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-500/10 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 p-6 rounded-2xl relative overflow-hidden border border-primary/20 dark:border-slate-800 shadow-md">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(91,62,166,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_right,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"></div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 dark:opacity-20 lg:dark:opacity-30 pointer-events-none">
                          <Sparkles size={80} className="text-primary animate-pulse" />
                        </div>
                        <div className="relative z-10 space-y-1 max-w-lg">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary dark:text-white/90 bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                            Leitura Técnica Complementar
                          </span>
                          <h3 className="text-base lg:text-lg font-black text-text dark:text-white leading-snug tracking-tight uppercase">
                            {moduloDetalhes.modulo.nome}
                          </h3>
                          <p className="text-[10px] font-bold text-muted dark:text-slate-400 flex items-center gap-1.5 pt-1">
                            <Clock size={12} />
                            Tempo estimado de leitura: {moduloDetalhes.modulo.duracao_minutos || 15} minutos
                          </p>
                        </div>
                      </div>

                      {/* Visão Geral / Introdução */}
                      {parsed.intro.length > 0 && (
                        <div className="bg-surface/50 p-6 rounded-2xl border border-border/60 relative overflow-hidden backdrop-blur select-text">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-indigo-500"></div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Introdução ao Tema</h4>
                          {parsed.intro.map((para, idx) => (
                            <p key={idx} className="text-xs text-text leading-relaxed font-medium mb-3 last:mb-0 select-text">
                              {para}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Interactive Section Accordion */}
                      {parsed.sections.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-primary">
                            <BookOpen size={16} />
                            <h3>Tópicos de Estudo & Aplicação Prática</h3>
                          </div>

                          <div className="space-y-3">
                            {parsed.sections.map((section, sIdx) => {
                              const isOpen = openSectionIdx === sIdx;
                              return (
                                <div 
                                  key={sIdx} 
                                  className={`border rounded-2xl overflow-hidden transition-all ${
                                    isOpen 
                                      ? 'border-primary/30 bg-bg/30 shadow-md' 
                                      : 'border-border bg-bg/10 hover:bg-bg/25'
                                  }`}
                                >
                                  {/* Accordion Header */}
                                  <button
                                    onClick={() => setOpenSectionIdx(isOpen ? -1 : sIdx)}
                                    className="w-full p-4 flex items-center justify-between gap-4 text-left select-none bg-transparent border-none cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className={`text-sm font-black leading-none ${
                                        isOpen ? 'text-primary' : 'text-muted/60'
                                      }`}>
                                        {String(section.number).padStart(2, '0')}
                                      </span>
                                      <h4 className="text-xs font-extrabold uppercase text-text tracking-wide">
                                        {section.title}
                                      </h4>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                                      isOpen 
                                        ? 'border-primary/20 bg-primary/10 text-primary' 
                                        : 'border-border text-muted hover:text-text'
                                    }`}>
                                      <ChevronDown 
                                        size={12} 
                                        className={`transition-transform duration-300 ${
                                          isOpen ? 'rotate-180 text-primary' : 'rotate-0 text-muted'
                                        }`} 
                                      />
                                    </div>
                                  </button>

                                  {/* Accordion Content */}
                                  {isOpen && (
                                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-border/40 animate-fadeIn">
                                      {/* Paragraphs */}
                                      {section.content.map((pText, pIdx) => (
                                        <p key={pIdx} className="text-xs text-text leading-relaxed font-medium select-text">
                                          {pText}
                                        </p>
                                      ))}

                                      {/* Bullet Cards */}
                                      {section.bullets.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                          {section.bullets.map((bullet, bIdx) => {
                                            const theme = (() => {
                                              const themes = [
                                                { bg: 'bg-gradient-to-br from-pink-500/5 to-orange-500/5', border: 'border-pink-500/20 hover:border-pink-500/40', text: 'text-pink-500', iconBg: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
                                                { bg: 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5', border: 'border-cyan-500/20 hover:border-cyan-500/40', text: 'text-cyan-500', iconBg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
                                                { bg: 'bg-gradient-to-br from-violet-500/5 to-purple-500/5', border: 'border-violet-500/20 hover:border-violet-500/40', text: 'text-violet-500', iconBg: 'bg-violet-500/10 text-violet-500 border-violet-500/20' }
                                              ];
                                              return themes[bIdx % themes.length];
                                            })();

                                            return (
                                              <div 
                                                key={bIdx} 
                                                className={`p-4 rounded-xl border ${theme.bg} ${theme.border} transition-all duration-200 shadow-sm relative overflow-hidden group select-text`}
                                              >
                                                <div className="flex items-start gap-3">
                                                  <div className={`h-6 w-6 rounded-lg border flex items-center justify-center text-[10px] font-bold shrink-0 ${theme.iconBg}`}>
                                                    {bIdx + 1}
                                                  </div>
                                                  <div className="space-y-1">
                                                    {bullet.title && (
                                                      <h5 className={`text-xs font-extrabold uppercase tracking-wide ${theme.text}`}>
                                                        {bullet.title}
                                                      </h5>
                                                    )}
                                                    <p className="text-[11px] text-muted leading-relaxed font-medium select-text">
                                                      {bullet.desc}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Footer Bibliography */}
                      {parsed.bibliografia && (
                        <div className="bg-bg border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-text">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                              <BookMarked size={18} />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-text">Referências Acadêmicas e Bibliografia</h4>
                              <p className="text-[10px] text-muted font-medium leading-normal">
                                Este material educacional foi embasado em dados e referências oficiais de:
                              </p>
                            </div>
                          </div>
                          <div className="text-[10px] font-extrabold text-primary bg-surface border border-border px-3 py-1.5 rounded-lg whitespace-normal sm:whitespace-nowrap select-text">
                            {parsed.bibliografia}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* STEP 3: QUIZ */}
            {activeStep === 'quiz' && moduloDetalhes.questionario && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Result Screen (if quiz was submitted or exists and not retaking) */}
                {moduloDetalhes.resultadoAnterior && !retakingQuiz && !quizResult && (
                  <div className="p-6 bg-surface border border-border rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Award size={20} className={moduloDetalhes.resultadoAnterior.aprovado ? "text-secondary" : "text-accent"} />
                        <h3 className="text-sm font-extrabold text-text">Tentativa Anterior Realizada</h3>
                      </div>
                      <p className="text-[11px] text-muted font-medium">
                        Realizada em {new Date(moduloDetalhes.resultadoAnterior.data_realizacao).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1.5 justify-center md:justify-start">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          moduloDetalhes.resultadoAnterior.aprovado 
                            ? 'bg-secondary/15 border border-secondary/25 text-secondary' 
                            : 'bg-accent/15 border border-accent/25 text-accent'
                        }`}>
                          {moduloDetalhes.resultadoAnterior.aprovado ? 'Aprovado' : 'Reprovado'}
                        </span>
                        <span className="text-[10px] font-bold bg-bg border border-border text-muted px-2.5 py-0.5 rounded-full">
                          Nota: {moduloDetalhes.resultadoAnterior.nota}%
                        </span>
                        <span className="text-[10px] font-bold bg-bg border border-border text-muted px-2.5 py-0.5 rounded-full">
                          Acertos: {moduloDetalhes.resultadoAnterior.total_acertos}/{moduloDetalhes.resultadoAnterior.total_questoes}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setRetakingQuiz(true)}
                      className="py-2.5 px-5 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 border-none"
                    >
                      <RotateCcw size={14} />
                      <span>Refazer Questionário</span>
                    </button>
                  </div>
                )}

                {/* Taking Quiz Screen */}
                {(retakingQuiz || !moduloDetalhes.resultadoAnterior || quizResult) && (
                  <div className="space-y-6">
                    
                    {/* Show Active Quiz Result (Feedback Panel) */}
                    {quizResult ? (
                      <div className="space-y-6">
                        
                        {/* Summary Box */}
                        <div className="p-6 rounded-2xl text-center space-y-4 border border-border relative overflow-hidden bg-gradient-to-br from-surface to-bg">
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted block">Resultado do Quiz</span>
                            <div className="text-4xl font-black tracking-tight flex items-center justify-center gap-2">
                              <span className={quizResult.aprovado ? "text-secondary" : "text-accent"}>{quizResult.nota}%</span>
                            </div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase inline-block mt-2 ${
                              quizResult.aprovado 
                                ? 'bg-secondary/15 border border-secondary/25 text-secondary' 
                                : 'bg-accent/15 border border-accent/25 text-accent'
                            }`}>
                              {quizResult.aprovado ? 'Aprovado' : 'Reprovado'}
                            </span>
                            <p className="text-[11px] text-muted max-w-sm mx-auto pt-2 font-medium">
                              {quizResult.aprovado 
                                ? 'Parabéns! Você alcançou a nota necessária e concluiu este módulo com sucesso.' 
                                : `Não foi dessa vez. Você acertou ${quizResult.total_acertos} de ${quizResult.total_questoes} questões. A nota mínima para aprovação é 70%.`
                              }
                            </p>
                          </div>

                          <div className="flex justify-center gap-3 pt-2">
                            <button 
                              onClick={() => {
                                setQuizResult(null);
                                setQuizAnswers({});
                                setRetakingQuiz(true);
                              }}
                              className="py-2 px-4 bg-bg hover:bg-surface border border-border text-text text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Tentar Novamente
                            </button>
                            <button 
                              onClick={() => setActiveStep('leitura')}
                              className="py-2 px-4 bg-bg hover:bg-surface border border-border text-text text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Revisar Leitura
                            </button>
                          </div>
                        </div>

                        {/* Answers Breakdown / Corrections */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-muted tracking-wider">Correção Detalhada</h3>
                          <div className="space-y-4">
                            {moduloDetalhes.questionario.questoes.map((q, idx) => {
                              const v = quizResult.respostasVerificadas.find(r => r.questao_id === q.id);
                              return (
                                <div key={q.id} className="p-4 bg-surface border border-border rounded-2xl space-y-3">
                                  <h4 className="text-xs font-bold text-text">
                                    Questão {idx + 1}: {q.enunciado}
                                  </h4>
                                  <div className="space-y-2">
                                    {q.alternativas.map(alt => {
                                      const isSelected = v?.alternativa_selecionada_id === alt.id;
                                      const isCorrect = v?.alternativa_correta_id === alt.id;
                                      
                                      let itemClass = "bg-bg/40 border-border text-text";
                                      if (isSelected) {
                                        itemClass = v.correta 
                                          ? "bg-secondary/10 border-secondary text-secondary" 
                                          : "bg-accent/10 border-accent text-accent";
                                      } else if (isCorrect) {
                                        itemClass = "bg-secondary/5 border-secondary/30 text-secondary";
                                      }

                                      return (
                                        <div key={alt.id} className={`p-3 rounded-xl border text-[11px] font-semibold flex items-center justify-between ${itemClass}`}>
                                          <span>{alt.texto}</span>
                                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                            {isSelected && !v.correta && <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/20 px-2 py-0.5 rounded text-accent">Sua Escolha</span>}
                                            {isSelected && v.correta && <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary/20 px-2 py-0.5 rounded text-secondary">Correto</span>}
                                            {!isSelected && isCorrect && <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary/20 px-2 py-0.5 rounded text-secondary">Gabarito</span>}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Active Quiz Questions list to be answered */
                      <div className="space-y-6">
                        <div className="space-y-4">
                          {moduloDetalhes.questionario.questoes.map((q, idx) => (
                            <div key={q.id} className="p-5 bg-surface border border-border rounded-card space-y-4">
                              <span className="text-[10px] font-black uppercase text-primary-strong bg-primary/10 px-2 py-0.5 rounded">Questão {idx + 1} de {moduloDetalhes.questionario.questoes.length}</span>
                              <h4 className="text-xs font-bold text-text leading-relaxed">
                                {q.enunciado}
                              </h4>

                              <div className="space-y-2">
                                {q.alternativas.map(alt => {
                                  const isSelected = quizAnswers[q.id] === alt.id;
                                  return (
                                    <div 
                                      key={alt.id}
                                      onClick={() => handleSelectAlternative(q.id, alt.id)}
                                      className={`p-3.5 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'border-primary bg-primary/5 text-primary' 
                                          : 'border-border hover:border-primary/25 hover:bg-bg/40 text-text'
                                      }`}
                                    >
                                      {/* Radio indicator */}
                                      <div className={`h-4.5 w-4.5 rounded-full border shrink-0 flex items-center justify-center ${
                                        isSelected ? 'border-primary text-primary' : 'border-border'
                                      }`}>
                                        {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
                                      </div>
                                      <span className="text-xs font-semibold leading-snug">{alt.texto}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>
        ) : null}

        {/* BOTTOM NAVIGATION FOOTER */}
        {!loadingModulo && moduloDetalhes && (
          <div className="border-t border-border/80 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Left Button (Voltar or Marcar Leitura) */}
            <div>
              {activeStep === 'video' ? (
                <div className="text-[11px] text-muted font-bold select-none uppercase tracking-wider">
                  Etapa 1: Assista ao vídeo explicativo
                </div>
              ) : activeStep === 'leitura' ? (
                <button 
                  onClick={() => setActiveStep('video')}
                  className="py-2.5 px-4 bg-bg hover:bg-surface border border-border text-text text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Voltar para o Vídeo
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setQuizResult(null);
                    setRetakingQuiz(false);
                    setActiveStep('leitura');
                  }}
                  className="py-2.5 px-4 bg-bg hover:bg-surface border border-border text-text text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Voltar para Leitura
                </button>
              )}
            </div>

            {/* Right Button (Progression) */}
            <div className="flex gap-3 w-full sm:w-auto">
              
              {/* Separate Reading completion button in step 2 */}
              {activeStep === 'leitura' && (
                <button 
                  onClick={handleToggleModuloLeitura}
                  className={`py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center ${
                    readingCompletedMap[activeModuloId] 
                      ? 'bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/20' 
                      : 'bg-bg hover:bg-surface border border-border text-text hover:border-primary/30'
                  }`}
                >
                  <CheckCircle size={14} className={readingCompletedMap[activeModuloId] ? "text-secondary" : "text-muted"} />
                  <span>{readingCompletedMap[activeModuloId] ? 'Leitura Concluída ✓' : 'Marcar Leitura como Concluída'}</span>
                </button>
              )}

              {activeStep === 'video' && (
                <button 
                  onClick={() => {
                    setVideoWatchedMap(prev => ({ ...prev, [activeModuloId]: true }));
                    setActiveStep('leitura');
                  }}
                  className="w-full sm:w-auto py-2.5 px-5 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border-none"
                >
                  <span>Concluir Vídeo e Ir para Leitura</span>
                  <ChevronRight size={14} />
                </button>
              )}

              {activeStep === 'leitura' && (
                moduloDetalhes.questionario ? (
                  <button 
                    onClick={() => {
                      // Automatically mark reading completed if they advance to quiz
                      if (!readingCompletedMap[activeModuloId]) {
                        setReadingCompletedMap(prev => ({ ...prev, [activeModuloId]: true }));
                      }
                      setActiveStep('quiz');
                    }}
                    className="w-full sm:w-auto py-2.5 px-5 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border-none"
                  >
                    <span>Ir para o Quiz Avaliativo</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={handleNextModulo}
                    disabled={selectedTrilha.modulos.findIndex(m => m.id === activeModuloId) === selectedTrilha.modulos.length - 1}
                    className="w-full sm:w-auto py-2.5 px-5 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none border-none"
                  >
                    <span>Próximo Módulo</span>
                    <ChevronRight size={14} />
                  </button>
                )
              )}

              {activeStep === 'quiz' && (
                !quizResult ? (
                  <button 
                    onClick={handleSubmitQuiz}
                    disabled={submittingQuiz || moduloDetalhes.questionario.questoes.some(q => !quizAnswers[q.id])}
                    className="w-full sm:w-auto py-2.5 px-6 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 border-none"
                  >
                    {submittingQuiz ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Questionário</span>
                        <CheckCircle size={14} />
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={handleNextModulo}
                    disabled={selectedTrilha.modulos.findIndex(m => m.id === activeModuloId) === selectedTrilha.modulos.length - 1}
                    className="w-full sm:w-auto py-2.5 px-6 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none border-none"
                  >
                    <span>Avançar para Próximo Módulo</span>
                    <ChevronRight size={14} />
                  </button>
                )
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Formacoes;
