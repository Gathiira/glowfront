"use client"

import { useState, useEffect } from "react"

type UserProfile = {
  firstName: string
  lastName: string
  email: string
}

export function useUser(...keys: string[]) {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    for (const key of keys) {
      try {
        const stored = localStorage.getItem(key)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.firstName) {
            setProfile(parsed)
            return
          }
        }
      } catch {}
    }
  }, [])

  return profile
}
