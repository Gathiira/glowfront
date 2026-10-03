"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useConfirm } from "@/components/ui/use-confirm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CURRENCY,
  PAYMENT_METHODS,
  type BookingDto,
  type BusinessCategoryDto,
  type CheckoutRequest,
  type PaymentMethod,
  type SaleDto,
  type ServiceDto,
  type StaffDto,
} from "@/lib/types"
import { createPartnerService, fetchPartnerCategories, fetchPartnerServices, fetchPartnerStaff } from "@/lib/api/partner"
import { checkout, fetchServiceTasks, money, previewCheckout } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

/** allowed: staff who may do this task; empty = anyone. */
type TaskRow = { taskId: number; taskName: string; staffId: number | null; allowed: number[] }

const canDo = (task: Pick<TaskRow, "allowed">, staffId: number) =>
  task.allowed.length === 0 || task.allowed.includes(staffId)
type Line = { key: number; serviceId: number; serviceName: string; price: string; tasks: TaskRow[] }

type Props = {
  open: boolean
  booking?: BookingDto | null
  onClose: () => void
  onDone: (sale: SaleDto) => void
}

let nextKey = 1

export function CheckoutDialog({ open, booking, onClose, onDone }: Props) {
  const [services, setServices] = useState<ServiceDto[]>([])
  const [staff, setStaff] = useState<StaffDto[]>([])
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")
  const [discount, setDiscount] = useState("0")
  const [preview, setPreview] = useState<SaleDto | null>(null)
  const [saving, setSaving] = useState(false)
  const [quickAdd, setQuickAdd] = useState<{ name: string; price: string; categoryId: string } | null>(null)
  const initialised = useRef(false)
  const [confirm, confirmDialog] = useConfirm()

  const addLine = async (service: ServiceDto, price?: number, staffId?: number | null) => {
    try {
      const tasks = (await fetchServiceTasks(service.id)).filter((t) => t.active)
      setLines((ls) => [
        ...ls,
        {
          key: nextKey++,
          serviceId: service.id,
          serviceName: service.name,
          price: String(price ?? service.price),
          tasks: tasks.map((t) => {
            const allowed = t.staffIds ?? []
            return {
              taskId: t.id,
              taskName: t.name,
              allowed,
              staffId: staffId != null && canDo({ allowed }, staffId) ? staffId : null,
            }
          }),
        },
      ])
    } catch (err) {
      showError(err)
    }
  }

  // Load pickers and prefill from the booking each time the dialog opens.
  useEffect(() => {
    if (!open) {
      initialised.current = false
      return
    }
    if (initialised.current) return
    initialised.current = true
    setLines([])
    setPreview(null)
    setDiscount("0")
    setPaymentMethod("CASH")
    setCustomerName(booking?.customerName ?? "")
    setCustomerPhone(booking?.customerPhone ?? "")
    Promise.all([fetchPartnerServices(0, 100), fetchPartnerStaff(0, 100), fetchPartnerCategories()])
      .then(([svc, team, cats]) => {
        setServices(svc.list)
        setStaff(team.list.filter((s) => s.active))
        setCategories(cats)
        const booked = booking && svc.list.find((s) => s.id === booking.serviceId)
        if (booked) addLine(booked, booking.totalPrice ?? undefined, booking.staffId)
      })
      .catch(showError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booking])

  const ready = lines.length > 0 && lines.every((l) => l.price !== "" && l.tasks.every((t) => t.staffId !== null))

  const buildRequest = (): CheckoutRequest => ({
    bookingId: booking?.id,
    customerName: customerName.trim() || undefined,
    customerPhone: customerPhone.trim() || undefined,
    paymentMethod,
    discount: Number(discount) || 0,
    tax: 0,
    items: lines.map((l) => ({
      serviceId: l.serviceId,
      price: Number(l.price) || 0,
      tasks: l.tasks.map((t) => ({ taskId: t.taskId, staffId: t.staffId as number })),
    })),
  })

  // Debounced server-side preview: the backend is the only place commission is calculated.
  useEffect(() => {
    if (!open || !ready) {
      setPreview(null)
      return
    }
    const timer = setTimeout(() => {
      previewCheckout(buildRequest())
        .then(setPreview)
        .catch(() => setPreview(null))
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ready, lines, discount, paymentMethod])

  const updateLine = (key: number, change: (l: Line) => Line) => setLines((ls) => ls.map((l) => (l.key === key ? change(l) : l)))

  const commissionFor = (lineIndex: number, taskIndex: number) => preview?.items?.[lineIndex]?.tasks[taskIndex]

  const perStaff = Object.entries(
    (preview?.items ?? [])
      .flatMap((i) => i.tasks)
      .reduce<Record<string, number>>((acc, t) => ({ ...acc, [t.staffName]: (acc[t.staffName] ?? 0) + t.commissionAmount }), {})
  )

  const saveQuickAdd = async () => {
    if (!quickAdd || !quickAdd.name.trim() || !quickAdd.price || !quickAdd.categoryId) return
    try {
      const created = await createPartnerService({
        name: quickAdd.name.trim(),
        price: Number(quickAdd.price),
        categoryId: Number(quickAdd.categoryId),
        durationMinutes: 30,
      })
      setServices((s) => [...s, created])
      setQuickAdd(null)
      showSuccess("Service added to catalog. Set its tasks in Catalog to pay commission on it.")
      addLine(created)
    } catch (err) {
      showError(err)
    }
  }

  const submit = async () => {
    const total = preview ? `${CURRENCY} ${money(preview.grandTotal)}` : "this sale"
    const ok = await confirm({
      title: `Complete sale for ${total}?`,
      description: `${lines.length} service${lines.length === 1 ? "" : "s"}, paid by ${paymentMethod.replace("_", " ")}. ${
        booking ? "The booking will be marked completed and " : ""
      }commissions will be recorded for the staff on each task.`,
      confirmLabel: "Complete sale",
    })
    if (!ok) return
    setSaving(true)
    try {
      const sale = await checkout(buildRequest())
      showSuccess("Sale recorded")
      onDone(sale)
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{booking ? `Checkout · ${booking.customerName}` : "New sale"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Input placeholder="Customer phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
          </div>

          {lines.map((line, li) => (
            <div key={line.key} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <span className="flex-1 font-medium">{line.serviceName}</span>
                <span className="text-sm text-muted-foreground">{CURRENCY}</span>
                <Input
                  type="number"
                  min={0}
                  className="w-28"
                  value={line.price}
                  onChange={(e) => updateLine(line.key, (l) => ({ ...l, price: e.target.value }))}
                  aria-label={`${line.serviceName} price`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${line.serviceName}`}
                  onClick={() => setLines((ls) => ls.filter((l) => l.key !== line.key))}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {line.tasks.length === 0 && (
                <p className="text-xs text-muted-foreground">No tasks set up for this service — no commission will be paid.</p>
              )}
              {line.tasks.map((task, ti) => {
                const calc = commissionFor(li, ti)
                return (
                  <div key={task.taskId} className="flex items-center gap-2 pl-4">
                    <span className="w-28 text-sm">{task.taskName}</span>
                    <Select
                      value={task.staffId ? String(task.staffId) : ""}
                      onValueChange={(v) =>
                        updateLine(line.key, (l) => ({
                          ...l,
                          tasks: l.tasks.map((t) => (t.taskId === task.taskId ? { ...t, staffId: Number(v) } : t)),
                        }))
                      }
                    >
                      <SelectTrigger className="flex-1" aria-label={`Who did ${task.taskName}`}>
                        <SelectValue placeholder="Who did it?" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff
                          .filter((s) => canDo(task, s.id))
                          .map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <span className="w-32 text-right text-sm text-muted-foreground">
                      {calc ? `${calc.percentApplied}% · ${money(calc.commissionAmount)}` : "—"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${task.taskName} not done`}
                      onClick={() =>
                        updateLine(line.key, (l) => ({ ...l, tasks: l.tasks.filter((t) => t.taskId !== task.taskId) }))
                      }
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Select
              value=""
              onValueChange={(v) => {
                const s = services.find((x) => String(x.id) === v)
                if (s) addLine(s)
              }}
            >
              <SelectTrigger className="min-w-56 flex-1">
                <SelectValue placeholder="+ Add service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name} · {CURRENCY} {s.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setQuickAdd({ name: "", price: "", categoryId: "" })}>
              + New service
            </Button>
          </div>

          {quickAdd && (
            <div className="flex flex-wrap gap-2 rounded-lg border border-dashed p-3">
              <Input
                placeholder="Service name"
                className="min-w-40 flex-1"
                value={quickAdd.name}
                onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Price"
                className="w-28"
                value={quickAdd.price}
                onChange={(e) => setQuickAdd({ ...quickAdd, price: e.target.value })}
              />
              <Select value={quickAdd.categoryId} onValueChange={(v) => setQuickAdd({ ...quickAdd, categoryId: v })}>
                <SelectTrigger className="min-w-40">
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
              <Button onClick={saveQuickAdd}>Add</Button>
              <Button variant="ghost" onClick={() => setQuickAdd(null)}>
                Cancel
              </Button>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <SelectTrigger aria-label="Payment method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              aria-label="Discount"
            />
          </div>

          {preview && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {CURRENCY} {money(preview.grandTotal)}
                </span>
              </div>
              {perStaff.map(([name, amount]) => (
                <div key={name} className="flex justify-between text-muted-foreground">
                  <span>{name}&apos;s commission</span>
                  <span>
                    {CURRENCY} {money(amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {!ready && lines.length > 0 && (
            <p className="text-sm text-muted-foreground">Pick who did each task, or remove tasks that weren&apos;t done.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!ready || saving}>
            {saving ? "Saving..." : "Complete sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {confirmDialog}
    </Dialog>
  )
}
