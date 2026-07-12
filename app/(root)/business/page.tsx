"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Check,
  Star,
  Building2,
  TrendingUp,
  CreditCard,
  MessageCircle,
  BookOpen,
} from "lucide-react"
import Image from "next/image"
import { BusinessHeader } from "@/components/landing/_components/business/business-header"
import { BusinessHero } from "@/components/landing/_components/business/business-hero"
import { BusinessTypes } from "@/components/landing/_components/business/business-types"
import { BusinessTestimonials } from "@/components/landing/_components/business/business-testimonials"
import { BusinessFaq } from "@/components/landing/_components/business/business-faq"
import { Footer } from "@/components/landing/_components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchBusinessCategories } from "@/lib/api/customer"
import type { BusinessCategoryDto } from "@/lib/types"

const metrics = [
  { value: "1,000+", label: "Partner businesses" },
  { value: "2,000+", label: "Professionals" },
  { value: "5,000+", label: "Appointments booked" },
  { value: "20+", label: "Towns" },
]

const features = [
  {
    icon: Building2,
    title: "Manage",
    description:
      "Manage bookings, sales, clients, locations, team members. Analyse your business with advanced reporting and analytics.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description:
      "Win new clients on the world's largest beauty and wellness marketplace. Keep them coming back with marketing features.",
  },
  {
    icon: CreditCard,
    title: "Get paid",
    description:
      "Get paid fast with seamless payment processing. Reduce no-shows with upfront payments and simplify checkout.",
  },
]

const allInOnePoints = [
  "Most loved and the top-rated booking software for salons, spas, and other beauty and wellness businesses",
  "Powerful calendar with unlimited bookings, clients, locations, and much more",
  "Advanced insights providing a 360 degree view of each client, including booking behaviors, client preferences, preferred payment methods, preferred marketing channels, lifetime value and more",
  "Crafted to deliver a smooth experience that enhances your business and elevates your brand",
]

const marketplacePoints = [
  "Increase your online visibility by listing your business on Glowbuddy marketplace",
  "Reach millions of clients looking to book their next appointment today",
  "Free up time and get your clients self-booking online 24/7",
]

const businessStats = [
  {
    value: "26%",
    label: "More clients",
    description:
      "Win new clients and keep them coming back on the world's largest beauty and wellness marketplace.",
  },
  {
    value: "89%",
    label: "Fewer no-shows",
    description:
      "Reduce no-shows and cancellations by taking a deposit or a full payment upfront.",
  },
  {
    value: "20%",
    label: "More sales",
    description:
      "Generate more sales by upselling services when clients book online.",
  },
  {
    value: "290%",
    label: "More tips",
    description:
      "Collect more tips when clients book online via the marketplace, your website, Google, or social media.",
  },
  {
    value: "12%",
    label: "Higher retention",
    description:
      "Partners using Glowbuddy experience a higher retention of clients.",
  },
  {
    value: "392%",
    label: "Return on investment",
    description: "Most partners grow with Glowbuddy.",
  },
  {
    value: "41%",
    label: "Booked outside hours",
    description:
      "Our marketplace helps you capture clients looking to book outside business hours.",
  },
]

const successServices = [
  {
    title: "Customer success manager",
    description: "Get dedicated help to maximize your potential on Glowbuddy",
  },
  {
    title: "Access our network",
    description:
      "Use an Enterprise-certified account manager to bring your business to life",
  },
  {
    title: "24/7 priority support",
    description:
      "Talk with our customer care team anytime. We're here to help.",
  },
  {
    title: "Migration support",
    description: "Our team can help bring your data from other platforms",
  },
  {
    title: "Tailored solutions",
    description:
      "Have something in mind? Just ask us. We will figure it out together.",
  },
  {
    title: "Expert consultation",
    description:
      "Get direct access to product experts for guidance on all things Glowbuddy",
  },
]

