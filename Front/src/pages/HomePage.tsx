import { PageShell } from '../components/layout/PageShell'
import { TrilhaCard } from '../components/trilhas/TrilhaCard'
import { trilhasMock } from '../data/mockTrilhas'

export function HomePage() {
  const trilhasConcluidas = trilhasMock.filter((trilha) =>
    trilha.modulos.every((modulo) => modulo.concluido),
  ).length

  const progressoGeral = Math.round(
    (trilhasMock.reduce((total, trilha) => {
      const concluido = trilha.modulos.filter((modulo) => modulo.concluido).length
      return total + (concluido / trilha.modulos.length) * 100
    }, 0) / trilhasMock.length) || 0,
  )

  return (
    <PageShell currentPath="/">
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Formações
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
              Trilhas de conhecimento e capacitação
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
              Acompanhe seu progresso em ESG, diversidade e inclusão com trilhas estruturadas para fortalecer a cultura interna.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(26,61,255,0.06)] p-4">
            <p className="text-sm font-medium text-[var(--color-muted)]">Progresso geral</p>
            <p className="mt-1 text-3xl font-bold text-[var(--color-primary)]">{progressoGeral}%</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {trilhasConcluidas} de {trilhasMock.length} trilhas concluídas
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {trilhasMock.map((trilha) => (
            <TrilhaCard key={trilha.trilha_id} trilha={trilha} />
          ))}
        </div>
      </section>
    </PageShell>
  )
}
