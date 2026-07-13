"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import NextDynamic from "next/dynamic"
import { useCustomer } from "@/lib/customer-context"
import { Footer } from "@/components/landing/_components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Clock,
  Check,
  User,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CURRENCY } from "@/lib/types"
import { toast } from "sonner"
import {
  fetchBusinessBySlug,
  fetchBusinessReviews,
  fetchBusinessStaff,
  fetchBusinessServices,
} from "@/lib/api"
import { Pagination } from "@/components/dashboard/pagination"
import type {
  BusinessDto,
  ReviewDto,
  StaffDto,
  ServiceDto,
  PaginatedResponse,
} from "@/lib/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let L: any = null
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  L = require("leaflet")

  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

const HOURS = Array.from(
  { length: 10 },
  (_, i) => `${(i + 9).toString().padStart(2, "0")}:00`
)
const REVIEW_PAGE_SIZE = 5

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

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

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isPastDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr + "T00:00:00") < today
}

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number
  size?: "sm" | "md"
}) {
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
        {date && <span className="text-xs text-muted-foreground">{date}</span>}
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
            <div
              key={img.id}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
            >
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

export default function BusinessDetail() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { createAppointment, getAppointmentsForBusiness } = useCustomer()

  const [business, setBusiness] = useState<BusinessDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [reviews, setReviews] = useState<PaginatedResponse<ReviewDto> | null>(
    null
  )
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewCurrent, setReviewCurrent] = useState(0)

  const [staff, setStaff] = useState<StaffDto[]>([])
  const [services, setServices] = useState<ServiceDto[]>([])

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [reviewModal, setReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

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

  const loadReviews = useCallback(
    async (businessId: number, current: number) => {
      setReviewsLoading(true)
      try {
        const data = await fetchBusinessReviews(
          businessId,
          current,
          REVIEW_PAGE_SIZE
        )
        setReviews(data)
      } catch {
        setReviews(null)
      } finally {
        setReviewsLoading(false)
      }
    },
    []
  )

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

  const customerAppts = business
    ? getAppointmentsForBusiness(String(business.id))
    : []
  const existingAppts = customerAppts.filter(
    (a) => a.date === selectedDate && a.status !== "cancelled"
  )

  const availableTimes = useMemo(() => {
    if (!selectedDate) return []
    const booked = existingAppts.map((a) => a.startTime)
    return HOURS.filter((h) => !booked.includes(h))
  }, [selectedDate, existingAppts])

  const selectedServiceData = services.find(
    (s) => s.id === Number(selectedService)
  )

  if (loading) return <DetailSkeleton />

  if (error || !business) {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
          <p className="text-muted-foreground">
            {error || "Business not found"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/platform/browse")}
          >
            Back to Browse
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const hasLocation =
    business.location &&
    business.location.latitude &&
    business.location.longitude
  const coords: [number, number] = hasLocation
    ? [business.location!.latitude, business.location!.longitude]
    : [0, 0]

  const locationText = business.location
    ? [
        business.location.streetAddress,
        business.location.city,
        business.location.countyState,
      ]
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

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthLabel = new Date(calYear, calMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const handleBook = () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) return
    const endHour =
      parseInt(selectedTime) +
      Math.ceil(selectedServiceData.durationMinutes / 60)
    const endTime = `${endHour.toString().padStart(2, "0")}:00`
    createAppointment({
      businessId: String(business.id),
      businessName: business.name,
      serviceName: selectedServiceData.name,
      servicePrice: selectedServiceData.price,
      teamMemberName: selectedMember
        ? staff.find((s) => s.id === Number(selectedMember))?.name
        : undefined,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      status: "confirmed",
      notes: notes || undefined,
    })
    toast.success("Appointment booked successfully!")
    setSelectedService(null)
    setSelectedMember(null)
    setNotes("")
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewText.trim()) return
    toast.success("Review submitted!")
    setReviewModal(false)
    setReviewRating(0)
    setReviewText("")
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6"
          onClick={() => router.push("/platform/browse")}
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
                        selectedService === String(s.id) &&
                          "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{s.name}</p>
                        {s.description && (
                          <p className="text-sm text-muted-foreground">
                            {s.description}
                          </p>
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
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMember(String(m.id))}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted",
                          selectedMember === String(m.id) &&
                            "border-primary bg-primary/5"
                        )}
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
                      </button>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReviewModal(true)}
                  >
                    Write a Review
                  </Button>
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
                  <p className="text-sm text-muted-foreground">
                    No reviews yet
                  </p>
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
                {selectedService && selectedServiceData && (
                  <>
                    <div className="rounded-lg border bg-primary/5 p-3">
                      <p className="text-sm font-medium">
                        {selectedServiceData.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CURRENCY} {selectedServiceData.price.toLocaleString()}{" "}
                        &middot; {selectedServiceData.durationMinutes} min
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Select Date</p>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => {
                              if (calMonth === 0) {
                                setCalYear((y) => y - 1)
                                setCalMonth(11)
                              } else {
                                setCalMonth((m) => m - 1)
                              }
                              setSelectedDate(null)
                              setSelectedTime(null)
                            }}
                          >
                            <ArrowLeft className="size-3" />
                          </Button>
                          <span className="flex items-center px-2 text-sm font-medium">
                            {monthLabel}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => {
                              if (calMonth === 11) {
                                setCalYear((y) => y + 1)
                                setCalMonth(0)
                              } else {
                                setCalMonth((m) => m + 1)
                              }
                              setSelectedDate(null)
                              setSelectedTime(null)
                            }}
                          >
                            <ArrowLeft className="size-3 rotate-180" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="py-1 font-medium text-muted-foreground"
                          >
                            {d}
                          </div>
                        ))}
                        {blanks.map((i) => (
                          <div key={`b-${i}`} />
                        ))}
                        {days.map((day) => {
                          const dateStr = formatDate(
                            new Date(calYear, calMonth, day)
                          )
                          const past = isPastDate(dateStr)
                          return (
                            <button
                              key={day}
                              type="button"
                              disabled={past}
                              onClick={() => {
                                setSelectedDate(dateStr)
                                setSelectedTime(null)
                              }}
                              className={cn(
                                "flex aspect-square items-center justify-center rounded-full text-sm transition-colors",
                                past
                                  ? "cursor-not-allowed opacity-30"
                                  : "hover:bg-muted",
                                selectedDate === dateStr
                                  ? "bg-primary text-primary-foreground hover:bg-primary"
                                  : "",
                                !past &&
                                  existingAppts.length >= HOURS.length &&
                                  "text-destructive/60"
                              )}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {selectedDate && (
                      <div>
                        <p className="mb-2 text-sm font-medium">Select Time</p>
                        {availableTimes.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No available slots
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {availableTimes.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setSelectedTime(t)}
                                className={cn(
                                  "rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted",
                                  selectedTime === t &&
                                    "border-primary bg-primary/5 font-medium"
                                )}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div>
                      <label
                        htmlFor="book-notes"
                        className="mb-1 block text-sm font-medium"
                      >
                        Notes
                      </label>
                      <Textarea
                        id="book-notes"
                        placeholder="Any special requests..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      className="w-full"
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleBook}
                    >
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
                      <span className="font-medium">
                        {formatDay(h.dayOfWeek)}
                      </span>
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

      {/* Review Modal */}
      {reviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setReviewModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Share your experience at {business.name}
            </p>

            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReviewRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "size-8",
                      i < reviewRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Tell us about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={reviewRating === 0 || !reviewText.trim()}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
