import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

type PageShellProps = {
  currentPath: string
  children: ReactNode
}

export function PageShell({ currentPath, children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Topbar />

      <div className="flex flex-1 flex-row overflow-hidden">
        <Sidebar currentPath={currentPath} />

        <main className="min-w-0 flex-1 overflow-x-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
