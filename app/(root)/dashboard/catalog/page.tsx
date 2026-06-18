"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Service = {
  id: number
  name: string
  category: string
  price: number
  duration: number
}

const initialServices: Service[] = [
  { id: 1, name: "Haircut", category: "Hair Salon", price: 45, duration: 30 },
  { id: 2, name: "Hair Coloring", category: "Hair Salon", price: 120, duration: 90 },
  { id: 3, name: "Manicure", category: "Nails", price: 55, duration: 45 },
  { id: 4, name: "Pedicure", category: "Nails", price: 65, duration: 60 },
  { id: 5, name: "Facial", category: "Beauty Salon", price: 85, duration: 60 },
  { id: 6, name: "Massage", category: "Massage", price: 95, duration: 60 },
]

const categories = ["Hair Salon", "Nails", "Beauty Salon", "Massage", "Barber", "Eyebrows and Lashes"]

export default function Catalog() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [showAdd, setShowAdd] = useState(false)
  const [newService, setNewService] = useState({ name: "", category: "", price: "", duration: "" })

  const grouped = categories.reduce<Record<string, Service[]>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const handleAdd = () => {
    if (!newService.name || !newService.category || !newService.price) return
    setServices((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: newService.name,
        category: newService.category,
        price: Number(newService.price),
        duration: Number(newService.duration) || 30,
      },
    ])
    setNewService({ name: "", category: "", price: "", duration: "" })
    setShowAdd(false)
  }

  return (
    <div>
      <PageHeader title="Service Menu" description="Manage your services and pricing">
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : "Add Service"}
        </Button>
      </PageHeader>

      {showAdd && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <Input
                placeholder="Service name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
              <Select
                value={newService.category}
                onValueChange={(v) => setNewService({ ...newService, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Price"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />
              <Input
                placeholder="Duration (min)"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              />
            </div>
            <Button className="mt-4 w-full sm:w-auto" onClick={handleAdd}>
              Save Service
            </Button>
          </CardContent>
        </Card>
      )}

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
                      <p className="text-xs text-muted-foreground">{s.duration} min</p>
                    </div>
                    <span className="font-semibold">${s.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
