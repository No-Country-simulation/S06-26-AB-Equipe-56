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
  { name: 'Saúde do Time', path: '/saude-do-time', icon: <Compass size={18} /> },
]

export function Sidebar({ currentPath = '/' }: SidebarProps) {
  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] py-4 transition-all duration-300 md:w-64 lg:min-h-[calc(100vh-73px)]">
      {/* <div className="px-4 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
          Menu
        </p>
      </div> */}

      <div className="flex flex-col gap-1 px-2">
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
