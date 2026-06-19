"use client"

import { ScrollSection } from "@/components/landing/scroll-section"
import { Header } from "@/components/landing/_components/header"
import { Hero } from "@/components/landing/_components/hero"
import { Reviews } from "@/components/landing/_components/reviews"
import { StatsBar } from "@/components/landing/_components/stats-bar"
import { CtaSection } from "@/components/landing/_components/cta-section"
import { CityBrowser } from "@/components/landing/_components/city-browser"
import { Footer } from "@/components/landing/_components/footer"
import {
  recommended,
  dealsBusinesses,
  newBusinesses,
  trending,
  newWithTag,
  reviews,
  cityLinks,
  countries,
  allCategories,
} from "@/components/landing/data"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <Hero />

      <div className="mx-auto max-w-7xl px-4">
        <ScrollSection title="Recommended" items={recommended} href="/browse" />
        <ScrollSection
          title="Featured"
          items={dealsBusinesses}
          href="/browse"
        />
        <StatsBar />
        <ScrollSection
          title="New to Glowbuddy"
          items={newBusinesses}
          href="/browse"
        />
        <ScrollSection title="Trending" items={trending} href="/browse" />
        <ScrollSection title="Deals" items={newWithTag} href="/browse" />
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
