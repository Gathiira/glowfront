"use client"

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
import { Button } from "@/components/ui/button"
import { OctagonX } from "lucide-react"
import { AppointmentCard } from "@/components/customer/appointment-card"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"
import type { BookingDto } from "@/lib/types"

type Props = {
  bookings: BookingDto[]
  loading: boolean
  emptyMessage: string
  onCancel?: (id: number) => void
  onView: (booking: BookingDto) => void
}

export function AppointmentList({
  bookings,
  loading,
  emptyMessage,
  onCancel,
  onView,
}: Props) {
  if (loading) return <LoadingState rows={3} />
  if (bookings.length === 0) return <EmptyState message={emptyMessage} />

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {bookings.map((a) => (
        <AppointmentCard
          key={a.id}
          booking={a}
          onView={onView}
          actions={
            <>
              {a.status === "PENDING" && onCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-3 text-destructive w-full">
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
                      <AlertDialogAction onClick={() => onCancel(a.id)}>
                        Yes, cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {a.status === "COMPLETED" && (
                <Button size="sm" className="mt-3 w-full">
                  Write a Review
                </Button>
              )}
            </>
          }
        />
      ))}
    </div>
  )
}
