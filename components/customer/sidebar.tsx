"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Compass, Calendar, CalendarCheck, User, Menu, X, LayoutDashboard, House } from "lucide-react"

const navItems = [
  { label: "Home", href: "/platform/home", icon: House },
  { label: "Browse", href: "/platform/browse", icon: Compass },
  { label: "Calendar", href: "/platform/calendar", icon: Calendar },
  { label: "Appointments", href: "/platform/appointments", icon: CalendarCheck },
  { label: "Profile", href: "/platform/profile", icon: User },
]

const bottomNavItems = navItems

export function PlatformSidebar() {
  const pathname = usePathname()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileDrawerOpen])

  const closeDrawer = () => setMobileDrawerOpen(false)

  const isActive = (href: string) => {
    if (href === "/platform/browse") return pathname.startsWith("/platform/browse")
    return pathname === href
  }

  const renderNavItems = (onNav?: () => void) =>
    navItems.map((item) => {
      const Icon = item.icon
      const active = isActive(item.href)
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNav}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
            active && "bg-muted",
          )}
        >
          <Icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      )
    })

  return (
    <>
      <aside className="hidden md:fixed md:left-0 md:top-0 md:z-30 md:flex md:h-screen md:w-64 md:flex-col md:overflow-y-auto md:border-r md:bg-card md:px-3 md:py-4">
        <Link
          href="/platform/home"
          className="mb-6 flex items-center gap-2 px-2 text-lg font-bold"
        >
          <LayoutDashboard className="size-5" />
          Glow Buddy
        </Link>
        <nav className="flex flex-1 flex-col gap-1">{renderNavItems()}</nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t bg-background/80 px-2 pb-safe backdrop-blur-lg md:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5", active ? "text-primary" : "")} />
              {item.label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground"
        >
          <Menu className="size-5" />
          Menu
        </button>
      </nav>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={closeDrawer} />
      )}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-card shadow-xl transition-transform duration-300 md:hidden",
          mobileDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <span className="text-lg font-bold">Navigation</span>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto px-3 py-4">
          {renderNavItems(closeDrawer)}
        </nav>
      </div>
    </>
  )
}
