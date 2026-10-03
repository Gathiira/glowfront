import useSWR, { type SWRConfiguration } from "swr"
import type { BusinessCategoryDto } from "@/lib/types"
import { fetchBusinessCategories } from "./customer"

/** All categories; `data.data` keeps the shape existing callers read. */
export function useCategories(options?: SWRConfiguration) {
  return useSWR<{ data: BusinessCategoryDto[] }>(
    "/customer/categories#all",
    async () => ({ data: await fetchBusinessCategories() }),
    {
      revalidateOnFocus: false,
      ...options,
    }
  )
}
