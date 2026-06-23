import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/api/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    const res = await fetch(API_URL + "/api/v1/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })

    const data: ApiResponse<{
      accessToken?: string
      refreshToken?: string
      profile?: { roles?: string[] }
    }> = await res.json()

    if (data.code !== 200) {
      return NextResponse.json(data, { status: res.status })
    }

    const accessToken = data.data?.accessToken
    const role = data.data?.profile?.roles?.[0]
    if (!accessToken || !role) {
      return NextResponse.json(
        { code: 500, msg: "Missing token or role in response", data: null },
        { status: 500 }
      )
    }

    const response = NextResponse.json(data, { status: 200 })

    response.cookies.set(
      SESSION_COOKIE,
      JSON.stringify({ accessToken, role }),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    )

    return response
  } catch {
    return NextResponse.json(
      { code: 500, msg: "Internal server error", data: null },
      { status: 500 }
    )
  }
}
