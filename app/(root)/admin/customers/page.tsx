"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  fetchAdminCustomers,
  blockCustomer,
  unblockCustomer,
  approveCustomer,
  rejectCustomer,
  type AdminUserDto,
} from "@/lib/api/admin"
import type { PaginatedResponse } from "@/lib/types"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination } from "@/components/dashboard/pagination"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Search, Ban, CheckCircle, XCircle, Undo2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
    <Suspense fallback={<div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">Loading...</div>}>
      <AdminCustomers />
    </Suspense>
  )
}

function AdminCustomers() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [customers, setCustomers] = useState<PaginatedResponse<AdminUserDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "")
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminCustomers(current, PAGE_SIZE, statusFilter || undefined, search || undefined)
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
        case "approve":
          await approveCustomer(id)
          toast.success("Customer approved")
          break
        case "reject":
          await rejectCustomer(id)
          toast.success("Customer rejected")
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
                  Are you sure you want to block {customer.firstName} {customer.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(customer.id, "block")}>
                  Block
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      case "BLOCKED":
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
                  Are you sure you want to unblock {customer.firstName} {customer.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(customer.id, "unblock")}>
                  Unblock
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      case "PENDING":
        return (
          <div className="flex gap-1">
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
                  <AlertDialogTitle>Approve Customer</AlertDialogTitle>
                  <AlertDialogDescription>
                    Approve {customer.firstName} {customer.lastName}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(customer.id, "approve")}>
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
                  <AlertDialogTitle>Reject Customer</AlertDialogTitle>
                  <AlertDialogDescription>
                    Reject {customer.firstName} {customer.lastName}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(customer.id, "reject")}>
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      default:
        return null
    }
  }

  const statuses = ["", "ACTIVE", "BLOCKED", "PENDING"]

  return (
    <div>
      <PageHeader title="Customers" description="Manage all platform customers" />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrent(0) }}
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

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          Loading...
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-destructive">
          {error}
        </div>
      ) : !customers || customers.list.length === 0 ? (
        <EmptyState message="No customers found" />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {customers.totalElements} customer{customers.totalElements !== 1 ? "s" : ""} found
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.list.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.firstName} {c.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed" | "blocked"} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{getActionButton(c)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={current}
            totalPages={customers.totalPages}
            totalElements={customers.totalElements}
            onPageChange={setCurrent}
          />
        </>
      )}
    </div>
  )
}
