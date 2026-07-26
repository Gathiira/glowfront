"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fmt } from "@/lib/utils"
import { Star, User } from "lucide-react"
import Link from "next/link"
import { fetchPartnerStaff } from "@/lib/api/partner"
import type { StaffDto, PaginatedResponse } from "@/lib/types"

export default function TeamMembers() {
  const [data, setData] = useState<PaginatedResponse<StaffDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 12

  useEffect(() => {
    fetchPartnerStaff(page, pageSize)
      .then(setData)
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <PageHeader
        title="Team Members"
        description={
          loading
            ? "Loading..."
            : data
              ? `${data.totalElements} active team members`
              : "0 active team members"
        }
      >
        <Link href="/dashboard/team/add">
          <Button>Add Member</Button>
        </Link>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && data.list.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.list.map((m) => (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {m.profilePhotoUrl ? (
                      <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={m.profilePhotoUrl}
                          alt={m.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <User className="size-8 rounded-full bg-muted p-1.5 text-muted-foreground" />
                    )}
                    {m.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Role: </span>
                    {m.jobTitle ?? "—"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Experience: </span>
                    {m.yearsExperience > 0
                      ? `${m.yearsExperience} yr${m.yearsExperience !== 1 ? "s" : ""}`
                      : "—"}
                  </div>
                  {m.averageRating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{fmt(m.averageRating)}</span>
                      <span className="text-muted-foreground">
                        ({m.reviewCount} review{m.reviewCount !== 1 ? "s" : ""})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`inline-block size-2 rounded-full ${m.active ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    {m.active ? "Active" : "Inactive"}
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {m.services.length > 0
                        ? m.services.map((s) => (
                            <span
                              key={s.id}
                              className="rounded-full bg-muted px-2 py-0.5 text-xs"
                            >
                              {s.name}
                            </span>
                          ))
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
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

          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          No team members yet.
        </div>
      )}
    </div>
  )
}
