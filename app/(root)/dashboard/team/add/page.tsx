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
import { createPartnerStaff, fetchPartnerServices } from "@/lib/api/partner"
import { showSuccess, showError } from "@/lib/toast"
import type { ServiceDto } from "@/lib/types"

export default function AddMember() {
  const router = useRouter()
  const [services, setServices] = useState<ServiceDto[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    profilePhotoUrl: "",
    bio: "",
    jobTitle: "",
    yearsExperience: "",
    serviceIds: [] as number[],
  })

  useEffect(() => {
    fetchPartnerServices().then((res) => setServices(res.list)).catch(() => {})
  }, [])

  const toggleService = (id: number) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createPartnerStaff({
        name: form.name,
        profilePhotoUrl: form.profilePhotoUrl || undefined,
        bio: form.bio || undefined,
        jobTitle: form.jobTitle || undefined,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        serviceIds: form.serviceIds.length > 0 ? form.serviceIds : undefined,
      })
      showSuccess("Team member added successfully")
      router.push("/dashboard/team/members")
    } catch (err) {
      showError(err)
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
                <label className="mb-1.5 block text-sm font-medium">Services</label>
                <div className="space-y-2 rounded-lg border p-3">
                  {services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No services available</p>
                  ) : (
                    services.map((s) => (
                      <label
                        key={s.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={form.serviceIds.includes(s.id)}
                          onChange={() => toggleService(s.id)}
                          className="size-4 accent-primary"
                        />
                        <span>{s.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {s.durationMinutes} min &middot; {s.currency} {s.price}
                        </span>
                      </label>
                    ))
                  )}
                </div>
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
