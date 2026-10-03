"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Barlow, Barlow_Condensed } from "next/font/google"
import { CalendarOff, LogOut, Mail, Scissors } from "lucide-react"
import { useUser } from "@/lib/use-user"
import "./staff.css"

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" })
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
})

const tabs = [
  { href: "/staff/commissions", label: "Pay", icon: Mail },
  { href: "/staff/leave", label: "Leave", icon: CalendarOff },
  { href: "/staff/services", label: "Services", icon: Scissors },
]

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const profile = useUser("customer_profile")

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("customer_profile")
    localStorage.removeItem("staff_profile")
    router.push("/")
  }

  return (
    <div className={`sp ${barlow.variable} ${barlowCondensed.variable}`}>
      <header className="sp-topbar">
        <Link href="/staff/commissions" className="sp-wordmark">
          GlowBuddy <span>Team</span>
        </Link>
        <nav className="sp-topnav" aria-label="Staff portal">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} aria-current={pathname === t.href ? "page" : undefined}>
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="sp-who">
          {profile && (
            <span className="sp-who-name">
              {profile.firstName} {profile.lastName}
            </span>
          )}
          <button type="button" className="sp-iconbtn" onClick={logout} aria-label="Log out">
            <LogOut className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </header>

      <main className="sp-main">{children}</main>

      <nav className="sp-tabbar" aria-label="Staff portal">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <Link key={t.href} href={t.href} aria-current={pathname === t.href ? "page" : undefined}>
              <Icon className="size-6" strokeWidth={1.75} aria-hidden />
              {t.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
