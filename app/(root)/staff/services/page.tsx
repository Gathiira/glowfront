"use client"

import type { ServiceDto } from "@/lib/types"
import { fetchMyServices } from "@/lib/api/leave"
import { money } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"

export default function MyServices() {
  const pages = usePagedList(fetchMyServices, [])
  const services = pages.loaded ? pages.items : null

  const groups = (services ?? []).reduce<Record<string, ServiceDto[]>>((acc, s) => {
    const key = s.categoryName ?? "Other"
    ;(acc[key] ??= []).push(s)
    return acc
  }, {})

  return (
    <>
      <h1 className="sp-h1">Services</h1>
      <p className="sp-lede">What customers can book you for. Your manager sets these and their prices.</p>

      <div className="sp-slip" style={{ marginTop: "1.25rem", maxWidth: 640 }}>
        {services === null && (
          <ul className="sp-tariff" aria-hidden>
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <span className="sp-skel" style={{ width: "55%" }} />
                <span className="sp-skel" style={{ width: "4rem" }} />
              </li>
            ))}
          </ul>
        )}
        {services?.length === 0 && (
          <p className="sp-empty sp-empty-plain">
            You&apos;re not set up for any services yet, so customers can&apos;t book you online. Ask your manager to add
            the services you do.
          </p>
        )}
        {Object.entries(groups).map(([group, items]) => (
          <section key={group} aria-label={group}>
            {Object.keys(groups).length > 1 && <h2 className="sp-tariff-group">{group}</h2>}
            <ul className="sp-tariff">
              {items.map((s) => (
                <li key={s.id}>
                  <span className="sp-tariff-name">{s.name}</span>
                  <span className="sp-tariff-price">
                    <span className="sp-currency">KSH</span>
                    {money(s.price)}
                  </span>
                  <span className="sp-tariff-sub">
                    {s.durationMinutes} min{s.description ? ` · ${s.description}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {pages.hasMore && (
          <button type="button" className="sp-more" onClick={pages.loadMore} disabled={pages.loading}>
            {pages.loading ? "Loading…" : "Load more services"}
          </button>
        )}
      </div>
    </>
  )
}
