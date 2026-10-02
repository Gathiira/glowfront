"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { TaskDto } from "@/lib/types"
import { createTask, updateTask } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

type Props = { tasks: TaskDto[]; onChange: () => void }

export function TaskManager({ tasks, onChange }: Props) {
  const [name, setName] = useState("")
  const [percent, setPercent] = useState("")
  const [saving, setSaving] = useState(false)

  const add = async () => {
    if (!name.trim() || percent === "") return
    setSaving(true)
    try {
      await createTask({ name: name.trim(), defaultPercent: Number(percent) })
      showSuccess("Task added")
      setName("")
      setPercent("")
      onChange()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  const save = async (task: TaskDto, changes: Partial<TaskDto>) => {
    try {
      await updateTask(task.id, { name: task.name, defaultPercent: task.defaultPercent, active: task.active, ...changes })
      onChange()
      return true
    } catch (err) {
      showError(err)
      return false
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tasks &amp; default commission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Tasks are the parts of a service done by staff, like Shave or Wash. Each has a default commission %. A
          team member&apos;s agreed rate overrides it.
        </p>
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
            <span className={`flex-1 font-medium ${t.active ? "" : "text-muted-foreground line-through"}`}>{t.name}</span>
            <Input
              key={`${t.id}-${t.defaultPercent}`}
              type="number"
              min={0}
              max={100}
              step="0.01"
              className="w-24"
              defaultValue={t.defaultPercent}
              aria-label={`${t.name} default percent`}
              onBlur={async (e) => {
                const input = e.currentTarget
                const value = Number(input.value)
                if (value === t.defaultPercent) return
                if (!(await save(t, { defaultPercent: value }))) input.value = String(t.defaultPercent)
              }}
            />
            <span className="text-sm text-muted-foreground">%</span>
            <Switch checked={t.active} onCheckedChange={(v) => save(t, { active: v })} aria-label={`${t.name} active`} />
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Task name (e.g. Wash)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-48 flex-1"
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
          />
          <Button onClick={add} disabled={saving}>
            {saving ? "Saving..." : "Add task"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
