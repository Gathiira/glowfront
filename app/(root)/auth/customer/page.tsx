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
        <div className="flex flex-1 items-center justify-center">
          <CustomerFlow />
        </div>
        <div className="relative w-full max-md:hidden md:w-[45%] lg:w-[55%]">
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
