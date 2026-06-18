"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const appointments = [
  { id: 1, client: "Sarah Johnson", service: "Hair Coloring", date: "2026-06-18", time: "2:00 PM", status: "confirmed" as const, staff: "Emily" },
  { id: 2, client: "Mike Chen", service: "Haircut", date: "2026-06-18", time: "10:30 AM", status: "completed" as const, staff: "John" },
  { id: 3, client: "Lisa Park", service: "Manicure", date: "2026-06-18", time: "11:00 AM", status: "confirmed" as const, staff: "Emily" },
  { id: 4, client: "James Wilson", service: "Facial", date: "2026-06-19", time: "1:00 PM", status: "pending" as const, staff: "Sarah" },
  { id: 5, client: "Anna Lee", service: "Massage", date: "2026-06-19", time: "9:00 AM", status: "confirmed" as const, staff: "John" },
  { id: 6, client: "Tom Brown", service: "Beard Trim", date: "2026-06-17", time: "3:00 PM", status: "cancelled" as const, staff: "John" },
  { id: 7, client: "Emma Davis", service: "Eyebrows", date: "2026-06-20", time: "4:00 PM", status: "pending" as const, staff: "Sarah" },
]

export default function Appointments() {
  return (
    <div>
      <PageHeader title="Appointments" description="All scheduled appointments, newest first" />

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments
              .sort((a, b) => b.id - a.id)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{a.client}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {a.service} · {a.staff}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0 text-right">
                    <p className="text-sm font-medium">{a.date}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                  <div className="ml-2 shrink-0">
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
