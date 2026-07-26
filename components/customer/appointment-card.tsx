import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import type { BookingDto } from "@/lib/types"

type Props = {
  booking: BookingDto
  onView: (booking: BookingDto) => void
  actions?: React.ReactNode
}

export function AppointmentCard({ booking, onView, actions }: Props) {
  return (
    <Card>
      <CardContent className="flex items-stretch justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{booking.customerName}</p>
          <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{booking.businessName}</span>
            <span>{booking.serviceName}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{booking.bookingDate}</span>
            <span>
              {booking.bookingTime}
              {booking.durationMinutes ? ` (${booking.durationMinutes} min)` : ""}
            </span>
          </div>
          {booking.notes && (
            <p className="mt-2 text-xs text-muted-foreground italic">Note: {booking.notes}</p>
          )}
        </div>
        <div className="flex flex-col items-end justify-between">
          <StatusBadge
            status={
              booking.status.toLowerCase() as
                | "confirmed"
                | "pending"
                | "cancelled"
                | "completed"
            }
          />
          <Button variant="ghost" size="sm" onClick={() => onView(booking)} className="mt-6 gap-1">
            <Eye className="size-4" /> View
          </Button>
          {actions}
        </div>
      </CardContent>
    </Card>
  )
}
