import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getCandidatesForJob } from '../services/matchingService';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Brain, 
  Check, 
  X, 
  Loader2, 
  AlertCircle,
  BookmarkCheck
} from 'lucide-react';

const MOCK_TO_DB_MAP = {
  'c1': 131, // Mariana Costa Silveira
  'c2': 27,  // Carlos Eduardo Souza (Cadu)
  'c3': 51,  // Aline Souza de Jesus
  'c4': 219, // Gabriela Mendes Santos
  'c5': 126, // Youssef Al-Fayed
  'c6': 60,  // Thales Pinheiro Ribeiro
  'c7': 104, // Beatriz Vasconcelos Luna
  'c8': 8,   // Lucca Viana Ramos
  'c9': 170, // Tiago Mendes Neto (PCD / LGBTQIA+)
  'c10': 295, // Amanda Rocha Lima (Negra / Baixa Renda)
  'c11': 189, // Jefferson Santos Cruz (Negro / PCD)
  'c12': 277, // Letícia Pereira Góes (Mulher / Baixa Renda / LGBTQIA+)
  'c13': 174, // Bruno Carvalho Mello (50+)
  'c14': 110, // Clara Martins Neves (Mulher / Baixa Renda / Primeiro Emprego)
  'c15': 197, // Rafael Augusto Silva (PCD)
  'c16': 221  // Samuel de Oliveira (Negro)
};

