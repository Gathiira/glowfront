import { api, extractError, type ApiResponse } from "./client"
import type {
  CustomerDashboardDto,
  BusinessSearchDto,
  PaginatedResponse,
  BusinessCardDto,
  BusinessCategoryDto,
  BusinessDto,
  ReviewDto,
  StaffDto,
  ServiceDto,
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

export async function fetchBusinessBySlug(slug: string): Promise<BusinessDto> {
  try {
    const res = await api
      .get(`/customer/businesses/slug/${slug}`)
      .json<ApiResponse<BusinessDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchBusinessReviews(
  businessId: number,
  current: number = 0,
  pageSize: number = 5
): Promise<PaginatedResponse<ReviewDto>> {
  try {
    const res = await api
      .get(`/customer/businesses/${businessId}/reviews?current=${current}&pageSize=${pageSize}`)
      .json<ApiResponse<PaginatedResponse<ReviewDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchBusinessStaff(
  businessId: number,
  current: number = 0,
  pageSize: number = 20
): Promise<PaginatedResponse<StaffDto>> {
  try {
    const res = await api
      .get(`/customer/businesses/${businessId}/team?current=${current}&pageSize=${pageSize}`)
      .json<ApiResponse<PaginatedResponse<StaffDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchBusinessServices(
  businessId: number,
  current: number = 0,
  pageSize: number = 20
): Promise<PaginatedResponse<ServiceDto>> {
  try {
    const res = await api
      .get(`/customer/businesses/${businessId}/services?current=${current}&pageSize=${pageSize}`)
      .json<ApiResponse<PaginatedResponse<ServiceDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}
