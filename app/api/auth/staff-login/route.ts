import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/api/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"
const WEEK = 60 * 60 * 24 * 7

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json()
    const res = await fetch(API_URL + "/api/v1/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })
    const data: ApiResponse<{ accessToken?: string; profile?: { roles?: string[] } }> = await res.json()
    if (data.code !== 200) {
      return NextResponse.json(data, { status: res.status })
    }
    const accessToken = data.data?.accessToken
    if (!accessToken) {
      return NextResponse.json({ code: 500, msg: "Missing token in response", data: null }, { status: 500 })
    }
    const roles = data.data?.profile?.roles ?? []
    const response = NextResponse.json(data, { status: 200 })
    response.cookies.set(SESSION_COOKIE, JSON.stringify({ accessToken, roles }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: WEEK,
    })
    response.cookies.set("token", accessToken, { httpOnly: false, sameSite: "lax", path: "/", maxAge: WEEK })
    return response
  } catch {
    return NextResponse.json({ code: 500, msg: "Internal server error", data: null }, { status: 500 })
  }
}
