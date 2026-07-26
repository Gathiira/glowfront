import { api, extractError, type ApiResponse } from "./client"
import type {
  PaginatedResponse,
  BusinessCategoryDto,
  BusinessDto,
  ServiceDto,
  ReviewDto,
} from "@/lib/types"

export type AdminUserDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  status: "ACTIVE" | "BLOCKED" | "PENDING"
  createdAt: string
}

export type AdminPartnerDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string
  businessId: number
  status: "ACTIVE" | "BLOCKED" | "PENDING" | "REJECTED" | "SUSPENDED"
  createdAt: string
}

export type AdminDashboardDto = {
  totalCustomers: number
  totalPartners: number
  totalBusinesses: number
  activeBusinesses: number
  blockedCustomers: number
  blockedPartners: number
  pendingBusinesses: number
  totalCategories: number
  totalServices: number
  totalReviews: number
  totalBookings: number
}

export async function fetchAdminDashboard(): Promise<AdminDashboardDto> {
  try {
    const res = await api
      .get("/admin/dashboard/summary")
      .json<ApiResponse<AdminDashboardDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchAdminCustomers(
  current: number = 0,
  pageSize: number = 20,
  status?: string,
  search?: string
): Promise<PaginatedResponse<AdminUserDto>> {
  try {
    let url = `/admin/customers?current=${current}&pageSize=${pageSize}`
    if (status) url += `&status=${status}`
    if (search) url += `&name=${encodeURIComponent(search)}`
    const res = await api
      .get(url)
      .json<ApiResponse<PaginatedResponse<AdminUserDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function blockCustomer(customerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/customers/${customerId}/block`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function unblockCustomer(customerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/customers/${customerId}/unblock`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function approveCustomer(customerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/customers/${customerId}/approve`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function rejectCustomer(customerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/customers/${customerId}/reject`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchAdminPartners(
  current: number = 0,
  pageSize: number = 20,
  status?: string,
  search?: string
): Promise<PaginatedResponse<AdminPartnerDto>> {
  try {
    let url = `/admin/partners?current=${current}&pageSize=${pageSize}`
    if (status) url += `&status=${status}`
    if (search) url += `&name=${encodeURIComponent(search)}`
    const res = await api
      .get(url)
      .json<ApiResponse<PaginatedResponse<AdminPartnerDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function blockPartner(partnerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/partners/${partnerId}/block`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function unblockPartner(partnerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/partners/${partnerId}/unblock`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function approvePartner(partnerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/partners/${partnerId}/approve`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function rejectPartner(partnerId: number): Promise<void> {
  try {
    await api.post({}, `/admin/partners/${partnerId}/reject`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchAdminBusinesses(
  current: number = 0,
  pageSize: number = 20,
  status?: string,
  search?: string
): Promise<PaginatedResponse<BusinessDto>> {
  try {
    let url = `/admin/businesses?current=${current}&pageSize=${pageSize}`
    if (status) url += `&status=${status}`
    if (search) url += `&name=${encodeURIComponent(search)}`
    const res = await api
      .get(url)
      .json<ApiResponse<PaginatedResponse<BusinessDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function blockBusiness(businessId: number): Promise<void> {
  try {
    await api.post({}, `/admin/businesses/${businessId}/block`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function unblockBusiness(businessId: number): Promise<void> {
  try {
    await api.post({}, `/admin/businesses/${businessId}/unblock`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function approveBusiness(businessId: number): Promise<void> {
  try {
    await api.post({}, `/admin/businesses/${businessId}/approve`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function rejectBusiness(businessId: number): Promise<void> {
  try {
    await api.post({}, `/admin/businesses/${businessId}/reject`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export type AdminCreateServicePayload = {
  name: string
  description?: string
  categoryId: number
  durationMinutes: number
  price: number
  currency?: string
}

export async function createAdminBusinessService(
  businessId: number,
  payload: AdminCreateServicePayload
): Promise<ServiceDto> {
  try {
    const res = await api
      .post(payload, `/admin/businesses/${businessId}/services`)
      .json<ApiResponse<ServiceDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function deleteAdminBusinessService(
  businessId: number,
  serviceId: number
): Promise<void> {
  try {
    await api
      .delete(`/admin/businesses/${businessId}/services/${serviceId}`)
      .json()
  } catch (error) {
    throw await extractError(error)
  }
}

export type AdminCreateCategoryPayload = {
  name: string
  displayName: string
  imageUrl?: string
}

export async function createAdminCategory(
  payload: AdminCreateCategoryPayload
): Promise<BusinessCategoryDto> {
  try {
    const res = await api
      .post(payload, "/admin/categories")
      .json<ApiResponse<BusinessCategoryDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function fetchAdminReviews(
  current: number = 0,
  pageSize: number = 20,
  status?: string
): Promise<PaginatedResponse<ReviewDto>> {
  try {
    let url = `/admin/reviews?current=${current}&pageSize=${pageSize}`
    if (status) url += `&status=${status}`
    const res = await api
      .get(url)
      .json<ApiResponse<PaginatedResponse<ReviewDto>>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}

export async function approveReview(reviewId: number): Promise<void> {
  try {
    await api.post({}, `/admin/reviews/${reviewId}/approve`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function rejectReview(reviewId: number): Promise<void> {
  try {
    await api.post({}, `/admin/reviews/${reviewId}/reject`).json()
  } catch (error) {
    throw await extractError(error)
  }
}

export async function deleteAdminCategory(categoryId: number): Promise<void> {
  try {
    await api.delete(`/admin/categories/${categoryId}`).json()
  } catch (error) {
    throw await extractError(error)
  }
}
