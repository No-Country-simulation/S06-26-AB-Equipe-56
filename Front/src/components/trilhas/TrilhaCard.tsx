import { Clock3 } from 'lucide-react'
import type { Trilha } from '../../data/mockTrilhas'

type TrilhaCardProps = {
  trilha: Trilha
  onSelect?: (trilha: Trilha) => void
}

export function TrilhaCard({ trilha, onSelect }: TrilhaCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-primary)]">{trilha.categoria}</p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--color-text)]">{trilha.titulo}</h3>
        </div>
        {trilha.obrigatoria && (
          <span className="rounded-full bg-[color:rgba(26,61,255,0.10)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            Obrigatória
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <Clock3 size={16} />
        <span>{trilha.tempo_estimado_minutos} min</span>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted)]">Progresso</span>
          <span className="font-semibold text-[var(--color-text)]">{trilha.progresso}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-[var(--color-primary)]" style={{ width: `${trilha.progresso}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-1 items-end justify-between gap-3">
        <span className="text-sm text-[var(--color-muted)]">{trilha.modulos.length} módulos</span>
        <button
          type="button"
          onClick={() => onSelect?.(trilha)}
          className="w-36 rounded-full bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition active:scale-95"
        >
          <p className="mb-0.5">Iniciar Trilha</p>
        </button>
      </div>
    </article>
  )
}
