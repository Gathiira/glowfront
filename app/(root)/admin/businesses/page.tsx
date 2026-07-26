"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  fetchAdminBusinesses,
  blockBusiness,
  unblockBusiness,
  approveBusiness,
  rejectBusiness,
  fetchAdminBusinessServices,
  createAdminBusinessService,
  deleteAdminBusinessService,
} from "@/lib/api/admin"
import { fetchBusinessCategories } from "@/lib/api"
import type { BusinessDto, ServiceDto, PaginatedResponse, BusinessCategoryDto } from "@/lib/types"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination } from "@/components/dashboard/pagination"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Search, Ban, CheckCircle, XCircle, Undo2, Plus, Trash2, Scissors } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CURRENCY } from "@/lib/types"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

const PAGE_SIZE = 15

export default function AdminBusinessesPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">Loading...</div>}>
      <AdminBusinesses />
    </Suspense>
  )
}

function AdminBusinesses() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [businesses, setBusinesses] = useState<PaginatedResponse<BusinessDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "")
  // Services modal
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDto | null>(null)
  const [services, setServices] = useState<ServiceDto[]>([])
  const [servicesLoading, setServicesLoading] = useState(false)

  // Add service form
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    categoryId: "",
    durationMinutes: 30,
    price: 0,
    currency: CURRENCY,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminBusinesses(current, PAGE_SIZE, statusFilter || undefined, search || undefined)
      setBusinesses(data)
    } catch (err) {
      console.error("Failed to load businesses:", err)
      setError("Failed to load businesses")
    } finally {
      setLoading(false)
    }
  }, [current, statusFilter, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchBusinessCategories().then(setCategories).catch(() => {})
  }, [])

  const handleAction = async (id: number, action: string) => {
    try {
      switch (action) {
        case "block":
          await blockBusiness(id)
          toast.success("Business blocked")
          break
        case "unblock":
          await unblockBusiness(id)
          toast.success("Business unblocked")
          break
        case "approve":
          await approveBusiness(id)
          toast.success("Business approved")
          break
        case "reject":
          await rejectBusiness(id)
          toast.success("Business rejected")
          break
      }
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed")
    }
  }

  const openServices = async (business: BusinessDto) => {
    setSelectedBusiness(business)
    setServicesLoading(true)
    try {
      const data = await fetchAdminBusinessServices(business.id)
      setServices(data.list)
    } catch (err) {
      toast.error("Failed to load services")
    } finally {
      setServicesLoading(false)
    }
  }

  const handleAddService = async () => {
    if (!selectedBusiness || !newService.name || !newService.categoryId || newService.price <= 0) {
      toast.error("Please fill in all required fields")
      return
    }
    try {
      await createAdminBusinessService(selectedBusiness.id, {
        name: newService.name,
        description: newService.description || undefined,
        categoryId: Number(newService.categoryId),
        durationMinutes: newService.durationMinutes,
        price: newService.price,
        currency: newService.currency,
      })
      toast.success("Service added")
      setAddDialogOpen(false)
      setNewService({ name: "", description: "", categoryId: "", durationMinutes: 30, price: 0, currency: CURRENCY })
      const data = await fetchAdminBusinessServices(selectedBusiness.id)
      setServices(data.list)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add service")
    }
  }

  const handleDeleteService = async (serviceId: number) => {
    if (!selectedBusiness) return
    try {
      await deleteAdminBusinessService(selectedBusiness.id, serviceId)
      toast.success("Service deleted")
      const data = await fetchAdminBusinessServices(selectedBusiness.id)
      setServices(data.list)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete service")
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

  const getActionButton = (business: BusinessDto) => {
    switch (business.status) {
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
                <AlertDialogTitle>Block Business</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to block {business.name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(business.id, "block")}>
                  Block
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      case "SUSPENDED":
      case "DEACTIVATED":
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
                <AlertDialogTitle>Unblock Business</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unblock {business.name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(business.id, "unblock")}>
                  Unblock
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      case "PENDING_VERIFICATION":
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
                  <AlertDialogTitle>Approve Business</AlertDialogTitle>
                  <AlertDialogDescription>
                    Approve {business.name}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(business.id, "approve")}>
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
                  <AlertDialogTitle>Reject Business</AlertDialogTitle>
                  <AlertDialogDescription>
                    Reject {business.name}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction(business.id, "reject")}>
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

  const statuses = ["", "ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "DEACTIVATED"]

  return (
    <div>
      <PageHeader title="Businesses" description="Manage all platform businesses" />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
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
            {s === "PENDING_VERIFICATION" ? "Pending" : s || "All"}
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
      ) : !businesses || businesses.list.length === 0 ? (
        <EmptyState message="No businesses found" />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {businesses.totalElements} business{businesses.totalElements !== 1 ? "es" : ""} found
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.list.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell className="text-muted-foreground">{b.categoryName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.location ? `${b.location.city}, ${b.location.country}` : "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          b.status === "PENDING_VERIFICATION"
                            ? "pending"
                            : b.status === "SUSPENDED" || b.status === "DEACTIVATED"
                              ? "blocked"
                              : "confirmed"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.overallRating ? `${b.overallRating.toFixed(1)} (${b.totalReviews})` : "No ratings"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="xs" onClick={() => openServices(b)}>
                              <Scissors className="size-3" />
                              Services
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Services - {selectedBusiness?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-96 space-y-4 overflow-y-auto">
                              {servicesLoading ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">Loading services...</p>
                              ) : services.length === 0 ? (
                                <EmptyState message="No services yet" height="h-32" />
                              ) : (
                                <div className="space-y-2">
                                  {services.map((s) => (
                                    <div
                                      key={s.id}
                                      className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                      <div>
                                        <p className="text-sm font-medium">{s.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {s.categoryName} &middot; {s.durationMinutes} min &middot; {s.currency} {s.price}
                                        </p>
                                        {s.description && (
                                          <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
                                        )}
                                      </div>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="icon-xs" className="text-destructive">
                                            <Trash2 className="size-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent size="sm">
                                          <AlertDialogHeader>
                                            <AlertDialogMedia>
                                              <Trash2 className="size-6 text-destructive" />
                                            </AlertDialogMedia>
                                            <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Delete &quot;{s.name}&quot; from {selectedBusiness?.name}?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteService(s.id)}>
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end border-t pt-4">
                              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    <Plus className="size-3" />
                                    Add Service
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Service</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Service Name *</label>
                                      <Input
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        placeholder="e.g. Haircut"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Description</label>
                                      <Input
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        placeholder="Brief description"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Category *</label>
                                      <Select
                                        value={newService.categoryId}
                                        onValueChange={(v) => setNewService({ ...newService, categoryId: v })}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                              {cat.displayName}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Duration (min) *</label>
                                        <Input
                                          type="number"
                                          value={newService.durationMinutes}
                                          onChange={(e) => setNewService({ ...newService, durationMinutes: Number(e.target.value) })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Price *</label>
                                        <Input
                                          type="number"
                                          value={newService.price}
                                          onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleAddService}>Add Service</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {getActionButton(b)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={current}
            totalPages={businesses.totalPages}
            totalElements={businesses.totalElements}
            onPageChange={setCurrent}
          />
        </>
      )}
    </div>
  )
}
