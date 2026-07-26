"use client"

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDateTime } from "@/lib/date-utils"
import {
  fetchAdminPartners,
  blockPartner,
  unblockPartner,
  type AdminPartnerDto,
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

export default function AdminPartnersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <AdminPartners />
    </Suspense>
  )
}

function AdminPartners() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [partners, setPartners] =
    useState<PaginatedResponse<AdminPartnerDto> | null>(null)
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
      const data = await fetchAdminPartners(
        current,
        PAGE_SIZE,
        statusFilter || undefined,
        search || undefined
      )
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
                  Are you sure you want to block {partner.firstName}{" "}
                  {partner.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction(partner.id, "block")}
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
                <AlertDialogTitle>Unblock Partner</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unblock {partner.firstName}{" "}
                  {partner.lastName}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction(partner.id, "unblock")}
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
      render: (p: AdminPartnerDto) => (
        <span className="font-medium">
          {p.firstName} {p.lastName}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (p: AdminPartnerDto) => (
        <span className="text-muted-foreground">{p.email}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (p: AdminPartnerDto) => (
        <span className="text-muted-foreground">{p.phone}</span>
      ),
    },
    {
      key: "business",
      label: "Business",
      render: (p: AdminPartnerDto) => (
        <span className="text-muted-foreground">{p.businessName}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (p: AdminPartnerDto) => {
        const map: Record<
          string,
          "confirmed" | "pending" | "cancelled" | "completed" | "blocked"
        > = {
          ACTIVE: "confirmed",
          INACTIVE: "blocked",
          SUSPENDED: "blocked",
          DELETED: "cancelled",
        }
        return <StatusBadge status={map[p.status] || "pending"} />
      },
    },
    {
      key: "joined",
      label: "Joined",
      render: (p: AdminPartnerDto) => (
        <span className="text-muted-foreground">
          {formatDateTime(p.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (p: AdminPartnerDto) => (
        <div className="flex justify-end">{getActionButton(p)}</div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Partners" description="Manage all platform partners" />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
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
            data={partners?.list || []}
            columns={columns}
            keyExtractor={(p) => p.id}
            loading={loading}
            emptyMessage="No partners found"
            cardless
          />

          {partners && partners.totalPages > 0 && (
            <>
              <div className="mt-4 text-sm text-muted-foreground">
                {partners.totalElements} partner
                {partners.totalElements !== 1 ? "s" : ""} found
              </div>
              <Pagination
                currentPage={current}
                totalPages={partners.totalPages}
                totalElements={partners.totalElements}
                onPageChange={setCurrent}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
