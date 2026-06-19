import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CityBrowser({
  countries,
  cityLinks,
  allCategories,
}: {
  countries: string[]
  cityLinks: { city: string; links: string[] }[]
  allCategories: string[]
}) {
  return (
    <>
      <section className="border-t py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Browse by Town/City</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="#">
              View all <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {countries.map((c) => (
            <Button key={c} variant="outline" size="sm" className="rounded-full">
              {c}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cityLinks.map((c) => (
            <div key={c.city}>
              <h3 className="mb-2 text-sm font-semibold">{c.city}</h3>
              <ul className="space-y-1">
                {c.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                      {link} in {c.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t py-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {allCategories.map((cat) => (
            <Link key={cat} href="#" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
