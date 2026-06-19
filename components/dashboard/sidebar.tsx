"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  LayoutDashboard,
  Calendar,
  DollarSign,
  CalendarCheck,
  CreditCard,
  Users,
  Package,
  UsersRound,
  Settings,
  Menu,
  X,
} from "lucide-react"

type SubMenuItem = {
  label: string
  href: string
}

type NavItem = {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: SubMenuItem[]
}

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard/home", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  {
    label: "Sales",
    icon: DollarSign,
    children: [
      { label: "Daily Summary", href: "/dashboard/sales/daily" },
      { label: "Transactions", href: "/dashboard/sales/transactions" },
      { label: "Cash Movement", href: "/dashboard/sales/cash-movement" },
    ],
  },
  { label: "Appointments", href: "/dashboard/appointments", icon: CalendarCheck },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  {
    label: "Clients",
    icon: Users,
    children: [
      { label: "Analytics", href: "/dashboard/clients/analytics" },
      { label: "List", href: "/dashboard/clients/list" },
      { label: "Segments", href: "/dashboard/clients/segments" },
    ],
  },
  { label: "Catalog", href: "/dashboard/catalog", icon: Package },
  {
    label: "Team",
    icon: UsersRound,
    children: [
      { label: "Members", href: "/dashboard/team/members" },
      { label: "Add Member", href: "/dashboard/team/add" },
    ],
  },
  {
    label: "Profile",
    icon: Settings,
    children: [
      { label: "Details", href: "/dashboard/profile/details" },
      { label: "Security", href: "/dashboard/profile/security" },
      { label: "Portfolio", href: "/dashboard/profile/portfolio" },
    ],
  },
]

const bottomNavItems = [
  { label: "Home", href: "/dashboard/home", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Sales", href: "/dashboard/sales/daily", icon: DollarSign },
  { label: "Appointments", href: "/dashboard/appointments", icon: CalendarCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    const active = navItems.find((item) =>
      item.children?.some((c) => pathname.startsWith(c.href))
    )
    return active ? [active.label] : []
  })
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileDrawerOpen])

  const toggle = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    )
  }

  const closeDrawer = () => setMobileDrawerOpen(false)

  const isActive = (href: string) => pathname === href
  const isChildActive = (item: NavItem) =>
    item.href
      ? pathname === item.href
      : item.children?.some((c) => pathname.startsWith(c.href))

  const renderNavItems = (onNav?: () => void) =>
    navItems.map((item) => {
      const Icon = item.icon
      const active = isChildActive(item)
      const isOpen = openMenus.includes(item.label)

      if (item.children) {
        return (
          <div key={item.label}>
            <button
              onClick={() => toggle(item.label)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                active && "bg-muted"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNav}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                      isActive(child.href)
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      }

      return (
        <Link
          key={item.href}
          href={item.href!}
          onClick={onNav}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
            active && "bg-muted"
          )}
        >
          <Icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      )
    })

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:z-30 md:flex md:h-screen md:w-64 md:flex-col md:overflow-y-auto md:border-r md:bg-card md:px-3 md:py-4">
        <Link
          href="/dashboard/home"
          className="mb-6 flex items-center gap-2 px-2 text-lg font-bold"
        >
          <LayoutDashboard className="size-5" />
          Glow Buddy
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {renderNavItems()}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t bg-background/80 px-2 pb-safe backdrop-blur-lg md:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href!)
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
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
          More
        </button>
      </nav>

      {/* Mobile drawer backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-card shadow-xl transition-transform duration-300 md:hidden",
          mobileDrawerOpen ? "translate-x-0" : "translate-x-full"
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
