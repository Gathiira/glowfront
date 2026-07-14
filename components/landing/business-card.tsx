import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { gradients } from "./data"
import type { BusinessCardDto } from "@/lib/types"

export function BusinessCard({ business, index }: { business: BusinessCardDto; index: number }) {
  const image = business.coverImageUrl || business.coverUrl || business.logoUrl

  return (
    <Link href={`/business/${business.slug}`} className="block">
      <Card className="w-72 shrink-0 snap-start">
        <CardContent className="p-0">
          <div
            className={cn(
              "relative flex h-36 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br",
              gradients[index % gradients.length]
            )}
          >
            {image ? (
              <Image
                src={image}
                alt={business.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary/30">
                {business.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="space-y-2 p-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
              {business.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{business.overallRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({business.totalReviews.toLocaleString()})
              </span>
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {business.primaryCategory || business.categories[0] || ""}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{business.address}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
