import { api, extractError, type ApiResponse } from "./client"
import { fetchAllPages, pageQuery, PAGE_SIZE } from "./paging"
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

/** One page of the team (`current` is 1-based). */
export async function fetchPartnerStaff(
  current: number = 1,
  pageSize: number = PAGE_SIZE
): Promise<PaginatedResponse<StaffDto>> {
  try {
    const res = await api
      .get(`/partner/staff?${pageQuery(current, pageSize)}`)
      .json<ApiResponse<PaginatedResponse<StaffDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

/** The whole team, for pickers (e.g. "who did it?" at checkout). */
export const fetchAllPartnerStaff = () => fetchAllPages(fetchPartnerStaff)

export async function fetchPartnerStaffMember(id: number): Promise<StaffDto> {
  try {
    const res = await api.get(`/partner/staff/${id}`).json<ApiResponse<StaffDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

/**
 * Which services the member works on; tasks of other services they had are released.
 * noBookingServiceIds: of those, the ones customers can't book them for (they only help on them).
 * taskIds: exactly the tasks they're assigned (only this member's assignments change).
 */
export async function setPartnerStaffServices(
  id: number,
  serviceIds: number[],
  noBookingServiceIds: number[],
  taskIds: number[]
): Promise<StaffDto> {
  try {
    const res = await api
      .put({ serviceIds, noBookingServiceIds, taskIds }, `/partner/staff/${id}/services`)
      .json<ApiResponse<StaffDto>>()
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

/** One page of the catalog (`current` is 1-based). */
export async function fetchPartnerServices(
  current: number = 1,
  pageSize: number = PAGE_SIZE
): Promise<PaginatedResponse<ServiceDto>> {
  try {
    const res = await api
      .get(`/partner/services?${pageQuery(current, pageSize)}`)
      .json<ApiResponse<PaginatedResponse<ServiceDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

/** The whole catalog, for pickers (e.g. adding a service at checkout). */
export const fetchAllPartnerServices = () => fetchAllPages(fetchPartnerServices)

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

export async function updatePartnerService(id: number, payload: CreateServicePayload): Promise<ServiceDto> {
  try {
    const res = await api.put(payload, `/partner/services/${id}`).json<ApiResponse<ServiceDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

/** Deleted when nothing refers to it; deactivated when it has bookings or sales, so their records are kept. */
export async function deletePartnerService(id: number): Promise<"DELETED" | "DEACTIVATED"> {
  try {
    const res = await api.delete(`/partner/services/${id}`).json<ApiResponse<"DELETED" | "DEACTIVATED">>()
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

/** All categories (paginated endpoint; pickers need the full list). */
export async function fetchPartnerCategories(): Promise<BusinessCategoryDto[]> {
  try {
    return await fetchAllPages((current, pageSize) =>
      api
        .get(`/partner/categories?${pageQuery(current, pageSize)}`)
        .json<ApiResponse<PaginatedResponse<BusinessCategoryDto>>>()
        .then((res) => res.data)
    )
  } catch (error) {
    throw await extractError(error)
  }
}
