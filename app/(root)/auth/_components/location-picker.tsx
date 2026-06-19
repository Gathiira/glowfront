"use client"

import React, { useRef, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

type Location = {
  lat: number
  lng: number
  address: string
  town: string
}

type Props = {
  value: Location
  onChange: (location: Location) => void
}

type SearchResult = {
  lat: string
  lon: string
  display_name: string
}

function MapEvents({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap()
  React.useEffect(() => {
    map.flyTo(center, 15)
  }, [map, center])
  return null
}

async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ address: string; town: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    )
    const data = await res.json()
    const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    const town =
      data.address?.town ??
      data.address?.city ??
      data.address?.village ??
      data.address?.municipality ??
      data.address?.county ??
      ""
    return { address: addr, town }
  } catch {
    return {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      town: "",
    }
  }
}

async function searchQuery(
  q: string
): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
      { headers: { "Accept-Language": "en" } }
    )
    return res.json()
  } catch {
    return []
  }
}

const defaultCenter: [number, number] = [40.7128, -74.006]

export default function LocationPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [flyKey, setFlyKey] = useState(0)
  const resolvingRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const pickLocation = async (lat: number, lng: number) => {
    if (resolvingRef.current) return
    resolvingRef.current = true
    const { address, town } = await reverseGeocode(lat, lng)
    onChange({ lat, lng, address, town })
    resolvingRef.current = false
  }

  const handleSearchInput = (q: string) => {
    setSearch(q)
    clearTimeout(debounceRef.current)
    if (q.length < 3) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const r = await searchQuery(q)
      setResults(r)
      setSearching(false)
    }, 400)
  }

  const handleSelectResult = async (r: SearchResult) => {
    const lat = Number(r.lat)
    const lng = Number(r.lon)
    setSearch(r.display_name)
    setResults([])
    const { address, town } = await reverseGeocode(lat, lng)
    onChange({ lat, lng, address, town })
    setFlyKey((k) => k + 1)
  }

  const handleMapClick = async (lat: number, lng: number) => {
    await pickLocation(lat, lng)
    setFlyKey((k) => k + 1)
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await pickLocation(pos.coords.latitude, pos.coords.longitude)
        setFlyKey((k) => k + 1)
      },
      (err) => console.error("Geolocation error:", err)
    )
  }

  const hasPosition = value.lat !== 0 || value.lng !== 0

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a location..."
          value={search}
          onChange={(e) => handleSearchInput(e.target.value)}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
        />
        {searching && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            Searching...
          </span>
        )}
        {results.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover p-1 shadow-md">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelectResult(r)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div className="relative z-0 h-64 w-full overflow-hidden rounded-lg border">
        <MapContainer
          center={hasPosition ? [value.lat, value.lng] : defaultCenter}
          zoom={hasPosition ? 15 : 3}
          className="h-full w-full"
          zoomControl={true}
          key={flyKey}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onPick={handleMapClick} />
          {hasPosition && (
            <Marker position={[value.lat, value.lng]} icon={defaultIcon} />
          )}
          {flyKey > 0 && hasPosition && (
            <FlyTo center={[value.lat, value.lng]} />
          )}
        </MapContainer>
      </div>

      {/* Editable address / town */}
      {hasPosition && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Address"
            value={value.address}
            onChange={(e) =>
              onChange({ ...value, address: e.target.value })
            }
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
          <input
            type="text"
            placeholder="Town / City"
            value={value.town}
            onChange={(e) =>
              onChange({ ...value, town: e.target.value })
            }
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="inline-flex h-7 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50"
      >
        Use my current location
      </button>
    </div>
  )
}
