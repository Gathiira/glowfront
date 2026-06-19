import { Search, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-white px-4 py-16 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Book local selfcare services
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Discover top-rated salons, barbers, medspas, wellness studios and beauty experts
          trusted by millions worldwide
        </p>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 border-b pb-2 md:border-b-0 md:pb-0">
            <span className="rounded-lg bg-primary/10 p-1.5">
              <Search className="size-4 text-primary" />
            </span>
            <span className="text-sm font-medium">All treatments</span>
          </div>
          <div className="flex flex-1 items-center gap-2 border-b pb-2 md:border-b-0 md:pb-0">
            <MapPin className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current location</span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Any time</span>
          </div>
          <Button size="lg" className="w-full md:w-auto">
            <Search className="mr-1.5 size-4" />
            Search
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">333</span>
          <span>appointments booked today</span>
        </div>
      </div>
    </section>
  )
}
