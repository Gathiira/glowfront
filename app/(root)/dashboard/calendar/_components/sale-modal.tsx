"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

type Props = {
  open: boolean
  form: { client: string; service: string }
  onFormChange: (form: Props["form"]) => void
  onSave: () => void
  onClose: () => void
}

export function SaleModal({ open, form, onFormChange, onSave, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
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

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Record Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
