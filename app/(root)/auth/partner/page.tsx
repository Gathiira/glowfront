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
        <div className="flex flex-1 items-center justify-center">
          <PartnerFlow />
        </div>
        <div className="relative w-full max-md:hidden md:w-[45%] lg:w-[55%]">
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
