"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CalendarOff, HandCoins, LogOut, Mail, Receipt, Scissors, Smartphone } from "lucide-react"
import { useUser } from "@/lib/use-user"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { staffFonts } from "./_lib/fonts"
import { PasswordDialog } from "./_components/password-dialog"
import "./staff.css"

const tabs = [
  { href: "/staff/sale", label: "Sale", icon: Receipt },
  { href: "/staff/claim", label: "Claim", icon: HandCoins },
  { href: "/staff/mpesa", label: "M-Pesa", icon: Smartphone },
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
    <div className={`sp ${staffFonts}`}>
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
          <PasswordDialog />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button type="button" className="sp-iconbtn" aria-label="Log out">
                <LogOut className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className={`sp-dialog ${staffFonts}`}>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription>You&apos;ll need your email or phone and password to sign back in.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction className="sp-dialog-neutral" onClick={logout}>
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
