"use client"

import { useState } from "react"
import Link from "next/link"
import type { ClaimSaleDto } from "@/lib/types"
import { claimTask, fetchMyClaims, unclaimTask } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"
import { useConfirm } from "@/components/ui/use-confirm"
import { showError, showSuccess } from "@/lib/toast"
import { staffFonts } from "../_lib/fonts"

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}

export default function Claim() {
  const pages = usePagedList(fetchMyClaims, [])
  const [busy, setBusy] = useState<string | null>(null)
  const [confirm, confirmDialog] = useConfirm()
  const dialog = { className: `sp-dialog ${staffFonts}`, actionClassName: "sp-dialog-neutral" }

  const claim = async (
    sale: ClaimSaleDto,
    item: ClaimSaleDto["items"][number],
    taskId: number,
    taskName: string,
    inScope: boolean
  ) => {
    const what = `${item.serviceName}${sale.customerName ? ` for ${sale.customerName}` : ""}, ${when(sale.transactionDate)}.`
    const ok = await confirm(
      inScope
        ? {
            title: `Claim ${taskName}?`,
            description: `${what} Only claim what you did. Your commission shows on Pay.`,
            confirmLabel: "Claim",
            ...dialog,
          }
        : {
            title: `${taskName} isn't in your scope`,
            description: `${what} This task isn't set up for you, so it pays the standard rate and your manager will see it was claimed outside your scope. Claiming work you didn't do may lead to disciplinary action. Are you sure you did it?`,
            confirmLabel: "Yes, I did it",
            destructive: true,
            className: dialog.className,
          }
    )
    if (!ok) return
    setBusy(`${item.itemId}:${taskId}`)
    try {
      await claimTask(item.itemId, taskId)
      showSuccess(`${taskName} claimed`)
      pages.reload()
    } catch (err) {
      showError(err)
      pages.reload() // someone may have claimed it first
    } finally {
      setBusy(null)
    }
  }

  const undo = async (lineId: number, taskName: string) => {
    const ok = await confirm({
      title: `Undo your ${taskName} claim?`,
      description: "It goes back to open so whoever did it can claim it.",
      confirmLabel: "Undo claim",
      ...dialog,
    })
    if (!ok) return
    setBusy(`line:${lineId}`)
    try {
      await unclaimTask(lineId)
      showSuccess("Claim undone")
      pages.reload()
    } catch (err) {
      showError(err)
    } finally {
      setBusy(null)
    }
  }

  const sales = pages.loaded ? pages.items : null

  return (
    <>
      <h1 className="sp-h1">Claim</h1>
      <p className="sp-lede">
        Claim the tasks you did on sales from the last 7 days. Each task can be claimed once, so you&apos;ll also see who
        claimed the others. Tasks marked &ldquo;not yours&rdquo; aren&apos;t set up for you: they pay the standard
        rate and your manager is told.
      </p>

      <div style={{ marginTop: "1.25rem", maxWidth: 640 }}>
        {sales === null && (
          <ul className="sp-slips" style={{ gridTemplateColumns: "1fr" }} aria-hidden>
            {[0, 1].map((i) => (
              <li key={i} className="sp-slip">
                <span className="sp-skel" style={{ width: "40%" }} />
                <span className="sp-skel" style={{ width: "70%", marginTop: 10 }} />
              </li>
            ))}
          </ul>
        )}
        {sales?.length === 0 && (
          <p className="sp-empty sp-empty-plain">
            Nothing to claim right now. After a sale, the tasks you can do show up here.{" "}
            <Link href="/staff/sale" style={{ textDecoration: "underline" }}>
              Ring up a sale
            </Link>
          </p>
        )}
        {sales && sales.length > 0 && (
          <ul className="sp-slips" style={{ gridTemplateColumns: "1fr" }}>
            {sales.map((sale) => (
              <li key={sale.transactionId} className="sp-slip">
                <p className="sp-slip-sub">
                  {when(sale.transactionDate)}
                  {sale.customerName ? ` · ${sale.customerName}` : ""}
                </p>
                {sale.items.map((item) => (
                  <div key={item.itemId} style={{ marginTop: "0.5rem" }}>
                    <p className="sp-slip-dates" style={{ fontSize: "1.25rem" }}>
                      {item.serviceName}
                    </p>
                    <div className="sp-chips sp-chips-wrap" style={{ marginTop: "0.4rem" }}>
                      {item.tasks.map((t) =>
                        t.claimedBy ? (
                          <span key={`theirs-${t.taskId}`} className="sp-claimed-by">
                            {t.taskName} · {t.claimedBy}
                          </span>
                        ) : t.lineId ? (
                          <button
                            key={`line-${t.lineId}`}
                            type="button"
                            aria-pressed
                            disabled={t.paid || busy !== null}
                            onClick={() => undo(t.lineId as number, t.taskName)}
                            title={t.paid ? "Paid" : "Claimed by you. Tap to undo"}
                          >
                            ✓ {t.taskName}
                            {t.inScope ? "" : " · out of scope"}
                            {t.paid ? " · paid" : ""}
                          </button>
                        ) : (
                          <button
                            key={`open-${t.taskId}`}
                            type="button"
                            aria-pressed={false}
                            className={t.inScope ? undefined : "sp-out-of-scope"}
                            disabled={busy !== null}
                            onClick={() => claim(sale, item, t.taskId as number, t.taskName, t.inScope)}
                          >
                            {busy === `${item.itemId}:${t.taskId}`
                              ? "Claiming…"
                              : `Claim ${t.taskName}${t.inScope ? "" : " (not yours)"}`}
                          </button>
                        )
                      )}
                    </div>
                    {item.tasks.some((t) => t.claimedBy) && (
                      <p className="sp-slip-sub" style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                        Claimed by someone else but it was you? Tell your manager so they can correct it.
                      </p>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
        {pages.hasMore && (
          <button type="button" className="sp-more" onClick={pages.loadMore} disabled={pages.loading}>
            {pages.loading ? "Loading…" : "Load older sales"}
          </button>
        )}
      </div>
      {confirmDialog}
    </>
  )
}
