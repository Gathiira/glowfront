"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CustomerProfile, Business, CustomerAppointment, BusinessReview } from "@/lib/types"

const mockProfile: CustomerProfile = {
  id: "c1",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "+1 (555) 987-6543",
}

const mockBusinesses: Business[] = [
  {
    id: "b1",
    name: "Glamour Cuts",
    category: "Hair Salon",
    address: "123 Main St",
    town: "New York",
    phone: "+1 (555) 111-2222",
    description: "Premium hair salon offering precision cuts, vibrant coloring, and modern styling in a relaxing atmosphere. Our experienced stylists stay current with the latest trends.",
    rating: 4.5,
    reviewCount: 128,
    services: [
      { id: "s1", name: "Women's Haircut", price: 65, duration: 45, description: "Wash, cut & blow-dry" },
      { id: "s2", name: "Men's Haircut", price: 40, duration: 30, description: "Cut & style" },
      { id: "s3", name: "Full Color", price: 120, duration: 90, description: "Permanent color application" },
      { id: "s4", name: "Balayage", price: 180, duration: 120, description: "Hand-painted highlights" },
    ],
    team: [
      { id: "t1", name: "Sophie Chen", role: "Senior Stylist" },
      { id: "t2", name: "Marcus Lee", role: "Colorist" },
    ],
    reviews: [
      { id: "r1", clientName: "Alice W.", rating: 5, text: "Best haircut I've ever had! Sophie really listened to what I wanted.", date: "2026-06-10" },
      { id: "r2", clientName: "Tom K.", rating: 4, text: "Great barber, fair price. Will be back.", date: "2026-06-08" },
      { id: "r3", clientName: "Emma R.", rating: 5, text: "The balayage came out stunning. Highly recommend Marcus!", date: "2026-06-05" },
    ],
  },
  {
    id: "b2",
    name: "Polished Nail Bar",
    category: "Nails",
    address: "456 Oak Ave",
    town: "New York",
    phone: "+1 (555) 222-3333",
    description: "Luxury nail salon specializing in manicures, pedicures, and custom nail art. We use only premium products for lasting results.",
    rating: 4.8,
    reviewCount: 95,
    services: [
      { id: "s5", name: "Classic Manicure", price: 35, duration: 30, description: "Nail shaping, cuticle care & polish" },
      { id: "s6", name: "Gel Manicure", price: 50, duration: 45, description: "Long-lasting gel polish application" },
      { id: "s7", name: "Spa Pedicure", price: 65, duration: 60, description: "Foot soak, scrub, massage & polish" },
      { id: "s8", name: "Nail Art", price: 25, duration: 30, description: "Custom design per hand" },
    ],
    team: [
      { id: "t3", name: "Linda Park", role: "Nail Technician" },
      { id: "t4", name: "Julie Kim", role: "Senior Nail Artist" },
    ],
    reviews: [
      { id: "r4", clientName: "Sarah J.", rating: 5, text: "Linda does the best gel manicures. They last 3 weeks!", date: "2026-06-12" },
      { id: "r5", clientName: "Mia T.", rating: 5, text: "The nail art here is incredible. So detailed!", date: "2026-06-09" },
    ],
  },
  {
    id: "b3",
    name: "Urban Barber Co.",
    category: "Barber",
    address: "789 Pine St",
    town: "Brooklyn",
    phone: "+1 (555) 333-4444",
    description: "Classic barbershop with a modern edge. Specializing in fades, beard trims, and hot towel shaves.",
    rating: 4.3,
    reviewCount: 210,
    services: [
      { id: "s9", name: "Classic Haircut", price: 35, duration: 30, description: "Scissor & clipper cut" },
      { id: "s10", name: "Beard Trim", price: 20, duration: 20, description: "Shape & line-up" },
      { id: "s11", name: "Hot Towel Shave", price: 45, duration: 45, description: "Traditional straight razor shave" },
      { id: "s12", name: "Haircut + Beard", price: 50, duration: 45, description: "Complete grooming combo" },
    ],
    team: [
      { id: "t5", name: "Dre Williams", role: "Master Barber" },
      { id: "t6", name: "Carlos Reyes", role: "Barber" },
    ],
    reviews: [
      { id: "r6", clientName: "James W.", rating: 5, text: "Dre gives the cleanest fade in Brooklyn.", date: "2026-06-11" },
      { id: "r7", clientName: "Alex M.", rating: 4, text: "Great atmosphere, fair prices.", date: "2026-06-07" },
    ],
  },
  {
    id: "b4",
    name: "Serenity Massage Studio",
    category: "Massage",
    address: "321 Elm St",
    town: "New York",
    phone: "+1 (555) 444-5555",
    description: "A peaceful retreat offering therapeutic and relaxation massages. Our licensed therapists tailor each session to your needs.",
    rating: 4.7,
    reviewCount: 167,
    services: [
      { id: "s13", name: "Swedish Massage", price: 80, duration: 60, description: "Full-body relaxation" },
      { id: "s14", name: "Deep Tissue Massage", price: 100, duration: 60, description: "Targeted muscle relief" },
      { id: "s15", name: "Hot Stone Massage", price: 120, duration: 75, description: "Heated stones + massage" },
      { id: "s16", name: "Aromatherapy Massage", price: 95, duration: 60, description: "Essential oils + massage" },
    ],
    team: [
      { id: "t7", name: "Nina Patel", role: "Licensed Massage Therapist" },
      { id: "t8", name: "Ryan O'Brien", role: "Deep Tissue Specialist" },
    ],
    reviews: [
      { id: "r8", clientName: "Lisa H.", rating: 5, text: "Nina has magic hands. I always leave feeling renewed.", date: "2026-06-13" },
      { id: "r9", clientName: "David L.", rating: 4, text: "Great deep tissue massage. Really worked out the knots.", date: "2026-06-06" },
    ],
  },
  {
    id: "b5",
    name: "Luxe Beauty Lounge",
    category: "Beauty Salon",
    address: "555 Park Ave",
    town: "Manhattan",
    phone: "+1 (555) 555-6666",
    description: "Full-service beauty salon offering facials, makeup, waxing, and brow artistry. Your one-stop destination for self-care.",
    rating: 4.6,
    reviewCount: 143,
    services: [
      { id: "s17", name: "European Facial", price: 95, duration: 60, description: "Deep cleanse, exfoliation & mask" },
      { id: "s18", name: "Brow Wax & Tint", price: 40, duration: 20, description: "Shape & color" },
      { id: "s19", name: "Full Face Makeup", price: 75, duration: 45, description: "Professional makeup application" },
      { id: "s20", name: "Lash Lift", price: 60, duration: 45, description: "Curled & lifted natural lashes" },
    ],
    team: [
      { id: "t9", name: "Chloe Martinez", role: "Esthetician" },
      { id: "t10", name: "Bianca Rose", role: "Makeup Artist" },
    ],
    reviews: [
      { id: "r10", clientName: "Olivia P.", rating: 5, text: "Chloe's facials are incredible. My skin has never looked better!", date: "2026-06-10" },
      { id: "r11", clientName: "Zoe A.", rating: 4, text: "Great makeup for my wedding trial. Very professional.", date: "2026-06-04" },
    ],
  },
  {
    id: "b6",
    name: "Ink & Steel Tattoo",
    category: "Tattooing and Piercing",
    address: "888 Broadway",
    town: "Brooklyn",
    phone: "+1 (555) 666-7777",
    description: "Award-winning tattoo studio with a focus on custom designs. Clean, professional, and artistic.",
    rating: 4.4,
    reviewCount: 189,
    services: [
      { id: "s21", name: "Small Tattoo", price: 100, duration: 60, description: "Up to 2 inches" },
      { id: "s22", name: "Medium Tattoo", price: 200, duration: 120, description: "Up to 6 inches" },
      { id: "s23", name: "Large Tattoo", price: 400, duration: 240, description: "Full session" },
      { id: "s24", name: "Piercing", price: 50, duration: 15, description: "Ear, nose, or lip" },
    ],
    team: [
      { id: "t11", name: "Jake Torres", role: "Tattoo Artist" },
      { id: "t12", name: "Maya Singh", role: "Piercing Specialist" },
    ],
    reviews: [
      { id: "r12", clientName: "Ryan K.", rating: 5, text: "Jake did my sleeve and it's a masterpiece. Book early!", date: "2026-06-09" },
      { id: "r13", clientName: "Priya S.", rating: 4, text: "Clean studio, professional staff. Love my new piercing!", date: "2026-06-02" },
    ],
  },
]

