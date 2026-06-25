import {
  BriefcaseBusiness,
  ChartColumn,
  CircleUserRound,
  Compass,
  FileText,
  Route,
  Sparkles,
  Users,
} from 'lucide-react'
import { SidebarLink } from '../ui/SidebarLink'

const sidebarLinks = [
  { name: 'Dashboard', path: '/', icon: <ChartColumn size={18} />, active: true },
  { name: 'Talentos', path: '/talentos', icon: <CircleUserRound size={18} /> },
  { name: 'Vagas', path: '/vagas', icon: <BriefcaseBusiness size={18} /> },
  { name: 'Pipelines', path: '/pipelines', icon: <Route size={18} /> },
]

const pipelineLinks = [
  { name: 'ESG Score', path: '/', icon: <Sparkles size={16} />, active: false },
  { name: 'Diversidade', path: '/', icon: <Users size={16} />, active: false },
  { name: 'Geolocalização', path: '/', icon: <Compass size={16} />, active: false },
  { name: 'Relatório', path: '/', icon: <FileText size={16} />, active: false },
]

export function Sidebar() {
  return (
    <aside className="flex h-[550px] w-16 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-base transition-all duration-300 md:w-64">
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
            active={item.active}
          />
        ))}
      </div>

      <div className="mt-3 border-t border-[var(--color-border)] px-3 pt-3">
        {/* <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          ESG & DEI
        </p> */}

        <div className="flex flex-col">
                {pipelineLinks.map((item) => (
                <SidebarLink
                    key={item.name}
                    name={item.name}
                    path={item.path}
                    icon={item.icon}
                    active={item.active}
                />
                ))}
            </div>

      </div>
    </aside>
  )
}
