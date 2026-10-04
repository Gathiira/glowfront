"use client"

import { useState } from "react"
import type { AdvanceDto } from "@/lib/types"
import { cancelAdvance, fetchMyAdvances, money, requestAdvance } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"
import { showError, showSuccess } from "@/lib/toast"
import { useConfirm } from "@/components/ui/use-confirm"
import { staffFonts } from "../../_lib/fonts"

function day(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : ""
}

function Stamp({ a }: { a: AdvanceDto }) {
  switch (a.status) {
    case "APPROVED":
      return <span className="sp-stamp sp-stamp-blue">Paid</span>
    case "REJECTED":
      return <span className="sp-stamp">Not approved</span>
    case "CANCELLED":
      return <span className="sp-slip-sub">Cancelled</span>
    default:
      return <span className="sp-pending-mark">Waiting for approval</span>
  }
}

/** Ask for part of your pay early; once paid, it comes off your next payouts. */
export function Advances() {
  const pages = usePagedList(fetchMyAdvances, [])
  const advances = pages.loaded ? pages.items : null
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  const owed = (advances ?? []).reduce((sum, a) => sum + a.outstanding, 0)
  const dialog = { className: `sp-dialog ${staffFonts}`, actionClassName: "sp-dialog-neutral" }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!(value >= 1)) return
    const ok = await confirm({
      title: `Ask for KSH ${money(value)}?`,
      description: "Your manager decides. If it's paid, it comes off your next payouts until it's cleared.",
      confirmLabel: "Send request",
      ...dialog,
    })
    if (!ok) return
    setSaving(true)
    try {
      await requestAdvance(value, reason.trim() || undefined)
      showSuccess("Sent to your manager")
      setAmount("")
      setReason("")
      pages.reload()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  const cancel = async (a: AdvanceDto) => {
    const ok = await confirm({
      title: "Cancel this request?",
      description: `KSH ${money(a.amount)}, asked ${day(a.requestedAt)}.`,
      confirmLabel: "Cancel request",
      ...dialog,
    })
    if (!ok) return
    try {
      await cancelAdvance(a.id)
      showSuccess("Request cancelled")
      pages.reload()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <section aria-labelledby="advance-heading" style={{ marginTop: "2rem" }}>
      <h2 id="advance-heading" className="sp-h2">
        Advances
      </h2>
      <p className="sp-lede">
        Need some of your pay early? Ask here. Once it&apos;s paid, it comes off your next payouts.
        {owed > 0 && (
          <>
            {" "}
            Still to come off: <strong>KSH {money(owed)}</strong>.
          </>
        )}
      </p>

      <div className="sp-pay-grid" style={{ marginTop: "1rem" }}>
        <form onSubmit={submit} className="sp-slip sp-slip-torn sp-form" aria-label="Ask for an advance">
          <div className="sp-field">
            <label htmlFor="advance-amount">Amount (KSH)</label>
            <input
              id="advance-amount"
              className="sp-input"
              type="number"
              inputMode="numeric"
              min={1}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="sp-field">
            <label htmlFor="advance-reason">Reason (optional)</label>
            <textarea
              id="advance-reason"
              className="sp-input"
              placeholder="e.g. School fees"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <button type="submit" className="sp-btn" disabled={saving || !(Number(amount) >= 1)}>
            {saving ? "Sending…" : "Ask for advance"}
          </button>
        </form>

        <div className="sp-slip sp-slip-torn sp-requests">
          <div className="sp-scroll" tabIndex={0} aria-label="Your advances">
            {advances === null && <span className="sp-skel" style={{ width: "60%", height: 22 }} aria-label="Loading" />}
            {advances?.length === 0 && (
              <p className="sp-empty sp-empty-plain">No advances yet. Requests you send appear here.</p>
            )}
            {advances && advances.length > 0 && (
              <ul className="sp-slips" style={{ gridTemplateColumns: "1fr" }}>
                {advances.map((a) => (
                  <li
                    key={a.id}
                    className={`sp-slip ${a.status === "PENDING" ? "sp-slip-pending" : ""} ${
                      a.status === "CANCELLED" ? "sp-slip-cancelled" : ""
                    }`}
                  >
                    <div className="sp-slip-head">
                      <div>
                        <p className="sp-slip-dates">KSH {money(a.amount)}</p>
                        <p className="sp-slip-sub">
                          Asked {day(a.requestedAt)}
                          {a.status === "APPROVED" &&
                            (a.outstanding > 0 ? ` · KSH ${money(a.outstanding)} still to come off` : " · cleared")}
                        </p>
                      </div>
                      <Stamp a={a} />
                    </div>
                    {a.reason && <p style={{ marginTop: "0.5rem" }}>{a.reason}</p>}
                    {a.decisionNote && <p className="sp-note">“{a.decisionNote}”</p>}
                    {a.status === "PENDING" && (
                      <button type="button" className="sp-textbtn" style={{ marginTop: "0.25rem" }} onClick={() => cancel(a)}>
                        Cancel request
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {pages.hasMore && (
              <button type="button" className="sp-more" onClick={pages.loadMore} disabled={pages.loading}>
                {pages.loading ? "Loading…" : "Load older"}
              </button>
            )}
          </div>
        </div>
      </div>
      {confirmDialog}
    </section>
  )
}
