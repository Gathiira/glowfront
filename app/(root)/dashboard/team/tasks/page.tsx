"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, Pencil, Plus, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirm } from "@/components/ui/use-confirm"
import type { ServiceDto, TaskAssignmentsDto, TaskDto } from "@/lib/types"
import { deleteTask, fetchTaskAssignments, fetchTasks, saveTaskAssignments } from "@/lib/api/commissions"
import { fetchAllPartnerServices } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"
import { TaskDialog } from "./_components/task-dialog"

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
  const [allTasks, setAllTasks] = useState<TaskDto[] | null>(null)
  const [services, setServices] = useState<ServiceDto[]>([])
  const [editing, setEditing] = useState<{ task: TaskDto | null } | null>(null)

  useEffect(() => {
    fetchTaskAssignments()
      .then((g) => {
        setGrid(g)
        setTicked(toSet(g))
        setSaved(toSet(g))
      })
      .catch(showError)
    loadTasks()
    fetchAllPartnerServices().then(setServices).catch(showError)
  }, [])

  const loadTasks = () =>
    fetchTasks()
      .then(setAllTasks)
      .catch((e) => {
        setAllTasks([])
        showError(e)
      })

  /** After adding, editing or deleting a task: refresh, keeping any unsaved ticks for tasks still in the grid. */
  const reload = async () => {
    loadTasks()
    try {
      const g = await fetchTaskAssignments()
      const ids = new Set(g.tasks.map((t) => t.id))
      setGrid(g)
      setSaved(toSet(g))
      setTicked((prev) => new Set([...prev].filter((k) => ids.has(Number(k.split(":")[1])))))
    } catch (err) {
      showError(err)
    }
  }

  const serviceNames = (t: TaskDto) =>
    t.serviceIds.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(", ") || "Not on any service"

  const remove = async (t: TaskDto) => {
    const ok = await confirm({
      title: `Delete ${t.name}?`,
      description:
        "It's taken off every service and person, and isn't offered at checkout. If no sale has used it it's deleted for good; otherwise it's turned off so past commissions keep their records.",
      confirmLabel: "Delete task",
      destructive: true,
    })
    if (!ok) return
    try {
      const outcome = await deleteTask(t.id)
      showSuccess(outcome === "DELETED" ? `${t.name} deleted` : `${t.name} turned off — sales have commissions for it, so it's kept`)
      reload()
    } catch (err) {
      showError(err)
    }
  }

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
      />

      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Tasks</CardTitle>
          <Button size="sm" onClick={() => setEditing({ task: null })} disabled={services.length === 0}>
            <Plus aria-hidden />
            Add task
          </Button>
        </CardHeader>
        <CardContent>
          {allTasks === null && <p className="text-sm text-muted-foreground">Loading...</p>}
          {allTasks?.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks yet. Add one (e.g. Shave, Wash) under a service.</p>
          )}
          <ul className="max-h-72 divide-y overflow-y-auto pr-1">
            {allTasks?.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${t.active ? "" : "text-muted-foreground line-through"}`}>
                    {t.name} <span className="text-sm font-normal text-muted-foreground">· {t.defaultPercent}% default</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.active ? serviceNames(t) : "Off: not offered at checkout"}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditing({ task: t })} aria-label={`Edit ${t.name}`}>
                  <Pencil aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(t)} aria-label={`Delete ${t.name}`}>
                  <Trash2 className="text-destructive" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {!grid && <p className="text-sm text-muted-foreground">Loading...</p>}

      {empty && (
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            {grid.tasks.length === 0 && (
              <p>No active tasks on a service yet. Use Add task above (e.g. Shave, Wash) first.</p>
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
                    <th scope="col" className="sticky left-0 z-10 bg-card pb-3 pr-4 text-left font-medium text-muted-foreground">
                      Team member
                    </th>
                    {grid.tasks.map((t) => (
                      <th key={t.id} scope="col" className="min-w-24 px-3 pb-3 text-center font-semibold">
                        {t.name}
                        <span className="block text-xs font-normal text-muted-foreground">{t.defaultPercent}% default</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.staff.map((s) => (
                    <tr key={s.id} className="border-t">
                      <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-card py-2 pr-4 text-left font-medium">
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
                    <td className="sticky left-0 z-10 whitespace-nowrap bg-card pt-3 pr-4 text-xs text-muted-foreground">Who can do it</td>
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

          {/* Under the grid, where the ticking happens */}
          <div className="mt-4 flex items-center justify-end gap-3">
            {dirty && <span className="text-sm text-muted-foreground">Unsaved changes</span>}
            <Button onClick={save} disabled={!dirty || saving} className="w-full sm:w-auto">
              {saving ? "Saving..." : dirty ? "Save changes" : "Saved"}
            </Button>
          </div>
        </>
      )}
      <TaskDialog
        open={editing !== null}
        task={editing?.task ?? null}
        services={services}
        onClose={() => setEditing(null)}
        onSaved={reload}
      />
      {confirmDialog}
    </div>
  )
}
