import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-4 text-white">
        <h2 className="mb-6 text-xl font-bold">Dashboard</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block hover:text-gray-300">
            Home
          </a>
          <a href="/dashboard/analytics" className="block hover:text-gray-300">
            Analytics
          </a>
          <a href="/dashboard/settings" className="block hover:text-gray-300">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div>User Menu</div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  )
}
