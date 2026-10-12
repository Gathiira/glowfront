"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckoutDialog } from "@/components/dashboard/checkout-dialog"
import { MpesaPaymentsPanel } from "@/components/dashboard/mpesa-payments-panel"
import type { BookingDto, MySaleDto, SaleDto } from "@/lib/types"
import { fetchMyCheckoutBookings, fetchMySalesToday, money } from "@/lib/api/commissions"
import { formatDateShort } from "@/lib/date-utils"
import { showError } from "@/lib/toast"
import { staffFonts } from "../_lib/fonts"

export default function Sale() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<SaleDto | null>(null)
  const [today, setToday] = useState<MySaleDto[] | null>(null)
  // Their bookings still waiting to be checked out (last week to today), oldest first.
  const [waiting, setWaiting] = useState<BookingDto[] | null>(null)
  const [search, setSearch] = useState("")
  const [booking, setBooking] = useState<BookingDto | null>(null)

  const loadWaiting = () =>
    fetchMyCheckoutBookings()
      .then(setWaiting)
      .catch((e) => {
        setWaiting([])
        showError(e)
      })

  const q = search.trim().toLowerCase()
  const shown = (waiting ?? []).filter(
    (b) => !q || [b.customerName, b.customerPhone, b.serviceName].some((v) => v?.toLowerCase().includes(q))
  )

  const loadToday = () =>
    fetchMySalesToday()
      .then(setToday)
      .catch((e) => {
        setToday([])
        showError(e)
      })

  useEffect(() => {
    loadToday()
    loadWaiting()
  }, [])

  return (
    <>
      <h1 className="sp-h1">Sale</h1>
      <p className="sp-lede">
        Ring up a customer: add the services and how they paid. Afterwards, everyone who worked on it claims their own
        tasks in Claim.
      </p>

      <div className="sp-pay-grid" style={{ marginTop: "1.25rem" }}>
      <div>
      <div className="sp-slip">
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

      <section aria-labelledby="waiting-heading">
        <h2 id="waiting-heading" className="sp-h2">
          Waiting for checkout{waiting && waiting.length > 0 ? ` · ${waiting.length}` : ""}
        </h2>
        <div className="sp-slip">
          {waiting === null && <span className="sp-skel" style={{ width: "60%" }} aria-hidden />}
          {waiting?.length === 0 && <p className="sp-empty sp-empty-plain">No bookings waiting to be checked out.</p>}
          {waiting && waiting.length > 0 && (
            <>
              <input
                type="search"
                className="sp-input"
                placeholder="Search customer, phone or service"
                aria-label="Search bookings"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {shown.length === 0 && <p className="sp-empty sp-empty-plain">No booking matches “{search.trim()}”.</p>}
              <ul className="sp-tariff">
                {shown.map((b) => (
                  <li key={b.id}>
                    <span className="sp-tariff-name">
                      {b.customerName} · {b.serviceName}
                    </span>
                    <button type="button" className="sp-btn" onClick={() => setBooking(b)}>
                      Checkout
                    </button>
                    <span className="sp-tariff-sub">
                      {formatDateShort(b.bookingDate)} {b.bookingTime?.slice(0, 5)}
                      {b.unbilled ? " · not billed" : b.status === "NO_SHOW" ? " · no-show" : b.status === "PENDING" ? " · not accepted" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="today-heading">
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
      </div>

      {/* M-Pesa payments sit beside the sale (below it on phones): attach a late payment to a sale here. */}
      <section aria-labelledby="mpesa-heading">
        <h2 id="mpesa-heading" className="sp-h2" style={{ marginTop: 0 }}>
          M-Pesa payments
        </h2>
        <p className="sp-lede" style={{ marginTop: 0 }}>
          Payments no sale has claimed yet. Sold as M-Pesa before the payment came in? Find it by the customer&apos;s name or
          code and attach it.
        </p>
        <div className="sp-slip" style={{ marginTop: "0.75rem" }}>
          <MpesaPaymentsPanel staffMode className={staffFonts} />
        </div>
      </section>
      </div>

      <CheckoutDialog
        staffMode
        className={staffFonts}
        open={open || booking !== null}
        booking={booking}
        onClose={() => {
          setOpen(false)
          setBooking(null)
        }}
        onDone={(sale) => {
          setLast(sale)
          setOpen(false)
          setBooking(null)
          loadToday()
          loadWaiting()
        }}
      />
    </>
  )
}
