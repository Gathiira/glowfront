"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/page-header"
import { Star, MapPin, Search } from "lucide-react"
import { searchBusinesses, fetchBusinessCategories } from "@/lib/api"
import { Pagination } from "@/components/dashboard/pagination"
import type {
  BusinessSearchDto,
  BusinessCardDto,
  BusinessCategoryDto,
  PaginatedResponse,
} from "@/lib/types"
import Image from "next/image"

const PAGE_SIZE = 12

export default function Browse() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("ALL")
  const [page, setPage] = useState(0)
  const [results, setResults] =
    useState<PaginatedResponse<BusinessCardDto> | null>(null)
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBusinessCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters: BusinessSearchDto = {
        page,
        size: PAGE_SIZE,
        sortBy: "rating",
        sortDirection: "desc",
      }
      if (search.trim()) filters.keyword = search.trim()
      if (activeCategory !== "ALL")
        filters.category = activeCategory as BusinessSearchDto["category"]

      const data = await searchBusinesses(filters)
      setResults(data)
    } catch (err) {
      console.error("Failed to search businesses:", err)
      setError("Failed to load businesses")
    } finally {
      setLoading(false)
    }
  }, [search, activeCategory, page])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBusinesses()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchBusinesses])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setPage(0)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  return (
    <div>
      <PageHeader
        title="Find a Business"
        description="Discover top-rated beauty & wellness services near you"
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search businesses or locations..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("ALL")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.name}
            variant={activeCategory === cat.name ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat.name)}
          >
            {cat.displayName}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          Loading...
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-destructive">
          {error}
        </div>
      ) : !results || results.list.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          No businesses found
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {results.totalElements} business
            {results.totalElements !== 1 ? "es" : ""} found
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.list.map((b) => (
              <Link key={b.id} href={`/platform/browse/${b.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="relative flex h-32 items-center justify-center rounded-t-xl bg-linear-to-br from-primary/10 to-primary/5">
                      {b.coverImageUrl || b.coverUrl || b.logoUrl ? (
                        <Image
                          src={b.coverImageUrl || b.coverUrl || b.logoUrl!}
                          alt={b.name}
                          className="h-32 w-full rounded-t-xl object-cover"
                          fill
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary/30">
                          {b.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{b.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium">
                            {b.overallRating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({b.totalReviews})
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {b.primaryCategory || b.categories[0] || ""}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {b.address}
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {b.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={results.totalPages}
            totalElements={results.totalElements}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
