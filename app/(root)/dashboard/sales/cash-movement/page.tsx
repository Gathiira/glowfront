"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { CURRENCY } from "@/lib/types"

const movements = [
  { id: 1, type: "Cash In" as const, description: "Payment — Sarah Johnson", amount: 120, method: "Credit Card", date: "2026-06-18" },
  { id: 2, type: "Cash In" as const, description: "Payment — Mike Chen", amount: 45, method: "Cash", date: "2026-06-18" },
  { id: 3, type: "Cash Out" as const, description: "Supplier — Hair Products", amount: -200, method: "Bank Transfer", date: "2026-06-17" },
  { id: 4, type: "Cash In" as const, description: "Payment — Lisa Park", amount: 55, method: "Cash", date: "2026-06-17" },
  { id: 5, type: "Cash Out" as const, description: "Utility Bill", amount: -150, method: "Bank Transfer", date: "2026-06-16" },
]

export default function CashMovement() {
  const totalIn = movements.filter((m) => m.type === "Cash In").reduce((s, m) => s + m.amount, 0)
  const totalOut = movements.filter((m) => m.type === "Cash Out").reduce((s, m) => s + Math.abs(m.amount), 0)

  return (
    <div>
      <PageHeader title="Cash Movement" description="Track your cash flow" />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total In</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">+{CURRENCY} {totalIn}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Out</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-600">-{CURRENCY} {totalOut}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Net Cash Flow</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{CURRENCY} {totalIn - totalOut}</p></CardContent>
        </Card>
      </div>

      <DataTable
        title="Movement History"
        data={movements}
        keyExtractor={(m) => m.id}
        columns={[
          {
            key: "type",
            label: "Type",
            render: (m) => (
              <span className={m.type === "Cash In" ? "text-green-600" : "text-red-600"}>
                {m.type}
              </span>
            ),
          },
          { key: "description", label: "Description", render: (m) => m.description },
          { key: "method", label: "Method", render: (m) => m.method },
          { key: "date", label: "Date", render: (m) => m.date },
          {
            key: "amount",
            label: "Amount",
            align: "right",
            render: (m) => (
              <span className={`font-medium ${m.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                {m.amount > 0 ? "+" : ""}{CURRENCY} {Math.abs(m.amount)}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
