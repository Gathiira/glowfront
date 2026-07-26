import { cn } from "@/lib/utils"

type Props = {
  message: string
  className?: string
  height?: "h-32" | "h-40" | "h-48"
}

export function EmptyState({ message, className, height = "h-40" }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border text-sm text-muted-foreground",
        height,
        className,
      )}
    >
      {message}
    </div>
  )
}
