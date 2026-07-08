import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, RefreshCw, FileSpreadsheet, Layers, Filter, Plus, X } from 'lucide-react';
import api from '../services/api';

/**
 * DashboardEsgAderencia - Optimized ESG Adherence Dashboard.
 * Features:
 * - Consolidation of duplicate categories.
 * - Filter buttons for 'Tudo', 'Raça', 'Gênero', 'PCD', 'Social'.
 * - Alert cards at the top for goals below 99% progress.
 * - Compact table at the bottom for completed goals (100%).
 * - Modal to register new ESG goals.
 */
const DashboardEsgAderencia = ({ dados: propDados, erro: propErro, loading: propLoading, onMetaAdicionada, isAdmin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(['Tudo']);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newMeta, setNewMeta] = useState({
    badge_id: 1,
    porcentagem: 10.0,
    quantidade: 5
  });

  const handleFilterClick = (group) => {
    if (group === 'Tudo') {
      setActiveFilters(['Tudo']);
      return;
    }

    let nextFilters = activeFilters.filter(f => f !== 'Tudo');

    if (nextFilters.includes(group)) {
      nextFilters = nextFilters.filter(f => f !== group);
    } else {
      nextFilters.push(group);
    }

    if (nextFilters.length === 0) {
      setActiveFilters(['Tudo']);
    } else {
      setActiveFilters(nextFilters);
    }
  };

  const fetchRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/metas/relatorio');
      setData(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar relatório ESG:', err);
      setError('Não foi possível carregar os dados das Metas ESG. Verifique se o servidor backend está ativo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propDados) {
      setData(propDados);
      setError(propErro || null);
      setLoading(propLoading || false);
    } else {
      fetchRelatorio();
    }
  }, [propDados, propErro, propLoading]);

  // Available badges from database structure
  const badgesList = [
    { id: 1, name: "Pessoa com Deficiência (PCD)" },
    { id: 2, name: "Mulher em Tech" },
    { id: 3, name: "LGBTQIA+" },
    { id: 4, name: "Racial - Negro/Pardo" },
    { id: 5, name: "50+" },
    { id: 6, name: "Baixa Renda / ProUni" },
    { id: 7, name: "Primeiro Emprego" }
  ];

  // Helper to categorize items for filters
  const getFilterCategory = (name) => {
    const n = name.toLowerCase();
    if (n.includes('mulher') || n.includes('gênero') || n.includes('genero') || n.includes('lgbt') || n.includes('trans') || n.includes('feminina')) {
      return 'Gênero';
    }
    if (n.includes('negro') || n.includes('pardo') || n.includes('raça') || n.includes('raca') || n.includes('étnic') || n.includes('etnic') || n.includes('indígena') || n.includes('indigena')) {
      return 'Raça';
    }
    if (n.includes('pcd') || n.includes('deficiênc') || n.includes('deficienc')) {
      return 'PCD';
    }
    return 'Social';
  };

  const handleOpenModal = () => {
    setNewMeta({ badge_id: 1, porcentagem: 10.0, quantidade: 5 });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeta(prev => ({
      ...prev,
      [name]: name === 'badge_id' ? parseInt(value) : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/metas', newMeta);
      if (onMetaAdicionada) {
        await onMetaAdicionada();
      } else {
        await fetchRelatorio(); // Fallback reload
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao cadastrar meta:', err);
      setSubmitError(err.response?.data?.erro || 'Erro ao cadastrar meta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-card border border-border shadow-card min-h-[300px]">
        <RefreshCw className="animate-spin text-primary mb-4" size={32} />
        <p className="text-sm font-bold text-text">Buscando indicadores de aderência ESG...</p>
        <p className="text-xs text-muted mt-1">Carregando dados consolidados de contratações.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-surface rounded-card border border-red-500/20 shadow-card min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="p-3.5 bg-red-500/10 text-red-500 rounded-full mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-base font-extrabold text-text">Erro ao Carregar Dashboard ESG</h3>
        <p className="text-xs text-muted max-w-md mt-2 leading-relaxed">
          {typeof error === 'string' ? error : 'Ocorreu um erro inesperado ao conectar com a API de metas.'}
        </p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={fetchRelatorio}
            className="flex items-center gap-2 py-2 px-4 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw size={14} />
            <span>Tentar Novamente</span>
          </button>
        </div>
      </div>
    );
  }

  // 1. CONSOLIDATION: Remove duplicate cards of same category
  const consolidatedMap = {};
  data.forEach(item => {
    const cat = item.categoria_esg;
    const itemContratacoes = parseInt(item.contratacoes_realizadas || 0, 10);
    const itemMeta = parseFloat(item.meta || 0);

    if (!consolidatedMap[cat]) {
      consolidatedMap[cat] = { 
        ...item,
        contratacoes_realizadas: itemContratacoes,
        meta: itemMeta
      };
    } else {
      consolidatedMap[cat].contratacoes_realizadas += itemContratacoes;
      if (itemMeta > consolidatedMap[cat].meta) {
        consolidatedMap[cat].meta = itemMeta;
      }
    }
  });
  const consolidatedData = Object.values(consolidatedMap);

  // Get available unique filter groups
  const filterGroups = ['Tudo', 'Raça', 'Gênero', 'PCD', 'Social'];

  // Apply active category filter
  const filteredData = consolidatedData.filter(item => {
    if (activeFilters.includes('Tudo')) return true;
    return activeFilters.includes(getFilterCategory(item.categoria_esg));
  });

  // 2. PRIORITIZATION: Split into alerts (< 99% progress) and achieved (>= 99% progress)
  const cardsDeAlerta = filteredData.filter(item => {
    const progress = item.meta > 0 ? (item.contratacoes_realizadas / item.meta) * 100 : 0;
    return progress < 99;
  });

  const metasBatidas = filteredData.filter(item => {
    const progress = item.meta > 0 ? (item.contratacoes_realizadas / item.meta) * 100 : 0;
    return progress >= 99;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-5 rounded-2xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div>
          <h2 className="text-base font-bold text-text flex items-center gap-2">
            <Layers size={18} className="text-primary" />
            <span>Dashboard de Aderência ESG</span>
          </h2>
          <p className="text-[11px] text-muted mt-0.5">Acompanhamento e tomada de decisão sobre contratações afirmativas.</p>
        </div>
        
        {/* Actions and Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-bg p-1 rounded-xl border border-border/80">
            <span className="text-[9px] font-black uppercase text-muted/80 px-2 flex items-center gap-1 shrink-0">
              <Filter size={10} />
              <span>Filtrar:</span>
            </span>
            {filterGroups.map((group) => (
              <button
                key={group}
                onClick={() => handleFilterClick(group)}
                className={`
                  px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer select-none
                  ${activeFilters.includes(group)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text hover:bg-surface'
                  }
                `}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Add Goal Button */}
          {isAdmin && (
            <button
              onClick={handleOpenModal}
              data-open-esg-modal="true"
              className="flex items-center gap-1.5 py-2 px-3.5 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Plus size={12} />
              <span>Definir Nova Meta</span>
            </button>
          )}
        </div>
      </div>

      {/* EMPTY STATE SCREEN */}
      {consolidatedData.length === 0 ? (
        <div className="p-8 bg-surface rounded-card border border-border shadow-card min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="p-3.5 bg-primary/8 text-primary rounded-full mb-4">
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-base font-extrabold text-text">Nenhuma Meta ESG Cadastrada</h3>
          <p className="text-xs text-muted max-w-sm mt-2 leading-relaxed">
            Sua empresa ainda não definiu metas afirmativas de diversidade ou não possui contratações registradas para o período.
          </p>
          {isAdmin ? (
            <button
              onClick={handleOpenModal}
              data-open-esg-modal="true"
              className="mt-5 flex items-center gap-2 py-2.5 px-5 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Plus size={14} />
              <span>Cadastrar Primeira Meta</span>
            </button>
          ) : (
            <p className="text-xs text-muted italic mt-4">
              Apenas Administradores do sistema podem definir as metas ESG da empresa.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* 3. ALERTS CARDS (TOP SECTION) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text uppercase tracking-widest block">
                Cards de Alerta <span className="text-red-500 font-extrabold text-[10px]">({cardsDeAlerta.length} pendentes)</span>
              </h3>
              <span className="text-[9px] text-muted font-medium">Metas com menos de 99% de progresso</span>
            </div>

            {filteredData.length === 0 ? (
              <div className="p-6 bg-bg border border-border rounded-card text-center flex flex-col items-center justify-center">
                <AlertTriangle size={24} className="text-muted mb-2" />
                <h4 className="text-xs font-bold text-text">Nenhuma Meta Definida</h4>
                <p className="text-[10px] text-muted mt-0.5">Sua empresa ainda não definiu nenhuma meta para a(s) categoria(s): "{activeFilters.join(', ')}".</p>
                {isAdmin ? (
                  <button
                    onClick={handleOpenModal}
                    className="mt-3 flex items-center gap-1.5 py-1.5 px-3 bg-primary/10 border border-primary/20 text-primary font-bold rounded-xl text-[9px] transition-all cursor-pointer hover:bg-primary hover:text-white"
                  >
                    <Plus size={10} />
                    <span>Configurar Meta</span>
                  </button>
                ) : (
                  <p className="text-[9px] text-muted italic mt-2">Apenas Administradores podem configurar metas.</p>
                )}
              </div>
            ) : cardsDeAlerta.length === 0 ? (
              <div className="p-6 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-card border border-secondary/20 text-center flex flex-col items-center justify-center">
                <CheckCircle2 size={28} className="text-secondary mb-2" />
                <h4 className="text-xs font-bold text-text">Tudo Sob Controle!</h4>
                <p className="text-[10px] text-muted mt-0.5">Todas as metas da(s) categoria(s) selecionada(s) ("{activeFilters.join(', ')}") foram batidas!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardsDeAlerta.map((item, index) => {
                  const { categoria_esg, meta, contratacoes_realizadas } = item;
                  const progress = meta > 0 ? Math.min(Math.round((contratacoes_realizadas / meta) * 100), 100) : 0;
                  const remaining = Math.max(0, meta - contratacoes_realizadas);

                  return (
                    <div
                      key={index}
                      className="bg-surface rounded-card p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all duration-300 shadow-card border-2 border-red-500/25 bg-gradient-to-b from-surface via-surface to-red-500/2 shadow-red-500/5 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-bl-xl flex items-center gap-1">
                        <AlertTriangle size={10} />
                        <span>Atenção</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[9px] text-muted block uppercase tracking-wider font-extrabold">{getFilterCategory(categoria_esg)}</span>
                          <h4 className="text-xs font-bold text-text mt-0.5">{categoria_esg}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-bg/50 border border-border/40 rounded-xl p-2.5 text-center">
                          <div>
                            <span className="text-[8px] text-muted block font-semibold uppercase tracking-wider">Meta</span>
                            <span className="text-sm font-black text-text">{meta}</span>
                          </div>
                          <div className="border-l border-border/40">
                            <span className="text-[8px] text-muted block font-semibold uppercase tracking-wider">Alcançado</span>
                            <span className="text-sm font-black text-red-500">{contratacoes_realizadas}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-muted">Progresso</span>
                          <span className="text-red-500">{progress}%</span>
                        </div>

                        <div className="w-full h-1.5 bg-bg border border-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500/80 to-red-500 rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>

                        <p className="text-[9px] text-muted font-medium text-center">
                          Faltam <strong className="text-red-500 font-black">{remaining}</strong> contratações para bater a meta.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. COMPACT TABLE FOR BATIDAS METAS (BOTTOM SECTION) */}
          <div className="space-y-3.5 pt-2">
            <h3 className="text-xs font-bold text-text uppercase tracking-widest block">
              Metas Concluídas <span className="text-secondary font-extrabold text-[10px]">({metasBatidas.length} concluídas)</span>
            </h3>

            {metasBatidas.length === 0 ? (
              <p className="text-[10px] text-muted italic">Nenhuma meta concluída ou superada sob o filtro atual.</p>
            ) : (
              <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg border-b border-border text-[9px] font-black uppercase tracking-wider text-muted select-none">
                        <th className="py-3.5 px-5">Grupo</th>
                        <th className="py-3.5 px-5">Categoria ESG</th>
                        <th className="py-3.5 px-5 text-center">Meta Alvo</th>
                        <th className="py-3.5 px-5 text-center">Contratados</th>
                        <th className="py-3.5 px-5 text-center">Aderência</th>
                        <th className="py-3.5 px-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-xs">
                      {metasBatidas.map((item, index) => {
                        const { categoria_esg, meta, contratacoes_realizadas } = item;
                        const progress = meta > 0 ? Math.round((contratacoes_realizadas / meta) * 100) : 100;
                        
                        return (
                          <tr key={index} className="hover:bg-bg/40 transition-colors">
                            <td className="py-3 px-5 font-semibold text-muted text-[10px]">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/15 rounded-md font-black">
                                {getFilterCategory(categoria_esg)}
                              </span>
                            </td>
                            <td className="py-3 px-5 font-bold text-text">{categoria_esg}</td>
                            <td className="py-3 px-5 text-center font-semibold text-muted">{meta}</td>
                            <td className="py-3 px-5 text-center font-bold text-secondary">{contratacoes_realizadas}</td>
                            <td className="py-3 px-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-extrabold text-secondary">{progress}%</span>
                                <div className="w-12 h-1 bg-bg border border-border rounded-full overflow-hidden shrink-0 hidden sm:block">
                                  <div className="h-full bg-secondary rounded-full" style={{ width: '100%' }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-5 text-right">
                              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-secondary/8 text-secondary border border-secondary/15 px-2 py-0.5 rounded-lg">
                                <CheckCircle2 size={10} />
                                <span>{progress > 100 ? 'Superada' : 'Batida'}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface border border-border rounded-card max-w-md w-full shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-text flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                <span>Definir Nova Meta ESG</span>
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-muted hover:text-text cursor-pointer p-1 rounded-lg hover:bg-bg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted block uppercase tracking-wider">Selecione a Categoria / Badge</label>
                <select
                  name="badge_id"
                  value={newMeta.badge_id}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-bg hover:bg-surface-hover focus:bg-surface border border-border focus:border-primary rounded-xl text-xs text-text font-medium outline-none transition-all cursor-pointer"
                  required
                >
                  {badgesList.map(badge => (
                    <option key={badge.id} value={badge.id}>{badge.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Meta percentage input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted block uppercase tracking-wider">Meta (%)</label>
                  <input
                    type="number"
                    name="porcentagem"
                    value={newMeta.porcentagem}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-3.5 py-2.5 bg-bg focus:bg-surface border border-border focus:border-primary rounded-xl text-xs text-text font-bold outline-none transition-all"
                    required
                  />
                </div>

                {/* Meta quantity input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted block uppercase tracking-wider">Meta Contratações (Qtd)</label>
                  <input
                    type="number"
                    name="quantidade"
                    value={newMeta.quantidade}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3.5 py-2.5 bg-bg focus:bg-surface border border-border focus:border-primary rounded-xl text-xs text-text font-bold outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Note on mapping */}
              <p className="text-[9px] text-muted leading-relaxed pt-1.5">
                * A meta cadastrada influenciará o score de matching do algoritmo e os indicadores de aderência no painel.
              </p>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 border border-border text-muted hover:text-text rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-98"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={12} />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar Meta</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEsgAderencia;
