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
  StaffLoginDto,
  CustomerProfile,
  BusinessMemberDto,
  BusinessRole,
  ServiceDto,
  BusinessCategoryDto,
  BusinessDto,
  BusinessGalleryDto,
  BusinessOpeningHoursDto,
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

/** One page of the team (`current` is 1-based). Active only, unless includeInactive (team list). */
export async function fetchPartnerStaff(
  current: number = 1,
  pageSize: number = PAGE_SIZE,
  includeInactive: boolean = false
): Promise<PaginatedResponse<StaffDto>> {
  try {
    const res = await api
      .get(`/partner/staff?${pageQuery(current, pageSize)}${includeInactive ? "&includeInactive=true" : ""}`)
      .json<ApiResponse<PaginatedResponse<StaffDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

/** Deactivated members can't be booked, picked or log in; their setup is kept for when they're activated again. */
export async function setPartnerStaffActive(id: number, active: boolean): Promise<StaffDto> {
  try {
    const res = await api.put({}, `/partner/staff/${id}/active?active=${active}`).json<ApiResponse<StaffDto>>()
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

/** The signed-in owner or manager's own details. */
export async function fetchMyAccount(): Promise<CustomerProfile> {
  try {
    return (await api.get("/partner/account").json<ApiResponse<CustomerProfile>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

/** Name and phone; email can't be changed here (sign-in is tied to it). */
export async function updateMyAccount(body: { firstName: string; lastName: string; phone: string }): Promise<CustomerProfile> {
  try {
    return (await api.put(body, "/partner/account").json<ApiResponse<CustomerProfile>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

/** The signed-in owner or manager's own password (also their staff portal password if they're on the team). */
export async function changePartnerPassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    await api.put({ currentPassword, newPassword }, "/partner/password").json<ApiResponse<null>>()
  } catch (error) {
    throw await extractError(error)
  }
}

// Owners and managers. Only owners can list or change them; everyone can read their own role.
export async function fetchMyRole(): Promise<BusinessRole> {
  try {
    return (await api.get("/partner/members/me").json<ApiResponse<BusinessRole>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchMembers(): Promise<BusinessMemberDto[]> {
  try {
    return (await api.get("/partner/members").json<ApiResponse<BusinessMemberDto[]>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

/** `identifier`: the email or phone of an existing GlowBuddy account. */
export async function addMember(identifier: string, role: BusinessRole): Promise<BusinessMemberDto> {
  try {
    return (await api.post({ identifier, role }, "/partner/members").json<ApiResponse<BusinessMemberDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function changeMemberRole(id: number, role: BusinessRole): Promise<BusinessMemberDto> {
  try {
    return (await api.put({}, `/partner/members/${id}/role?role=${role}`).json<ApiResponse<BusinessMemberDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function removeMember(id: number): Promise<void> {
  try {
    await api.delete(`/partner/members/${id}`).json<ApiResponse<null>>()
  } catch (error) {
    throw await extractError(error)
  }
}

// Staff portal login: generated default password, shown until they set their own
export async function fetchStaffLogin(id: number): Promise<StaffLoginDto> {
  try {
    return (await api.get(`/partner/staff/${id}/login`).json<ApiResponse<StaffLoginDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function createStaffLogin(id: number, body: { email: string; phone: string }): Promise<StaffLoginDto> {
  try {
    return (await api.post(body, `/partner/staff/${id}/login`).json<ApiResponse<StaffLoginDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

/** Replaces their password with a new generated default. */
export async function resetStaffLogin(id: number): Promise<StaffLoginDto> {
  try {
    return (await api.post({}, `/partner/staff/${id}/login/reset`).json<ApiResponse<StaffLoginDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function sendStaffLogin(id: number, channel: "SMS" | "EMAIL"): Promise<void> {
  try {
    await api.post({}, `/partner/staff/${id}/login/send?channel=${channel}`).json<ApiResponse<null>>()
  } catch (error) {
    throw await extractError(error)
  }
}

export type CreateStaffPayload = {
  name: string
  profilePhotoUrl?: string
  bio?: string
  jobTitle?: string
  careerStartYear?: number
  serviceIds?: number[]
  /** Both together create a staff portal login with a generated default password. */
  email?: string
  phone?: string
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

/** Updates the business's name, description and website (owner only). */
export async function updatePartnerBusinessProfile(body: {
  name: string
  description: string
  website: string
}): Promise<BusinessDto> {
  try {
    return (await api.put(body, "/partner/business/profile").json<ApiResponse<BusinessDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function addPartnerGalleryImage(imageUrl: string): Promise<BusinessGalleryDto> {
  try {
    return (await api.post({ imageUrl }, "/partner/gallery").json<ApiResponse<BusinessGalleryDto>>()).data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function deletePartnerGalleryImage(id: number): Promise<void> {
  try {
    await api.delete(`/partner/gallery/${id}`).json<ApiResponse<null>>()
  } catch (error) {
    throw await extractError(error)
  }
}

/** Replaces the business's weekly opening hours (owner only). */
export async function updatePartnerOpeningHours(
  hours: { dayOfWeek: string; openTime: string | null; closeTime: string | null; closed: boolean }[]
): Promise<BusinessOpeningHoursDto[]> {
  try {
    const res = await api
      .put(hours, "/partner/business/opening-hours")
      .json<ApiResponse<BusinessOpeningHoursDto[]>>()
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
