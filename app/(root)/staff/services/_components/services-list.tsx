"use client"

import { useEffect, useState } from "react"
import type { ServiceDto, StaffTaskRateDto } from "@/lib/types"
import { fetchMyServices, fetchMyTasks } from "@/lib/api/leave"
import { showError } from "@/lib/toast"
import { money } from "@/lib/api/commissions"
import { usePagedList } from "@/lib/use-paged-list"

/** What customers can book you for, and your tasks and commission on each. */
export function ServicesList() {
  const pages = usePagedList(fetchMyServices, [])
  const services = pages.loaded ? pages.items : null
  const [tasks, setTasks] = useState<StaffTaskRateDto[] | null>(null)

  useEffect(() => {
    fetchMyTasks()
      .then(setTasks)
      .catch((e) => {
        setTasks([])
        showError(e)
      })
  }, [])

  const tasksFor = (serviceId: number) => (tasks ?? []).filter((t) => t.access !== "NO" && t.serviceIds.includes(serviceId))

  const groups = (services ?? []).reduce<Record<string, ServiceDto[]>>((acc, s) => {
    const key = s.categoryName ?? "Other"
    ;(acc[key] ??= []).push(s)
    return acc
  }, {})

  return (
    <>
      <p className="sp-lede">
        What customers can book you for, and the tasks you can claim on each with the commission you earn. Your manager
        sets these.
      </p>

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
                  <ul className="sp-task-rates" aria-label={`Your tasks on ${s.name}`}>
                    {tasksFor(s.id).length === 0 && tasks !== null && <li className="sp-task-none">No tasks for you on this</li>}
                    {tasksFor(s.id).map((t) => (
                      <li key={t.taskId}>
                        {t.taskName}
                        {t.percent != null && (
                          <>
                            {" "}
                            · <span className="sp-agreed">{t.percent}% agreed</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
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
