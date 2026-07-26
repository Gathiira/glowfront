"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { CURRENCY } from "@/lib/types"

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

      <DataTable
        title="All Transactions"
        data={allTransactions}
        keyExtractor={(t) => t.id}
        columns={[
          { key: "id", label: "ID", render: (t) => <span className="font-medium">{t.id}</span> },
          { key: "client", label: "Client", render: (t) => t.client },
          { key: "service", label: "Service", render: (t) => t.service },
          { key: "date", label: "Date", render: (t) => t.date },
          { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
          { key: "amount", label: "Amount", align: "right", render: (t) => `${CURRENCY} ${t.amount}` },
        ]}
      />
    </div>
  )
}
