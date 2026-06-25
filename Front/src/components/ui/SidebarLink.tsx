type SidebarLinkProps = {
  name: string
  path: string
  icon: React.ReactNode
  active?: boolean
}

export function SidebarLink({ name, path, icon, active = false }: SidebarLinkProps) {
  return (
    <a
      href={path}
      className={`flex items-center gap-3 px-4 py-3 ${
        active
          ? 'border-r-[6px] border-[var(--color-primary)] bg-[color:rgba(26,61,255,0.10)] text-[var(--color-primary)]'
          : 'border-white text-[var(--color-text)] hover:bg-[color:rgba(26,61,255,0.08)]'
      }`}
    >
      {icon}
      <p className="hidden text-center md:block">{name}</p>
    </a>
  )
}
