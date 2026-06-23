import wretch from "wretch"

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""

export const api = wretch(baseUrl + "/v1", { credentials: "same-origin" })

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown
  ) {
    super(`API ${status}`)
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
