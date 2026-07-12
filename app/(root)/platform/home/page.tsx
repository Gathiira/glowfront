"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useCustomer } from "@/lib/customer-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { CalendarCheck, Building2, DollarSign, Star, ArrowRight } from "lucide-react"
import Image from "next/image"
import { fetchCustomerDashboard } from "@/lib/api"
import type { CustomerDashboardDto } from "@/lib/types"

export default function PlatformHome() {
  const { profile } = useCustomer()
  const [dashboard, setDashboard] = useState<CustomerDashboardDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchCustomerDashboard()
        setDashboard(data)
      } catch (err) {
        console.error("Failed to load dashboard:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">{error || "Failed to load dashboard"}</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile.firstName}!`}
        description="Here&apos;s your appointment overview"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={dashboard.totalAppointments}
          description="All time bookings"
          icon={<CalendarCheck className="size-5" />}
        />
        <StatCard
          title="Businesses Visited"
          value={dashboard.businessesVisited}
          description={`Out of ${dashboard.totalBusinessesAvailable} available`}
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          title="Total Spent"
          value={`$${dashboard.totalSpent}`}
          description="Across all completed bookings"
          icon={<DollarSign className="size-5" />}
        />
        <StatCard
          title="Reviews Written"
          value={`${dashboard.reviewsWritten.written} / ${dashboard.reviewsWritten.total}`}
          description={`${dashboard.reviewsWritten.pending} pending`}
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
            {dashboard.upcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                <Button size="sm" asChild>
                  <Link href="/platform/browse">Browse Businesses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.upcomingAppointments.map((appt) => (
                  <div
                    key={`${appt.businessId}-${appt.bookingDate}-${appt.bookingTime}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{appt.businessName}</p>
                      <p className="text-xs text-muted-foreground">{appt.serviceName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(appt.bookingDate + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        &middot; {appt.bookingTime}
                      </p>
                    </div>
                    <StatusBadge status={appt.status as "confirmed" | "completed" | "cancelled"} />
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
                <span className="font-semibold">{dashboard.quickStats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cancelled</span>
                <span className="font-semibold">{dashboard.quickStats.cancelled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Spend per Visit</span>
                <span className="font-semibold">
                  ${dashboard.quickStats.avgSpendPerVisit.toFixed(0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loyalty Rate</span>
                <span className="font-semibold">
                  {Math.round(dashboard.quickStats.loyaltyRate * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {dashboard.quickStats.favoriteBusiness && (
            <Card>
              <CardHeader>
                <CardTitle>Favorite Business</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/platform/browse/${dashboard.quickStats.favoriteBusiness.businessId}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  {dashboard.quickStats.favoriteBusiness.logoUrl ? (
                    <Image
                      src={dashboard.quickStats.favoriteBusiness.logoUrl}
                      alt={dashboard.quickStats.favoriteBusiness.businessName}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {dashboard.quickStats.favoriteBusiness.businessName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {dashboard.quickStats.favoriteBusiness.businessName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dashboard.quickStats.favoriteBusiness.visitCount} visit
                      {dashboard.quickStats.favoriteBusiness.visitCount !== 1 ? "s" : ""}
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
