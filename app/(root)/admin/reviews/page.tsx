"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { fetchAdminReviews, approveReview, rejectReview } from "@/lib/api/admin"
import type { ReviewDto, PaginatedResponse } from "@/lib/types"
import { Pagination } from "@/components/dashboard/pagination"
import { CheckCircle, XCircle, Star } from "lucide-react"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/date-utils"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

const PAGE_SIZE = 15

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">Loading...</div>}>
      <AdminReviews />
    </Suspense>
  )
}

function AdminReviews() {
  const [reviews, setReviews] = useState<PaginatedResponse<ReviewDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminReviews(current, PAGE_SIZE)
      setReviews(data)
    } catch (err) {
      console.error("Failed to load reviews:", err)
      setError("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [current])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleApprove = async (id: number) => {
    try {
      await approveReview(id)
      toast.success("Review approved")
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve")
    }
  }

  const handleReject = async (id: number) => {
    try {
      await rejectReview(id)
      toast.success("Review rejected")
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject")
    }
  }

  const columns = [
    {
      key: "customer",
      label: "Customer",
      render: (r: ReviewDto) => <span className="font-medium">{r.customerName}</span>,
    },
    {
      key: "business",
      label: "Business",
      render: (r: ReviewDto) => <span className="text-muted-foreground">{r.businessName || r.businessId}</span>,
    },
    {
      key: "rating",
      label: "Rating",
      render: (r: ReviewDto) => (
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>{r.rating}</span>
        </div>
      ),
    },
    {
      key: "comment",
      label: "Comment",
      render: (r: ReviewDto) => (
        <span className="max-w-xs truncate text-muted-foreground">{r.comment}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (r: ReviewDto) => (
        <span className="text-muted-foreground">{formatDateTime(r.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (r: ReviewDto) => (
        <div className="flex items-center justify-end gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="xs" className="text-green-600">
                <CheckCircle className="size-3" />
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <CheckCircle className="size-6 text-green-600" />
                </AlertDialogMedia>
                <AlertDialogTitle>Approve Review</AlertDialogTitle>
                <AlertDialogDescription>
                  Approve this review from {r.customerName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleApprove(r.id)}>
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="xs">
                <XCircle className="size-3" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <XCircle className="size-6 text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>Reject Review</AlertDialogTitle>
                <AlertDialogDescription>
                  Reject this review from {r.customerName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleReject(r.id)}>
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Reviews" description="Manage customer reviews" />

      {error ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <DataTable
            data={reviews?.list || []}
            columns={columns}
            keyExtractor={(r) => r.id}
            loading={loading}
            emptyMessage="No reviews found"
            cardless
          />

          {reviews && reviews.totalPages > 0 && (
            <>
              <div className="mt-4 text-sm text-muted-foreground">
                {reviews.totalElements} review{reviews.totalElements !== 1 ? "s" : ""} found
              </div>
              <Pagination
                currentPage={current}
                totalPages={reviews.totalPages}
                totalElements={reviews.totalElements}
                onPageChange={setCurrent}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
