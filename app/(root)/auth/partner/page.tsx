import React from "react"
import Image from "next/image"
import { Header } from "@/components/landing/_components/header"
import PartnerFlow from "../_components/partner-flow"

export const dynamic = "force-dynamic"

const PartnerSignup = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1">
          <PartnerFlow />
        </div>
        <div className="relative w-full flex-1 max-md:hidden">
          <Image
            src="/assets/login-image.jpg"
            alt="GlowBuddy for professionals"
            fill
            className="object-cover object-right"
          />
        </div>
      </div>
    </div>
  )
}

export default PartnerSignup
