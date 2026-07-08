import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
  Activity,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Heart,
  Loader2,
  LogIn,
  PlusCircle,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';

const formatDate = (value) => {
  if (!value) return 'Data a definir';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data a definir';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const STORAGE_KEYS = {
  saudeToken: 'bit_saude_token',
  saudeUser: 'bit_saude_user',
};

const salvarSessaoSaude = (token, usuario) => {
  localStorage.setItem(STORAGE_KEYS.saudeToken, token);
  localStorage.setItem(STORAGE_KEYS.saudeUser, JSON.stringify(usuario));
};

const limparSessaoSaude = () => {
  localStorage.removeItem(STORAGE_KEYS.saudeToken);
  localStorage.removeItem(STORAGE_KEYS.saudeUser);
};

const lerSessaoSaude = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.saudeUser) || 'null');
    return {
      authenticated: Boolean(localStorage.getItem(STORAGE_KEYS.saudeToken)),
      user: storedUser,
    };
  } catch {
    return { authenticated: false, user: null };
  }
};

const initialData = {
  especialidades: [],
  profissionais: [],
  pacientes: [],
  consultas: [],
  exames: [],
};

const initialConsultaForm = {
  paciente_id: '',
  profissional_id: '',
  data_hora: '',
  status: 'agendada',
  observacoes: '',
};

const initialExameForm = {
  paciente_id: '',
  profissional_id: '',
  tipo_exame: '',
  data_exame: '',
  resultado: '',
  status: 'pendente',
};

