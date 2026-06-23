import { NextResponse } from "next/server"

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "session"

export async function POST() {
  const response = NextResponse.json({ code: 200, msg: "Logged out" })

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}
