"use client"

import { useLayoutEffect, useState } from "react"

const KEY = "sp-seen-stamps"

function readSeen(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

/**
 * Returns the keys this browser has not shown a stamp for yet, and remembers them as seen,
 * so a stamp lands once per payout / leave decision instead of on every visit.
 */
export function useFreshStamps(keys: string[]): Set<string> {
  const [fresh, setFresh] = useState<Set<string>>(() => new Set())
  const joined = keys.join("|")

  // Layout effect: the fresh set is applied before the browser paints, so a new stamp never shows at rest first.
  useLayoutEffect(() => {
    if (!joined) return
    const all = joined.split("|")
    const seen = new Set(readSeen())
    setFresh(new Set(all.filter((k) => !seen.has(k))))
    try {
      localStorage.setItem(KEY, JSON.stringify([...new Set([...seen, ...all])].slice(-500)))
    } catch {
      // storage unavailable (private mode): stamps simply land every visit
    }
  }, [joined])

  return fresh
}
