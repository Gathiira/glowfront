"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail } from "lucide-react"
import Link from "next/link"

const members = [
  { id: 1, firstName: "Emily", lastName: "Rodriguez", email: "emily@glowbuddy.com", phone: "+1 (555) 111-2222", jobTitle: "Senior Stylist", services: ["Haircut", "Hair Coloring", "Blow-dry"], commission: "40%" },
  { id: 2, firstName: "John", lastName: "Smith", email: "john@glowbuddy.com", phone: "+1 (555) 222-3333", jobTitle: "Barber", services: ["Haircut", "Beard Trim"], commission: "35%" },
  { id: 3, firstName: "Sarah", lastName: "Lee", email: "sarah@glowbuddy.com", phone: "+1 (555) 333-4444", jobTitle: "Nail Technician", services: ["Manicure", "Pedicure", "Nail Art"], commission: "45%" },
]

export default function TeamMembers() {
  return (
    <div>
      <PageHeader title="Team Members" description={`${members.length} active team members`}>
        <Link href="/dashboard/team/add">
          <Button>Add Member</Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>
                {m.firstName} {m.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{m.phone}</span>
                </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Role: </span>
                {m.jobTitle}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Commission: </span>
                {m.commission}
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {m.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/dashboard/team/shifts/${m.id}`}
                className="mt-2 block text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Configure Shifts →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
