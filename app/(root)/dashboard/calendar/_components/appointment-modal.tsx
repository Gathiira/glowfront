"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  if (modal !== "appointment" && modal !== "block") return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit Appointment" : modal === "block" ? "Block Time" : "New Appointment"}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {selectedDate &&
            new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          {selectedHour !== null && ` · ${selectedHour.toString().padStart(2, "0")}:00`}
        </p>
        <div className="space-y-3">
          {modal !== "block" && (
            <Input
              placeholder="Client name"
              value={form.client}
              onChange={(e) => onFormChange({ ...form, client: e.target.value })}
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
        <div className="flex justify-end gap-2 pt-4">
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
        </div>
      </div>
    </div>
  )
}
