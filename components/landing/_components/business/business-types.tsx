import Image from "next/image"
import { businessTypes } from "@/components/landing/data"

export function BusinessTypes() {
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
          {businessTypes.map((type) => (
            <div
              key={type.id}
              className="w-52 shrink-0 snap-start rounded-xl border bg-card overflow-hidden"
            >
              <div className="relative h-28 w-full">
                <Image
                  src={type.imageUrl}
                  alt={type.description}
                  width={400}
                  height={300}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold">{type.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
