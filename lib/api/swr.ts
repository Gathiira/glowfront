import useSWR, { type SWRConfiguration } from "swr"
import { api, extractError } from "./client"
import type { BusinessCategory } from "@/lib/types"

const fetcher = <T>(url: string): Promise<T> => api.get(url).json()

export function useCategories(options?: SWRConfiguration) {
  return useSWR<BusinessCategory[]>("/categories", fetcher, {
    revalidateOnFocus: false,
    ...options,
  })
}

export async function fetchCategories(): Promise<BusinessCategory[]> {
  try {
    return await api.get("/categories").json()
  } catch (error) {
    throw await extractError(error)
  }
}
