"use client"

import { useState } from "react"
import { useCustomer } from "@/lib/customer-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Tab = "upcoming" | "past"

export default function Appointments() {
  const { appointments, cancelAppointment, addReview } = useCustomer()
  const [tab, setTab] = useState<Tab>("upcoming")
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const todayStr = new Date().toISOString().split("T")[0]

  const upcoming = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed",
  )
  const past = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled",
  )

  const handleCancel = (id: string) => {
    cancelAppointment(id)
    toast.success("Appointment cancelled")
  }

  const openReview = (id: string) => {
    setReviewingId(id)
    setReviewRating(0)
    setReviewText("")
  }

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewText.trim() || !reviewingId) return
    const appt = appointments.find((a) => a.id === reviewingId)
    if (!appt) return
    addReview(appt.businessId, reviewingId, reviewRating, reviewText)
    toast.success("Review submitted!")
    setReviewingId(null)
    setReviewRating(0)
    setReviewText("")
  }

  const renderAppointment = (a: (typeof appointments)[0]) => (
    <Card key={a.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{a.businessName}</p>
            <p className="text-sm text-muted-foreground">{a.serviceName}</p>
          </div>
          <StatusBadge status={a.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>
            {new Date(a.date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>
            {a.startTime} - {a.endTime}
          </span>
          {a.teamMemberName && <span>with {a.teamMemberName}</span>}
        </div>
        {a.notes && (
          <p className="mt-2 text-xs text-muted-foreground italic">Note: {a.notes}</p>
        )}
        <div className="mt-3 flex gap-2">
          {a.status === "confirmed" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => handleCancel(a.id)}
            >
              Cancel
            </Button>
          )}
          {a.status === "completed" && !a.reviewed && (
            <Button size="sm" onClick={() => openReview(a.id)}>
              Write a Review
            </Button>
          )}
          {a.status === "completed" && a.reviewed && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              Reviewed
            </span>
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
          onClick={() => setTab("upcoming")}
        >
          Upcoming ({upcoming.length})
        </Button>
        <Button
          variant={tab === "past" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("past")}
        >
          Past ({past.length})
        </Button>
      </div>

      {tab === "upcoming" && (
        <>
          {upcoming.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              No upcoming appointments
            </div>
          ) : (
            <div className="space-y-3">{upcoming.map(renderAppointment)}</div>
          )}
        </>
      )}

      {tab === "past" && (
        <>
          {past.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              No past appointments
            </div>
          ) : (
            <div className="space-y-3">{past.map(renderAppointment)}</div>
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
    </div>
  )
}
