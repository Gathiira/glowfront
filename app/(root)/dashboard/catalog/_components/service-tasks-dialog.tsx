"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ServiceDto, TaskDto } from "@/lib/types"
import { fetchServiceTasks, saveServiceTasks } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

type Props = { service: ServiceDto | null; tasks: TaskDto[]; onClose: () => void }

export function ServiceTasksDialog({ service, tasks, onClose }: Props) {
  const [selected, setSelected] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!service) return
    setSelected([])
    fetchServiceTasks(service.id)
      .then((ts) => setSelected(ts.map((t) => t.id)))
      .catch(showError)
  }, [service])

  const total = +tasks
    .filter((t) => t.active && selected.includes(t.id))
    .reduce((sum, t) => sum + t.defaultPercent, 0)
    .toFixed(2)

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const save = async () => {
    if (!service) return
    setSaving(true)
    try {
      await saveServiceTasks(service.id, selected)
      showSuccess("Service tasks saved")
      onClose()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={service !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tasks for {service?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">Add tasks first in the &quot;Tasks &amp; default commission&quot; card.</p>
          )}
          {tasks.map((t) => (
            <label key={t.id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
              <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} />
              <span className="flex-1">
                {t.name}
                {!t.active && <span className="text-muted-foreground"> (inactive)</span>}
              </span>
              <span className="text-sm text-muted-foreground">{t.defaultPercent}%</span>
            </label>
          ))}
          <p className={`text-sm ${total > 100 ? "text-destructive" : "text-muted-foreground"}`}>
            Default commission total: {total}% — must be 100% or less. The business keeps {Math.max(0, +(100 - total).toFixed(2))}%.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={saving || total > 100}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