export default function BusinessPage() {
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])

  useEffect(() => {
    fetchBusinessCategories().then(setCategories).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">
      <BusinessHeader />

      <BusinessHero />

      {/* Metrics Bar */}
      <section className="border-t py-12 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-3xl font-bold">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BusinessTypes categories={categories} />

      {/* Pricing */}
      <section id="pricing" className="border-t py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Start for free, only pay when you get paid. No monthly fees, no
            hidden costs, no long-term contracts.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="mt-1 text-3xl font-bold">KES 0</p>
                <p className="text-xs text-muted-foreground">per month</p>
                <ul className="mt-6 space-y-2 text-left text-sm">
                  {[
                    "Unlimited bookings",
                    "Online booking widget",
                    "Client management",
                    "Automated reminders",
                    "Basic reports",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="mt-6 w-full" asChild>
                  <Link href="/auth/partner">Get started free</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-2">
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                    Most popular
                  </span>
                </div>
                <h3 className="text-lg font-semibold">Pay as you grow</h3>
                <p className="mt-1 text-3xl font-bold">2.5%</p>
                <p className="text-xs text-muted-foreground">per transaction</p>
                <ul className="mt-6 space-y-2 text-left text-sm">
                  {[
                    "Everything in Free",
                    "Marketplace listing",
                    "Marketing automation",
                    "Advanced analytics",
                    "Priority support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="mt-6 w-full" asChild>
                  <Link href="/auth/partner">Get started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold">Enterprise</h3>
                <p className="mt-1 text-3xl font-bold">Custom</p>
                <p className="text-xs text-muted-foreground">
                  tailored pricing
                </p>
                <ul className="mt-6 space-y-2 text-left text-sm">
                  {[
                    "Everything in Pay as you grow",
                    "Dedicated account manager",
                    "Custom integrations",
                    "Multi-location support",
                    "Priority 24/7 support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="lg"
                  className="mt-6 w-full"
                  asChild
                >
                  <Link href="#">Contact sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Everything you need to run your business
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Glowbuddy offers innovative features that bring convenience,
            efficiency, and an improved experience for both your team members
            and clients.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* All-in-one */}
      <section className="border-t bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                All-in-one software to run your business
              </h2>
              <ul className="mt-6 space-y-4">
                {allInOnePoints.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/auth/partner">Get started now</Link>
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-lg">
              <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=450&fit=crop"
                  alt="Calendar displaying bookings on the Glowbuddy for business app"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="border-t py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 rounded-xl border bg-card p-4 shadow-lg md:order-1">
              <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=450&fit=crop"
                  alt="A portfolio of a stylist on the Glowbuddy for business app"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold md:text-3xl">
                The most popular marketplace to grow your business
              </h2>
              <p className="mt-3 text-muted-foreground">
                Promote your business and reach new clients on the world&apos;s
                largest beauty and wellness marketplace
              </p>
              <ul className="mt-6 space-y-4">
                {marketplacePoints.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/auth/partner">Get started now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BusinessTestimonials />

      {/* Business Stats / Metrics */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Boss your business
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              At Glowbuddy, we want to help you grow your business, attract new
              clients and boost sales. See how businesses are doing on Glowbuddy
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {businessStats.slice(0, 4).map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium">{stat.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessStats.slice(4).map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium">{stat.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Services */}
      <section className="border-t bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Committed to your success
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Every business has its own needs, and we have got you covered with a
            range of professional services
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {successServices.map((s) => (
              <Card key={s.title}>
                <CardContent className="p-5">
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="size-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            You are never alone, award winning customer support 24/7
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Card className="w-72">
              <CardContent className="p-6 text-center">
                <BookOpen className="mx-auto size-8 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">Help Center</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore and learn with our help center knowledge base.
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="#">Go to help center</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="w-72">
              <CardContent className="p-6 text-center">
                <MessageCircle className="mx-auto size-8 text-primary" />
                <h3 className="mt-3 text-sm font-semibold">Contact us</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contact us via email and phone and one of our team will be
                  there to help.
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="#">Contact us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <BusinessFaq />

      {/* Platform suitable for all */}
      <section className="border-t bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            A platform suitable for all
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {categories.length === 0
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border bg-card">
                    <Skeleton className="h-20 w-full rounded-none" />
                    <div className="p-2 flex justify-center">
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              : categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="group cursor-pointer overflow-hidden rounded-xl border bg-card"
                  >
                    <div className="relative h-20 w-full">
                      <Image
                        src={cat.imageUrl || ""}
                        alt={cat.displayName}
                        width={400}
                        height={300}
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2 text-center">
                      <p className="truncate text-xs font-medium">{cat.displayName}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            What are you waiting for?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Partner with Glowbuddy and start growing your business today
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/auth/partner">Get started now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
