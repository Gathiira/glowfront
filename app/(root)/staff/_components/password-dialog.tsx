"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { changeMyPassword } from "@/lib/api/commissions"
import { showSuccess } from "@/lib/toast"
import { staffFonts } from "../_lib/fonts"

const empty = { current: "", next: "", again: "" }

/** Set your own password (replacing the default your manager gave you). */
export function PasswordDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.next.length < 8) return setError("Your new password must be at least 8 characters.")
    if (form.next !== form.again) return setError("The new passwords don't match.")
    setError(null)
    setSaving(true)
    try {
      await changeMyPassword(form.current, form.next)
      showSuccess("Password changed")
      setForm(empty)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't change it. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          setForm(empty)
          setError(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className="sp-iconbtn" aria-label="Change password">
          <KeyRound className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </DialogTrigger>
      <DialogContent className={`sp-dialog ${staffFonts}`}>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="sp-form">
          <p className="sp-lede" style={{ margin: 0 }}>
            Using the password your manager gave you? Set your own; after that only you know it.
          </p>
          <div className="sp-field">
            <label htmlFor="pw-current">Current password</label>
            <input
              id="pw-current"
              className="sp-input"
              type="password"
              autoComplete="current-password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              required
            />
          </div>
          <div className="sp-field">
            <label htmlFor="pw-new">New password</label>
            <input
              id="pw-new"
              className="sp-input"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
              required
            />
          </div>
          <div className="sp-field">
            <label htmlFor="pw-again">New password again</label>
            <input
              id="pw-again"
              className="sp-input"
              type="password"
              autoComplete="new-password"
              value={form.again}
              onChange={(e) => setForm({ ...form, again: e.target.value })}
              required
            />
          </div>
          {error && (
            <p className="sp-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="sp-btn" disabled={saving}>
            {saving ? "Saving…" : "Change password"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
