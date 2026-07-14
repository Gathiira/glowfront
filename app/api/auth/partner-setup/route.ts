import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/api/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie") ?? ""
    const tokenMatch = cookie.match(/(?:^|;\s*)token=([^;]*)/)
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : ""

    const body = await request.json()
    const { businessName, website, categoryId, serviceLocationType, location } =
      body

    const res = await fetch(API_URL + "/api/v1/partner/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        businessName,
        website,
        categoryId,
        serviceLocationType,
        location,
      }),
    })

    const data: ApiResponse<{
      accessToken?: string
      refreshToken?: string
      profile?: { roles?: string[] }
      partnerProfile?: { id?: number; setupCompleted?: boolean }
    }> = await res.json()

    if (data.code !== 200) {
      return NextResponse.json(data, { status: res.status })
    }

    const accessToken = data.data?.accessToken
    const roles = data.data?.profile?.roles ?? []
    if (accessToken) {
      const response = NextResponse.json(data, { status: 200 })

      response.cookies.set(
        SESSION_COOKIE,
        JSON.stringify({ accessToken, roles }),
        {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }
      )
      response.cookies.set("token", accessToken, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    return NextResponse.json(data, { status: 200 })
  } catch {
    return NextResponse.json(
      { code: 500, msg: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
