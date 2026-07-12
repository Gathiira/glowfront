import Image from "next/image"
import type { BusinessCategoryDto } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export function BusinessTypes({ categories }: { categories: BusinessCategoryDto[] }) {
  return (
    <section id="business-types" className="border-t py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">One platform, infinite possibilities</h2>
          <p className="mt-2 text-muted-foreground">
            Everything you need to grow and thrive. Glowbuddy is packed with tools to boost sales,
            manage your calendar, and retain clients, so you can focus on what you do best.
          </p>
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-52 shrink-0 snap-start rounded-xl border bg-card overflow-hidden">
                  <Skeleton className="h-28 w-full rounded-none" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))
            : categories.map((cat) => (
                <div
                  key={cat.id}
                  className="w-52 shrink-0 snap-start rounded-xl border bg-card overflow-hidden"
                >
                  <div className="relative h-28 w-full">
                    <Image
                      src={cat.imageUrl || ""}
                      alt={cat.displayName}
                      width={400}
                      height={300}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold">{cat.displayName}</h3>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
