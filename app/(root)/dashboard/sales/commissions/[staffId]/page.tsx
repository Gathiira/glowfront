"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { LoadMore } from "@/components/ui/load-more"
import { useConfirm } from "@/components/ui/use-confirm"
import { usePagedList } from "@/lib/use-paged-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CURRENCY,
  PAYMENT_LABEL,
  PAYMENT_METHODS,
  type CommissionLineDto,
  type CommissionReportDto,
  type StaffDto,
} from "@/lib/types"
import {
  approveLine,
  createPayout,
  fetchOutstandingAdvance,
  fetchStaffCommissions,
  money,
  reassignLine,
  rejectLine,
} from "@/lib/api/commissions"
import { fetchAllPartnerStaff } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"

type StatusFilter = "UNPAID" | "PAID" | "ALL"

export default function StaffCommissions() {
  return (
    <Suspense>
      <StaffCommissionsInner />
    </Suspense>
  )
}

function StaffCommissionsInner() {
  const staffId = Number(useParams<{ staffId: string }>().staffId)
  const search = useSearchParams()
  const [status, setStatus] = useState<StatusFilter>("UNPAID")
  const [startDate, setStartDate] = useState(search.get("startDate") ?? "")
  const [endDate, setEndDate] = useState(search.get("endDate") ?? "")
  const [report, setReport] = useState<CommissionReportDto | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [paying, setPaying] = useState(false)
  const [payment, setPayment] = useState({ method: "MPESA", reference: "", notes: "" })
  const [confirm, confirmDialog] = useConfirm()

  // Summary covers the whole range; lines arrive a page at a time and loaded unpaid lines are preselected.
  const {
    items: lines,
    total,
    loading,
    hasMore,
    loadMore,
    reload,
  } = usePagedList(
    (current) =>
      fetchStaffCommissions(staffId, { startDate, endDate, status: status === "ALL" ? undefined : status }, current).then((r) => {
        const unpaid = r.lines.list.filter((l) => l.payoutId === null).map((l) => l.id as number)
        setReport(r)
        setSelected((prev) => (current === 1 ? unpaid : [...prev, ...unpaid]))
        return r.lines
      }),
    [staffId, status, startDate, endDate]
  )

  // Manager review: approve an out-of-scope claim, reject it, or give it to whoever really did it.
  const [team, setTeam] = useState<StaffDto[]>([])
  const [moving, setMoving] = useState<CommissionLineDto | null>(null)
  const [moveTo, setMoveTo] = useState("")

  useEffect(() => {
    fetchAllPartnerStaff()
      .then((all) => setTeam(all.filter((s) => s.active)))
      .catch(showError)
  }, [])

  // Advances already paid to them come off the next payout.
  const [advanceOwed, setAdvanceOwed] = useState(0)
  const loadAdvance = () => fetchOutstandingAdvance(staffId).then(setAdvanceOwed).catch(showError)
  useEffect(() => {
    loadAdvance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId])

  const review = async (action: () => Promise<unknown>, done: string) => {
    try {
      await action()
      showSuccess(done)
      reload()
    } catch (err) {
      showError(err)
    }
  }

  const approve = async (l: CommissionLineDto) => {
    const ok = await confirm({
      title: `Approve ${l.staffName}'s ${l.taskName} claim?`,
      description: `${l.serviceName} · ${l.transactionDate?.slice(0, 10)}. They did it although it isn't set up for them (for example, covering for someone). It stays at ${l.percentApplied}% and the out-of-scope flag is cleared.`,
      confirmLabel: "Approve",
    })
    if (ok) review(() => approveLine(l.id as number), "Claim approved")
  }

  const reject = async (l: CommissionLineDto) => {
    const ok = await confirm({
      title: `Reject ${l.staffName}'s ${l.taskName} claim?`,
      description: `${l.serviceName} · ${l.transactionDate?.slice(0, 10)}. The ${CURRENCY} ${money(l.commissionAmount)} commission is removed and the task can be claimed again by whoever did it.`,
      confirmLabel: "Reject claim",
      destructive: true,
    })
    if (ok) review(() => rejectLine(l.id as number), "Claim rejected")
  }

  const reassign = async () => {
    if (!moving || !moveTo) return
    const to = team.find((s) => String(s.id) === moveTo)
    const ok = await confirm({
      title: `Give ${moving.taskName} to ${to?.name}?`,
      description: `${moving.serviceName} · ${moving.transactionDate?.slice(0, 10)}. It moves off ${moving.staffName}'s commissions and is recalculated at ${to?.name}'s rate.`,
      confirmLabel: "Reassign",
    })
    if (!ok) return
    const line = moving
    setMoving(null)
    review(() => reassignLine(line.id as number, Number(moveTo)), `${line.taskName} reassigned to ${to?.name}`)
  }

  const selectedTotal = lines.filter((l) => selected.includes(l.id as number)).reduce((s, l) => s + l.commissionAmount, 0)
  const toggle = (id: number) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const deduct = Math.min(advanceOwed, selectedTotal)
  const toPay = +(selectedTotal - deduct).toFixed(2)

  const pay = async () => {
    const ok = await confirm({
      title: `Pay ${report?.summary.staffName ?? "this team member"} ${CURRENCY} ${money(toPay)}?`,
      description: `${selected.length} commission line${selected.length === 1 ? "" : "s"} (${CURRENCY} ${money(selectedTotal)}) will be marked paid${
        deduct > 0 ? `, ${CURRENCY} ${money(deduct)} of it clearing their advance,` : ""
      } by ${PAYMENT_LABEL[payment.method as keyof typeof PAYMENT_LABEL] ?? payment.method}${
        payment.reference ? ` (ref ${payment.reference})` : ""
      }. You can void the payout later if it was a mistake.`,
      confirmLabel: "Record payout",
    })
    if (!ok) return
    try {
      await createPayout({
        staffId,
        taskIds: selected,
        paymentMethod: payment.method,
        reference: payment.reference || undefined,
        notes: payment.notes || undefined,
      })
      showSuccess("Payout recorded")
      setPaying(false)
      setPayment({ method: "MPESA", reference: "", notes: "" })
      reload()
      loadAdvance()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div>
      <PageHeader
        title={report ? `${report.summary.staffName}'s commissions` : "Commissions"}
        description="Empty dates mean all time"
      >
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-32" aria-label="Status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="From" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="To" />
      </PageHeader>

      <div className={`mb-6 grid grid-cols-1 gap-3 ${advanceOwed > 0 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
        <SummaryCard title="Earned" value={`${CURRENCY} ${money(report?.summary.commission)}`} />
        <SummaryCard title="Paid" value={`${CURRENCY} ${money(report?.summary.paid)}`} />
        <SummaryCard title="Unpaid" value={`${CURRENCY} ${money(report?.summary.unpaid)}`} />
        {advanceOwed > 0 && (
          <SummaryCard title="Advance to deduct" value={`${CURRENCY} ${money(advanceOwed)}`} />
        )}
      </div>

      <DataTable
        title="Commission lines"
        loading={loading}
        data={lines}
        emptyMessage="Nothing here"
        keyExtractor={(l) => l.id ?? 0}
        headerExtra={
          selected.length > 0 && (
            <Button onClick={() => setPaying(true)}>
              Record payout ({CURRENCY} {money(toPay)})
            </Button>
          )
        }
        columns={[
          {
            key: "pick",
            label: "",
            render: (l) =>
              l.payoutId === null ? (
                <input
                  type="checkbox"
                  checked={selected.includes(l.id as number)}
                  onChange={() => toggle(l.id as number)}
                  aria-label="Include in payout"
                />
              ) : null,
          },
          { key: "date", label: "Date", render: (l) => l.transactionDate?.slice(0, 10) },
          { key: "service", label: "Service", render: (l) => l.serviceName },
          {
            key: "task",
            label: "Task",
            render: (l) => (
              <span className="inline-flex items-center gap-1.5">
                {l.taskName}
                {l.outOfScope && (
                  <span
                    className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    title="Claimed outside their scope; paid at the task default. Check before paying."
                  >
                    Out of scope
                  </span>
                )}
              </span>
            ),
          },
          { key: "rate", label: "Rate", render: (l) => `${l.percentApplied}%${l.rateSource === "STAFF" ? " (agreed)" : ""}` },
          { key: "status", label: "Status", render: (l) => (l.payoutId ? "Paid" : "Unpaid") },
          { key: "amount", label: "Commission", align: "right", render: (l) => money(l.commissionAmount) },
          {
            key: "review",
            label: "",
            align: "right",
            render: (l) =>
              l.payoutId ? null : (
                <span className="inline-flex gap-1">
                  {l.outOfScope && (
                    <Button size="sm" variant="outline" onClick={() => approve(l)}>
                      Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setMoveTo("")
                      setMoving(l)
                    }}
                  >
                    Reassign
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => reject(l)}>
                    Reject
                  </Button>
                </span>
              ),
          },
        ]}
      />
      <LoadMore
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        summary={`Showing ${lines.length} of ${total} — only loaded lines can be added to a payout`}
      />

      <Dialog open={paying} onOpenChange={setPaying}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Pay {report?.summary.staffName} {CURRENCY} {money(toPay)}
            </DialogTitle>
          </DialogHeader>
          {deduct > 0 && (
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-lg border p-3 text-sm">
              <dt className="text-muted-foreground">Commission</dt>
              <dd className="text-right">{money(selectedTotal)}</dd>
              <dt className="text-muted-foreground">Advance deducted</dt>
              <dd className="text-right">− {money(deduct)}</dd>
              <dt className="font-medium">To pay now</dt>
              <dd className="text-right font-medium">
                {CURRENCY} {money(toPay)}
              </dd>
              {advanceOwed > deduct && (
                <dd className="col-span-2 text-xs text-muted-foreground">
                  {CURRENCY} {money(advanceOwed - deduct)} of their advance is left for later payouts.
                </dd>
              )}
            </dl>
          )}
          <div className="space-y-2">
            <Select value={payment.method} onValueChange={(v) => setPayment({ ...payment, method: v })}>
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
            <Input
              placeholder="Reference (e.g. M-Pesa code)"
              value={payment.reference}
              onChange={(e) => setPayment({ ...payment, reference: e.target.value })}
            />
            <Input placeholder="Notes" value={payment.notes} onChange={(e) => setPayment({ ...payment, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={pay}>Record payout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={moving !== null} onOpenChange={(v) => !v && setMoving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Who did {moving?.taskName}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {moving?.serviceName} · {moving?.transactionDate?.slice(0, 10)} · claimed by {moving?.staffName}
          </p>
          <Select value={moveTo} onValueChange={setMoveTo}>
            <SelectTrigger aria-label="Team member">
              <SelectValue placeholder="Pick a team member" />
            </SelectTrigger>
            <SelectContent>
              {team
                .filter((s) => s.id !== moving?.staffId)
                .map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoving(null)}>
              Cancel
            </Button>
            <Button onClick={reassign} disabled={!moveTo}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  )
}
