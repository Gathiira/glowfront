"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

type Props = {
  modal: "appointment" | "block" | null
  editingId: string | null
  selectedDate: string | null
  selectedHour: number | null
  form: { client: string; service: string; phone: string; notes: string }
  onFormChange: (form: Props["form"]) => void
  onSave: () => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function AppointmentModal({
  modal,
  editingId,
  selectedDate,
  selectedHour,
  form,
  onFormChange,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const open = modal === "appointment" || modal === "block"

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingId
              ? "Edit Appointment"
              : modal === "block"
                ? "Block Time"
                : "New Appointment"}
          </DialogTitle>
          <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {selectedDate &&
            new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          {selectedHour !== null &&
            ` · ${selectedHour.toString().padStart(2, "0")}:00`}
        </p>

        <div className="space-y-3">
          {modal !== "block" && (
            <Input
              placeholder="Client name"
              value={form.client}
              onChange={(e) =>
                onFormChange({ ...form, client: e.target.value })
              }
            />
          )}
          <Input
            placeholder="Service"
            value={form.service}
            onChange={(e) => onFormChange({ ...form, service: e.target.value })}
          />
          {modal !== "block" && (
            <Input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
            />
          )}
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            rows={2}
          />
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          {editingId && (
            <Button variant="destructive" onClick={() => onDelete(editingId)}>
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {editingId ? "Update" : modal === "block" ? "Block" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
