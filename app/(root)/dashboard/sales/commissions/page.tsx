"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { LoadMore } from "@/components/ui/load-more"
import { CURRENCY } from "@/lib/types"
import { fetchCommissions, money, monthStart, today } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"

export default function Commissions() {
  const [startDate, setStartDate] = useState(monthStart())
  const [endDate, setEndDate] = useState(today())
  const { items: rows, total, loading, hasMore, loadMore } = usePagedList(
    (current) => fetchCommissions({ startDate, endDate }, current),
    [startDate, endDate]
  )

  return (
    <div>
      <PageHeader title="Commissions" description="Earned by each team member in the selected period">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="From" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="To" />
      </PageHeader>
      <DataTable
        loading={loading}
        data={rows}
        emptyMessage="No commissions in this period"
        keyExtractor={(r) => r.staffId}
        columns={[
          { key: "staff", label: "Team member", render: (r) => <span className="font-medium">{r.staffName}</span> },
          { key: "tasks", label: "Tasks", align: "right", render: (r) => r.tasksCount },
          { key: "commission", label: "Commission", align: "right", render: (r) => `${CURRENCY} ${money(r.commission)}` },
          { key: "paid", label: "Paid", align: "right", render: (r) => money(r.paid) },
          { key: "unpaid", label: "Unpaid", align: "right", render: (r) => <span className="font-semibold">{money(r.unpaid)}</span> },
          {
            key: "view",
            label: "",
            align: "right",
            render: (r) => (
              <Link
                href={`/dashboard/sales/commissions/${r.staffId}?startDate=${startDate}&endDate=${endDate}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View →
              </Link>
            ),
          },
        ]}
      />
      <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${rows.length} of ${total}`} />
    </div>
  )
}
