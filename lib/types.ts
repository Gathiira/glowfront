export const CURRENCY = "KSH"

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
  slug: string
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

export type ServiceCategory =
  | "HAIR"
  | "BARBER"
  | "NAILS"
  | "SPA"
  | "MASSAGE"
  | "FACIAL"

export type BusinessCategoryDto = {
  id: number
  name: string
  displayName: string
  imageUrl: string | null
}

export type BusinessSearchDto = {
  keyword?: string
  category?: ServiceCategory
  city?: string
  minRating?: number
  priceMin?: number
  priceMax?: number
  openNow?: boolean
  current?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: "asc" | "desc"
}

/** Backend paging envelope; `current` is 1-based. */
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

export type BusinessStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE"

export type BusinessLocationDto = {
  id: number
  streetAddress: string
  city: string
  countyState: string
  country: string
  postalCode: string | null
  latitude: number
  longitude: number
  mapsUrl: string | null
}

export type BusinessGalleryDto = {
  id: number
  imageUrl: string
  caption?: string
}

export type BusinessAmenityDto = {
  id: number
  name: string
}

export type BusinessOpeningHoursDto = {
  id: number
  dayOfWeek: string
  openTime: string
  closeTime: string
  closed: boolean
}

export type BusinessSocialMediaDto = {
  id: number
  platform: string
  url: string
}

export type BusinessDto = {
  id: number
  name: string
  description: string
  slug: string
  logoUrl: string | null
  coverUrl: string | null
  phone: string
  email: string
  website: string | null
  categoryId: number
  categoryName: string
  partnerId: number
  status: BusinessStatus
  verified: boolean
  overallRating: number | null
  totalReviews: number | null
  priceRangeMin: number | null
  priceRangeMax: number | null
  location: BusinessLocationDto | null
  gallery: BusinessGalleryDto[]
  amenities: BusinessAmenityDto[]
  openingHours: BusinessOpeningHoursDto[]
  socialMedia: BusinessSocialMediaDto[]
  createdAt?: string
}

export type ReviewImageDto = {
  id: number
  imageUrl: string
}

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED"

export type ReviewDto = {
  id: number
  businessId: number
  businessName?: string
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  images: ReviewImageDto[]
  status?: ReviewStatus
  createdAt: string
}

export type StaffDto = {
  id: number
  businessId: number
  name: string
  profilePhotoUrl: string | null
  bio: string | null
  jobTitle: string | null
  yearsExperience: number
  averageRating: number
  reviewCount: number
  active: boolean
  services: ServiceDto[]
}

export type ServiceCategoryEnum =
  | "HAIR"
  | "BARBER"
  | "NAILS"
  | "SPA"
  | "MASSAGE"
  | "FACIAL"
  | "MAKEUP"
  | "TATTOO"
  | "OTHER"

export type ServiceDto = {
  id: number
  businessId: number
  name: string
  description: string | null
  categoryId: number
  categoryName: string
  durationMinutes: number
  price: number
  currency: string
  imageUrl: string | null
  displayOrder: number
  active: boolean
}

export type RatingBreakdownDto = {
  fiveStar: number
  fourStar: number
  threeStar: number
  twoStar: number
  oneStar: number
}

export type BusinessDetailDto = BusinessDto & {
  services: ServiceDto[]
  team: StaffDto[]
  reviews: ReviewDto[]
  ratingBreakdown: RatingBreakdownDto | null
}

export type BookingDto = {
  id: number
  businessId: number
  businessName: string
  businessSlug: string
  serviceId: number
  serviceName: string
  staffId: number
  customerName: string
  customerPhone: string
  customerEmail: string | null
  bookingDate: string
  bookingTime: string
  durationMinutes: number | null
  totalPrice: number | null
  currency: string
  status: string
  notes: string | null
  confirmationCode: string | null
  source: string
  createdAt: string
}

export type DashboardSummaryDto = {
  recentSales: number
  upcomingAppointments: number
  weeklyActivityCount: number
  nextAppointment: BookingDto | null
  pendingLeaveCount: number
  /** The soonest few pending requests. */
  pendingLeave: LeaveDto[]
}

