"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useConfirm } from "@/components/ui/use-confirm"
import {
  CURRENCY,
  EXPENSE_CATEGORIES,
  EXPENSE_LABEL,
  PAYMENT_LABEL,
  PAYMENT_METHODS,
  type ExpenseCategory,
  type PaymentMethod,
} from "@/lib/types"
import { money, recordExpense, today } from "@/lib/api/commissions"
import { showSuccess } from "@/lib/toast"

type Props = { open: boolean; onClose: () => void; onSaved: () => void }

const empty = () => ({
  category: "" as ExpenseCategory | "",
  amount: "",
  method: "MPESA" as PaymentMethod,
  date: today(),
  description: "",
})

export function ExpenseDialog({ open, onClose, onSaved }: Props) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    if (open) {
      setForm(empty())
      setError(null)
    }
  }, [open])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!form.category) return setError("Pick what the expense was for.")
    if (!(amount > 0)) return setError("Enter an amount more than 0.")
    if (form.date > today()) return setError("The date can't be in the future.")
    setError(null)
    const category = form.category
    const ok = await confirm({
      title: `Record ${CURRENCY} ${money(amount)} for ${EXPENSE_LABEL[category]}?`,
      description: `Paid by ${PAYMENT_LABEL[form.method]} on ${form.date}${form.description.trim() ? ` · ${form.description.trim()}` : ""}. It counts as cash out for that day.`,
      confirmLabel: "Record expense",
    })
    if (!ok) return
    setSaving(true)
    try {
      await recordExpense({
        amount,
        category,
        paymentMethod: form.method,
        description: form.description.trim() || undefined,
        // today: the exact time; an earlier day: midday, so it lands on that date
        movementDate: form.date === today() ? undefined : `${form.date}T12:00:00`,
      })
      showSuccess("Expense recorded")
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't record the expense. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ex-category">For</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ExpenseCategory })}>
                <SelectTrigger id="ex-category">
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {EXPENSE_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ex-amount">Amount ({CURRENCY})</Label>
              <Input
                id="ex-amount"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ex-method">Paid by</Label>
              <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v as PaymentMethod })}>
                <SelectTrigger id="ex-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {PAYMENT_LABEL[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ex-date">Date</Label>
              <Input
                id="ex-date"
                type="date"
                max={today()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ex-note">Note (optional)</Label>
            <Textarea
              id="ex-note"
              placeholder="e.g. Towels and shampoo from Kamau Supplies"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Record expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      {confirmDialog}
    </Dialog>
  )
}
