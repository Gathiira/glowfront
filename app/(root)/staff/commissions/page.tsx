"use client"

import { useState } from "react"
import type { CommissionLineDto, CommissionReportDto, PayoutDto } from "@/lib/types"
import { fetchMyCommissions, fetchMyPayout, fetchMyPayouts, money } from "@/lib/api/commissions"
import { useUser } from "@/lib/use-user"
import { usePagedList } from "@/lib/use-paged-list"
import { showError } from "@/lib/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFreshStamps } from "../_lib/fresh-stamps"
import { staffFonts } from "../_lib/fonts"

function day(iso: string | null | undefined) {
  if (!iso) return ""
  return new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })
}

function methodLabel(m: string) {
  return m === "MPESA" ? "M-Pesa" : m.charAt(0) + m.slice(1).toLowerCase().replace("_", " ")
}

export default function Pay() {
  const profile = useUser("customer_profile")
  const [all, setAll] = useState<CommissionReportDto | null>(null)
  // Totals come from the summary (whole history); lines and payouts load a page at a time.
  const lines = usePagedList(
    (current) =>
      fetchMyCommissions({}, current).then((r) => {
        setAll(r)
        return r.lines
      }),
    []
  )
  const payoutPages = usePagedList(fetchMyPayouts, [])
  const payouts = payoutPages.loaded ? payoutPages.items : null
  const fresh = useFreshStamps((payouts ?? []).map((p) => `payout:${p.id}:${p.status}`))
  // An opened envelope: the payout with the tasks it covered.
  const [opened, setOpened] = useState<PayoutDto | null>(null)
  const openEnvelope = (id: number) => fetchMyPayout(id).then(setOpened).catch(showError)

  // ponytail: unpaid lines are filtered from the loaded pages, so "Since" and the count cover what's loaded; a status=UNPAID filter on /staff/me/commissions fixes that if histories get long.
  const unpaid: CommissionLineDto[] = lines.items.filter((l) => l.payoutId === null)
  const oldest = unpaid.length ? unpaid[unpaid.length - 1].transactionDate : null

  return (
    <>
      <h1 className="sr-only">Pay</h1>
      <div className="sp-pay-grid">
        <section className="sp-envelope" aria-label="Unpaid commission">
          {/* the flap stands open above the envelope */}
          <svg className="sp-flap" viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden>
            <path d="M0 44L50 0L100 44Z" fill="var(--sp-kraft-fold)" />
          </svg>
          <div className="sp-envelope-face">
            <dl className="sp-fields">
              <dt>Name</dt>
              <dd>{profile ? `${profile.firstName} ${profile.lastName}` : " "}</dd>
              <dt>Since</dt>
              <dd>{all ? (oldest ? day(oldest) : "—") : " "}</dd>
            </dl>

            <div className="sp-total">
              <span className="sp-total-label">Unpaid</span>
              {all ? (
                <span className="sp-amount-xl">
                  <span className="sp-currency">KSH</span>
                  {money(all.summary.unpaid)}
                </span>
              ) : (
                <span className="sp-skel" style={{ width: "9rem", height: "2.75rem" }} aria-label="Loading" />
              )}
            </div>
            {all && unpaid.length > 0 && (
              <p className="sp-envelope-meta">
                {unpaid.length} task{unpaid.length === 1 ? "" : "s"} waiting to be paid
              </p>
            )}

            {!all && (
              <ul className="sp-tally" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <li key={i}>
                    <span className="sp-skel" style={{ width: `${70 - i * 12}%` }} />
                    <span className="sp-skel" style={{ width: "4rem" }} />
                  </li>
                ))}
              </ul>
            )}

            {all && unpaid.length === 0 && (
              <>
                <ul className="sp-tally sp-tally-blank" aria-hidden>
                  <li />
                  <li />
                  <li />
                </ul>
                <p className="sp-empty">Nothing owed yet — your tasks land here at checkout.</p>
              </>
            )}

            {unpaid.length > 0 && (
              <ul className="sp-tally">
                {unpaid.map((l) => (
                  <li key={l.id}>
                    <span className="sp-tally-what">
                      {l.serviceName} · {l.taskName}
                      <span className="sp-tally-sub">
                        {day(l.transactionDate)} ·{" "}
                        {l.rateSource === "STAFF" ? (
                          <span className="sp-agreed">{l.percentApplied}% agreed</span>
                        ) : (
                          `${l.percentApplied}%`
                        )}
                      </span>
                    </span>
                    <span className="sp-tally-amount">{money(l.commissionAmount)}</span>
                  </li>
                ))}
              </ul>
            )}
            {lines.hasMore && (
              <button type="button" className="sp-more" onClick={lines.loadMore} disabled={lines.loading}>
                {lines.loading ? "Loading…" : "Load older"}
              </button>
            )}
          </div>
        </section>

        <section aria-labelledby="sealed-heading">
          <h2 id="sealed-heading" className="sp-h2">
            Paid envelopes
          </h2>
          {payouts === null && (
            <ul className="sp-sealed" aria-hidden>
              {[0, 1].map((i) => (
                <li key={i}>
                  <span className="sp-skel" style={{ width: "60%" }} />
                </li>
              ))}
            </ul>
          )}
          {payouts?.length === 0 && (
            <div className="sp-sealed-placeholder">No envelopes paid yet. Each payout is sealed and kept here.</div>
          )}
          {payouts && payouts.length > 0 && (
            <ul className="sp-sealed">
              {payouts.map((p) => {
                const voided = p.status === "VOIDED"
                const land = fresh.has(`payout:${p.id}:${p.status}`) ? " sp-stamp-land" : ""
                return (
                  <li key={p.id} className={voided ? "sp-void" : undefined}>
                    <button
                      type="button"
                      className="sp-sealed-open"
                      onClick={() => openEnvelope(p.id)}
                      aria-label={`Open the ${day(p.paidAt)} payout of KSH ${money(p.totalAmount)}`}
                    />
                    <span className="sp-sealed-when">{day(p.paidAt)}</span>
                    <span className="sp-sealed-how">
                      {methodLabel(p.paymentMethod)}
                      {p.reference && (
                        <>
                          {" · "}
                          <span className="sp-ref">{p.reference}</span>
                        </>
                      )}
                    </span>
                    <span className={`sp-stamp${voided ? " sp-stamp-ink" : ""}${land}`}>{voided ? "Void" : "Paid"}</span>
                    <span className="sp-sealed-amount">
                      <span className="sp-currency">KSH</span>
                      <span className="sp-num">{money(p.totalAmount)}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          {payoutPages.hasMore && (
            <button type="button" className="sp-more" onClick={payoutPages.loadMore} disabled={payoutPages.loading}>
              {payoutPages.loading ? "Loading…" : "Load older envelopes"}
            </button>
          )}
        </section>
      </div>

      <Dialog open={opened !== null} onOpenChange={(v) => !v && setOpened(null)}>
        <DialogContent className={`sp-dialog ${staffFonts}`}>
          <DialogHeader>
            <DialogTitle>
              {opened
                ? `${opened.status === "VOIDED" ? "Voided" : "Paid"} ${day(opened.paidAt)} · KSH ${money(opened.totalAmount)}`
                : "Opening…"}
            </DialogTitle>
          </DialogHeader>
          {opened && (
            <>
              <p className="sp-slip-sub">
                {methodLabel(opened.paymentMethod)}
                {opened.reference ? ` · ${opened.reference}` : ""}
              </p>
              {opened.advanceDeducted > 0 && (
                <p className="sp-slip-sub">
                  Commission KSH {money(opened.commissionAmount)} − advance KSH {money(opened.advanceDeducted)} = paid KSH{" "}
                  {money(opened.totalAmount)}
                </p>
              )}
              {opened.status === "VOIDED" || !opened.lines?.length ? (
                <p className="sp-empty sp-empty-plain">This payout was voided, so its tasks are waiting to be paid again.</p>
              ) : (
                <ul className="sp-tally" style={{ marginTop: 0 }}>
                  {opened.lines.map((l) => (
                    <li key={l.id}>
                      <span className="sp-tally-what">
                        {l.serviceName} · {l.taskName}
                        <span className="sp-tally-sub">
                          {day(l.transactionDate)} · {l.percentApplied}%{l.rateSource === "STAFF" ? " agreed" : ""}
                        </span>
                      </span>
                      <span className="sp-tally-amount">{money(l.commissionAmount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
