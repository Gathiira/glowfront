"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LeaveDto, LeaveStatus } from "@/lib/types"
import { approveLeave, fetchLeave, LEAVE_BADGE, leaveWhen, rejectLeave } from "@/lib/api/leave"
import { showError, showSuccess } from "@/lib/toast"

type Filter = LeaveStatus | "ALL"

export default function LeaveRequests() {
  const [filter, setFilter] = useState<Filter>("PENDING")
  const [leave, setLeave] = useState<LeaveDto[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Record<number, string>>({})

  const load = () => {
    setLoading(true)
    fetchLeave(filter === "ALL" ? undefined : filter)
      .then(setLeave)
      .catch(showError)
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const decide = async (l: LeaveDto, approve: boolean) => {
    try {
      const note = notes[l.id]?.trim() || undefined
      await (approve ? approveLeave(l.id, note) : rejectLeave(l.id, note))
      showSuccess(approve ? "Leave approved" : "Leave rejected")
      load()
    } catch (err) {
      showError(err)
    }
  }

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
          <Card key={l.id}>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{l.staffName}</p>
                  <p className="text-sm text-muted-foreground">{leaveWhen(l)}</p>
                  {l.reason && <p className="text-sm">{l.reason}</p>}
                  {l.decisionNote && <p className="text-sm text-muted-foreground">Note: {l.decisionNote}</p>}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEAVE_BADGE[l.status]}`}>
                  {l.status.toLowerCase()}
                </span>
              </div>
              {l.clashes && l.clashes.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-700 dark:bg-amber-950/30">
                  <p className="font-medium">
                    {l.clashes.length} booking{l.clashes.length === 1 ? "" : "s"} during this leave — rebook{" "}
                    {l.clashes.length === 1 ? "it" : "them"}:
                  </p>
                  <ul className="mt-1 list-disc pl-5">
                    {l.clashes.map((c) => (
                      <li key={c.bookingId}>
                        {c.bookingDate} {c.bookingTime.slice(0, 5)} · {c.customerName} · {c.serviceName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {l.status === "PENDING" && (
                <div className="flex flex-wrap gap-2">
                  <Input
                    placeholder="Note (optional)"
                    className="min-w-48 flex-1"
                    value={notes[l.id] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [l.id]: e.target.value })}
                  />
                  <Button variant="outline" onClick={() => decide(l, false)}>
                    Reject
                  </Button>
                  <Button onClick={() => decide(l, true)}>Approve</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
