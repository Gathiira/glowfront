"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadMore } from "@/components/ui/load-more"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCY, PAYMENT_LABEL, PAYMENT_METHODS, type AdvanceDto, type AdvanceStatus } from "@/lib/types"
import {
  approveAdvance,
  fetchAdvances,
  fetchOutstandingAdvance,
  fetchStaffCommissions,
  money,
  rejectAdvance,
} from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"
import { showError, showSuccess } from "@/lib/toast"

const FILTERS: { value: AdvanceStatus | "ALL"; label: string; empty: string }[] = [
  { value: "PENDING", label: "Waiting", empty: "No advance requests waiting." },
  { value: "APPROVED", label: "Paid", empty: "No advances paid yet." },
  { value: "REJECTED", label: "Not approved", empty: "No requests turned down." },
  { value: "ALL", label: "All", empty: "No advances yet. Staff ask for them from the Pay tab of their portal." },
]

const STATUS_STYLE: Record<AdvanceStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-muted text-muted-foreground",
}
const STATUS_LABEL: Record<AdvanceStatus, string> = {
  PENDING: "Waiting",
  APPROVED: "Paid",
  REJECTED: "Not approved",
  CANCELLED: "Cancelled",
}

const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""

/** Staff advance requests: approve (pay out) or reject; paid ones are deducted from their next payouts. */
export default function Advances() {
  const [filter, setFilter] = useState<AdvanceStatus | "ALL">("PENDING")
  const pages = usePagedList(
    (current) => fetchAdvances({ status: filter === "ALL" ? undefined : filter }, current),
    [filter]
  )
  const [deciding, setDeciding] = useState<{ advance: AdvanceDto; approve: boolean } | null>(null)
  const [decision, setDecision] = useState({ method: "MPESA", reference: "", note: "" })
  const [saving, setSaving] = useState(false)
  // For the advance being paid: their unpaid commission and advances already owed.
  const [earned, setEarned] = useState<{ unpaid: number; owed: number } | null>(null)

  const open = (advance: AdvanceDto, approve: boolean) => {
    setDecision({ method: "MPESA", reference: "", note: "" })
    setDeciding({ advance, approve })
    setEarned(null)
    if (approve) {
      Promise.all([fetchStaffCommissions(advance.staffId, { status: "UNPAID" }), fetchOutstandingAdvance(advance.staffId)])
        .then(([report, owed]) => setEarned({ unpaid: report.summary.unpaid, owed }))
        .catch(showError)
    }
  }

  const available = earned ? Math.max(0, +(earned.unpaid - earned.owed).toFixed(2)) : null
  const over = deciding && available !== null ? Math.max(0, +(deciding.advance.amount - available).toFixed(2)) : 0

  const decide = async () => {
    if (!deciding) return
    setSaving(true)
    try {
      const { advance, approve } = deciding
      if (approve) {
        await approveAdvance(advance.id, {
          paymentMethod: decision.method,
          reference: decision.reference.trim() || undefined,
          note: decision.note.trim() || undefined,
        })
        showSuccess(`${CURRENCY} ${money(advance.amount)} paid to ${advance.staffName}`)
      } else {
        await rejectAdvance(advance.id, decision.note.trim() || undefined)
        showSuccess("Request turned down")
      }
      setDeciding(null)
      pages.reload()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Advances"
        description="Money staff ask for ahead of their commission. Paying one records it in the cash book; it's then deducted from their next payouts."
      />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Show">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent>
          {!pages.loaded && <p className="py-6 text-sm text-muted-foreground">Loading...</p>}
          {pages.loaded && pages.items.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">{FILTERS.find((f) => f.value === filter)?.empty}</p>
          )}
          <ul className="divide-y">
            {pages.items.map((a) => (
              <li key={a.id} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    <Link href={`/dashboard/sales/commissions/${a.staffId}`} className="hover:underline">
                      {a.staffName}
                    </Link>
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Asked {day(a.requestedAt)}
                    {a.decidedAt && a.status !== "PENDING" ? ` · decided ${day(a.decidedAt)}` : ""}
                    {a.status === "APPROVED" && a.paymentMethod
                      ? ` · ${PAYMENT_LABEL[a.paymentMethod as keyof typeof PAYMENT_LABEL] ?? a.paymentMethod}${a.reference ? ` ${a.reference}` : ""}`
                      : ""}
                  </p>
                  {a.reason && <p className="mt-1 text-sm">{a.reason}</p>}
                  {a.decisionNote && <p className="mt-1 text-sm text-muted-foreground italic">“{a.decisionNote}”</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold">
                    {CURRENCY} {money(a.amount)}
                  </p>
                  {a.status === "APPROVED" && (
                    <p className="text-xs text-muted-foreground">
                      {a.outstanding > 0 ? `${money(a.outstanding)} still to deduct` : "Cleared"}
                    </p>
                  )}
                </div>
                {a.status === "PENDING" && (
                  <div className="flex w-full gap-2 sm:w-auto">
                    <Button size="sm" onClick={() => open(a, true)}>
                      Pay advance
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => open(a, false)}>
                      Reject
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <LoadMore
            hasMore={pages.hasMore}
            loading={pages.loading}
            onLoadMore={pages.loadMore}
            summary={`Showing ${pages.items.length} of ${pages.total}`}
          />
        </CardContent>
      </Card>

      <Dialog open={deciding !== null} onOpenChange={(v) => !v && setDeciding(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deciding?.approve ? "Pay" : "Reject"} {deciding?.advance.staffName}&apos;s {CURRENCY}{" "}
              {money(deciding?.advance.amount)} advance
            </DialogTitle>
          </DialogHeader>
          {deciding?.approve && (
            <>
              <p className="text-sm text-muted-foreground">
                It&apos;s recorded as money out in the cash book, then deducted from their next commission payouts until
                it&apos;s cleared.
              </p>
              {earned === null ? (
                <p className="text-sm text-muted-foreground">Checking what they&apos;ve earned...</p>
              ) : (
                <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-lg border p-3 text-sm">
                  <dt className="text-muted-foreground">Unpaid commission</dt>
                  <dd className="text-right">{money(earned.unpaid)}</dd>
                  <dt className="text-muted-foreground">Advances still owed</dt>
                  <dd className="text-right">− {money(earned.owed)}</dd>
                  <dt className="font-medium">Covered by earnings</dt>
                  <dd className="text-right font-medium">
                    {CURRENCY} {money(available)}
                  </dd>
                </dl>
              )}
              {over > 0 && (
                <p
                  role="status"
                  className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                >
                  This is {CURRENCY} {money(over)} more than {deciding.advance.staffName} has earned and not been paid.
                  The business is lending the difference until they earn it. If they leave first, it isn&apos;t
                  recovered automatically.
                </p>
              )}
            </>
          )}
          <div className="space-y-3">
            {deciding?.approve && (
              <>
                <div className="space-y-1.5">
                  <Label>Paid by</Label>
                  <Select value={decision.method} onValueChange={(v) => setDecision({ ...decision, method: v })}>
                    <SelectTrigger aria-label="Payment method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {PAYMENT_LABEL[m]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adv-ref">Reference (optional)</Label>
                  <Input
                    id="adv-ref"
                    placeholder="e.g. M-Pesa code"
                    value={decision.reference}
                    onChange={(e) => setDecision({ ...decision, reference: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="adv-note">Note to them (optional)</Label>
              <Input id="adv-note" value={decision.note} onChange={(e) => setDecision({ ...decision, note: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeciding(null)}>
              Cancel
            </Button>
            <Button variant={deciding?.approve ? "default" : "destructive"} onClick={decide} disabled={saving}>
              {saving ? "Saving..." : deciding?.approve ? "Pay advance" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
