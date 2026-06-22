"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import NextDynamic from "next/dynamic"
import {
  Star,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  ArrowLeft,
  Check,
  User,
} from "lucide-react"
import { Header } from "@/components/landing/_components/header"
import { Footer } from "@/components/landing/_components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export const dynamic = "force-dynamic"

let L: any = null
if (typeof window !== "undefined") {
  L = require("leaflet")

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

import "leaflet/dist/leaflet.css"

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

import {
  recommended,
  newBusinesses,
  newWithTag,
  trending,
  dealsBusinesses,
  browseBusinesses,
} from "@/components/landing/data"
import type { ListingBusiness } from "@/components/landing/data"

type MockService = {
  id: string
  name: string
  price: number
  duration: number
  description: string
}
type MockTeamMember = { id: string; name: string; role: string }
type MockReview = {
  id: string
  clientName: string
  rating: number
  text: string
  date: string
}

const categoryServices: Record<string, MockService[]> = {
  Barber: [
    { id: "s1", name: "Classic Haircut", price: 35, duration: 30, description: "Scissor & clipper cut" },
    { id: "s2", name: "Beard Trim", price: 20, duration: 20, description: "Shape & line-up" },
    { id: "s3", name: "Hot Towel Shave", price: 45, duration: 45, description: "Traditional straight razor shave" },
    { id: "s4", name: "Haircut + Beard", price: 50, duration: 45, description: "Complete grooming combo" },
  ],
  Barbers: [
    { id: "s1", name: "Classic Haircut", price: 30, duration: 30, description: "Scissor & clipper cut" },
    { id: "s2", name: "Beard Trim", price: 18, duration: 20, description: "Shape & line-up" },
    { id: "s3", name: "Kids Haircut", price: 22, duration: 25, description: "Haircut for children under 12" },
  ],
  "Hair Salon": [
    { id: "s1", name: "Women's Haircut", price: 65, duration: 45, description: "Wash, cut & blow-dry" },
    { id: "s2", name: "Men's Haircut", price: 40, duration: 30, description: "Cut & style" },
    { id: "s3", name: "Full Color", price: 120, duration: 90, description: "Permanent color application" },
    { id: "s4", name: "Balayage", price: 180, duration: 120, description: "Hand-painted highlights" },
  ],
  "Hair Salons": [
    { id: "s1", name: "Women's Haircut", price: 55, duration: 45, description: "Wash, cut & blow-dry" },
    { id: "s2", name: "Blowout", price: 45, duration: 30, description: "Professional blow-dry styling" },
    { id: "s3", name: "Partial Highlights", price: 95, duration: 75, description: "Partial foil highlights" },
  ],
  Nails: [
    { id: "s1", name: "Classic Manicure", price: 35, duration: 30, description: "Nail shaping, cuticle care & polish" },
    { id: "s2", name: "Gel Manicure", price: 50, duration: 45, description: "Long-lasting gel polish" },
    { id: "s3", name: "Spa Pedicure", price: 65, duration: 60, description: "Foot soak, scrub, massage & polish" },
    { id: "s4", name: "Nail Art", price: 25, duration: 30, description: "Custom design per hand" },
  ],
  "Nail Salons": [
    { id: "s1", name: "Classic Manicure", price: 30, duration: 30, description: "Nail shaping, cuticle care & polish" },
    { id: "s2", name: "Gel Manicure", price: 45, duration: 45, description: "Long-lasting gel polish" },
    { id: "s3", name: "Spa Pedicure", price: 55, duration: 60, description: "Foot soak, scrub, massage & polish" },
  ],
  Massage: [
    { id: "s1", name: "Swedish Massage", price: 80, duration: 60, description: "Full-body relaxation" },
    { id: "s2", name: "Deep Tissue Massage", price: 100, duration: 60, description: "Targeted muscle relief" },
    { id: "s3", name: "Hot Stone Massage", price: 120, duration: 75, description: "Heated stones + massage" },
  ],
  Massages: [
    { id: "s1", name: "Swedish Massage", price: 75, duration: 60, description: "Full-body relaxation" },
    { id: "s2", name: "Deep Tissue Massage", price: 95, duration: 60, description: "Targeted muscle relief" },
    { id: "s3", name: "Aromatherapy Massage", price: 90, duration: 60, description: "Essential oils + massage" },
  ],
  "Beauty Salon": [
    { id: "s1", name: "European Facial", price: 95, duration: 60, description: "Deep cleanse, exfoliation & mask" },
    { id: "s2", name: "Brow Wax & Tint", price: 40, duration: 20, description: "Shape & color" },
    { id: "s3", name: "Full Face Makeup", price: 75, duration: 45, description: "Professional makeup application" },
  ],
  "Beauty Salons": [
    { id: "s1", name: "Signature Facial", price: 85, duration: 60, description: "Customized facial treatment" },
    { id: "s2", name: "Waxing - Full Leg", price: 55, duration: 30, description: "Full leg waxing" },
    { id: "s3", name: "Makeup Application", price: 65, duration: 45, description: "Professional makeup" },
  ],
  "Spa & sauna": [
    { id: "s1", name: "Spa Day Package", price: 150, duration: 180, description: "Full day of pampering" },
    { id: "s2", name: "Sauna Session", price: 40, duration: 45, description: "Traditional sauna session" },
    { id: "s3", name: "Body Scrub", price: 70, duration: 45, description: "Full body exfoliation" },
  ],
  "Spas & Saunas": [
    { id: "s1", name: "Spa Day Package", price: 140, duration: 180, description: "Full day of pampering" },
    { id: "s2", name: "Body Wrap", price: 75, duration: 60, description: "Detoxifying body wrap" },
    { id: "s3", name: "Sauna + Cold Plunge", price: 50, duration: 60, description: "Hot/cold therapy" },
  ],
  Medspas: [
    { id: "s1", name: "Botox Consultation", price: 50, duration: 30, description: "Initial consultation" },
    { id: "s2", name: "Laser Hair Removal", price: 150, duration: 45, description: "Per session" },
    { id: "s3", name: "Chemical Peel", price: 120, duration: 60, description: "Medical-grade peel" },
  ],
  "Waxing Salons": [
    { id: "s1", name: "Full Leg Wax", price: 50, duration: 30, description: "Full leg waxing" },
    { id: "s2", name: "Bikini Wax", price: 35, duration: 20, description: "Standard bikini wax" },
    { id: "s3", name: "Underarm Wax", price: 20, duration: 15, description: "Underarm waxing" },
  ],
  "Eyebrows & Lashes": [
    { id: "s1", name: "Brow Shaping", price: 25, duration: 15, description: "Professional brow shaping" },
    { id: "s2", name: "Lash Extensions - Full Set", price: 120, duration: 120, description: "Full set of individual lashes" },
    { id: "s3", name: "Brow Lamination", price: 55, duration: 30, description: "Brow lamination & set" },
  ],
  "Tattooing & Piercing": [
    { id: "s1", name: "Small Tattoo", price: 100, duration: 60, description: "Up to 2 inches" },
    { id: "s2", name: "Medium Tattoo", price: 200, duration: 120, description: "Up to 6 inches" },
    { id: "s3", name: "Piercing", price: 50, duration: 15, description: "Ear, nose, or lip" },
  ],
}

const categoryTeam: Record<string, MockTeamMember[]> = {
  default: [
    { id: "t1", name: "James Mwangi", role: "Senior Professional" },
    { id: "t2", name: "Grace Akinyi", role: "Junior Specialist" },
  ],
  "Hair Salon": [
    { id: "t1", name: "Sophie Chen", role: "Senior Stylist" },
    { id: "t2", name: "Marcus Lee", role: "Colorist" },
  ],
  "Hair Salons": [
    { id: "t1", name: "Mary Wambui", role: "Senior Stylist" },
    { id: "t2", name: "Peter Kamau", role: "Junior Stylist" },
  ],
  Nails: [
    { id: "t1", name: "Linda Park", role: "Nail Technician" },
    { id: "t2", name: "Julie Kim", role: "Senior Nail Artist" },
  ],
  "Nail Salons": [
    { id: "t1", name: "Faith Njeri", role: "Nail Technician" },
    { id: "t2", name: "Esther Wanjiku", role: "Nail Artist" },
  ],
  Barber: [
    { id: "t1", name: "Dre Williams", role: "Master Barber" },
    { id: "t2", name: "Carlos Reyes", role: "Barber" },
  ],
  Barbers: [
    { id: "t1", name: "John Otieno", role: "Master Barber" },
    { id: "t2", name: "Kevin Kiprop", role: "Barber" },
  ],
  "Beauty Salon": [
    { id: "t1", name: "Chloe Martinez", role: "Esthetician" },
    { id: "t2", name: "Bianca Rose", role: "Makeup Artist" },
  ],
  "Beauty Salons": [
    { id: "t1", name: "Jane Wanjiku", role: "Esthetician" },
    { id: "t2", name: "Diana Chebet", role: "Makeup Artist" },
  ],
  Massage: [
    { id: "t1", name: "Nina Patel", role: "Licensed Massage Therapist" },
    { id: "t2", name: "Ryan O'Brien", role: "Deep Tissue Specialist" },
  ],
  Massages: [
    { id: "t1", name: "Amina Hassan", role: "Licensed Massage Therapist" },
    { id: "t2", name: "David Omondi", role: "Deep Tissue Specialist" },
  ],
  "Spa & sauna": [
    { id: "t1", name: "Aisha Mohammed", role: "Spa Therapist" },
    { id: "t2", name: "Hellen Nyambura", role: "Wellness Coach" },
  ],
  "Spas & Saunas": [
    { id: "t1", name: "Catherine Wangui", role: "Spa Therapist" },
    { id: "t2", name: "Sarah Kemunto", role: "Massage Therapist" },
  ],
  "Tattooing & Piercing": [
    { id: "t1", name: "Jake Torres", role: "Tattoo Artist" },
    { id: "t2", name: "Maya Singh", role: "Piercing Specialist" },
  ],
}

function getServicesForCategory(category: string, bizId: string): MockService[] {
  const services = categoryServices[category] || categoryServices["Barber"]
  return services.map((s, i) => ({ ...s, id: `svc-${bizId}-${i}` }))
}

function getTeamForCategory(category: string, bizId: string): MockTeamMember[] {
  const team = categoryTeam[category] || categoryTeam.default
  return team.map((t, i) => ({ ...t, id: `tm-${bizId}-${i}` }))
}

const reviewTexts = [
  "Amazing service! Highly recommend.",
  "Great experience, very professional.",
  "Will definitely come back again.",
  "Loved the atmosphere and the staff were wonderful.",
  "Top notch service, fair prices.",
  "Excellent work as always!",
  "Best in town, no competition.",
  "Very satisfied with the results.",
]
const clientNames = [
  "Alice W.",
  "Tom K.",
  "Emma R.",
  "James L.",
  "Sarah J.",
  "Mike P.",
  "Lisa H.",
  "David M.",
]

function generateReviews(
  bizId: string,
  rating: number,
  _count: number
): MockReview[] {
  const base = Math.abs(bizId.split("").reduce((a, c) => a + c.charCodeAt(0), 0))
  const count = Math.min(_count, 8)
  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${bizId}-${i}`,
    clientName: clientNames[(base + i) % clientNames.length],
    rating: Math.max(
      1,
      Math.min(5, rating + Math.floor(((base + i * 3) % 5) - 2))
    ),
    text: reviewTexts[(base + i) % reviewTexts.length],
    date: `2026-0${((base + i) % 6) + 1}-${String(
      ((base * 3 + i * 7) % 28) + 1
    ).padStart(2, "0")}`,
  }))
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const townCoords: Record<string, [number, number]> = {
  Nairobi: [-1.2869, 36.8219],
  Mombasa: [-4.0435, 39.6682],
  Kisumu: [-0.1022, 34.7617],
  Nakuru: [-0.3031, 36.08],
  Eldoret: [0.5143, 35.2698],
  Thika: [-1.0396, 37.09],
  Malindi: [-3.2237, 40.1167],
  Nyeri: [-0.4213, 36.9486],
  Nanyuki: [0.0158, 37.0733],
  Machakos: [-1.5177, 37.2634],
  Kitale: [1.0165, 35.0062],
  Meru: [0.05, 37.65],
  Embu: [-0.5382, 37.4521],
  Naivasha: [-0.7171, 36.4322],
  Kilifi: [-3.6305, 39.8499],
}

function getTownFromLocation(location: string): string {
  const parts = location.split(",")
  return parts[parts.length - 1]?.trim() || location
}

function getBusinessCoords(
  location: string,
  seed: number
): [number, number] {
  const town = getTownFromLocation(location).toLowerCase()
  for (const [t, coords] of Object.entries(townCoords)) {
    if (town.includes(t.toLowerCase())) {
      const latOff = (seededRandom(seed * 7 + 13) - 0.5) * 0.01
      const lngOff = (seededRandom(seed * 11 + 3) - 0.5) * 0.01
      return [coords[0] + latOff, coords[1] + lngOff]
    }
  }
  return [
    -1.2869 + (seededRandom(seed * 7 + 13) - 0.5) * 0.01,
    36.8219 + (seededRandom(seed * 11 + 3) - 0.5) * 0.01,
  ]
}

const allListingBusinesses: ListingBusiness[] = [
  ...recommended,
  ...newBusinesses,
  ...newWithTag,
  ...trending,
  ...dealsBusinesses,
  ...browseBusinesses,
]

function findBusiness(id: string) {
  return allListingBusinesses.find((b) => b.id === id) || null
}

export default function PublicBusinessDetail() {
  const params = useParams()
  const id = params.id as string
  const listing = findBusiness(id)

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [bookingPhone, setBookingPhone] = useState("")
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")

  const services = useMemo(
    () => getServicesForCategory(listing?.category ?? "", id),
    [listing?.category, id]
  )
  const team = useMemo(
    () => getTeamForCategory(listing?.category ?? "", id),
    [listing?.category, id]
  )
  const coords = useMemo(
    () =>
      listing
        ? getBusinessCoords(
            listing.location,
            id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
          )
        : ([0, 0] as [number, number]),
    [listing, id]
  )
  const reviews = useMemo(
    () =>
      listing
        ? generateReviews(id, listing.rating, listing.reviewCount)
        : [],
    [listing, id]
  )
  const town = useMemo(
    () => (listing ? getTownFromLocation(listing.location) : ""),
    [listing]
  )

  if (!listing) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
          <p className="text-muted-foreground">Business not found</p>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const handleBook = () => {
    if (!selectedService || !bookingName || !bookingDate || !bookingTime) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Booking request submitted! We'll contact you shortly.")
    setSelectedService(null)
    setBookingName("")
    setBookingEmail("")
    setBookingPhone("")
    setBookingDate("")
    setBookingTime("")
    setBookingNotes("")
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/search">
            <ArrowLeft className="mr-1 size-4" />
            Back to Search
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <span className="text-6xl font-bold text-primary/20">
                    {listing.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold">{listing.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
                    {listing.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">
                      {listing.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({listing.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {listing.location}
                </div>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {listing.name} is a premier{" "}
                  {listing.category.toLowerCase()} located in {town}. We pride
                  ourselves on delivering exceptional service in a welcoming
                  environment. Our team of experienced professionals is
                  dedicated to providing you with the best experience possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services &amp; Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted",
                      selectedService === s.id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3.5" />
                        {s.duration}min
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="size-3.5" />
                        {s.price}
                      </div>
                      {selectedService === s.id && (
                        <Check className="size-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {team.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-lg border p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full overflow-hidden rounded-lg">
                  {typeof window !== "undefined" && (
                    <MapContainer
                      center={coords}
                      zoom={14}
                      className="h-full w-full"
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={coords}>
                        <Popup>
                          <div className="text-sm">
                            <p className="font-semibold">{listing.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {listing.location}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {listing.location}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <CardTitle>Reviews</CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">
                      {listing.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({listing.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{r.clientName}</p>
                        <span className="text-xs text-muted-foreground">
                          {r.date}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3",
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {r.text}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
                <CardDescription>
                  Fill in the details and we'll confirm your booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Service *
                  </label>
                  <div className="space-y-1">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                          selectedService === s.id &&
                            "border-primary bg-primary/5"
                        )}
                      >
                        <span>{s.name}</span>
                        <span className="text-muted-foreground">
                          ${s.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedService && (
                  <>
                    <div>
                      <label
                        htmlFor="book-date"
                        className="mb-1 block text-sm font-medium"
                      >
                        Date *
                      </label>
                      <Input
                        id="book-date"
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book-time"
                        className="mb-1 block text-sm font-medium"
                      >
                        Time *
                      </label>
                      <Input
                        id="book-time"
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      />
                    </div>
                    <Separator />
                    <div>
                      <label
                        htmlFor="book-name"
                        className="mb-1 block text-sm font-medium"
                      >
                        Name *
                      </label>
                      <Input
                        id="book-name"
                        placeholder="Your name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book-email"
                        className="mb-1 block text-sm font-medium"
                      >
                        Email
                      </label>
                      <Input
                        id="book-email"
                        type="email"
                        placeholder="your@email.com"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book-phone"
                        className="mb-1 block text-sm font-medium"
                      >
                        Phone
                      </label>
                      <Input
                        id="book-phone"
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="book-notes"
                        className="mb-1 block text-sm font-medium"
                      >
                        Notes
                      </label>
                      <Textarea
                        id="book-notes"
                        placeholder="Any special requests..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button className="w-full" onClick={handleBook}>
                      Book Appointment
                    </Button>
                  </>
                )}

                {!selectedService && (
                  <p className="text-center text-sm text-muted-foreground">
                    Select a service above to book
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
