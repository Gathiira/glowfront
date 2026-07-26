"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Menu,
  X,
  Shield,
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
import { useRouter } from "next/navigation"

const bottomNavItems = [
  { label: "Home", href: "/admin/home", icon: LayoutDashboard },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Partners", href: "/admin/partners", icon: Briefcase },
  { label: "More", href: "#", icon: Menu },
]

const drawerItems = [
  { label: "Dashboard", href: "/admin/home", icon: LayoutDashboard },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Partners", href: "/admin/partners", icon: Briefcase },
  { label: "Businesses", href: "/admin/businesses", icon: Briefcase },
  { label: "Reviews", href: "/admin/reviews", icon: Briefcase },
  { label: "Categories", href: "/admin/categories", icon: Briefcase },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  const isActive = (href: string) => {
    if (["/admin/businesses", "/admin/customers", "/admin/partners"].includes(href))
      return pathname.startsWith(href)
    return pathname === href
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t bg-background px-2 pb-safe md:hidden">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href) || (item.href === "#" && drawerOpen)
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.href === "#") {
                  e.preventDefault()
                  setDrawerOpen(true)
                }
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5", active ? "text-primary" : "")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={closeDrawer} />
      )}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-card shadow-xl transition-transform duration-300 md:hidden",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <span className="text-lg font-bold">Admin Navigation</span>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {drawerItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeDrawer}
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
        <div className="shrink-0 border-t px-3 pt-2 pb-4">
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
                <AlertDialogCancel onClick={closeDrawer}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { closeDrawer(); handleLogout() }}>
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}
