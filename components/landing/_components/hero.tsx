import { Search, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-linear-to-b from-primary/15 via-primary/5 to-background px-4 py-16 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Book. Glow. Repeat.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          The easiest way to find, book and pay for beauty and wellness services around you
        </p>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 border-b pb-2 md:border-b-0 md:pb-0">
            <span className="rounded-lg bg-primary/10 p-1.5">
              <Search className="size-4 text-primary" />
            </span>
            <span className="text-sm font-medium text-primary">
              All treatments
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2 border-b pb-2 md:border-b-0 md:pb-0">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Current location
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Any time</span>
          </div>
          <Link href="/search">
            <Button size="lg" className="w-full md:w-auto">
              <Search className="mr-1.5 size-4" />
              Search
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-primary">
          <span>Glow-ups happening right now</span>
        </div>
      </div>
    </section>
  )
}
