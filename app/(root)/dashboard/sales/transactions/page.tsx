"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { LoadMore } from "@/components/ui/load-more"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { CURRENCY, PAYMENT_LABEL } from "@/lib/types"
import { fetchTransactions, money } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"

export default function Transactions() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { items, total, loading, loaded, hasMore, loadMore } = usePagedList(
    (current) => fetchTransactions({ startDate, endDate }, current),
    [startDate, endDate]
  )

  return (
    <div>
      <PageHeader
        title="Transaction Summary"
        description={startDate || endDate ? "Sales in the selected period, newest first" : "All sales, newest first"}
      >
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="From" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="To" />
      </PageHeader>

      <DataTable
        title="All Transactions"
        loading={!loaded}
        data={items}
        emptyMessage="No sales yet"
        keyExtractor={(t) => t.id ?? 0}
        columns={[
          { key: "id", label: "ID", render: (t) => <span className="font-medium">#{t.id}</span> },
          { key: "client", label: "Client", render: (t) => t.customerName ?? "Walk-in" },
          {
            key: "service",
            label: "Service",
            render: (t) => {
              const more = (t.items?.length ?? 1) - 1
              return `${t.serviceName ?? "—"}${more > 0 ? ` +${more}` : ""}`
            },
          },
          { key: "date", label: "Date", render: (t) => t.transactionDate?.slice(0, 16).replace("T", " ") },
          {
            key: "method",
            label: "Payment",
            render: (t) => PAYMENT_LABEL[t.paymentMethod as keyof typeof PAYMENT_LABEL] ?? t.paymentMethod.replace("_", " "),
          },
          {
            key: "status",
            label: "Status",
            render: (t) =>
              !t.status || t.status === "COMPLETED" ? (
                <StatusBadge status="completed" />
              ) : (
                <span className="text-xs font-medium text-muted-foreground">{t.status.toLowerCase().replace("_", " ")}</span>
              ),
          },
          { key: "amount", label: "Amount", align: "right", render: (t) => `${CURRENCY} ${money(t.grandTotal)}` },
        ]}
      />
      <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${items.length} of ${total}`} />
    </div>
  )
}
