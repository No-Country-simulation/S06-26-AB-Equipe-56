import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

const Header = ({ 
  setSidebarOpen, 
  theme, 
  toggleTheme, 
  empresa, 
  user, 
  location 
}) => {
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard de Visão Geral';
    if (path.includes('/formacoes')) return 'Formações e Capacitação';
    if (path.includes('/vagas')) return 'Módulo de Vagas';
    if (path.includes('/pipelines')) return 'Pipelines de Recrutamento';
    if (path.includes('/mentoria')) return 'Programa de Mentoria';
    if (path.includes('/saude')) return 'Saúde do Time';
    if (path.includes('/equipe')) return 'Gestão de Equipe';
    return 'Painel';
  };

  return (
    <header className="h-20 bg-surface border-b border-border flex items-center justify-between px-6 lg:px-8 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-text hover:text-primary cursor-pointer" 
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-base lg:text-lg font-bold text-text leading-none">
            {getPageTitle()}
          </h2>
          <span className="text-[10px] text-muted mt-1.5 block uppercase tracking-wider font-semibold">
            Plataforma B2B de Recrutamento Inclusivo
          </span>
        </div>
      </div>

      {/* Header Info & Theme Switcher */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-bg border border-border rounded-xl text-text hover:text-primary transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
          title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="h-8 w-px bg-border hidden sm:block"></div>

        {empresa && (
          <div className="hidden sm:flex flex-col items-end text-right text-xs">
            <span className="font-bold text-text truncate max-w-[200px]">{empresa.razao_social}</span>
            <span className="text-[9px] font-semibold text-muted tracking-wide mt-0.5">CNPJ: {empresa.cnpj}</span>
          </div>
        )}
        
        {/* Quick Profile Icon with Initial */}
        <div className="h-10 w-10 bg-primary/10 border border-border rounded-xl flex items-center justify-center text-primary font-black select-none shadow-sm">
          {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header;
