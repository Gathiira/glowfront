"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useConfirm } from "@/components/ui/use-confirm"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import Image from "next/image"
import { Camera, Trash2 } from "lucide-react"
import {
  addPartnerGalleryImage,
  deletePartnerGalleryImage,
  fetchPartnerBusiness,
  updatePartnerBusinessProfile,
} from "@/lib/api/partner"
import { useMyRole } from "@/lib/use-my-role"
import { showError, showSuccess } from "@/lib/toast"
import type { BusinessGalleryDto } from "@/lib/types"

export default function ProfilePortfolio() {
  const role = useMyRole()
  const isOwner = role === "OWNER"
  const [confirm, confirmDialog] = useConfirm()
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<BusinessGalleryDto[]>([])
  const [business, setBusiness] = useState({ name: "", website: "", description: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPartnerBusiness()
      .then((b) => {
        setImages(b.gallery)
        setBusiness({ name: b.name, website: b.website ?? "", description: b.description ?? "" })
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }, [])

  const handleImageUpload = async () => {
    const url = prompt("Enter image URL:")?.trim()
    if (!url) return
    try {
      const image = await addPartnerGalleryImage(url)
      setImages((prev) => [...prev, image])
    } catch (error) {
      showError(error)
    }
  }

  const removeImage = async (image: BusinessGalleryDto) => {
    if (!(await confirm({ title: "Remove this image?", confirmLabel: "Remove", destructive: true }))) return
    try {
      await deletePartnerGalleryImage(image.id)
      setImages((prev) => prev.filter((i) => i.id !== image.id))
    } catch (error) {
      showError(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updatePartnerBusinessProfile(business)
      showSuccess("Business details saved")
    } catch (error) {
      showError(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Portfolio" description="Showcase your work and update business details" />
        <div className="mx-auto max-w-xl space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Portfolio" description="Showcase your work and update business details" />

      <div className="mx-auto max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((image, i) => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg border">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption ?? `Portfolio ${i + 1}`}
                    width={400}
                    height={160}
                    unoptimized
                    className="h-32 w-full object-cover sm:h-40"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-background/80 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleImageUpload}
                className="flex h-32 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground sm:h-40"
              >
                <Camera className="size-5" />
                Add Image
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <Input
                    placeholder="Business name"
                    value={business.name}
                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    disabled={!isOwner}
                    required
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Website"
                    type="url"
                    value={business.website}
                    onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                    disabled={!isOwner}
                  />
                </Field>
                <Field>
                  <Textarea
                    placeholder="Business description"
                    value={business.description}
                    onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                    disabled={!isOwner}
                    rows={4}
                  />
                </Field>
              </FieldGroup>
              {isOwner ? (
                <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              ) : role && (
                <p className="mt-4 text-sm text-muted-foreground">Only an owner can edit business details.</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      {confirmDialog}
    </div>
  )
}
