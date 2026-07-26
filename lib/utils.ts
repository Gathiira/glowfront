import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(value: number | null | undefined, decimals: number = 1): string {
  return (value ?? 0).toFixed(decimals)
}

export function fmtNum(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString()
}
