import { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

type Props = { children: ReactNode }

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col">
        <div className="flex-1 px-4 py-4 pb-20 md:p-6 md:pb-6">{children}</div>
      </main>
    </div>
  )
}
