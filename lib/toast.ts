import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"

export function showError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.message)
  } else if (error instanceof Error) {
    toast.error(error.message)
  } else if (typeof error === "string") {
    toast.error(error)
  } else {
    toast.error("An unexpected error occurred")
  }
}

export function showSuccess(message: string) {
  toast.success(message)
}
