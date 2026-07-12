import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLE_CUSTOMER, ROLE_PARTNER } from "@/lib/roles"
import type { Role } from "@/lib/roles"

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

function extractRole(value: string): Role | null {
  try {
    const parsed = JSON.parse(value)
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.role === "string"
    ) {
      if (parsed.role === ROLE_CUSTOMER || parsed.role === ROLE_PARTNER) {
        return parsed.role
      }
    }
  } catch {
    return null
  }
  return null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const raw = request.cookies.get(SESSION_COOKIE)?.value
  const role = raw ? extractRole(raw) : null

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
