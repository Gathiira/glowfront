"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { MapPin, Star, Search, X } from "lucide-react"
import NextDynamic from "next/dynamic"

export const dynamic = "force-dynamic"
import { Header } from "@/components/landing/_components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { cn } from "@/lib/utils"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let L: any = null

if (typeof window !== "undefined") {
  L = require("leaflet")
  require("leaflet/dist/leaflet.css")

  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  L.Marker.prototype.options.icon = defaultIcon
}

const MapContainer = NextDynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
)
const TileLayer = NextDynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
)
const Marker = NextDynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
})
const Popup = NextDynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
})
const FlyTo = NextDynamic(
  () => import("./_components/fly-to").then((m) => m.FlyTo),
  { ssr: false }
)

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const neighborhoodCoords: Record<string, [number, number]> = {
  Kilimani: [-1.2869, 36.7775],
  Westlands: [-1.2671, 36.8115],
  Lavington: [-1.275, 36.77],
  "Mombasa Road": [-1.35, 36.85],
  Karen: [-1.3175, 36.7111],
  Gigiri: [-1.2314, 36.8075],
  Parklands: [-1.2644, 36.8064],
  "Thika Road": [-1.21, 36.88],
  "Spring Valley": [-1.2636, 36.8068],
  "Nairobi Central": [-1.2833, 36.8167],
  Kileleshwa: [-1.2824, 36.7815],
  "Lang'ata": [-1.358, 36.7395],
  Runda: [-1.2278, 36.8017],
  Nyali: [-4.0435, 39.719],
  Milimani: [-0.1, 34.75],
  Nakuru: [-0.3031, 36.08],
}

function getBusinessCoords(location: string, index: number): [number, number] {
  for (const [hood, coords] of Object.entries(neighborhoodCoords)) {
    if (location.toLowerCase().includes(hood.toLowerCase())) {
      const latOff = (seededRandom(index * 7 + 13) - 0.5) * 0.02
      const lngOff = (seededRandom(index * 11 + 3) - 0.5) * 0.02
      return [coords[0] + latOff, coords[1] + lngOff]
    }
  }
  const townMap: Record<string, [number, number]> = {
    nairobi: [-1.2869, 36.8219],
    mombasa: [-4.0435, 39.6682],
    kisumu: [-0.1022, 34.7617],
    nakuru: [-0.3031, 36.08],
    eldoret: [0.5143, 35.2698],
    thika: [-1.0396, 37.09],
    malindi: [-3.2237, 40.1167],
    nyeri: [-0.4213, 36.9486],
    nanyuki: [0.0158, 37.0733],
    machakos: [-1.5177, 37.2634],
    kitale: [1.0165, 35.0062],
    meru: [0.05, 37.65],
    embu: [-0.5382, 37.4521],
    naivasha: [-0.7171, 36.4322],
    kilifi: [-3.6305, 39.8499],
    lamu: [-2.2717, 40.902],
    isiolo: [0.3545, 37.5822],
    voi: [-3.3884, 38.5644],
    "homa bay": [-0.5273, 34.4571],
    bungoma: [0.5695, 34.5584],
    kikuyu: [-1.2459, 36.669],
    ruiru: [-1.1499, 36.971],
    kericho: [-0.3689, 35.2863],
    garissa: [-0.4539, 39.6476],
  }
  const lower = location.toLowerCase()
  for (const [town, coords] of Object.entries(townMap)) {
    if (lower.includes(town)) {
      const latOff = (seededRandom(index * 7 + 13) - 0.5) * 0.02
      const lngOff = (seededRandom(index * 11 + 3) - 0.5) * 0.02
      return [coords[0] + latOff, coords[1] + lngOff]
    }
  }
  return [
    -1.2869 + (seededRandom(index * 7 + 13) - 0.5) * 0.02,
    36.8219 + (seededRandom(index * 11 + 3) - 0.5) * 0.02,
  ]
}

function getTownFromLocation(location: string): string {
  const parts = location.split(",")
  return parts[parts.length - 1]?.trim() || location
}

