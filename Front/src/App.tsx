import './App.css'
import { useMemo } from 'react'
import { HomePage } from './pages/HomePage'
import { RoutePage } from './pages/RoutePage'

function App() {
  const pathname = useMemo(() => window.location.pathname, [])

  if (pathname === '/formacoes') {
    return (
      <RoutePage
        currentPath={pathname}
        title="Formações"
        description="Explore trilhas, conteúdos e materiais de capacitação para o seu desenvolvimento profissional."
      />
    )
  }

  if (pathname === '/vagas') {
    return (
      <RoutePage
        currentPath={pathname}
        title="Vagas"
        description="Acompanhe oportunidades abertas, requisitos e próximos passos para candidatura."
      />
    )
  }

  if (pathname === '/pipelines') {
    return (
      <RoutePage
        currentPath={pathname}
        title="Pipelines"
        description="Visualize processos, etapas e métricas do pipeline para um acompanhamento mais claro."
      />
    )
  }

  if (pathname === '/mentoria') {
    return (
      <RoutePage
        currentPath={pathname}
        title="Mentoria"
        description="Conecte-se com mentores e tenha apoio para evoluir com mais confiança."
      />
    )
  }

  if (pathname === '/saude-do-time') {
    return (
      <RoutePage
        currentPath={pathname}
        title="Saúde do Time"
        description="Monitore bem-estar, engajamento e indicadores que ajudam a fortalecer o ambiente de trabalho."
      />
    )
  }

  return <HomePage />
}

export default App
