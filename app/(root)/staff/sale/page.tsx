"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckoutDialog } from "@/components/dashboard/checkout-dialog"
import type { SaleDto } from "@/lib/types"
import { money } from "@/lib/api/commissions"
import { staffFonts } from "../_lib/fonts"

export default function Sale() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<SaleDto | null>(null)

  return (
    <>
      <h1 className="sp-h1">Sale</h1>
      <p className="sp-lede">
        Ring up a customer: add the services and how they paid. Afterwards, everyone who worked on it claims their own
        tasks in Claim.
      </p>

      <div className="sp-slip" style={{ marginTop: "1.25rem", maxWidth: 640 }}>
        <button type="button" className="sp-btn" style={{ width: "100%" }} onClick={() => setOpen(true)}>
          New sale
        </button>

        {last && (
          <div style={{ marginTop: "1rem" }} role="status">
            <p className="sp-h2" style={{ margin: "0 0 0.25rem" }}>
              Last sale
            </p>
            <ul className="sp-tariff">
              {(last.items ?? []).map((item, i) => (
                <li key={item.id ?? i}>
                  <span className="sp-tariff-name">{item.serviceName}</span>
                  <span className="sp-tariff-price">
                    <span className="sp-currency">KSH</span>
                    {money(item.price)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="sp-month">
              Total <strong>KSH {money(last.grandTotal)}</strong> · {last.paymentMethod === "MPESA" ? "M-Pesa" : "Cash"}
              {last.customerName ? ` · ${last.customerName}` : ""}
            </p>
            <Link href="/staff/claim" className="sp-more" style={{ display: "inline-flex", alignItems: "center" }}>
              Claim the tasks you did →
            </Link>
          </div>
        )}
      </div>

      <CheckoutDialog
        staffMode
        className={staffFonts}
        open={open}
        onClose={() => setOpen(false)}
        onDone={(sale) => {
          setLast(sale)
          setOpen(false)
        }}
      />
    </>
  )
}
