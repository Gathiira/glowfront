"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { LeaveCard } from "@/components/dashboard/leave-card"
import { LoadMore } from "@/components/ui/load-more"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LeaveStatus } from "@/lib/types"
import { fetchLeave } from "@/lib/api/leave"
import { usePagedList } from "@/lib/use-paged-list"

type Filter = LeaveStatus | "ALL"

export default function LeaveRequests() {
  const [filter, setFilter] = useState<Filter>("PENDING")
  const {
    items: leave,
    total,
    loading,
    loaded,
    hasMore,
    loadMore,
    reload,
  } = usePagedList((current) => fetchLeave(filter === "ALL" ? undefined : filter, undefined, current), [filter])

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

      {!loaded && <p className="text-sm text-muted-foreground">Loading...</p>}
      {loaded && !loading && leave.length === 0 && <p className="py-12 text-center text-muted-foreground">Nothing here.</p>}
      <div className="space-y-3">
        {leave.map((l) => (
          <LeaveCard key={l.id} leave={l} onDecided={reload} />
        ))}
      </div>
      <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${leave.length} of ${total}`} />
    </div>
  )
}
