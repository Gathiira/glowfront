"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, ChevronDown, SlidersHorizontal, Search } from "lucide-react"
import { Header } from "@/components/landing/_components/header"
import { Footer } from "@/components/landing/_components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"
import { searchBusinesses, fetchBusinessCategories } from "@/lib/api"
import { Pagination } from "@/components/dashboard/pagination"
import type {
  BusinessSearchDto,
  BusinessCardDto,
  BusinessCategoryDto,
  PaginatedResponse,
} from "@/lib/types"

const PAGE_SIZE = 12
const cities = ["All", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"]

function BusinessCard({ business }: { business: BusinessCardDto }) {
  const image = business.coverImageUrl || business.coverUrl || business.logoUrl
  return (
    <Link href={`/business/${business.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative h-36 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 to-primary/5">
            {image ? (
              <Image
                src={image}
                alt={business.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-3xl font-bold text-primary/30">
                  {business.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2 p-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
              {business.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">
                {business.overallRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({business.totalReviews.toLocaleString()})
              </span>
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {business.primaryCategory || business.categories[0] || ""}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {business.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <Skeleton className="h-36 w-full rounded-none rounded-t-xl" />
        <div className="space-y-2 p-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function BrowsePage() {
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [selectedCat, setSelectedCat] = useState<string>("ALL")
  const [selectedCity, setSelectedCity] = useState("All")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [results, setResults] = useState<PaginatedResponse<BusinessCardDto> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBusinessCategories().then(setCategories).catch(() => {})
  }, [])

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    try {
      const filters: BusinessSearchDto = {
        page,
        size: PAGE_SIZE,
        sortBy: "rating",
        sortDirection: "desc",
      }
      if (search.trim()) filters.keyword = search.trim()
      if (selectedCat !== "ALL") {
        const cat = categories.find((c) => c.displayName === selectedCat)
        if (cat) filters.category = cat.name as BusinessSearchDto["category"]
      }
      if (selectedCity && selectedCity !== "All") filters.city = selectedCity

      const data = await searchBusinesses(filters)
      setResults(data)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [search, selectedCat, selectedCity, page, categories])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBusinesses()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchBusinesses])

  const handleCategoryChange = (cat: string) => {
    setSelectedCat(cat)
    setPage(0)
  }

  const allCategoryNames = ["ALL", ...categories.map((c) => c.displayName)]
  const cityLabel =
    selectedCat === "Massages"
      ? "Massage"
      : selectedCat === "Spas & Saunas"
        ? "Spa & Sauna"
        : selectedCat === "ALL"
          ? "Businesses"
          : selectedCat

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">{selectedCat === "ALL" ? "Browse" : selectedCat}</span>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">Kenya</span>
          <span className="mx-1.5">›</span>
          <span className="text-foreground">{selectedCity}</span>
        </nav>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
          />
        </div>

        {/* Category pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {allCategoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                (selectedCat === "ALL" && cat === "ALL") || selectedCat === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              {cat === "ALL" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* City selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city)
                setPage(0)
              }}
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
          {results ? (
            <>
              Choose from {results.totalElements} {selectedCat.toLowerCase()} near you in{" "}
              {selectedCity}
            </>
          ) : (
            "Loading businesses..."
          )}
        </p>

        {/* Filter bar */}
        <div className="mt-6 flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {results ? `${results.totalElements} results` : "Loading..."}
            </span>
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
        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : results && results.list.length > 0 ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.list.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={results.totalPages}
              totalElements={results.totalElements}
              onPageChange={setPage}
            />
          </>
        ) : (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No {selectedCat.toLowerCase()} found in {selectedCity}
                {search ? ` matching "${search}"` : ""}.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCity("All")
                  setSearch("")
                  setSelectedCat("ALL")
                  setPage(0)
                }}
              >
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
