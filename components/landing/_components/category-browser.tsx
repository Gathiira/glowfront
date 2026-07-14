"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Scissors,
  Brush,
  Sparkles,
  Hand,
  Droplets,
  Heart,
  Stethoscope,
  Syringe,
  Dog,
  Sun,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchBusinessCategories } from "@/lib/api"
import type { BusinessCategoryDto } from "@/lib/types"

const iconMap: Record<string, LucideIcon> = {
  HAIR: Scissors,
  BARBER: Brush,
  NAILS: Sparkles,
  SPA: Droplets,
  MASSAGE: Hand,
  FACIAL: Heart,
  MAKEUP: Heart,
  TATTOO: Syringe,
  OTHER: LayoutGrid,
}

const fallbackIcons: LucideIcon[] = [
  Scissors,
  Brush,
  Sparkles,
  Hand,
  Droplets,
  Heart,
  Stethoscope,
  Syringe,
  Dog,
  Sun,
  LayoutGrid,
]

function getIcon(cat: BusinessCategoryDto, index: number): LucideIcon {
  return iconMap[cat.name] || fallbackIcons[index % fallbackIcons.length]
}

export function CategoryBrowser() {
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBusinessCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-8">
      <h2 className="mb-6 text-xl font-semibold">Browse by category</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-28 shrink-0 rounded-2xl border bg-card p-4"
              >
                <div className="mx-auto size-12">
                  <Skeleton className="size-12 rounded-full" />
                </div>
                <Skeleton className="mx-auto mt-3 h-3 w-16" />
              </div>
            ))
          : categories.map((cat, i) => {
              const Icon = getIcon(cat, i)
              return (
                <Link
                  key={cat.id}
                  href={`/browse?category=${cat.name?.toLocaleLowerCase()}`}
                  className="group flex w-28 shrink-0 flex-col items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.displayName}
                        width={48}
                        height={48}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <span className="text-center text-xs leading-tight font-medium">
                    {cat.displayName}
                  </span>
                </Link>
              )
            })}
      </div>
    </section>
  )
}
