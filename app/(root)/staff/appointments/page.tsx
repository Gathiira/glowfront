"use client"

import { useEffect, useState } from "react"
import type { BookingDto, StaffAppointmentsSummaryDto } from "@/lib/types"
import {
  acceptMyAppointment,
  declineMyAppointment,
  fetchMyAppointments,
  fetchMyAppointmentsSummary,
  rescheduleMyAppointment,
  today,
} from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"
import { showError, showSuccess } from "@/lib/toast"
import { formatDateShort, formatTimeDisplay } from "@/lib/date-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useConfirm } from "@/components/ui/use-confirm"
import { staffFonts } from "../_lib/fonts"
import { NewAppointmentDialog, type AppointmentDraft } from "./_components/new-appointment-dialog"

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "New", className: "sp-pending-mark" },
  CONFIRMED: { label: "Confirmed", className: "sp-stamp sp-stamp-blue" },
  COMPLETED: { label: "Done", className: "sp-stamp sp-stamp-blue" },
  CANCELLED: { label: "Cancelled", className: "sp-slip-sub" },
  NO_SHOW: { label: "No-show", className: "sp-stamp" },
}

const isOpen = (b: BookingDto) => b.status === "PENDING" || b.status === "CONFIRMED"

/** Open the browser's own date/time picker when the field is tapped. */
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker()
  } catch {
    // unsupported: default behaviour applies
  }
}

