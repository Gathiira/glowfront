"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ServiceDto, TaskDto } from "@/lib/types"
import { createTask, updateTask } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

/** task null + open: add a task under a service. task set: edit its name, default % and on/off. */
type Props = { open: boolean; task: TaskDto | null; services: ServiceDto[]; onClose: () => void; onSaved: () => void }

export function TaskDialog({ open, task, services, onClose, onSaved }: Props) {
  const [name, setName] = useState("")
  const [percent, setPercent] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(task?.name ?? "")
    setPercent(task ? String(task.defaultPercent) : "")
    setServiceId("")
    setActive(task?.active ?? true)
  }, [open, task])

  const shared = task ? task.serviceIds.length : 0
  const valid = name.trim() !== "" && percent !== "" && Number(percent) >= 0 && Number(percent) <= 100 && (task || serviceId)

  const save = async () => {
    if (!valid) return
    setSaving(true)
    try {
      if (task) {
        await updateTask(task.id, { name: name.trim(), defaultPercent: Number(percent), active })
        showSuccess(`${name.trim()} saved`)
      } else {
        await createTask({ name: name.trim(), defaultPercent: Number(percent), serviceId: Number(serviceId) })
        showSuccess(`${name.trim()} added`)
      }
      onSaved()
      onClose()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? `Edit ${task.name}` : "New task"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="task-name">Name</Label>
            <Input id="task-name" placeholder="e.g. Wash" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-percent">Default commission %</Label>
            <Input
              id="task-percent"
              type="number"
              min={0}
              max={100}
              step="0.01"
              className="w-32"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Applies to future sales{shared > 1 ? ` on all ${shared} services it's part of` : ""}. Agreed staff rates
              override it; a service&apos;s task defaults can&apos;t add up to more than 100%.
            </p>
          </div>
          {task ? (
            <label className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
              <span>
                <span className="font-medium">Active</span>
                <span className="block text-xs text-muted-foreground">Turned off, it isn&apos;t offered at checkout.</span>
              </span>
              <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
            </label>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="task-service">Part of service</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger id="task-service" className="w-full">
                  <SelectValue placeholder="Pick a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Add it to more services from Catalog.</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !valid}>
              {saving ? "Saving..." : task ? "Save" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
