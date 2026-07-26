"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import { cn, fmtNum } from "@/lib/utils"
import { CURRENCY } from "@/lib/types"
import type { StaffDto, ServiceDto } from "@/lib/types"

const HOURS = Array.from(
  { length: 10 },
  (_, i) => `${(i + 9).toString().padStart(2, "00")}:00`
)

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

export const bookingSchema = z.object({
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

type Props = {
  open: boolean
  onClose: () => void
  service: ServiceDto
  staff: StaffDto[]
  selectedMember: string | null
  onSelectMember: (id: string | null) => void
  onBook: (data: {
    date: string
    time: string
    staffId?: number
    notes?: string
    customerName?: string
    customerEmail?: string
    customerPhone?: string
  }) => void
  bookedSlots: { date: string; startTime: string }[]
  customerInfo?: boolean
}

export function BookingModal({
  open,
  onClose,
  service,
  staff,
  selectedMember,
  onSelectMember,
  onBook,
  bookedSlots,
  customerInfo = false,
}: Props) {
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  })

  const handleClose = () => {
    setSelectedDate(null)
    setSelectedTime(null)
    reset()
    onClose()
  }

  const existingAppts = bookedSlots.filter((a) => a.date === selectedDate)

  const availableTimes = useMemo(() => {
    if (!selectedDate) return []
    const booked = existingAppts.map((a) => a.startTime)
    return HOURS.filter((h) => !booked.includes(h))
  }, [selectedDate, existingAppts])

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthLabel = new Date(calYear, calMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const onFormSubmit = handleSubmit(async (formData) => {
    if (!selectedDate || !selectedTime) return
    if (customerInfo) {
      let valid = true
      if (!formData.customerName) {
        setError("customerName", { message: "Name is required" })
        valid = false
      } else {
        clearErrors("customerName")
      }
      if (!formData.customerEmail) {
        setError("customerEmail", { message: "Email is required" })
        valid = false
      } else if (!z.email().safeParse(formData.customerEmail).success) {
        setError("customerEmail", { message: "Invalid email" })
        valid = false
      } else {
        clearErrors("customerEmail")
      }
      if (!formData.customerPhone) {
        setError("customerPhone", { message: "Phone is required" })
        valid = false
      } else {
        clearErrors("customerPhone")
      }
      if (!valid) return
    }
    setSubmitting(true)
    try {
      await onBook({
        date: selectedDate,
        time: selectedTime,
        staffId: selectedMember ? Number(selectedMember) : undefined,
        notes: formData.notes || undefined,
        customerName: formData.customerName || undefined,
        customerEmail: formData.customerEmail || undefined,
        customerPhone: formData.customerPhone || undefined,
      })
      handleClose()
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose()
      }}
    >
      <DialogContent className="bottom-0 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onFormSubmit}
          className="space-y-3 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
          <label
            htmlFor="booking-modal-notes"
            className="mb-0.5 block text-xs font-medium"
          >
            Service
          </label>
          <div className="rounded-lg border bg-primary/5 p-3">
            <p className="text-sm font-medium">{service.name}</p>
            <p className="text-xs text-muted-foreground">
              {CURRENCY} {fmtNum(service.price)} &middot;{" "}
              {service.durationMinutes} min
            </p>
          </div>

          {staff.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium">Team Member (optional)</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectMember(null)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
                    !selectedMember && "border-primary bg-primary/5 font-medium"
                  )}
                >
                  Any
                </button>
                {staff.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMember(String(m.id))}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
                      selectedMember === String(m.id) &&
                        "border-primary bg-primary/5 font-medium"
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium">Select Date</p>
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
                  type="button"
                >
                  <ArrowLeft className="size-3" />
                </Button>
                <span className="flex items-center px-1 text-xs font-medium">
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
                  type="button"
                >
                  <ArrowLeft className="size-3 rotate-180" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0 text-center text-xs">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="py-0.5 font-medium text-muted-foreground"
                >
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
                      "flex aspect-square items-center justify-center rounded-full text-xs transition-colors",
                      past ? "cursor-not-allowed opacity-30" : "hover:bg-muted",
                      selectedDate === dateStr
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : ""
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
                <div className="grid grid-cols-4 gap-1.5">
                  {availableTimes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
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

          {customerInfo && (
            <div className="space-y-2">
              <div>
                <label
                  htmlFor="ci-name"
                  className="mb-0.5 block text-xs font-medium"
                >
                  Your name *
                </label>
                <Input
                  id="ci-name"
                  className="h-8 text-sm"
                  {...register("customerName")}
                />
                {errors.customerName && (
                  <p className="mt-0.5 text-xs text-destructive">
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="ci-email"
                  className="mb-0.5 block text-xs font-medium"
                >
                  Email *
                </label>
                <Input
                  id="ci-email"
                  type="email"
                  className="h-8 text-sm"
                  {...register("customerEmail")}
                />
                {errors.customerEmail && (
                  <p className="mt-0.5 text-xs text-destructive">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="ci-phone"
                  className="mb-0.5 block text-xs font-medium"
                >
                  Phone *
                </label>
                <Input
                  id="ci-phone"
                  type="tel"
                  className="h-8 text-sm"
                  {...register("customerPhone")}
                />
                {errors.customerPhone && (
                  <p className="mt-0.5 text-xs text-destructive">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <Separator />

          <div>
            <label
              htmlFor="booking-modal-notes"
              className="mb-0.5 block text-xs font-medium"
            >
              Notes
            </label>
            <Textarea
              id="booking-modal-notes"
              placeholder="Any special requests..."
              {...register("notes")}
              className="text-sm"
              rows={2}
            />
          </div>
        </form>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose>
            <Button variant="ghost" type="button">
              close
            </Button>
          </DialogClose>
          <Button
            disabled={!selectedDate || !selectedTime || submitting}
            onClick={() => onFormSubmit()}
          >
            {submitting ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
