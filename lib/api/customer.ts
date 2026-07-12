import { api, extractError, type ApiResponse } from "./client"
import type {
  CustomerDashboardDto,
  BusinessSearchDto,
  PaginatedResponse,
  BusinessCardDto,
  BusinessCategoryDto,
} from "@/lib/types"

export async function fetchCustomerDashboard(): Promise<CustomerDashboardDto> {
  try {
    const res = await api.get("/customer/dashboard/summary").json<ApiResponse<CustomerDashboardDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function searchBusinesses(
  filters: BusinessSearchDto
): Promise<PaginatedResponse<BusinessCardDto>> {
  try {
    const res = await api
      .post(filters, "/customer/businesses/search")
      .json<ApiResponse<PaginatedResponse<BusinessCardDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchBusinessCategories(): Promise<BusinessCategoryDto[]> {
  try {
    const res = await api.get("/customer/categories").json<ApiResponse<BusinessCategoryDto[]>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}
