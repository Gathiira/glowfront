"use client"

import "leaflet/dist/leaflet.css"
import { setupLeafletIcon } from "./leaflet-icon"
import { MapContainer, TileLayer, Marker, Popup } from "./map-loader"
import { MapPin } from "lucide-react"

setupLeafletIcon()

type Props = {
  center: [number, number]
  name: string
  locationText?: string
  height?: string
  showOpenInMaps?: boolean
}

export function BusinessMap({ center, name, locationText, height = "h-[300px]", showOpenInMaps = true }: Props) {
  const mapsUrl = `https://maps.google.com?q=${center[0]},${center[1]}`

  return (
    <div className={`${height} w-full overflow-hidden rounded-lg relative z-0`}>
      {typeof window !== "undefined" && (
        <MapContainer
          center={center}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            {locationText ? (
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{locationText}</p>
                </div>
              </Popup>
            ) : (
              <Popup>
                <p className="text-sm font-semibold">{name}</p>
              </Popup>
            )}
          </Marker>
        </MapContainer>
      )}
      {showOpenInMaps && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-2 top-2 z-[999] flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-medium text-foreground shadow transition-opacity hover:bg-background"
        >
          <MapPin className="size-3.5" />
          Open in Google Maps
        </a>
      )}
    </div>
  )
}
