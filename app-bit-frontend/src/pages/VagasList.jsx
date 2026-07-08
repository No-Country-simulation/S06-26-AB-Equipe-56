import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CriarVagaModal from '../components/CriarVagaModal';
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Loader2, 
  AlertCircle,
  Search
} from 'lucide-react';

const VagasList = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchVagas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/vagas');
      setVagas(response.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar as vagas publicadas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  const handleVagaCriada = () => {
    fetchVagas();
  };

  const filteredVagas = vagas.filter((vaga) =>
    vaga.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vaga.cargo && vaga.cargo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn text-text">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-text flex items-center gap-2.5">
            <span>Vagas Publicadas</span>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-surface text-muted rounded-full border border-border">
              {vagas.length}
            </span>
          </h1>
          <p className="text-muted text-xs mt-1">
            Gerencie as oportunidades abertas e analise o matching de diversidade do time.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>Criar Nova Vaga</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar vagas por título ou cargo..."
          className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary transition-colors text-xs"
        />
      </div>

      {/* Error View */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="text-xs text-muted font-semibold">Carregando vagas...</span>
        </div>
      ) : filteredVagas.length === 0 ? (
        // Empty State
        <div className="bg-surface rounded-card p-12 text-center border border-border shadow-card max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-bg border border-border rounded-2xl flex items-center justify-center text-muted mx-auto">
            <Briefcase size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text">Nenhuma vaga encontrada</h3>
            <p className="text-xs text-muted leading-relaxed font-medium">
              {searchQuery 
                ? 'Nenhuma vaga corresponde aos termos de pesquisa fornecidos.' 
                : 'Sua empresa ainda não publicou nenhuma vaga neste painel. Clique no botão acima para cadastrar a primeira!'}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-4 bg-bg hover:bg-surface border border-border text-text font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Criar Primeira Vaga
            </button>
          )}
        </div>
      ) : (
        // Vagas Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVagas.map((vaga) => (
            <div 
              key={vaga.vaga_id} 
              className="bg-surface rounded-card p-6 border border-border shadow-card hover:border-primary/20 transition-all flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                {/* Date / Title */}
                <div className="flex items-center justify-between text-muted text-[10px] font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(vaga.data_cadastro).toLocaleDateString()}
                  </span>
                  <span>ID: #{vaga.vaga_id}</span>
                </div>

                <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors leading-snug">
                  {vaga.titulo}
                </h3>

                {vaga.recrutador_responsavel && (
                  <p className="text-[10px] text-muted font-medium">
                    Responsável: <span className="font-bold text-text">{vaga.recrutador_responsavel}</span>
                  </p>
                )}

                {/* Badges */}
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

              {/* Action Button */}
              <button
                onClick={() => navigate(`/dashboard/vagas/${vaga.vaga_id}`)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-bg hover:bg-primary border border-border hover:border-primary rounded-xl text-xs text-text hover:text-white font-bold transition-all cursor-pointer active:scale-[0.98]"
              >
                <UserCheck size={14} />
                <span>Análise de Matching (IA)</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CriarVagaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVagaCriada={handleVagaCriada}
      />
    </div>
  );
};

export default VagasList;
