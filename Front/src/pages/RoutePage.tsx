import { PageShell } from '../components/layout/PageShell'

type RoutePageProps = {
  title: string
  description: string
  currentPath: string
}

export function RoutePage({ title, description, currentPath }: RoutePageProps) {
  return (
    <PageShell currentPath={currentPath}>
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Navegação
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">{title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{description}</p>
      </section>
    </PageShell>
  )
}
