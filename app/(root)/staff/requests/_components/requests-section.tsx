"use client"

import { useEffect, useState } from "react"
import { fetchMyCommissions } from "@/lib/api/commissions"
import { LeaveSection } from "./leave-section"
import { Advances } from "../../commissions/_components/advances"

/** Requests to the manager: time off and pay advances. */
export function RequestsSection() {
  // For the advance form's "earned and not paid yet" hint.
  const [unpaid, setUnpaid] = useState<number | null>(null)
  useEffect(() => {
    fetchMyCommissions({}, 1)
      .then((r) => setUnpaid(r.summary.unpaid))
      .catch(() => setUnpaid(null))
  }, [])

  return (
    <>
      <p className="sp-lede">Time off and pay advances. Your manager approves or turns them down.</p>
      <div style={{ marginTop: "1.5rem" }}>
        <LeaveSection />
      </div>
      <Advances unpaid={unpaid} />
    </>
  )
}
