import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center md:p-16">
      <h2 className="text-xl font-semibold">Glowbuddy for business</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        Supercharge your business with the world&apos;s top booking platform for salons and spas.
        Independently voted no. 1 by industry professionals.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium">
        <span>Excellent 5/5</span>
        <span className="text-muted-foreground">&middot;</span>
        <span className="text-muted-foreground">Over 1250 reviews on</span>
        <span className="font-bold">Capterra</span>
      </div>
      <Button size="lg" className="mt-6" asChild>
        <Link href="/account">Find out more</Link>
      </Button>
    </section>
  )
}
