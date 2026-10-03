import { api, extractError, type ApiResponse } from "./client"
import { fetchAllPages, PAGE_SIZE, STAFF_PAGE_SIZE } from "./paging"
import type {
  BookingDto,
  CashMovementDto,
  CashMovementSummaryDto,
  CheckoutOptionsDto,
  CheckoutRequest,
  ClaimSaleDto,
  CommissionReportDto,
  CommissionSummaryDto,
  CustomerLookupDto,
  ExpenseCategory,
  MySaleDto,
  MpesaLookupDto,
  MpesaPaymentDto,
  MpesaTillDto,
  MpesaTillRequest,
  UnclaimedMpesaDto,
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
/** All sales, newest first; either date may be left out. */
export const fetchTransactions = (range: DateRange, current: number = 1) =>
  call(
    api
      .get(`/partner/sales/transactions${query({ ...range, ...page(current) })}`)
      .json<ApiResponse<PaginatedResponse<SaleDto>>>()
  )
/** Cash movements in a period, newest first (the server defaults to today). */
export const fetchCashMovements = (range: DateRange, current: number = 1) =>
  call(
    api
      .get(`/partner/sales/cash-movement${query({ ...range, ...page(current) })}`)
      .json<ApiResponse<PaginatedResponse<CashMovementDto>>>()
  )
/** An expense: money out with a category. `movementDate` empty means now. */
export const recordExpense = (e: {
  amount: number
  category: ExpenseCategory
  paymentMethod: string
  description?: string
  movementDate?: string
}) => call(api.post({ ...e, type: "OUT" }, "/partner/sales/cash-movement").json<ApiResponse<CashMovementDto>>())
/** Only entries recorded by hand; those from sales and payouts are refused. */
export const deleteCashMovement = (id: number) =>
  call(api.delete(`/partner/sales/cash-movement/${id}`).json<ApiResponse<null>>())
/** In, out and net for the whole period. */
export const fetchCashMovementSummary = (range: DateRange) =>
  call(api.get(`/partner/sales/cash-movement/summary${query(range)}`).json<ApiResponse<CashMovementSummaryDto>>())
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

/** Past customers (bookings and sales) whose name or phone contains `q`; needs 2+ characters. */
export const searchCustomers = (q: string) =>
  call(api.get(`/partner/clients/search${query({ q })}`).json<ApiResponse<CustomerLookupDto[]>>())

// Manager review of an unpaid commission line
export const approveLine = (lineId: number) =>
  call(api.post({}, `/partner/commission-lines/${lineId}/approve`).json<ApiResponse<null>>())
export const rejectLine = (lineId: number) =>
  call(api.post({}, `/partner/commission-lines/${lineId}/reject`).json<ApiResponse<null>>())
export const reassignLine = (lineId: number, staffId: number) =>
  call(api.post({ staffId }, `/partner/commission-lines/${lineId}/reassign`).json<ApiResponse<null>>())

/**
 * M-Pesa matching, for managers (`/partner/mpesa`) or staff (`/staff/me/mpesa`): unclaimed payments (search by
 * name, code or account number; up to 7 days back), M-Pesa sales awaiting their payment, and attaching one to the other.
 */
export function mpesaApi(staffMode: boolean) {
  const base = staffMode ? "/staff/me/mpesa" : "/partner/mpesa"
  return {
    unclaimed: (q?: string, days: number = 1) =>
      call(api.get(`${base}/unclaimed${query({ q, days })}`).json<ApiResponse<UnclaimedMpesaDto>>()),
    awaiting: () => call(api.get(`${base}/awaiting`).json<ApiResponse<MySaleDto[]>>()),
    attach: (paymentId: number, transactionId: number) =>
      call(api.post({ paymentId, transactionId }, `${base}/attach`).json<ApiResponse<null>>()),
    /** Ask Safaricom about a code; if it was paid to this till it shows up in `unclaimed` shortly after. */
    lookup: (code: string) => call(api.post({ code }, `${base}/lookup`).json<ApiResponse<MpesaLookupDto>>()),
  }
}

/** Managers: every M-Pesa payment, claimed or not, paged. */
export const fetchMpesaPayments = (q: string, status: "ALL" | "CLAIMED" | "UNCLAIMED", current: number = 1) =>
  call(
    api
      .get(`/partner/mpesa/payments${query({ q: q.trim() || undefined, status, ...page(current) })}`)
      .json<ApiResponse<PaginatedResponse<MpesaPaymentDto>>>()
  )
// Managers: M-Pesa tills (each has a slug and secret in its callback URLs)
export const fetchTills = () => call(api.get("/partner/mpesa/tills").json<ApiResponse<MpesaTillDto[]>>())
export const addTill = (t: MpesaTillRequest) => call(api.post(t, "/partner/mpesa/tills").json<ApiResponse<MpesaTillDto>>())
export const updateTill = (id: number, t: MpesaTillRequest) =>
  call(api.put(t, `/partner/mpesa/tills/${id}`).json<ApiResponse<MpesaTillDto>>())
/** Registers the till's confirmation and validation URLs with Safaricom. */
export const registerTill = (id: number) =>
  call(api.post({}, `/partner/mpesa/tills/${id}/register`).json<ApiResponse<MpesaTillDto>>())

/** Managers: detach a payment from its sale; the sale awaits payment again. */
export const unclaimMpesaPayment = (id: number) =>
  call(api.post({}, `/partner/mpesa/${id}/unclaim`).json<ApiResponse<null>>())

// Staff checkout: their own business, from the staff portal
export const searchMyCustomers = (q: string) =>
  call(api.get(`/staff/me/checkout/customers${query({ q })}`).json<ApiResponse<CustomerLookupDto[]>>())
export const fetchCheckoutOptions = () =>
  call(api.get("/staff/me/checkout/options").json<ApiResponse<CheckoutOptionsDto>>())
export const previewMyCheckout = (req: CheckoutRequest) =>
  call(api.post(req, "/staff/me/checkout/preview").json<ApiResponse<SaleDto>>())
export const myCheckout = (req: CheckoutRequest) => call(api.post(req, "/staff/me/checkout").json<ApiResponse<SaleDto>>())

// Staff claims: the tasks they did on recent sales
export const fetchMyClaims = (current: number = 1) =>
  call(
    api
      .get(`/staff/me/claims${query(page(current, STAFF_PAGE_SIZE))}`)
      .json<ApiResponse<PaginatedResponse<ClaimSaleDto>>>()
  )
export const claimTask = (itemId: number, taskId: number) =>
  call(api.post({ itemId, taskId }, "/staff/me/claims").json<ApiResponse<null>>())
export const unclaimTask = (lineId: number) => call(api.delete(`/staff/me/claims/${lineId}`).json<ApiResponse<null>>())

// Staff self-view
export const fetchMyCommissions = (range: DateRange, current: number = 1) =>
  call(
    api
      .get(`/staff/me/commissions${query({ ...range, ...page(current, STAFF_PAGE_SIZE) })}`)
      .json<ApiResponse<CommissionReportDto>>()
  )
/** One of my payouts with the tasks it covered. */
export const fetchMyPayout = (id: number) => call(api.get(`/staff/me/payouts/${id}`).json<ApiResponse<PayoutDto>>())
/** Sales I rang up today, newest first. */
export const fetchMySalesToday = () => call(api.get("/staff/me/sales/today").json<ApiResponse<MySaleDto[]>>())
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
