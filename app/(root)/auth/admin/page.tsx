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
        <div className="relative w-full flex-1 max-md:hidden">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80"
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
