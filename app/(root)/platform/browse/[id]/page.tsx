"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCustomer } from "@/lib/customer-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Phone, ArrowLeft, Clock, DollarSign, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { CURRENCY } from "@/lib/types"
import { toast } from "sonner"

const HOURS = Array.from({ length: 10 }, (_, i) => `${(i + 9).toString().padStart(2, "0")}:00`)

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

export default function BusinessDetail() {
  const params = useParams()
  const router = useRouter()
  const { getBusiness, createAppointment, getAppointmentsForBusiness, profile, addReview } = useCustomer()
  const business = getBusiness(params.id as string)

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [bookingStep, setBookingStep] = useState<"service" | "datetime" | "confirm">("service")

  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [reviewModal, setReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  if (!business) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Business not found</p>
        <Button variant="outline" onClick={() => router.push("/platform/browse")}>
          Back to Browse
        </Button>
      </div>
    )
  }

  const customerAppts = getAppointmentsForBusiness(business.id)
  const canReview = customerAppts.some((a) => a.status === "completed" && !a.reviewed)
  const completedUnreviewed = customerAppts.filter((a) => a.status === "completed" && !a.reviewed)

  const existingAppts = customerAppts.filter((a) => a.date === selectedDate && a.status !== "cancelled")

  const availableTimes = useMemo(() => {
    if (!selectedDate) return []
    const booked = existingAppts.map((a) => a.startTime)
    return HOURS.filter((h) => !booked.includes(h))
  }, [selectedDate, existingAppts])

  const selectedServiceData = business.services.find((s) => s.id === selectedService)

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthLabel = new Date(calYear, calMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const handleBook = () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) return
    const endHour = parseInt(selectedTime) + Math.ceil(selectedServiceData.duration / 60)
    const endTime = `${endHour.toString().padStart(2, "0")}:00`
    createAppointment({
      businessId: business.id,
      businessName: business.name,
      serviceName: selectedServiceData.name,
      servicePrice: selectedServiceData.price,
      teamMemberName: selectedMember
        ? business.team.find((t) => t.id === selectedMember)?.name
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
    setBookingStep("service")
  }

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewText.trim()) return
    const appt = completedUnreviewed[0]
    if (!appt) return
    addReview(business.id, appt.id, reviewRating, reviewText)
    toast.success("Review submitted!")
    setReviewModal(false)
    setReviewRating(0)
    setReviewText("")
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/platform/browse")}
        className="mb-4"
      >
        <ArrowLeft className="mr-1 size-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                <span className="text-5xl font-bold text-primary/20">{business.name.charAt(0)}</span>
              </div>
              <h1 className="text-2xl font-bold">{business.name}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {business.category}
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{business.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {business.address}, {business.town}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4" />
                  {business.phone}
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{business.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {business.services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(s.id)
                    setBookingStep("datetime")
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted",
                    selectedService === s.id && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    {s.description && (
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5" />
                      {s.duration}min
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="size-3.5" />
                      {s.price}
                    </div>
                    {selectedService === s.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {business.team.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team members listed</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {business.team.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMember(m.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        selectedMember === m.id && "border-primary bg-primary/5",
                      )}
                    >
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reviews</CardTitle>
                {canReview && (
                  <Button size="sm" onClick={() => setReviewModal(true)}>
                    Write a Review
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {business.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              ) : (
                business.reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{r.clientName}</p>
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
                              : "text-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="sticky top-6 space-y-4">
            {bookingStep === "datetime" && selectedServiceData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Book {selectedServiceData.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {CURRENCY} {selectedServiceData.price} &middot; {selectedServiceData.duration} min
                  </p>

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
                        <div key={d} className="py-1 font-medium text-muted-foreground">
                          {d}
                        </div>
                      ))}
                      {blanks.map((i) => (
                        <div key={`b-${i}`} />
                      ))}
                      {days.map((day) => {
                        const dateStr = formatDate(new Date(calYear, calMonth, day))
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
                                "text-destructive/60",
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
                        <p className="text-sm text-muted-foreground">No available slots</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimes.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSelectedTime(t)}
                              className={cn(
                                "rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted",
                                selectedTime === t && "border-primary bg-primary/5 font-medium",
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-sm font-medium">Notes (optional)</p>
                    <Textarea
                      placeholder="Any special requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <Button
                    className="w-full"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleBook}
                  >
                    Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            )}

            {!selectedService && (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  Select a service above to book an appointment
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

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
            <p className="mb-4 text-sm text-muted-foreground">Share your experience at {business.name}</p>

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
              <Button variant="outline" onClick={() => setReviewModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={reviewRating === 0 || !reviewText.trim()}>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
