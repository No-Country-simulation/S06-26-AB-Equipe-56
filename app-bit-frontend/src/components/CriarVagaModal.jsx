import React, { useState } from 'react';
import api from '../services/api';
import { X, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const CriarVagaModal = ({ isOpen, onClose, onVagaCriada }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cargoId, setCargoId] = useState('1');
  const [senioridadeId, setSenioridadeId] = useState('2');
  const [modalidadeId, setModalidadeId] = useState('1');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !descricao) {
      setError('Por favor, preencha o título e a descrição da vaga.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/vagas', {
        titulo,
        descricao,
        cargo_id: parseInt(cargoId),
        senioridade_id: parseInt(senioridadeId),
        modalidade_id: parseInt(modalidadeId),
      });

      // Clear form
      setTitulo('');
      setDescricao('');
      setCargoId('1');
      setSenioridadeId('2');
      setModalidadeId('1');

      onVagaCriada();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensagem || 'Erro ao publicar vaga no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="w-full max-w-2xl bg-surface border border-border rounded-card overflow-hidden shadow-card z-10 animate-scaleIn">
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 badge-primary rounded-lg">
              <Sparkles size={14} />
            </div>
            <h3 className="text-sm font-bold text-text">Criar Nova Vaga</h3>
          </div>
          <button className="text-muted hover:text-text transition-colors cursor-pointer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-text">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="titulo" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
              Título da Vaga *
            </label>
            <input
              id="titulo"
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Pessoa Desenvolvedora React (Pleno)"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary transition-colors text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cargo Select */}
            <div>
              <label htmlFor="cargo" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                Cargo
              </label>
              <select
                id="cargo"
                value={cargoId}
                onChange={(e) => setCargoId(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition-colors text-xs cursor-pointer"
              >
                <option value="1">Desenvolvedor Full Stack</option>
                <option value="2">Cientista de Dados</option>
                <option value="3">Engenheiro de ML</option>
                <option value="4">Desenvolvedor Front-end</option>
                <option value="5">Desenvolvedor Back-end</option>
              </select>
            </div>

            {/* Senioridade Select */}
            <div>
              <label htmlFor="senioridade" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                Senioridade
              </label>
              <select
                id="senioridade"
                value={senioridadeId}
                onChange={(e) => setSenioridadeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition-colors text-xs cursor-pointer"
              >
                <option value="1">Estágio</option>
                <option value="2">Júnior</option>
                <option value="3">Pleno</option>
                <option value="4">Sênior</option>
                <option value="5">Especialista</option>
              </select>
            </div>

            {/* Modalidade Select */}
            <div>
              <label htmlFor="modalidade" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                Modalidade
              </label>
              <select
                id="modalidade"
                value={modalidadeId}
                onChange={(e) => setModalidadeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition-colors text-xs cursor-pointer"
              >
                <option value="1">Remoto</option>
                <option value="2">Híbrido</option>
                <option value="3">Presencial</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
              Descrição e Requisitos (NLP Matcher) *
            </label>
            <textarea
              id="descricao"
              rows={4}
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva as responsabilidades, competências e requisitos técnicos. Nosso algoritmo analisará esta descrição para encontrar o match ideal."
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary transition-colors text-xs resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-bg hover:bg-surface border border-border text-text text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary-strong disabled:bg-primary/50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar Vaga'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarVagaModal;
