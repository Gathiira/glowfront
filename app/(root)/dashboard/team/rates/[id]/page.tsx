"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { StaffTaskRateDto } from "@/lib/types"
import { fetchStaffTaskRates, saveStaffTaskRates } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

export default function StaffRates() {
  const staffId = Number(useParams<{ id: string }>().id)
  const [rates, setRates] = useState<StaffTaskRateDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStaffTaskRates(staffId)
      .then(setRates)
      .catch(showError)
      .finally(() => setLoading(false))
  }, [staffId])

  const setPercent = (taskId: number, value: string) =>
    setRates((rs) => rs.map((r) => (r.taskId === taskId ? { ...r, percent: value === "" ? null : Number(value) } : r)))

  const save = async () => {
    setSaving(true)
    try {
      setRates(await saveStaffTaskRates(staffId, rates.map((r) => ({ taskId: r.taskId, percent: r.percent }))))
      showSuccess("Commission rates saved")
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  const aboveDefault = rates.some((r) => r.percent !== null && r.percent > r.defaultPercent)

  return (
    <div>
      <PageHeader title="Commission rates" description="Leave a rate blank to use the task's default.">
        <Link href="/dashboard/team/members">
          <Button variant="outline">Back</Button>
        </Link>
        <Button onClick={save} disabled={saving || loading}>
          {saving ? "Saving..." : "Save rates"}
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="space-y-2 pt-6">
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && rates.length === 0 && (
            <p className="text-sm text-muted-foreground">No active tasks yet. Add tasks in Catalog first.</p>
          )}
          {rates.map((r) => (
            <div key={r.taskId} className="flex items-center gap-3 rounded-lg border p-3">
              <span className="flex-1 font-medium">{r.taskName}</span>
              <span className="text-sm text-muted-foreground">default {r.defaultPercent}%</span>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                className="w-28"
                placeholder="Agreed %"
                value={r.percent ?? ""}
                onChange={(e) => setPercent(r.taskId, e.target.value)}
                aria-label={`${r.taskName} agreed percent`}
              />
            </div>
          ))}
          {aboveDefault && (
            <p className="text-sm text-amber-600">
              Some agreed rates are above the task default. On services with several tasks this reduces what the business
              keeps, and can exceed 100% in total.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
