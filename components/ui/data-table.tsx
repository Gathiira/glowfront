import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Column<T> = {
  key: string
  label: string
  align?: "left" | "right"
  render: (item: T) => React.ReactNode
}

type Props<T> = {
  title: string
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
}

export function DataTable<T>({ title, data, columns, keyExtractor }: Props<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
      </CardContent>
    </Card>
  )
}
