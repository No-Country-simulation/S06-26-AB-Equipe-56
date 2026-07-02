import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, 
  ChevronRight, 
  LogOut, 
  Shield, 
  X 
} from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  empresa, 
  user, 
  navItems, 
  handleLogout 
}) => {
  return (
    <>
      {/* Sidebar - Mobile toggle overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-surface via-surface to-bg/30 border-r border-border flex flex-col justify-between transform transition-all duration-350 ease-out lg:translate-x-0 lg:static lg:h-screen shrink-0 shadow-lg lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo / Header */}
          <div className="h-20 border-b border-border flex items-center justify-between px-6 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-surface border border-border p-1.5 rounded-xl">
                  <svg className="w-7 h-7" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 37V20" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    <path d="M20 28C16 25 10 23 8 18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M20 28C24 25 30 23 32 18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M20 22C16 19 13 14 12 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <path d="M20 22C24 19 27 14 28 10" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    
                    <polygon points="20,4 22.2,5.7 22.2,9.3 20,11 17.8,9.3 17.8,5.7" fill="var(--color-primary-strong)"/>
                    <polygon points="8,14 9.5,15.2 9.5,17.8 8,19 6.5,17.8 6.5,15.2" fill="var(--color-secondary)"/>
                    <polygon points="32,14 33.5,15.2 33.5,17.8 32,19 30.5,17.8 30.5,15.2" fill="var(--color-secondary)"/>
                    <circle cx="20" cy="16" r="2.5" fill="var(--color-accent)"/>
                  </svg>
                </div>
              </div>
              <span className="text-lg font-black tracking-tight text-text font-display">
                Inclusi<span className="text-primary">.va</span>
              </span>
            </div>
            <button className="lg:hidden text-muted hover:text-text cursor-pointer p-1 rounded-lg hover:bg-bg transition-colors" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Company Mini Card */}
          {empresa && (
            <div className="mx-4 mt-6 p-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-border rounded-2xl flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-primary transition-all duration-300 group">
              <div className="p-2.5 bg-surface border border-border rounded-xl text-primary mt-0.5 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                <Building2 size={16} />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] text-muted block uppercase tracking-wider font-extrabold">Portal Corporativo</span>
                <h4 className="text-xs font-bold text-text truncate leading-snug group-hover:text-primary transition-colors">{empresa.nome}</h4>
                <p className="text-[9px] font-semibold text-muted/80 truncate mt-0.5">CNPJ: {empresa.cnpj}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-8 px-3.5 space-y-1.5 flex-1">
            <span className="px-4 text-[9px] font-extrabold text-muted/65 uppercase tracking-widest block mb-2">Menu Principal</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 group cursor-pointer border
                    ${isActive 
                      ? `${item.activeBg} font-extrabold translate-x-1` 
                      : 'text-muted/90 border-transparent hover:bg-surface-hover hover:text-text hover:translate-x-1'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={`shrink-0 transition-transform group-hover:scale-110 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0 text-muted" />
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border bg-surface/30 sticky bottom-0 z-10">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-surface to-bg/50 border border-border rounded-2xl mb-3 shadow-[0_-2px_10px_rgba(0,0,0,0.01)]">
              {/* Quick Profile Icon with Initial (Symbol) */}
              <div className="h-9 w-9 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xs font-black select-none shadow-sm shrink-0">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-black text-text truncate">{user?.nome}</div>
                <div className="text-[9px] text-muted truncate mt-0.5">{user?.email}</div>
              </div>
              <div className={`
                px-2 py-0.5 text-[8px] font-black rounded-lg border uppercase shrink-0 flex items-center gap-1
                ${user?.permissao_id === 1 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent' 
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-transparent'
                }
              `}>
                {user?.permissao_id === 1 ? (
                  <>
                    <Shield size={8} />
                    <span>Admin</span>
                  </>
                ) : (
                  <span>Recr.</span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-surface hover:bg-error/8 hover:text-error hover:border-error/20 border border-border rounded-xl text-xs text-text font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm"
            >
              <LogOut size={14} />
              <span>Sair do Painel</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
