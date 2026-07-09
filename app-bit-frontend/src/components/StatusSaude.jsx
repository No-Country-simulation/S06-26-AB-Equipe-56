import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Activity, Server, Database, ArrowRight } from 'lucide-react';

const POLL_MS = 60000;

/**
 * Indicador de saúde do sistema, reutilizável em várias telas.
 * - variant="pill": versão compacta para o Header (só verifica a API via /saude).
 * - variant="card": card para o Dashboard (verifica API e banco via /saude/banco).
 * Ambos linkam para a tela completa em /dashboard/saude-sistema.
 */
const StatusSaude = ({ variant = 'pill' }) => {
  const [apiOnline, setApiOnline] = useState(null);
  const [bancoOk, setBancoOk] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const intervaloRef = useRef(null);

  const verificar = useCallback(async () => {
    // Liveness da API (endpoint leve, não grava log)
    try {
      await api.get('/saude');
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      setBancoOk(false);
      setVerificando(false);
      return;
    }

    // Detalhe do banco apenas no card (evita gravações de log a cada poll no Header)
    if (variant === 'card') {
      try {
        const res = await api.get('/saude/banco');
        setBancoOk(res.data?.banco?.conectado === true);
      } catch (err) {
        // 503 quando o banco está fora: o corpo ainda vem em err.response.data
        setBancoOk(err.response?.data?.banco?.conectado === true);
      }
    }

    setVerificando(false);
  }, [variant]);

  useEffect(() => {
    verificar();
    intervaloRef.current = setInterval(verificar, POLL_MS);
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [verificar]);

  // ---- Variante PILL (Header) ----
  if (variant === 'pill') {
    const estado = verificando
      ? { dot: 'bg-amber-400', text: 'text-muted', label: 'Verificando...' }
      : apiOnline
      ? { dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Sistema Online' }
      : { dot: 'bg-rose-500', text: 'text-rose-500', label: 'Sistema Offline' };

    return (
      <Link
        to="/dashboard/saude-sistema"
        title="Ver Saúde do Sistema"
        className="hidden sm:flex items-center gap-2 py-1.5 px-3 bg-bg border border-border rounded-xl hover:border-primary/30 transition-all cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          {!verificando && apiOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${estado.dot}`}></span>
        </span>
        <span className={`text-[10px] font-bold ${estado.text}`}>{estado.label}</span>
      </Link>
    );
  }

  // ---- Variante CARD (Dashboard) ----
  return (
    <Link
      to="/dashboard/saude-sistema"
      className="bg-surface rounded-card p-5 border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all group premium-card-gradient relative overflow-hidden"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 dashboard-icon-primary rounded-2xl">
          <Activity size={22} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-text">Status do Sistema</h4>
          <p className="text-[10px] text-muted font-medium mt-0.5">
            Disponibilidade da API e conexão com o banco de dados
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <ItemStatus icon={Server} label="API" ok={apiOnline} verificando={verificando} okText="Online" errText="Offline" />
        <ItemStatus icon={Database} label="Banco" ok={bancoOk} verificando={verificando} okText="Conectado" errText="Fora" />
        <ArrowRight size={16} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

const ItemStatus = ({ icon: Icon, label, ok, verificando, okText, errText }) => {
  const cor = verificando ? 'text-muted' : ok ? 'text-emerald-500' : 'text-rose-500';
  const dot = verificando ? 'bg-amber-400' : ok ? 'bg-emerald-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-muted" />
      <div className="flex flex-col leading-tight">
        <span className="text-[8px] uppercase tracking-wider text-muted font-bold">{label}</span>
        <span className={`text-[10px] font-black flex items-center gap-1 ${cor}`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`}></span>
          {verificando ? '...' : ok ? okText : errText}
        </span>
      </div>
    </div>
  );
};

export default StatusSaude;
