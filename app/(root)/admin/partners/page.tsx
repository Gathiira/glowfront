"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  fetchAdminPartners,
  blockPartner,
  unblockPartner,
  approvePartner,
  rejectPartner,
  type AdminPartnerDto,
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

export default function AdminPartnersPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">Loading...</div>}>
      <AdminPartners />
    </Suspense>
  )
}

function AdminPartners() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [partners, setPartners] = useState<PaginatedResponse<AdminPartnerDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "")
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminPartners(current, PAGE_SIZE, statusFilter || undefined, search || undefined)
      setPartners(data)
    } catch (err) {
      console.error("Failed to load partners:", err)
      setError("Failed to load partners")
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
          await blockPartner(id)
          toast.success("Partner blocked")
          break
        case "unblock":
          await unblockPartner(id)
          toast.success("Partner unblocked")
          break
        case "approve":
          await approvePartner(id)
          toast.success("Partner approved")
          break
        case "reject":
          await rejectPartner(id)
          toast.success("Partner rejected")
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

  const getActionButton = (partner: AdminPartnerDto) => {
    switch (partner.status) {
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
                <AlertDialogTitle>Block Partner</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to block {partner.firstName} {partner.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(partner.id, "block")}>
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
                <AlertDialogTitle>Unblock Partner</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unblock {partner.firstName} {partner.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(partner.id, "unblock")}>
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
                  <AlertDialogTitle>Approve Partner</AlertDialogTitle>
                  <AlertDialogDescription>
                    Approve {partner.firstName} {partner.lastName}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(partner.id, "approve")}>
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
                  <AlertDialogTitle>Reject Partner</AlertDialogTitle>
                  <AlertDialogDescription>
                    Reject {partner.firstName} {partner.lastName}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(partner.id, "reject")}>
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      case "REJECTED":
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Undo2 className="size-3" />
                Reconsider
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Undo2 className="size-6 text-primary" />
                </AlertDialogMedia>
                <AlertDialogTitle>Reconsider Partner</AlertDialogTitle>
                <AlertDialogDescription>
                  Change status for {partner.firstName} {partner.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(partner.id, "approve")}>
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      default:
        return null
    }
  }

  const statuses = ["", "ACTIVE", "BLOCKED", "PENDING", "REJECTED"]

  return (
    <div>
      <PageHeader title="Partners" description="Manage all platform partners" />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
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
      ) : !partners || partners.list.length === 0 ? (
        <EmptyState message="No partners found" />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {partners.totalElements} partner{partners.totalElements !== 1 ? "s" : ""} found
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.list.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.firstName} {p.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-muted-foreground">{p.phoneNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{p.businessName}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.status.toLowerCase() as "confirmed" | "pending" | "cancelled" | "completed" | "blocked"} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{getActionButton(p)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={current}
            totalPages={partners.totalPages}
            totalElements={partners.totalElements}
            onPageChange={setCurrent}
          />
        </>
      )}
    </div>
  )
}
