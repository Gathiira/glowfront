"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadMore } from "@/components/ui/load-more"
import { Skeleton } from "@/components/ui/skeleton"
import { CURRENCY } from "@/lib/types"
import { fetchClients, money } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"

const day = (iso: string | null) =>
  iso ? new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : null

export default function ClientList() {
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")
  const { items, total, loading, loaded, hasMore, loadMore } = usePagedList((current) => fetchClients(query, current), [query])

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 250)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div>
      <PageHeader
        title="Clients List"
        description={loaded ? `${total} client${total === 1 ? "" : "s"}${query ? " matching" : ""}` : "Loading..."}
      >
        <Input
          className="w-full sm:w-64"
          placeholder="Search name, phone or email"
          aria-label="Search clients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {!loaded && (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          )}
          {loaded && items.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {query ? "No client matches that search." : "No clients yet. They appear here after their first booking or sale."}
            </p>
          )}
          <div className="space-y-2">
            {items.map((c, i) => (
              <div key={`${c.phone ?? c.email ?? c.name}-${i}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {c.name ?? "Unnamed"}
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                      {c.online ? "Online" : "Walk-in"}
                    </span>
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{[c.phone, c.email].filter(Boolean).join(" · ") || "No contact"}</p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <p className="font-medium">
                    {CURRENCY} {money(c.totalSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.totalVisits} visit{c.totalVisits === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right text-xs text-muted-foreground sm:block">
                  <p>{c.lastVisit ? `Last visit ${day(c.lastVisit)}` : "Not visited yet"}</p>
                  {c.firstSeen && <p>Client since {day(c.firstSeen)}</p>}
                </div>
              </div>
            ))}
          </div>
          <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${items.length} of ${total}`} />
        </CardContent>
      </Card>
    </div>
  )
}
