"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { fetchCustomerBookings, cancelBooking } from "@/lib/api"
import type { BookingDto } from "@/lib/types"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { isoFormatDate } from "@/lib/date-utils"
import { AppointmentList } from "./_components/appointment-list"
import { ReviewModal } from "./_components/review-modal"

const BookingDetailDialog = dynamic(
  () => import("@/components/customer/booking-detail-dialog").then((m) => m.BookingDetailDialog),
  { ssr: false }
)

type Tab = "upcoming" | "past" | "cancelled"

export default function Appointments() {
  const [upcoming, setUpcoming] = useState<BookingDto[]>([])
  const [past, setPast] = useState<BookingDto[]>([])
  const [cancelled, setCancelled] = useState<BookingDto[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingPast, setLoadingPast] = useState(false)
  const [loadingCancelled, setLoadingCancelled] = useState(false)
  const [tab, setTab] = useState<Tab>("upcoming")
  const [reviewingId, setReviewingId] = useState<number | null>(null)
  const [detailBooking, setDetailBooking] = useState<BookingDto | null>(null)

  useEffect(() => {
    const today = new Date()
    const thirtyDays = new Date(today)
    thirtyDays.setDate(thirtyDays.getDate() + 30)

    setLoadingUpcoming(true)
    fetchCustomerBookings(0, 100, isoFormatDate(today), isoFormatDate(thirtyDays))
      .then((res) => setUpcoming(res.list))
      .finally(() => setLoadingUpcoming(false))
  }, [])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    if (t === "past" && past.length === 0 && !loadingPast) {
      setLoadingPast(true)
      const today = isoFormatDate(new Date())
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
      const today = isoFormatDate(new Date())
      const thirtyDaysFromNow = isoFormatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
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

  const openDetail = (a: BookingDto) => setDetailBooking(a)

  const tabs: { key: Tab; label: string; count: number; loading: boolean }[] = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length, loading: loadingUpcoming },
    { key: "past", label: "Past", count: past.length, loading: loadingPast },
    { key: "cancelled", label: "Cancelled", count: cancelled.length, loading: loadingCancelled },
  ]

  const listProps: Record<Tab, { bookings: BookingDto[]; loading: boolean; emptyMessage: string }> = {
    upcoming: { bookings: upcoming, loading: loadingUpcoming, emptyMessage: "No upcoming appointments" },
    past: { bookings: past, loading: loadingPast, emptyMessage: "No past appointments" },
    cancelled: { bookings: cancelled, loading: loadingCancelled, emptyMessage: "No cancelled appointments" },
  }

  return (
    <div>
      <PageHeader title="My Appointments" description="Manage your bookings and reviews" />

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleTabChange(t.key)}
          >
            {t.label} ({t.count})
          </Button>
        ))}
      </div>

      <AppointmentList
        {...listProps[tab]}
        onCancel={handleCancel}
        onView={openDetail}
      />

      <ReviewModal
        open={reviewingId !== null}
        onClose={() => setReviewingId(null)}
      />

      <BookingDetailDialog
        booking={detailBooking}
        onOpenChange={(o) => !o && setDetailBooking(null)}
        onCancel={handleCancel}
      />
    </div>
  )
}
