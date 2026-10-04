"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useConfirm } from "@/components/ui/use-confirm"
import type { ServiceDto, StaffDto, TaskDto } from "@/lib/types"
import { fetchAllPartnerServices, setPartnerStaffServices } from "@/lib/api/partner"
import { fetchTaskAssignments } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

type Props = { member: StaffDto; open: boolean; onClose: () => void; onSaved: (member: StaffDto) => void }

const toggleIn = (list: number[], id: number) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

/**
 * Pick the services a member works on and their tasks on each. Service first: tasks come from these services.
 * Each service can be set to not take bookings, for people who only help on it (a washer on Shave).
 */
export function MemberServicesDialog({ member, open, onClose, onSaved }: Props) {
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [noBooking, setNoBooking] = useState<number[]>([])
  const [myTasks, setMyTasks] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    if (!open) return
    setServices(null)
    setSelected(member.services.map((s) => s.id))
    setNoBooking(member.noBookingServiceIds ?? [])
    Promise.all([fetchAllPartnerServices(), fetchTaskAssignments()])
      .then(([all, grid]) => {
        setServices(all)
        setTasks(grid.tasks)
        setMyTasks(grid.tasks.filter((t) => t.staffIds.includes(member.id)).map((t) => t.id))
      })
      .catch((e) => {
        setServices([])
        showError(e)
      })
  }, [open, member])

  /** Other people assigned; none means the task is open to anyone on its services. */
  const othersOn = (t: TaskDto) => t.staffIds.filter((id) => id !== member.id).length
  const reachable = (t: TaskDto) => t.serviceIds.some((id) => selected.includes(id))

  const save = async () => {
    const removed = member.services.filter((s) => !selected.includes(s.id))
    const helperOnly = noBooking.filter((id) => selected.includes(id))
    const taskIds = myTasks.filter((id) => tasks.some((t) => t.id === id && reachable(t)))
    const takenOver = tasks.filter((t) => taskIds.includes(t.id) && othersOn(t) === 0 && !t.staffIds.includes(member.id))
    const bookable = selected.length - helperOnly.length
    const ok = await confirm({
      title: `Save ${member.name}'s services?`,
      description: `Customers can book them for ${bookable} service${bookable === 1 ? "" : "s"}${
        helperOnly.length ? ` (${helperOnly.length} more they only help on)` : ""
      }, and they're assigned ${taskIds.length} task${taskIds.length === 1 ? "" : "s"}.${
        takenOver.length
          ? ` ${takenOver.map((t) => t.name).join(", ")} will be only for ${member.name}; tick others on Task assignments if they do it too.`
          : ""
      }${
        removed.length
          ? ` Taking them off ${removed.map((s) => s.name).join(", ")} also removes them from tasks that are only on ${removed.length === 1 ? "that service" : "those services"}.`
          : ""
      }`,
      confirmLabel: "Save services",
    })
    if (!ok) return
    setSaving(true)
    try {
      const updated = await setPartnerStaffServices(member.id, selected, helperOnly, taskIds)
      showSuccess("Services saved")
      onSaved(updated)
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
          <DialogTitle>{member.name}&apos;s services</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          The services they work on and the tasks they do on each. Turn off &quot;Takes bookings&quot; when they only help
          on a service, e.g. a washer on Shave.
        </p>
        <div className="max-h-[55dvh] space-y-2 overflow-y-auto">
          {services === null && <p className="text-sm text-muted-foreground">Loading...</p>}
          {services?.length === 0 && <p className="text-sm text-muted-foreground">No services in the catalog yet.</p>}
          {services?.map((s) => {
            const on = selected.includes(s.id)
            const serviceTasks = tasks.filter((t) => t.serviceIds.includes(s.id))
            return (
              <div key={s.id} className="rounded-lg border p-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={on} onChange={() => setSelected((p) => toggleIn(p, s.id))} />
                  <span className="flex-1 font-medium">{s.name}</span>
                  <span className="text-sm text-muted-foreground">{s.categoryName}</span>
                </label>
                {on && (
                  <div className="mt-2 space-y-2 pl-7 text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                      <input type="checkbox" checked={!noBooking.includes(s.id)} onChange={() => setNoBooking((p) => toggleIn(p, s.id))} />
                      Takes bookings
                    </label>
                    {serviceTasks.length === 0 ? (
                      <p className="text-muted-foreground">No tasks on this service yet.</p>
                    ) : (
                      <fieldset className="space-y-1.5">
                        <legend className="mb-1 text-xs font-medium text-muted-foreground">Tasks they do</legend>
                        {serviceTasks.map((t) => {
                          const mine = myTasks.includes(t.id)
                          const others = othersOn(t)
                          return (
                            <div key={t.id}>
                              <label className="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" checked={mine} onChange={() => setMyTasks((p) => toggleIn(p, t.id))} />
                                <span>{t.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {others > 0 ? `also ${others} other${others === 1 ? "" : "s"}` : mine ? "" : `open to anyone on ${s.name}`}
                                </span>
                              </label>
                              {mine && others === 0 && (
                                <p className="mt-0.5 pl-6 text-xs text-amber-600">
                                  Only {member.name} can be picked for {t.name}. Others who do it need ticking on{" "}
                                  <Link href="/dashboard/team/tasks" className="underline underline-offset-2">
                                    Task assignments
                                  </Link>
                                  .
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </fieldset>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || services === null}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {confirmDialog}
    </Dialog>
  )
}
