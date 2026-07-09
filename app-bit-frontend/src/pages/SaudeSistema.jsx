import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import {
  Activity,
  Server,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  History,
} from 'lucide-react';

const INTERVALO_MS = 30000;

const formatarDataHora = (valor) => {
  if (!valor) return '—';
  try {
    return new Date(valor).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(valor);
  }
};

const formatarUptime = (segundos) => {
  if (segundos == null) return '—';
  const s = Math.floor(segundos % 60);
  const m = Math.floor((segundos / 60) % 60);
  const h = Math.floor(segundos / 3600);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const SaudeSistema = () => {
  const [health, setHealth] = useState(null);
  const [db, setDb] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erroConexao, setErroConexao] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervaloRef = useRef(null);

  const carregar = useCallback(async () => {
    setRefreshing(true);
    const [saudeRes, bancoRes, histRes] = await Promise.allSettled([
      api.get('/saude'),
      api.get('/saude/banco'),
      api.get('/saude/historico?limite=15'),
    ]);

    // /saude sempre responde 200 quando o servidor está no ar
    if (saudeRes.status === 'fulfilled') {
      setHealth(saudeRes.value.data);
      setErroConexao(false);
    } else {
      setHealth(null);
    }

    // /saude/banco responde 503 (axios rejeita) quando o banco está fora,
    // mas ainda traz o corpo com os detalhes em error.response.data
    if (bancoRes.status === 'fulfilled') {
      setDb(bancoRes.value.data);
    } else if (bancoRes.reason?.response?.data) {
      setDb(bancoRes.reason.response.data);
    } else {
      setDb(null);
    }

    if (histRes.status === 'fulfilled') {
      setHistorico(histRes.value.data || []);
    }

    // Se nem o /saude respondeu, o backend está inacessível
    if (saudeRes.status === 'rejected' && !bancoRes.reason?.response) {
      setErroConexao(true);
    }

    setUltimaAtualizacao(new Date());
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    if (autoRefresh) {
      intervaloRef.current = setInterval(carregar, INTERVALO_MS);
    }
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [autoRefresh, carregar]);

  const apiOnline = !erroConexao && !!health;
  const bancoConectado = db?.banco?.conectado === true;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-text">
        <Loader2 size={32} className="animate-spin text-primary" />
        <span className="text-xs text-muted font-semibold">Verificando a saúde do sistema...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Banner */}
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Activity size={12} />
            <span>Status do Sistema</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Saúde do Sistema
          </h1>
          <p className="text-muted text-xs max-w-xl leading-relaxed">
            Monitore em tempo real a disponibilidade da API, a conexão com o banco de dados e o histórico de verificações do App BiT.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <label className="flex items-center gap-2 text-[10px] font-bold text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-primary cursor-pointer"
            />
            Auto (30s)
          </label>
          <button
            onClick={carregar}
            disabled={refreshing}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-primary hover:bg-primary-strong disabled:opacity-60 text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {/* Aviso de backend inacessível */}
      {erroConexao && (
        <div className="bg-surface rounded-card p-4 border border-rose-500/30 shadow-card flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
            <XCircle size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text">Backend inacessível</h4>
            <p className="text-[10px] text-muted leading-relaxed font-medium mt-0.5">
              Não foi possível contatar a API em <code>/api/saude</code>. Verifique se o servidor está rodando na porta 3000.
            </p>
          </div>
        </div>
      )}

      {/* Cards de status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API */}
        <StatusCard
          titulo="API"
          icone={<Server size={20} />}
          ok={apiOnline}
          textoOk="Operacional"
          textoErro="Fora do ar"
          linhas={[
            { label: 'Serviço', valor: health?.servico || 'App BiT API' },
            { label: 'Uptime', valor: formatarUptime(health?.uptimeSegundos) },
          ]}
        />

        {/* Banco */}
        <StatusCard
          titulo="Banco de Dados"
          icone={<Database size={20} />}
          ok={bancoConectado}
          textoOk="Conectado"
          textoErro="Desconectado"
          linhas={[
            {
              label: 'Tempo de resposta',
              valor: db?.banco?.tempoRespostaMs != null ? `${db.banco.tempoRespostaMs} ms` : '—',
            },
            {
              label: bancoConectado ? 'Servidor' : 'Erro',
              valor: bancoConectado
                ? (db?.banco?.versao?.split(',')[0] || 'PostgreSQL')
                : (db?.banco?.erro || 'Indisponível'),
            },
          ]}
        />

        {/* Última verificação */}
        <StatusCard
          titulo="Última Verificação"
          icone={<Clock size={20} />}
          ok={apiOnline && bancoConectado}
          textoOk="Tudo certo"
          textoErro="Atenção"
          linhas={[
            { label: 'Horário', valor: formatarDataHora(ultimaAtualizacao) },
            { label: 'Auto-refresh', valor: autoRefresh ? 'Ativo (30s)' : 'Desativado' },
          ]}
        />
      </div>

      {/* Histórico */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="p-2.5 dashboard-icon-primary rounded-xl">
            <History size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text">Histórico de Verificações</h4>
            <p className="text-[10px] text-muted font-medium">Últimos registros gravados em LogSaude</p>
          </div>
        </div>

        {historico.length === 0 ? (
          <div className="p-8 text-center text-[11px] text-muted font-semibold">
            Nenhuma verificação registrada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-muted/70 font-extrabold border-b border-border">
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Banco</th>
                  <th className="px-5 py-3">Tempo</th>
                  <th className="px-5 py-3">Mensagem</th>
                  <th className="px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((log) => {
                  const ok = log.status === 'ok';
                  return (
                    <tr key={log.log_saude_id} className="border-b border-border/60 last:border-0 hover:bg-bg/40 transition-colors">
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                            ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {ok ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold ${log.banco_conectado ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {log.banco_conectado ? 'Conectado' : 'Desconectado'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[10px] font-semibold text-muted">
                        {log.tempo_resposta_ms != null ? `${log.tempo_resposta_ms} ms` : '—'}
                      </td>
                      <td className="px-5 py-3 text-[10px] text-muted max-w-xs truncate">{log.mensagem || '—'}</td>
                      <td className="px-5 py-3 text-[10px] font-semibold text-muted whitespace-nowrap">
                        {formatarDataHora(log.data_verificacao)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusCard = ({ titulo, icone, ok, textoOk, textoErro, linhas }) => (
  <div className="bg-surface rounded-card p-6 border border-border shadow-card relative overflow-hidden premium-card-gradient">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="p-2.5 bg-bg rounded-xl border border-border text-muted">{icone}</div>
        <span className="text-[10px] text-muted uppercase tracking-wider font-bold">{titulo}</span>
      </div>
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
          ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
        }`}
      >
        {ok ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
        {ok ? textoOk : textoErro}
      </span>
    </div>

    <div className="space-y-2">
      {linhas.map((linha, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-muted font-semibold shrink-0">{linha.label}</span>
          <span className="text-[10px] font-bold text-text truncate text-right">{linha.valor}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SaudeSistema;
