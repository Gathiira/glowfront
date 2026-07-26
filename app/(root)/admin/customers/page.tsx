"use client"

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDateTime } from "@/lib/date-utils"
import {
  fetchAdminCustomers,
  blockCustomer,
  unblockCustomer,
  type AdminUserDto,
} from "@/lib/api/admin"
import type { PaginatedResponse } from "@/lib/types"
import { Pagination } from "@/components/dashboard/pagination"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Search, Ban, Undo2 } from "lucide-react"
import { toast } from "sonner"
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
import { useSearchParams, useRouter, usePathname } from "next/navigation"

const PAGE_SIZE = 15

export default function AdminCustomersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <AdminCustomers />
    </Suspense>
  )
}

function AdminCustomers() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [customers, setCustomers] =
    useState<PaginatedResponse<AdminUserDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [searchInput, setSearchInput] = useState<string | null>(null)
  const [search, setSearch] = useState<string | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || ""
  )

  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => setSearch(searchInput || null), 400)
    return () => clearTimeout(searchTimer.current)
  }, [searchInput])
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminCustomers(
        current,
        PAGE_SIZE,
        statusFilter || undefined,
        search || undefined
      )
      setCustomers(data)
    } catch (err) {
      console.error("Failed to load customers:", err)
      setError("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }, [current, statusFilter, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAction = async (id: number, action: string) => {
    try {
      switch (action) {
        case "block":
          await blockCustomer(id)
          toast.success("Customer blocked")
          break
        case "unblock":
          await unblockCustomer(id)
          toast.success("Customer unblocked")
          break
      }
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed")
    }
  }

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    router.push(`${pathname}?${params.toString()}`)
    setStatusFilter(status)
    setCurrent(0)
  }

  const getActionButton = (customer: AdminUserDto) => {
    switch (customer.status) {
      case "ACTIVE":
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="xs">
                <Ban className="size-3" />
                Block
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Ban className="size-6 text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>Block Customer</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to block {customer.firstName}{" "}
                  {customer.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction(customer.id, "block")}
                >
                  Block
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      case "INACTIVE":
      case "SUSPENDED":
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Undo2 className="size-3" />
                Unblock
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Undo2 className="size-6 text-primary" />
                </AlertDialogMedia>
                <AlertDialogTitle>Unblock Customer</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unblock {customer.firstName}{" "}
                  {customer.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction(customer.id, "unblock")}
                >
                  Unblock
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      default:
        return null
    }
  }

  const statuses = ["", "ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"]

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (c: AdminUserDto) => (
        <span className="font-medium">
          {c.firstName} {c.lastName}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (c: AdminUserDto) => (
        <span className="text-muted-foreground">{c.email}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (c: AdminUserDto) => (
        <span className="text-muted-foreground">{c.phone}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (c: AdminUserDto) => {
        const map: Record<string, "confirmed" | "pending" | "cancelled" | "completed" | "blocked"> = {
          ACTIVE: "confirmed",
          INACTIVE: "blocked",
          SUSPENDED: "blocked",
          DELETED: "cancelled",
        }
        return <StatusBadge status={map[c.status] || "pending"} />
      },
    },
    {
      key: "joined",
      label: "Joined",
      render: (c: AdminUserDto) => (
        <span className="text-muted-foreground">
          {formatDateTime(c.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (c: AdminUserDto) => (
        <div className="flex justify-end">{getActionButton(c)}</div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage all platform customers"
      />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={searchInput ?? ""}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setCurrent(0)
            }}
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilter(s)}
          >
            {s || "All"}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <DataTable
            data={customers?.list || []}
            columns={columns}
            keyExtractor={(c) => c.id}
            loading={loading}
            emptyMessage="No customers found"
            cardless
          />

          {customers && customers.totalPages > 0 && (
            <>
              <div className="mt-4 text-sm text-muted-foreground">
                {customers.totalElements} customer
                {customers.totalElements !== 1 ? "s" : ""} found
              </div>
              <Pagination
                currentPage={current}
                totalPages={customers.totalPages}
                totalElements={customers.totalElements}
                onPageChange={setCurrent}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
