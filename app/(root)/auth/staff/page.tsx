"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/landing/_components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showError } from "@/lib/toast"

export default function StaffLogin() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })
      const json = await res.json()
      if (json.code !== 200) {
        showError(json.msg || "Login failed")
        return
      }
      localStorage.setItem("customer_profile", JSON.stringify(json.data.profile))
      localStorage.setItem("staff_profile", JSON.stringify(json.data.staffProfile))
      router.push("/staff/commissions")
    } catch (err) {
      showError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <form onSubmit={submit} className="mx-auto mt-16 flex w-full max-w-sm flex-col gap-4 px-4">
        <h1 className="text-2xl font-semibold">Team member sign in</h1>
        <div className="space-y-1.5">
          <Label htmlFor="staff-identifier">Email or phone</Label>
          <Input
            id="staff-identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="staff-password">Password</Label>
          <Input
            id="staff-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
