import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Review } from "@/components/landing/data"

export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="border-t py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="#">
            View all <ArrowRight className="ml-1 size-3.5" />
          </Link>
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((r, i) => (
          <Card key={i} className="w-80 shrink-0 snap-start">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{r.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
