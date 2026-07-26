export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr + "T00:00:00") < today
}

export function isPastHour(dateStr: string, hour: number): boolean {
  const now = new Date()
  return new Date(dateStr + "T" + String(hour).padStart(2, "0") + ":00:00") <= now
}

export function isoFormatDate(d: Date): string {
  return d.toISOString().split("T")[0]
}

export function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(":")
  const hour = Number.parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${h12}:${m} ${ampm}`
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}
