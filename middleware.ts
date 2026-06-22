import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLE_CUSTOMER, ROLE_PARTNER } from "@/lib/roles"
import type { Role } from "@/lib/roles"

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const padding = "=".repeat((4 - (base64.length % 4)) % 4)
  return atob(base64 + padding)
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const decoded = JSON.parse(base64urlDecode(parts[1]))
    if (typeof decoded !== "object" || decoded === null) return null
    return decoded as Record<string, unknown>
  } catch {
    return null
  }
}

function extractRole(token: string): Role | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  const role = payload.role
  if (role === ROLE_CUSTOMER || role === ROLE_PARTNER) return role
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const role = token ? extractRole(token) : null

  if (!role) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/platform") && role !== ROLE_CUSTOMER) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url))
  }

  if (pathname.startsWith("/dashboard") && role !== ROLE_PARTNER) {
    return NextResponse.redirect(new URL("/platform/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/platform/:path*", "/dashboard/:path*"],
}
