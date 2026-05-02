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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
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
    <div className="mx-auto max-w-1/2 text-center">
      <h2>Glow Buddy for professionals</h2>
      <p>Create an account or log in to manager your business</p>
      <form onSubmit={form.handleSubmit(onSubmit)}></form>

      <form id="partner-login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="partner-login-form-email">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="partner-login-form-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email address"
                  autoComplete="off"
                  type="email"
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
        <Button type="submit" form="form-rhf-demo">
          Continue
        </Button>
      </Field>
    </div>
  )
}

export default LeftSide
