import wretch from "wretch"

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""

export type ApiResponse<T = unknown> = {
  code: number
  msg: string
  data: T
}

function getMsg(body: unknown, status: number): string {
  if (
    body &&
    typeof body === "object" &&
    "msg" in body &&
    typeof (body as Record<string, unknown>).msg === "string"
  ) {
    return (body as Record<string, unknown>).msg as string
  }
  return `API ${status}`
}

function getSessionToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

const PUBLIC_PATHS = [
  "/customer/login",
  "/customer/register",
  "/partner/register",
]

function isPublicPath(url: string): boolean {
  return PUBLIC_PATHS.some((p) => url.includes(p))
}

/** The server's ACCESS_REVOKED: signed in, but deactivated (staff) or suspended (manager). */
export const ACCESS_REVOKED = 1004

let signingOut = false

/**
 * Their access was taken away mid-session: sign out at once. The caller still gets the error, so its toast shows
 * why; the page then leaves for the home page. Not on login calls, where they aren't signed in yet.
 */
function signOutRevoked(url: string) {
  if (signingOut || typeof window === "undefined" || url.includes("/login")) return
  signingOut = true
  fetch("/api/auth/logout", { method: "POST" })
    .catch(() => {})
    .finally(() => {
      for (const key of ["customer_profile", "staff_profile", "partner_profile"]) {
        try {
          localStorage.removeItem(key)
        } catch {
          // storage blocked: nothing to clear
        }
      }
      setTimeout(() => window.location.replace("/"), 2500)
    })
}

export const api = wretch(baseUrl + "/api/v1", {
  credentials: "same-origin",
}).middlewares([
  (next) => async (url, opts) => {
    const headers = new Headers(opts.headers)
    if (!isPublicPath(url)) {
      const token = getSessionToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    }
    const response = await next(url, { ...opts, headers })
    const clone = response.clone()
    const body = await clone.json().catch(() => null)
    if (
      body &&
      typeof body === "object" &&
      "code" in body &&
      (body as Record<string, unknown>).code !== 200
    ) {
      const code = (body as Record<string, unknown>).code as number
      if (code === ACCESS_REVOKED) signOutRevoked(url)
      throw new ApiError(code, body)
    }
    return response
  },
])

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown
  ) {
    super(getMsg(body, status))
    this.name = "ApiError"
  }
}

export async function extractError(error: unknown): Promise<ApiError> {
  if (error instanceof ApiError) return error
  if (error && typeof error === "object" && "response" in error) {
    const wretchErr = error as {
      response?: { status?: number }
      json?: () => Promise<unknown>
    }
    const status = wretchErr.response?.status ?? 0
    const body = wretchErr.json
      ? await wretchErr.json().catch(() => null)
      : null
    return new ApiError(status, body)
  }
  return new ApiError(0, error)
}
