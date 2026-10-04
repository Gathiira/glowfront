"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConfirm } from "@/components/ui/use-confirm"
import type { BusinessMemberDto, BusinessRole } from "@/lib/types"
import { addMember, changeMemberRole, fetchMembers, removeMember } from "@/lib/api/partner"
import { useMyRole } from "@/lib/use-my-role"
import { showError, showSuccess } from "@/lib/toast"

const ROLE: Record<BusinessRole, { name: string; can: string }> = {
  OWNER: { name: "Owner", can: "Everything, including owners and managers, business details and M-Pesa tills." },
  MANAGER: {
    name: "Manager",
    can: "Runs the day: sales, bookings, team, tasks, leave, commissions, payouts and advances. Can't pay or approve things for themselves.",
  },
}

/** Who can run the business from this dashboard. Owners only. */
export default function OwnersAndManagers() {
  const myRole = useMyRole()
  const [members, setMembers] = useState<BusinessMemberDto[] | null>(null)
  const [form, setForm] = useState<{ identifier: string; role: BusinessRole }>({ identifier: "", role: "MANAGER" })
  const [saving, setSaving] = useState(false)
  const [confirm, confirmDialog] = useConfirm()

  const load = () =>
    fetchMembers()
      .then(setMembers)
      .catch((e) => {
        setMembers([])
        showError(e)
      })

  useEffect(() => {
    if (myRole === "OWNER") load()
  }, [myRole])

  const owners = (members ?? []).filter((m) => m.role === "OWNER").length

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await confirm({
      title: `Add them as ${ROLE[form.role].name.toLowerCase()}?`,
      description: `${form.identifier.trim()} can sign in to this dashboard with their GlowBuddy login. ${ROLE[form.role].can}`,
      confirmLabel: "Add",
    })
    if (!ok) return
    setSaving(true)
    try {
      const m = await addMember(form.identifier.trim(), form.role)
      showSuccess(`${m.name} added as ${ROLE[m.role].name.toLowerCase()}`)
      setForm({ identifier: "", role: "MANAGER" })
      load()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  const setRole = async (m: BusinessMemberDto, role: BusinessRole) => {
    if (role === m.role) return
    const ok = await confirm({
      title: `Make ${m.you ? "yourself" : m.name} ${ROLE[role].name.toLowerCase()}?`,
      description: `${ROLE[role].can}${m.you && role === "MANAGER" ? " You'll lose access to this page." : ""}`,
      confirmLabel: "Change role",
      destructive: m.you && role === "MANAGER",
    })
    if (!ok) return
    try {
      await changeMemberRole(m.id, role)
      showSuccess("Role changed")
      if (m.you && role === "MANAGER") window.location.href = "/dashboard/home"
      else load()
    } catch (err) {
      showError(err)
    }
  }

  const remove = async (m: BusinessMemberDto) => {
    const ok = await confirm({
      title: `Remove ${m.you ? "yourself" : m.name}?`,
      description: `${m.you ? "You" : "They"} can no longer sign in to this dashboard.${
        m.staffId ? " They stay on the team and keep their staff portal login." : ""
      }`,
      confirmLabel: "Remove access",
      destructive: true,
    })
    if (!ok) return
    try {
      await removeMember(m.id)
      showSuccess("Access removed")
      if (m.you) window.location.href = "/"
      else load()
    } catch (err) {
      showError(err)
    }
  }

  if (myRole === "MANAGER") {
    return (
      <div>
        <PageHeader title="Owners & Managers" />
        <p className="text-sm text-muted-foreground">Only an owner can see and change who runs the business.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Owners & Managers"
        description="People who can sign in to this dashboard. A business always keeps at least one owner."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardContent>
            {members === null && <p className="text-sm text-muted-foreground">Loading...</p>}
            <ul className="divide-y">
              {members?.map((m) => {
                const lastOwner = m.role === "OWNER" && owners <= 1
                return (
                  <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {m.name}
                        {m.you && <span className="ml-1 text-sm font-normal text-muted-foreground">(you)</span>}
                        <span className="ml-2 inline-flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                          <span
                            className={`inline-block size-2 rounded-full ${m.status === "ACTIVE" ? "bg-green-500" : "bg-gray-300"}`}
                            aria-hidden
                          />
                          {m.status === "ACTIVE" ? "Active" : "Suspended"}
                        </span>
                        {m.staffId && (
                          <Link
                            href={`/dashboard/team/members/${m.staffId}`}
                            className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal hover:underline"
                          >
                            On the team
                          </Link>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{[m.phone, m.email].filter(Boolean).join(" · ")}</p>
                      {m.status === "SUSPENDED" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Deactivated as a team member, so they can&apos;t sign in.{" "}
                          {m.staffId && (
                            <Link href={`/dashboard/team/members/${m.staffId}`} className="font-medium underline underline-offset-4">
                              Reactivate them
                            </Link>
                          )}{" "}
                          to restore access, or remove them here.
                        </p>
                      )}
                      {lastOwner && (
                        <p className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          Only owner: can&apos;t be demoted or removed. Make someone else an owner first.
                        </p>
                      )}
                    </div>
                    <Select value={m.role} onValueChange={(v) => setRole(m, v as BusinessRole)} disabled={lastOwner}>
                      <SelectTrigger className="w-32" aria-label={`${m.name}'s role`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OWNER">Owner</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => remove(m)}
                      disabled={lastOwner}
                      title={lastOwner ? "Make someone else an owner first" : undefined}
                    >
                      Remove
                    </Button>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add someone</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={add} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="member-id">Email or phone</Label>
                <Input
                  id="member-id"
                  placeholder="Their GlowBuddy email or phone"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  They need a GlowBuddy account. Team members already have one from their staff login; anyone else can
                  sign up as a customer first.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as BusinessRole })}>
                  <SelectTrigger aria-label="Role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="OWNER">Owner</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{ROLE[form.role].can}</p>
              </div>
              <Button type="submit" disabled={saving || !form.identifier.trim()}>
                {saving ? "Adding..." : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {confirmDialog}
    </div>
  )
}
