"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { LeaveCard } from "@/components/dashboard/leave-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LeaveDto, LeaveStatus } from "@/lib/types"
import { fetchLeave } from "@/lib/api/leave"
import { showError } from "@/lib/toast"

type Filter = LeaveStatus | "ALL"

export default function LeaveRequests() {
  const [filter, setFilter] = useState<Filter>("PENDING")
  const [leave, setLeave] = useState<LeaveDto[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetchLeave(filter === "ALL" ? undefined : filter)
      .then(setLeave)
      .catch(showError)
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <PageHeader title="Leave requests" description="Approved leave stops new bookings for that team member">
        <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <SelectTrigger className="w-36" aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && leave.length === 0 && <p className="py-12 text-center text-muted-foreground">Nothing here.</p>}
      <div className="space-y-3">
        {leave.map((l) => (
          <LeaveCard key={l.id} leave={l} onDecided={load} />
        ))}
      </div>
    </div>
  )
}
