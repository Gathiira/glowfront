# Backend APIs Required by UI

## Auth & Onboarding
- **`POST /auth/login`** — Authenticate partner, return session token/user data
- **`POST /partner/register`** — Create partner account + business profile, return success + userId
- **`GET /categories`** — Return list of business categories (`BusinessCategory[]`)

## Dashboard Home
- **`GET /dashboard/summary`** — Return stat tiles: recent sales amount, upcoming appointments count, weekly activity count, next appointment details
- **`GET /dashboard/top-services`** — Return top 5 services with this month / last month counts
- **`GET /dashboard/top-team-member`** — Return best-performing team member with appointment and sales figures

## Calendar
- **`GET /appointments`** — Return appointments for a date range (query: `start`, `end`), used to populate the month grid
- **`POST /appointments`** — Create a new appointment or blocked time slot
- **`PUT /appointments/:id`** — Update an existing appointment's fields
- **`DELETE /appointments/:id`** — Delete an appointment

## Sales
- **`GET /sales/daily`** — Return daily summary (total sales, transaction count, average ticket) plus that day's transaction list
- **`GET /sales/transactions`** — Return all transactions across dates
- **`GET /sales/cash-movement`** — Return cash in/out entries with amounts, methods, and descriptions

## Appointments
- **`GET /appointments`** — Return all appointments sorted newest first (separate page from calendar, no date filter needed)

## Payments
- **`GET /payments`** — Return all payments with client, amount, method, date, status

## Clients
- **`GET /clients/stats`** — Return aggregate client analytics: total, new this month, repeat rate, highest average spend
- **`GET /clients/sources`** — Return online booking vs walk-in counts
- **`GET /clients/recent`** — Return most recently created clients (name + date)
- **`GET /clients`** — Return all clients with name, mobile, review rating, created date
- **`GET /clients/segments`** — Return segment breakdown (VIP, Regular, Occasional, New) with count and average spend

## Catalog
- **`GET /services`** — Return all services with name, category, price, duration
- **`POST /services`** — Create a new service

## Profile
- **`GET /profile`** — Return current user's profile (name, email, phone, business details, portfolio images)
- **`PUT /profile`** — Update profile fields (firstName, lastName, email, phone)
- **`PUT /profile/password`** — Change password (requires current + new password)
- **`GET /profile/reviews`** — Return reviews and ratings for the business
- **`PUT /profile/portfolio`** — Update portfolio (description, businessName, website, address, images)

## Team
- **`GET /team/members`** — Return all team members with profile info, services, commission
- **`POST /team/members`** — Add a new team member
- **`GET /team/members/:id/shifts`** — Return weekly shift schedule for a member (day, start, end, active)
- **`PUT /team/members/:id/shifts`** — Update a member's weekly shift schedule
