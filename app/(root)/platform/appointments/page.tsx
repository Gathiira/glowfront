"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/dashboard/status-badge"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Star, OctagonX, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { fetchCustomerBookings, cancelBooking } from "@/lib/api"
import type { BookingDto } from "@/lib/types"
import { BookingDetailDialog } from "@/components/customer/booking-detail-dialog"

type Tab = "upcoming" | "past" | "cancelled"

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]
}

export default function Appointments() {
  const [upcoming, setUpcoming] = useState<BookingDto[]>([])
  const [past, setPast] = useState<BookingDto[]>([])
  const [cancelled, setCancelled] = useState<BookingDto[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingPast, setLoadingPast] = useState(false)
  const [loadingCancelled, setLoadingCancelled] = useState(false)
  const [tab, setTab] = useState<Tab>("upcoming")
  const [reviewingId, setReviewingId] = useState<number | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [detailBooking, setDetailBooking] = useState<BookingDto | null>(null)

  useEffect(() => {
    const today = new Date()
    const thirtyDays = new Date(today)
    thirtyDays.setDate(thirtyDays.getDate() + 30)

    setLoadingUpcoming(true)
    fetchCustomerBookings(0, 100, formatDate(today), formatDate(thirtyDays))
      .then((res) => setUpcoming(res.list))
      .finally(() => setLoadingUpcoming(false))
  }, [])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    if (t === "past" && past.length === 0 && !loadingPast) {
      setLoadingPast(true)
      const today = formatDate(new Date())
      fetchCustomerBookings(0, 100, undefined, today)
        .then((res) => setPast(res.list))
        .finally(() => setLoadingPast(false))
    }
    if (t === "cancelled" && cancelled.length === 0 && !loadingCancelled) {
      setLoadingCancelled(true)
      fetchCustomerBookings(0, 100, undefined, undefined, "CANCELLED")
        .then((res) => setCancelled(res.list))
        .finally(() => setLoadingCancelled(false))
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id)
      const today = formatDate(new Date())
      const thirtyDaysFromNow = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      const [upRes, pastRes, cancelledRes] = await Promise.all([
        fetchCustomerBookings(0, 100, today, thirtyDaysFromNow),
        fetchCustomerBookings(0, 100, undefined, today),
        fetchCustomerBookings(0, 100, undefined, undefined, "CANCELLED"),
      ])
      setUpcoming(upRes.list)
      setPast(pastRes.list)
      setCancelled(cancelledRes.list)
      toast.success("Appointment cancelled")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel")
    }
  }

  const openDetail = (a: BookingDto) => {
    setDetailBooking(a)
  }

  const openReview = (id: number) => {
    setReviewingId(id)
    setReviewRating(0)
    setReviewText("")
  }

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewText.trim() || !reviewingId) return
    toast.success("Review submitted!")
    setReviewingId(null)
    setReviewRating(0)
    setReviewText("")
  }

  const renderAppointment = (a: BookingDto) => (
    <Card key={a.id}>
      <CardContent className="flex items-stretch justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{a.customerName}</p>
          <p className="text-sm text-muted-foreground">{a.customerPhone}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{a.businessName}</span>
            <span>{a.serviceName}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{a.bookingDate}</span>
            <span>{a.bookingTime}{a.durationMinutes ? ` (${a.durationMinutes} min)` : ""}</span>
          </div>
          {a.notes && (
            <p className="mt-2 text-xs text-muted-foreground italic">Note: {a.notes}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <StatusBadge status={a.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed"} />
          <Button variant="ghost" size="sm" onClick={() => openDetail(a)} className="mt-6 gap-1">
            <Eye className="size-4" /> View
          </Button>
          {a.status === "PENDING" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-6 text-destructive">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <OctagonX className="size-5" />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Cancel appointment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this appointment?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancel(a.id)}>
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {a.status === "COMPLETED" && (
            <Button size="sm" className="mt-6" onClick={() => openReview(a.id)}>
              Write a Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <PageHeader title="My Appointments" description="Manage your bookings and reviews" />

      <div className="mb-6 flex gap-2">
        <Button
          variant={tab === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("upcoming")}
        >
          Upcoming ({upcoming.length})
        </Button>
        <Button
          variant={tab === "past" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("past")}
        >
          Past ({past.length})
        </Button>
        <Button
          variant={tab === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("cancelled")}
        >
          Cancelled ({cancelled.length})
        </Button>
      </div>

      {tab === "upcoming" && (
        <>
          {loadingUpcoming ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-48" />
                    <Skeleton className="mt-3 h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              No upcoming appointments
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{upcoming.map(renderAppointment)}</div>
          )}
        </>
      )}

      {tab === "past" && (
        <>
          {loadingPast ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-48" />
                    <Skeleton className="mt-3 h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : past.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              No past appointments
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{past.map(renderAppointment)}</div>
          )}
        </>
      )}

      {tab === "cancelled" && (
        <>
          {loadingCancelled ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-48" />
                    <Skeleton className="mt-3 h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cancelled.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              No cancelled appointments
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {cancelled.map(renderAppointment)}
            </div>
          )}
        </>
      )}

      {reviewingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setReviewingId(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              How was your experience?
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
                        : "text-muted-foreground",
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
              <Button variant="outline" onClick={() => setReviewingId(null)}>
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

      <BookingDetailDialog
        booking={detailBooking}
        onOpenChange={(o) => !o && setDetailBooking(null)}
        onCancel={handleCancel}
      />
    </div>
  )
}
