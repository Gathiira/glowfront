"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { clearCustomerProfile } from "@/lib/customer-context"
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
  LogOut,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

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
  {
    label: "Appointments",
    href: "/dashboard/appointments",
    icon: CalendarCheck,
  },
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

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    const active = navItems.find((item) =>
      item.children?.some((c) => pathname.startsWith(c.href))
    )
    return active ? [active.label] : []
  })

  const toggle = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    clearCustomerProfile()
    router.push("/")
  }

  const isActive = (href: string) => pathname === href
  const isChildActive = (item: NavItem) =>
    item.href
      ? pathname === item.href
      : item.children?.some((c) => pathname.startsWith(c.href))

  return (
    <aside className="hidden md:fixed md:top-0 md:left-0 md:z-30 md:flex md:h-screen md:w-64 md:flex-col md:overflow-y-auto md:border-r md:bg-card md:px-3 md:py-4">
      <Link
        href="/dashboard/home"
        className="mb-6 flex items-center gap-2 px-2 text-lg font-bold"
      >
        <LayoutDashboard className="size-5" />
        Glow Buddy
      </Link>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
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
                  <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
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
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                active && "bg-muted"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="shrink-0 border-t pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <LogOut className="size-4 shrink-0" />
              Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <AlertTriangle className="size-6 text-destructive" />
              </AlertDialogMedia>
              <AlertDialogTitle>Confirm logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
