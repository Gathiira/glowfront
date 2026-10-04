"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useConfirm } from "@/components/ui/use-confirm"
import { othersOn, pickToSave, ServiceTaskPicker, type ServiceTaskPick } from "@/components/dashboard/service-task-picker"
import type { ServiceDto, StaffDto, TaskDto } from "@/lib/types"
import { fetchAllPartnerServices, setPartnerStaffServices } from "@/lib/api/partner"
import { fetchTaskAssignments } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

type Props = { member: StaffDto; open: boolean; onClose: () => void; onSaved: (member: StaffDto) => void }

const empty: ServiceTaskPick = { serviceIds: [], noBookingServiceIds: [], taskIds: [] }

/** Change the services a member works on, whether they take bookings for each, and their tasks on them. */
export function MemberServicesDialog({ member, open, onClose, onSaved }: Props) {
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [pick, setPick] = useState<ServiceTaskPick>(empty)
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    if (!open) return
    setServices(null)
    Promise.all([fetchAllPartnerServices(), fetchTaskAssignments()])
      .then(([all, grid]) => {
        setServices(all)
        setTasks(grid.tasks)
        setPick({
          serviceIds: member.services.map((s) => s.id),
          noBookingServiceIds: member.noBookingServiceIds ?? [],
          taskIds: grid.tasks.filter((t) => t.staffIds.includes(member.id)).map((t) => t.id),
        })
      })
      .catch((e) => {
        setServices([])
        showError(e)
      })
  }, [open, member])

  const save = async () => {
    const out = pickToSave(pick, tasks)
    const removed = member.services.filter((s) => !out.serviceIds.includes(s.id))
    const takenOver = tasks.filter((t) => out.taskIds.includes(t.id) && othersOn(t, member.id) === 0 && !t.staffIds.includes(member.id))
    const bookable = out.serviceIds.length - out.noBookingServiceIds.length
    const ok = await confirm({
      title: `Save ${member.name}'s services?`,
      description: `Customers can book them for ${bookable} service${bookable === 1 ? "" : "s"}${
        out.noBookingServiceIds.length ? ` (${out.noBookingServiceIds.length} more they only help on)` : ""
      }, and they're assigned ${out.taskIds.length} task${out.taskIds.length === 1 ? "" : "s"}.${
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
      const updated = await setPartnerStaffServices(member.id, out.serviceIds, out.noBookingServiceIds, out.taskIds)
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
        <div className="max-h-[55dvh] overflow-y-auto">
          {services === null ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <ServiceTaskPicker
              memberId={member.id}
              memberName={member.name}
              services={services}
              tasks={tasks}
              value={pick}
              onChange={setPick}
            />
          )}
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
