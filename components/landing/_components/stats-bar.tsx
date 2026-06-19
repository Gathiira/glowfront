export function StatsBar() {
  return (
    <section className="border-t py-12 text-center">
      <h2 className="text-xl font-semibold">The top-rated destination for selfcare</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        One solution, one software. Trusted by the best in the selfcare industry
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: "1 billion+", label: "appointments booked on Glowbuddy" },
          { value: "130,000+", label: "partner businesses" },
          { value: "120+", label: "cities on Glowbuddy" },
          { value: "450,000+", label: "stylists and professionals" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
