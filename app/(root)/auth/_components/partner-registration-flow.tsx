"use client"

import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { PartnerAccountData } from "@/lib/types"
import {
  accountFormSchema,
  type AccountFormData,
} from "./step-account-creation"
import {
  businessFormSchema,
  type BusinessFormData,
} from "./step-business-setup"
import StepAccountCreation from "./step-account-creation"
import StepBusinessSetup from "./step-business-setup"
import { useLoading } from "@/components/loading-provider"
import { showError, showSuccess } from "@/lib/toast"

type Step = "account" | "business"

type Props = {
  onSuccess: () => void
  onBack: () => void
}

export default function PartnerRegistrationFlow({ onSuccess, onBack }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [step, setStep] = useState<Step>("account")
  const { startLoading, stopLoading, isLoading } = useLoading()

  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: "",
      country: "",
      agreeToTerms: false,
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

  const handleAccountSubmit = async (data: AccountFormData) => {
    startLoading(btnRef)
    try {
      const res = await fetch("/api/auth/partner-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phoneNumber,
          password: data.password,
          confirmPassword: data.confirmPassword,
          country: data.country,
          agreeToTerms: data.agreeToTerms,
        }),
      })

      const json = await res.json()

      if (json.code !== 200) {
        showError(json.msg || "Registration failed")
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

      showSuccess("Account created successfully")
      setStep("business")
    } catch (err) {
      showError(err)
    } finally {
      stopLoading()
    }
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
      onSuccess()
    } catch (err) {
      showError(err)
    }
  }

  const stepLabels: { key: Step; label: string }[] = [
    { key: "account", label: "Create Account" },
    { key: "business", label: "Business Setup" },
  ]

  const currentIndex = stepLabels.findIndex((s) => s.key === step)

  return (
    <div className="w-full py-4">
      <div className="mx-auto max-w-md space-y-6 p-3 pt-10">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {stepLabels.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                    i <= currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-sm sm:inline ${
                    i <= currentIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`h-px w-8 ${
                    i < currentIndex ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Forms */}
        {step === "account" && (
          <StepAccountCreation
            form={accountForm}
            onSubmit={handleAccountSubmit}
            onBack={onBack}
            btnRef={btnRef}
            isSubmitting={isLoading}
          />
        )}

        {step === "business" && (
          <StepBusinessSetup
            form={businessForm}
            onSubmit={handleBusinessSubmit}
            onBack={() => setStep("account")}
            isSubmitting={false}
          />
        )}
      </div>
    </div>
  )
}
