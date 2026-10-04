"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
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
import { changePartnerPassword, fetchMyAccount, updateMyAccount } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"

export default function ProfileSecurity() {
  const [profile, setProfile] = useState<{ firstName: string; lastName: string; email: string; phone: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
  const [changing, setChanging] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyAccount()
      .then((a) => setProfile({ firstName: a.firstName, lastName: a.lastName, email: a.email, phone: a.phone }))
      .catch(showError)
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setProfileError(null)
    setSavingProfile(true)
    try {
      const a = await updateMyAccount({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
      })
      setProfile({ firstName: a.firstName, lastName: a.lastName, email: a.email, phone: a.phone })
      // Keep the name shown in the header in step.
      try {
        const stored = localStorage.getItem("customer_profile")
        if (stored) {
          localStorage.setItem(
            "customer_profile",
            JSON.stringify({ ...JSON.parse(stored), firstName: a.firstName, lastName: a.lastName, phone: a.phone })
          )
        }
      } catch {
        // storage blocked or unreadable: the header catches up on next sign-in
      }
      showSuccess("Profile saved")
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Couldn't save. Try again.")
    } finally {
      setSavingProfile(false)
    }
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
            {profile === null ? (
              <div className="space-y-3">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                <FieldGroup>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Field>
                      <Input
                        placeholder="First name"
                        aria-label="First name"
                        autoComplete="given-name"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <Input
                        placeholder="Last name"
                        aria-label="Last name"
                        autoComplete="family-name"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <Input placeholder="Email" aria-label="Email" type="email" value={profile.email} readOnly disabled />
                    <p className="mt-1 text-xs text-muted-foreground">You sign in with this, so it can&apos;t be changed here.</p>
                  </Field>
                  <Field>
                    <Input
                      placeholder="Phone"
                      aria-label="Phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      required
                    />
                  </Field>
                </FieldGroup>
                {profileError && (
                  <p className="mt-3 text-sm font-medium text-destructive" role="alert">
                    {profileError}
                  </p>
                )}
                <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            )}
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
