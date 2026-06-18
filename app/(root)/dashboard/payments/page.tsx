"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const payments = [
  { id: 1, client: "Sarah Johnson", amount: 120, method: "Credit Card", date: "2026-06-18", status: "completed" as const },
  { id: 2, client: "Mike Chen", amount: 45, method: "Cash", date: "2026-06-18", status: "completed" as const },
  { id: 3, client: "Lisa Park", amount: 55, method: "Cash", date: "2026-06-17", status: "completed" as const },
  { id: 4, client: "James Wilson", amount: 85, method: "Debit Card", date: "2026-06-17", status: "pending" as const },
  { id: 5, client: "Anna Lee", amount: 95, method: "Cash", date: "2026-06-16", status: "completed" as const },
  { id: 6, client: "Tom Brown", amount: 25, method: "Cash", date: "2026-06-16", status: "completed" as const },
  { id: 7, client: "Emma Davis", amount: 200, method: "Bank Transfer", date: "2026-06-15", status: "completed" as const },
]

export default function Payments() {
  const total = payments.reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <PageHeader title="Payments" description={`Total: $${total}`} />

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.client}</p>
                  <p className="text-sm text-muted-foreground">{p.method}</p>
                </div>
                <div className="ml-2 shrink-0 text-right">
                  <p className="text-sm font-medium">${p.amount}</p>
                  <p className="text-xs text-muted-foreground">{p.date}</p>
                </div>
                <div className="ml-2 shrink-0">
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
