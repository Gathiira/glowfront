"use client"

import { useState, useEffect } from "react"
import { ScrollSection } from "@/components/landing/scroll-section"
import { Header } from "@/components/landing/_components/header"
import { Hero } from "@/components/landing/_components/hero"
import { CategoryBrowser } from "@/components/landing/_components/category-browser"
import { HowItWorks } from "@/components/landing/_components/how-it-works"
import { Reviews } from "@/components/landing/_components/reviews"
import { StatsBar } from "@/components/landing/_components/stats-bar"
import { CtaSection } from "@/components/landing/_components/cta-section"
import { CityBrowser } from "@/components/landing/_components/city-browser"
import { Footer } from "@/components/landing/_components/footer"
import { reviews, cityLinks, countries, allCategories } from "@/components/landing/data"
import { searchBusinesses } from "@/lib/api"
import type { BusinessCardDto, BusinessSearchDto } from "@/lib/types"

async function fetchSection(filters: BusinessSearchDto): Promise<BusinessCardDto[]> {
  try {
    const data = await searchBusinesses(filters)
    return data.list
  } catch {
    return []
  }
}

export default function LandingPage() {
  const [recommended, setRecommended] = useState<BusinessCardDto[]>([])
  const [featured, setFeatured] = useState<BusinessCardDto[]>([])
  const [newBusinesses, setNewBusinesses] = useState<BusinessCardDto[]>([])
  const [trending, setTrending] = useState<BusinessCardDto[]>([])
  const [deals, setDeals] = useState<BusinessCardDto[]>([])

  const [loadingRecommended, setLoadingRecommended] = useState(true)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [loadingNew, setLoadingNew] = useState(true)
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingDeals, setLoadingDeals] = useState(true)

  useEffect(() => {
    const base: BusinessSearchDto = {
      current: 0,
      pageSize: 16,
      sortBy: "rating",
      sortDirection: "desc",
    }

    setLoadingRecommended(true)
    fetchSection({ ...base, pageSize: 16 })
      .then(setRecommended)
      .finally(() => setLoadingRecommended(false))

    setLoadingFeatured(true)
    fetchSection({ ...base, pageSize: 10, sortBy: "totalReviews" })
      .then(setFeatured)
      .finally(() => setLoadingFeatured(false))

    setLoadingNew(true)
    fetchSection({ ...base, pageSize: 8, sortBy: "createdAt" })
      .then(setNewBusinesses)
      .finally(() => setLoadingNew(false))

    setLoadingTrending(true)
    fetchSection({ ...base, pageSize: 6, minRating: 4 })
      .then(setTrending)
      .finally(() => setLoadingTrending(false))

    setLoadingDeals(true)
    fetchSection({ ...base, pageSize: 7, sortBy: "priceRangeMin", sortDirection: "asc" })
      .then(setDeals)
      .finally(() => setLoadingDeals(false))
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      <Hero />

      <div className="mx-auto max-w-7xl px-4">
        <CategoryBrowser />

        <ScrollSection
          title="Recommended"
          items={recommended}
          loading={loadingRecommended}
          href="/browse"
        />
        <ScrollSection
          title="Featured"
          items={featured}
          loading={loadingFeatured}
          href="/browse"
        />

        <HowItWorks />

        <StatsBar />

        <ScrollSection
          title="New to Glowbuddy"
          items={newBusinesses}
          loading={loadingNew}
          href="/browse"
        />
        <ScrollSection
          title="Trending"
          items={trending}
          loading={loadingTrending}
          href="/browse"
        />
        <ScrollSection
          title="Deals"
          items={deals}
          loading={loadingDeals}
          href="/browse"
        />

        <Reviews reviews={reviews} />

        <CtaSection />

        <CityBrowser
          countries={countries}
          cityLinks={cityLinks}
          allCategories={allCategories}
        />
      </div>

      <Footer />
    </div>
  )
}
