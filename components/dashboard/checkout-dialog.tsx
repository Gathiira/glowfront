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
  PAYMENT_LABEL,
  PAYMENT_METHODS,
  type BookingDto,
  type CustomerLookupDto,
  type UnclaimedMpesaDto,
  type BusinessCategoryDto,
  type CheckoutRequest,
  type PaymentMethod,
  type SaleDto,
  type ServiceDto,
  type StaffDto,
} from "@/lib/types"
import { createPartnerService, fetchAllPartnerServices, fetchAllPartnerStaff, fetchPartnerCategories } from "@/lib/api/partner"
import {
  checkout,
  fetchCheckoutOptions,
  fetchServiceTasks,
  money,
  myCheckout,
  previewCheckout,
  previewMyCheckout,
  searchCustomers,
  searchMyCustomers,
  mpesaApi,
} from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

/** allowed: staff who may do this task; empty = anyone. */
type TaskRow = { taskId: number; taskName: string; staffId: number | null; allowed: number[] }

const canDo = (task: Pick<TaskRow, "allowed">, staffId: number) =>
  task.allowed.length === 0 || task.allowed.includes(staffId)

/** Service first: only people on the line's service can be picked for its tasks. */
const onService = (member: StaffDto, serviceId: number) => member.services.some((s) => s.id === serviceId)
type Line = { key: number; serviceId: number; serviceName: string; price: string; tasks: TaskRow[] }

type Props = {
  open: boolean
  booking?: BookingDto | null
  onClose: () => void
  onDone: (sale: SaleDto) => void
  /** Rung up by a staff member from the staff portal: staff endpoints, and no adding services to the menu. */
  staffMode?: boolean
  className?: string
}

let nextKey = 1

