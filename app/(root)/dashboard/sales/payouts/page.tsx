"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CURRENCY, type PayoutDto } from "@/lib/types"
import { fetchPayout, fetchPayouts, money, voidPayout } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

export default function Payouts() {
  const [payouts, setPayouts] = useState<PayoutDto[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<PayoutDto | null>(null)

  const load = () =>
    fetchPayouts()
      .then(setPayouts)
      .catch(showError)
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const open = (id: number) => fetchPayout(id).then(setDetail).catch(showError)

  const doVoid = async (p: PayoutDto) => {
    if (!window.confirm(`Void this ${CURRENCY} ${money(p.totalAmount)} payout to ${p.staffName}? Its commissions become unpaid again.`)) return
    try {
      await voidPayout(p.id)
      showSuccess("Payout voided")
      setDetail(null)
      load()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div>
      <PageHeader title="Payouts" description="Commission payments made to the team" />
      <DataTable
        loading={loading}
        data={payouts}
        emptyMessage="No payouts yet"
        keyExtractor={(p) => p.id}
        columns={[
          { key: "date", label: "Date", render: (p) => p.paidAt.slice(0, 10) },
          { key: "staff", label: "Team member", render: (p) => p.staffName },
          { key: "method", label: "Method", render: (p) => p.paymentMethod },
          { key: "ref", label: "Reference", render: (p) => p.reference ?? "—" },
          {
            key: "status",
            label: "Status",
            render: (p) => (p.status === "VOIDED" ? <span className="text-muted-foreground line-through">Voided</span> : "Paid"),
          },
          { key: "amount", label: "Amount", align: "right", render: (p) => `${CURRENCY} ${money(p.totalAmount)}` },
          {
            key: "view",
            label: "",
            align: "right",
            render: (p) => (
              <Button variant="ghost" size="sm" onClick={() => open(p.id)}>
                View
              </Button>
            ),
          },
        ]}
      />

      <Dialog open={detail !== null} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {detail?.staffName} · {CURRENCY} {money(detail?.totalAmount)} · {detail?.status === "VOIDED" ? "Voided" : "Paid"}
            </DialogTitle>
          </DialogHeader>
          {detail?.notes && <p className="text-sm text-muted-foreground">{detail.notes}</p>}
          <div className="space-y-1 text-sm">
            {detail?.lines?.length === 0 && <p className="text-muted-foreground">Voided — its commissions are unpaid again.</p>}
            {detail?.lines?.map((l) => (
              <div key={l.id} className="flex justify-between">
                <span>
                  {l.transactionDate?.slice(0, 10)} · {l.serviceName} · {l.taskName}
                </span>
                <span>{money(l.commissionAmount)}</span>
              </div>
            ))}
          </div>
          {detail?.status === "PAID" && (
            <DialogFooter>
              <Button variant="destructive" onClick={() => doVoid(detail)}>
                Void payout
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
