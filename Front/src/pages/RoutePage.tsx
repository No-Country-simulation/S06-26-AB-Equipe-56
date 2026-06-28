import { useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { TrilhaCard } from '../components/trilhas/TrilhaCard'
import type { Modulo, Trilha } from '../data/mockTrilhas'
import { trilhasMock } from '../data/mockTrilhas'

type RoutePageProps = {
  title: string
  description: string
  currentPath: string
}

export function RoutePage({ title, description, currentPath }: RoutePageProps) {
  const isFormacoesRoute = currentPath === '/formacoes'
  const [selectedTrilha, setSelectedTrilha] = useState<Trilha | null>(null)
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleBackToList = () => {
    setSelectedTrilha(null)
    setSelectedModulo(null)
    setAnswers({})
    setQuizCompleted(false)
  }

  const handleBackToTrilha = () => {
    setSelectedModulo(null)
    setAnswers({})
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!selectedModulo) return

    setAnswers((prev) => ({ ...prev, [`${selectedModulo.modulo_id}-${questionIndex}`]: optionIndex }))
  }

  const handleSubmitQuiz = () => {
    if (!selectedTrilha || !selectedModulo) return

    const correctAnswers = selectedModulo.questionario.filter((question, index) => {
      const answer = answers[`${selectedModulo.modulo_id}-${index}`]
      return answer === question.resposta_correta
    }).length

    const score = (correctAnswers / selectedModulo.questionario.length) * 100

    if (score >= 70) {
      const updatedTrilha = {
        ...selectedTrilha,
        progresso: Math.min(100, Math.round(((selectedTrilha.modulos.filter((modulo) => modulo.modulo_id === selectedModulo.modulo_id || modulo.concluido).length / selectedTrilha.modulos.length) * 100))),
        modulos: selectedTrilha.modulos.map((modulo) =>
          modulo.modulo_id === selectedModulo.modulo_id ? { ...modulo, concluido: true } : modulo,
        ),
      }

      setSelectedTrilha(updatedTrilha)
    }

    setQuizCompleted(true)
  }

  const completedCount = selectedTrilha?.modulos.filter((modulo) => modulo.concluido).length ?? 0
  const progressValue = useMemo(() => {
    if (!selectedTrilha) return 0
    return Math.round((completedCount / selectedTrilha.modulos.length) * 100)
  }, [completedCount, selectedTrilha])

  const isCompleted = Boolean(selectedTrilha && selectedTrilha.obrigatoria && progressValue === 100)

  return (
    <PageShell currentPath={currentPath}>
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Navegação
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)]">{title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{description}</p>

        {isFormacoesRoute && !selectedTrilha && (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {trilhasMock.map((trilha) => (
              <TrilhaCard key={trilha.trilha_id} trilha={trilha} onSelect={setSelectedTrilha} />
            ))}
          </div>
        )}

        {isFormacoesRoute && selectedTrilha && !selectedModulo && !isCompleted && (
          <div className="mt-8 space-y-6">
            <button
              type="button"
              onClick={handleBackToList}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-slate-100"
            >
              ← Voltar para trilhas
            </button>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Detalhe da Trilha
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                    {selectedTrilha.titulo}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{selectedTrilha.categoria}</p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[color:rgba(26,61,255,0.06)] p-4">
                  <p className="text-sm font-medium text-[var(--color-muted)]">Progresso geral</p>
                  <p className="mt-1 text-3xl font-bold text-[var(--color-primary)]">{progressValue}%</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {selectedTrilha.modulos.map((modulo) => {
                  const statusLabel = modulo.concluido ? 'Concluído' : 'Não concluído'
                  return (
                    <div
                      key={modulo.modulo_id}
                      className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <h3 className="text-base font-semibold text-[var(--color-text)]">{modulo.titulo}</h3>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          Tipo: {modulo.tipo === 'video' ? 'Vídeo' : 'Artigo'}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">{statusLabel}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedModulo(modulo)}
                        className="rounded-full bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition active:scale-95"
                      >
                        Abrir Módulo
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {isFormacoesRoute && selectedTrilha && isCompleted && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:rgba(26,61,255,0.10)] text-[var(--color-primary)]">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2 4 5v6c0 5 3.4 8.8 8 11 4.6-2.2 8-6 8-11V5l-8-3Z" fill="currentColor" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-[var(--color-text)]">Parabéns!</h2>
              <p className="mt-3 text-[var(--color-muted)]">
                Você concluiu todos os módulos desta trilha obrigatória.
              </p>
              <div className="mt-6 inline-flex rounded-full border border-[var(--color-primary)] bg-[color:rgba(26,61,255,0.08)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)]">
                {selectedTrilha.badge_recompensa}
              </div>
              <p className="mt-6 text-sm text-[var(--color-text)]">Status da trilha: Concluída</p>
            </div>
          </div>
        )}

        {isFormacoesRoute && selectedTrilha && selectedModulo && !isCompleted && (
          <div className="mt-8 space-y-6">
            <button
              type="button"
              onClick={handleBackToTrilha}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-slate-100"
            >
              ← Voltar para detalhes da trilha
            </button>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Player de Módulo
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                    {selectedModulo.titulo}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Tipo: {selectedModulo.tipo === 'video' ? 'Vídeo' : 'Artigo'}
                  </p>
                </div>

                {selectedModulo.tipo === 'video' ? (
                  <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                    <iframe
                      src={selectedModulo.url_conteudo}
                      title={selectedModulo.titulo}
                      className="h-[320px] w-full md:h-[420px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[var(--color-border)] bg-slate-50 p-5 text-sm leading-7 text-[var(--color-muted)]">
                    <p>
                      Este módulo apresenta um artigo de apoio com conceitos fundamentais sobre inclusão,
                      boas práticas e exemplos aplicados no ambiente de trabalho.
                    </p>
                    <p className="mt-3">
                      A leitura é recomendada para quem deseja consolidar os aprendizados e aplicar as
                      estratégias em situações reais de liderança e colaboração.
                    </p>
                  </div>
                )}

                <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">Questionário</h3>
                  {selectedModulo.questionario.map((question, index) => (
                    <div key={`${selectedModulo.modulo_id}-${index}`} className="space-y-2">
                      <p className="text-sm font-medium text-[var(--color-text)]">{question.pergunta}</p>
                      <div className="space-y-2">
                        {question.opcoes.map((option, optionIndex) => (
                          <label key={`${selectedModulo.modulo_id}-${index}-${optionIndex}`} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                            <input
                              type="radio"
                              name={`${selectedModulo.modulo_id}-${index}`}
                              checked={answers[`${selectedModulo.modulo_id}-${index}`] === optionIndex}
                              onChange={() => handleAnswerSelect(index, optionIndex)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="rounded-full bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition active:scale-95"
                  >
                    Enviar Respostas
                  </button>

                  {quizCompleted && (
                    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-text)]">
                      {selectedModulo.concluido ? (
                        <p>Parabéns! Você atingiu 70% ou mais de acertos e o módulo foi marcado como concluído.</p>
                      ) : (
                        <p>Você não atingiu 70% de acertos. Revise o conteúdo e tente novamente.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  )
}
