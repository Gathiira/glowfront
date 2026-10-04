"use client"

import { useEffect, useState } from "react"
import type { BusinessRole } from "@/lib/types"
import { fetchMyRole } from "@/lib/api/partner"

// One request per page load, shared by the sidebar, mobile nav and pages.
let cached: Promise<BusinessRole | null> | null = null

/** Call on logout so the next person signing in on this tab doesn't see the previous role. */
export function forgetMyRole() {
  cached = null
}

/**
 * The signed-in person's role in the business; null while loading (or if it can't be read). Only for hiding what
 * managers can't use: the server enforces owner-only actions itself.
 */
export function useMyRole(): BusinessRole | null {
  const [role, setRole] = useState<BusinessRole | null>(null)
  useEffect(() => {
    cached ??= fetchMyRole().catch(() => {
      cached = null
      return null
    })
    let live = true
    cached.then((r) => live && setRole(r))
    return () => {
      live = false
    }
  }, [])
  return role
}
