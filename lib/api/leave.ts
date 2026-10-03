import { api, extractError, type ApiResponse } from "./client"
import type { LeaveDto, LeaveRequestBody, LeaveStatus, ServiceDto } from "@/lib/types"

async function call<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  try {
    return (await request).data
  } catch (error) {
    throw await extractError(error)
  }
}

// Staff
export const fetchMyLeave = () => call(api.get("/staff/me/leave").json<ApiResponse<LeaveDto[]>>())
export const requestLeave = (body: LeaveRequestBody) =>
  call(api.post(body, "/staff/me/leave").json<ApiResponse<LeaveDto>>())
export const cancelLeave = (id: number) =>
  call(api.post({}, `/staff/me/leave/${id}/cancel`).json<ApiResponse<LeaveDto>>())
export const fetchMyServices = () => call(api.get("/staff/me/services").json<ApiResponse<ServiceDto[]>>())

// Owner
export const fetchLeave = (status?: LeaveStatus) =>
  call(api.get(`/partner/leave${status ? `?status=${status}` : ""}`).json<ApiResponse<LeaveDto[]>>())
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
