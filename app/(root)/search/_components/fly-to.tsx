"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

export function FlyTo({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.6 })
  }, [map, center, zoom])

  return null
}
