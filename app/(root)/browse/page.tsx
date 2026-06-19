"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, ChevronDown, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/landing/_components/header"
import { Footer } from "@/components/landing/_components/footer"
import { BusinessCard } from "@/components/landing/business-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  recommended,
  newBusinesses,
  newWithTag,
  trending,
  dealsBusinesses,
  browseBusinesses,
  allCategories,
} from "@/components/landing/data"
import type { ListingBusiness } from "@/components/landing/data"

const cities = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"]

const subCategories: Record<string, string[]> = {
  "Beauty Salons": ["Hair Styling", "Makeup", "Facials", "Waxing", "Nails"],
  "Hair Salons": ["Haircuts", "Coloring", "Styling", "Treatment", "Extensions"],
  "Barbers": ["Haircuts", "Beard Trim", "Shave", "Hot Towel", "Kids Cut"],
  "Nail Salons": ["Manicure", "Pedicure", "Gel Nails", "Acrylic", "Nail Art"],
  "Spas & Saunas": ["Massage", "Facial", "Body Scrub", "Sauna", "Steam Room"],
  "Massages": ["Swedish", "Deep Tissue", "Hot Stone", "Aromatherapy", "Sports"],
  "Waxing Salons": ["Face Waxing", "Leg Waxing", "Bikini Wax", "Brazilian Wax", "Underarm Wax", "Back Wax", "Men's Waxing", "Full Body Wax", "Sugaring", "Hollywood Wax"],
  "Eyebrows & Lashes": ["Brow Shaping", "Lash Extensions", "Lash Lift", "Brow Lamination", "Tinting"],
  "Medspas": ["Botox", "Fillers", "Laser Hair Removal", "Chemical Peels", "Microneedling"],
  "Tattooing & Piercing": ["Tattoo", "Piercing", "Cover Up", "Custom Design"],
}

const allBusinesses: ListingBusiness[] = [
  ...recommended,
  ...newBusinesses,
  ...newWithTag,
  ...trending,
  ...dealsBusinesses,
  ...browseBusinesses,
]

function dedupe<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const uniqueBusinesses = dedupe(allBusinesses)

export default function BrowsePage() {
  const [selectedCat, setSelectedCat] = useState(allCategories[0])
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState(cities[0])

  const subs = subCategories[selectedCat] ?? []
  const cityLabel = selectedCat === "Massages" ? "Massage" : selectedCat === "Spas & Saunas" ? "Spa & Sauna" : selectedCat

  const filtered = uniqueBusinesses.filter((b) => {
    if (b.category !== selectedCat) return false
    if (selectedSub && !b.category.toLowerCase().includes(selectedSub.toLowerCase())) return false
    if (!b.location.toLowerCase().includes(selectedCity.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">{selectedCat}</span>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">Kenya</span>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">{selectedCity}</span>
        </nav>

        {/* Category pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCat(cat); setSelectedSub(null) }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCat === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-category service pills */}
        {subs.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {subs.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(selectedSub === sub ? null : sub)}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedSub === sub
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* City selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selectedCity === city
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
              }`}
            >
              <MapPin className="mr-1 inline size-3" />
              {city}
            </button>
          ))}
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold md:text-3xl">
          Best {cityLabel} near me in {selectedCity}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose from {filtered.length} {selectedCat.toLowerCase()} near you in {selectedCity}
          <Button variant="link" size="sm" className="h-auto px-1 text-xs">
            See map
          </Button>
        </p>

        {/* Filter bar */}
        <div className="mt-6 flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length} results</span>
            <span className="hidden sm:inline">Sort by</span>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
              Recommended <ChevronDown className="size-3" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <SlidersHorizontal className="size-3" />
            Filter
          </Button>
        </div>

        {/* Business grid */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((biz, i) => (
              <BusinessCard key={biz.id} business={biz} index={i} />
            ))}
          </div>
        ) : (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No {selectedCat.toLowerCase()} found in {selectedCity}
                {selectedSub ? ` for "${selectedSub}"` : ""}.
              </p>
              <Button variant="outline" size="sm" onClick={() => { setSelectedSub(null); setSelectedCity(cities[0]) }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
