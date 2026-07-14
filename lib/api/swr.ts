import useSWR, { type SWRConfiguration } from "swr"
import { api, extractError } from "./client"
import type { BusinessCategoryDto } from "@/lib/types"
import type { ApiResponse } from "./client"

const fetcher = <T>(url: string): Promise<T> => api.get(url).json()

export function useCategories(options?: SWRConfiguration) {
  return useSWR<ApiResponse<BusinessCategoryDto[]>>("/customer/categories", fetcher, {
    revalidateOnFocus: false,
    ...options,
  })
}

export async function fetchCategories(): Promise<BusinessCategoryDto[]> {
  try {
    const res = await api.get("/customer/categories").json<ApiResponse<BusinessCategoryDto[]>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}
