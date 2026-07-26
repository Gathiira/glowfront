"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { DataTable } from "@/components/ui/data-table"
import { CURRENCY } from "@/lib/types"

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

      <DataTable
        title="Today&apos;s Transactions"
        data={transactions}
        keyExtractor={(t) => t.id}
        columns={[
          { key: "id", label: "ID", render: (t) => <span className="font-medium">{t.id}</span> },
          { key: "client", label: "Client", render: (t) => t.client },
          { key: "service", label: "Service", render: (t) => t.service },
          { key: "time", label: "Time", render: (t) => t.time },
          { key: "amount", label: "Amount", align: "right", render: (t) => `${CURRENCY} ${t.amount}` },
        ]}
      />
    </div>
  )
}
