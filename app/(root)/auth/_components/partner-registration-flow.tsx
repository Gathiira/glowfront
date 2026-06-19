"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { PartnerAccountData } from "@/lib/types"
import { registerPartner } from "@/lib/api/partner"
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

type Step = "account" | "business"

type Props = {
  onSuccess: () => void
  onBack: () => void
}

export default function PartnerRegistrationFlow({ onSuccess, onBack }: Props) {
  const [step, setStep] = useState<Step>("account")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accountData, setAccountData] = useState<PartnerAccountData | null>(
    null
  )

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

  const handleAccountSubmit = (data: AccountFormData) => {
    setAccountData(data)
    setStep("business")
  }

  const handleBusinessSubmit = async (data: BusinessFormData) => {
    if (!accountData) return
    setIsSubmitting(true)

    try {
      const result = await registerPartner(accountData, data)
      if (result.success) {
        onSuccess()
      }
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsSubmitting(false)
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
          />
        )}

        {step === "business" && (
          <StepBusinessSetup
            form={businessForm}
            onSubmit={handleBusinessSubmit}
            onBack={() => {
              setStep("account")
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      <div className="absolute bottom-8 flex w-full justify-center gap-2 text-xs text-muted-foreground md:max-w-1/2">
        <a href="#">Support</a>•<a href="#">Privacy Policy</a>
      </div>
    </div>
  )
}
