import { api, extractError, type ApiResponse } from "./client"
import type { CustomerDashboardDto } from "@/lib/types"

export async function fetchCustomerDashboard(): Promise<CustomerDashboardDto> {
  try {
    const res = await api.get("/customer/dashboard/summary").json<ApiResponse<CustomerDashboardDto>>()
    return res.data
  } catch (error) {
    throw await extractError(error)
  }
}
