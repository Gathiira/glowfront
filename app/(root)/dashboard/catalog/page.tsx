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
  fetchPartnerServices,
  createPartnerService,
  fetchPartnerCategories,
} from "@/lib/api/partner"
import { showSuccess, showError } from "@/lib/toast"

export default function Catalog() {
  const [services, setServices] = useState<ServiceDto[]>([])
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
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
        fetchPartnerServices(),
        fetchPartnerCategories(),
      ])
      setServices(svc.list)
      setCategories(cats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
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
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.durationMinutes} min
                          {s.description && (
                            <span> &middot; {s.description}</span>
                          )}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {s.currency || CURRENCY} {s.price}
                      </span>
                    </div>
                  ))}
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
    </div>
  )
}
