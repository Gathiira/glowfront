import Link from "next/link"
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
                <Link href="/account">Get started now</Link>
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
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-muted-foreground">Hero background</p>
                  <p className="mt-2 text-xs text-muted-foreground/70">
                    The top-rated and best Glowbuddy booking software running on a desktop computer.
                    Glowbuddy is the world&apos;s leading salon software loved by all beauty professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
