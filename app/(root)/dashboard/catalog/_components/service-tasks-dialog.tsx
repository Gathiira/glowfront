"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useConfirm } from "@/components/ui/use-confirm"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ServiceDto, TaskDto } from "@/lib/types"
import { createTask, saveServiceTasks, updateTask } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

/** `tasks` is every task of the business; `onChange` reloads it after any save. */
type Props = { service: ServiceDto | null; tasks: TaskDto[]; onClose: () => void; onChange: () => void }

export function ServiceTasksDialog({ service, tasks, onClose, onChange }: Props) {
  const [selected, setSelected] = useState<number[]>([])
  const [name, setName] = useState("")
  const [percent, setPercent] = useState("")
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  // Start from what's saved each time the dialog opens for a service.
  useEffect(() => {
    if (!service) return
    setSelected(tasks.filter((t) => t.serviceIds.includes(service.id)).map((t) => t.id))
    setName("")
    setPercent("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service])

  if (!service) return null

  // This service's tasks first, then the rest of the business's tasks to pick from.
  const onService = tasks.filter((t) => selected.includes(t.id))
  const others = tasks.filter((t) => !selected.includes(t.id))
  const total = +onService
    .filter((t) => t.active)
    .reduce((sum, t) => sum + t.defaultPercent, 0)
    .toFixed(2)

  const toggle = (id: number) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const otherServices = (t: TaskDto) => t.serviceIds.filter((id) => id !== service.id).length

  const add = async () => {
    if (!name.trim() || percent === "") return
    setSaving(true)
    try {
      const task = await createTask({ name: name.trim(), defaultPercent: Number(percent), serviceId: service.id })
      setSelected((prev) => [...prev, task.id])
      setName("")
      setPercent("")
      showSuccess(`${task.name} added to ${service.name}`)
      onChange()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  const edit = async (task: TaskDto, changes: Partial<TaskDto>) => {
    const shared = otherServices(task)
    const everywhere = shared > 0 ? ` on this and ${shared} other service${shared === 1 ? "" : "s"}` : ""
    const ok = await confirm(
      changes.active !== undefined
        ? changes.active
          ? {
              title: `Turn ${task.name} back on?`,
              description: `It can be picked at checkout again${everywhere}.`,
              confirmLabel: "Turn on",
            }
          : {
              title: `Turn off ${task.name}?`,
              description: `It won't be offered at checkout${everywhere}. Past commissions stay as they are.`,
              confirmLabel: "Turn off",
              destructive: true,
            }
        : {
            title: `Change ${task.name} to ${changes.defaultPercent}%?`,
            description: `The default commission goes from ${task.defaultPercent}% to ${changes.defaultPercent}% for future sales${everywhere}. Agreed staff rates and past commissions don't change.`,
            confirmLabel: "Change default",
          }
    )
    if (!ok) return false
    try {
      await updateTask(task.id, { name: task.name, defaultPercent: task.defaultPercent, active: task.active, ...changes })
      onChange()
      return true
    } catch (err) {
      showError(err)
      return false
    }
  }

  const save = async () => {
    const ok = await confirm({
      title: `Save tasks for ${service.name}?`,
      description: onService.length
        ? `Checkout will ask who did: ${onService.map((t) => t.name).join(", ")} (${total}% default commission in total). Tasks taken off every service stop showing in rates and assignments until added back.`
        : "No tasks: selling this service won't pay any commission.",
      confirmLabel: "Save tasks",
    })
    if (!ok) return
    setSaving(true)
    try {
      await saveServiceTasks(service.id, selected)
      showSuccess("Service tasks saved")
      onChange()
      onClose()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tasks for {service.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          The parts of this service done by staff, like Shave or Wash, each with a default commission %. A task can be
          shared with other services; a team member&apos;s agreed rate overrides the default everywhere.
        </p>

        <div className="max-h-[55dvh] space-y-4 overflow-y-auto pr-1">
          <section className="space-y-2" aria-label="On this service">
            {onService.length === 0 && <p className="text-sm text-muted-foreground">No tasks on this service yet.</p>}
            {onService.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
                <input type="checkbox" checked onChange={() => toggle(t.id)} aria-label={`Take ${t.name} off ${service.name}`} />
                <span className="min-w-0 flex-1">
                  <span className={`font-medium ${t.active ? "" : "text-muted-foreground line-through"}`}>{t.name}</span>
                  {otherServices(t) > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      Also on {otherServices(t)} other service{otherServices(t) === 1 ? "" : "s"}
                    </span>
                  )}
                </span>
                <Input
                  key={`${t.id}-${t.defaultPercent}`}
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  className="w-20"
                  defaultValue={t.defaultPercent}
                  aria-label={`${t.name} default percent`}
                  onBlur={async (e) => {
                    const input = e.currentTarget
                    const value = Number(input.value)
                    if (value === t.defaultPercent) return
                    if (!(await edit(t, { defaultPercent: value }))) input.value = String(t.defaultPercent)
                  }}
                />
                <span className="text-sm text-muted-foreground">%</span>
                <Switch checked={t.active} onCheckedChange={(v) => edit(t, { active: v })} aria-label={`${t.name} active`} />
              </div>
            ))}
            <p className={`text-sm ${total > 100 ? "text-destructive" : "text-muted-foreground"}`}>
              Default commission total: {total}% — must be 100% or less. The business keeps{" "}
              {Math.max(0, +(100 - total).toFixed(2))}%.
            </p>
          </section>

          <section className="space-y-2" aria-labelledby="new-task-heading">
            <h3 id="new-task-heading" className="text-sm font-medium">
              New task
            </h3>
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Task name (e.g. Wash)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-w-40 flex-1"
                aria-label="New task name"
              />
              <Input
                type="number"
                placeholder="Default %"
                min={0}
                max={100}
                step="0.01"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                className="w-28"
                aria-label="New task default percent"
              />
              <Button variant="outline" onClick={add} disabled={saving || !name.trim() || percent === ""}>
                Add
              </Button>
            </div>
          </section>

          {others.length > 0 && (
            <section className="space-y-2" aria-labelledby="existing-heading">
              <h3 id="existing-heading" className="text-sm font-medium">
                Add an existing task
              </h3>
              {others.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-3">
                  <input type="checkbox" checked={false} onChange={() => toggle(t.id)} />
                  <span className="min-w-0 flex-1">
                    {t.name}
                    {!t.active && <span className="text-muted-foreground"> (off)</span>}
                    <span className="block text-xs text-muted-foreground">
                      {t.serviceIds.length === 0
                        ? "Not on any service"
                        : `On ${t.serviceIds.length} service${t.serviceIds.length === 1 ? "" : "s"}`}
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">{t.defaultPercent}%</span>
                </label>
              ))}
            </section>
          )}
        </div>

        <DialogFooter>
          <Button onClick={save} disabled={saving || total > 100}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {confirmDialog}
    </Dialog>
  )
}
