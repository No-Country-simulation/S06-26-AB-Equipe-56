export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all duration-300 md:px-8">
      <a href="#" className="font-semibold tracking-wide text-[var(--color-primary)]">
        TechFlow
      </a>

      <div className="flex items-center gap-5 text-[var(--color-muted)]">
        <p>Hi! Admin</p>
        <button className="rounded-full border border-[var(--color-border)] px-4 py-1 text-sm text-[var(--color-primary)]">
          Logout
        </button>
      </div>
    </header>
  )
}
