"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { clearCustomerProfile } from "@/lib/customer-context"
import {
  Compass,
  Calendar,
  CalendarCheck,
  User,
  LayoutDashboard,
  House,
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

const navItems = [
  { label: "Home", href: "/platform/home", icon: House },
  { label: "Browse", href: "/platform/browse", icon: Compass },
  { label: "Calendar", href: "/platform/calendar", icon: Calendar },
  { label: "Appointments", href: "/platform/appointments", icon: CalendarCheck },
  { label: "Profile", href: "/platform/profile", icon: User },
]

export function PlatformSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    clearCustomerProfile()
    router.push("/")
  }

  const isActive = (href: string) => {
    if (href === "/platform/browse")
      return pathname.startsWith("/platform/browse")
    return pathname === href
  }

  return (
    <aside className="hidden md:fixed md:top-0 md:left-0 md:z-30 md:flex md:h-screen md:w-64 md:flex-col md:overflow-y-auto md:border-r md:bg-card md:px-3 md:py-4">
      <Link
        href="/platform/home"
        className="mb-6 flex items-center gap-2 px-2 text-lg font-bold"
      >
        <LayoutDashboard className="size-5" />
        Glow Buddy
      </Link>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
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
