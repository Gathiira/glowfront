import React from "react"
import Image from "next/image"
import { Header } from "@/components/landing/_components/header"
import AdminFlow from "../_components/admin-flow"

export const dynamic = "force-dynamic"

const AdminLogin = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1">
          <AdminFlow />
        </div>
        <div
          className="relative w-full flex-1 max-md:hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 60%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 60%)",
          }}
        >
          <Image
            src="/assets/glowbuddy-auth.webp"
            alt="Admin Panel"
            fill
            className="object-cover object-bottom-right"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
