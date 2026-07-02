import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

const EquipeList = () => {
  const { user } = useAuth();
  const isAdmin = user?.permissao_id === 1;

  const [recrutadores, setRecrutadores] = useState([]);
  const [convites, setConvites] = useState([]);
  const [loadingRecrutadores, setLoadingRecrutadores] = useState(true);
  const [loadingConvites, setLoadingConvites] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermissao, setInvitePermissao] = useState('2'); // 2 for Recruiter by default
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [copied, setCopied] = useState(false);

  const [mainError, setMainError] = useState('');

  const fetchRecrutadores = async () => {
    try {
      setLoadingRecrutadores(true);
      setMainError('');
      const response = await api.get('/recrutadores');
      // Filter by the current company
      const filtered = response.data.filter(r => r.empresa_id === user.empresa_id);
      setRecrutadores(filtered);
    } catch (err) {
      console.error(err);
      setMainError('Erro ao carregar recrutadores da equipe.');
    } finally {
      setLoadingRecrutadores(false);
    }
  };

  const fetchConvites = async () => {
    if (!isAdmin) return;
    try {
      setLoadingConvites(true);
      const response = await api.get(`/convites/${user.empresa_id}`);
      setConvites(response.data.convites || []);
    } catch (err) {
      console.error('Erro ao buscar convites:', err);
    } finally {
      setLoadingConvites(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecrutadores();
      fetchConvites();
    }
  }, [user]);

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      setInviteError('E-mail é obrigatório.');
      return;
    }

    setInviteError('');
    setGeneratingInvite(true);
    setGeneratedLink('');
    setCopied(false);

    try {
      const response = await api.post('/convites/gerar', {
        empresa_id: user.empresa_id,
        email: inviteEmail,
        permissao_id: parseInt(invitePermissao)
      });

      const { dados_convite } = response.data;
      
      // Construct frontend link instead of backend endpoint
      const frontendPort = window.location.port ? `:${window.location.port}` : '';
      const frontendLink = `${window.location.protocol}//${window.location.hostname}${frontendPort}/registro-convite?token=${dados_convite.token}&email=${encodeURIComponent(dados_convite.email_convidado)}`;
      
      setGeneratedLink(frontendLink);
      setInviteEmail('');
      
      // Refresh invitations list
      fetchConvites();
    } catch (err) {
      console.error(err);
      setInviteError(
        err.response?.data?.mensagem || 
        'Erro ao gerar convite. Verifique se o e-mail já possui um convite ativo.'
      );
    } finally {
      setGeneratingInvite(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-text">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-text flex items-center gap-2.5">
          <span>Membros da Equipe</span>
          <span className="text-xs font-bold px-2.5 py-0.5 bg-surface text-muted rounded-full border border-border">
            {recrutadores.length}
          </span>
        </h1>
        <p className="text-muted text-xs mt-1">
          Lista de recrutadores ativos e área para convidar novos membros.
        </p>
      </div>

      {mainError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{mainError}</span>
        </div>
      )}

      {/* Two Column Layout if Admin (Table on left, Form on right), otherwise full width table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Table Column */}
        <div className={`lg:col-span-3 space-y-4 ${isAdmin ? '' : 'lg:col-span-5'}`}>
          <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <h3 className="text-sm font-bold text-text">Membros Ativos</h3>
            </div>

            {loadingRecrutadores ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span className="text-xs text-muted font-semibold">Buscando equipe...</span>
              </div>
            ) : recrutadores.length === 0 ? (
              <div className="p-8 text-center text-muted text-xs font-medium">
                Nenhum recrutador registrado para esta empresa.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-muted text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-4 px-5">Nome</th>
                      <th className="py-4 px-5">E-mail</th>
                      <th className="py-4 px-5">Nível de Acesso</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-text font-medium">
                    {recrutadores.map((recrutador) => (
                      <tr key={recrutador.recrutador_id} className="hover:bg-bg transition-colors">
                        <td className="py-4 px-5 font-bold text-text">{recrutador.nome}</td>
                        <td className="py-4 px-5 font-mono text-muted text-[11px]">{recrutador.email}</td>
                        <td className="py-4 px-5">
                          <span className={`
                            inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase
                            ${recrutador.permissao_id === 1
                              ? 'badge-primary'
                              : 'badge-secondary'
                            }
                          `}>
                            <Shield size={10} />
                            {recrutador.permissao_id === 1 ? 'Admin' : 'Recrutador'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Invited/Pending Members List (Admins Only) */}
          {isAdmin && (
            <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <h3 className="text-sm font-bold text-text">Convites Enviados</h3>
              </div>

              {loadingConvites ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-primary" size={20} />
                </div>
              ) : convites.length === 0 ? (
                <div className="p-6 text-center text-muted text-xs font-medium">
                  Nenhum convite pendente ou enviado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-muted text-[9px] uppercase font-bold tracking-wider">
                        <th className="py-3.5 px-5">E-mail Convidado</th>
                        <th className="py-3.5 px-5">Tipo</th>
                        <th className="py-3.5 px-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-text font-medium">
                      {convites.map((convite) => (
                        <tr key={convite.convite_id} className="hover:bg-bg">
                          <td className="py-3 px-5 font-mono text-muted text-[11px]">{convite.email_convidado}</td>
                          <td className="py-3 px-5">
                            <span className={`
                              inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase
                              ${convite.permissao_id === 1
                                ? 'badge-primary'
                                : 'badge-secondary'
                              }
                            `}>
                              <Shield size={10} />
                              {convite.permissao_id === 1 ? 'Admin' : 'Recrutador'}
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            <span className={`
                              inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase
                              ${convite.status === 'Aceito'
                                ? 'bg-secondary/15 text-secondary'
                                : 'bg-accent/15 text-accent'
                              }
                            `}>
                              {convite.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Invite Form Column (Admins Only) */}
        {isAdmin ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-card shadow-card p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 badge-primary rounded-lg">
                  <UserPlus size={16} />
                </div>
                <h3 className="text-sm font-bold text-text">Novo Membro</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed font-medium">
                Gere um token de convite seguro. O novo membro poderá registrar-se sob a mesma conta corporativa.
              </p>

              {inviteError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{inviteError}</span>
                </div>
              )}

              <form onSubmit={handleGenerateInvite} className="space-y-4">
                <div>
                  <label htmlFor="invite-email" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    E-mail do Convidado
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      id="invite-email"
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colaborador@empresa.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-bg border border-border rounded-xl text-xs text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="invite-permissao" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wider">
                    Nível de Permissão
                  </label>
                  <select
                    id="invite-permissao"
                    value={invitePermissao}
                    onChange={(e) => setInvitePermissao(e.target.value)}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-xl text-xs text-text focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="2">Recrutador (Nível 2)</option>
                    <option value="1">Administrador (Nível 1)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generatingInvite}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-strong disabled:bg-primary/50 text-white font-bold rounded-xl text-xs transition-all cursor-pointer active:scale-[0.98]"
                >
                  {generatingInvite ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Link de Convite'
                  )}
                </button>
              </form>

              {/* Display Generated Link */}
              {generatedLink && (
                <div className="pt-4 border-t border-border space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-text">
                    <CheckCircle2 size={16} className="text-secondary" />
                    <span>Link Gerado com Sucesso!</span>
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed font-medium">
                    Copie e envie o endereço abaixo para o convidado. O convite expira em 24 horas.
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="flex-1 px-3 py-2.5 bg-bg border border-border rounded-xl text-[10px] font-mono text-muted focus:outline-none select-all overflow-ellipsis"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-2.5 bg-bg hover:bg-surface border border-border rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                      title="Copiar Link"
                    >
                      {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} className="text-text" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Recruiter Help Panel
          <div className="lg:col-span-2 bg-surface border border-border rounded-card shadow-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <AlertCircle size={20} />
              <h4 className="text-xs font-bold text-text uppercase tracking-wider">Acesso Restrito</h4>
            </div>
            <p className="text-xs text-muted leading-relaxed font-medium">
              Apenas usuários com permissão de **Administrador (Nível 1)** podem gerar links de convites para novos recrutadores ou ver o histórico completo de convites enviados.
            </p>
            <p className="text-xs text-muted/80 leading-relaxed font-medium">
              Caso precise adicionar um colega de equipe, solicite ao administrador da sua empresa (Ex: Isabelle Victoria).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipeList;
