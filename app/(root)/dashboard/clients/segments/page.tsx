"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const segments = [
  { name: "VIP", count: 12, avgSpend: 320, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { name: "Regular", count: 68, avgSpend: 85, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Occasional", count: 45, avgSpend: 45, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { name: "New", count: 31, avgSpend: 60, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
]

export default function ClientSegments() {
  const total = segments.reduce((s, seg) => s + seg.count, 0)

  return (
    <div>
      <PageHeader title="Client Segments" description={`${total} clients grouped by behavior`} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {segments.map((seg) => (
          <Card key={seg.name}>
            <CardHeader>
              <CardTitle>{seg.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Clients</span>
                <span className="text-2xl font-bold">{seg.count}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Avg. Spend</span>
                <span className="font-medium">${seg.avgSpend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
