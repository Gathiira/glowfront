"use client"

import { useEffect, useState } from "react"
import { Copy } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useConfirm } from "@/components/ui/use-confirm"
import type { MpesaTillDto, MpesaTillRequest } from "@/lib/types"
import { addTill, fetchTills, registerTill, updateTill } from "@/lib/api/commissions"
import { showError, showSuccess } from "@/lib/toast"

type TillType = MpesaTillDto["type"]
const TYPE_LABEL: Record<TillType, string> = { TILL: "Till (Buy Goods)", PAYBILL: "Paybill" }

const USERNAME = /^[a-z]{3,40}$/
const BLOCKED = /m-?pesa|safaricom|exec|exe|cmd|sql|query/

const emptyForm = () => ({
  username: "",
  name: "",
  shortcode: "",
  type: "TILL" as TillType,
  consumerKey: "",
  consumerSecret: "",
  initiator: "",
  securityCredential: "",
})
type Form = ReturnType<typeof emptyForm>

function CopyUrl({ label, url }: { label: string; url: string | null }) {
  if (!url) return null
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1">{url}</code>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Copy ${label} URL`}
        onClick={() => navigator.clipboard.writeText(url).then(() => showSuccess(`${label} URL copied`))}
      >
        <Copy className="size-3.5" />
      </Button>
    </div>
  )
}

