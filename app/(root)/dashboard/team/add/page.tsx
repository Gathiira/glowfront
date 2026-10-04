"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { createPartnerStaff, fetchAllPartnerServices, setPartnerStaffServices } from "@/lib/api/partner"
import { fetchTaskAssignments } from "@/lib/api/commissions"
import { pickToSave, ServiceTaskPicker, type ServiceTaskPick } from "@/components/dashboard/service-task-picker"
import { showSuccess, showError } from "@/lib/toast"
import type { ServiceDto, TaskDto } from "@/lib/types"

export default function AddMember() {
  const router = useRouter()
  const [services, setServices] = useState<ServiceDto[] | null>(null)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    profilePhotoUrl: "",
    bio: "",
    jobTitle: "",
    yearsExperience: "",
    email: "",
    phone: "",
  })
  const wantsLogin = form.email.trim() !== "" || form.phone.trim() !== ""
  const [pick, setPick] = useState<ServiceTaskPick>({ serviceIds: [], noBookingServiceIds: [], taskIds: [] })

  useEffect(() => {
    Promise.all([fetchAllPartnerServices(), fetchTaskAssignments()])
      .then(([all, grid]) => {
        setServices(all)
        setTasks(grid.tasks)
      })
      .catch((e) => {
        setServices([])
        showError(e)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const out = pickToSave(pick, tasks)
    let created: number | null = null
    try {
      const member = await createPartnerStaff({
        name: form.name,
        profilePhotoUrl: form.profilePhotoUrl || undefined,
        bio: form.bio || undefined,
        jobTitle: form.jobTitle || undefined,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        serviceIds: out.serviceIds.length > 0 ? out.serviceIds : undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
      })
      created = member.id
      if (out.serviceIds.length > 0) {
        await setPartnerStaffServices(member.id, out.serviceIds, out.noBookingServiceIds, out.taskIds)
      }
      if (wantsLogin) {
        // Their page shows the generated default password to share with them.
        showSuccess("Team member added. Share their login details from their page.")
        router.push(`/dashboard/team/members/${member.id}`)
      } else {
        showSuccess("Team member added successfully")
        router.push("/dashboard/team/members")
      }
    } catch (err) {
      showError(err)
      // Added, but their bookings/tasks didn't save: finish on their page instead of adding them twice.
      if (created !== null) router.push(`/dashboard/team/members/${created}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Add Team Member" description="Add a new member to your team" />

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Team Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Full name</label>
                <Input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="e.g. 0712 345 678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required={wantsLogin}
                />
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="e.g. jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required={wantsLogin}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  With a phone and email they get a staff portal login. A default password is generated and shown on
                  their page for you to share; once they set their own, it&apos;s hidden from everyone. Leave both empty
                  for no login.
                </p>
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Profile photo URL</label>
                <Input
                  placeholder="Profile photo URL"
                  value={form.profilePhotoUrl}
                  onChange={(e) => setForm({ ...form, profilePhotoUrl: e.target.value })}
                />
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Bio</label>
                <Textarea
                  placeholder="Bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Job title</label>
                <Input
                  placeholder="Job title"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                />
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Years of experience</label>
                <Input
                  placeholder="Years of experience"
                  type="number"
                  min={0}
                  max={100}
                  value={form.yearsExperience}
                  onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                />
              </Field>
              <Field>
                <label className="mb-1.5 block text-sm font-medium">Services and tasks</label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Tick the services they work on, then the tasks they do on each. Turn off &quot;Takes bookings&quot; when
                  they only help on a service, e.g. a washer on Shave.
                </p>
                {services === null ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <ServiceTaskPicker
                    memberId={null}
                    memberName={form.name}
                    services={services}
                    tasks={tasks}
                    value={pick}
                    onChange={setPick}
                  />
                )}
              </Field>
            </FieldGroup>
            <Button type="submit" className="mt-6 w-full" disabled={submitting}>
              {submitting ? "Adding..." : "Add Member"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
