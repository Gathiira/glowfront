import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BusinessHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              The #1 software for Salons and Spas
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, flexible and powerful booking software for your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/auth/partner">Get started now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#">
                  <Play className="mr-1.5 size-4" />
                  Watch an overview
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border bg-muted/30 p-4 shadow-lg">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
                  alt="Glowbuddy booking software dashboard on a desktop computer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
