"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, UserPlus, Repeat, TrendingUp, Wifi, Store } from "lucide-react"
import { CURRENCY, type ClientAnalyticsDto } from "@/lib/types"
import { fetchClientAnalytics, money } from "@/lib/api/commissions"
import { showError } from "@/lib/toast"

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0)

export default function ClientAnalytics() {
  const [a, setA] = useState<ClientAnalyticsDto | null>(null)

  useEffect(() => {
    fetchClientAnalytics().then(setA).catch(showError)
  }, [])

  const diff = a ? a.newThisMonth - a.newLastMonth : 0

  return (
    <div>
      <PageHeader title="Client Analytics" description="Your clients from bookings and sales" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={a ? String(a.totalClients) : "—"} description="All time" icon={<Users className="size-5" />} />
        <StatCard
          title="New Clients"
          value={a ? String(a.newThisMonth) : "—"}
          description="This month"
          trend={
            a && (a.newThisMonth > 0 || a.newLastMonth > 0)
              ? { direction: diff >= 0 ? "up" : "down", value: `${diff >= 0 ? "+" : ""}${diff} vs last month` }
              : undefined
          }
          icon={<UserPlus className="size-5" />}
        />
        <StatCard
          title="Repeating Clients"
          value={a ? `${a.repeatRate}%` : "—"}
          description="Came back after their first visit"
          icon={<Repeat className="size-5" />}
        />
        <StatCard
          title="Highest Spender"
          value={a ? (a.topSpenderAmount != null ? `${CURRENCY} ${money(a.topSpenderAmount)}` : "—") : "—"}
          description={a?.topSpenderName ?? (a ? "No sales yet" : undefined)}
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SummaryCard
          title="Online vs Walk-ins"
          value={a ? `Online ${pct(a.online, a.totalClients)}% · Walk-in ${pct(a.walkIn, a.totalClients)}%` : "—"}
        >
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="size-4 text-blue-600" aria-hidden />
              <span className="text-sm">Booked online: {a?.online ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="size-4 text-amber-600" aria-hidden />
              <span className="text-sm">Walk-ins only: {a?.walkIn ?? "—"}</span>
            </div>
          </div>
        </SummaryCard>

        <Card>
          <CardHeader>
            <CardTitle>New Clients (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            {a === null ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : a.newClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new clients this month yet.</p>
            ) : (
              <div className="space-y-2">
                {a.newClients.map((c, i) => (
                  <div key={`${c.name}-${i}`} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate">
                      {c.name ?? "Unnamed"}
                      <span className="text-xs text-muted-foreground"> · {c.online ? "online" : "walk-in"}</span>
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {new Date(c.firstSeen + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
                {a.newThisMonth > a.newClients.length && (
                  <p className="text-xs text-muted-foreground">and {a.newThisMonth - a.newClients.length} more</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
