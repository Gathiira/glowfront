import { ReactNode } from "react"
import { PlatformSidebar } from "@/components/customer/sidebar"
import { PlatformMobileNav } from "@/components/customer/mobile-nav"
import { CustomerProvider } from "@/lib/customer-context"
import { UserBadge } from "@/components/ui/user-badge"

type Props = { children: ReactNode }

export default function PlatformLayout({ children }: Props) {
  return (
    <CustomerProvider>
      <div className="flex min-h-dvh">
        <PlatformSidebar />
        <div className="flex min-w-0 flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-20 border-b bg-background/80 px-4 py-3 backdrop-blur-lg md:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Customer Platform
              </p>
              <UserBadge storageKeys={["customer_profile"]} />
            </div>
          </header>
          <main className="flex-1 px-4 py-4 pb-24 md:p-6 md:pb-6">{children}</main>
        </div>
        <PlatformMobileNav />
      </div>
    </CustomerProvider>
  )
}
