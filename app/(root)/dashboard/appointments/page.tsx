"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { CheckoutDialog } from "@/components/dashboard/checkout-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadMore } from "@/components/ui/load-more"
import type { BookingDto, StaffDto } from "@/lib/types"
import { fetchBusinessBookings } from "@/lib/api/commissions"
import { fetchAllPartnerStaff } from "@/lib/api/partner"
import { usePagedList } from "@/lib/use-paged-list"
import { showError } from "@/lib/toast"

type Status = "confirmed" | "pending" | "cancelled" | "completed"

export default function Appointments() {
  // The server returns bookings newest first.
  const { items: bookings, total, loading, loaded, hasMore, loadMore, reload } = usePagedList(fetchBusinessBookings, [])
  const [staff, setStaff] = useState<StaffDto[]>([])
  const [checkingOut, setCheckingOut] = useState<BookingDto | null>(null)

  useEffect(() => {
    fetchAllPartnerStaff().then(setStaff).catch(showError)
  }, [])

  const staffName = (id: number | null) => staff.find((s) => s.id === id)?.name ?? "Any staff"

  return (
    <div>
      <PageHeader title="Appointments" description="All bookings, newest first" />

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {!loaded && <p className="text-sm text-muted-foreground">Loading...</p>}
          {loaded && !loading && bookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
          <div className="space-y-3">
            {bookings.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a.customerName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.serviceName} · {staffName(a.staffId)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">{a.bookingDate}</p>
                  <p className="text-xs text-muted-foreground">{a.bookingTime?.slice(0, 5)}</p>
                </div>
                <StatusBadge status={a.status.toLowerCase() as Status} />
                {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                  <Button size="sm" onClick={() => setCheckingOut(a)}>
                    Checkout
                  </Button>
                )}
              </div>
            ))}
          </div>
          <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${bookings.length} of ${total}`} />
        </CardContent>
      </Card>

      <CheckoutDialog
        open={checkingOut !== null}
        booking={checkingOut}
        onClose={() => setCheckingOut(null)}
        onDone={() => {
          setCheckingOut(null)
          reload()
        }}
      />
    </div>
  )
}
