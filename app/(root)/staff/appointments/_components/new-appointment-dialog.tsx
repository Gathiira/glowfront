"use client"

import { useEffect, useState } from "react"
import type { CustomerLookupDto, RepeatPattern, ServiceDto, StaffBookingResult } from "@/lib/types"
import { createMyAppointment, money, searchMyCustomers, today } from "@/lib/api/commissions"
import { fetchMyServices } from "@/lib/api/leave"
import { fetchAllPages } from "@/lib/api/paging"
import { formatDateShort } from "@/lib/date-utils"
import { showError, showSuccess } from "@/lib/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { staffFonts } from "../../_lib/fonts"

/** Fill the form from an existing booking (Copy): same customer, service and notes, a new date and time. */
export type AppointmentDraft = {
  serviceId?: number
  time?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string | null
  notes?: string | null
}

type Props = { open: boolean; initial?: AppointmentDraft | null; onClose: () => void; onDone: () => void }

const REPEATS: { value: RepeatPattern; label: string }[] = [
  { value: "NONE", label: "Doesn't repeat" },
  { value: "DAILY", label: "Every day" },
  { value: "WEEKLY", label: "Every week" },
  { value: "BIWEEKLY", label: "Every 2 weeks" },
  { value: "MONTHLY", label: "Every month" },
]

const REMINDERS: { value: string; label: string }[] = [
  { value: "", label: "No reminder" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
]

const blank = (d?: AppointmentDraft | null) => ({
  serviceId: d?.serviceId ? String(d.serviceId) : "",
  date: today(),
  time: d?.time?.slice(0, 5) ?? "",
  customerName: d?.customerName ?? "",
  customerPhone: d?.customerPhone ?? "",
  customerEmail: d?.customerEmail ?? "",
  notes: d?.notes ?? "",
  repeat: "NONE" as RepeatPattern,
  repeatUntil: "",
  remind: "",
  remindCustomer: true,
  remindStaff: false,
})

/** Open the browser's own date/time picker when the field is tapped. */
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker()
  } catch {
    // unsupported: default behaviour applies
  }
}

