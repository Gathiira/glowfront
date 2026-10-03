"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CalendarClock, Percent, Star, Users, Wallet } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { LeaveCard } from "@/components/dashboard/leave-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { LeaveDto, StaffDto, StaffTaskRateDto } from "@/lib/types"
import { fetchStaffTaskRates } from "@/lib/api/commissions"
import { fetchPartnerStaffMember } from "@/lib/api/partner"
import { addLeaveForStaff, fetchLeave, leaveWhen } from "@/lib/api/leave"
import { useConfirm } from "@/components/ui/use-confirm"
import { today } from "@/lib/api/commissions"
import { fmt } from "@/lib/utils"
import { showError, showSuccess } from "@/lib/toast"

const emptyForm = () => ({ startDate: today(), endDate: today(), partDay: false, startTime: "09:00", endTime: "13:00", reason: "" })

/** Open the browser's own date/time picker when the field is tapped, not only from its small icon. */
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker()
  } catch {
    // unsupported: default behaviour applies
  }
}

export default function MemberDetails() {
  const staffId = Number(useParams<{ id: string }>().id)
  const [member, setMember] = useState<StaffDto | null>(null)
  const [leave, setLeave] = useState<LeaveDto[] | null>(null)
  const [tasks, setTasks] = useState<StaffTaskRateDto[] | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirm, confirmDialog] = useConfirm()

  const loadLeave = () =>
    fetchLeave(undefined, staffId)
      .then(setLeave)
      .catch((e) => {
        setLeave([])
        showError(e)
      })

  useEffect(() => {
    fetchPartnerStaffMember(staffId).then(setMember).catch(showError)
    fetchStaffTaskRates(staffId)
      .then(setTasks)
      .catch((e) => {
        setTasks([])
        showError(e)
      })
    loadLeave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId])

  const timesInvalid = form.partDay && form.endTime <= form.startTime
  const datesInvalid = !form.partDay && form.endDate < form.startDate

  const addLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (timesInvalid || datesInvalid) {
      setError(timesInvalid ? "The end time must be after the start time." : "The last day can't be before the first day.")
      return
    }
    setError(null)
    const body = {
      startDate: form.startDate,
      endDate: form.partDay ? form.startDate : form.endDate,
      startTime: form.partDay ? form.startTime : undefined,
      endTime: form.partDay ? form.endTime : undefined,
      reason: form.reason.trim() || undefined,
    }
    const ok = await confirm({
      title: "Add approved leave?",
      description: `${member?.name ?? "This team member"} · ${leaveWhen({
        startDate: body.startDate,
        endDate: body.endDate,
        startTime: body.startTime ?? null,
        endTime: body.endTime ?? null,
      })}. It's approved straight away and customers can't book them then.`,
      confirmLabel: "Add leave",
    })
    if (!ok) return
    setSaving(true)
    try {
      await addLeaveForStaff(staffId, body)
      showSuccess("Leave added and approved")
      setForm(emptyForm())
      loadLeave()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add the leave. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const links = [
    { href: `/dashboard/team/shifts/${staffId}`, label: "Shifts", icon: CalendarClock },
    { href: `/dashboard/team/rates/${staffId}`, label: "Commission rates", icon: Percent },
    { href: "/dashboard/team/tasks", label: "Task assignments", icon: Users },
    { href: `/dashboard/sales/commissions/${staffId}`, label: "Commissions", icon: Wallet },
  ]

  const assigned = (tasks ?? []).filter((t) => t.access === "YES")
  const open = (tasks ?? []).filter((t) => t.access === "ANYONE")

  const initials = member?.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div>
      <PageHeader title={member?.name ?? "Team member"} description={member?.jobTitle ?? undefined}>
        <Link href="/dashboard/team/members">
          <Button variant="outline">All members</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              {member?.profilePhotoUrl ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  <Image src={member.profilePhotoUrl} alt={member.name} fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                  {initials ?? ""}
                </div>
              )}
              <div className="min-w-0 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className={`inline-block size-2 rounded-full ${member?.active ? "bg-green-500" : "bg-gray-300"}`} />
                  {member ? (member.active ? "Active" : "Inactive") : "Loading..."}
                </p>
                {member && (
                  <p className="text-muted-foreground">
                    {member.yearsExperience > 0
                      ? `${member.yearsExperience} yr${member.yearsExperience !== 1 ? "s" : ""} experience`
                      : "New to the team"}
                  </p>
                )}
                {member && member.averageRating > 0 && (
                  <p className="flex items-center gap-1">
                    <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden />
                    <span className="font-medium">{fmt(member.averageRating)}</span>
                    <span className="text-muted-foreground">
                      ({member.reviewCount} review{member.reviewCount !== 1 ? "s" : ""})
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid grid-cols-2 gap-2 pt-6">
              {links.map((l) => {
                const Icon = l.icon
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                    {l.label}
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Tasks</CardTitle>
              <Link href="/dashboard/team/tasks" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                Change
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks === null && <p className="text-sm text-muted-foreground">Loading...</p>}
              {tasks?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No tasks set up yet.{" "}
                  <Link href="/dashboard/catalog" className="font-medium underline underline-offset-4">
                    Add tasks in Catalog
                  </Link>
                  .
                </p>
              )}
              {tasks && tasks.length > 0 && assigned.length === 0 && (
                <p className="text-sm text-muted-foreground">Not assigned to any task specifically.</p>
              )}
              {assigned.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Assigned tasks">
                  {assigned.map((t) => (
                    <li key={t.taskId} className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                      {t.taskName} · {t.percent ?? t.defaultPercent}%{t.percent != null ? " agreed" : ""}
                    </li>
                  ))}
                </ul>
              )}
              {open.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Also open to anyone: {open.map((t) => t.taskName).join(", ")}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              {member && member.services.length === 0 && (
                <p className="text-sm text-muted-foreground">Not set up for any services, so customers can&apos;t book them online.</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {member?.services.map((s) => (
                  <span key={s.id} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                    {s.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add leave</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addLeave} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Leave you add is approved straight away and blocks bookings. Past dates are fine for recording sick days.
                </p>
                <div className="inline-flex rounded-lg border p-1" role="group" aria-label="How long">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.partDay ? "ghost" : "secondary"}
                    aria-pressed={!form.partDay}
                    onClick={() => setForm({ ...form, partDay: false })}
                  >
                    Whole days
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.partDay ? "secondary" : "ghost"}
                    aria-pressed={form.partDay}
                    onClick={() => setForm({ ...form, partDay: true, endDate: form.startDate })}
                  >
                    Part of a day
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="ml-start">{form.partDay ? "Date" : "First day"}</Label>
                    <Input
                      id="ml-start"
                      type="date"
                      onClick={openPicker}
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          startDate: e.target.value,
                          endDate: form.partDay || e.target.value > form.endDate ? e.target.value : form.endDate,
                        })
                      }
                      required
                    />
                  </div>
                  {form.partDay ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="ml-from">From</Label>
                        <Input
                          id="ml-from"
                          type="time"
                          onClick={openPicker}
                          value={form.startTime}
                          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ml-to">Until</Label>
                        <Input
                          id="ml-to"
                          type="time"
                          onClick={openPicker}
                          value={form.endTime}
                          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                          aria-invalid={timesInvalid || undefined}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label htmlFor="ml-end">Last day</Label>
                      <Input
                        id="ml-end"
                        type="date"
                        onClick={openPicker}
                        min={form.startDate}
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        aria-invalid={datesInvalid || undefined}
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ml-reason">Reason (optional)</Label>
                  <Textarea
                    id="ml-reason"
                    placeholder="e.g. Sick day"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  />
                </div>
                {error && (
                  <p className="text-sm font-medium text-destructive" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={saving || !member?.active}>
                  {saving ? "Adding..." : "Add leave"}
                </Button>
                {member && !member.active && (
                  <p className="text-sm text-muted-foreground">Inactive members can&apos;t be given leave.</p>
                )}
              </form>
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Leave</h2>
            {leave === null && <p className="text-sm text-muted-foreground">Loading...</p>}
            {leave?.length === 0 && (
              <p className="text-sm text-muted-foreground">No leave yet. Requests they send and leave you add appear here.</p>
            )}
            <div className="space-y-3">
              {leave?.map((l) => (
                <LeaveCard key={l.id} leave={l} onDecided={loadLeave} showStaff={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {confirmDialog}
    </div>
  )
}
