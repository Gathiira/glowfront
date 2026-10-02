"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserBadge } from "@/components/ui/user-badge"

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("customer_profile")
    localStorage.removeItem("staff_profile")
    router.push("/")
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg md:px-6">
        <p className="text-sm font-medium text-muted-foreground">Glow Buddy · Team</p>
        <div className="flex items-center gap-3">
          <UserBadge storageKeys={["customer_profile"]} />
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  )
}
