"use client"

import React, { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import { showError, showSuccess } from "@/lib/toast"

const loginSchema = z.object({
  email: z.email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z
  .object({
    email: z.email("Valid email is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

type Mode = "login" | "register" | "success"

const CustomerFlow = () => {
  const router = useRouter()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mode, setMode] = useState<Mode>("login")
  const { startLoading, stopLoading, isLoading } = useLoading()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      agreeToTerms: false,
    },
  })

  const handleLogin = async (data: LoginFormData) => {
    startLoading(btnRef)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: data.email, password: data.password }),
      })

      const json = await res.json()

      if (json.code !== 200) {
        showError(json.msg || "Login failed")
        return
      }

      if (json.data?.profile) {
        localStorage.setItem("customer_profile", JSON.stringify(json.data.profile))
      }

      showSuccess("Success")
      router.push("/platform/home")
    } catch (err) {
      showError(err)
    } finally {
      stopLoading()
    }
  }

  const handleRegister = (data: RegisterFormData) => {
    console.log("Customer register:", data)
    setMode("success")
  }

  if (mode === "success") {
    return (
      <div className="flex h-full w-full py-4">
        <div className="mx-auto max-w-md space-y-6 p-3 pt-10 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Welcome to GlowBuddy!</h2>
            <p className="text-sm text-muted-foreground">
              Your account has been created. Start exploring and booking
              appointments with top beauty and wellness professionals.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full py-5"
            onClick={() => setMode("login")}
          >
            Go to login
          </Button>
        </div>
      </div>
    )
  }

  if (mode === "register") {
    return (
      <div className="flex h-full w-full py-4">
        <div className="mx-auto max-w-md space-y-6 p-3 pt-10">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Join GlowBuddy and discover amazing beauty services near you
            </p>
          </div>

          <form onSubmit={registerForm.handleSubmit(handleRegister)}>
            <FieldGroup>
              <Controller
                name="email"
                control={registerForm.control}
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

              <div className="flex gap-3">
                <Controller
                  name="firstName"
                  control={registerForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-1">
                      <Input
                        {...field}
                        placeholder="First name"
                        autoComplete="given-name"
                        className="py-5"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="lastName"
                  control={registerForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-1">
                      <Input
                        {...field}
                        placeholder="Last name"
                        autoComplete="family-name"
                        className="py-5"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="password"
                control={registerForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <PasswordInput
                      {...field}
                      placeholder="Password"
                      autoComplete="new-password"
                      className="py-5"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={registerForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <PasswordInput
                      {...field}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      className="py-5"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="agreeToTerms"
                control={registerForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="customer-agree-terms"
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className="mt-1 size-4 rounded border-input accent-primary"
                      />
                      <label
                        htmlFor="customer-agree-terms"
                        className="text-sm text-muted-foreground"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="underline underline-offset-4 hover:text-primary"
                        >
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="underline underline-offset-4 hover:text-primary"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="submit"
                size="lg"
                className="w-full py-5"
                disabled={isLoading}
              >
                Create account
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="w-full py-5"
                onClick={() => setMode("login")}
                disabled={isLoading}
              >
                Already have an account? Log in
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full py-4">
      <div className="mx-auto max-w-md space-y-6 p-3 pt-10 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">GlowBuddy for customers</h2>
          <small className="text-muted-foreground">
            Log in to book appointments and discover beauty services
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
                    placeholder="Enter your email address"
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
                    placeholder="Enter your password"
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
              ref={btnRef}
              type="submit"
              size="lg"
              className="w-full py-5"
              disabled={isLoading}
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full py-5"
              onClick={() => setMode("register")}
              disabled={isLoading}
            >
              Create an account
            </Button>
          </div>
        </form>
        <div>
          <p className="text-sm text-muted-foreground">
            Are you a professional looking to list your business?
          </p>
          <Link
            href="/auth/partner"
            className="text-sm font-medium underline underline-offset-4 hover:text-primary"
          >
            Go to GlowBuddy for professionals
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CustomerFlow
