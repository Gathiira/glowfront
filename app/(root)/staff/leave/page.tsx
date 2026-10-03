"use client"

import { useEffect, useState } from "react"
import type { LeaveDto } from "@/lib/types"
import { cancelLeave, fetchMyLeave, leaveWhen, requestLeave } from "@/lib/api/leave"
import { today } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useConfirm } from "@/components/ui/use-confirm"
import { useFreshStamps } from "../_lib/fresh-stamps"
import { staffFonts } from "../_lib/fonts"

const emptyForm = () => ({
  startDate: today(),
  endDate: today(),
  partDay: false,
  startTime: "09:00",
  endTime: "13:00",
  reason: "",
})

function Stamp({ leave, fresh }: { leave: LeaveDto; fresh: boolean }) {
  const land = fresh ? " sp-stamp-land" : ""
  switch (leave.status) {
    case "APPROVED":
      return <span className={`sp-stamp sp-stamp-blue${land}`}>Approved</span>
    case "REJECTED":
      return <span className={`sp-stamp${land}`}>Not approved</span>
    case "CANCELLED":
      return <span className="sp-slip-sub">Cancelled</span>
    default:
      return <span className="sp-pending-mark">Waiting for approval</span>
  }
}

/** Open the browser's own date/time picker when the field is tapped, not only from its small icon. */
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker()
  } catch {
    // showPicker unsupported or blocked: the browser's default behaviour still applies
  }
}

