"use client"

import Link from "next/link"
import { useCustomer } from "@/lib/customer-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { CalendarCheck, Building2, DollarSign, Star, ArrowRight } from "lucide-react"

export default function PlatformHome() {
  const { appointments, businesses, profile } = useCustomer()

  const todayStr = new Date().toISOString().split("T")[0]

  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a.status === "completed")
  const businessesVisited = new Set(completedAppointments.map((a) => a.businessId)).size
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled").length
  const totalSpent = completedAppointments.reduce((s, a) => s + a.servicePrice, 0)
  const reviewedAppointments = appointments.filter((a) => a.reviewed).length

  const upcoming = appointments
    .filter((a) => a.status === "confirmed" && a.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  const topBusiness = businesses
    .map((b) => ({
      ...b,
      visitCount: completedAppointments.filter((a) => a.businessId === b.id).length,
    }))
    .sort((a, b) => b.visitCount - a.visitCount)[0]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile.firstName}!`}
        description="Here&apos;s your appointment overview"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={totalAppointments}
          description="All time bookings"
          icon={<CalendarCheck className="size-5" />}
        />
        <StatCard
          title="Businesses Visited"
          value={businessesVisited}
          description={`Out of ${businesses.length} available`}
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          title="Total Spent"
          value={`$${totalSpent}`}
          description="Across all completed bookings"
          icon={<DollarSign className="size-5" />}
        />
        <StatCard
          title="Reviews Written"
          value={`${reviewedAppointments} / ${completedAppointments.length}`}
          description={`${completedAppointments.length - reviewedAppointments} pending`}
          icon={<Star className="size-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/platform/appointments">
                  View all <ArrowRight className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                <Button size="sm" asChild>
                  <Link href="/platform/browse">Browse Businesses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.businessName}</p>
                      <p className="text-xs text-muted-foreground">{a.serviceName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(a.date + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        &middot; {a.startTime}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold">{completedAppointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cancelled</span>
                <span className="font-semibold">{cancelledAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Spend per Visit</span>
                <span className="font-semibold">
                  $
                  {completedAppointments.length > 0
                    ? (totalSpent / completedAppointments.length).toFixed(0)
                    : "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loyalty Rate</span>
                <span className="font-semibold">
                  {totalAppointments > 0
                    ? `${Math.round((completedAppointments.length / totalAppointments) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </CardContent>
          </Card>

          {topBusiness && topBusiness.visitCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Favorite Business</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/platform/browse/${topBusiness.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {topBusiness.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{topBusiness.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {topBusiness.visitCount} visit{topBusiness.visitCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
