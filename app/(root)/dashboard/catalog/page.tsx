"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { CURRENCY } from "@/lib/types"
import type { ServiceDto, BusinessCategoryDto } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  fetchAllPartnerServices,
  createPartnerService,
  deletePartnerService,
  fetchPartnerCategories,
} from "@/lib/api/partner"
import { showSuccess, showError } from "@/lib/toast"
import type { TaskDto } from "@/lib/types"
import { fetchTasks } from "@/lib/api/commissions"
import { ServiceTasksDialog } from "./_components/service-tasks-dialog"
import { EditServiceDialog } from "./_components/edit-service-dialog"
import { ListChecks, Pencil, Trash2 } from "lucide-react"
import { useConfirm } from "@/components/ui/use-confirm"

export default function Catalog() {
  const [services, setServices] = useState<ServiceDto[]>([])
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [tasksFor, setTasksFor] = useState<ServiceDto | null>(null)
  const [editing, setEditing] = useState<ServiceDto | null>(null)
  const [confirm, confirmDialog] = useConfirm()

  const remove = async (s: ServiceDto) => {
    const ok = await confirm({
      title: `Delete ${s.name}?`,
      description:
        "It's taken off the menu, every team member and checkout. If it has never been booked or sold it's deleted for good; otherwise it's deactivated so past bookings, sales and commissions keep their records.",
      confirmLabel: "Delete service",
      destructive: true,
    })
    if (!ok) return
    try {
      const outcome = await deletePartnerService(s.id)
      showSuccess(
        outcome === "DELETED"
          ? `${s.name} deleted`
          : `${s.name} deactivated — it has past bookings or sales, so its records are kept`
      )
      loadData()
      loadTasks()
    } catch (err) {
      showError(err)
    }
  }
  const loadTasks = () => fetchTasks().then(setTasks).catch(showError)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    duration: "",
  })

  const loadData = async () => {
    try {
      const [svc, cats] = await Promise.all([
        fetchAllPartnerServices(),
        fetchPartnerCategories(),
      ])
      setServices(svc)
      setCategories(cats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    loadTasks()
  }, [])

  const grouped = categories.reduce<Record<string, ServiceDto[]>>(
    (acc, cat) => {
      const items = services.filter((s) => s.categoryId === cat.id)
      if (items.length) acc[cat.displayName] = items
      return acc
    },
    {}
  )

  const handleAdd = async () => {
    if (!newService.name || !newService.categoryId || !newService.price) return
    setSubmitting(true)
    try {
      await createPartnerService({
        name: newService.name,
        description: newService.description || undefined,
        categoryId: Number(newService.categoryId),
        price: Number(newService.price),
        durationMinutes: Number(newService.duration) || 30,
      })
      showSuccess("Service added successfully")
      setNewService({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        duration: "",
      })
      setShowAdd(false)
      loadData()
    } catch (err) {
      showError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Service Menu"
        description={
          loading
            ? "Loading..."
            : `Manage your services and pricing (${services.length} services)`
        }
      >
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : "Add Service"}
        </Button>
      </PageHeader>

      {showAdd && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="mb-1.5 block text-sm font-medium">
              Service name
            </label>
            <Input
              placeholder="Service name"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
            />
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <Textarea
              placeholder="Description (optional)"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
            />
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Category
                </label>
                <Select
                  value={newService.categoryId}
                  onValueChange={(v) =>
                    setNewService({ ...newService, categoryId: v })
                  }
                >
                  <SelectTrigger className="min-w-50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Price
                </label>
                <Input
                  placeholder="Price"
                  type="number"
                  className="min-w-35 flex-1"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Duration (min)
                </label>
                <Input
                  placeholder="Duration (min)"
                  type="number"
                  className="min-w-35 flex-1"
                  value={newService.duration}
                  onChange={(e) =>
                    setNewService({ ...newService, duration: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Service"}
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-14 w-full rounded-lg" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.entries(grouped).length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(grouped).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((s) => {
                    const serviceTasks = tasks.filter((t) => t.serviceIds.includes(s.id))
                    return (
                      <div key={s.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {s.durationMinutes} min
                              {s.description && (
                                <span> &middot; {s.description}</span>
                              )}
                            </p>
                          </div>
                          <span className="shrink-0 font-semibold">
                            {s.currency || CURRENCY} {s.price}
                          </span>
                        </div>
                        {serviceTasks.length > 0 ? (
                          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${s.name} tasks`}>
                            {serviceTasks.map((t) => (
                              <li
                                key={t.id}
                                className={`rounded-full bg-muted px-2.5 py-0.5 text-xs ${t.active ? "" : "text-muted-foreground line-through"}`}
                              >
                                {t.name} · {t.defaultPercent}%
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-xs text-muted-foreground">No tasks yet, so no commission is paid on it.</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                          <Button variant="outline" size="sm" onClick={() => setEditing(s)} aria-label={`Edit service: ${s.name}`}>
                            <Pencil aria-hidden />
                            Edit service
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setTasksFor(s)} aria-label={`${serviceTasks.length ? "Manage tasks" : "Add tasks"}: ${s.name}`}>
                            <ListChecks aria-hidden />
                            {serviceTasks.length ? "Manage tasks" : "Add tasks"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="ml-auto"
                            onClick={() => remove(s)}
                            aria-label={`Delete: ${s.name}`}
                          >
                            <Trash2 aria-hidden />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          No services yet. Add your first service to get started.
        </div>
      )}
      <ServiceTasksDialog service={tasksFor} tasks={tasks} onClose={() => setTasksFor(null)} onChange={loadTasks} />
      <EditServiceDialog service={editing} categories={categories} onClose={() => setEditing(null)} onSaved={loadData} />
      {confirmDialog}
    </div>
  )
}
