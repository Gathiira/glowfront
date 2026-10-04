"use client"

import { useEffect, useState } from "react"
import { Copy, Eye, EyeOff, Mail, MessageSquare, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useConfirm } from "@/components/ui/use-confirm"
import type { StaffDto, StaffLoginDto } from "@/lib/types"
import { createStaffLogin, fetchStaffLogin, resetStaffLogin, sendStaffLogin } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"

/**
 * The member's staff portal login. The generated default password is shown only while it's still theirs; once they
 * set their own, nobody sees it and the manager can only reset it to a new default.
 */
export function LoginCard({ member }: { member: StaffDto }) {
  const [login, setLogin] = useState<StaffLoginDto | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ email: "", phone: "" })
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    fetchStaffLogin(member.id).then(setLogin).catch(showError)
  }, [member.id])

  const run = async (work: () => Promise<void>) => {
    setBusy(true)
    try {
      await work()
    } catch (err) {
      showError(err)
    } finally {
      setBusy(false)
    }
  }

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    run(async () => {
      setLogin(await createStaffLogin(member.id, { email: form.email.trim(), phone: form.phone.trim() }))
      setRevealed(true)
      showSuccess("Login created")
    })
  }

  const reset = async () => {
    const ok = await confirm({
      title: `Reset ${member.name}'s password?`,
      description:
        "Their current password stops working and a new default password is generated for you to share. They should set their own after signing in.",
      confirmLabel: "Reset password",
      destructive: true,
    })
    if (!ok) return
    run(async () => {
      setLogin(await resetStaffLogin(member.id))
      setRevealed(true)
      showSuccess("Password reset to a new default")
    })
  }

  const message = login?.defaultPassword
    ? `Hi ${member.name}, sign in to the GlowBuddy staff portal with ${login.phone} or ${login.email} and the password ${login.defaultPassword}. Please set your own password after signing in.`
    : ""

  const copy = () =>
    navigator.clipboard
      .writeText(message)
      .then(() => showSuccess("Login details copied"))
      .catch(() => showError(new Error("Couldn't copy. Select the password and copy it instead.")))

  const send = (channel: "SMS" | "EMAIL") =>
    run(async () => {
      await sendStaffLogin(member.id, channel)
      showSuccess(`Login details sent by ${channel === "SMS" ? "SMS" : "email"}`)
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff portal login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {login === null && <p className="text-muted-foreground">Loading...</p>}

        {login && !login.hasLogin && (
          <form onSubmit={create} className="space-y-3">
            <p className="text-muted-foreground">
              No login yet. Add their phone and email to create one with a default password you share with them.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="login-phone">Phone</Label>
              <Input
                id="login-phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? "Creating..." : "Create login"}
            </Button>
          </form>
        )}

        {login?.hasLogin && (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="truncate">{login.phone}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate">{login.email}</dd>
            </dl>

            {login.defaultPassword ? (
              <div className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Default password</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-background px-2 py-1 font-mono text-base tracking-wider">
                      {revealed ? login.defaultPassword : "••••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRevealed((v) => !v)}
                      aria-label={revealed ? "Hide password" : "Show password"}
                    >
                      {revealed ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Shown until they set their own password; after that it&apos;s hidden from everyone.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={copy} disabled={busy}>
                    <Copy aria-hidden />
                    Copy details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => send("SMS")} disabled={busy}>
                    <MessageSquare aria-hidden />
                    Send by SMS
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => send("EMAIL")} disabled={busy}>
                    <Mail aria-hidden />
                    Send by email
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">They&apos;ve set their own password, so it isn&apos;t shown.</p>
            )}

            <Button variant="outline" size="sm" onClick={reset} disabled={busy}>
              <RotateCcw aria-hidden />
              Reset to a new default password
            </Button>
          </>
        )}
      </CardContent>
      {confirmDialog}
    </Card>
  )
}
