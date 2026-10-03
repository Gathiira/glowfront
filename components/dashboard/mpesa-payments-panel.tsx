"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useConfirm } from "@/components/ui/use-confirm"
import { LoadMore } from "@/components/ui/load-more"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCY, type MpesaPaymentDto, type MySaleDto, type UnclaimedMpesaDto } from "@/lib/types"
import { fetchMpesaPayments, money, mpesaApi, unclaimMpesaPayment } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"
import { showError, showSuccess } from "@/lib/toast"

type Props = { staffMode?: boolean; className?: string }

const time = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

type Status = "ALL" | "CLAIMED" | "UNCLAIMED"

/**
 * M-Pesa payments, searchable by name or code. Staff see the unclaimed ones and attach them to M-Pesa sales awaiting
 * payment; managers see every payment (filter by status, paged) and can also unclaim one from its sale.
 */
export function MpesaPaymentsPanel({ staffMode = false, className }: Props) {
  const mpesa = mpesaApi(staffMode)
  const [data, setData] = useState<UnclaimedMpesaDto | null>(null)
  const [awaiting, setAwaiting] = useState<MySaleDto[]>([])
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("") // search, settled after typing pauses
  const [status, setStatus] = useState<Status>("ALL")
  const [attaching, setAttaching] = useState<MpesaPaymentDto | null>(null)
  const [saleId, setSaleId] = useState<number | null>(null)
  const [confirm, confirmDialog] = useConfirm()

  // Managers: every payment, paged. Staff: the unclaimed ones (last 7 days).
  const pages = usePagedList(
    (current) =>
      staffMode
        ? Promise.resolve({ current: 1, size: 0, totalElements: 0, totalPages: 0, list: [] as MpesaPaymentDto[] })
        : fetchMpesaPayments(query, status, current),
    [query, status, staffMode]
  )

  const load = () => {
    mpesa.awaiting().then(setAwaiting).catch(showError)
    if (staffMode) {
      mpesa.unclaimed(query || undefined, 7).then(setData).catch(showError)
    } else {
      pages.reload()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 250)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    mpesa.awaiting().then(setAwaiting).catch(showError)
    if (staffMode) mpesa.unclaimed(query || undefined, 7).then(setData).catch(showError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const rows: MpesaPaymentDto[] | null = staffMode ? (data?.payments ?? null) : pages.loaded ? pages.items : null

  // Check a code with Safaricom when a payment hasn't come through on its own.
  const [code, setCode] = useState("")
  type Check = { transId: string; state: "checking" | "found" | "missing"; text: string }
  const [checking, setChecking] = useState<Check | null>(null)

  const found = (transId: string, p: MpesaPaymentDto | null | undefined, text: string) => {
    setChecking({
      transId,
      state: "found",
      text: p ? `${text} · ${CURRENCY} ${money(p.amount)} from ${p.payerName ?? "the customer"}` : text,
    })
    showSuccess(`${transId} found`)
    setCode("")
    setSearch(transId) // show it in the list, ready to attach
    load()
  }

  const checkCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (!c) return
    try {
      const lookup = await mpesa.lookup(c)
      if (lookup.status === "FOUND") return found(c, lookup.payment, lookup.message ?? "Already received")
      setChecking({ transId: c, state: "checking", text: "Asking M-Pesa…" })
      // Safaricom answers a few seconds later and the payment lands in the list; look for it for up to a minute.
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000))
        const hit = (await mpesa.unclaimed(c, 7)).payments.find((p) => p.transId === c)
        if (hit) return found(c, hit, "Found")
      }
      setChecking({
        transId: c,
        state: "missing",
        text: "M-Pesa didn't confirm a completed payment to this till. Check the code with the customer.",
      })
    } catch (err) {
      setChecking(null)
      showError(err)
    }
  }

  const unclaim = async (p: MpesaPaymentDto) => {
    const ok = await confirm({
      title: `Unclaim ${p.transId}?`,
      description: `${CURRENCY} ${money(p.amount)} from ${p.payerName ?? "the customer"} is taken off ${
        p.saleSummary ?? "its sale"
      }. That sale goes back to awaiting payment, and this payment can be attached to the right sale.`,
      confirmLabel: "Unclaim",
      destructive: true,
    })
    if (!ok) return
    try {
      await unclaimMpesaPayment(p.id)
      showSuccess(`${p.transId} unclaimed`)
      load()
    } catch (err) {
      showError(err)
    }
  }

  // Matching amounts first, then newest.
  const candidates = attaching
    ? [...awaiting].sort(
        (a, b) => Number(Number(b.grandTotal) === Number(attaching.amount)) - Number(Number(a.grandTotal) === Number(attaching.amount))
      )
    : []

  const attach = async () => {
    const sale = awaiting.find((s) => s.id === saleId)
    if (!attaching || !sale) return
    const ok = await confirm({
      title: `Attach ${attaching.transId} to this sale?`,
      description: `${CURRENCY} ${money(attaching.amount)} from ${attaching.payerName ?? "the customer"} → ${sale.services.join(", ")}${
        sale.customerName ? ` for ${sale.customerName}` : ""
      }, ${time(sale.transactionDate)}. The payment can't be used for anything else after this.`,
      confirmLabel: "Attach payment",
    })
    if (!ok) return
    try {
      await mpesa.attach(attaching.id, sale.id)
      showSuccess(`${attaching.transId} attached`)
      setAttaching(null)
      load()
    } catch (err) {
      showError(err)
      load()
    }
  }

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="min-w-48 flex-1"
          placeholder="Search by name or M-Pesa code"
          aria-label="Search M-Pesa payments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!staffMode && (
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger className="w-36" aria-label="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="UNCLAIMED">Unclaimed</SelectItem>
              <SelectItem value="CLAIMED">Claimed</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="outline" onClick={() => load()}>
          Refresh
        </Button>
      </div>
      <form onSubmit={checkCode} className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-3">
        <label htmlFor="mpesa-check-code" className="w-full text-sm text-muted-foreground">
          Payment not showing? Check the customer&apos;s M-Pesa code with Safaricom.
        </label>
        <Input
          id="mpesa-check-code"
          className="min-w-40 flex-1 uppercase"
          placeholder="e.g. QK12AB34CD"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" variant="outline" disabled={!code.trim() || checking?.state === "checking"}>
          {checking?.state === "checking" ? "Checking…" : "Check code"}
        </Button>
        {checking && (
          <p
            role="status"
            className={`w-full text-sm ${
              checking.state === "found"
                ? "text-green-600"
                : checking.state === "checking"
                  ? "text-muted-foreground"
                  : "text-destructive"
            }`}
          >
            {checking.transId}: {checking.text}
          </p>
        )}
      </form>

      {awaiting.length > 0 && (
        <p className="text-sm">
          <span className="font-medium">{awaiting.length}</span> M-Pesa sale{awaiting.length === 1 ? " is" : "s are"} waiting for
          their payment.
        </p>
      )}

      {rows === null && <p className="text-sm text-muted-foreground">Loading...</p>}
      {rows?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {search.trim()
            ? "No payment matches that search."
            : staffMode
              ? "No unclaimed M-Pesa payments in the last 7 days."
              : "No M-Pesa payments yet."}
        </p>
      )}
      <ul className="space-y-2">
        {rows?.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
            <div className="min-w-0">
              <p className="font-medium">
                {CURRENCY} {money(p.amount)} · {p.payerName ?? "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground">
                {p.transId} · {time(p.paidAt)}
                {p.billRef ? ` · Acc ${p.billRef}` : ""}
                {p.tillName ? ` · ${p.tillName}` : ""}
              </p>
              {!staffMode &&
                (p.transactionId ? (
                  <p className="mt-1 text-xs">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Claimed
                    </span>{" "}
                    {p.saleSummary}
                  </p>
                ) : (
                  <p className="mt-1 text-xs">
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Unclaimed
                    </span>
                  </p>
                ))}
            </div>
            {p.transactionId ? (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => unclaim(p)}>
                Unclaim
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={awaiting.length === 0}
                onClick={() => {
                  setSaleId(null)
                  setAttaching(p)
                }}
                title={awaiting.length === 0 ? "No M-Pesa sale is waiting for a payment" : undefined}
              >
                Attach to sale
              </Button>
            )}
          </li>
        ))}
      </ul>
      {!staffMode && (
        <LoadMore
          hasMore={pages.hasMore}
          loading={pages.loading}
          onLoadMore={pages.loadMore}
          summary={`Showing ${pages.items.length} of ${pages.total}`}
        />
      )}

      <Dialog open={attaching !== null} onOpenChange={(v) => !v && setAttaching(null)}>
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle>
              Which sale is {attaching?.transId} ({CURRENCY} {money(attaching?.amount)}) for?
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[50dvh] space-y-1.5 overflow-y-auto" role="radiogroup" aria-label="M-Pesa sales awaiting payment">
            {candidates.map((s) => {
              const matches = attaching != null && Number(s.grandTotal) === Number(attaching.amount)
              return (
                <label
                  key={s.id}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                    matches ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  } ${saleId === s.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <input type="radio" name="awaiting-sale" disabled={!matches} checked={saleId === s.id} onChange={() => setSaleId(s.id)} />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{s.services.join(", ")}</span>
                    <span className="block text-xs text-muted-foreground">
                      {time(s.transactionDate)}
                      {s.customerName ? ` · ${s.customerName}` : ""}
                    </span>
                  </span>
                  <span className={`shrink-0 font-medium ${matches ? "text-green-600" : ""}`}>
                    {CURRENCY} {money(s.grandTotal)}
                  </span>
                </label>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">Only a sale with the same amount can take this payment.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttaching(null)}>
              Cancel
            </Button>
            <Button onClick={attach} disabled={saleId === null}>
              Attach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  )
}
