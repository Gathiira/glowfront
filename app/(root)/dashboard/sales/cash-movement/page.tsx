"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CURRENCY } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const movements = [
  { id: 1, type: "Cash In", description: "Payment — Sarah Johnson", amount: 120, method: "Credit Card", date: "2026-06-18" },
  { id: 2, type: "Cash In", description: "Payment — Mike Chen", amount: 45, method: "Cash", date: "2026-06-18" },
  { id: 3, type: "Cash Out", description: "Supplier — Hair Products", amount: -200, method: "Bank Transfer", date: "2026-06-17" },
  { id: 4, type: "Cash In", description: "Payment — Lisa Park", amount: 55, method: "Cash", date: "2026-06-17" },
  { id: 5, type: "Cash Out", description: "Utility Bill", amount: -150, method: "Bank Transfer", date: "2026-06-16" },
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

      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <span className={m.type === "Cash In" ? "text-green-600" : "text-red-600"}>
                      {m.type}
                    </span>
                  </TableCell>
                  <TableCell>{m.description}</TableCell>
                  <TableCell>{m.method}</TableCell>
                  <TableCell>{m.date}</TableCell>
                  <TableCell className={`text-right font-medium ${m.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {m.amount > 0 ? "+" : ""}{CURRENCY} {Math.abs(m.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
