"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { businessTestimonials } from "@/components/landing/data"

const ITEMS_PER_PAGE = 6

export function BusinessTestimonials() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(businessTestimonials.length / ITEMS_PER_PAGE)

  const featured = businessTestimonials.slice(0, 1)
  const rest = businessTestimonials.slice(1)
  const visible = rest.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <section className="border-t bg-muted/20 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-center md:text-3xl">Top-rated by the industry</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
          Being the world&apos;s most-loved platform doesn&apos;t happen by accident. Discover why businesses love Glowbuddy.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((t) => (
            <div key={t.name} className="md:col-span-2 rounded-xl border bg-card p-6">
              <div className="mb-3">
                <p className="text-lg font-semibold italic leading-snug">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4">{t.fullText}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Play className="size-3.5" />
                  Play video
                </Button>
              </div>
            </div>
          ))}

          {/* Featured review card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              &ldquo;Glowbuddy offers my clients a professional appointment booking experience with
              seamless online booking features, automated reminder emails and texts, advanced POS
              capabilities and the best payment processing rates I could get for my salon business.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">PB</div>
              <div>
                <p className="text-sm font-medium">Pamela B</p>
                <p className="text-xs text-muted-foreground">Salon owner, NYC</p>
              </div>
            </div>
            <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs">
              See more
            </Button>
          </div>
        </div>

        {/* More testimonials grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => (
            <div key={t.name} className="rounded-xl border bg-card p-5">
              <div className="mb-2 flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-2 text-sm font-semibold">&ldquo;{t.text}&rdquo;</p>
              <p className="text-xs text-muted-foreground line-clamp-3">{t.fullText}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="text-xs">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-muted-foreground">{t.location}</p>
                </div>
              </div>
              <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                See more
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
