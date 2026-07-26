"use client"

import { useUser } from "@/lib/use-user"
import { User } from "lucide-react"

type Props = {
  storageKeys: string[]
}

export function UserBadge({ storageKeys }: Props) {
  const profile = useUser(...storageKeys)

  if (!profile) return null

  return (
    <span className="flex items-center gap-2 text-sm font-medium">
      <User className="size-4 text-muted-foreground" />
      {profile.firstName} {profile.lastName}
    </span>
  )
}
