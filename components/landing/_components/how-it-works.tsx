import { Search, CalendarCheck, CreditCard } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find a business",
    description: "Search by category, location, or availability to find the perfect match.",
  },
  {
    icon: CalendarCheck,
    title: "Book instantly",
    description: "Pick a time that works for you and confirm your appointment in seconds.",
  },
  {
    icon: CreditCard,
    title: "Pay easily",
    description: "Pay seamlessly through the app — no cash or cards needed at checkout.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Book your next selfcare appointment in three simple steps
        </p>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="relative text-center">
            {i < steps.length - 1 && (
              <div className="absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border sm:block" />
            )}
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <step.icon className="size-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
