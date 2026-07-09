import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  GitFork, 
  Users,
  Heart,
  Activity
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [empresa, setEmpresa] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const response = await api.get('/empresas/meu-perfil');
        setEmpresa(response.data);
      } catch (error) {
        console.error('Erro ao buscar perfil da empresa:', error);
      }
    };

    if (user) {
      fetchEmpresa();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-primary', activeBg: 'active-nav-primary text-primary shadow-[0_2px_10px_rgba(91,62,166,0.05)]', end: true },
    { path: '/dashboard/formacoes', label: 'Formações', icon: GraduationCap, color: 'text-primary', activeBg: 'active-nav-primary text-primary shadow-[0_2px_10px_rgba(91,62,166,0.05)]' },
    { path: '/dashboard/vagas', label: 'Vagas', icon: Briefcase, color: 'text-secondary', activeBg: 'active-nav-secondary text-secondary shadow-[0_2px_10px_rgba(11,148,132,0.05)]' },
    { path: '/dashboard/pipelines', label: 'Pipelines', icon: GitFork, color: 'text-secondary', activeBg: 'active-nav-secondary text-secondary shadow-[0_2px_10px_rgba(11,148,132,0.05)]' },
    { path: '/dashboard/mentoria', label: 'Mentoria', icon: Users, color: 'text-accent', activeBg: 'active-nav-accent text-accent shadow-[0_2px_10px_rgba(196,77,48,0.05)]' },
    { path: '/dashboard/saude', label: 'Saúde do Time', icon: Heart, color: 'text-accent', activeBg: 'active-nav-accent text-accent shadow-[0_2px_10px_rgba(196,77,48,0.05)]' },
    { path: '/dashboard/saude-sistema', label: 'Saúde do Sistema', icon: Activity, color: 'text-secondary', activeBg: 'active-nav-secondary text-secondary shadow-[0_2px_10px_rgba(11,148,132,0.05)]' },
    { path: '/dashboard/equipe', label: 'Membros da Equipe', icon: Users, color: 'text-muted', activeBg: 'bg-surface border-border text-text' },
  ];

  return (
    <div className="min-h-screen bg-bg flex text-text transition-colors duration-250">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        empresa={empresa}
        user={user}
        navItems={navItems}
        handleLogout={handleLogout}
      />

      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          toggleTheme={toggleTheme}
          empresa={empresa}
          user={user}
          location={location}
        />

        {/* Content Body - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

