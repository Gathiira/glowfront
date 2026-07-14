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
import { useRouter } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import { showError, showSuccess } from "@/lib/toast"
import PartnerRegistrationFlow from "./partner-registration-flow"
import StepBusinessSetup from "./step-business-setup"
import {
  businessFormSchema,
  type BusinessFormData,
} from "./step-business-setup"

const formSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormDataType = z.infer<typeof formSchema>

type Mode = "login" | "register" | "setup"

const PartnerFlow = () => {
  const router = useRouter()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mode, setMode] = useState<Mode>("login")
  const { startLoading, stopLoading, isLoading } = useLoading()

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const businessForm = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "",
      website: "",
      categoryId: "",
      serviceType: undefined,
      location: { lat: 0, lng: 0, address: "", town: "" },
    },
  })

  const handleLogin = async (data: FormDataType) => {
    startLoading(btnRef)
    try {
      const res = await fetch("/api/auth/partner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      })

      const json = await res.json()

      if (json.code !== 200) {
        showError(json.msg || "Login failed")
        return
      }

      if (json.data?.profile) {
        localStorage.setItem(
          "customer_profile",
          JSON.stringify(json.data.profile)
        )
      }

      if (json.data?.partnerProfile) {
        localStorage.setItem(
          "partner_profile",
          JSON.stringify(json.data.partnerProfile)
        )
      }

      showSuccess("Success")

      const setupCompleted = json.data?.partnerProfile?.setupCompleted
      if (setupCompleted) {
        router.push("/dashboard/home")
      } else {
        setMode("setup")
      }
    } catch (err) {
      showError(err)
    } finally {
      stopLoading()
    }
  }

  const handleRegistrationSuccess = () => {
    setMode("setup")
  }

  const handleBusinessSubmit = async (data: BusinessFormData) => {
    try {
      const res = await fetch("/api/auth/partner-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: data.businessName,
          website: data.website || null,
          categoryId: Number(data.categoryId),
          serviceLocationType: data.serviceType === "physical" ? "PHYSICAL_LOCATION" : "MOBILE_OPERATOR",
          location: {
            streetAddress: data.location.address,
            city: data.location.town,
            latitude: data.location.lat,
            longitude: data.location.lng,
          },
        }),
      })

      const json = await res.json()

      if (json.code !== 200) {
        showError(json.msg || "Failed to save business")
        return
      }

      if (json.data?.partnerProfile) {
        localStorage.setItem(
          "partner_profile",
          JSON.stringify(json.data.partnerProfile)
        )
      }

      showSuccess("Business setup complete")
      router.push("/dashboard/home")
    } catch (err) {
      showError(err)
    }
  }

  if (mode === "register") {
    return (
      <PartnerRegistrationFlow
        onSuccess={handleRegistrationSuccess}
        onBack={() => setMode("login")}
      />
    )
  }

  if (mode === "setup") {
    return (
      <div className="w-full py-4">
        <div className="mx-auto max-w-md space-y-6 p-3 pt-10">
          <div className="flex items-center justify-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              2
            </div>
            <span className="hidden text-sm text-foreground sm:inline">
              Business Setup
            </span>
          </div>
          <StepBusinessSetup
            form={businessForm}
            onSubmit={handleBusinessSubmit}
            onBack={() => setMode("login")}
            isSubmitting={false}
          />
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
        <form id="partner-login-form" onSubmit={form.handleSubmit(handleLogin)}>
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="partner-login-form-identifier"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email or phone number"
                    autoComplete="off"
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
          <Button
            ref={btnRef}
            type="submit"
            form="partner-login-form"
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
