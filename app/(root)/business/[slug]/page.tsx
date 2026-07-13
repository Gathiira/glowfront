"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import NextDynamic from "next/dynamic"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ArrowLeft,
  Check,
  Shield,
  User,
  DollarSign,
} from "lucide-react"
import { Header } from "@/components/landing/_components/header"
import { Footer } from "@/components/landing/_components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { fetchBusinessBySlug, fetchBusinessReviews, fetchBusinessStaff, fetchBusinessServices } from "@/lib/api"
import { Pagination } from "@/components/dashboard/pagination"
import { CURRENCY } from "@/lib/types"
import type { BusinessDto, ReviewDto, StaffDto, ServiceDto, PaginatedResponse } from "@/lib/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let L: any = null
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  L = require("leaflet")

  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  L.Marker.prototype.options.icon = defaultIcon
}

import "leaflet/dist/leaflet.css"

const MapContainer = NextDynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
)
const TileLayer = NextDynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
)
const Marker = NextDynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
)
const Popup = NextDynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
})

const REVIEW_PAGE_SIZE = 5

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

function formatDay(day: string): string {
  return day.charAt(0) + day.slice(1).toLowerCase()
}

function formatTime(time: string): string {
  if (!time) return ""
  const [h, m] = time.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${h12}:${m} ${ampm}`
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "md" ? "size-4" : "size-3"
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-24" />
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-48 w-full rounded-xl" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="mt-2 h-4 w-1/3" />
              <Skeleton className="mt-3 h-4 w-1/2" />
              <Skeleton className="mt-4 h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ReviewSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="mt-2 h-3 w-20" />
          <Skeleton className="mt-2 h-12 w-full" />
        </div>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewDto }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : ""

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">{review.customerName}</p>
        {date && (
          <span className="text-xs text-muted-foreground">{date}</span>
        )}
      </div>
      <div className="mt-1">
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
      )}
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {review.images.map((img) => (
            <div key={img.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={img.imageUrl}
                alt="Review image"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BusinessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [business, setBusiness] = useState<BusinessDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [reviews, setReviews] = useState<PaginatedResponse<ReviewDto> | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewCurrent, setReviewCurrent] = useState(0)

  const [staff, setStaff] = useState<StaffDto[]>([])
  const [services, setServices] = useState<ServiceDto[]>([])

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [bookingPhone, setBookingPhone] = useState("")
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")

  const loadBusiness = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBusinessBySlug(slug)
      setBusiness(data)
    } catch {
      setError("Business not found")
    } finally {
      setLoading(false)
    }
  }, [slug])

  const loadReviews = useCallback(async (businessId: number, current: number) => {
    setReviewsLoading(true)
    try {
      const data = await fetchBusinessReviews(businessId, current, REVIEW_PAGE_SIZE)
      setReviews(data)
    } catch {
      setReviews(null)
    } finally {
      setReviewsLoading(false)
    }
  }, [])

  const handleBook = () => {
    if (!selectedService || !bookingName || !bookingDate || !bookingTime) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Booking request submitted! We'll contact you shortly.")
    setSelectedService(null)
    setBookingName("")
    setBookingEmail("")
    setBookingPhone("")
    setBookingDate("")
    setBookingTime("")
    setBookingNotes("")
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBusiness()
  }, [loadBusiness])

  useEffect(() => {
    if (business) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadReviews(business.id, reviewCurrent)
    }
  }, [business, reviewCurrent, loadReviews])

  useEffect(() => {
    if (!business) return
    fetchBusinessStaff(business.id, 0, 50)
      .then((res) => setStaff(res.list))
      .catch(() => setStaff([]))
  }, [business])

  useEffect(() => {
    if (!business) return
    fetchBusinessServices(business.id, 0, 50)
      .then((res) => setServices(res.list.filter((s) => s.active)))
      .catch(() => setServices([]))
  }, [business])

  if (loading) return <DetailSkeleton />

  if (error || !business) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
          <p className="text-muted-foreground">{error || "Business not found"}</p>
          <Button variant="outline" asChild>
            <Link href="/browse">Browse Businesses</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const hasLocation = business.location && business.location.latitude && business.location.longitude
  const coords: [number, number] = hasLocation
    ? [business.location!.latitude, business.location!.longitude]
    : [0, 0]

  const locationText = business.location
    ? [business.location.streetAddress, business.location.city, business.location.countyState]
        .filter(Boolean)
        .join(", ")
    : ""

  const sortedHours = [...business.openingHours].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  )

  const priceRange =
    business.priceRangeMin != null && business.priceRangeMax != null
      ? `${CURRENCY} ${business.priceRangeMin.toLocaleString()} - ${business.priceRangeMax.toLocaleString()}`
      : business.priceRangeMin != null
        ? `From ${CURRENCY} ${business.priceRangeMin.toLocaleString()}`
        : null

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6"
          onClick={router.back}
        >
          <div className="flex items-center gap-1">
            <ArrowLeft className="size-4" />
            Back
          </div>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            {/* Hero / Info */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  {business.coverUrl ? (
                    <Image
                      src={business.coverUrl}
                      alt={business.name}
                      width={800}
                      height={300}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : business.logoUrl ? (
                    <Image
                      src={business.logoUrl}
                      alt={business.name}
                      width={200}
                      height={200}
                      unoptimized
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-primary/20">
                      {business.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {business.categoryName && (
                        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
                          {business.categoryName}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">
                          {business.overallRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({business.totalReviews} reviews)
                        </span>
                      </div>
                      {business.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                          <Shield className="size-3" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                  {locationText && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {locationText}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-4" />
                    {business.phone}
                  </div>
                  {business.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="size-4" />
                      {business.email}
                    </div>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Globe className="size-4" />
                      Website
                    </a>
                  )}
                </div>

                {priceRange && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Price range: {priceRange}
                  </p>
                )}

                {business.description && (
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {business.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Services & Pricing */}
            {services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services &amp; Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedService(String(s.id))}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted",
                        selectedService === String(s.id) && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{s.name}</p>
                        {s.description && (
                          <p className="text-sm text-muted-foreground">{s.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-3.5" />
                          {s.durationMinutes}min
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                          {CURRENCY} {s.price.toLocaleString()}
                        </div>
                        {selectedService === String(s.id) && (
                          <Check className="size-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Team */}
            {staff.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {staff.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-lg border p-4"
                      >
                        {m.profilePhotoUrl ? (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={m.profilePhotoUrl}
                              alt={m.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <User className="size-5 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{m.name}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {m.jobTitle || "Professional"}
                          </p>
                          {m.averageRating > 0 && (
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                              {m.averageRating.toFixed(1)}
                              <span>({m.reviewCount})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {business.gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {business.gallery.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.caption || "Gallery image"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {business.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.amenities.map((a) => (
                      <span
                        key={a.id}
                        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
                      >
                        <Check className="size-3 text-primary" />
                        {a.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media */}
            {business.socialMedia.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {business.socialMedia.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        {s.platform}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map */}
            {hasLocation && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full overflow-hidden rounded-lg">
                    {typeof window !== "undefined" && (
                      <MapContainer
                        center={coords}
                        zoom={14}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coords}>
                          <Popup>
                            <div className="text-sm">
                              <p className="font-semibold">{business.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {locationText}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    )}
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {locationText}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <CardTitle>Reviews</CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">
                      {business.overallRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({business.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewsLoading ? (
                  <ReviewSkeleton />
                ) : reviews && reviews.list.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {reviews.list.map((r) => (
                        <ReviewCard key={r.id} review={r} />
                      ))}
                    </div>
                    <Pagination
                      currentPage={reviewCurrent}
                      totalPages={reviews.totalPages}
                      totalElements={reviews.totalElements}
                      onPageChange={setReviewCurrent}
                    />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
                <CardDescription>
                  Fill in the details and we&apos;ll confirm your booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService && (
                  <>
                    <div>
                      <label htmlFor="book-date" className="mb-1 block text-sm font-medium">
                        Date *
                      </label>
                      <Input
                        id="book-date"
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label htmlFor="book-time" className="mb-1 block text-sm font-medium">
                        Time *
                      </label>
                      <Input
                        id="book-time"
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      />
                    </div>
                    <Separator />
                    <div>
                      <label htmlFor="book-name" className="mb-1 block text-sm font-medium">
                        Name *
                      </label>
                      <Input
                        id="book-name"
                        placeholder="Your name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="book-email" className="mb-1 block text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="book-email"
                        type="email"
                        placeholder="your@email.com"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="book-phone" className="mb-1 block text-sm font-medium">
                        Phone
                      </label>
                      <Input
                        id="book-phone"
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="book-notes" className="mb-1 block text-sm font-medium">
                        Notes
                      </label>
                      <Textarea
                        id="book-notes"
                        placeholder="Any special requests..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button className="w-full" onClick={handleBook}>
                      Book Appointment
                    </Button>
                  </>
                )}

                {!selectedService && (
                  <p className="text-center text-sm text-muted-foreground">
                    Select a service to book
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Opening Hours */}
            {sortedHours.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {sortedHours.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-medium">{formatDay(h.dayOfWeek)}</span>
                      <span className="text-muted-foreground">
                        {h.closed
                          ? "Closed"
                          : `${formatTime(h.openTime)} - ${formatTime(h.closeTime)}`}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
