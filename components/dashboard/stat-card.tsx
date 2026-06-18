import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

type Props = {
  title: string
  value: string | number
  description?: string
  trend?: { direction: "up" | "down"; value: string }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, description, trend, icon, className }: Props) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.direction === "up" ? (
                <TrendingUp className="size-3 text-green-600" />
              ) : (
                <TrendingDown className="size-3 text-red-600" />
              )}
              <span
                className={
                  trend.direction === "up" ? "text-green-600" : "text-red-600"
                }
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardContent>
    </Card>
  )
}
