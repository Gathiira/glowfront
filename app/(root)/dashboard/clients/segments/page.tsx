"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CLIENT_SEGMENT, CURRENCY, type ClientSegmentDto } from "@/lib/types"
import { fetchClientSegments, money } from "@/lib/api/commissions"
import { showError } from "@/lib/toast"

export default function ClientSegments() {
  const [segments, setSegments] = useState<ClientSegmentDto[] | null>(null)

  useEffect(() => {
    fetchClientSegments()
      .then(setSegments)
      .catch((e) => {
        setSegments([])
        showError(e)
      })
  }, [])

  const total = (segments ?? []).reduce((s, seg) => s + seg.count, 0)

  return (
    <div>
      <PageHeader
        title="Client Segments"
        description={segments ? `${total} client${total === 1 ? "" : "s"} grouped by how often they visit` : "Loading..."}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {segments === null &&
          [0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="space-y-2 pt-6">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        {segments?.map((seg) => {
          const meta = CLIENT_SEGMENT[seg.segment]
          return (
            <Card key={seg.segment}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  {meta.name}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.color}`}>{meta.rule}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Clients</span>
                  <span className="text-2xl font-bold">{seg.count}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Avg. spend per client</span>
                  <span className="font-medium">
                    {CURRENCY} {money(seg.avgSpend)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Share of clients</span>
                  <span className="text-sm">{total > 0 ? Math.round((seg.count / total) * 100) : 0}%</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
