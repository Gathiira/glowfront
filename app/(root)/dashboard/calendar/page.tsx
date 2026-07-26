"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate, getDaysInMonth, getFirstDayOfMonth, isPastDate, isPastHour } from "@/lib/date-utils"
import { AppointmentModal } from "./_components/appointment-modal"
import { SaleModal } from "./_components/sale-modal"

type Appointment = {
  id: string
  date: string
  startHour: number
  endHour: number
  client: string
  service: string
  phone: string
  notes: string
  status: "confirmed" | "pending" | "completed" | "blocked"
}

const colors: Record<string, string> = {
  confirmed: "bg-blue-500 text-white",
  pending: "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
  blocked: "bg-gray-400 text-white",
}

const statusColors: Record<string, string> = {
  confirmed: "border-l-blue-500",
  pending: "border-l-yellow-500",
  completed: "border-l-green-500",
  blocked: "border-l-gray-400",
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

export default function Calendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", date: formatDate(today.getFullYear(), today.getMonth(), today.getDate()), startHour: 9, endHour: 10.5, client: "Sarah Johnson", service: "Hair Coloring", phone: "+1 (555) 123-4567", notes: "Allergic to ammonia", status: "confirmed" },
    { id: "2", date: formatDate(today.getFullYear(), today.getMonth(), today.getDate()), startHour: 10, endHour: 11, client: "Mike Chen", service: "Haircut", phone: "", notes: "", status: "completed" },
  ])

  const [modal, setModal] = useState<"appointment" | "block" | "sale" | null>(null)
  const [form, setForm] = useState({ client: "", service: "", phone: "", notes: "" })
  const [editingId, setEditingId] = useState<string | null>(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthLabel = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null); setSelectedHour(null)
  }

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null); setSelectedHour(null)
  }

  const dayAppts = selectedDate
    ? appointments.filter((a) => a.date === selectedDate).sort((a, b) => a.startHour - b.startHour)
    : []

  const openCreate = (type: "appointment" | "block" | "sale") => {
    setForm({ client: "", service: type === "block" ? "Blocked" : "", phone: "", notes: "" })
    setEditingId(null)
    setModal(type)
  }

  const handleSave = () => {
    if (!selectedDate) return
    if (isPastDate(selectedDate)) return
    const hour = selectedHour ?? 9
    if (isPastHour(selectedDate, hour)) return
    if (editingId) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, client: form.client, service: form.service, phone: form.phone, notes: form.notes } : a
        )
      )
    } else {
      const newAppt: Appointment = {
        id: Date.now().toString(),
        date: selectedDate,
        startHour: hour,
        endHour: hour + 1,
        client: form.client || "Unknown",
        service: form.service || "General",
        phone: form.phone,
        notes: form.notes,
        status: modal === "block" ? "blocked" : "confirmed",
      }
      setAppointments((prev) => [...prev, newAppt])
    }
    setModal(null)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
    setEditingId(null)
    setModal(null)
  }

  const editAppointment = (appt: Appointment) => {
    setForm({ client: appt.client, service: appt.service, phone: appt.phone, notes: appt.notes })
    setEditingId(appt.id)
    setModal("appointment")
    setSelectedHour(appt.startHour)
  }

  const closeModal = () => { setModal(null); setEditingId(null) }

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div>
      <PageHeader title="Calendar" description="Click a day to view and manage appointments">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[180px] text-center text-lg font-medium">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_350px]">
        <div className="rounded-lg border">
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {blanks.map((i) => (
              <div key={`blank-${i}`} className="min-h-20 border-b border-r bg-muted/20 p-1 md:min-h-24" />
            ))}
            {days.map((day) => {
              const dateStr = formatDate(year, month, day)
              const dayAppts = appointments.filter((a) => a.date === dateStr)
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPastDate(dateStr)}
                  onClick={() => { setSelectedDate(dateStr); setSelectedHour(null) }}
                  className={`relative min-h-20 border-b border-r p-1 text-left transition-colors md:min-h-24 ${
                    isPastDate(dateStr)
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-muted/30"
                  } ${isSelected ? "ring-2 ring-inset ring-primary" : ""}`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-sm ${
                      isToday ? "bg-primary text-primary-foreground font-semibold" : ""
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayAppts.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className={`truncate rounded px-1 py-0.5 text-[10px] leading-tight ${colors[a.status]}`}
                      >
                        {a.client}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <p className="px-1 text-[10px] text-muted-foreground">
                        +{dayAppts.length - 2}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          {selectedDate ? (
            <>
              <div className="rounded-lg border p-4">
                <p className="font-medium">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {isPastDate(selectedDate) ? (
                <div className="flex h-32 items-center justify-center rounded-lg border text-sm text-destructive">
                  Cannot book past dates
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => openCreate("appointment")}>
                      + Appointment
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openCreate("block")}>
                      Block
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => openCreate("sale")}>
                      Sale
                    </Button>
                  </div>

                  <div className="rounded-lg border">
                    <div className="border-b px-3 py-2 text-sm font-medium">Time Slots</div>
                    <div className="divide-y">
                      {HOURS.map((h) => {
                        const appt = dayAppts.find(
                          (a) => a.startHour <= h && a.endHour > h
                        )
                        const isSelectedHour = selectedHour === h
                        const isSlotPast = isPastHour(selectedDate, h)
                        return (
                          <button
                            key={h}
                            type="button"
                            disabled={isSlotPast && !appt}
                            onClick={() => {
                              if (isSlotPast && !appt) return
                              if (!appt) { setSelectedHour(h); openCreate("appointment") }
                              else editAppointment(appt)
                            }}
                            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                              isSlotPast && !appt
                                ? "cursor-not-allowed opacity-40"
                                : "hover:bg-muted/50"
                            } ${isSelectedHour ? "bg-muted" : ""} ${appt ? statusColors[appt.status] : "border-l-transparent"} border-l-2`}
                          >
                            <span className="w-12 shrink-0 text-muted-foreground">
                              {h.toString().padStart(2, "0")}:00
                            </span>
                            {appt ? (
                              <div className="flex flex-1 items-center justify-between">
                                <div>
                                  <span className="font-medium">{appt.client}</span>
                                  <span className="ml-2 text-muted-foreground">{appt.service}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {appt.status}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Available</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
              Select a day to manage appointments
            </div>
          )}
        </div>
      </div>

      <AppointmentModal
        modal={modal === "sale" ? null : modal}
        editingId={editingId}
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={closeModal}
      />

      <SaleModal
        open={modal === "sale"}
        form={{ client: form.client, service: form.service }}
        onFormChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
        onSave={() => setModal(null)}
        onClose={() => setModal(null)}
      />
    </div>
  )
}