const allBusinesses: (ListingBusiness & { coords: [number, number] })[] = [
  ...recommended,
  ...newBusinesses,
  ...newWithTag,
  ...trending,
  ...dealsBusinesses,
  ...browseBusinesses,
].map((b, i) => ({ ...b, coords: getBusinessCoords(b.location, i) }))

function dedupe<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const uniqueBusinesses = dedupe(allBusinesses)

const cities = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const kenyaBounds: any = L ? L.latLngBounds(L.latLng(-4.7, 33.5), L.latLng(5.0, 42.0)) : null

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)

  const filtered = useMemo(() => {
    return uniqueBusinesses.filter((b) => {
      if (query) {
        const q = query.toLowerCase()
        if (
          !b.name.toLowerCase().includes(q) &&
          !b.category.toLowerCase().includes(q) &&
          !b.location.toLowerCase().includes(q)
        )
          return false
      }
      if (selectedCat && b.category !== selectedCat) return false
      if (
        selectedCity &&
        !b.location.toLowerCase().includes(selectedCity.toLowerCase())
      )
        return false
      return true
    })
  }, [query, selectedCat, selectedCity])

  const visibleBusinesses = filtered.slice(0, 50)

  const selectedBiz = useMemo(
    () => visibleBusinesses.find((b) => b.id === selectedId) ?? null,
    [visibleBusinesses, selectedId]
  )

  const handleSelect = useCallback(
    (id: string) => {
      const biz = visibleBusinesses.find((b) => b.id === id)
      if (biz) {
        setSelectedId(id)
        mapRef.current?.flyTo(biz.coords, 14, { duration: 0.6 })
      }
    },
    [visibleBusinesses]
  )

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel – business list */}
        <div className="flex w-full flex-col border-b lg:w-110 lg:shrink-0 lg:border-r lg:border-b-0">
          {/* Search/filter bar */}
          <div className="shrink-0 border-b p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search businesses, categories, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 pr-8 pl-9 text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCat(null)}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  !selectedCat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                All
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCat(selectedCat === cat ? null : cat)
                  }
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    selectedCat === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* City pills */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCity(null)}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  !selectedCity
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                )}
              >
                <MapPin className="mr-1 inline size-3" />
                All cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() =>
                    setSelectedCity(selectedCity === city ? null : city)
                  }
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    selectedCity === city
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <MapPin className="mr-1 inline size-3" />
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="shrink-0 border-b px-4 py-2 text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </div>

          {/* Scrollable business list */}
          <div className="flex-1 divide-y overflow-y-auto overscroll-contain">
            {visibleBusinesses.length > 0 ? (
              visibleBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className={cn(
                    "flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                    (hoveredId === biz.id || selectedId === biz.id) &&
                      "bg-muted"
                  )}
                  onMouseEnter={() => setHoveredId(biz.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleSelect(biz.id)}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      selectedId === biz.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-to-br from-primary/10 to-primary/5 text-primary"
                    )}
                  >
                    {biz.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">{biz.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {biz.category}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {biz.rating.toFixed(1)}
                      </span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3" />
                        {getTownFromLocation(biz.location)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No businesses found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("")
                    setSelectedCat(null)
                    setSelectedCity(null)
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right panel – map */}
        <div className="relative hidden flex-1 lg:block">
          {typeof window !== "undefined" && (
            <MapContainer
              center={[-1.2921, 36.8219]}
              zoom={11}
              className="h-full w-full"
              maxBounds={kenyaBounds}
              maxBoundsViscosity={1.0}
              minZoom={8}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {visibleBusinesses.map((biz) => (
                <Marker key={biz.id} position={biz.coords}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{biz.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {biz.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {biz.location}
                      </p>
                      <p className="mt-1 text-xs">
                        {"★".repeat(Math.round(biz.rating))}{" "}
                        {biz.rating.toFixed(1)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {selectedBiz && <FlyTo center={selectedBiz.coords} zoom={14} />}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  )
}