export type TopServiceDto = {
  serviceId: number
  serviceName: string
  thisMonthCount: number
  lastMonthCount: number
}

export type TopTeamMemberDto = {
  staffId: number
  staffName: string
  completedBookings: number
  totalSales: number
}

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

/** How the business takes and makes payments. Older records may still show other methods. */
export const PAYMENT_METHODS = ["MPESA", "CASH"] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export const PAYMENT_LABEL: Record<PaymentMethod, string> = { MPESA: "M-Pesa", CASH: "Cash" }

/** A past customer found by name or phone at checkout. */
export type CustomerLookupDto = { name: string; phone: string | null; email: string | null; lastVisit: string | null }

export type TaskDto = {
  id: number
  name: string
  defaultPercent: number
  active: boolean
  /** Staff allowed to do this task; empty = anyone. */
  staffIds: number[]
  /** Services this task is part of; empty = unused until added to a service again. */
  serviceIds: number[]
}

export type TaskAssignment = { staffId: number; taskId: number }

export type TaskAssignmentsDto = {
  tasks: TaskDto[]
  /** serviceIds: services they're on; only tasks of those services can be given to them. */
  staff: { id: number; name: string; serviceIds: number[] }[]
  assignments: TaskAssignment[]
}

export type StaffTaskRateDto = {
  taskId: number
  taskName: string
  defaultPercent: number
  percent: number | null
  access: "ANYONE" | "YES" | "NO"
  /** Services this task is part of that the staff member is on. */
  serviceIds: number[]
}

export type CommissionLineDto = {
  id: number | null
  transactionId: number | null
  transactionDate: string | null
  serviceName: string
  taskName: string
  staffId: number
  staffName: string
  percentApplied: number
  rateSource: "STAFF" | "DEFAULT"
  commissionAmount: number
  payoutId: number | null
  /** Claimed outside the person's scope (paid at the task default); for the manager to review. */
  outOfScope: boolean
}

export type TransactionItemDto = {
  id: number | null
  serviceId: number | null
  serviceName: string
  price: number
  tasks: CommissionLineDto[]
}

export type SaleDto = {
  id: number | null
  bookingId: number | null
  customerName: string | null
  serviceName: string | null
  staffName: string | null
  totalAmount: number
  discount: number
  tax: number
  grandTotal: number
  paymentMethod: string
  transactionDate: string
  /** COMPLETED, REFUNDED, PARTIALLY_REFUNDED or VOIDED */
  status?: string
  /** M-Pesa code of the payment claimed for this sale */
  paymentReference?: string | null
  items: TransactionItemDto[] | null
}

export type CheckoutRequest = {
  bookingId?: number
  /** The received M-Pesa payment this sale claims (when the till is connected). */
  mpesaPaymentId?: number
  customerName?: string
  customerPhone?: string
  paymentMethod: PaymentMethod
  discount: number
  tax: number
  items: {
    serviceId: number
    price: number
    tasks: { taskId: number; staffId: number }[]
  }[]
}

export type CashMovementDto = {
  id: number
  type: "IN" | "OUT"
  amount: number
  paymentMethod: string | null
  description: string | null
  movementDate: string
  category: ExpenseCategory | null
  /** Set when recorded automatically from a sale or payout; such entries can't be deleted. */
  transactionId: number | null
  payoutId: number | null
}

export const EXPENSE_CATEGORIES = ["RENT", "SUPPLIES", "UTILITIES", "WAGES", "TRANSPORT", "REPAIRS", "OTHER"] as const
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export const EXPENSE_LABEL: Record<ExpenseCategory, string> = {
  RENT: "Rent",
  SUPPLIES: "Supplies",
  UTILITIES: "Utilities",
  WAGES: "Wages",
  TRANSPORT: "Transport",
  REPAIRS: "Repairs",
  OTHER: "Other",
}

export type CashMovementSummaryDto = { totalIn: number; totalOut: number; net: number }

