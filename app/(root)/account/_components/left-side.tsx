"use client"

import React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
  email: z
    .email("Email is required and must be a valid email address")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
})

type FormDataType = z.infer<typeof formSchema>

const LeftSide = () => {
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

  return (
    <div className="w-full py-4">
      <div className="mx-auto max-w-md space-y-6 p-3 pt-10 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            Glow Buddy for professionals
          </h2>
          <small className="text-muted-foreground">
            Create an account or log in to manager your business.
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
          </FieldGroup>
        </form>
        <Field orientation="responsive">
          <Button type="submit" form="partner-login-form">
            Continue
          </Button>
        </Field>

        <div>
          <p>Are you a customer looking to book an appointment?</p>
          <Link href="#">Go to GlowBuddy for customers</Link>
        </div>
      </div>
      <div className="absolute bottom-8 flex w-full justify-center gap-2 text-xs text-muted-foreground md:max-w-1/2">
        <Link href="#">Support</Link>•<Link href="#">Privacy Policy</Link>
      </div>
    </div>
  )
}

export default LeftSide
