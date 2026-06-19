import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BusinessCard } from "./business-card"
import type { ListingBusiness } from "./data"

export function ScrollSection({
  title,
  subtitle,
  items,
  href,
}: {
  title: string
  subtitle?: string
  items: ListingBusiness[]
  href?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 300
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {href && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={href}>
                View all <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <BusinessCard key={item.id} business={item} index={i} />
        ))}
      </div>
    </section>
  )
}
