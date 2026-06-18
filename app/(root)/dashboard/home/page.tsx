"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DollarSign,
  CalendarCheck,
  Activity,
  Clock,
  Star,
  User,
} from "lucide-react"

const todayAppointment = {
  client: "Sarah Johnson",
  service: "Hair Coloring",
  time: "2:00 PM",
  duration: "1h 30m",
}

const topServices = [
  { name: "Haircut", thisMonth: 42, lastMonth: 38 },
  { name: "Hair Coloring", thisMonth: 28, lastMonth: 25 },
  { name: "Manicure", thisMonth: 35, lastMonth: 40 },
  { name: "Facial", thisMonth: 18, lastMonth: 15 },
  { name: "Massage", thisMonth: 22, lastMonth: 20 },
]

export default function Home() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your business today" />

      {/* Top tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Recent Sales"
          value="$2,450"
          description="Last 7 days"
          trend={{ direction: "up", value: "+12% vs last week" }}
          icon={<DollarSign className="size-5" />}
        />
        <StatCard
          title="Upcoming Appointments"
          value="8"
          description="Today"
          icon={<CalendarCheck className="size-5" />}
        />
        <StatCard
          title="Appointment Activity"
          value="24"
          description="This week"
          trend={{ direction: "up", value: "+3 vs last week" }}
          icon={<Activity className="size-5" />}
        />
        <StatCard
          title="Today&apos;s Next"
          value={`${todayAppointment.time} — ${todayAppointment.client}`}
          description={todayAppointment.service}
          icon={<Clock className="size-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topServices.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="size-3.5 text-muted-foreground" />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <div className="hidden items-center gap-4 text-sm sm:flex">
                    <span className="font-medium">{s.thisMonth} this month</span>
                    <span
                      className={`whitespace-nowrap text-xs sm:text-sm ${
                        s.thisMonth >= s.lastMonth
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {s.thisMonth >= s.lastMonth ? "+" : ""}
                      {s.thisMonth - s.lastMonth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top team member */}
        <Card>
          <CardHeader>
            <CardTitle>Top Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <User className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Emily Rodriguez</p>
                <p className="text-sm text-muted-foreground">
                  32 appointments this week · $4,200 in sales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