export function CheckoutDialog({ open, booking, onClose, onDone, staffMode = false, className }: Props) {
  const sales = staffMode
    ? { preview: previewMyCheckout, checkout: myCheckout, customers: searchMyCustomers }
    : { preview: previewCheckout, checkout, customers: searchCustomers }
  // What was last typed into the name or phone box; past customers matching it are suggested.
  const [lookup, setLookup] = useState("")
  const [matches, setMatches] = useState<CustomerLookupDto[]>([])

  useEffect(() => {
    const q = lookup.trim()
    if (q.length < 2) {
      setMatches([])
      return
    }
    const timer = setTimeout(() => {
      sales.customers(q).then(setMatches).catch(() => setMatches([]))
    }, 250)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookup])
  const [services, setServices] = useState<ServiceDto[]>([])
  const [staff, setStaff] = useState<StaffDto[]>([])
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MPESA")
  const [discount, setDiscount] = useState("0")
  const [preview, setPreview] = useState<SaleDto | null>(null)
  const [saving, setSaving] = useState(false)
  const [quickAdd, setQuickAdd] = useState<{ name: string; price: string; categoryId: string } | null>(null)
  const initialised = useRef(false)
  const [confirm, confirmDialog] = useConfirm()

  const addLine = async (service: ServiceDto, price?: number, staffId?: number | null) => {
    try {
      // Staff sales carry services only; each person claims their own tasks afterwards.
      const tasks = staffMode ? [] : (await fetchServiceTasks(service.id)).filter((t) => t.active)
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
    setPaymentMethod("MPESA")
    setCustomerName(booking?.customerName ?? "")
    setCustomerPhone(booking?.customerPhone ?? "")
    setLookup("")
    if (staffMode) {
      fetchCheckoutOptions()
        .then((o) => setServices(o.services))
        .catch(showError)
      return
    }
    Promise.all([fetchAllPartnerServices(), fetchAllPartnerStaff(), fetchPartnerCategories()])
      .then(([svc, team, cats]) => {
        setServices(svc)
        setStaff(team.filter((s) => s.active))
        setCategories(cats)
        const booked = booking && svc.find((s) => s.id === booking.serviceId)
        if (booked) addLine(booked, booking.totalPrice ?? undefined, booking.staffId)
      })
      .catch(showError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booking])

  const ready = lines.length > 0 && lines.every((l) => l.price !== "" && l.tasks.every((t) => t.staffId !== null))

  // M-Pesa at a connected till: pick the customer's payment from what's come in, instead of asking for the code.
  const [mpesa, setMpesa] = useState<UnclaimedMpesaDto | null>(null)
  const [mpesaPaymentId, setMpesaPaymentId] = useState<number | null>(null)
  const [mpesaSearch, setMpesaSearch] = useState("")
  const loadMpesa = () =>
    mpesaApi(staffMode)
      .unclaimed()
      .then((m) => {
        setMpesa(m)
        setMpesaPaymentId((id) => (id !== null && m.payments.some((p) => p.id === id) ? id : null))
      })
      .catch(() => setMpesa(null))

  useEffect(() => {
    if (!open || paymentMethod !== "MPESA") return
    loadMpesa()
    const timer = setInterval(loadMpesa, 10000) // new payments show up while the customer pays
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paymentMethod])

  useEffect(() => {
    if (!open) {
      setMpesaPaymentId(null)
      setMpesaSearch("")
    }
  }, [open])

  // Optional: without a payment the sale is saved as "M-Pesa, awaiting payment" and matched later.
  const mpesaNeeded = paymentMethod === "MPESA"
  const mpesaPayments = mpesa?.payments ?? []
  const canComplete = ready
  // Searchable dropdown: name, code or account number; payments matching the total first.
  const [mpesaOpen, setMpesaOpen] = useState(false)
  const [mpesaActive, setMpesaActive] = useState(0)
  const totalNow = preview != null ? Number(preview.grandTotal) : null
  const mpesaShown = (mpesa?.payments ?? [])
    .filter((p) => {
      const q = mpesaSearch.trim().toLowerCase()
      return !q || [p.payerName, p.transId, p.billRef].some((v) => v?.toLowerCase().includes(q))
    })
    .sort((a, b) => Number(Number(b.amount) === totalNow) - Number(Number(a.amount) === totalNow))
  const pickedPayment = mpesa?.payments.find((p) => p.id === mpesaPaymentId) ?? null
  const pickPayment = (id: number) => {
    setMpesaPaymentId(id)
    setMpesaSearch("")
    setMpesaOpen(false)
  }

  const buildRequest = (): CheckoutRequest => ({
    bookingId: booking?.id,
    mpesaPaymentId: mpesaNeeded && mpesaPaymentId !== null ? mpesaPaymentId : undefined,
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
      sales.preview(buildRequest())
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
    const picked = mpesa?.payments.find((p) => p.id === mpesaPaymentId)
    const payWith = !mpesaNeeded
      ? PAYMENT_LABEL[paymentMethod]
      : picked
        ? `M-Pesa ${picked.transId} from ${picked.payerName ?? "the customer"}`
        : "M-Pesa (awaiting payment; attach it from M-Pesa payments once it arrives)"
    const ok = await confirm({
      title: `Complete sale for ${total}?`,
      description: staffMode
        ? `${lines.length} service${lines.length === 1 ? "" : "s"}, paid by ${payWith}. Afterwards, everyone who worked on it claims their tasks in Claim.`
        : `${lines.length} service${lines.length === 1 ? "" : "s"}, paid by ${payWith}. ${
            booking ? "The booking will be marked completed and " : ""
          }commissions will be recorded for the staff on each task.`,
      confirmLabel: "Complete sale",
    })
    if (!ok) return
    setSaving(true)
    try {
      const sale = await sales.checkout(buildRequest())
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
      <DialogContent className={`max-h-[90vh] overflow-y-auto sm:max-w-2xl ${className ?? ""}`}>
        <DialogHeader>
          <DialogTitle>{booking ? `Checkout · ${booking.customerName}` : "New sale"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Customer name (type to search)"
                aria-label="Customer name"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value)
                  setLookup(e.target.value)
                }}
                autoComplete="off"
              />
              <Input
                placeholder="Customer phone (type to search)"
                aria-label="Customer phone"
                inputMode="tel"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value)
                  setLookup(e.target.value)
                }}
                autoComplete="off"
              />
            </div>
            {matches.length > 0 && (
              <ul
                className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
                aria-label="Past customers"
              >
                {matches.map((c) => (
                  <li key={`${c.phone ?? ""}-${c.name}`}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setCustomerName(c.name)
                        setCustomerPhone(c.phone ?? "")
                        setLookup("")
                      }}
                    >
                      <span className="min-w-0 truncate">
                        <span className="font-medium">{c.name}</span>
                        {c.phone && <span className="text-muted-foreground"> · {c.phone}</span>}
                      </span>
                      {c.lastVisit && (
                        <span className="shrink-0 text-xs text-muted-foreground">Last {c.lastVisit.slice(0, 10)}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.map((line, li) => (
            <div key={line.key} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <span className="flex-1 font-medium">{line.serviceName}</span>
                {/* Menu price (or the booking's price); set by the server, not editable here. */}
                <span className="text-sm font-medium tabular-nums">
                  {CURRENCY} {money(Number(line.price))}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${line.serviceName}`}
                  onClick={() => setLines((ls) => ls.filter((l) => l.key !== line.key))}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {line.tasks.length === 0 && !staffMode && (
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
                          .filter((s) => onService(s, line.serviceId) && canDo(task, s.id))
                          .map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        {!staff.some((s) => onService(s, line.serviceId) && canDo(task, s.id)) && (
                          <p className="px-2 py-1.5 text-sm text-muted-foreground">
                            Nobody on {line.serviceName} can do {task.taskName}. Add the service to someone on the Team page.
                          </p>
                        )}
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
            {!staffMode && (
              <Button variant="outline" onClick={() => setQuickAdd({ name: "", price: "", categoryId: "" })}>
                + New service
              </Button>
            )}
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
                    {PAYMENT_LABEL[m]}
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
          {mpesaNeeded && (
            <div className="space-y-1.5">
              <label htmlFor="mpesa-payment" className="text-sm font-medium">
                Customer&apos;s M-Pesa payment
              </label>
              {pickedPayment ? (
                // Chosen: a summary with a way to undo it.
                <div className="flex items-center gap-2 rounded-md border border-primary bg-primary/5 px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">
                      {CURRENCY} {money(pickedPayment.amount)}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {pickedPayment.payerName ?? "Unknown"} · {pickedPayment.transId}
                    </span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove this payment"
                    onClick={() => {
                      setMpesaPaymentId(null)
                      setMpesaOpen(true)
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    id="mpesa-payment"
                    role="combobox"
                    aria-expanded={mpesaOpen}
                    aria-controls="mpesa-payment-options"
                    aria-activedescendant={mpesaOpen && mpesaShown[mpesaActive] ? `mpesa-opt-${mpesaShown[mpesaActive].id}` : undefined}
                    autoComplete="off"
                    placeholder={
                      mpesaPayments.length === 0 ? "Waiting for payments to come in…" : "Search unclaimed payments by name or code"
                    }
                    value={mpesaSearch}
                    onFocus={() => setMpesaOpen(true)}
                    onBlur={() => setTimeout(() => setMpesaOpen(false), 150)}
                    onChange={(e) => {
                      setMpesaSearch(e.target.value)
                      setMpesaActive(0)
                      setMpesaOpen(true)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setMpesaOpen(true)
                        setMpesaActive((i) => Math.min(i + 1, mpesaShown.length - 1))
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setMpesaActive((i) => Math.max(i - 1, 0))
                      } else if (e.key === "Enter" && mpesaOpen && mpesaShown[mpesaActive]) {
                        e.preventDefault()
                        pickPayment(mpesaShown[mpesaActive].id)
                      } else if (e.key === "Escape") {
                        setMpesaOpen(false)
                      }
                    }}
                  />
                  {mpesaOpen && (
                    <ul
                      id="mpesa-payment-options"
                      role="listbox"
                      aria-label="Unclaimed M-Pesa payments"
                      className="absolute inset-x-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
                    >
                      {mpesaShown.length === 0 && (
                        <li className="px-2 py-2 text-sm text-muted-foreground">
                          {mpesaPayments.length === 0 ? "No unclaimed payments yet." : "No payment matches that search."}
                        </li>
                      )}
                      {mpesaShown.map((p, i) => {
                        const matches = preview != null && Number(p.amount) === Number(preview.grandTotal)
                        return (
                          <li
                            key={p.id}
                            id={`mpesa-opt-${p.id}`}
                            role="option"
                            aria-selected={i === mpesaActive}
                            onMouseDown={(e) => e.preventDefault()} // keep focus so blur doesn't close before the click
                            onClick={() => pickPayment(p.id)}
                            onMouseEnter={() => setMpesaActive(i)}
                            className={`flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm ${
                              i === mpesaActive ? "bg-muted" : ""
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="font-medium">
                                {CURRENCY} {money(p.amount)}
                              </span>
                              <span className="text-muted-foreground"> · {p.payerName ?? "Unknown"} · {p.paidAt.slice(11, 16)}</span>
                              <span className="block text-xs text-muted-foreground">
                                {p.transId}
                                {p.billRef ? ` · Acc ${p.billRef}` : ""}
                              </span>
                            </span>
                            {matches && <span className="shrink-0 text-xs font-medium text-green-600">Matches total</span>}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          {!ready && lines.length > 0 && (
            <p className="text-sm text-muted-foreground">Pick who did each task, or remove tasks that weren&apos;t done.</p>
          )}
          {ready && mpesaNeeded && mpesaPaymentId === null && (
            <p className="text-sm text-muted-foreground">
              Payment not in yet? Complete the sale anyway; it&apos;s kept as awaiting payment and you can attach the
              payment later from M-Pesa payments.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!canComplete || saving}>
            {saving ? "Saving..." : "Complete sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {confirmDialog}
    </Dialog>
  )
}
