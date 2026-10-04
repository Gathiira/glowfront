"use client"

import Image from "next/image"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadMore } from "@/components/ui/load-more"
import { fmt } from "@/lib/utils"
import { Star, User } from "lucide-react"
import Link from "next/link"
import { fetchPartnerStaff } from "@/lib/api/partner"
import { usePagedList } from "@/lib/use-paged-list"

export default function TeamMembers() {
  const { items, total, loading, loaded, hasMore, loadMore } = usePagedList(
    (current) => fetchPartnerStaff(current, undefined, true),
    []
  )

  return (
    <div>
      <PageHeader
        title="Team Members"
        description={loaded ? `${total} team member${total === 1 ? "" : "s"}, inactive ones last` : "Loading..."}
      >
        <Link href="/dashboard/team/add">
          <Button>Add Member</Button>
        </Link>
      </PageHeader>

      <Card>
        <CardContent>
          {loaded && items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No team members yet.</div>
          ) : (
            <>
            {/* Phone: one row per person, stacked */}
            <ul className="divide-y md:hidden">
              {!loaded &&
                Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="py-3">
                    <div className="h-12 animate-pulse rounded bg-muted" />
                  </li>
                ))}
              {items.map((m) => (
                <li key={m.id} className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${m.active ? "" : "opacity-60"}`}>
                  {m.profilePhotoUrl ? (
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Image src={m.profilePhotoUrl} alt="" fill unoptimized className="object-cover" />
                    </span>
                  ) : (
                    <User className="size-10 shrink-0 rounded-full bg-muted p-2 text-muted-foreground" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <Link href={`/dashboard/team/members/${m.id}`} className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{m.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {[
                            m.jobTitle,
                            m.yearsExperience > 0 ? `${m.yearsExperience} yr${m.yearsExperience !== 1 ? "s" : ""}` : null,
                            m.averageRating > 0 ? `★ ${fmt(m.averageRating)}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </span>
                      </Link>
                      <span className="inline-flex shrink-0 items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
                        <span className={`inline-block size-2 rounded-full ${m.active ? "bg-green-500" : "bg-gray-300"}`} />
                        {m.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {m.services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {m.services.map((s) => (
                          <span key={s.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="h-8">
                        <Link href={`/dashboard/team/members/${m.id}`}>Details</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="h-8">
                        <Link href={`/dashboard/team/shifts/${m.id}`}>Shifts</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="h-8">
                        <Link href={`/dashboard/team/rates/${m.id}`}>Rates</Link>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Tablet and up: table */}
            <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th scope="col" className="pb-3 pr-4 font-medium">Member</th>
                  <th scope="col" className="pb-3 pr-4 font-medium">Services</th>
                  <th scope="col" className="pb-3 pr-4 font-medium">Experience</th>
                  <th scope="col" className="pb-3 pr-4 font-medium">Rating</th>
                  <th scope="col" className="pb-3 pr-4 font-medium">Status</th>
                  <th scope="col" className="pb-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loaded &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td colSpan={6} className="py-3">
                        <div className="h-8 animate-pulse rounded bg-muted" />
                      </td>
                    </tr>
                  ))}
                {items.map((m) => (
                  <tr key={m.id} className={`border-b last:border-0 ${m.active ? "" : "text-muted-foreground"}`}>
                    <td className="py-3 pr-4">
                      <Link href={`/dashboard/team/members/${m.id}`} className="flex items-center gap-3 hover:underline">
                        {m.profilePhotoUrl ? (
                          <span className="relative size-8 shrink-0 overflow-hidden rounded-full">
                            <Image src={m.profilePhotoUrl} alt="" fill unoptimized className="object-cover" />
                          </span>
                        ) : (
                          <User className="size-8 shrink-0 rounded-full bg-muted p-1.5 text-muted-foreground" aria-hidden />
                        )}
                        <span className="min-w-0">
                          <span className="block font-medium">{m.name}</span>
                          <span className="block text-xs text-muted-foreground">{m.jobTitle ?? "—"}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="max-w-64 py-3 pr-4">
                      {m.services.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {m.services.map((s) => (
                            <span key={s.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      {m.yearsExperience > 0 ? `${m.yearsExperience} yr${m.yearsExperience !== 1 ? "s" : ""}` : "—"}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      {m.averageRating > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden />
                          <span className="font-medium">{fmt(m.averageRating)}</span>
                          <span className="text-muted-foreground">({m.reviewCount})</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className={`inline-block size-2 rounded-full ${m.active ? "bg-green-500" : "bg-gray-300"}`} />
                        {m.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 text-right">
                      <div className="flex justify-end gap-3 font-medium text-primary">
                        <Link href={`/dashboard/team/members/${m.id}`} className="underline-offset-4 hover:underline">
                          Details
                        </Link>
                        <Link href={`/dashboard/team/shifts/${m.id}`} className="underline-offset-4 hover:underline">
                          Shifts
                        </Link>
                        <Link href={`/dashboard/team/rates/${m.id}`} className="underline-offset-4 hover:underline">
                          Rates
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </>
          )}
          <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${items.length} of ${total}`} />
        </CardContent>
      </Card>
    </div>
  )
}
