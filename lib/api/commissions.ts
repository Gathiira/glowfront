import { api, extractError, type ApiResponse } from "./client"
import type {
  BookingDto,
  CheckoutRequest,
  CommissionReportDto,
  CommissionSummaryDto,
  DailySalesDto,
  PaginatedResponse,
  PayoutDto,
  SaleDto,
  StaffTaskRateDto,
  TaskDto,
} from "@/lib/types"

async function call<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  try {
    return (await request).data
  } catch (error) {
    throw await extractError(error)
  }
}

function query(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ""
}

export type DateRange = { startDate?: string; endDate?: string }

// Tasks
export const fetchTasks = () => call(api.get("/partner/tasks").json<ApiResponse<TaskDto[]>>())
export const createTask = (p: { name: string; defaultPercent: number }) =>
  call(api.post(p, "/partner/tasks").json<ApiResponse<TaskDto>>())
export const updateTask = (id: number, p: { name: string; defaultPercent: number; active: boolean }) =>
  call(api.put(p, `/partner/tasks/${id}`).json<ApiResponse<TaskDto>>())
export const fetchServiceTasks = (serviceId: number) =>
  call(api.get(`/partner/services/${serviceId}/tasks`).json<ApiResponse<TaskDto[]>>())
export const saveServiceTasks = (serviceId: number, taskIds: number[]) =>
  call(api.put(taskIds, `/partner/services/${serviceId}/tasks`).json<ApiResponse<TaskDto[]>>())
export const fetchStaffTaskRates = (staffId: number) =>
  call(api.get(`/partner/staff/${staffId}/task-rates`).json<ApiResponse<StaffTaskRateDto[]>>())
export const saveStaffTaskRates = (staffId: number, rates: { taskId: number; percent: number | null }[]) =>
  call(api.put(rates, `/partner/staff/${staffId}/task-rates`).json<ApiResponse<StaffTaskRateDto[]>>())

// Sales
export const previewCheckout = (req: CheckoutRequest) =>
  call(api.post(req, "/partner/sales/checkout/preview").json<ApiResponse<SaleDto>>())
export const checkout = (req: CheckoutRequest) =>
  call(api.post(req, "/partner/sales/checkout").json<ApiResponse<SaleDto>>())
export const fetchDailySales = (date: string) =>
  call(api.get(`/partner/sales/daily${query({ date })}`).json<ApiResponse<DailySalesDto>>())
// ponytail: one unsorted page of 100; add server-side sort/paging when businesses have more bookings
export const fetchBusinessBookings = () =>
  call(api.get("/partner/bookings/business?current=0&pageSize=100").json<ApiResponse<PaginatedResponse<BookingDto>>>())

// Commissions & payouts (owner)
export const fetchCommissions = (range: DateRange) =>
  call(api.get(`/partner/sales/commissions${query(range)}`).json<ApiResponse<CommissionSummaryDto[]>>())
export const fetchStaffCommissions = (staffId: number, filter: DateRange & { status?: "PAID" | "UNPAID" }) =>
  call(api.get(`/partner/sales/commissions/${staffId}${query(filter)}`).json<ApiResponse<CommissionReportDto>>())
export const fetchPayouts = (staffId?: number) =>
  call(api.get(`/partner/payouts${query({ staffId })}`).json<ApiResponse<PayoutDto[]>>())
export const fetchPayout = (id: number) => call(api.get(`/partner/payouts/${id}`).json<ApiResponse<PayoutDto>>())
export const createPayout = (req: {
  staffId: number
  taskIds: number[]
  paymentMethod: string
  reference?: string
  notes?: string
}) => call(api.post(req, "/partner/payouts").json<ApiResponse<PayoutDto>>())
export const voidPayout = (id: number) => call(api.post({}, `/partner/payouts/${id}/void`).json<ApiResponse<PayoutDto>>())

// Staff self-view
export const fetchMyCommissions = (range: DateRange) =>
  call(api.get(`/staff/me/commissions${query(range)}`).json<ApiResponse<CommissionReportDto>>())
export const fetchMyPayouts = () => call(api.get("/staff/me/payouts").json<ApiResponse<PayoutDto[]>>())

/** Today in local time as YYYY-MM-DD. */
export function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** First day of the current month as YYYY-MM-DD. */
export function monthStart(): string {
  return today().slice(0, 8) + "01"
}

export function money(n: number | null | undefined): string {
  return (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
