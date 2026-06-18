"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

type Shift = {
  day: string
  start: string
  end: string
  active: boolean
}

export default function MemberShifts() {
  const [shifts, setShifts] = useState<Shift[]>(
    days.map((day) => ({
      day,
      start: "09:00",
      end: "17:00",
      active: !["Saturday", "Sunday"].includes(day),
    }))
  )

  const updateShift = (day: string, field: keyof Shift, value: string | boolean) => {
    setShifts((prev) =>
      prev.map((s) => (s.day === day ? { ...s, [field]: value } : s))
    )
  }

  return (
    <div>
      <PageHeader title="Configure Shifts" description="Set working hours for this team member" />

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shifts.map((shift) => (
                <div
                  key={shift.day}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:gap-3"
                >
                  <label className="flex items-center gap-2 text-sm font-medium sm:w-28">
                    <input
                      type="checkbox"
                      checked={shift.active}
                      onChange={(e) => updateShift(shift.day, "active", e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    {shift.day}
                  </label>
                  {shift.active && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={shift.start}
                        onChange={(e) => updateShift(shift.day, "start", e.target.value)}
                        className="h-9 w-28 rounded-md border border-input bg-transparent px-2 text-sm sm:h-7 sm:w-24"
                      />
                      <span className="text-muted-foreground">to</span>
                      <input
                        type="time"
                        value={shift.end}
                        onChange={(e) => updateShift(shift.day, "end", e.target.value)}
                        className="h-9 w-28 rounded-md border border-input bg-transparent px-2 text-sm sm:h-7 sm:w-24"
                      />
                    </div>
                  )}
                </div>
            ))}
          </div>
          <Button className="mt-6 w-full">Save Schedule</Button>
        </CardContent>
      </Card>
    </div>
  )
}
