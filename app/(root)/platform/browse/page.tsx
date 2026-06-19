"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useCustomer } from "@/lib/customer-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import { Star, MapPin, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "All",
  "Hair Salon",
  "Nails",
  "Barber",
  "Massage",
  "Beauty Salon",
  "Tattooing and Piercing",
]

export default function Browse() {
  const { businesses } = useCustomer()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.town.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === "All" || b.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [businesses, search, activeCategory])

  return (
    <div>
      <PageHeader title="Find a Business" description="Discover top-rated beauty & wellness services near you" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search businesses or locations..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          No businesses found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <Link key={b.id} href={`/platform/browse/${b.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex h-32 items-center justify-center rounded-t-xl bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-3xl font-bold text-primary/30">{b.name.charAt(0)}</span>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{b.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{b.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({b.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{b.category}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {b.town}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
