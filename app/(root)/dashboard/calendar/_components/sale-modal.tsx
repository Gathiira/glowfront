"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  open: boolean
  form: { client: string; service: string }
  onFormChange: (form: Props["form"]) => void
  onSave: () => void
  onClose: () => void
}

export function SaleModal({ open, form, onFormChange, onSave, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Record Sale</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="space-y-3">
          <Input
            placeholder="Client name"
            value={form.client}
            onChange={(e) => onFormChange({ ...form, client: e.target.value })}
          />
          <Input
            placeholder="Service"
            value={form.service}
            onChange={(e) => onFormChange({ ...form, service: e.target.value })}
          />
          <Input placeholder="Amount" type="number" />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Record Payment</Button>
        </div>
      </div>
    </div>
  )
}
