import { api, extractError, type ApiResponse } from "./client"
import type {
  CustomerAccountData,
  CustomerLoginData,
  PartnerAccountData,
  PartnerBusinessData,
  DashboardSummaryDto,
  TopServiceDto,
  TopTeamMemberDto,
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
