"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type {
  CustomerProfile,
  CustomerAppointment,
} from "@/lib/types"

const mockProfile: CustomerProfile = {
  id: "c1",
  firstName: "Guest",
  lastName: "",
  email: "",
  phone: "",
}

function profileFromStorage(): CustomerProfile | null {
  try {
    const stored = localStorage.getItem("customer_profile")
    if (!stored) return null
    const raw = JSON.parse(stored)
    return {
      id: String(raw.id ?? raw.userId ?? ""),
      firstName: raw.firstName ?? "",
      lastName: raw.lastName ?? "",
      email: raw.email ?? "",
      phone: raw.phone ?? "",
    }
  } catch {
    return null
  }
}

export function clearCustomerProfile() {
  localStorage.removeItem("customer_profile")
}

type CustomerContextType = {
  profile: CustomerProfile
  createAppointment: (
    appt: Omit<CustomerAppointment, "id" | "reviewed">
  ) => void
  getAppointmentsForBusiness: (businessId: string) => CustomerAppointment[]
  updateProfile: (data: Partial<CustomerProfile>) => void
}

const CustomerContext = createContext<CustomerContextType | null>(null)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(() => {
    const stored = profileFromStorage()
    return stored ?? mockProfile
  })
  const [appointments, setAppointments] =
    useState<CustomerAppointment[]>([])

  const createAppointment = useCallback(
    (data: Omit<CustomerAppointment, "id" | "reviewed">) => {
      const newAppt: CustomerAppointment = {
        ...data,
        id: `a${Date.now()}`,
        reviewed: false,
      }
      setAppointments((prev) => [...prev, newAppt])
    },
    []
  )

  const getAppointmentsForBusiness = useCallback(
    (businessId: string) =>
      appointments.filter((a) => a.businessId === businessId),
    [appointments]
  )

  const updateProfile = useCallback((data: Partial<CustomerProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }, [])

  return (
    <CustomerContext.Provider
      value={{
        profile,
        createAppointment,
        getAppointmentsForBusiness,
        updateProfile,
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
