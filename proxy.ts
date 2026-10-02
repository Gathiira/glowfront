import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLE_CUSTOMER, ROLE_PARTNER, ROLE_ADMIN, ROLE_STAFF } from "@/lib/roles"

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

function normalizeRole(role: string): string {
  if (role === "partner") return ROLE_PARTNER
  if (role === "customer") return ROLE_CUSTOMER
  if (role === "admin") return ROLE_ADMIN
  if (role === "staff") return ROLE_STAFF
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

  // Staff-only sessions live under /staff; avoids bouncing between /platform and /dashboard.
  if (
    roles.includes(ROLE_STAFF) &&
    !roles.includes(ROLE_PARTNER) &&
    !roles.includes(ROLE_ADMIN) &&
    !pathname.startsWith("/staff")
  ) {
    return NextResponse.redirect(new URL("/staff/commissions", request.url))
  }

  if (pathname.startsWith("/staff") && !roles.includes(ROLE_STAFF)) {
    return NextResponse.redirect(new URL("/auth/staff", request.url))
  }

  if (pathname.startsWith("/platform") && !roles.includes(ROLE_CUSTOMER) && !roles.includes(ROLE_ADMIN)) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url))
  }

  if (pathname.startsWith("/dashboard") && !roles.includes(ROLE_PARTNER) && !roles.includes(ROLE_ADMIN)) {
    return NextResponse.redirect(new URL("/platform/home", request.url))
  }

  if (pathname.startsWith("/admin") && !roles.includes(ROLE_ADMIN)) {
    if (roles.includes(ROLE_PARTNER)) {
      return NextResponse.redirect(new URL("/dashboard/home", request.url))
    }
    return NextResponse.redirect(new URL("/platform/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/platform/:path*", "/dashboard/:path*", "/admin/:path*", "/staff/:path*"],
}
