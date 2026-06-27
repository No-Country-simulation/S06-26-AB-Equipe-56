import {
  BriefcaseBusiness,
  ChartColumn,
  CircleUserRound,
  Compass,
  Route,
} from 'lucide-react'
import { SidebarLink } from '../ui/SidebarLink'

type SidebarProps = {
  currentPath?: string
}

const sidebarLinks = [
  { name: 'Dashboard', path: '/', icon: <ChartColumn size={18} /> },
  { name: 'Formações', path: '/formacoes', icon: <CircleUserRound size={18} /> },
  { name: 'Vagas', path: '/vagas', icon: <BriefcaseBusiness size={18} /> },
  { name: 'Pipelines', path: '/pipelines', icon: <Route size={18} /> },
  { name: 'Mentoria', path: '/mentoria', icon: <CircleUserRound size={18} /> },
  { name: 'Saude do Time', path: '/saude-do-time', icon: <Compass size={18} /> },
]

// const pipelineLinks = [
//   { name: 'ESG Score', path: '/', icon: <Sparkles size={16} />, active: false },
//   { name: 'Diversidade', path: '/', icon: <Users size={16} />, active: false },
//   { name: 'Geolocalização', path: '/', icon: <Compass size={16} />, active: false },
//   { name: 'Relatório', path: '/', icon: <FileText size={16} />, active: false },
// ]

export function Sidebar({ currentPath = '/' }: SidebarProps) {
  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-base transition-all duration-300 md:w-64 lg:min-h-[calc(100vh-73px)]">
      <div className="px-3 pb-3">
        {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Menu
        </p> */}
      </div>

      <div className="flex flex-col">
        {sidebarLinks.map((item) => (
          <SidebarLink
            key={item.name}
            name={item.name}
            path={item.path}
            icon={item.icon}
            active={currentPath === item.path}
          />
        ))}
      </div>

    
    </aside>
  )
}
