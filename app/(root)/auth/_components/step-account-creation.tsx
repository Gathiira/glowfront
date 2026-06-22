"use client"

import React from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COUNTRIES } from "@/lib/types"

export const accountFormSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z
    .string()
    .min(6, "Valid phone number is required")
    .max(20, "Phone number too long"),
  country: z.string().min(1, "Country is required"),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
})

export type AccountFormData = z.infer<typeof accountFormSchema>

type Props = {
  form: UseFormReturn<AccountFormData>
  onSubmit: (data: AccountFormData) => void
  onBack: () => void
}

export default function StepAccountCreation({
  form,
  onSubmit,
  onBack,
}: Props) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Join Glow Buddy and start managing your business
        </p>
      </div>

      <FieldGroup className="mt-6">
        <Controller
          name="email"
          control={form.control}
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
            control={form.control}
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
            control={form.control}
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
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                placeholder="Phone number"
                type="tel"
                autoComplete="tel"
                className="py-5"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="country"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  className="w-full py-5"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          name="agreeToTerms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree-to-terms"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className="mt-1 size-4 rounded border-input accent-primary"
                />
                <label htmlFor="agree-to-terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline underline-offset-4 hover:text-primary">
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
        <Button type="submit" size="lg" className="w-full py-5">
          Continue
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full py-5"
          onClick={onBack}
        >
          Back to login
        </Button>
      </div>
    </form>
  )
}
