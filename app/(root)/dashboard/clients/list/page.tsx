"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const clients = [
  { id: 1, name: "Sarah Johnson", mobile: "+1 (555) 123-4567", review: "★★★★★", createdAt: "2026-01-15" },
  { id: 2, name: "Mike Chen", mobile: "+1 (555) 234-5678", review: "★★★★☆", createdAt: "2026-02-20" },
  { id: 3, name: "Lisa Park", mobile: "+1 (555) 345-6789", review: "★★★★★", createdAt: "2026-03-10" },
  { id: 4, name: "James Wilson", mobile: "+1 (555) 456-7890", review: "★★★☆☆", createdAt: "2026-04-05" },
  { id: 5, name: "Anna Lee", mobile: "+1 (555) 567-8901", review: "★★★★★", createdAt: "2026-04-22" },
  { id: 6, name: "Tom Brown", mobile: "+1 (555) 678-9012", review: "★★★★☆", createdAt: "2026-05-01" },
  { id: 7, name: "Emma Davis", mobile: "+1 (555) 789-0123", review: "★★★★★", createdAt: "2026-05-18" },
  { id: 8, name: "Alice Cooper", mobile: "+1 (555) 890-1234", review: "★★★★☆", createdAt: "2026-06-01" },
]

export default function ClientList() {
  return (
    <div>
      <PageHeader title="Clients List" description={`${clients.length} total clients`} />

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.mobile}</p>
                </div>
                <div className="ml-2 shrink-0 text-center">
                  <p className="text-sm">{c.review}</p>
                </div>
                <div className="ml-2 hidden shrink-0 text-right text-sm text-muted-foreground sm:block">
                  {c.createdAt}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
