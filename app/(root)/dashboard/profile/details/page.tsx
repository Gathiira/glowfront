"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { BusinessMap } from "@/components/map/business-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, fmt } from "@/lib/utils"
import { fetchPartnerBusiness } from "@/lib/api/partner"
import { fetchBusinessReviews } from "@/lib/api"
import type { BusinessDto, ReviewDto, PaginatedResponse } from "@/lib/types"
import {
  ExternalLink,
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ImageIcon,
  ThumbsUp,
} from "lucide-react"

export default function ProfileDetails() {
  const [business, setBusiness] = useState<BusinessDto | null>(null)
  const [reviews, setReviews] = useState<PaginatedResponse<ReviewDto> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartnerBusiness()
      .then((b) => {
        setBusiness(b)
        if (b.id) {
          fetchBusinessReviews(b.id).then(setReviews).catch(() => {})
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <PageHeader title="Business Details" description="Your business profile" />
        <div className="mx-auto max-w-2xl space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div>
        <PageHeader title="Business Details" description="Your business profile" />
        <div className="py-12 text-center text-muted-foreground">Could not load profile.</div>
      </div>
    )
  }

  const dayMap = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

  return (
    <div>
      <PageHeader title="Business Details" description="Your business profile" />

      <div className="mx-auto max-w-2xl space-y-6">
        {business.coverUrl && (
          <div className="relative h-48 overflow-hidden rounded-xl sm:h-64">
            <Image src={business.coverUrl} alt="" fill unoptimized className="object-cover" />
          </div>
        )}

        {business.slug && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/business/${business.slug}`} target="_blank">
                <ExternalLink className="size-3.5" /> Public View
              </Link>
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {business.logoUrl ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  <Image src={business.logoUrl} alt={business.name} fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {business.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <CardTitle className="truncate">{business.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{business.categoryName}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {business.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="size-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    <XCircle className="size-3" /> Unverified
                  </span>
                )}
                {business.status === "ACTIVE" ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {business.status.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {business.description && (
              <p className="mb-4 text-sm text-muted-foreground">{business.description}</p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {business.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <a href={`mailto:${business.email}`} className="truncate text-primary underline underline-offset-2">
                    {business.email}
                  </a>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <span>{business.phone}</span>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="size-4 shrink-0 text-muted-foreground" />
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline underline-offset-2">
                    {business.website}
                  </a>
                </div>
              )}
              {business.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    {[business.location.streetAddress, business.location.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
            {business.overallRating != null && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{fmt(business.overallRating)}</span>
                <span className="text-muted-foreground">({business.totalReviews ?? 0} reviews)</span>
              </div>
            )}
          </CardContent>
        </Card>

        {business.location && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4" /> Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                {[
                  business.location.streetAddress,
                  business.location.city,
                  business.location.countyState,
                  business.location.country,
                  business.location.postalCode,
                ].filter(Boolean).join(", ")}
              </p>
              {business.location.latitude && business.location.longitude && (
                <BusinessMap
                  center={[business.location.latitude, business.location.longitude]}
                  name={business.name}
                  locationText={[
                    business.location.streetAddress,
                    business.location.city,
                  ].filter(Boolean).join(", ")}
                />
              )}
            </CardContent>
          </Card>
        )}

        {business.openingHours.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4" /> Opening Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {dayMap.map((day) => {
                  const h = business.openingHours.find((o) => o.dayOfWeek === day)
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                      <span>{h && !h.closed ? `${h.openTime} - ${h.closeTime}` : "Closed"}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-4" /> Reviews & Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews && reviews.list.length > 0 ? (
              <>
                <div className="mb-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{business.overallRating?.toFixed(1) ?? "—"}</p>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-4",
                            i < Math.round(business.overallRating ?? 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{reviews.totalElements} reviews</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.list.filter((r) => Math.round(r.rating) === star).length
                      const pct = reviews.totalElements > 0 ? (count / reviews.totalElements) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-2 text-right">{star}</span>
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right text-muted-foreground">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  {reviews.list.map((r) => (
                    <div key={r.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{r.customerName}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-0.5 flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3",
                              i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                      {r.images.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {r.images.map((img) => (
                            <div key={img.id} className="relative size-14 overflow-hidden rounded-md">
                              <Image src={img.imageUrl} alt="" fill unoptimized className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <ThumbsUp className="size-8" />
                <p>No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {business.gallery.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="size-4" /> Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {business.gallery.map((g) => (
                  <div key={g.id} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image src={g.imageUrl} alt={g.caption ?? ""} fill unoptimized className="object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
