import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"

type Column<T> = {
  key: string
  label: string
  align?: "left" | "right"
  render: (item: T) => React.ReactNode
}

type Props<T> = {
  title?: string
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  loading?: boolean
  emptyMessage?: string
  headerExtra?: React.ReactNode
  cardless?: boolean
}

export function DataTable<T>({
  title,
  data,
  columns,
  keyExtractor,
  loading,
  emptyMessage,
  headerExtra,
  cardless,
}: Props<T>) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage || "No data found"} />
  }

  const table = (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.align === "right" ? "text-right" : ""}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={col.align === "right" ? "text-right" : ""}
                >
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (cardless) return table

  return (
    <Card>
      {(title || headerExtra) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {headerExtra}
        </CardHeader>
      )}
      <CardContent>{table}</CardContent>
    </Card>
  )
}