const SaudeTime = () => {
  const [dados, setDados] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [auth, setAuth] = useState(() => {
    const sessao = lerSessaoSaude();
    return {
      email: '',
      senha: '',
      tipo: 'profissional',
      loading: false,
      error: '',
      authenticated: sessao.authenticated,
      user: sessao.user,
    };
  });
  const [consultaForm, setConsultaForm] = useState(initialConsultaForm);
  const [exameForm, setExameForm] = useState(initialExameForm);
  const [submitting, setSubmitting] = useState({ consulta: false, exame: false });

  const carregarDados = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.saudeToken);
    if (!token) {
      setDados(initialData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [especialidadesRes, profissionaisRes, pacientesRes, consultasRes, examesRes] = await Promise.all([
        api.get('/saude/especialidades'),
        api.get('/saude/profissionais'),
        api.get('/saude/pacientes'),
        api.get('/saude/consultas'),
        api.get('/saude/exames'),
      ]);

      setDados({
        especialidades: especialidadesRes.data || [],
        profissionais: profissionaisRes.data || [],
        pacientes: pacientesRes.data || [],
        consultas: consultasRes.data || [],
        exames: examesRes.data || [],
      });
    } catch (err) {
      console.error('Erro ao buscar dados de saúde:', err);
      setError('Não foi possível carregar os dados no momento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.authenticated) {
      carregarDados();
    } else {
      setLoading(false);
    }
  }, [auth.authenticated]);

  const metrics = useMemo(() => {
    const profissionaisAtivos = dados.profissionais.filter((prof) => prof.ativo !== false).length;
    const consultasAgendadas = dados.consultas.filter((consulta) => consulta.status === 'agendada').length;
    const examesPendentes = dados.exames.filter((exame) => exame.status === 'pendente').length;

    return [
      {
        id: 1,
        label: 'Profissionais ativos',
        value: profissionaisAtivos,
        desc: 'Equipe preparada para atendimento',
        icon: Stethoscope,
      },
      {
        id: 2,
        label: 'Pacientes cadastrados',
        value: dados.pacientes.length,
        desc: 'Cadastros no módulo de saúde',
        icon: Users,
      },
      {
        id: 3,
        label: 'Consultas agendadas',
        value: consultasAgendadas,
        desc: 'Atendimentos já organizados',
        icon: CalendarClock,
      },
      {
        id: 4,
        label: 'Exames pendentes',
        value: examesPendentes,
        desc: 'Resultados aguardando atualização',
        icon: ClipboardList,
      },
    ];
  }, [dados]);

  const proximasConsultas = useMemo(() => {
    return [...dados.consultas]
      .sort((a, b) => new Date(a.data_hora || 0) - new Date(b.data_hora || 0))
      .slice(0, 3);
  }, [dados.consultas]);

  const examesRecentes = useMemo(() => {
    return [...dados.exames]
      .sort((a, b) => new Date(b.data_exame || 0) - new Date(a.data_exame || 0))
      .slice(0, 3);
  }, [dados.exames]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuth((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      const response = await api.post('/saude/login', {
        email: auth.email,
        senha: auth.senha,
        tipo: auth.tipo,
      });

      const { token, usuario } = response.data;
      salvarSessaoSaude(token, usuario);
      setAuth((prev) => ({ ...prev, loading: false, authenticated: true, user: usuario, email: '', senha: '', error: '' }));
      setFeedback('Acesso autorizado. Você já pode cadastrar consultas e exames.');
    } catch (err) {
      console.error('Erro ao autenticar usuário de saúde:', err);
      setAuth((prev) => ({ ...prev, loading: false, error: 'E-mail ou senha inválidos para o módulo de saúde.' }));
    }
  };

  const handleLogout = () => {
    limparSessaoSaude();
    setAuth({
      email: '',
      senha: '',
      tipo: 'profissional',
      loading: false,
      error: '',
      authenticated: false,
      user: null,
    });
    setFeedback('');
  };

  const handleConsultaSubmit = async (event) => {
    event.preventDefault();
    if (!consultaForm.paciente_id || !consultaForm.profissional_id || !consultaForm.data_hora) {
      setError('Preencha paciente, profissional e data da consulta.');
      return;
    }

    try {
      setSubmitting((prev) => ({ ...prev, consulta: true }));
      setError('');
      await api.post('/saude/consultas', {
        paciente_id: Number(consultaForm.paciente_id),
        profissional_id: Number(consultaForm.profissional_id),
        data_hora: new Date(consultaForm.data_hora).toISOString(),
        status: consultaForm.status,
        observacoes: consultaForm.observacoes,
      });
      setFeedback('Consulta cadastrada com sucesso.');
      setConsultaForm(initialConsultaForm);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao criar consulta:', err);
      setError('Não foi possível cadastrar a consulta.');
    } finally {
      setSubmitting((prev) => ({ ...prev, consulta: false }));
    }
  };

  const handleExameSubmit = async (event) => {
    event.preventDefault();
    if (!exameForm.paciente_id || !exameForm.profissional_id || !exameForm.tipo_exame || !exameForm.data_exame) {
      setError('Preencha todos os campos obrigatórios do exame.');
      return;
    }

    try {
      setSubmitting((prev) => ({ ...prev, exame: true }));
      setError('');
      await api.post('/saude/exames', {
        paciente_id: Number(exameForm.paciente_id),
        profissional_id: Number(exameForm.profissional_id),
        tipo_exame: exameForm.tipo_exame,
        data_exame: new Date(exameForm.data_exame).toISOString(),
        resultado: exameForm.resultado,
        status: exameForm.status,
      });
      setFeedback('Exame cadastrado com sucesso.');
      setExameForm(initialExameForm);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao criar exame:', err);
      setError('Não foi possível cadastrar o exame.');
    } finally {
      setSubmitting((prev) => ({ ...prev, exame: false }));
    }
  };

  if (!auth.authenticated) {
    return (
      <div className="space-y-6 animate-fadeIn text-text">
        <div className="bg-surface rounded-card border border-border shadow-card p-6 lg:p-8">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <LogIn size={12} />
            <span>Acesso ao módulo saúde</span>
          </div>
          <h1 className="mt-4 text-xl lg:text-2xl font-black text-text tracking-tight">
            Entre para cadastrar consultas, exames e acompanhar o cuidado em tempo real
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
            Use o login do módulo de saúde para autenticar profissionais ou pacientes e operar o painel com segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
          <div className="bg-surface rounded-card border border-border shadow-card p-6">
            <h2 className="text-lg font-semibold text-text">Autenticação</h2>
            <form onSubmit={handleLogin} className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Tipo de usuário</label>
                <select
                  value={auth.tipo}
                  onChange={(event) => setAuth((prev) => ({ ...prev, tipo: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                >
                  <option value="profissional">Profissional</option>
                  <option value="paciente">Paciente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">E-mail</label>
                <input
                  type="email"
                  value={auth.email}
                  onChange={(event) => setAuth((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Senha</label>
                <input
                  type="password"
                  value={auth.senha}
                  onChange={(event) => setAuth((prev) => ({ ...prev, senha: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              {auth.error ? <p className="text-sm text-accent">{auth.error}</p> : null}

              <button
                type="submit"
                disabled={auth.loading}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-70"
              >
                {auth.loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                {auth.loading ? 'Entrando...' : 'Entrar no módulo'}
              </button>
            </form>
          </div>

          <div className="bg-surface rounded-card border border-border shadow-card p-6">
            <h2 className="text-lg font-semibold text-text">O que você consegue fazer</h2>
            <div className="mt-5 space-y-3 text-sm text-muted">
              <div className="rounded-2xl border border-border bg-bg/70 p-4">Cadastrar consultas com paciente, profissional e horário.</div>
              <div className="rounded-2xl border border-border bg-bg/70 p-4">Registrar exames e atualizar o status de cada atendimento.</div>
              <div className="rounded-2xl border border-border bg-bg/70 p-4">Acompanhar profissionais, pacientes, especialidades e agenda da saúde.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-text">
        <Loader2 size={32} className="animate-spin text-primary" />
        <span className="text-xs text-muted font-semibold">Carregando painel de saúde...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      <div className="bg-surface rounded-card p-6 lg:p-8 border border-border shadow-card relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest badge-primary px-3 py-1 rounded-full w-max">
            <Sparkles size={12} />
            <span>Módulo Saúde</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text tracking-tight">
            Acompanhamento completo do cuidado e da operação da saúde
          </h1>
          <p className="text-muted text-xs leading-relaxed">
            Centralize profissionais, pacientes, consultas e exames em uma visão ágil para apoiar o time de atendimento.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3 rounded-2xl border border-border bg-bg/70 px-4 py-3">
          <div className="rounded-xl bg-accent/10 p-2 text-accent">
            <Heart size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Status</p>
            <p className="text-sm font-semibold text-text">Operação ativa</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">Sessão</p>
          <p className="mt-1 text-sm font-semibold text-text">Olá, {auth.user?.nome || 'usuário'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-muted transition-all hover:text-text"
        >
          Sair do módulo
        </button>
      </div>

      {error ? (
        <div className="rounded-card border border-border bg-surface p-5 text-sm text-muted">
          {error}
        </div>
      ) : null}

      {feedback ? (
        <div className="rounded-card border border-primary/20 bg-primary/10 p-5 text-sm text-primary">
          {feedback}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-surface rounded-card p-6 border border-border shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">{metric.label}</p>
                  <h3 className="mt-2 text-3xl font-black text-text">{metric.value}</h3>
                </div>
                <div className="rounded-2xl bg-bg p-3 text-primary">
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-[11px] text-muted">{metric.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-surface rounded-card p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">Equipe médica</p>
              <h3 className="mt-1 text-lg font-semibold text-text">Profissionais cadastrados</h3>
            </div>
            <div className="rounded-full bg-bg px-3 py-1 text-[10px] font-semibold text-muted">
              {dados.profissionais.length} registros
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {dados.profissionais.length > 0 ? (
              dados.profissionais.slice(0, 4).map((profissional) => (
                <div key={profissional.profissional_id} className="flex items-center justify-between rounded-2xl border border-border bg-bg/70 px-4 py-3">
                  <div>
                    <p className="font-semibold text-text">{profissional.nome}</p>
                    <p className="text-[11px] text-muted">{profissional.especialidade_nome || 'Especialidade não informada'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <Activity size={14} />
                    {profissional.ativo !== false ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-bg/60 px-4 py-5 text-sm text-muted">
                Nenhum profissional cadastrado ainda.
              </p>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-card p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">Próximas consultas</p>
              <h3 className="mt-1 text-lg font-semibold text-text">Agenda da semana</h3>
            </div>
            <div className="rounded-full bg-bg px-3 py-1 text-[10px] font-semibold text-muted">Atualizado</div>
          </div>

          <div className="mt-5 space-y-3">
            {proximasConsultas.length > 0 ? (
              proximasConsultas.map((consulta) => (
                <div key={consulta.consulta_id} className="rounded-2xl border border-border bg-bg/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-text">{consulta.paciente_nome || 'Paciente não informado'}</p>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                      {consulta.status || 'agendada'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">{consulta.profissional_nome || 'Profissional não informado'}</p>
                  <p className="mt-2 text-[11px] text-muted">{formatDate(consulta.data_hora)}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-bg/60 px-4 py-5 text-sm text-muted">
                Não há consultas cadastradas para exibir.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-surface rounded-card p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">Exames recentes</p>
              <h3 className="mt-1 text-lg font-semibold text-text">Últimos registros</h3>
            </div>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
              Ver todos
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {examesRecentes.length > 0 ? (
              examesRecentes.map((exame) => (
                <div key={exame.exame_id} className="flex items-center justify-between rounded-2xl border border-border bg-bg/70 px-4 py-3">
                  <div>
                    <p className="font-semibold text-text">{exame.tipo_exame}</p>
                    <p className="text-[11px] text-muted">{exame.paciente_nome || 'Paciente não informado'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-muted">{exame.status || 'pendente'}</p>
                    <p className="text-[10px] text-muted">{formatDate(exame.data_exame)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-bg/60 px-4 py-5 text-sm text-muted">
                Nenhum exame registrado até o momento.
              </p>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-card p-6 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">Especialidades</p>
              <h3 className="mt-1 text-lg font-semibold text-text">Mapa do atendimento</h3>
            </div>
            <div className="rounded-full bg-bg px-3 py-1 text-[10px] font-semibold text-muted">
              {dados.especialidades.length} áreas
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {dados.especialidades.length > 0 ? (
              dados.especialidades.map((especialidade) => (
                <span key={especialidade.especialidade_id} className="rounded-full border border-border bg-bg/70 px-3 py-2 text-[11px] font-semibold text-text">
                  {especialidade.nome}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted">Nenhuma especialidade cadastrada ainda.</p>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp size={16} />
              <p className="text-sm font-semibold">Visão geral do cuidado</p>
            </div>
            <p className="mt-2 text-sm text-muted">
              O módulo já está preparado para cadastrar consultas e exames diretamente no backend.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface rounded-card p-6 border border-border shadow-card">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
            <PlusCircle size={13} />
            <span>Nova consulta</span>
          </div>
          <form onSubmit={handleConsultaSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Paciente</label>
                <select
                  value={consultaForm.paciente_id}
                  onChange={(event) => setConsultaForm((prev) => ({ ...prev, paciente_id: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  required
                >
                  <option value="">Selecione</option>
                  {dados.pacientes.map((paciente) => (
                    <option key={paciente.paciente_id} value={paciente.paciente_id}>{paciente.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Profissional</label>
                <select
                  value={consultaForm.profissional_id}
                  onChange={(event) => setConsultaForm((prev) => ({ ...prev, profissional_id: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  required
                >
                  <option value="">Selecione</option>
                  {dados.profissionais.map((profissional) => (
                    <option key={profissional.profissional_id} value={profissional.profissional_id}>{profissional.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Data e hora</label>
                <input
                  type="datetime-local"
                  value={consultaForm.data_hora}
                  onChange={(event) => setConsultaForm((prev) => ({ ...prev, data_hora: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Status</label>
                <select
                  value={consultaForm.status}
                  onChange={(event) => setConsultaForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                >
                  <option value="agendada">Agendada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Observações</label>
              <textarea
                value={consultaForm.observacoes}
                onChange={(event) => setConsultaForm((prev) => ({ ...prev, observacoes: event.target.value }))}
                className="min-h-[96px] w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                placeholder="Detalhes importantes sobre a consulta"
              />
            </div>

            <button
              type="submit"
              disabled={submitting.consulta}
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-70"
            >
              {submitting.consulta ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
              {submitting.consulta ? 'Salvando...' : 'Salvar consulta'}
            </button>
          </form>
        </div>

        <div className="bg-surface rounded-card p-6 border border-border shadow-card">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
            <PlusCircle size={13} />
            <span>Novo exame</span>
          </div>
          <form onSubmit={handleExameSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Paciente</label>
                <select
                  value={exameForm.paciente_id}
                  onChange={(event) => setExameForm((prev) => ({ ...prev, paciente_id: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  required
                >
                  <option value="">Selecione</option>
                  {dados.pacientes.map((paciente) => (
                    <option key={paciente.paciente_id} value={paciente.paciente_id}>{paciente.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Profissional</label>
                <select
                  value={exameForm.profissional_id}
                  onChange={(event) => setExameForm((prev) => ({ ...prev, profissional_id: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  required
                >
                  <option value="">Selecione</option>
                  {dados.profissionais.map((profissional) => (
                    <option key={profissional.profissional_id} value={profissional.profissional_id}>{profissional.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Tipo do exame</label>
                <input
                  type="text"
                  value={exameForm.tipo_exame}
                  onChange={(event) => setExameForm((prev) => ({ ...prev, tipo_exame: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  placeholder="Ex.: Hemograma"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Status</label>
                <select
                  value={exameForm.status}
                  onChange={(event) => setExameForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                >
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Data do exame</label>
                <input
                  type="datetime-local"
                  value={exameForm.data_exame}
                  onChange={(event) => setExameForm((prev) => ({ ...prev, data_exame: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Resultado</label>
                <input
                  type="text"
                  value={exameForm.resultado}
                  onChange={(event) => setExameForm((prev) => ({ ...prev, resultado: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
                  placeholder="Resultado do exame"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting.exame}
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-70"
            >
              {submitting.exame ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
              {submitting.exame ? 'Salvando...' : 'Salvar exame'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaudeTime;
