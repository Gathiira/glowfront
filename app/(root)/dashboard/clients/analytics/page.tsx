"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Repeat, TrendingUp, Wifi, Store } from "lucide-react"

export default function ClientAnalytics() {
  return (
    <div>
      <PageHeader title="Client Analytics" description="Summary of your client base" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value="156"
          description="All time"
          icon={<Users className="size-5" />}
        />
        <StatCard
          title="New Clients"
          value="12"
          description="This month"
          trend={{ direction: "up", value: "+3 vs last month" }}
          icon={<UserPlus className="size-5" />}
        />
        <StatCard
          title="Repeating Clients"
          value="68%"
          description="Return rate"
          icon={<Repeat className="size-5" />}
        />
        <StatCard
          title="Highest Spenders"
          value="$2,450"
          description="Top client avg"
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SummaryCard title="Online vs Walk-ins" value="Online 65% · Walk-in 35%">
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="size-4 text-blue-600" />
              <span className="text-sm">Online bookings: 102</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="size-4 text-amber-600" />
              <span className="text-sm">Walk-ins: 54</span>
            </div>
          </div>
        </SummaryCard>

        <Card>
          <CardHeader>
            <CardTitle>New Clients (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Alice Cooper", date: "Jun 15" },
                { name: "Bob Martin", date: "Jun 14" },
                { name: "Carol White", date: "Jun 12" },
                { name: "Dan Brown", date: "Jun 10" },
                { name: "Eve Black", date: "Jun 8" },
              ].map((c) => (
                <div key={c.name} className="flex justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
