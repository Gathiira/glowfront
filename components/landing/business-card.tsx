import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ListingBusiness } from "./data"
import { gradients } from "./data"

export function BusinessCard({ business, index }: { business: ListingBusiness; index: number }) {
  return (
    <Card className="w-72 shrink-0 snap-start">
      <CardContent className="p-0">
        <div className={cn(
          "flex h-36 items-center justify-center rounded-t-xl bg-gradient-to-br",
          gradients[index % gradients.length]
        )}>
          <span className="px-3 text-center text-xs font-medium text-muted-foreground">
            {business.imageLabel}
          </span>
        </div>
        <div className="space-y-2 p-3">
          {business.tag && (
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {business.tag}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {business.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{business.rating.toFixed(1)}</span>
          </div>
          <p className="line-clamp-1 text-xs text-muted-foreground">{business.location}</p>
          <p className="text-xs text-muted-foreground">
            {business.category} &middot; {business.reviewCount.toLocaleString()} reviews
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
