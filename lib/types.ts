export type BusinessCategory = {
  id: string
  name: string
}

export type ServiceType = "physical" | "mobile"

export type CustomerLoginData = {
  identifier: string
  password: string
}

export type CustomerAccountData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export type PartnerAccountData = {
  email: string
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
  country: string
  agreeToTerms: boolean
}

export type PartnerBusinessData = {
  businessName: string
  website?: string
  categoryId: string
  serviceType: ServiceType
  location: {
    lat: number
    lng: number
    address: string
    town: string
  }
}

export type CustomerProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type BusinessService = {
  id: string
  name: string
  price: number
  duration: number
  description?: string
}

export type BusinessTeamMember = {
  id: string
  name: string
  role: string
}

export type BusinessReview = {
  id: string
  clientName: string
  rating: number
  text: string
  date: string
}

export type Business = {
  id: string
  name: string
  category: string
  address: string
  town: string
  phone: string
  description: string
  rating: number
  reviewCount: number
  services: BusinessService[]
  team: BusinessTeamMember[]
  reviews: BusinessReview[]
}

export type CustomerAppointment = {
  id: string
  businessId: string
  businessName: string
  serviceName: string
  servicePrice: number
  teamMemberName?: string
  date: string
  startTime: string
  endTime: string
  status: "confirmed" | "completed" | "cancelled"
  notes?: string
  reviewed: boolean
}

export type CustomerDashboardDto = {
  totalAppointments: number
  businessesVisited: number
  totalBusinessesAvailable: number
  totalSpent: number
  reviewsWritten: {
    written: number
    total: number
    pending: number
  }
  upcomingAppointments: {
    businessId: number
    businessName: string
    serviceName: string
    bookingDate: string
    bookingTime: string
    status: string
  }[]
  quickStats: {
    completed: number
    cancelled: number
    avgSpendPerVisit: number
    loyaltyRate: number
    favoriteBusiness: {
      businessId: number
      businessName: string
      logoUrl: string
      visitCount: number
    } | null
  }
}

export type ServiceCategory = "HAIR" | "BARBER" | "NAILS" | "SPA" | "MASSAGE" | "FACIAL"

export type BusinessCategoryDto = {
  id: number
  name: string
  displayName: string
}

export type BusinessSearchDto = {
  keyword?: string
  category?: ServiceCategory
  city?: string
  minRating?: number
  priceMin?: number
  priceMax?: number
  openNow?: boolean
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: "asc" | "desc"
}

export type PaginatedResponse<T> = {
  current: number
  size: number
  totalElements: number
  totalPages: number
  list: T[]
}

export type BusinessCardDto = {
  id: number
  name: string
  slug: string
  description: string
  logoUrl: string | null
  coverUrl: string | null
  overallRating: number
  totalReviews: number
  address: string
  priceRangeMin: number
  categories: string[]
  coverImageUrl: string | null
  primaryCategory: string
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { id: "hair-salon", name: "Hair Salon" },
  { id: "nails", name: "Nails" },
  { id: "eyebrows-lashes", name: "Eyebrows and Lashes" },
  { id: "beauty-salon", name: "Beauty Salon" },
  { id: "medspa", name: "MedSpa" },
  { id: "barber", name: "Barber" },
  { id: "massage", name: "Massage" },
  { id: "spa-sauna", name: "Spa and Sauna" },
  { id: "waxing", name: "Waxing Salon" },
  { id: "tattooing-piercing", name: "Tattooing and Piercing" },
]

export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
  { code: "NG", name: "Nigeria" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "CN", name: "China" },
  { code: "SG", name: "Singapore" },
  { code: "NZ", name: "New Zealand" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "CL", name: "Chile" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "GR", name: "Greece" },
]
