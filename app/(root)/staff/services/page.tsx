"use client"

import { Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ServicesList } from "./_components/services-list"
import { RequestsSection } from "../requests/_components/requests-section"

export default function MyServices() {
  return (
    <Suspense>
      <MyServicesInner />
    </Suspense>
  )
}

/** Services you do, and requests to your manager (leave, advances); ?view=requests opens the second. */
function MyServicesInner() {
  const router = useRouter()
  const pathname = usePathname()
  const requests = useSearchParams().get("view") === "requests"
  const show = (next: "services" | "requests") =>
    router.replace(next === "requests" ? `${pathname}?view=requests` : pathname, { scroll: false })

  return (
    <>
      <h1 className="sp-h1">{requests ? "Requests" : "Services"}</h1>
      <div className="sp-segment" role="group" aria-label="Show" style={{ marginTop: "0.75rem" }}>
        <button type="button" aria-pressed={!requests} onClick={() => show("services")}>
          My services
        </button>
        <button type="button" aria-pressed={requests} onClick={() => show("requests")}>
          Requests
        </button>
      </div>
      <div style={{ marginTop: "1rem" }}>{requests ? <RequestsSection /> : <ServicesList />}</div>
    </>
  )
}
