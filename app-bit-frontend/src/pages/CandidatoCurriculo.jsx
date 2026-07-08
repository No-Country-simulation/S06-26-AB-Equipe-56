import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const SKILLS_LIST = [
  { id: 1, nome: 'React.js', tipo: 'Hard Skill' },
  { id: 2, nome: 'Node.js', tipo: 'Hard Skill' },
  { id: 3, nome: 'Express', tipo: 'Hard Skill' },
  { id: 4, nome: 'SQL Server', tipo: 'Hard Skill' },
  { id: 5, nome: 'Python', tipo: 'Hard Skill' },
  { id: 6, nome: 'NLP (Processamento de Linguagem)', tipo: 'Hard Skill' },
  { id: 7, nome: 'Machine Learning', tipo: 'Hard Skill' },
  { id: 8, nome: 'PyTorch', tipo: 'Hard Skill' },
  { id: 9, nome: 'TensorFlow', tipo: 'Hard Skill' },
  { id: 10, nome: 'Kubernetes', tipo: 'Hard Skill' },
  { id: 11, nome: 'MLOps', tipo: 'Hard Skill' },
  { id: 12, nome: 'Tailwind CSS', tipo: 'Hard Skill' },
  { id: 13, nome: 'Git', tipo: 'Hard Skill' }
];

