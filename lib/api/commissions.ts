import { api, extractError, type ApiResponse } from "./client"
import { fetchAllPages, PAGE_SIZE, STAFF_PAGE_SIZE } from "./paging"
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
  TaskAssignment,
  TaskAssignmentsDto,
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

const page = (current: number, pageSize: number = PAGE_SIZE) => ({ current, pageSize })

// Tasks
export const fetchTasksPage = (current: number = 1, pageSize: number = PAGE_SIZE) =>
  call(api.get(`/partner/tasks${query(page(current, pageSize))}`).json<ApiResponse<PaginatedResponse<TaskDto>>>())
/** Every task of the business (catalog task list, pickers). */
export const fetchTasks = () => fetchAllPages(fetchTasksPage)
/** Creates the task as part of `serviceId`; tasks always start under a service. */
export const createTask = (p: { name: string; defaultPercent: number; serviceId: number }) =>
  call(api.post(p, "/partner/tasks").json<ApiResponse<TaskDto>>())
export const updateTask = (id: number, p: { name: string; defaultPercent: number; active: boolean }) =>
  call(api.put(p, `/partner/tasks/${id}`).json<ApiResponse<TaskDto>>())
export const fetchTaskAssignments = () =>
  call(api.get("/partner/tasks/assignments").json<ApiResponse<TaskAssignmentsDto>>())
export const saveTaskAssignments = (assignments: TaskAssignment[]) =>
  call(api.put(assignments, "/partner/tasks/assignments").json<ApiResponse<TaskAssignmentsDto>>())
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
/** Day totals plus one page of the day's transactions (newest first). */
export const fetchDailySales = (date: string, current: number = 1) =>
  call(api.get(`/partner/sales/daily${query({ date, ...page(current) })}`).json<ApiResponse<DailySalesDto>>())
export const fetchBusinessBookings = (current: number = 1) =>
  call(
    api
      .get(`/partner/bookings/business${query(page(current))}`)
      .json<ApiResponse<PaginatedResponse<BookingDto>>>()
  )

// Commissions & payouts (owner)
export const fetchCommissions = (range: DateRange, current: number = 1) =>
  call(
    api
      .get(`/partner/sales/commissions${query({ ...range, ...page(current) })}`)
      .json<ApiResponse<PaginatedResponse<CommissionSummaryDto>>>()
  )
/** Summary for the whole range plus one page of commission lines. */
export const fetchStaffCommissions = (
  staffId: number,
  filter: DateRange & { status?: "PAID" | "UNPAID" },
  current: number = 1
) =>
  call(
    api
      .get(`/partner/sales/commissions/${staffId}${query({ ...filter, ...page(current) })}`)
      .json<ApiResponse<CommissionReportDto>>()
  )
export const fetchPayouts = (staffId?: number, current: number = 1) =>
  call(
    api
      .get(`/partner/payouts${query({ staffId, ...page(current) })}`)
      .json<ApiResponse<PaginatedResponse<PayoutDto>>>()
  )
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
export const fetchMyCommissions = (range: DateRange, current: number = 1) =>
  call(
    api
      .get(`/staff/me/commissions${query({ ...range, ...page(current, STAFF_PAGE_SIZE) })}`)
      .json<ApiResponse<CommissionReportDto>>()
  )
export const fetchMyPayouts = (current: number = 1) =>
  call(api.get(`/staff/me/payouts${query(page(current, STAFF_PAGE_SIZE))}`).json<ApiResponse<PaginatedResponse<PayoutDto>>>())

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
