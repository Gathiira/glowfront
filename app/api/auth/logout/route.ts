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
  // The client reads this one for the Bearer header; left behind, the old token keeps being sent.
  response.cookies.set("token", "", { sameSite: "lax", path: "/", maxAge: 0 })

  return response
}
