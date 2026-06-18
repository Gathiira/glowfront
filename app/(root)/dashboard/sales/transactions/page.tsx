"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/dashboard/status-badge"

const allTransactions = [
  { id: "#1234", client: "Sarah Johnson", service: "Hair Coloring", amount: 120, date: "2026-06-18", status: "completed" as const },
  { id: "#1233", client: "Mike Chen", service: "Haircut", amount: 45, date: "2026-06-18", status: "completed" as const },
  { id: "#1232", client: "Lisa Park", service: "Manicure", amount: 55, date: "2026-06-17", status: "completed" as const },
  { id: "#1231", client: "James Wilson", service: "Facial", amount: 85, date: "2026-06-17", status: "pending" as const },
  { id: "#1230", client: "Anna Lee", service: "Massage", amount: 95, date: "2026-06-16", status: "completed" as const },
  { id: "#1229", client: "Tom Brown", service: "Beard Trim", amount: 25, date: "2026-06-16", status: "cancelled" as const },
]

export default function Transactions() {
  return (
    <div>
      <PageHeader title="Transaction Summary" description="All transactions" />

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.id}</TableCell>
                  <TableCell>{t.client}</TableCell>
                  <TableCell>{t.service}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right">${t.amount}</TableCell>
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
