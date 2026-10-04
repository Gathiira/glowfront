"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

/** A password field with a show/hide eye at the end, built on the standard input group. */
export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  const [shown, setShown] = useState(false)
  return (
    <InputGroup className={className}>
      <InputGroupInput {...props} type={shown ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? "Hide password" : "Show password"}
          aria-pressed={shown}
        >
          {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
