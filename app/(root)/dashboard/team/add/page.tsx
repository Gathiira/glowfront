"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function AddMember() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    commission: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Add member:", form)
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
              <div className="flex flex-col gap-3 sm:flex-row">
                <Field>
                  <Input
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </Field>
              </div>
              <Field>
                <Input
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field>
                <Input
                  placeholder="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field>
                <Input
                  placeholder="Job title"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                />
              </Field>
              <Field>
                <Input
                  placeholder="Commission (e.g. 40%)"
                  value={form.commission}
                  onChange={(e) => setForm({ ...form, commission: e.target.value })}
                />
              </Field>
            </FieldGroup>
            <Button type="submit" className="mt-6 w-full">
              Add Member
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
