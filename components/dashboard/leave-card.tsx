"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useConfirm } from "@/components/ui/use-confirm"
import type { LeaveDto } from "@/lib/types"
import { approveLeave, LEAVE_BADGE, leaveWhen, rejectLeave } from "@/lib/api/leave"
import { showError, showSuccess } from "@/lib/toast"

type Props = {
  leave: LeaveDto
  /** Called after an approve/reject so the parent can reload. */
  onDecided: () => void
  /** Hide the staff name when the page is already about one person. */
  showStaff?: boolean
}

/** One leave request for the owner: dates, reason, status, clashing bookings, and approve/reject while pending. */
export function LeaveCard({ leave: l, onDecided, showStaff = true }: Props) {
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  const decide = async (approve: boolean) => {
    const clashCount = l.clashes?.length ?? 0
    const ok = await confirm(
      approve
        ? {
            title: "Approve this leave?",
            description: `${l.staffName} · ${leaveWhen(l)}. ${
              clashCount > 0
                ? `${clashCount} booking${clashCount === 1 ? "" : "s"} fall${clashCount === 1 ? "s" : ""} in this time — you'll need to rebook ${clashCount === 1 ? "it" : "them"}.`
                : "Customers won't be able to book them then."
            }`,
            confirmLabel: "Approve",
          }
        : {
            title: "Reject this leave?",
            description: `${l.staffName} · ${leaveWhen(l)}. They'll see it as not approved${note.trim() ? ", with your note" : ""}.`,
            confirmLabel: "Reject",
            destructive: true,
          }
    )
    if (!ok) return
    setBusy(true)
    try {
      const n = note.trim() || undefined
      await (approve ? approveLeave(l.id, n) : rejectLeave(l.id, n))
      showSuccess(approve ? "Leave approved" : "Leave rejected")
      onDecided()
    } catch (err) {
      showError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            {showStaff && <p className="font-medium">{l.staffName}</p>}
            <p className={showStaff ? "text-sm text-muted-foreground" : "font-medium"}>{leaveWhen(l)}</p>
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Note to the team member"
            />
            <Button variant="outline" onClick={() => decide(false)} disabled={busy}>
              Reject
            </Button>
            <Button onClick={() => decide(true)} disabled={busy}>
              Approve
            </Button>
          </div>
        )}
      </CardContent>
      {confirmDialog}
    </Card>
  )
}
