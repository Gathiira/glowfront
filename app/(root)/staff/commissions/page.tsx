"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { CURRENCY, type CommissionReportDto, type PayoutDto } from "@/lib/types"
import { fetchMyCommissions, fetchMyPayouts, money, monthStart, today } from "@/lib/api/commissions"
import { showError } from "@/lib/toast"

export default function MyCommissions() {
  const [startDate, setStartDate] = useState(monthStart())
  const [endDate, setEndDate] = useState(today())
  const [report, setReport] = useState<CommissionReportDto | null>(null)
  const [payouts, setPayouts] = useState<PayoutDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMyCommissions({ startDate, endDate })
      .then(setReport)
      .catch(showError)
      .finally(() => setLoading(false))
  }, [startDate, endDate])

  useEffect(() => {
    fetchMyPayouts().then(setPayouts).catch(showError)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title="My commissions">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="From" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="To" />
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard title="Earned" value={`${CURRENCY} ${money(report?.summary.commission)}`} />
        <SummaryCard title="Paid" value={`${CURRENCY} ${money(report?.summary.paid)}`} />
        <SummaryCard title="Unpaid" value={`${CURRENCY} ${money(report?.summary.unpaid)}`} />
      </div>

      <DataTable
        title="Work done"
        loading={loading}
        data={report?.lines ?? []}
        emptyMessage="No commissions in this period"
        keyExtractor={(l) => l.id ?? 0}
        columns={[
          { key: "date", label: "Date", render: (l) => l.transactionDate?.slice(0, 10) },
          { key: "service", label: "Service", render: (l) => l.serviceName },
          { key: "task", label: "Task", render: (l) => l.taskName },
          { key: "rate", label: "Rate", render: (l) => `${l.percentApplied}%` },
          { key: "status", label: "Status", render: (l) => (l.payoutId ? "Paid" : "Unpaid") },
          { key: "amount", label: "Commission", align: "right", render: (l) => money(l.commissionAmount) },
        ]}
      />

      <DataTable
        title="Payouts"
        data={payouts}
        emptyMessage="No payouts yet"
        keyExtractor={(p) => p.id}
        columns={[
          { key: "date", label: "Date", render: (p) => p.paidAt.slice(0, 10) },
          { key: "method", label: "Method", render: (p) => p.paymentMethod },
          { key: "ref", label: "Reference", render: (p) => p.reference ?? "—" },
          { key: "status", label: "Status", render: (p) => (p.status === "VOIDED" ? "Voided" : "Paid") },
          { key: "amount", label: "Amount", align: "right", render: (p) => `${CURRENCY} ${money(p.totalAmount)}` },
        ]}
      />
    </div>
  )
}
