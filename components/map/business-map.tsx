"use client"

import "leaflet/dist/leaflet.css"
import { setupLeafletIcon } from "./leaflet-icon"
import { MapContainer, TileLayer, Marker, Popup } from "./map-loader"

setupLeafletIcon()

type Props = {
  center: [number, number]
  name: string
  locationText?: string
  height?: string
}

export function BusinessMap({ center, name, locationText, height = "h-[300px]" }: Props) {
  return (
    <div className={`${height} w-full overflow-hidden rounded-lg`}>
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
    </div>
  )
}