const getInitials = (name) => {
  if (!name) return 'CN';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const MatchingView = () => {
  const { id } = useParams();

  const [vaga, setVaga] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hiringId, setHiringId] = useState(null);
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVagaDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch job detail
        const response = await api.get(`/vagas/${id}`);
        const vagaDados = response.data;
        setVaga(vagaDados);

        // Fetch candidates for this job
        const matchCandidatos = getCandidatesForJob(vagaDados.cargo_id, vagaDados.titulo);
        setCandidatos(matchCandidatos);

        // Fetch existing candidacies for this job
        const candidaturasRes = await api.get('/candidaturas');
        const parsedVagaId = parseInt(id, 10);
        setCandidaturas(candidaturasRes.data.filter(c => c.vaga_id === parsedVagaId));
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar detalhes da vaga. Certifique-se de que a vaga pertence à sua empresa.');
      } finally {
        setLoading(false);
      }
    };

    fetchVagaDetails();
  }, [id]);

  const handleOpenExplicabilidade = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const getStatusOptionValue = (dbStatus) => {
    const s = (dbStatus || '').toLowerCase();
    if (s.includes('analise') || s.includes('triagem') || s.includes('pendente')) return 'Triagem';
    if (s.includes('teste')) return 'Teste';
    if (s.includes('entrevista')) return 'Entrevista';
    if (s.includes('contratado') || s.includes('aprovado')) return 'Contratado';
    return 'Triagem';
  };

  const handleAtualizarStatus = async (candidato, novoStatus) => {
    const dbCandidatoId = MOCK_TO_DB_MAP[candidato.id];
    if (!dbCandidatoId) {
      alert('Candidato não mapeado no banco de dados.');
      return;
    }

    try {
      setHiringId(candidato.id);
      
      // 1. Criar a candidatura (ou obter existente com status padrão)
      const resCandidatura = await api.post('/candidaturas', {
        vaga_id: parseInt(id, 10),
        curriculo_id: dbCandidatoId,
        status: novoStatus,
        pretencao_salarial: 6000
      });
      
      const candidaturaId = resCandidatura.data.candidatura_id;

      // 2. Se a candidatura já existia mas com status diferente, atualiza
      const currentDBStatus = getStatusOptionValue(resCandidatura.data.status);
      if (currentDBStatus !== novoStatus) {
        await api.put(`/candidaturas/${candidaturaId}/status`, {
          status: novoStatus
        });
      }

      // 3. Atualizar candidaturas localmente
      const updatedRes = await api.get('/candidaturas');
      const parsedVagaId = parseInt(id, 10);
      setCandidaturas(updatedRes.data.filter(c => c.vaga_id === parsedVagaId));

      if (novoStatus === 'Contratado') {
        alert(`Candidato ${candidato.nome} contratado com sucesso! As metas ESG da empresa foram atualizadas.`);
      } else {
        alert(`Candidato ${candidato.nome} movido para a etapa "${novoStatus}".`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao transicionar etapa do candidato.');
    } finally {
      setHiringId(null);
    }
  };

  const getMarkerColor = (tipo) => {
    switch (tipo) {
      case 'genero':
        return 'bg-purple-500/10 border-purple-500/25 text-purple-650 dark:text-purple-400';
      case 'raca':
        return 'bg-accent/10 border-accent/25 text-accent';
      case 'pcd':
        return 'bg-sky-500/10 border-sky-500/25 text-sky-650 dark:text-sky-400';
      case 'lgbt':
        return 'bg-pink-500/10 border-pink-500/25 text-pink-650 dark:text-pink-400';
      case 'baixa_renda':
        return 'bg-secondary/10 border-secondary/25 text-secondary';
      default:
        return 'bg-bg border-border text-muted';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'badge-secondary';
    if (score >= 90) return 'badge-primary';
    return 'badge-accent';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-text">
        <Loader2 size={32} className="animate-spin text-primary" />
        <span className="text-xs text-muted font-semibold">Processando Motor de Inteligência...</span>
      </div>
    );
  }

  if (error || !vaga) {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-12 text-text">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-text">Falha ao carregar matching</h2>
          <p className="text-xs text-muted">{error || 'A vaga não foi localizada.'}</p>
        </div>
        <Link 
          to="/dashboard/vagas"
          className="inline-block py-2.5 px-5 bg-bg hover:bg-surface border border-border text-text font-bold rounded-xl text-xs transition-all"
        >
          Voltar para Vagas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Back to list Link */}
      <div>
        <Link to="/dashboard/vagas" className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-text transition-colors">
          <ArrowLeft size={14} />
          <span>Voltar para Listagem de Vagas</span>
        </Link>
      </div>

      {/* Grid: Left Job Details, Right Candidates short list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Job info - Left Side (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-card p-6 border border-border shadow-card space-y-5">
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono font-semibold text-muted flex items-center gap-1.5">
                <Calendar size={12} />
                Publicada em {new Date(vaga.data_cadastro).toLocaleDateString()}
              </span>
              <h2 className="text-lg font-bold text-text leading-snug">
                {vaga.titulo}
              </h2>

              {vaga.recrutador_responsavel && (
                <div className="text-[10px] text-muted font-medium">
                  Responsável: <span className="font-bold text-text">{vaga.recrutador_responsavel}</span>
                </div>
              )}
              
              {/* Job Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {vaga.cargo && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-bg border border-border rounded text-muted">
                    {vaga.cargo}
                  </span>
                )}
                {vaga.senioridade && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-bg border border-border rounded text-muted">
                    {vaga.senioridade}
                  </span>
                )}
                {vaga.modalidade && (
                  <span className="text-[10px] font-bold px-2 py-0.5 badge-secondary rounded flex items-center gap-1">
                    <MapPin size={10} />
                    {vaga.modalidade}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">
                Descrição da Vaga
              </h4>
              <p className="text-xs text-text leading-relaxed whitespace-pre-line bg-bg/40 p-4 rounded-xl border border-border max-h-60 overflow-y-auto font-medium">
                {vaga.descricao}
              </p>
            </div>

            <div className="p-4 badge-primary rounded-xl flex gap-3 items-start">
              <Brain size={18} className="text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-text block">Triagem Inteligente Habilitada</span>
                <p className="text-[10px] text-muted leading-relaxed font-medium">
                  As recomendações ao lado são geradas automaticamente analisando a descrição acima contra as habilidades e dados ESG do banco de talentos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shortlist - Right Side (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="text-base font-bold text-text flex items-center flex-wrap gap-2">
              <span>Shortlist Recomendada pela IA</span>
              <span className="text-xs font-bold px-2.5 py-0.5 badge-primary rounded-full">
                {candidatos.length} Sugeridos
              </span>
              {candidaturas.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 bg-bg border border-border text-muted rounded-full">
                  {candidaturas.length} no processo
                </span>
              )}
            </h3>
            <p className="text-muted text-xs mt-1">
              Ordenados pelo score de compatibilidade técnica e alinhamento de indicadores ESG.
            </p>
          </div>

          <div className="space-y-4">
            {candidatos.map((candidato) => {
              const dbCandidatoId = MOCK_TO_DB_MAP[candidato.id];
              const candAssociation = candidaturas.find(c => c.curriculo_id === dbCandidatoId);

              return (
                <div 
                  key={candidato.id} 
                  className="bg-surface rounded-card p-5 border border-border shadow-card hover:border-primary/25 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  {/* Profile info */}
                  <div className="flex gap-4 items-start sm:items-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      {getInitials(candidato.nome)}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center flex-wrap gap-2">
                        <h4 className="text-xs font-bold text-text">{candidato.nome}</h4>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded-full ${getScoreColor(candidato.score)}`}>
                          {candidato.score}% Match
                        </span>
                      </div>
                      <p className="text-xs text-muted font-medium">{candidato.resumo}</p>
                      
                      {/* Diversity Badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {candidato.marcadores.map((mark) => (
                          <span 
                            key={mark.label} 
                            className={`text-[9px] font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${getMarkerColor(mark.tipo)}`}
                          >
                            {mark.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0 items-center">
                    <button
                      onClick={() => handleOpenExplicabilidade(candidato)}
                      className="w-full sm:w-auto px-4 py-2 bg-bg hover:bg-surface-hover border border-border rounded-xl text-xs text-text font-bold transition-all cursor-pointer text-center"
                    >
                      Explicar Match
                    </button>
                    {candAssociation ? (
                      <div className="flex items-center gap-1.5 bg-bg border border-border rounded-xl px-3 py-1.5 focus-within:border-primary transition-all w-full sm:w-auto">
                        <span className="text-[10px] text-muted font-bold select-none uppercase tracking-wider shrink-0">Etapa:</span>
                        <select
                          value={getStatusOptionValue(candAssociation.status)}
                          disabled={hiringId !== null}
                          onChange={(e) => handleAtualizarStatus(candidato, e.target.value)}
                          className="bg-transparent text-xs text-text font-bold outline-none border-none cursor-pointer pr-1"
                        >
                          <option value="Triagem" className="bg-surface text-text">Triagem Inicial</option>
                          <option value="Teste" className="bg-surface text-text">Teste Técnico</option>
                          <option value="Entrevista" className="bg-surface text-text">Entrevista Cultural</option>
                          <option value="Contratado" className="bg-surface text-text">Contratado</option>
                        </select>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAtualizarStatus(candidato, 'Triagem')}
                        disabled={hiringId !== null}
                        className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-strong text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {hiringId === candidato.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <span>Mover para Triagem</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explicabilidade Modal */}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="w-full max-w-xl bg-surface border border-border rounded-card overflow-hidden shadow-card z-10 animate-scaleIn">
            {/* Header */}
            <div className="h-16 border-b border-border px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-primary" />
                <h3 className="text-sm font-bold text-text">Explicabilidade do Matching (IA)</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-text transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Candidate Info Header */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center font-bold text-sm shrink-0 select-none">
                  {getInitials(selectedCandidate.nome)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text leading-snug">{selectedCandidate.nome}</h4>
                  <p className="text-xs text-muted font-medium">{selectedCandidate.cargo}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded-full ${getScoreColor(selectedCandidate.score)}`}>
                      {selectedCandidate.score}% Score Geral
                    </span>
                    {selectedCandidate.marcadores.map((mark) => (
                      <span 
                        key={mark.label} 
                        className={`text-[9px] font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${getMarkerColor(mark.tipo)}`}
                      >
                        {mark.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Justification Box */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-muted uppercase tracking-wider">Justificativa do Algoritmo</h5>
                <p className="text-xs text-text leading-relaxed bg-bg border border-border p-4 rounded-xl font-medium">
                  {selectedCandidate.explicabilidade.scoreExplanation}
                </p>
              </div>

              {/* Skills matched / missing grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Skills Matched */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Check size={14} />
                    <span>Habilidades Encontradas</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.explicabilidade.skillsMatched.map((skill) => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 badge-secondary rounded font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Missing */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <X size={14} />
                    <span>Habilidades Ausentes</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.explicabilidade.skillsMissing.map((skill) => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 bg-bg border border-border rounded text-muted font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ESG fit Box */}
              <div className="p-4 bg-secondary/5 border border-secondary/15 rounded-xl space-y-2">
                <h5 className="text-[10px] font-bold text-text flex items-center gap-1.5">
                  <BookmarkCheck size={16} className="text-secondary" />
                  <span>Impacto de Impacto Social / ESG</span>
                </h5>
                <p className="text-xs text-text leading-relaxed font-medium">
                  {selectedCandidate.explicabilidade.esgFit}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="h-16 border-t border-border px-6 flex items-center justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-primary hover:bg-primary-strong text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingView;
