"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckoutDialog } from "@/components/dashboard/checkout-dialog"
import type { MySaleDto, SaleDto } from "@/lib/types"
import { fetchMySalesToday, money } from "@/lib/api/commissions"
import { showError } from "@/lib/toast"
import { staffFonts } from "../_lib/fonts"

export default function Sale() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<SaleDto | null>(null)
  const [today, setToday] = useState<MySaleDto[] | null>(null)

  const loadToday = () =>
    fetchMySalesToday()
      .then(setToday)
      .catch((e) => {
        setToday([])
        showError(e)
      })

  useEffect(() => {
    loadToday()
  }, [])

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

      <section aria-labelledby="today-heading" style={{ maxWidth: 640 }}>
        <h2 id="today-heading" className="sp-h2">
          Your sales today{today && today.length > 0 ? ` · ${today.length}` : ""}
        </h2>
        <div className="sp-slip">
          {today === null && (
            <ul className="sp-tariff" aria-hidden>
              {[0, 1].map((i) => (
                <li key={i}>
                  <span className="sp-skel" style={{ width: "55%" }} />
                  <span className="sp-skel" style={{ width: "4rem" }} />
                </li>
              ))}
            </ul>
          )}
          {today?.length === 0 && <p className="sp-empty sp-empty-plain">Sales you ring up today show here.</p>}
          {today && today.length > 0 && (
            <ul className="sp-tariff">
              {today.map((s) => (
                <li key={s.id}>
                  <span className="sp-tariff-name">{s.services.join(", ")}</span>
                  <span className="sp-tariff-price">
                    <span className="sp-currency">KSH</span>
                    {money(s.grandTotal)}
                  </span>
                  <span className="sp-tariff-sub">
                    {new Date(s.transactionDate).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} ·{" "}
                    {s.paymentMethod === "MPESA" ? "M-Pesa" : "Cash"}
                    {s.customerName ? ` · ${s.customerName}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CheckoutDialog
        staffMode
        className={staffFonts}
        open={open}
        onClose={() => setOpen(false)}
        onDone={(sale) => {
          setLast(sale)
          setOpen(false)
          loadToday()
        }}
      />
    </>
  )
}