export default function MyLeave() {
  const [leave, setLeave] = useState<LeaveDto[] | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<LeaveDto | null>(null)
  const [confirm, confirmDialog] = useConfirm()
  const fresh = useFreshStamps(
    (leave ?? []).filter((l) => l.status === "APPROVED" || l.status === "REJECTED").map((l) => `leave:${l.id}:${l.status}`)
  )

  const load = () =>
    fetchMyLeave()
      .then(setLeave)
      .catch((e) => {
        setLeave([])
        showError(e)
      })

  useEffect(() => {
    load()
  }, [])

  const timesInvalid = form.partDay && form.endTime <= form.startTime

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (timesInvalid) {
      setError("The end time must be after the start time.")
      return
    }
    setError(null)
    const body = {
      startDate: form.startDate,
      endDate: form.partDay ? form.startDate : form.endDate,
      startTime: form.partDay ? form.startTime : undefined,
      endTime: form.partDay ? form.endTime : undefined,
      reason: form.reason.trim() || undefined,
    }
    const ok = await confirm({
      title: "Send leave request?",
      description: `${leaveWhen({
        startDate: body.startDate,
        endDate: body.endDate,
        startTime: body.startTime ?? null,
        endTime: body.endTime ?? null,
      })}. Your manager will approve or reject it.`,
      confirmLabel: "Send request",
      className: `sp-dialog ${staffFonts}`,
      actionClassName: "sp-dialog-neutral",
    })
    if (!ok) return
    setSaving(true)
    try {
      await requestLeave(body)
      showSuccess("Sent to your manager for approval")
      setForm(emptyForm())
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the request. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const cancel = async (l: LeaveDto) => {
    try {
      await cancelLeave(l.id)
      showSuccess("Leave cancelled")
      load()
    } catch (err) {
      showError(err)
    } finally {
      setConfirming(null)
    }
  }

  return (
    <>
      <h1 className="sp-h1">Leave</h1>
      <p className="sp-lede">Ask for a day off or a few hours. Once your manager approves it, customers can't book you then.</p>

      <div className="sp-pay-grid" style={{ marginTop: "1.25rem" }}>
        <form onSubmit={submit} className="sp-slip sp-slip-torn sp-form" aria-labelledby="request-heading">
          <h2 id="request-heading" className="sp-h2" style={{ margin: 0 }}>
            Request leave
          </h2>

          <div className="sp-segment" role="group" aria-label="How long">
            <button type="button" aria-pressed={!form.partDay} onClick={() => setForm({ ...form, partDay: false })}>
              Whole days
            </button>
            <button type="button" aria-pressed={form.partDay} onClick={() => setForm({ ...form, partDay: true })}>
              Part of a day
            </button>
          </div>

          {form.partDay ? (
            <>
              <div className="sp-field">
                <label htmlFor="leave-date">Date</label>
                <input
                  id="leave-date"
                  className="sp-input"
                  type="date"
                  onClick={openPicker}
                  min={today()}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="sp-row-2">
                <div className="sp-field">
                  <label htmlFor="leave-from">From</label>
                  <input
                    id="leave-from"
                    className="sp-input"
                    type="time"
                      onClick={openPicker}
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="sp-field">
                  <label htmlFor="leave-to">Until</label>
                  <input
                    id="leave-to"
                    className="sp-input"
                    type="time"
                      onClick={openPicker}
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    aria-invalid={timesInvalid || undefined}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="sp-row-2">
              <div className="sp-field">
                <label htmlFor="leave-start">First day</label>
                <input
                  id="leave-start"
                  className="sp-input"
                  type="date"
                  onClick={openPicker}
                  min={today()}
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startDate: e.target.value,
                      endDate: e.target.value > form.endDate ? e.target.value : form.endDate,
                    })
                  }
                  required
                />
              </div>
              <div className="sp-field">
                <label htmlFor="leave-end">Last day</label>
                <input
                  id="leave-end"
                  className="sp-input"
                  type="date"
                  onClick={openPicker}
                  min={form.startDate}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="sp-field">
            <label htmlFor="leave-reason">Reason (optional)</label>
            <textarea
              id="leave-reason"
              className="sp-input"
              placeholder="e.g. Family event"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          {error && (
            <p className="sp-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="sp-btn" disabled={saving}>
            {saving ? "Sending…" : "Request leave"}
          </button>
        </form>

        <section aria-labelledby="slips-heading" className="sp-align-slip">
          <h2 id="slips-heading" className="sp-h2">
            Your requests
          </h2>
          {leave === null && (
            <ul className="sp-slips" aria-hidden>
              {[0, 1].map((i) => (
                <li key={i} className="sp-slip">
                  <span className="sp-skel" style={{ width: "50%", height: 22 }} />
                  <span className="sp-skel" style={{ width: "30%", marginTop: 10 }} />
                </li>
              ))}
            </ul>
          )}
          {leave?.length === 0 && (
            <p className="sp-empty sp-empty-plain">
              No leave yet. Requests you send appear here as slips, and get stamped when your manager decides.
            </p>
          )}
          {leave && leave.length > 0 && (
            <ul className="sp-slips" style={{ gridTemplateColumns: "1fr" }}>
              {leave.map((l) => {
                const canCancel = l.status === "PENDING" || (l.status === "APPROVED" && l.startDate > today())
                return (
                  <li
                    key={l.id}
                    className={`sp-slip ${l.status === "PENDING" ? "sp-slip-pending" : ""} ${
                      l.status === "CANCELLED" ? "sp-slip-cancelled" : ""
                    }`}
                  >
                    <div className="sp-slip-head">
                      <div>
                        <p className="sp-slip-dates">{leaveWhen(l).split(" · ")[0]}</p>
                        <p className="sp-slip-sub">{leaveWhen(l).split(" · ")[1]}</p>
                      </div>
                      <Stamp leave={l} fresh={fresh.has(`leave:${l.id}:${l.status}`)} />
                    </div>
                    {l.reason && <p style={{ marginTop: "0.5rem" }}>{l.reason}</p>}
                    {l.decisionNote && <p className="sp-note">“{l.decisionNote}”</p>}
                    {canCancel && (
                      <button type="button" className="sp-textbtn" style={{ marginTop: "0.25rem" }} onClick={() => setConfirming(l)}>
                        Cancel request
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <AlertDialog open={confirming !== null} onOpenChange={(open) => !open && setConfirming(null)}>
        <AlertDialogContent className={`sp-dialog ${staffFonts}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this leave?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirming && leaveWhen(confirming)}.{" "}
              {confirming?.status === "APPROVED"
                ? "Customers will be able to book you for this time again."
                : "Your manager won't see this request any more."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirming && cancel(confirming)}>Cancel leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {confirmDialog}
    </>
  )
}
