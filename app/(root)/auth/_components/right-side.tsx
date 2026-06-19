import Image from "next/image"
import React from "react"

const RightSide = () => {
  return (
    <div className="relative w-full max-md:hidden">
      <Image
        src="/assets/glowbuddy-auth.webp"
        alt="Glow Buddy for professionals"
        fill
        className="object-cover object-right"
      />
    </div>
  )
}

export default RightSide
