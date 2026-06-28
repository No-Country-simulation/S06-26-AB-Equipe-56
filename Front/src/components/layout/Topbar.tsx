import { MoonStar, SunMedium } from 'lucide-react'
import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

export function Topbar() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'

    const stored = window.localStorage.getItem('theme') as ThemeMode | null
    if (stored === 'light' || stored === 'dark') return stored

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface) px-4 py-4 shadow-sm transition-all duration-300 md:px-8">
      <a href="#" className="text-lg font-extrabold tracking-tight text-(--color-text)">
        TechFlow
      </a>

      <div className="flex items-center gap-3 text-sm text-(--color-muted)">
        <button
          type="button"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          className="flex items-center gap-2 rounded-md border border-(--color-border) px-3 py-2 font-medium text-(--color-text) transition hover:bg-[rgba(79,70,229,0.06)]"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        <p className="hidden sm:block">Olá, Admin</p>
        <button className="rounded-md border border-(--color-border) px-3 py-2 font-medium text-(--color-primary) transition hover:bg-[rgba(79,70,229,0.08)]">
          Sair
        </button>
      </div>
    </header>
  )
}
