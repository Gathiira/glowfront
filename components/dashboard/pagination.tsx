"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {totalElements} result{totalElements !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(0)}
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="px-3 text-sm text-muted-foreground">
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
