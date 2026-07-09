import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Components
import Layout from '../components/Layout';
import Login from '../pages/Login';
import RegisterConvite from '../pages/RegisterConvite';
import DashboardHome from '../pages/DashboardHome';
import VagasList from '../pages/VagasList';
import MatchingView from '../pages/MatchingView';
import EquipeList from '../pages/EquipeList';
import LandingPage from '../pages/LandingPage';
import RegisterEmpresa from '../pages/RegisterEmpresa';
import Formacoes from '../pages/Formacoes';
import Pipelines from '../pages/Pipelines';
import Mentoria from '../pages/Mentoria';
import SaudeTime from '../pages/SaudeTime';
import SaudeSistema from '../pages/SaudeSistema';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={36} />
        <span className="text-sm text-muted font-medium">Carregando painel...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro-convite" element={<RegisterConvite />} />
      <Route path="/registro-empresa" element={<RegisterEmpresa />} />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="formacoes" element={<Formacoes />} />
        <Route path="vagas" element={<VagasList />} />
        <Route path="vagas/:id" element={<MatchingView />} />
        <Route path="pipelines" element={<Pipelines />} />
        <Route path="mentoria" element={<Mentoria />} />
        <Route path="saude" element={<SaudeTime />} />
        <Route path="saude-sistema" element={<SaudeSistema />} />
        <Route path="equipe" element={<EquipeList />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
