"use client"

import React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useLoading } from "@/components/loading-provider"
import { showError, showSuccess } from "@/lib/toast"

const formSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormDataType = z.infer<typeof formSchema>

/** Staff sign-in, matching the managers' (partner) login look and feel. Staff accounts are created by their manager. */
const StaffFlow = () => {
  const router = useRouter()
  const { startLoading, stopLoading, isLoading } = useLoading()

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: { identifier: "", password: "" },
  })

  const handleLogin = async (data: FormDataType) => {
    startLoading()
    try {
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: data.identifier, password: data.password }),
      })
      const json = await res.json()
      if (json.code !== 200) {
        showError(json.msg || "Login failed")
        return
      }
      localStorage.setItem("customer_profile", JSON.stringify(json.data.profile))
      localStorage.setItem("staff_profile", JSON.stringify(json.data.staffProfile))
      showSuccess("Success")
      router.push("/staff/commissions")
    } catch (err) {
      showError(err)
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="flex w-full py-4">
      <div className="mx-auto w-full max-w-md space-y-6 p-3 pt-10 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">GlowBuddy for staff</h2>
          <small className="text-muted-foreground">Log in to see your pay, leave and services</small>
        </div>
        <form id="staff-login-form" onSubmit={form.handleSubmit(handleLogin)}>
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="staff-login-form-identifier"
                    aria-invalid={fieldState.invalid}
                    aria-label="Email or phone number"
                    placeholder="Enter your email or phone number"
                    autoComplete="username"
                    className="py-5"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <PasswordInput
                    {...field}
                    id="staff-login-form-password"
                    aria-invalid={fieldState.invalid}
                    aria-label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="py-5"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <Button type="submit" form="staff-login-form" size="lg" className="w-full py-5" disabled={isLoading}>
          Continue
        </Button>
        <p className="text-sm text-muted-foreground">No account yet? Your manager sets up your login.</p>

        <div>
          <p className="text-sm text-muted-foreground">Run the business?</p>
          <Link href="/auth/partner" className="text-sm font-medium underline underline-offset-4 hover:text-primary">
            Go to GlowBuddy for managers
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StaffFlow
