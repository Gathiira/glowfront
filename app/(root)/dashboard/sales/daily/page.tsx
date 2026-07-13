"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { CURRENCY } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const transactions = [
  { id: "#1234", client: "Sarah Johnson", service: "Hair Coloring", amount: 120, time: "2:00 PM" },
  { id: "#1233", client: "Mike Chen", service: "Haircut", amount: 45, time: "10:30 AM" },
  { id: "#1232", client: "Lisa Park", service: "Manicure", amount: 55, time: "11:00 AM" },
  { id: "#1231", client: "James Wilson", service: "Facial", amount: 85, time: "1:00 PM" },
  { id: "#1230", client: "Anna Lee", service: "Massage", amount: 95, time: "9:00 AM" },
]

export default function DailySales() {
  const total = transactions.reduce((s, t) => s + t.amount, 0)

  return (
    <div>
      <PageHeader title="Daily Sales Summary" description="Today&apos;s revenue overview" />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard title="Total Sales" value={`${CURRENCY} ${total}`} subtitle="Today" />
        <SummaryCard title="Transactions" value={`${transactions.length}`} subtitle="Today" />
        <SummaryCard title="Average Ticket" value={`${CURRENCY} ${(total / transactions.length).toFixed(0)}`} subtitle="Today" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.id}</TableCell>
                  <TableCell>{t.client}</TableCell>
                  <TableCell>{t.service}</TableCell>
                  <TableCell>{t.time}</TableCell>
                  <TableCell className="text-right">{CURRENCY} {t.amount}</TableCell>
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
