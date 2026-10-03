"use client"

import { MpesaPaymentsPanel } from "@/components/dashboard/mpesa-payments-panel"
import { staffFonts } from "../_lib/fonts"

export default function MpesaPayments() {
  return (
    <>
      <h1 className="sp-h1">M-Pesa</h1>
      <p className="sp-lede">
        Payments to the till that no sale has claimed yet. Sold as M-Pesa before the payment came in? Find it by the
        customer&apos;s name or code and attach it to the sale.
      </p>
      <div className="sp-slip" style={{ marginTop: "1.25rem", maxWidth: 640 }}>
        <MpesaPaymentsPanel staffMode className={staffFonts} />
      </div>
    </>
  )
}
