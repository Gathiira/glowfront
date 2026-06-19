import { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

type Props = { children: ReactNode }

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/80 px-4 py-3 backdrop-blur-lg md:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Partner Dashboard
            </p>
          </div>
        </header>
        <main className="flex-1 px-4 py-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
    </div>
  )
}
