import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  rows?: number
  card?: boolean
  className?: string
}

export function LoadingState({ rows = 3, card = true, className }: Props) {
  const content = (
    <div className={className || "space-y-3"}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-3 w-48" />
          {i < rows - 1 && <Skeleton className="mt-3 h-8 w-20" />}
        </div>
      ))}
    </div>
  )

  if (!card) return content

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">{content}</CardContent>
        </Card>
      ))}
    </div>
  )
}
