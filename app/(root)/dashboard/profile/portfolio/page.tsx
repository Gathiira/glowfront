"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Camera, Trash2 } from "lucide-react"

export default function ProfilePortfolio() {
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1634302086559-7cb9cf12b2a8?w=400&h=300&fit=crop",
  ])

  const [business, setBusiness] = useState({
    businessName: "John's Glow Studio",
    website: "https://johnsglowstudio.com",
    address: "123 Main St, New York, NY 10001",
    description:
      "Professional hair stylist with over 10 years of experience. Specializing in haircuts, coloring, and styling for all hair types.",
  })

  const [saved, setSaved] = useState(false)

  const handleImageUpload = () => {
    const url = prompt("Enter image URL:")
    if (url) setImages((prev) => [...prev, url])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
              {images.map((url, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border">
                  <img
                    src={url}
                    alt={`Portfolio ${i + 1}`}
                    className="h-32 w-full object-cover sm:h-40"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
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
                    value={business.businessName}
                    onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Website"
                    type="url"
                    value={business.website}
                    onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Address"
                    value={business.address}
                    onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                  />
                </Field>
                <Field>
                  <Textarea
                    placeholder="Business description"
                    value={business.description}
                    onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                    rows={4}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-6 w-full sm:w-auto">
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
