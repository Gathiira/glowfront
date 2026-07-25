import { api, extractError, type ApiResponse } from "./client"
import type {
  CustomerAccountData,
  CustomerLoginData,
  PartnerAccountData,
  PartnerBusinessData,
  DashboardSummaryDto,
  TopServiceDto,
  TopTeamMemberDto,
  StaffDto,
  ServiceDto,
  BusinessCategoryDto,
  BusinessDto,
  PaginatedResponse,
} from "@/lib/types"

export async function registerCustomer(
  data: CustomerAccountData
): Promise<{ code: number; msg: string; data: { token: string; profile: Record<string, unknown> } }> {
  try {
    return await api.url("/customer/register").post(data).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function registerPartner(
  accountData: PartnerAccountData,
  businessData: PartnerBusinessData
): Promise<{ success: boolean; userId: string }> {
  try {
    return await api
      .url("/partner/register")
      .post({ account: accountData, business: businessData })
      .json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function customerLogin(
  data: CustomerLoginData
): Promise<{ success: boolean; userId: string }> {
  try {
    return await api
      .url("/customer/login")
      .post({ ...data })
      .json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryDto> {
  try {
    const res = await api.get("/partner/dashboard/summary").json<ApiResponse<DashboardSummaryDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchTopServices(): Promise<TopServiceDto[]> {
  try {
    const res = await api.get("/partner/dashboard/top-services").json<ApiResponse<TopServiceDto[]>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchTopTeamMember(): Promise<TopTeamMemberDto | null> {
  try {
    const res = await api.get("/partner/dashboard/top-team-member").json<ApiResponse<TopTeamMemberDto | null>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchPartnerStaff(
  current: number = 0,
  pageSize: number = 20
): Promise<PaginatedResponse<StaffDto>> {
  try {
    const res = await api
      .get(`/partner/staff?current=${current}&pageSize=${pageSize}`)
      .json<ApiResponse<PaginatedResponse<StaffDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export type CreateStaffPayload = {
  name: string
  profilePhotoUrl?: string
  bio?: string
  jobTitle?: string
  yearsExperience?: number
  serviceIds?: number[]
}

export async function createPartnerStaff(
  payload: CreateStaffPayload
): Promise<StaffDto> {
  try {
    const res = await api
      .post(payload, "/partner/staff")
      .json<ApiResponse<StaffDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchPartnerServices(
  current: number = 0,
  pageSize: number = 50
): Promise<PaginatedResponse<ServiceDto>> {
  try {
    const res = await api
      .get(`/partner/services?current=${current}&pageSize=${pageSize}`)
      .json<ApiResponse<PaginatedResponse<ServiceDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export type CreateServicePayload = {
  name: string
  description?: string
  categoryId: number
  durationMinutes: number
  price: number
  currency?: string
  imageUrl?: string
}

export async function createPartnerService(
  payload: CreateServicePayload
): Promise<ServiceDto> {
  try {
    const res = await api
      .post(payload, "/partner/services")
      .json<ApiResponse<ServiceDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchPartnerBusiness(): Promise<BusinessDto> {
  try {
    const res = await api
      .get("/partner/business")
      .json<ApiResponse<BusinessDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchPartnerCategories(): Promise<BusinessCategoryDto[]> {
  try {
    const res = await api
      .get("/partner/categories")
      .json<ApiResponse<BusinessCategoryDto[]>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}
