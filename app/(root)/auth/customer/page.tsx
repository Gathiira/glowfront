import React from "react"
import Image from "next/image"
import { Header } from "@/components/landing/_components/header"
import CustomerFlow from "../_components/customer-flow"

export const dynamic = "force-dynamic"

const CustomerSignup = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1">
          <CustomerFlow />
        </div>
        <div className="relative w-full flex-1 max-md:hidden">
          <Image
            src="/assets/glowbuddy-auth.webp"
            alt="GlowBuddy for customers"
            fill
            className="object-cover object-bottom-right"
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerSignup
