"use client"

import { useEffect, useState } from "react"
import type { CustomerLookupDto, ServiceDto } from "@/lib/types"
import { createMyAppointment, money, searchMyCustomers, today } from "@/lib/api/commissions"
import { fetchMyServices } from "@/lib/api/leave"
import { fetchAllPages } from "@/lib/api/paging"
import { showError, showSuccess } from "@/lib/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { staffFonts } from "../../_lib/fonts"

type Props = { open: boolean; onClose: () => void; onDone: () => void }

const empty = () => ({ serviceId: "", date: today(), time: "", customerName: "", customerPhone: "", customerEmail: "", notes: "" })

/** Open the browser's own date/time picker when the field is tapped. */
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker()
  } catch {
    // unsupported: default behaviour applies
  }
}

/** Book a customer in with yourself (they called, or booked at the counter). */
export function NewAppointmentDialog({ open, onClose, onDone }: Props) {
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [form, setForm] = useState(empty)
  const [matches, setMatches] = useState<CustomerLookupDto[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setForm(empty())
    setError(null)
    setMatches([])
    fetchAllPages(fetchMyServices)
      .then(setServices)
      .catch((e) => {
        setServices([])
        showError(e)
      })
  }, [open])

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await createMyAppointment({
        serviceId: Number(form.serviceId),
        date: form.date,
        time: form.time,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim() || undefined,
        notes: form.notes.trim() || undefined,
      })
      showSuccess("Appointment added")
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add it. Try another time.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={`sp-dialog ${staffFonts}`} style={{ maxHeight: "90dvh", overflowY: "auto" }}>
        <DialogHeader>
          <DialogTitle>New appointment</DialogTitle>
        </DialogHeader>
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
              <label htmlFor="na-date">Date</label>
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
            {saving ? "Adding…" : "Add appointment"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
