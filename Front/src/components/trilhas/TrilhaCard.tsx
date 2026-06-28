import { Clock3, Sparkles } from 'lucide-react'
import type { Trilha } from '../../data/mockTrilhas'

type TrilhaCardProps = {
  trilha: Trilha
  onSelect?: (trilha: Trilha) => void
}

export function TrilhaCard({ trilha, onSelect }: TrilhaCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">{trilha.categoria}</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--color-text)]">{trilha.titulo}</h3>
        </div>
        {trilha.obrigatoria && (
          <span className="rounded-full bg-[color:rgba(79,70,229,0.10)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Obrigatória
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <Clock3 size={16} />
        <span>{trilha.tempo_estimado_minutos} min</span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted)]">Progresso</span>
          <span className="font-semibold text-[var(--color-text)]">{trilha.progresso}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#E5E7EB]">
          <div className="h-2 rounded-full bg-[var(--color-secondary)]" style={{ width: `${trilha.progresso}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-1 items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Sparkles size={14} className="text-[var(--color-accent)]" />
          <span>{trilha.modulos.length} módulos</span>
        </div>
        <button
          type="button"
          onClick={() => onSelect?.(trilha)}
          className="rounded-[6px] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)]"
        >
          Iniciar trilha
        </button>
      </div>
    </article>
  )
}