const CandidatoCurriculo = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Modais de adição
  const [showEscolaridadeModal, setShowEscolaridadeModal] = useState(false);
  const [showExperienciaModal, setShowExperienciaModal] = useState(false);

  // Form Fields: Escolaridade
  const [nomeInstituicao, setNomeInstituicao] = useState('');
  const [curso, setCurso] = useState('');
  const [tipoEscolaridade, setTipoEscolaridade] = useState('Graduação');
  const [modalidade, setModalidade] = useState('Presencial');
  const [concluido, setConcluido] = useState(false);
  const [dataInicioEsc, setDataInicioEsc] = useState('');
  const [dataFimEsc, setDataFimEsc] = useState('');

  // Form Fields: Experiencia
  const [empresa, setEmpresa] = useState('');
  const [cargoNome, setCargoNome] = useState('');
  const [senioridadeNome, setSenioridadeNome] = useState('Pleno');
  const [salario, setSalario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isAtual, setIsAtual] = useState(false);
  const [dataInicioExp, setDataInicioExp] = useState('');
  const [dataFimExp, setDataFimExp] = useState('');

  // Selected Skills
  const [selectedSkills, setSelectedSkills] = useState([]);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      const response = await api.get('/candidatos/perfil');
      setPerfil(response.data);
      if (response.data.curriculo?.skills) {
        setSelectedSkills(response.data.curriculo.skills.map(s => s.skill_id));
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do candidato:', error);
      showMsg('Erro ao carregar dados do perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleAddEscolaridade = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/candidatos/escolaridade', {
        nome_instituicao: nomeInstituicao,
        curso,
        tipo_escolaridade: tipoEscolaridade,
        modalidade,
        concluido,
        data_inicio: dataInicioEsc || null,
        data_fim: dataFimEsc || null
      });

      showMsg('Formação acadêmica adicionada!');
      setShowEscolaridadeModal(false);
      
      // Limpar campos
      setNomeInstituicao('');
      setCurso('');
      setDataInicioEsc('');
      setDataFimEsc('');
      setConcluido(false);

      fetchPerfil();
    } catch (error) {
      console.error(error);
      showMsg('Erro ao adicionar formação acadêmica.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEscolaridade = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta formação?')) return;
    try {
      await api.delete(`/candidatos/escolaridade/${id}`);
      showMsg('Formação acadêmica removida.');
      fetchPerfil();
    } catch (error) {
      console.error(error);
      showMsg('Erro ao remover formação.', 'error');
    }
  };

  const handleAddExperiencia = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/candidatos/experiencia', {
        empresa,
        cargo_nome: cargoNome,
        senioridade_nome: senioridadeNome,
        salario: salario ? parseFloat(salario) : null,
        descricao,
        is_atual: isAtual,
        data_inicio: dataInicioExp || null,
        data_fim: dataFimExp || null,
        // Usamos valores fixos de IDs que normalmente batem com o banco
        cargo_id: 1, 
        senioridade_id: senioridadeNome === 'Júnior' ? 1 : senioridadeNome === 'Pleno' ? 2 : 3
      });

      showMsg('Experiência profissional adicionada!');
      setShowExperienciaModal(false);

      // Limpar campos
      setEmpresa('');
      setCargoNome('');
      setSalario('');
      setDescricao('');
      setIsAtual(false);
      setDataInicioExp('');
      setDataFimExp('');

      fetchPerfil();
    } catch (error) {
      console.error(error);
      showMsg('Erro ao adicionar experiência profissional.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperiencia = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta experiência?')) return;
    try {
      await api.delete(`/candidatos/experiencia/${id}`);
      showMsg('Experiência profissional removida.');
      fetchPerfil();
    } catch (error) {
      console.error(error);
      showMsg('Erro ao remover experiência.', 'error');
    }
  };

  const toggleSkill = (id) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter(sId => sId !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    try {
      await api.put('/candidatos/skills', { skillIds: selectedSkills });
      showMsg('Competências salvas com sucesso!');
      fetchPerfil();
    } catch (error) {
      console.error(error);
      showMsg('Erro ao atualizar competências.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="text-sm text-muted font-medium">Carregando currículo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto text-text pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-text">Meu Currículo Profissional</h1>
        <p className="text-xs text-muted mt-1 leading-snug">Cadastre e atualize suas experiências, formações e competências para o matching ideal.</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl text-xs font-semibold border ${
          message.type === 'error' 
            ? 'bg-red-500/10 border-red-500/20 text-red-500' 
            : 'bg-teal-500/10 border-teal-500/20 text-[#0B9484]'
        }`}>
          {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Dados Pessoais */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card space-y-4">
        <h3 className="text-sm font-bold text-text flex items-center gap-2.5">
          <span className="w-1.5 h-4 bg-primary rounded-full"></span>
          Dados Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider mb-0.5">Nome Completo</span>
            <span className="font-semibold text-text">{perfil?.nome}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider mb-0.5">E-mail</span>
            <span className="font-semibold text-text">{perfil?.email}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider mb-0.5">CPF</span>
            <span className="font-semibold text-text">{perfil?.cpf}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase tracking-wider mb-0.5">Telefone</span>
            <span className="font-semibold text-text">{perfil?.telefone || 'Não informado'}</span>
          </div>
        </div>
      </div>

      {/* Formação Acadêmica (Escolaridade) */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-text flex items-center gap-2.5">
            <GraduationCap className="text-primary" size={18} />
            Formação Acadêmica
          </h3>
          <button
            onClick={() => setShowEscolaridadeModal(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-primary hover:bg-primary-strong text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus size={14} />
            <span>Adicionar Formação</span>
          </button>
        </div>

        {perfil?.curriculo?.escolaridades?.length === 0 ? (
          <p className="text-xs text-muted italic">Nenhuma formação acadêmica cadastrada por enquanto.</p>
        ) : (
          <div className="space-y-4">
            {perfil?.curriculo?.escolaridades?.map((esc) => (
              <div key={esc.escolaridade_id} className="p-4 bg-bg border border-border rounded-xl flex justify-between items-start group hover:border-primary/20 transition-all">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-text">{esc.curso}</h4>
                  <p className="text-[10px] text-muted font-medium">{esc.nome_instituicao} • <span className="text-primary">{esc.tipo_escolaridade}</span> ({esc.modalidade})</p>
                  <p className="text-[9px] text-muted flex items-center gap-1 mt-1">
                    <Calendar size={12} />
                    <span>
                      {esc.data_inicio ? new Date(esc.data_inicio).toLocaleDateString('pt-BR') : 'Sem data'} - {esc.concluido ? 'Concluído' : esc.data_fim ? new Date(esc.data_fim).toLocaleDateString('pt-BR') : 'Em andamento'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEscolaridade(esc.escolaridade_id)}
                  className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experiência Profissional */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-text flex items-center gap-2.5">
            <Briefcase className="text-[#0B9484]" size={18} />
            Experiência Profissional
          </h3>
          <button
            onClick={() => setShowExperienciaModal(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-secondary hover:bg-secondary-strong text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus size={14} />
            <span>Adicionar Experiência</span>
          </button>
        </div>

        {perfil?.curriculo?.experiencias?.length === 0 ? (
          <p className="text-xs text-muted italic">Nenhuma experiência profissional cadastrada por enquanto.</p>
        ) : (
          <div className="space-y-4">
            {perfil?.curriculo?.experiencias?.map((exp) => (
              <div key={exp.experiencia_id} className="p-4 bg-bg border border-border rounded-xl flex justify-between items-start group hover:border-secondary/20 transition-all">
                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-text">{exp.cargo_nome || 'Profissional'}</h4>
                    <p className="text-[10px] text-muted font-medium">{exp.empresa} • <span className="text-secondary">{exp.senioridade_nome || 'Nível'}</span></p>
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed font-medium max-w-2xl">{exp.descricao}</p>
                  <div className="flex flex-wrap gap-4 text-[9px] text-muted font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>
                        {exp.data_inicio ? new Date(exp.data_inicio).toLocaleDateString('pt-BR') : 'Sem data'} - {exp.is_atual ? 'Atual' : exp.data_fim ? new Date(exp.data_fim).toLocaleDateString('pt-BR') : 'Sem data'}
                      </span>
                    </span>
                    {exp.salario && (
                      <span className="flex items-center gap-0.5">
                        <DollarSign size={12} />
                        <span>Salário: R$ {exp.salario.toLocaleString('pt-BR')}</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteExperiencia(exp.experiencia_id)}
                  className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Competências (Skills) */}
      <div className="bg-surface rounded-card p-6 border border-border shadow-card space-y-6">
        <div>
          <h3 className="text-sm font-bold text-text flex items-center gap-2.5">
            <Cpu className="text-accent" size={18} />
            Habilidades & Tecnologias
          </h3>
          <p className="text-[10px] text-muted mt-1 leading-snug">Selecione as tecnologias e soft skills que você domina para o match com vagas.</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {SKILLS_LIST.map((skill) => {
            const isSelected = selectedSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`py-2 px-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary/10 border-primary/40 text-primary shadow-sm'
                    : 'bg-bg border-border text-muted hover:text-text hover:border-muted'
                }`}
              >
                {skill.nome}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border flex justify-end">
          <button
            onClick={handleSaveSkills}
            disabled={saving}
            className="flex items-center gap-2 py-2 px-5 bg-primary hover:bg-primary-strong disabled:bg-primary/50 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            <span>Salvar Habilidades</span>
          </button>
        </div>
      </div>

      {/* MODAL ESCOLARIDADE */}
      {showEscolaridadeModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-scaleIn text-text">
            <h3 className="text-base font-bold text-text mb-4">Adicionar Formação</h3>
            <form onSubmit={handleAddEscolaridade} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Instituição de Ensino *</label>
                <input
                  type="text"
                  required
                  value={nomeInstituicao}
                  onChange={(e) => setNomeInstituicao(e.target.value)}
                  placeholder="Ex: USP, FIAP, Alura"
                  className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Curso / Certificação *</label>
                <input
                  type="text"
                  required
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                  className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Tipo de Formação</label>
                  <select
                    value={tipoEscolaridade}
                    onChange={(e) => setTipoEscolaridade(e.target.value)}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  >
                    <option value="Técnico">Técnico</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                    <option value="Bacharelado">Bacharelado</option>
                    <option value="Pós-Graduação">Pós-Graduação</option>
                    <option value="Mestrado / Doutorado">Mestrado / Doutorado</option>
                    <option value="Curso Livre / Bootcamp">Curso Livre / Bootcamp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Modalidade</label>
                  <select
                    value={modalidade}
                    onChange={(e) => setModalidade(e.target.value)}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="EAD">EAD / Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Data Início</label>
                  <input
                    type="date"
                    value={dataInicioEsc}
                    onChange={(e) => setDataInicioEsc(e.target.value)}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Data Fim (Previsão)</label>
                  <input
                    type="date"
                    value={dataFimEsc}
                    onChange={(e) => setDataFimEsc(e.target.value)}
                    disabled={concluido}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="concluido"
                  checked={concluido}
                  onChange={(e) => setConcluido(e.target.checked)}
                  className="rounded border-border bg-bg text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="concluido" className="font-semibold text-text cursor-pointer">Já concluí este curso</label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEscolaridadeModal(false)}
                  className="py-2 px-4 bg-transparent border border-border hover:bg-bg rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2 px-5 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {saving ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXPERIENCIA */}
      {showExperienciaModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-scaleIn text-text">
            <h3 className="text-base font-bold text-text mb-4">Adicionar Experiência</h3>
            <form onSubmit={handleAddExperiencia} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Empresa / Organização *</label>
                <input
                  type="text"
                  required
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Ex: Google, BOI Solutions, Freelancer"
                  className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={cargoNome}
                    onChange={(e) => setCargoNome(e.target.value)}
                    placeholder="Ex: Desenvolvedor Front-end"
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Senioridade</label>
                  <select
                    value={senioridadeNome}
                    onChange={(e) => setSenioridadeNome(e.target.value)}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary"
                  >
                    <option value="Estágio">Estágio / Trainee</option>
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Salário Pretendido / Recebido</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <DollarSign size={14} />
                    </span>
                    <input
                      type="number"
                      value={salario}
                      onChange={(e) => setSalario(e.target.value)}
                      placeholder="Ex: 4500"
                      className="w-full pl-7 pr-3 py-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isAtual"
                    checked={isAtual}
                    onChange={(e) => setIsAtual(e.target.checked)}
                    className="rounded border-border bg-bg text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isAtual" className="font-semibold text-text cursor-pointer">Trabalho atual</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Data Início</label>
                  <input
                    type="date"
                    value={dataInicioExp}
                    onChange={(e) => setDataInicioExp(e.target.value)}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={dataFimExp}
                    onChange={(e) => setDataFimExp(e.target.value)}
                    disabled={isAtual}
                    className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Descrição das atividades</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva suas principais atividades e tecnologias utilizadas..."
                  rows="3"
                  className="w-full p-2.5 bg-bg border border-border rounded-xl text-text focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowExperienciaModal(false)}
                  className="py-2 px-4 bg-transparent border border-border hover:bg-bg rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2 px-5 bg-secondary hover:bg-secondary-strong text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {saving ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatoCurriculo;
