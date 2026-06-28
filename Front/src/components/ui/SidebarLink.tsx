import type { ReactNode } from 'react'

type SidebarLinkProps = {
  name: string
  path: string
  icon: ReactNode
  active?: boolean
}

export function SidebarLink({ name, path, icon, active = false }: SidebarLinkProps) {
  return (
    <a
      href={path}
      className={`flex items-center gap-3 rounded-[6px] px-3 py-3 text-sm font-medium transition ${
        active
          ? 'bg-[color:rgba(79,70,229,0.10)] text-[var(--color-primary)]'
          : 'text-[var(--color-muted)] hover:bg-[color:rgba(79,70,229,0.06)] hover:text-[var(--color-text)]'
      }`}
    >
      <span className={active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}>{icon}</span>
      <p className="hidden text-center md:block">{name}</p>
    </a>
  )
}
