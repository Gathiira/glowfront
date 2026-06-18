import { cn } from "@/lib/utils"

type Status = "confirmed" | "pending" | "cancelled" | "completed" | "blocked"

const variants: Record<Status, string> = {
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  blocked: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
}

type Props = {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variants[status],
        className
      )}
    >
      {status}
    </span>
  )
}