/** Book a customer in with yourself, optionally repeating and with reminders. */
export function NewAppointmentDialog({ open, initial, onClose, onDone }: Props) {
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [form, setForm] = useState(() => blank(initial))
  const [matches, setMatches] = useState<CustomerLookupDto[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Shown when some repeats were skipped, so they can see which before closing.
  const [result, setResult] = useState<StaffBookingResult | null>(null)

  useEffect(() => {
    if (!open) return
    setForm(blank(initial))
    setError(null)
    setMatches([])
    setResult(null)
    fetchAllPages(fetchMyServices)
      .then(setServices)
      .catch((e) => {
        setServices([])
        showError(e)
      })
  }, [open, initial])

  // Past customers whose name or phone matches what's typed, to fill their details in.
  useEffect(() => {
    const q = form.customerName.trim()
    if (q.length < 2) return setMatches([])
    const timer = setTimeout(() => {
      searchMyCustomers(q)
        .then((found) => setMatches(found.filter((c) => c.name !== form.customerName || c.phone !== form.customerPhone)))
        .catch(() => setMatches([]))
    }, 250)
    return () => clearTimeout(timer)
  }, [form.customerName, form.customerPhone])

  const repeating = form.repeat !== "NONE"

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.remind && !form.remindCustomer && !form.remindStaff) {
      setError("Pick who to remind: the customer, you, or both.")
      return
    }
    setError(null)
    setSaving(true)
    try {
      const r = await createMyAppointment({
        serviceId: Number(form.serviceId),
        date: form.date,
        time: form.time,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim() || undefined,
        notes: form.notes.trim() || undefined,
        repeat: form.repeat,
        repeatUntil: repeating ? form.repeatUntil : undefined,
        remindMinutesBefore: form.remind ? Number(form.remind) : undefined,
        remindCustomer: !!form.remind && form.remindCustomer,
        remindStaff: !!form.remind && form.remindStaff,
      })
      const n = r.booked.length
      showSuccess(n === 1 ? "Appointment added" : `${n} appointments added`)
      if (r.skipped.length > 0) setResult(r)
      else onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add it. Try another time.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && (result ? onDone() : onClose())}>
      <DialogContent className={`sp-dialog ${staffFonts}`} style={{ maxHeight: "90dvh", overflowY: "auto" }}>
        <DialogHeader>
          <DialogTitle>{result ? "Some dates were skipped" : initial ? "Copy appointment" : "New appointment"}</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="sp-form">
            <p className="sp-lede" style={{ margin: 0 }}>
              {result.booked.length} booked. These didn&apos;t fit:
            </p>
            <ul className="sp-tally" style={{ marginTop: 0 }}>
              {result.skipped.map((s) => (
                <li key={s.date}>
                  <span className="sp-tally-what">{formatDateShort(s.date)}</span>
                  <span className="sp-tally-sub" style={{ textAlign: "right" }}>
                    {s.reason}
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className="sp-btn" onClick={onDone}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="sp-form">
            <p className="sp-lede" style={{ margin: 0 }}>
              Book a customer in with you. It&apos;s confirmed straight away.
            </p>

            <div className="sp-field">
              <label htmlFor="na-service">Service</label>
              <select
                id="na-service"
                className="sp-input"
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                required
              >
                <option value="" disabled>
                  {services === null ? "Loading…" : services.length === 0 ? "You're not on any services" : "Pick a service"}
                </option>
                {services?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.durationMinutes} min · KSH {money(s.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sp-row-2">
              <div className="sp-field">
                <label htmlFor="na-date">{repeating ? "First date" : "Date"}</label>
                <input
                  id="na-date"
                  className="sp-input"
                  type="date"
                  min={today()}
                  onClick={openPicker}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="sp-field">
                <label htmlFor="na-time">Time</label>
                <input
                  id="na-time"
                  className="sp-input"
                  type="time"
                  onClick={openPicker}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={repeating ? "sp-row-2" : undefined}>
              <div className="sp-field">
                <label htmlFor="na-repeat">Repeat</label>
                <select
                  id="na-repeat"
                  className="sp-input"
                  value={form.repeat}
                  onChange={(e) => setForm({ ...form, repeat: e.target.value as RepeatPattern })}
                >
                  {REPEATS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {repeating && (
                <div className="sp-field">
                  <label htmlFor="na-until">Until</label>
                  <input
                    id="na-until"
                    className="sp-input"
                    type="date"
                    min={form.date}
                    onClick={openPicker}
                    value={form.repeatUntil}
                    onChange={(e) => setForm({ ...form, repeatUntil: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>
            {repeating && (
              <p className="sp-slip-sub" style={{ marginTop: "-0.5rem" }}>
                Up to 52 appointments. Dates that clash, fall on your leave or when the shop is closed are skipped and
                listed.
              </p>
            )}

            <div className="sp-field">
              <label htmlFor="na-remind">Reminder</label>
              <select
                id="na-remind"
                className="sp-input"
                value={form.remind}
                onChange={(e) => setForm({ ...form, remind: e.target.value })}
              >
                {REMINDERS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {form.remind && (
                <div className="sp-chips sp-chips-wrap" role="group" aria-label="Remind">
                  <button
                    type="button"
                    aria-pressed={form.remindCustomer}
                    onClick={() => setForm({ ...form, remindCustomer: !form.remindCustomer })}
                  >
                    The customer
                  </button>
                  <button
                    type="button"
                    aria-pressed={form.remindStaff}
                    onClick={() => setForm({ ...form, remindStaff: !form.remindStaff })}
                  >
                    Me
                  </button>
                </div>
              )}
            </div>

            <div className="sp-field">
              <label htmlFor="na-name">Customer name</label>
              <input
                id="na-name"
                className="sp-input"
                autoComplete="off"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
              {matches.length > 0 && (
                <div className="sp-chips sp-chips-wrap" role="group" aria-label="Past customers">
                  {matches.slice(0, 4).map((c, i) => (
                    <button
                      key={`${c.phone ?? c.name}-${i}`}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, customerName: c.name, customerPhone: c.phone ?? form.customerPhone, customerEmail: c.email ?? "" })
                        setMatches([])
                      }}
                    >
                      {c.name}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="sp-field">
              <label htmlFor="na-phone">Customer phone</label>
              <input
                id="na-phone"
                className="sp-input"
                type="tel"
                inputMode="tel"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                required
              />
            </div>

            <div className="sp-field">
              <label htmlFor="na-email">Customer email (optional)</label>
              <input
                id="na-email"
                className="sp-input"
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              />
            </div>

            <div className="sp-field">
              <label htmlFor="na-notes">Notes (optional)</label>
              <textarea
                id="na-notes"
                className="sp-input"
                placeholder="e.g. Called in; prefers a fade"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {error && (
              <p className="sp-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="sp-btn" disabled={saving || !form.serviceId}>
              {saving ? "Adding…" : repeating ? "Add appointments" : "Add appointment"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
