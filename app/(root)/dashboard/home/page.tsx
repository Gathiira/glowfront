"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DollarSign,
  CalendarCheck,
  Activity,
  Clock,
  Star,
  User,
} from "lucide-react"
import { CURRENCY } from "@/lib/types"
import type {
  DashboardSummaryDto,
  TopServiceDto,
  TopTeamMemberDto,
} from "@/lib/types"
import {
  fetchDashboardSummary,
  fetchTopServices,
  fetchTopTeamMember,
} from "@/lib/api/partner"

function formatCurrency(amount: number): string {
  return `${CURRENCY} ${amount.toLocaleString()}`
}

function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":")
  const hour = Number.parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${h12}:${m} ${ampm}`
}

export default function Home() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null)
  const [topServices, setTopServices] = useState<TopServiceDto[]>([])
  const [topMember, setTopMember] = useState<TopTeamMemberDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, t, m] = await Promise.all([
          fetchDashboardSummary(),
          fetchTopServices(),
          fetchTopTeamMember(),
        ])
        setSummary(s)
        setTopServices(t)
        setTopMember(m)
      } catch {
        // silently fail — data stays null and UI shows skeleton
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your business today" />

      {/* Top tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Recent Sales"
          value={loading ? "—" : formatCurrency(summary?.recentSales ?? 0)}
          description="Last 7 days"
          icon={<DollarSign className="size-5" />}
        />
        <StatCard
          title="Upcoming Appointments"
          value={loading ? "—" : String(summary?.upcomingAppointments ?? 0)}
          description="Today"
          icon={<CalendarCheck className="size-5" />}
        />
        <StatCard
          title="Appointment Activity"
          value={loading ? "—" : String(summary?.weeklyActivityCount ?? 0)}
          description="This week"
          icon={<Activity className="size-5" />}
        />
        <StatCard
          title="Today&apos;s Next"
          value={
            loading
              ? "—"
              : summary?.nextAppointment
                ? `${formatTimeDisplay(summary.nextAppointment.bookingTime)} — ${summary.nextAppointment.customerName}`
                : "No appointments"
          }
          description={summary?.nextAppointment?.serviceName ?? ""}
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
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topServices.map((s) => (
                  <div key={s.serviceId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="size-3.5 text-muted-foreground" />
                      <span className="text-sm">{s.serviceName}</span>
                    </div>
                    <div className="hidden items-center gap-4 text-sm sm:flex">
                      <span className="font-medium">{s.thisMonthCount} this month</span>
                      <span
                        className={`whitespace-nowrap text-xs sm:text-sm ${
                          s.thisMonthCount >= s.lastMonthCount
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {s.thisMonthCount >= s.lastMonthCount ? "+" : ""}
                        {s.thisMonthCount - s.lastMonthCount}
                      </span>
                    </div>
                  </div>
                ))}
                {topServices.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No service data yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top team member */}
        <Card>
          <CardHeader>
            <CardTitle>Top Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ) : topMember ? (
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <User className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{topMember.staffName}</p>
                  <p className="text-sm text-muted-foreground">
                    {topMember.completedBookings} appointments this week ·{" "}
                    {formatCurrency(topMember.totalSales)} in sales
                  </p>
                </div>
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No team member data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
