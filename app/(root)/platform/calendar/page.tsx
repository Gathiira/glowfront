"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchCustomerBookings, cancelBooking } from "@/lib/api"
import type { BookingDto } from "@/lib/types"
import { BookingDetailDialog } from "@/components/customer/booking-detail-dialog"
import { toast } from "sonner"

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export default function CustomerCalendar() {
  const [bookings, setBookings] = useState<BookingDto[]>([])
  const [loading, setLoading] = useState(true)
  const [detailBooking, setDetailBooking] = useState<BookingDto | null>(null)
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const sd = formatDate(year, month, 1)
    const ed = formatDate(year, month, getDaysInMonth(year, month))
    setLoading(true)
    fetchCustomerBookings(0, 120, sd, ed)
      .then((res) => setBookings(res.list))
      .finally(() => setLoading(false))
  }, [year, month])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthLabel = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else {
      setMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1)
      setMonth(0)
    } else {
      setMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id)
      const sd = formatDate(year, month, 1)
      const ed = formatDate(year, month, getDaysInMonth(year, month))
      const res = await fetchCustomerBookings(0, 120, sd, ed)
      setBookings(res.list)
      toast.success("Appointment cancelled")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel")
    }
  }

  const apptsByDate = bookings.reduce(
    (acc, a) => {
      if (!acc[a.bookingDate]) acc[a.bookingDate] = []
      acc[a.bookingDate].push(a)
      return acc
    },
    {} as Record<string, BookingDto[]>,
  )

  const selectedAppts = selectedDate ? apptsByDate[selectedDate] || [] : []
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div>
      <PageHeader title="My Calendar" description="View your upcoming appointments" />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-lg font-medium">{monthLabel}</span>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-7">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="min-h-20 rounded-none border-b border-r" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {blanks.map((i) => (
                  <div key={`b-${i}`} className="min-h-20 border-b border-r bg-muted/20 p-1" />
                ))}
                {days.map((day) => {
                  const dateStr = formatDate(year, month, day)
                  const dayAppts = apptsByDate[dateStr] || []
                  const isToday = dateStr === todayStr
                  const isSelected = dateStr === selectedDate
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={cn(
                        "relative min-h-20 border-b border-r p-1 text-left transition-colors hover:bg-muted/30",
                        isSelected && "ring-2 ring-inset ring-primary",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-full text-sm",
                          isToday && "bg-primary text-primary-foreground font-semibold",
                        )}
                      >
                        {day}
                      </span>
                      {dayAppts.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {dayAppts.slice(0, 2).map((a) => (
                            <div
                              key={a.id}
                              className={cn(
                                "truncate rounded px-1 py-0.5 text-[10px] leading-tight",
                                a.status === "CANCELLED"
                                  ? "bg-muted text-muted-foreground line-through"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              {a.bookingTime} {a.businessName}
                            </div>
                          ))}
                          {dayAppts.length > 2 && (
                            <p className="px-1 text-[10px] text-muted-foreground">
                              +{dayAppts.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {selectedDate ? (
            <>
              <h3 className="text-lg font-semibold">{selectedDate}</h3>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-2 h-3 w-48" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : selectedAppts.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border text-sm text-muted-foreground">
                  No appointments on this day
                </div>
              ) : (
                selectedAppts.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="flex items-stretch justify-between gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{a.customerName}</p>
                        <p className="text-sm text-muted-foreground">{a.customerPhone}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{a.businessName}</span>
                          <span>{a.serviceName}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {a.bookingTime}
                            {a.durationMinutes && ` (${a.durationMinutes} min)`}
                          </span>
                          {a.notes && <span>&middot; {a.notes}</span>}
                        </div>
                        <a
                          href={`/business/${a.businessSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          View public page &rarr;
                        </a>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <StatusBadge status={a.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed"} />
                        <Button variant="ghost" size="sm" onClick={() => setDetailBooking(a)} className="gap-1">
                          <Eye className="size-3.5" /> View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Select a day to view appointments
            </div>
          )}
        </div>
      </div>

      <BookingDetailDialog
        booking={detailBooking}
        onOpenChange={(o) => !o && setDetailBooking(null)}
        onCancel={handleCancel}
      />
    </div>
  )
}
