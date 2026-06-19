"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-muted/50 shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">G</span>
          Glowbuddy
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account">Log in</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/business">List your business</Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="size-5" />
        </Button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/account">Log in</Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="justify-start">
              <Link href="/business">List your business</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