/** Your own bookings: today's numbers, then accept, decline or move them. */
export default function MyAppointments() {
  const [summary, setSummary] = useState<StaffAppointmentsSummaryDto | null>(null)
  const [upcoming, setUpcoming] = useState(true)
  const pages = usePagedList((current) => fetchMyAppointments(upcoming, current), [upcoming])
  const [moving, setMoving] = useState<BookingDto | null>(null)
  const [moveTo, setMoveTo] = useState({ date: "", time: "" })
  const [declining, setDeclining] = useState<BookingDto | null>(null)
  const [reason, setReason] = useState("")
  const [busy, setBusy] = useState(false)
  const [adding, setAdding] = useState(false)
  // Copy: the new-appointment form pre-filled from an existing booking.
  const [copying, setCopying] = useState<AppointmentDraft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirm, confirmDialog] = useConfirm()
  const dialog = { className: `sp-dialog ${staffFonts}`, actionClassName: "sp-dialog-neutral" }

  const loadSummary = () => fetchMyAppointmentsSummary().then(setSummary).catch(showError)
  useEffect(() => {
    loadSummary()
  }, [])

  const refresh = () => {
    pages.reload()
    loadSummary()
  }

  const when = (b: BookingDto) => `${formatDateShort(b.bookingDate)} · ${formatTimeDisplay(b.bookingTime)}`

  const accept = async (b: BookingDto) => {
    const ok = await confirm({
      title: `Accept ${b.customerName}'s booking?`,
      description: `${b.serviceName}, ${when(b)}.`,
      confirmLabel: "Accept",
      ...dialog,
    })
    if (!ok) return
    try {
      await acceptMyAppointment(b.id)
      showSuccess("Booking accepted")
      refresh()
    } catch (err) {
      showError(err)
    }
  }

  const decline = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!declining) return
    setBusy(true)
    try {
      await declineMyAppointment(declining.id, reason.trim() || undefined)
      showSuccess("Booking declined")
      setDeclining(null)
      refresh()
    } catch (err) {
      showError(err)
    } finally {
      setBusy(false)
    }
  }

  const reschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moving) return
    setError(null)
    setBusy(true)
    try {
      await rescheduleMyAppointment(moving.id, moveTo.date, moveTo.time)
      showSuccess("Booking moved")
      setMoving(null)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't move it. Try another time.")
    } finally {
      setBusy(false)
    }
  }

  const next = summary?.nextAppointment
  const stats = [
    { label: "Today", value: summary ? String(summary.upcomingToday) : null, sub: "Bookings still to come" },
    { label: "This week", value: summary ? String(summary.completedThisWeek) : null, sub: "Appointments done" },
    {
      label: "Next",
      value: summary ? (next ? formatTimeDisplay(next.bookingTime) : "None") : null,
      sub: next ? `${formatDateShort(next.bookingDate)} · ${next.customerName} · ${next.serviceName}` : "Nothing booked yet",
    },
  ]

  return (
    <>
      <h1 className="sp-h1">Appointments</h1>
      <p className="sp-lede">Customers who booked you. Accept new ones, move them, or decline if you can&apos;t make it.</p>
      <button type="button" className="sp-btn" style={{ marginTop: "1rem" }} onClick={() => setAdding(true)}>
        New appointment
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
        {stats.map((s) => (
          <div key={s.label} className="sp-slip">
            <p className="sp-slip-sub">{s.label}</p>
            {s.value === null ? (
              <span className="sp-skel" style={{ width: "4rem", height: 28, marginTop: 6 }} aria-label="Loading" />
            ) : (
              <p className="sp-slip-dates" style={{ fontSize: "1.75rem" }}>
                {s.value}
              </p>
            )}
            <p className="sp-slip-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="sp-segment" role="group" aria-label="Show" style={{ marginTop: "1.5rem" }}>
        <button type="button" aria-pressed={upcoming} onClick={() => setUpcoming(true)}>
          Upcoming
        </button>
        <button type="button" aria-pressed={!upcoming} onClick={() => setUpcoming(false)}>
          Past
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {!pages.loaded && <span className="sp-skel" style={{ width: "60%", height: 22 }} aria-label="Loading" />}
        {pages.loaded && pages.items.length === 0 && (
          <p className="sp-empty sp-empty-plain">
            {upcoming ? "No bookings coming up. New ones appear here for you to accept." : "No past bookings yet."}
          </p>
        )}
        {pages.items.length > 0 && (
          <ul className="sp-slips">
            {pages.items.map((b) => {
              const st = STATUS[b.status] ?? { label: b.status, className: "sp-slip-sub" }
              return (
                <li key={b.id} className={`sp-slip ${b.status === "PENDING" ? "sp-slip-pending" : ""} ${b.status === "CANCELLED" ? "sp-slip-cancelled" : ""}`}>
                  <div className="sp-slip-head">
                    <div>
                      <p className="sp-slip-dates">{when(b)}</p>
                      <p className="sp-slip-sub">
                        {b.serviceName}
                        {b.durationMinutes ? ` · ${b.durationMinutes} min` : ""}
                      </p>
                    </div>
                    <span className={st.className}>{st.label}</span>
                  </div>
                  <p style={{ marginTop: "0.5rem" }}>
                    {b.customerName}
                    {b.customerPhone && (
                      <>
                        {" · "}
                        <a href={`tel:${b.customerPhone}`} className="sp-ref">
                          {b.customerPhone}
                        </a>
                      </>
                    )}
                  </p>
                  {b.notes && <p className="sp-note">{b.notes}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                  {isOpen(b) && (
                    <>
                      {b.status === "PENDING" && (
                        <button type="button" className="sp-btn" onClick={() => accept(b)}>
                          Accept
                        </button>
                      )}
                      <button
                        type="button"
                        className="sp-textbtn"
                        onClick={() => {
                          setError(null)
                          setMoveTo({ date: b.bookingDate, time: b.bookingTime.slice(0, 5) })
                          setMoving(b)
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="sp-textbtn"
                        onClick={() => {
                          setReason("")
                          setDeclining(b)
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}
                    <button
                      type="button"
                      className="sp-textbtn"
                      onClick={() =>
                        setCopying({
                          serviceId: b.serviceId,
                          time: b.bookingTime,
                          customerName: b.customerName,
                          customerPhone: b.customerPhone,
                          customerEmail: b.customerEmail,
                          notes: b.notes?.split("\n").filter((l) => !l.startsWith("Declined by")).join("\n") || null,
                        })
                      }
                    >
                      Copy
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        {pages.hasMore && (
          <button type="button" className="sp-more" onClick={pages.loadMore} disabled={pages.loading}>
            {pages.loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>

      <Dialog open={moving !== null} onOpenChange={(v) => !v && setMoving(null)}>
        <DialogContent className={`sp-dialog ${staffFonts}`}>
          <DialogHeader>
            <DialogTitle>Move {moving?.customerName}&apos;s booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={reschedule} className="sp-form">
            <p className="sp-lede" style={{ margin: 0 }}>
              {moving?.serviceName}, now {moving && when(moving)}. Let the customer know the new time.
            </p>
            <div className="sp-row-2">
              <div className="sp-field">
                <label htmlFor="move-date">Date</label>
                <input
                  id="move-date"
                  className="sp-input"
                  type="date"
                  min={today()}
                  onClick={openPicker}
                  value={moveTo.date}
                  onChange={(e) => setMoveTo({ ...moveTo, date: e.target.value })}
                  required
                />
              </div>
              <div className="sp-field">
                <label htmlFor="move-time">Time</label>
                <input
                  id="move-time"
                  className="sp-input"
                  type="time"
                  onClick={openPicker}
                  value={moveTo.time}
                  onChange={(e) => setMoveTo({ ...moveTo, time: e.target.value })}
                  required
                />
              </div>
            </div>
            {error && (
              <p className="sp-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="sp-btn" disabled={busy}>
              {busy ? "Moving…" : "Move booking"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={declining !== null} onOpenChange={(v) => !v && setDeclining(null)}>
        <DialogContent className={`sp-dialog ${staffFonts}`}>
          <DialogHeader>
            <DialogTitle>Decline {declining?.customerName}&apos;s booking?</DialogTitle>
          </DialogHeader>
          <form onSubmit={decline} className="sp-form">
            <p className="sp-lede" style={{ margin: 0 }}>
              {declining?.serviceName}, {declining && when(declining)}. It&apos;s cancelled; let the customer know.
            </p>
            <div className="sp-field">
              <label htmlFor="decline-reason">Reason (optional)</label>
              <textarea
                id="decline-reason"
                className="sp-input"
                placeholder="e.g. I'm fully booked then"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <button type="submit" className="sp-btn" disabled={busy}>
              {busy ? "Declining…" : "Decline booking"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <NewAppointmentDialog
        open={adding || copying !== null}
        initial={copying}
        onClose={() => {
          setAdding(false)
          setCopying(null)
        }}
        onDone={() => {
          setAdding(false)
          setCopying(null)
          setUpcoming(true)
          refresh()
        }}
      />
      {confirmDialog}
    </>
  )
}
