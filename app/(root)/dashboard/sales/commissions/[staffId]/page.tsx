"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCY, PAYMENT_METHODS, type CommissionReportDto } from "@/lib/types"
import { createPayout, fetchStaffCommissions, money } from "@/lib/api/commissions"
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
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [payment, setPayment] = useState({ method: "MPESA", reference: "", notes: "" })

  const load = () => {
    setLoading(true)
    fetchStaffCommissions(staffId, { startDate, endDate, status: status === "ALL" ? undefined : status })
      .then((r) => {
        setReport(r)
        setSelected(r.lines.filter((l) => l.payoutId === null).map((l) => l.id as number))
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }

  useEffect(load, [staffId, status, startDate, endDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const lines = report?.lines ?? []
  const selectedTotal = lines.filter((l) => selected.includes(l.id as number)).reduce((s, l) => s + l.commissionAmount, 0)
  const toggle = (id: number) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const pay = async () => {
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
      load()
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

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard title="Earned" value={`${CURRENCY} ${money(report?.summary.commission)}`} />
        <SummaryCard title="Paid" value={`${CURRENCY} ${money(report?.summary.paid)}`} />
        <SummaryCard title="Unpaid" value={`${CURRENCY} ${money(report?.summary.unpaid)}`} />
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
              Record payout ({CURRENCY} {money(selectedTotal)})
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
          { key: "task", label: "Task", render: (l) => l.taskName },
          { key: "rate", label: "Rate", render: (l) => `${l.percentApplied}%${l.rateSource === "STAFF" ? " (agreed)" : ""}` },
          { key: "status", label: "Status", render: (l) => (l.payoutId ? "Paid" : "Unpaid") },
          { key: "amount", label: "Commission", align: "right", render: (l) => money(l.commissionAmount) },
        ]}
      />

      <Dialog open={paying} onOpenChange={setPaying}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Pay {report?.summary.staffName} {CURRENCY} {money(selectedTotal)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Select value={payment.method} onValueChange={(v) => setPayment({ ...payment, method: v })}>
              <SelectTrigger aria-label="Payment method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m.replace("_", " ")}
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
    </div>
  )
}
