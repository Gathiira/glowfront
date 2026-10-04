"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { LoadMore } from "@/components/ui/load-more"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/components/ui/use-confirm"
import { CURRENCY, EXPENSE_LABEL, PAYMENT_LABEL, type CashMovementDto, type CashMovementSummaryDto } from "@/lib/types"
import {
  deleteCashMovement,
  fetchCashMovementSummary,
  fetchCashMovements,
  money,
  monthStart,
  today,
} from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"
import { showError, showSuccess } from "@/lib/toast"
import { ExpenseDialog } from "./_components/expense-dialog"

export default function CashMovement() {
  const [startDate, setStartDate] = useState(monthStart())
  const [endDate, setEndDate] = useState(today())
  const [summary, setSummary] = useState<CashMovementSummaryDto | null>(null)
  const [recording, setRecording] = useState(false)
  const [confirm, confirmDialog] = useConfirm()
  const { items, total, loading, loaded, hasMore, loadMore, reload } = usePagedList(
    (current) => fetchCashMovements({ startDate, endDate }, current),
    [startDate, endDate]
  )

  const loadSummary = () => {
    setSummary(null)
    fetchCashMovementSummary({ startDate, endDate }).then(setSummary).catch(showError)
  }

  useEffect(loadSummary, [startDate, endDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    reload()
    loadSummary()
  }

  const remove = async (m: CashMovementDto) => {
    const ok = await confirm({
      title: `Delete this ${m.type === "IN" ? "cash in" : "expense"}?`,
      description: `${m.category ? `${EXPENSE_LABEL[m.category]} · ` : ""}${CURRENCY} ${money(m.amount)} on ${m.movementDate?.slice(0, 10)}${
        m.description ? ` · ${m.description}` : ""
      }. Only delete entries recorded by mistake.`,
      confirmLabel: "Delete",
      destructive: true,
    })
    if (!ok) return
    try {
      await deleteCashMovement(m.id)
      showSuccess("Entry deleted")
      refresh()
    } catch (err) {
      showError(err)
    }
  }

  const figure = (value: number | undefined, className: string, sign = "") =>
    summary ? (
      <p className={`text-2xl font-bold ${className}`}>
        {sign}
        {CURRENCY} {money(value)}
      </p>
    ) : (
      <Skeleton className="h-8 w-32" />
    )

  return (
    <div>
      <PageHeader title="Cash Movement" description="Money in and out of the till for the selected period">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="From" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="To" />
        <Button onClick={() => setRecording(true)}>Record expense</Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total In</CardTitle>
          </CardHeader>
          <CardContent>{figure(summary?.totalIn, "text-green-600", "+")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Out</CardTitle>
          </CardHeader>
          <CardContent>{figure(summary?.totalOut, "text-red-600", "-")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>{figure(summary?.net, summary && summary.net < 0 ? "text-red-600" : "")}</CardContent>
        </Card>
      </div>

      <DataTable
        title="Movement History"
        loading={!loaded}
        data={items}
        emptyMessage="No cash movements in this period"
        keyExtractor={(m) => m.id}
        columns={[
          {
            key: "type",
            label: "Type",
            render: (m) => (
              <span className={m.type === "IN" ? "text-green-600" : "text-red-600"}>{m.type === "IN" ? "Cash In" : "Cash Out"}</span>
            ),
          },
          {
            key: "description",
            label: "Description",
            render: (m) => (
              <span className="inline-flex flex-wrap items-center gap-1.5">
                {m.category && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{EXPENSE_LABEL[m.category]}</span>
                )}
                {m.description ?? (m.category ? "" : "—")}
              </span>
            ),
          },
          {
            key: "method",
            label: "Method",
            render: (m) =>
              m.paymentMethod
                ? (PAYMENT_LABEL[m.paymentMethod as keyof typeof PAYMENT_LABEL] ?? m.paymentMethod.replace("_", " "))
                : "—",
          },
          { key: "date", label: "Date", render: (m) => m.movementDate?.slice(0, 16).replace("T", " ") },
          {
            key: "amount",
            label: "Amount",
            align: "right",
            render: (m) => (
              <span className={`font-medium ${m.type === "IN" ? "text-green-600" : "text-red-600"}`}>
                {m.type === "IN" ? "+" : "-"}
                {CURRENCY} {money(m.amount)}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            align: "right",
            // Entries from sales, payouts and advances follow those records; only hand-recorded ones can be removed.
            render: (m) =>
              m.transactionId || m.payoutId || m.advanceId ? null : (
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(m)} aria-label="Delete entry">
                  Delete
                </Button>
              ),
          },
        ]}
      />
      <LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadMore} summary={`Showing ${items.length} of ${total}`} />
      <ExpenseDialog open={recording} onClose={() => setRecording(false)} onSaved={refresh} />
      {confirmDialog}
    </div>
  )
}
