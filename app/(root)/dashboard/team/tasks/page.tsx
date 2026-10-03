"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useConfirm } from "@/components/ui/use-confirm"
import type { TaskAssignmentsDto } from "@/lib/types"
import { fetchTaskAssignments, saveTaskAssignments } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

const key = (staffId: number, taskId: number) => `${staffId}:${taskId}`

type Grid = TaskAssignmentsDto
/** Service first: a task can only be given to someone on one of its services. */
const can = (s: Grid["staff"][number], t: Grid["tasks"][number]) => t.serviceIds.some((id) => s.serviceIds.includes(id))

function toSet(grid: TaskAssignmentsDto) {
  return new Set(grid.assignments.map((a) => key(a.staffId, a.taskId)))
}

export default function TaskAssignments() {
  const [grid, setGrid] = useState<TaskAssignmentsDto | null>(null)
  const [ticked, setTicked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    fetchTaskAssignments()
      .then((g) => {
        setGrid(g)
        setTicked(toSet(g))
        setSaved(toSet(g))
      })
      .catch(showError)
  }, [])

  const dirty = ticked.size !== saved.size || [...ticked].some((k) => !saved.has(k))

  const toggle = (staffId: number, taskId: number) =>
    setTicked((prev) => {
      const next = new Set(prev)
      const k = key(staffId, taskId)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const countFor = (taskId: number) => grid?.staff.filter((s) => ticked.has(key(s.id, taskId))).length ?? 0

  const save = async () => {
    const ok = await confirm({
      title: "Save task assignments?",
      description:
        "Checkout will only offer the ticked people for each task. Tasks with nobody ticked stay open to anyone on that service.",
      confirmLabel: "Save",
    })
    if (!ok) return
    setSaving(true)
    try {
      const body = [...ticked].map((k) => {
        const [staffId, taskId] = k.split(":").map(Number)
        return { staffId, taskId }
      })
      const g = await saveTaskAssignments(body)
      setGrid(g)
      setTicked(toSet(g))
      setSaved(toSet(g))
      showSuccess("Task assignments saved")
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  const empty = grid && (grid.tasks.length === 0 || grid.staff.length === 0)

  return (
    <div>
      <PageHeader
        title="Task assignments"
        description="Tick who can do each task. People can only be given tasks of services they're on — set those on their team page first. At checkout, only ticked people are offered; a task with nobody ticked is open to anyone on that service."
      >
        <Button onClick={save} disabled={!dirty || saving || !grid}>
          {saving ? "Saving..." : dirty ? "Save changes" : "Saved"}
        </Button>
      </PageHeader>

      {!grid && <p className="text-sm text-muted-foreground">Loading...</p>}

      {empty && (
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            {grid.tasks.length === 0 && (
              <p>
                No active tasks yet.{" "}
                <Link href="/dashboard/catalog" className="font-medium underline underline-offset-4">
                  Add tasks in Catalog
                </Link>{" "}
                (e.g. Shave, Wash) first.
              </p>
            )}
            {grid.staff.length === 0 && (
              <p>
                No active team members.{" "}
                <Link href="/dashboard/team/add" className="font-medium underline underline-offset-4">
                  Add a team member
                </Link>
                .
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {grid && !empty && (
        <>
          {/* Desktop: one grid, people down the side, tasks across the top */}
          <Card className="hidden md:block">
            <CardContent className="overflow-x-auto pt-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="pb-3 text-left font-medium text-muted-foreground">
                      Team member
                    </th>
                    {grid.tasks.map((t) => (
                      <th key={t.id} scope="col" className="px-3 pb-3 text-center font-semibold">
                        {t.name}
                        <span className="block text-xs font-normal text-muted-foreground">{t.defaultPercent}% default</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.staff.map((s) => (
                    <tr key={s.id} className="border-t">
                      <th scope="row" className="py-2 pr-4 text-left font-medium">
                        <Link href={`/dashboard/team/members/${s.id}`} className="hover:underline">
                          {s.name}
                        </Link>
                      </th>
                      {grid.tasks.map((t) => {
                        const on = ticked.has(key(s.id, t.id))
                        if (!can(s, t)) {
                          return (
                            <td key={t.id} className="px-3 py-2 text-center text-muted-foreground" title={`${s.name} isn't on a service with ${t.name}`}>
                              <span aria-hidden>—</span>
                              <span className="sr-only">{`${s.name} isn't on a service with ${t.name}`}</span>
                            </td>
                          )
                        }
                        return (
                          <td key={t.id} className="px-3 py-2 text-center">
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={on}
                              aria-label={`${s.name} can do ${t.name}`}
                              onClick={() => toggle(s.id, t.id)}
                              className={`inline-flex size-9 items-center justify-center rounded-md border transition-colors ${
                                on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                              }`}
                            >
                              {on && <Check className="size-4" aria-hidden />}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td className="pt-3 text-xs text-muted-foreground">Who can do it</td>
                    {grid.tasks.map((t) => {
                      const n = countFor(t.id)
                      return (
                        <td key={t.id} className="px-3 pt-3 text-center text-xs">
                          {n === 0 ? <span className="text-muted-foreground">Anyone on it</span> : `${n} ${n === 1 ? "person" : "people"}`}
                        </td>
                      )
                    })}
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {/* Phone: one card per person with their task toggles */}
          <div className="space-y-3 md:hidden">
            {grid.staff.map((s) => (
              <Card key={s.id}>
                <CardContent className="pt-6">
                  <p className="mb-3 font-medium">{s.name}</p>
                  {grid.tasks.every((t) => !can(s, t)) && (
                    <p className="text-sm text-muted-foreground">
                      Not on any service with tasks yet.{" "}
                      <Link href={`/dashboard/team/members/${s.id}`} className="font-medium underline underline-offset-4">
                        Set their services
                      </Link>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {grid.tasks.filter((t) => can(s, t)).map((t) => {
                      const on = ticked.has(key(s.id, t.id))
                      return (
                        <button
                          key={t.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(s.id, t.id)}
                          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
                            on ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {on && <Check className="size-4" aria-hidden />}
                          {t.name}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
            <p className="text-xs text-muted-foreground">
              Open to anyone on the service:{" "}
              {grid.tasks.filter((t) => countFor(t.id) === 0).map((t) => t.name).join(", ") || "none"}
            </p>
          </div>
        </>
      )}
      {confirmDialog}
    </div>
  )
}
