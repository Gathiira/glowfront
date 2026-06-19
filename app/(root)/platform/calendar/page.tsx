"use client"

import { useState } from "react"
import { useCustomer } from "@/lib/customer-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const { appointments } = useCustomer()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

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

  const apptsByDate = appointments.reduce(
    (acc, a) => {
      if (a.status !== "cancelled") {
        if (!acc[a.date]) acc[a.date] = []
        acc[a.date].push(a)
      }
      return acc
    },
    {} as Record<string, typeof appointments>,
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
                            className="truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] leading-tight text-primary"
                          >
                            {a.startTime} {a.businessName}
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
          </CardContent>
        </Card>

        <div className="space-y-3">
          {selectedDate ? (
            <>
              <h3 className="text-lg font-semibold">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              {selectedAppts.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border text-sm text-muted-foreground">
                  No appointments on this day
                </div>
              ) : (
                selectedAppts.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{a.businessName}</p>
                          <p className="text-sm text-muted-foreground">{a.serviceName}</p>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          {a.startTime} - {a.endTime}
                        </span>
                        {a.teamMemberName && <span>with {a.teamMemberName}</span>}
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
    </div>
  )
}
