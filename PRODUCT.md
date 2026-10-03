# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Customers** — people looking for a salon, barbershop, spa, nail or beauty studio; they browse, book appointments and leave reviews (`/platform`, public business pages).
- **Owners (partners)** — run one business on GlowBuddy: services and prices, team, bookings, checkout at the counter, sales, commissions and payouts (`/dashboard`).
- **Team members (staff)** — barbers, stylists, washers, nail techs, therapists employed by an owner. They use the staff portal (`/staff`) mostly **on their phone, at work, between clients** — often one-handed, in a bright shop — for quick checks: what they have earned and whether it has been paid, whether their leave is approved, which services they offer. Desktop use is occasional.

## Product Purpose

GlowBuddy lets beauty and grooming businesses take bookings and run the shop: catalog, team, checkout, sales, and fair staff pay. Success for the staff portal is a team member knowing in seconds what they are owed and that their time off is sorted, without asking the owner.

## Positioning

Undecided — not yet stated by the owner. Known, distinctive mechanism: a single service is split into tasks (e.g. Shave = shave + wash), each done by whoever performed it, and commission is calculated per task with per-staff agreed rates overriding task defaults.

## Operating Context

- Money is shown in KES; currency label in the UI is `KSH`. Payments include M-Pesa, cash, card, bank transfer, mobile money.
- Commission flow: owner checks a customer out (services → tasks → who did each) → commission lines are created and fixed at sale time → owner later records a payout covering several unpaid lines → staff see paid/unpaid.
- Leave flow: staff request whole days or part of a day → owner approves/rejects → approved leave blocks that staff member's bookings.
- Staff sign in with email/phone + password at `/auth/staff`; they only ever see their own data.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, client components), React 19, Tailwind CSS 4, shadcn-style components in `components/ui`, lucide-react icons, wretch API client. Backend: Spring Boot (`glowbook`).
- Staff portal routes: `/staff/commissions`, `/staff/leave`, `/staff/services`; staff APIs under `/v1/staff/me/*`.
- Staff cannot edit their services or rates; owners manage those.
- Not built yet: staff schedule/today's bookings view, notifications, leave balances.

## Brand Commitments

- Name: **GlowBuddy** (also written "Glow Buddy" / "Glowbuddy" in existing copy — not yet standardised).
- No logo or brand colour exists yet; the current UI is the stock shadcn neutral theme. The staff portal redesign is the first surface to receive a considered visual identity, intended to spread to the rest of the product later.

## Evidence on Hand

- Demo data only (`glowbook/api/src/main/resources/seed_demo_data.sql`, `seed_commissions_demo.sql`). No real customers, testimonials, metrics or press — do not fabricate any.

## Product Principles

1. Staff see money first: owed, paid, and why — every amount traceable to the work that earned it.
2. Built for one hand between clients: the most common check takes one tap and no typing.
3. Fixed history: past commissions and payouts never change silently; the UI shows what was agreed at the time.
4. Staff only ever see their own data.

## Accessibility & Inclusion

Used in bright shop lighting on small phones: high contrast, large touch targets, legible numbers. No specific standard has been stated.
