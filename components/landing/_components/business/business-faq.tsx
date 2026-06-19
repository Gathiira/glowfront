"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { businessFaqs } from "@/components/landing/data"

export function BusinessFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="border-t py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-bold text-center md:text-3xl">Frequently asked questions</h2>

        <div className="mt-8 space-y-3">
          {businessFaqs.map((faq, i) => (
            <div key={i} className="rounded-xl border bg-card">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
              >
                {faq.question}
                <ChevronDown className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  openIndex === i && "rotate-180"
                )} />
              </button>
              {openIndex === i && (
                <div className="border-t px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
