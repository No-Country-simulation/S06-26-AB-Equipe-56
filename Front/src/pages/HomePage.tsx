import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
            <h1 className="text-4xl font-bold text-[var(--color-text)]">Welcome to the Home Page</h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">
              This is a simple home page built with React and Tailwind CSS.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
