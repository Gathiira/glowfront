"use client"

import React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useRouter } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import { showError, showSuccess } from "@/lib/toast"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

const AdminFlow = () => {
  const router = useRouter()
  const { startLoading, stopLoading, isLoading } = useLoading()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const handleLogin = async (data: LoginFormData) => {
    startLoading()
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.email,
          password: data.password,
        }),
      })
      const json = await res.json()
      if (json.code !== 200) {
        showError(json.msg || "Login failed")
        return
      }
      if (json.data?.profile) {
        localStorage.setItem("admin_profile", JSON.stringify(json.data.profile))
      }
      showSuccess("Welcome, admin")
      router.push("/admin/home")
    } catch (err) {
      showError(err)
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center py-4">
      <div className="mx-auto w-full max-w-xl space-y-6 p-6 pt-10 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <small className="text-muted-foreground">
            Log in to manage the platform
          </small>
        </div>

        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="email"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    placeholder="Email address"
                    type="email"
                    autoComplete="email"
                    className="py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <PasswordInput
                    {...field}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              className="w-full py-5"
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminFlow
