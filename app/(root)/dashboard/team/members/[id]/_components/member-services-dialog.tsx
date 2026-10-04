"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useConfirm } from "@/components/ui/use-confirm"
import type { ServiceDto, StaffDto } from "@/lib/types"
import { fetchAllPartnerServices, setPartnerStaffServices } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"

type Props = { member: StaffDto; open: boolean; onClose: () => void; onSaved: (member: StaffDto) => void }

/**
 * Pick the services a member works on. Service first: their tasks come from these services.
 * Each can be set to not take bookings, for people who only help on it (a washer on Shave).
 */
export function MemberServicesDialog({ member, open, onClose, onSaved }: Props) {
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [noBooking, setNoBooking] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    if (!open) return
    setSelected(member.services.map((s) => s.id))
    setNoBooking(member.noBookingServiceIds ?? [])
    fetchAllPartnerServices()
      .then(setServices)
      .catch((e) => {
        setServices([])
        showError(e)
      })
  }, [open, member])

  const toggle = (id: number) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const toggleBooking = (id: number) => setNoBooking((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const save = async () => {
    const removed = member.services.filter((s) => !selected.includes(s.id))
    const helperOnly = noBooking.filter((id) => selected.includes(id))
    const bookable = selected.length - helperOnly.length
    const ok = await confirm({
      title: `Save ${member.name}'s services?`,
      description: `Customers can book them for ${bookable} service${bookable === 1 ? "" : "s"}${
        helperOnly.length ? ` (${helperOnly.length} more they only help on)` : ""
      }, and they can be picked for those services' tasks at checkout.${
        removed.length
          ? ` Taking them off ${removed.map((s) => s.name).join(", ")} also removes them from tasks that are only on ${removed.length === 1 ? "that service" : "those services"}.`
          : ""
      }`,
      confirmLabel: "Save services",
    })
    if (!ok) return
    setSaving(true)
    try {
      const updated = await setPartnerStaffServices(member.id, selected, helperOnly)
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
          The services they work on; their tasks (like Shave or Wash) come from these. Turn off &quot;Takes bookings&quot;
          when they only help on a service, e.g. a washer on Shave, so customers can&apos;t book them for it.
        </p>
        <div className="max-h-[50dvh] space-y-2 overflow-y-auto">
          {services === null && <p className="text-sm text-muted-foreground">Loading...</p>}
          {services?.length === 0 && <p className="text-sm text-muted-foreground">No services in the catalog yet.</p>}
          {services?.map((s) => {
            const on = selected.includes(s.id)
            return (
              <div key={s.id} className="rounded-lg border p-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={on} onChange={() => toggle(s.id)} />
                  <span className="flex-1">{s.name}</span>
                  <span className="text-sm text-muted-foreground">{s.categoryName}</span>
                </label>
                {on && (
                  <label className="mt-2 flex cursor-pointer items-center gap-2 pl-7 text-sm text-muted-foreground">
                    <input type="checkbox" checked={!noBooking.includes(s.id)} onChange={() => toggleBooking(s.id)} />
                    Takes bookings
                  </label>
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
