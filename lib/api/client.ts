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

export const api = wretch(baseUrl + "/v1", { credentials: "same-origin" })
  .middlewares([
    (next) => async (url, opts) => {
      const response = await next(url, opts)
      const clone = response.clone()
      const body = await clone.json().catch(() => null)
      if (
        body &&
        typeof body === "object" &&
        "code" in body &&
        (body as Record<string, unknown>).code !== 200
      ) {
        throw new ApiError(
          (body as Record<string, unknown>).code as number,
          body
        )
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
