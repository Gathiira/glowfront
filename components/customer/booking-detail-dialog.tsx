"use client"

import { useEffect, useState, startTransition } from "react"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Star, OctagonX, Phone, Mail, MapPin, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { fetchCustomerBusinessDetail } from "@/lib/api"
import type { BookingDto, BusinessDetailDto } from "@/lib/types"
import { BusinessMap } from "@/components/map/business-map"

type Props = {
  booking: BookingDto | null
  onOpenChange: (open: boolean) => void
  onCancel?: (id: number) => Promise<void>
}

export function BookingDetailDialog({ booking, onOpenChange, onCancel }: Props) {
  const [businessDetail, setBusinessDetail] = useState<BusinessDetailDto | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!booking) return
    const t = setTimeout(() => setMapReady(true), 300)
    return () => { clearTimeout(t); setMapReady(false) }
  }, [booking])

  useEffect(() => {
    if (!booking) return
    startTransition(() => { setBusinessDetail(null); setLoadingDetail(true) })
    fetchCustomerBusinessDetail(booking.businessSlug)
      .then((data) => { setBusinessDetail(data); setLoadingDetail(false) })
      .catch(() => { toast.error("Failed to load business details"); setLoadingDetail(false) })
  }, [booking])

  return (
    <Dialog open={!!booking} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Appointment information and business details
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Appointment</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p>{booking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Service</p>
                  <p className="font-medium">{booking.serviceName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{booking.bookingDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p>{booking.bookingTime}{booking.durationMinutes ? ` (${booking.durationMinutes} min)` : ""}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={booking.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed"} />
                </div>
              </div>
              {booking.notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground">Note:</span> {booking.notes}
                </p>
              )}
            </div>

            {loadingDetail ? (
              <div className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : businessDetail && (
              <>
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Business</h4>
                    <a
                      href={`/business/${businessDetail.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Public page <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <p className="font-medium">{businessDetail.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{businessDetail.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {businessDetail.phone && (
                      <a href={`tel:${businessDetail.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <Phone className="size-3.5" /> {businessDetail.phone}
                      </a>
                    )}
                    {businessDetail.email && (
                      <a href={`mailto:${businessDetail.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <Mail className="size-3.5" /> {businessDetail.email}
                      </a>
                    )}
                  </div>
                  {businessDetail.overallRating != null && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-0.5">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{businessDetail.overallRating.toFixed(1)}</span>
                      </div>
                      <span className="text-muted-foreground">({businessDetail.totalReviews ?? 0} reviews)</span>
                    </div>
                  )}
                </div>

                {businessDetail.location?.latitude && businessDetail.location?.longitude && (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Location</h4>
                    <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {businessDetail.location.streetAddress}{businessDetail.location.city ? `, ${businessDetail.location.city}` : ""}
                    </p>
                    {mapReady && (
                      <BusinessMap
                        center={[businessDetail.location.latitude, businessDetail.location.longitude]}
                        name={businessDetail.name}
                        height="h-48"
                      />
                    )}
                    {businessDetail.location.mapsUrl && (
                      <a
                        href={businessDetail.location.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Open in Google Maps <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                )}

                {businessDetail.reviews.length > 0 && (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Reviews ({businessDetail.reviews.length})
                    </h4>
                    <div className="space-y-3">
                      {businessDetail.reviews.slice(0, 5).map((r) => (
                        <div key={r.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{r.customerName}</p>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "size-3",
                                    i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground/60">{r.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {booking?.status === "PENDING" && onCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Appointment</Button>
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
                  <AlertDialogAction onClick={() => { onCancel(booking.id); onOpenChange(false) }}>
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
