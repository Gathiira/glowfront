import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/landing/_components/header"

const Auth = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1 p-6">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-6 pt-10">
            <Link
              href="/auth/customer"
              className="group flex flex-col items-center justify-center gap-4 rounded-xl border p-12 text-center transition-all hover:border-primary hover:bg-muted/50"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="size-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  GlowBuddy for customers
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Book salons and spas near you
                </p>
              </div>
            </Link>

            <Link
              href="/auth/partner"
              className="group flex flex-col items-center justify-center gap-4 rounded-xl border p-12 text-center transition-all hover:border-primary hover:bg-muted/50"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="size-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  GlowBuddy for professionals
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage and grow your business
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="relative w-full flex-1 max-md:hidden">
          <Image
            src="/assets/glowbuddy-auth.webp"
            alt="GlowBuddy"
            fill
            className="object-cover object-bottom-right"
          />
        </div>
      </div>

      <footer className="flex items-center justify-center gap-4 border-t px-6 py-4 text-sm text-muted-foreground">
        <span>English (US)</span>
        <span className="text-border">|</span>
        <a href="#" className="hover:text-foreground">
          Help and support
        </a>
      </footer>
    </div>
  )
}

export default Auth