const today = new Date()
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const mockAppointments: CustomerAppointment[] = [
  {
    id: "a1",
    businessId: "b1",
    businessName: "Glamour Cuts",
    serviceName: "Women's Haircut",
    servicePrice: 65,
    teamMemberName: "Sophie Chen",
    date: ymd(today),
    startTime: "10:00",
    endTime: "10:45",
    status: "confirmed",
    reviewed: false,
  },
  {
    id: "a2",
    businessId: "b2",
    businessName: "Polished Nail Bar",
    serviceName: "Gel Manicure",
    servicePrice: 50,
    teamMemberName: "Linda Park",
    date: ymd(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    startTime: "14:00",
    endTime: "14:45",
    status: "confirmed",
    reviewed: false,
  },
  {
    id: "a3",
    businessId: "b4",
    businessName: "Serenity Massage Studio",
    serviceName: "Swedish Massage",
    servicePrice: 80,
    teamMemberName: "Nina Patel",
    date: ymd(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
    startTime: "11:00",
    endTime: "12:00",
    status: "completed",
    reviewed: false,
  },
  {
    id: "a4",
    businessId: "b3",
    businessName: "Urban Barber Co.",
    serviceName: "Classic Haircut",
    servicePrice: 35,
    teamMemberName: "Carlos Reyes",
    date: ymd(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12)),
    startTime: "15:30",
    endTime: "16:00",
    status: "completed",
    reviewed: true,
  },
]

type CustomerContextType = {
  profile: CustomerProfile
  businesses: Business[]
  appointments: CustomerAppointment[]
  getBusiness: (id: string) => Business | undefined
  createAppointment: (appt: Omit<CustomerAppointment, "id" | "reviewed">) => void
  cancelAppointment: (id: string) => void
  addReview: (businessId: string, appointmentId: string, rating: number, text: string) => void
  updateProfile: (data: Partial<CustomerProfile>) => void
  getAppointmentsForDate: (date: string) => CustomerAppointment[]
  getAppointmentsForBusiness: (businessId: string) => CustomerAppointment[]
}

const CustomerContext = createContext<CustomerContextType | null>(null)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(mockProfile)
  const [appointments, setAppointments] = useState<CustomerAppointment[]>(mockAppointments)
  const [businesses] = useState<Business[]>(mockBusinesses)

  const getBusiness = useCallback(
    (id: string) => businesses.find((b) => b.id === id),
    [businesses],
  )

  const createAppointment = useCallback(
    (data: Omit<CustomerAppointment, "id" | "reviewed">) => {
      const newAppt: CustomerAppointment = {
        ...data,
        id: `a${Date.now()}`,
        reviewed: false,
      }
      setAppointments((prev) => [...prev, newAppt])
    },
    [],
  )

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a)),
    )
  }, [])

  const addReview = useCallback(
    (businessId: string, appointmentId: string, rating: number, text: string) => {
      const business = businesses.find((b) => b.id === businessId)
      if (business) {
        const newReview: BusinessReview = {
          id: `r${Date.now()}`,
          clientName: `${profile.firstName} ${profile.lastName}`,
          rating,
          text,
          date: ymd(new Date()),
        }
        business.reviews.push(newReview)
        business.reviewCount = business.reviews.length
        business.rating =
          business.reviews.reduce((s, r) => s + r.rating, 0) / business.reviews.length
      }
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, reviewed: true } : a)),
      )
    },
    [businesses, profile.firstName, profile.lastName],
  )

  const updateProfile = useCallback((data: Partial<CustomerProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }, [])

  const getAppointmentsForDate = useCallback(
    (date: string) => appointments.filter((a) => a.date === date),
    [appointments],
  )

  const getAppointmentsForBusiness = useCallback(
    (businessId: string) => appointments.filter((a) => a.businessId === businessId),
    [appointments],
  )

  return (
    <CustomerContext.Provider
      value={{
        profile,
        businesses,
        appointments,
        getBusiness,
        createAppointment,
        cancelAppointment,
        addReview,
        updateProfile,
        getAppointmentsForDate,
        getAppointmentsForBusiness,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider")
  return ctx
}
