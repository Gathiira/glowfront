import { ReactNode } from "react"
import { PlatformSidebar } from "@/components/customer/sidebar"
import { CustomerProvider } from "@/lib/customer-context"

type Props = { children: ReactNode }

export default function PlatformLayout({ children }: Props) {
  return (
    <CustomerProvider>
      <div className="flex min-h-screen">
        <PlatformSidebar />
        <main className="flex flex-1 flex-col">
          <div className="flex-1 px-4 py-4 pb-20 md:p-6 md:pb-6">{children}</div>
        </main>
      </div>
    </CustomerProvider>
  )
}
