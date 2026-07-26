"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav"
import { fetchPartnerBusiness } from "@/lib/api/partner"
import { UserBadge } from "@/components/ui/user-badge"

type Props = { children: ReactNode }

export default function DashboardLayout({ children }: Props) {
  const [businessName, setBusinessName] = useState("")

  useEffect(() => {
    fetchPartnerBusiness()
      .then((b) => setBusinessName(b.name))
      .catch(() => {})
  }, [])

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/80 px-4 py-3 backdrop-blur-lg md:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Partner Dashboard
            </p>
            <div className="flex items-center gap-4">
              {businessName && (
                <span className="text-sm font-semibold">{businessName}</span>
              )}
              <UserBadge storageKeys={["customer_profile", "partner_profile"]} />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <DashboardMobileNav />
    </div>
  )
}
