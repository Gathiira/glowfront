"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Briefcase,
  Building2,
  Tags,
  Ban,
  Clock,
  MessageSquareText,
  CalendarCheck,
} from "lucide-react"
import { fetchAdminDashboard } from "@/lib/api/admin"
import type { AdminDashboardDto } from "@/lib/api/admin"

export default function AdminHome() {
  const [dashboard, setDashboard] = useState<AdminDashboardDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminDashboard()
        setDashboard(data)
      } catch (err) {
        console.error("Failed to load admin dashboard:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    load()
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
        title="Admin Dashboard"
        description="Overview of the platform"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4 text-amber-500" />
              Pending Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dashboard.pendingBusinesses}</p>
            <Link
              href="/admin/businesses?status=PENDING_VERIFICATION"
              className="mt-1 text-xs text-muted-foreground hover:text-primary"
            >
              Review now &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Ban className="size-4 text-destructive" />
              Blocked Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dashboard.blockedCustomers}</p>
            <Link
              href="/admin/customers?status=BLOCKED"
              className="mt-1 text-xs text-muted-foreground hover:text-primary"
            >
              View all &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Ban className="size-4 text-destructive" />
              Blocked Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dashboard.blockedPartners}</p>
            <Link
              href="/admin/partners?status=BLOCKED"
              className="mt-1 text-xs text-muted-foreground hover:text-primary"
            >
              View all &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Customers"
          value={dashboard.totalCustomers}
          description="Registered users"
          icon={<Users className="size-5" />}
        />
        <StatCard
          title="Total Partners"
          value={dashboard.totalPartners}
          description="Service providers"
          icon={<Briefcase className="size-5" />}
        />
        <StatCard
          title="Total Businesses"
          value={dashboard.totalBusinesses}
          description={`${dashboard.activeBusinesses} active`}
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          title="Categories"
          value={dashboard.totalCategories}
          description="Service categories"
          icon={<Tags className="size-5" />}
        />
        <StatCard
          title="Total Reviews"
          value={dashboard.totalReviews}
          description="Platform reviews"
          icon={<MessageSquareText className="size-5" />}
        />
        <StatCard
          title="Total Bookings"
          value={dashboard.totalBookings}
          description="All time bookings"
          icon={<CalendarCheck className="size-5" />}
        />
      </div>
    </div>
  )
}
