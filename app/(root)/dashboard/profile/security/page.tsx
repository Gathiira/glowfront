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
import { PasswordInput } from "@/components/ui/password-input"
import { changePartnerPassword } from "@/lib/api/partner"
import { showSuccess } from "@/lib/toast"

export default function ProfileSecurity() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@glowbuddy.com",
    phone: "+1 (555) 000-0000",
  })

  const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
  const [saved, setSaved] = useState(false)
  const [changing, setChanging] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.new.length < 8) return setPasswordError("Your new password must be at least 8 characters.")
    if (password.new !== password.confirm) return setPasswordError("The new passwords don't match.")
    setPasswordError(null)
    setChanging(true)
    try {
      await changePartnerPassword(password.current, password.new)
      showSuccess("Password changed")
      setPassword({ current: "", new: "", confirm: "" })
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Couldn't change it. Try again.")
    } finally {
      setChanging(false)
    }
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
                  <PasswordInput
                    placeholder="Current password"
                    aria-label="Current password"
                    autoComplete="current-password"
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                    required
                  />
                </Field>
                <Field>
                  <PasswordInput
                    placeholder="New password (at least 8 characters)"
                    aria-label="New password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                    required
                  />
                </Field>
                <Field>
                  <PasswordInput
                    placeholder="Confirm new password"
                    aria-label="Confirm new password"
                    autoComplete="new-password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    required
                  />
                </Field>
              </FieldGroup>
              {passwordError && (
                <p className="mt-3 text-sm font-medium text-destructive" role="alert">
                  {passwordError}
                </p>
              )}
              <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={changing}>
                {changing ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
