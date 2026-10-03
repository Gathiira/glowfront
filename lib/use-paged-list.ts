"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PaginatedResponse } from "@/lib/types"
import { showError } from "@/lib/toast"

/**
 * "Load more" list state. Loads page 1 whenever `deps` change; `reload()` starts again from page 1
 * (use it after an action changes the list).
 */
export function usePagedList<T>(fetchPage: (current: number) => Promise<PaginatedResponse<T>>, deps: unknown[]) {
  const [items, setItems] = useState<T[]>([])
  const [last, setLast] = useState<PaginatedResponse<T> | null>(null)
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const fetchRef = useRef(fetchPage)
  fetchRef.current = fetchPage

  const load = useCallback(async (current: number) => {
    setLoading(true)
    try {
      const page = await fetchRef.current(current)
      setLast(page)
      setItems((prev) => (current === 1 ? page.list : [...prev, ...page.list]))
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    items,
    total: last?.totalElements ?? 0,
    loading,
    /** true once the first page has come back (or failed) */
    loaded,
    hasMore: last ? last.current < last.totalPages : false,
    loadMore: () => last && load(last.current + 1),
    reload: () => load(1),
  }
}
