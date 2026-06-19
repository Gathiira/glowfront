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
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ServiceType } from "@/lib/types"
import { useCategories } from "@/lib/api/swr"
import LocationPicker from "./location-picker"

export const businessFormSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    website: z
      .string()
      .url("Must be a valid URL")
      .or(z.literal(""))
      .optional(),
    categoryId: z.string().min(1, "Please select a category"),
    serviceType: z.enum(["physical", "mobile"]),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().min(1, "Please select a location on the map"),
      town: z.string(),
    }),
  })
  .refine((data) => data.serviceType !== undefined, {
    message: "Please select how you provide services",
    path: ["serviceType"],
  })

export type BusinessFormData = z.infer<typeof businessFormSchema>

type Props = {
  form: UseFormReturn<BusinessFormData>
  onSubmit: (data: BusinessFormData) => void
  onBack: () => void
  isSubmitting: boolean
}

const serviceTypeOptions: { value: ServiceType; label: string }[] = [
  {
    value: "physical",
    label: "Clients come to me at a physical location",
  },
  {
    value: "mobile",
    label: "I visit my clients as a mobile operator",
  },
]

export default function StepBusinessSetup({
  form,
  onSubmit,
  onBack,
  isSubmitting,
}: Props) {
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories()

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Set up your business</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your business so clients can find you
        </p>
      </div>

      <FieldGroup className="mt-6">
        <Controller
          name="businessName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                placeholder="Business name"
                className="py-5"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                placeholder="Website (optional)"
                type="url"
                className="py-5"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Category */}
        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={categoriesLoading}
              >
                <SelectTrigger
                  className="w-full py-5"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue
                    placeholder={
                      categoriesLoading
                        ? "Loading categories..."
                        : categoriesError
                          ? "Failed to load"
                          : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
              {categoriesError && (
                <p className="text-sm text-destructive">Failed to load categories</p>
              )}
            </Field>
          )}
        />

        {/* Service type */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Where do you provide your services?</p>
          <Controller
            name="serviceType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex flex-col gap-2">
                  {serviceTypeOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        field.value === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-ring"
                      }`}
                    >
                      <input
                        type="radio"
                        name="serviceType"
                        value={opt.value}
                        checked={field.value === opt.value}
                        onChange={() => field.onChange(opt.value)}
                        className="size-4 accent-primary"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Select your location</p>
          <p className="text-xs text-muted-foreground">
            Pin your business location on the map
          </p>
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <LocationPicker
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          className="w-full py-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full py-5"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
      </div>
    </form>
  )
}
