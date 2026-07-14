import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLE_CUSTOMER, ROLE_PARTNER } from "@/lib/roles"
import type { Role } from "@/lib/roles"

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

function normalizeRole(role: string): string {
  if (role === "partner") return ROLE_PARTNER
  if (role === "customer") return ROLE_CUSTOMER
  return role
}

function extractRoles(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.roles)) {
      return parsed.roles
        .filter((r: unknown): r is string => typeof r === "string")
        .map(normalizeRole)
    }
    if (parsed && typeof parsed.role === "string") {
      return [normalizeRole(parsed.role)]
    }
  } catch {
    return []
  }
  return []
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const raw = request.cookies.get(SESSION_COOKIE)?.value
  const roles = raw ? extractRoles(raw) : []

  if (roles.length === 0) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/platform") && !roles.includes(ROLE_CUSTOMER)) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url))
  }

  if (pathname.startsWith("/dashboard") && !roles.includes(ROLE_PARTNER)) {
    return NextResponse.redirect(new URL("/platform/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/platform/:path*", "/dashboard/:path*"],
}