/** Secret inputs: never pre-filled; when editing, empty keeps what's stored. */
function SecretField({
  id,
  label,
  value,
  onChange,
  isSet,
  editing,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  isSet: boolean
  editing: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="password"
        autoComplete="new-password"
        placeholder={editing && isSet ? "Saved. Leave empty to keep it" : ""}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default function Tills() {
  const [tills, setTills] = useState<MpesaTillDto[] | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MpesaTillDto | null>(null)
  const [form, setForm] = useState<Form>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  const [confirm, confirmDialog] = useConfirm()

  const load = () =>
    fetchTills()
      .then(setTills)
      .catch((e) => {
        setTills([])
        showError(e)
      })

  useEffect(() => {
    load()
  }, [])

  const startAdd = () => {
    setEditing(null)
    setForm(emptyForm())
    setError(null)
    setOpen(true)
  }

  const startEdit = (t: MpesaTillDto) => {
    setEditing(t)
    setForm({ ...emptyForm(), username: t.username, name: t.name, shortcode: t.shortcode, type: t.type, initiator: t.initiator ?? "" })
    setError(null)
    setOpen(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const username = form.username.trim().toLowerCase()
    if (!editing) {
      if (!USERNAME.test(username))
        return setError("Username: 3–40 lowercase letters only. No numbers, spaces or dashes.")
      if (BLOCKED.test(username))
        return setError("Username can't contain mpesa, safaricom, exec, cmd, sql or query. Safaricom rejects them in addresses.")
      if (!/^\d{5,10}$/.test(form.shortcode.trim())) return setError("Enter the till or paybill number (digits only).")
    }
    setError(null)
    const ok = await confirm(
      editing
        ? { title: `Save changes to ${editing.name}?`, description: "Empty secret fields keep their saved values.", confirmLabel: "Save" }
        : {
            title: `Add till "${username}"?`,
            description: `The username can't be changed later. It's part of the addresses registered with Safaricom for ${form.shortcode.trim()}.`,
            confirmLabel: "Add till",
          }
    )
    if (!ok) return
    const body: MpesaTillRequest = {
      name: form.name.trim() || undefined,
      type: form.type,
      consumerKey: form.consumerKey.trim() || undefined,
      consumerSecret: form.consumerSecret.trim() || undefined,
      initiator: form.initiator.trim() || undefined,
      securityCredential: form.securityCredential.trim() || undefined,
    }
    try {
      if (editing) await updateTill(editing.id, body)
      else await addTill({ ...body, username, shortcode: form.shortcode.trim() })
      showSuccess(editing ? "Till saved" : "Till added")
      setOpen(false)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the till.")
    }
  }

  const toggle = async (t: MpesaTillDto, active: boolean) => {
    const ok = await confirm(
      active
        ? { title: `Turn ${t.name} on?`, description: "It's used again for code lookups and can be registered.", confirmLabel: "Turn on" }
        : {
            title: `Turn ${t.name} off?`,
            description: "It isn't used for code lookups any more. Payments Safaricom still sends to it are kept.",
            confirmLabel: "Turn off",
            destructive: true,
          }
    )
    if (!ok) return
    try {
      await updateTill(t.id, { active })
      load()
    } catch (err) {
      showError(err)
    }
  }

  const register = async (t: MpesaTillDto) => {
    const ok = await confirm({
      title: `Register ${t.shortcode} with Safaricom?`,
      description: "Safaricom will send every payment to this till to the addresses below. Registering again replaces earlier ones.",
      confirmLabel: "Register",
    })
    if (!ok) return
    setBusy(t.id)
    try {
      await registerTill(t.id)
      showSuccess(`${t.name} registered`)
      load()
    } catch (err) {
      showError(err)
    } finally {
      setBusy(null)
    }
  }

  const set = (field: keyof Form) => (v: string) => setForm((f) => ({ ...f, [field]: v }))

  return (
    <div>
      <PageHeader title="M-Pesa Tills" description="Your tills and paybills, each with its own Daraja settings and callback addresses.">
        <Button onClick={startAdd}>Add till</Button>
      </PageHeader>

      {tills === null && <p className="text-sm text-muted-foreground">Loading...</p>}
      {tills?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No tills yet. Add your till or paybill so M-Pesa payments show up at checkout.
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {tills?.map((t) => {
          const missing = [
            !t.consumerKeySet && "consumer key",
            !t.consumerSecretSet && "consumer secret",
            !t.initiator && "initiator",
            !t.securityCredentialSet && "security credential",
          ].filter(Boolean)
          return (
            <Card key={t.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {t.name} <span className="text-muted-foreground">· {t.shortcode}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{t.username} · {TYPE_LABEL[t.type]} ·{" "}
                      {t.registeredAt ? `registered ${t.registeredAt.slice(0, 16).replace("T", " ")}` : "not registered yet"}
                    </p>
                    {missing.length > 0 && (
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">Missing: {missing.join(", ")}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch checked={t.active} onCheckedChange={(v) => toggle(t, v)} aria-label={`${t.name} active`} />
                      {t.active ? "On" : "Off"}
                    </label>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(t)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" disabled={!t.active || busy === t.id} onClick={() => register(t)}>
                      {busy === t.id ? "Registering…" : t.registeredAt ? "Register again" : "Register with Safaricom"}
                    </Button>
                  </div>
                </div>
                {t.confirmationUrl ? (
                  <div className="space-y-1">
                    <CopyUrl label="Confirmation" url={t.confirmationUrl} />
                    <CopyUrl label="Validation" url={t.validationUrl} />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    The server has no public callback address set (DARAJA_CALLBACK_BASE_URL), so addresses can&apos;t be
                    shown or registered yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : "Add till"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="max-h-[70dvh] space-y-3 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label htmlFor="till-username">Username</Label>
              <Input
                id="till-username"
                placeholder="e.g. glowwestlands"
                autoComplete="off"
                value={form.username}
                onChange={(e) => set("username")(e.target.value.toLowerCase().replace(/[^a-z]/g, ""))}
                disabled={editing !== null}
                aria-describedby="till-username-note"
              />
              <p id="till-username-note" className="text-xs text-muted-foreground">
                {editing
                  ? "The username can't be changed: it's in the addresses registered with Safaricom."
                  : "Unique across GlowBuddy and can't be changed later: it goes into the addresses Safaricom (Daraja) sends payments to. Lowercase letters only, no numbers or dashes. Avoid words like mpesa or safaricom, which Safaricom rejects."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="till-name">Display name</Label>
                <Input id="till-name" placeholder="e.g. Front desk" value={form.name} onChange={(e) => set("name")(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="till-type">Type</Label>
                <Select value={form.type} onValueChange={(v) => set("type")(v)}>
                  <SelectTrigger id="till-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TILL">{TYPE_LABEL.TILL}</SelectItem>
                    <SelectItem value="PAYBILL">{TYPE_LABEL.PAYBILL}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="till-number">Till or paybill number</Label>
              <Input
                id="till-number"
                inputMode="numeric"
                value={form.shortcode}
                onChange={(e) => set("shortcode")(e.target.value)}
                disabled={editing !== null}
              />
            </div>

            <fieldset className="space-y-3 rounded-lg border p-3">
              <legend className="px-1 text-sm font-medium">Daraja settings for this till</legend>
              <p className="text-xs text-muted-foreground">
                From this till&apos;s app and API operator on the Daraja portal. They&apos;re stored encrypted and never
                shown again.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <SecretField
                  id="till-ck"
                  label="Consumer key"
                  value={form.consumerKey}
                  onChange={set("consumerKey")}
                  isSet={!!editing?.consumerKeySet}
                  editing={editing !== null}
                />
                <SecretField
                  id="till-cs"
                  label="Consumer secret"
                  value={form.consumerSecret}
                  onChange={set("consumerSecret")}
                  isSet={!!editing?.consumerSecretSet}
                  editing={editing !== null}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="till-initiator">Initiator (API operator name)</Label>
                <Input id="till-initiator" autoComplete="off" value={form.initiator} onChange={(e) => set("initiator")(e.target.value)} />
              </div>
              <SecretField
                id="till-cred"
                label="Security credential"
                value={form.securityCredential}
                onChange={set("securityCredential")}
                isSet={!!editing?.securityCredentialSet}
                editing={editing !== null}
              />
              <p className="text-xs text-muted-foreground">
                Consumer key and secret are needed to register the till; the initiator and security credential also for
                looking up M-Pesa codes.
              </p>
            </fieldset>

            {error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save" : "Add till"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  )
}