/** An M-Pesa payment received on the till/paybill that no sale has claimed yet. */
export type MpesaPaymentDto = {
  id: number
  transId: string
  amount: number
  /** "Jane M." */
  payerName: string | null
  /** The account number the customer typed (paybill), if any */
  billRef: string | null
  paidAt: string
  /** Manager list only: the sale it's claimed for (null while unclaimed) and a summary of it */
  transactionId?: number | null
  saleSummary?: string | null
  /** The till or paybill that received it */
  tillName?: string | null
}

/** A business's M-Pesa till or paybill. Credentials are never sent back, only whether each is set. */
export type MpesaTillDto = {
  id: number
  /** Unique across GlowBuddy, fixed once created; part of the Daraja callback URLs */
  username: string
  name: string
  shortcode: string
  type: "TILL" | "PAYBILL"
  active: boolean
  registeredAt: string | null
  consumerKeySet: boolean
  consumerSecretSet: boolean
  initiator: string | null
  securityCredentialSet: boolean
  /** Null when the server has no public callback URL configured */
  confirmationUrl: string | null
  validationUrl: string | null
}

/** Add or edit a till; blank credentials when editing keep the stored ones. */
export type MpesaTillRequest = {
  username?: string
  name?: string
  shortcode?: string
  type?: "TILL" | "PAYBILL"
  active?: boolean
  consumerKey?: string
  consumerSecret?: string
  initiator?: string
  securityCredential?: string
}

export type UnclaimedMpesaDto = { payments: MpesaPaymentDto[] }

/** A code looked up with Safaricom: FOUND (already received) or PENDING (it shows up in the list if paid to this till). */
export type MpesaLookupDto = {
  transId: string
  status: "PENDING" | "FOUND"
  message: string | null
  payment: MpesaPaymentDto | null
}

/** A sale as the staff member who rang it up sees it. No commissions. */
export type MySaleDto = {
  id: number
  transactionDate: string
  customerName: string | null
  services: string[]
  paymentMethod: string
  grandTotal: number
}

/** Staff checkout screen data: the active services only. Tasks are claimed afterwards. */
export type CheckoutOptionsDto = { services: ServiceDto[] }

/** A recent sale as one staff member sees it: tasks they can claim (lineId null) and their own claims. No amounts. */
export type ClaimSaleDto = {
  transactionId: number
  transactionDate: string
  customerName: string | null
  items: {
    itemId: number
    serviceName: string
    /** lineId: their own claim. claimedBy: someone else's claim (name only). Neither: open to claim. */
    /** inScope: set up for them (their service, not assigned only to others); out of scope pays the task default. */
    tasks: {
      taskId: number | null
      taskName: string
      lineId: number | null
      paid: boolean
      claimedBy: string | null
      inScope: boolean
    }[]
  }[]
}

export type DailySalesDto = {
  /** Whole-day totals, whichever page of transactions is loaded. */
  totalSales: number
  transactionCount: number
  averageTicket: number
  transactions: PaginatedResponse<SaleDto>
}

export type CommissionSummaryDto = {
  staffId: number
  staffName: string
  tasksCount: number
  commission: number
  paid: number
  unpaid: number
}

export type CommissionReportDto = {
  /** Totals for the whole range, whichever page of lines is loaded. */
  summary: CommissionSummaryDto
  lines: PaginatedResponse<CommissionLineDto>
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"

export type LeaveClash = {
  bookingId: number
  customerName: string
  bookingDate: string
  bookingTime: string
  serviceName: string
}

export type LeaveDto = {
  id: number
  staffId: number
  staffName: string
  startDate: string
  endDate: string
  startTime: string | null
  endTime: string | null
  reason: string | null
  status: LeaveStatus
  decidedAt: string | null
  decisionNote: string | null
  clashes: LeaveClash[] | null
}

export type LeaveRequestBody = {
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  reason?: string
}

export type PayoutDto = {
  id: number
  staffId: number
  staffName: string
  totalAmount: number
  paymentMethod: string
  reference: string | null
  notes: string | null
  paidAt: string
  status: "PAID" | "VOIDED"
  lines: CommissionLineDto[] | null
}
