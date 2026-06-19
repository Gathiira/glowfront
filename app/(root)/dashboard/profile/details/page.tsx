"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

const reviews = [
  { client: "Sarah Johnson", rating: 5, text: "Amazing service! Highly recommend.", date: "2026-06-10" },
  { client: "Mike Chen", rating: 4, text: "Great haircut, will come back.", date: "2026-06-08" },
  { client: "Lisa Park", rating: 5, text: "Best manicure in town!", date: "2026-06-05" },
  { client: "James Wilson", rating: 3, text: "Decent, but room for improvement.", date: "2026-06-01" },
  { client: "Anna Lee", rating: 5, text: "Love the new style, thank you!", date: "2026-05-28" },
]

export default function ProfileDetails() {
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div>
      <PageHeader title="Profile Details" description="Reviews and ratings from your clients" />

      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.client}</p>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "size-3",
                          j < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
