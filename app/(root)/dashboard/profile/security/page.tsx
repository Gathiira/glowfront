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

export default function ProfileSecurity() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@glowbuddy.com",
    phone: "+1 (555) 000-0000",
  })

  const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
  const [saved, setSaved] = useState(false)

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setPassword({ current: "", new: "", confirm: "" })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader title="Security" description="Update your profile information and password" />

      <div className="mx-auto max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit}>
              <FieldGroup>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Field>
                    <Input
                      placeholder="First name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <Input
                      placeholder="Last name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </Field>
                </div>
                <Field>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-6 w-full sm:w-auto">
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <FieldGroup>
                <Field>
                  <Input
                    placeholder="Current password"
                    type="password"
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="New password"
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Confirm new password"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-6 w-full sm:w-auto">
                {saved ? "Updated!" : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
