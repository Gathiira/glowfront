"use client"

import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import PartnerRegistrationFlow from "./partner-registration-flow"

const formSchema = z.object({
  email: z
    .string()
    .email("Email is required and must be a valid email address")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
})

type FormDataType = z.infer<typeof formSchema>

type Mode = "login" | "register" | "success"

const PartnerFlow = () => {
  const [mode, setMode] = useState<Mode>("login")

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: FormDataType) => {
    console.log("Form submitted with data:", data)
  }

  const handleRegistrationSuccess = () => {
    setMode("success")
  }

  if (mode === "register") {
    return (
      <PartnerRegistrationFlow
        onSuccess={handleRegistrationSuccess}
        onBack={() => setMode("login")}
      />
    )
  }

  if (mode === "success") {
    return (
      <div className="flex h-full w-full py-4">
        <div className="mx-auto max-w-md space-y-6 p-3 pt-10 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Account created!</h2>
            <p className="text-sm text-muted-foreground">
              Your partner account has been created successfully. You can now
              log in and start managing your business.
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

  return (
    <div className="flex w-full py-4">
      <div className="mx-auto max-w-md space-y-6 p-3 pt-10 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            GlowBuddy for professionals
          </h2>
          <small className="text-muted-foreground">
            Create an account or log in to manage your business
          </small>
        </div>
        <form id="partner-login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="partner-login-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    type="email"
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <PasswordInput
                    {...field}
                    id="partner-login-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                    className="py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <div className="flex flex-col gap-3">
          <Button type="submit" form="partner-login-form">
            Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setMode("register")}
          >
            Create an account
          </Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Looking to book an appointment?
          </p>
          <Link
            href="/auth/customer"
            className="text-sm font-medium underline underline-offset-4 hover:text-primary"
          >
            Go to GlowBuddy for customers
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PartnerFlow
