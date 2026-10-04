import { api, extractError, type ApiResponse } from "./client"
import { pageQuery, STAFF_PAGE_SIZE } from "./paging"
import type { LeaveDto, LeaveRequestBody, LeaveStatus, PaginatedResponse, ServiceDto, StaffTaskRateDto } from "@/lib/types"

async function call<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  try {
    return (await request).data
  } catch (error) {
    throw await extractError(error)
  }
}

// Staff
export const fetchMyLeave = (current: number = 1, status?: LeaveStatus) => {
  const q = new URLSearchParams(pageQuery(current, STAFF_PAGE_SIZE))
  if (status) q.set("status", status)
  return call(api.get(`/staff/me/leave?${q.toString()}`).json<ApiResponse<PaginatedResponse<LeaveDto>>>())
}
export const requestLeave = (body: LeaveRequestBody) =>
  call(api.post(body, "/staff/me/leave").json<ApiResponse<LeaveDto>>())
export const cancelLeave = (id: number) =>
  call(api.post({}, `/staff/me/leave/${id}/cancel`).json<ApiResponse<LeaveDto>>())
/** Tasks I can do on my services, with the rate I earn (agreed, else the task default). */
export const fetchMyTasks = () => call(api.get("/staff/me/tasks").json<ApiResponse<StaffTaskRateDto[]>>())
export const fetchMyServices = (current: number = 1, pageSize: number = STAFF_PAGE_SIZE) =>
  call(api.get(`/staff/me/services?${pageQuery(current, pageSize)}`).json<ApiResponse<PaginatedResponse<ServiceDto>>>())

// Owner
export const fetchLeave = (status?: LeaveStatus, staffId?: number, current: number = 1) => {
  const q = new URLSearchParams(pageQuery(current))
  if (status) q.set("status", status)
  if (staffId) q.set("staffId", String(staffId))
  return call(api.get(`/partner/leave?${q.toString()}`).json<ApiResponse<PaginatedResponse<LeaveDto>>>())
}
/** Owner records leave for a team member — approved immediately, past dates allowed. */
export const addLeaveForStaff = (staffId: number, body: LeaveRequestBody) =>
  call(api.post(body, `/partner/leave?staffId=${staffId}`).json<ApiResponse<LeaveDto>>())
export const approveLeave = (id: number, note?: string) =>
  call(api.post({ note }, `/partner/leave/${id}/approve`).json<ApiResponse<LeaveDto>>())
export const rejectLeave = (id: number, note?: string) =>
  call(api.post({ note }, `/partner/leave/${id}/reject`).json<ApiResponse<LeaveDto>>())

/** "12 Oct · all day" / "12 – 14 Oct · all day" / "12 Oct · 10:00–12:00" */
export function leaveWhen(l: Pick<LeaveDto, "startDate" | "endDate" | "startTime" | "endTime">): string {
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })
  const dates = l.startDate === l.endDate ? fmt(l.startDate) : `${fmt(l.startDate)} – ${fmt(l.endDate)}`
  return l.startTime && l.endTime ? `${dates} · ${l.startTime.slice(0, 5)}–${l.endTime.slice(0, 5)}` : `${dates} · all day`
}

export const LEAVE_BADGE: Record<LeaveStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
}
