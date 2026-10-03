"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useConfirm } from "@/components/ui/use-confirm"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCY, type BusinessCategoryDto, type ServiceDto } from "@/lib/types"
import { updatePartnerService } from "@/lib/api/partner"
import { showError, showSuccess } from "@/lib/toast"

type Props = {
  service: ServiceDto | null
  categories: BusinessCategoryDto[]
  onClose: () => void
  onSaved: () => void
}

const toForm = (s: ServiceDto) => ({
  name: s.name,
  description: s.description ?? "",
  categoryId: String(s.categoryId),
  price: String(s.price),
  duration: String(s.durationMinutes),
})

export function EditServiceDialog({ service, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ReturnType<typeof toForm> | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirm, confirmDialog] = useConfirm()

  useEffect(() => {
    setForm(service ? toForm(service) : null)
    setError(null)
  }, [service])

  if (!service || !form) return null

  const price = Number(form.price)
  const duration = Number(form.duration)
  const invalid = !form.name.trim()
    ? "Give the service a name."
    : !(price > 0)
      ? "Price must be more than 0."
      : !(Number.isInteger(duration) && duration >= 1 && duration <= 1440)
        ? "Duration must be between 1 and 1440 minutes."
        : null

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    const changes = [
      form.name.trim() !== service.name && `name to "${form.name.trim()}"`,
      price !== service.price && `price from ${service.price} to ${price}`,
      duration !== service.durationMinutes && `duration to ${duration} min`,
    ].filter(Boolean)
    const ok = await confirm({
      title: `Save changes to ${service.name}?`,
      description: `${changes.length ? `Changes ${changes.join(", ")}. ` : ""}New bookings and checkouts use the new details; past sales keep what they were charged.`,
      confirmLabel: "Save changes",
    })
    if (!ok) return
    setSaving(true)
    try {
      await updatePartnerService(service.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        categoryId: Number(form.categoryId),
        price,
        durationMinutes: duration,
        currency: service.currency,
      })
      showSuccess("Service updated")
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the service. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {service.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="es-name">Service name</Label>
            <Input id="es-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="es-description">Description</Label>
            <Textarea
              id="es-description"
              placeholder="Optional"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="es-category">Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger id="es-category">
                  <SelectValue />
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
            <div className="space-y-1.5">
              <Label htmlFor="es-price">Price ({service.currency || CURRENCY})</Label>
              <Input
                id="es-price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="es-duration">Duration (min)</Label>
              <Input
                id="es-duration"
                type="number"
                min={1}
                max={1440}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
              />
            </div>
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      {confirmDialog}
    </Dialog>
  )
}
