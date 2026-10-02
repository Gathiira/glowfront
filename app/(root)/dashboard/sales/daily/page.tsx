"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { CheckoutDialog } from "@/components/dashboard/checkout-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { CURRENCY, type DailySalesDto } from "@/lib/types"
import { fetchDailySales, money, today } from "@/lib/api/commissions"
import { showError } from "@/lib/toast"

export default function DailySales() {
  const [date, setDate] = useState(today())
  const [data, setData] = useState<DailySalesDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [newSale, setNewSale] = useState(false)

  const load = (d: string) => {
    setLoading(true)
    fetchDailySales(d)
      .then(setData)
      .catch(showError)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(date)
  }, [date])

  return (
    <div>
      <PageHeader title="Daily Sales Summary" description="Revenue for the selected day">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Day" />
        <Button onClick={() => setNewSale(true)}>New sale</Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard title="Total Sales" value={`${CURRENCY} ${money(data?.totalSales)}`} />
        <SummaryCard title="Transactions" value={`${data?.transactionCount ?? 0}`} />
        <SummaryCard title="Average Ticket" value={`${CURRENCY} ${money(data?.averageTicket)}`} />
      </div>

      <DataTable
        title="Transactions"
        loading={loading}
        data={data?.transactions ?? []}
        emptyMessage="No sales on this day"
        keyExtractor={(t) => t.id ?? 0}
        columns={[
          { key: "time", label: "Time", render: (t) => t.transactionDate?.slice(11, 16) },
          { key: "client", label: "Client", render: (t) => t.customerName ?? "Walk-in" },
          { key: "service", label: "Service", render: (t) => t.serviceName ?? "—" },
          { key: "staff", label: "Staff", render: (t) => t.staffName ?? "—" },
          { key: "method", label: "Method", render: (t) => t.paymentMethod },
          { key: "amount", label: "Amount", align: "right", render: (t) => `${CURRENCY} ${money(t.grandTotal)}` },
        ]}
      />

      <CheckoutDialog
        open={newSale}
        onClose={() => setNewSale(false)}
        onDone={() => {
          setNewSale(false)
          load(date)
        }}
      />
    </div>
  )
}
