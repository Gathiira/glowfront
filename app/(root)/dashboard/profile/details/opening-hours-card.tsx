"use client"

import { useState } from "react"
import { Clock, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { updatePartnerOpeningHours } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"
import type { BusinessOpeningHoursDto } from "@/lib/types"

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

type Row = { dayOfWeek: string; open: boolean; openTime: string; closeTime: string }

const dayLabel = (day: string) => day.charAt(0) + day.slice(1).toLowerCase()
/** "09:00:00" -> "09:00" (what <input type="time"> uses). */
const hhmm = (t?: string | null) => t?.slice(0, 5) ?? ""

export function OpeningHoursCard({
  hours,
  onSaved,
}: {
  hours: BusinessOpeningHoursDto[]
  onSaved: (hours: BusinessOpeningHoursDto[]) => void
}) {
  /** null while viewing; the draft rows while editing. */
  const [rows, setRows] = useState<Row[] | null>(null)
  const [saving, setSaving] = useState(false)

  const startEditing = () =>
    setRows(
      DAYS.map((day) => {
        const h = hours.find((o) => o.dayOfWeek === day)
        return {
          dayOfWeek: day,
          open: !!h && !h.closed,
          openTime: hhmm(h?.openTime) || "09:00",
          closeTime: hhmm(h?.closeTime) || "18:00",
        }
      })
    )

  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev!.map((row, j) => (j === i ? { ...row, ...patch } : row)))

  const save = async () => {
    if (!rows) return
    const bad = rows.find((r) => r.open && !(r.openTime && r.closeTime && r.openTime < r.closeTime))
    if (bad) {
      showError(`${dayLabel(bad.dayOfWeek)}: opening time must be before closing time`)
      return
    }
    setSaving(true)
    try {
      const saved = await updatePartnerOpeningHours(
        rows.map((r) => ({
          dayOfWeek: r.dayOfWeek,
          openTime: r.openTime || null,
          closeTime: r.closeTime || null,
          closed: !r.open,
        }))
      )
      onSaved(saved)
      setRows(null)
      showSuccess("Opening hours saved")
    } catch (error) {
      showError(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-4" /> Opening Hours
          </CardTitle>
          {!rows && (
            <Button variant="outline" size="sm" onClick={startEditing}>
              <Pencil className="size-3.5" /> Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {rows ? (
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={r.dayOfWeek} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="w-24 shrink-0">{dayLabel(r.dayOfWeek)}</span>
                <Switch
                  checked={r.open}
                  onCheckedChange={(open) => update(i, { open })}
                  aria-label={`${dayLabel(r.dayOfWeek)} open`}
                />
                {r.open ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={r.openTime}
                      onChange={(e) => update(i, { openTime: e.target.value })}
                      aria-label={`${dayLabel(r.dayOfWeek)} opening time`}
                      className="w-28"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={r.closeTime}
                      onChange={(e) => update(i, { closeTime: e.target.value })}
                      aria-label={`${dayLabel(r.dayOfWeek)} closing time`}
                      className="w-28"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRows(null)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : hours.length === 0 ? (
          <p className="text-sm text-muted-foreground">No opening hours set yet.</p>
        ) : (
          <div className="space-y-1">
            {DAYS.map((day) => {
              const h = hours.find((o) => o.dayOfWeek === day)
              return (
                <div key={day} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{dayLabel(day)}</span>
                  <span>{h && !h.closed ? `${hhmm(h.openTime)} - ${hhmm(h.closeTime)}` : "Closed"}</span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
