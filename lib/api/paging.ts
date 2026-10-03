import type { PaginatedResponse } from "@/lib/types"

/** Backend contract: ?current= is 1-based, ?pageSize= is capped at 100 (server default 20, but we always send it). */
/** Manager dashboard lists. */
export const PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
/** Staff portal lists are read on a phone, so they load in smaller pages. */
export const STAFF_PAGE_SIZE = 5

export const pageQuery = (current: number, pageSize: number = PAGE_SIZE) => `current=${current}&pageSize=${pageSize}`

/** Every item across all pages — for pickers and filters that must offer the full list. */
export async function fetchAllPages<T>(
  fetchPage: (current: number, pageSize: number) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const first = await fetchPage(1, MAX_PAGE_SIZE)
  const items = [...first.list]
  for (let current = 2; current <= first.totalPages; current++) {
    items.push(...(await fetchPage(current, MAX_PAGE_SIZE)).list)
  }
  return items
}
