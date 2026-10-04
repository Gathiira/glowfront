"use client"

import Link from "next/link"
import type { ServiceDto, TaskDto } from "@/lib/types"

export type ServiceTaskPick = { serviceIds: number[]; noBookingServiceIds: number[]; taskIds: number[] }

type Props = {
  /** Null while adding a new member. */
  memberId: number | null
  memberName: string
  services: ServiceDto[]
  /** Tasks in use (from the assignments grid), with who's assigned. */
  tasks: TaskDto[]
  value: ServiceTaskPick
  onChange: (value: ServiceTaskPick) => void
}

const toggleIn = (list: number[], id: number) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

/** Other people assigned; none means the task is open to anyone on its services. */
export const othersOn = (t: TaskDto, memberId: number | null) => t.staffIds.filter((id) => id !== memberId).length

/** What to save: only "no bookings" and tasks for services still ticked. */
export function pickToSave(value: ServiceTaskPick, tasks: TaskDto[]): ServiceTaskPick {
  const reachable = (t: TaskDto) => t.serviceIds.some((id) => value.serviceIds.includes(id))
  return {
    serviceIds: value.serviceIds,
    noBookingServiceIds: value.noBookingServiceIds.filter((id) => value.serviceIds.includes(id)),
    taskIds: value.taskIds.filter((id) => tasks.some((t) => t.id === id && reachable(t))),
  }
}

/**
 * Services a member works on, whether customers can book them for each, and the tasks they do on each.
 * Service first: tasks come from ticked services. A task shared by two services is one tick.
 */
export function ServiceTaskPicker({ memberId, memberName, services, tasks, value, onChange }: Props) {
  const who = memberName.trim() || "this member"
  if (services.length === 0) return <p className="text-sm text-muted-foreground">No services in the catalog yet.</p>

  return (
    <div className="space-y-2">
      {services.map((s) => {
        const on = value.serviceIds.includes(s.id)
        const serviceTasks = tasks.filter((t) => t.serviceIds.includes(s.id))
        return (
          <div key={s.id} className="rounded-lg border p-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={on}
                onChange={() => onChange({ ...value, serviceIds: toggleIn(value.serviceIds, s.id) })}
              />
              <span className="flex-1 font-medium">{s.name}</span>
              <span className="text-sm text-muted-foreground">{s.categoryName}</span>
            </label>
            {on && (
              <div className="mt-2 space-y-2 pl-7 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={!value.noBookingServiceIds.includes(s.id)}
                    onChange={() => onChange({ ...value, noBookingServiceIds: toggleIn(value.noBookingServiceIds, s.id) })}
                  />
                  Takes bookings
                </label>
                {serviceTasks.length === 0 ? (
                  <p className="text-muted-foreground">No tasks on this service yet.</p>
                ) : (
                  <fieldset className="space-y-1.5">
                    <legend className="mb-1 text-xs font-medium text-muted-foreground">Tasks they do</legend>
                    {serviceTasks.map((t) => {
                      const mine = value.taskIds.includes(t.id)
                      const others = othersOn(t, memberId)
                      return (
                        <div key={t.id}>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={mine}
                              onChange={() => onChange({ ...value, taskIds: toggleIn(value.taskIds, t.id) })}
                            />
                            <span>{t.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {others > 0 ? `also ${others} other${others === 1 ? "" : "s"}` : mine ? "" : `open to anyone on ${s.name}`}
                            </span>
                          </label>
                          {mine && others === 0 && (
                            <p className="mt-0.5 pl-6 text-xs text-amber-600">
                              Only {who} can be picked for {t.name}. Others who do it need ticking on{" "}
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
  )
}
