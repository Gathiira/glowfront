# Graph Report - manshade  (2026-07-26)

## Corpus Check
- 133 files · ~58,098 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 749 nodes · 1265 edges · 56 communities (48 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8805792b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard Pages
- Landing & Auth Pages
- Auth Form Components
- NPM Dependencies
- Dev Tooling & Linting
- Root Layout & Auth
- TypeScript Config
- Business Browse
- Dashboard Layout & Sidebar
- UI Config & Utilities
- Business Types & DTOs
- OTP & Select Components
- Business Detail
- Platform Layout & Context
- Field Components
- Dropdown Menu
- Business Detail Page
- Location Picker & Map
- API Client Layer
- OpenCode Config
- Item Components
- API Routes & Client
- Input Group Components
- K8s & CI/CD
- Roles & Proxy
- Alert Components
- Project Overview
- Graphify Skill
- ESLint Config
- Next.js Config
- PostCSS Config
- UI Assets
- page.tsx
- alert.tsx
- page.tsx
- scroll-section.tsx
- alert-dialog.tsx
- BusinessCategoryDto
- input-otp.tsx
- header.tsx
- page.tsx
- input-otp.tsx
- field.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 122 edges
2. `Button()` - 23 edges
3. `Card()` - 17 edges
4. `CardContent()` - 17 edges
5. `compilerOptions` - 16 edges
6. `BusinessDetail()` - 12 edges
7. `CardHeader()` - 11 edges
8. `CardTitle()` - 11 edges
9. `fetchBusinessCategories()` - 9 edges
10. `BusinessCategoryDto` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (56 total, 8 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.11
Nodes (23): appointments, clients, segments, payments, days, Shift, PageHeader(), Props (+15 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.13
Nodes (18): BusinessDetail(), DAY_ORDER, formatDate(), formatDay(), formatTime(), getDaysInMonth(), getFirstDayOfMonth(), HOURS (+10 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.06
Nodes (24): FormDataType, formSchema, Mode, defaultCenter, defaultIcon, Location, LocationPicker(), Props (+16 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.07
Nodes (32): CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData, registerSchema, BookingDetailDialog(), MapContainer (+24 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.15
Nodes (15): fetchSection(), LandingPage(), CityBrowser(), CtaSection(), HowItWorks(), steps, Reviews(), StatsBar() (+7 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.33
Nodes (4): bottomNavItems, NavItem, navItems, SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.06
Nodes (46): Catalog(), DashboardLayout(), Props, ProfileDetails(), AddMember(), TeamMembers(), CustomerBookingPayload, createPartnerService() (+38 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.17
Nodes (12): allInOnePoints, businessStats, features, marketplacePoints, metrics, successServices, BusinessFaq(), BusinessHero() (+4 more)

### Community 12 - "Business Detail"
Cohesion: 0.19
Nodes (8): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, TileLayer

### Community 13 - "Platform Layout & Context"
Cohesion: 0.11
Nodes (16): Props, navItems, PlatformSidebar(), CustomerContext, CustomerContextType, CustomerProvider(), mockAppointments, mockBusinesses (+8 more)

### Community 14 - "Field Components"
Cohesion: 0.60
Nodes (4): config, extractRoles(), normalizeRole(), proxy()

### Community 15 - "Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "Business Detail Page"
Cohesion: 0.07
Nodes (33): AppointmentModal(), Props, Props, SaleModal(), Appointment, Calendar(), colors, HOURS (+25 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.12
Nodes (22): CardAction(), CardDescription(), CardFooter(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+14 more)

### Community 18 - "API Client Layer"
Cohesion: 0.18
Nodes (12): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer, Marker, neighborhoodCoords, Popup (+4 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 22 - "Input Group Components"
Cohesion: 0.21
Nodes (6): BrowseContent(), cities, Pagination(), PaginationProps, Footer(), searchBusinesses()

### Community 24 - "K8s & CI/CD"
Cohesion: 0.70
Nodes (5): Glowfront ConfigMap, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace, Glowfront NodePort Service

### Community 25 - "Roles & Proxy"
Cohesion: 0.50
Nodes (3): Role, ROLE_CUSTOMER, ROLE_PARTNER

### Community 26 - "Alert Components"
Cohesion: 0.19
Nodes (6): movements, transactions, allTransactions, Column, DataTable(), Props

### Community 27 - "Project Overview"
Cohesion: 0.40
Nodes (5): Backend API Specification, Manshade Partner Management Platform, Next.js Framework, shadcn/ui Component Library, Project README

### Community 29 - "Graphify Skill"
Cohesion: 0.40
Nodes (4): Available commands, graphify, Project Agents, When to use

### Community 41 - "page.tsx"
Cohesion: 0.22
Nodes (8): BusinessHeader(), navLinks, BusinessTestimonials(), Hero(), businessTestimonials, Button(), buttonVariants, Calendar()

### Community 42 - "alert.tsx"
Cohesion: 0.19
Nodes (11): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+3 more)

### Community 43 - "page.tsx"
Cohesion: 0.38
Nodes (6): BusinessPage(), CategoryBrowser(), fallbackIcons, getIcon(), iconMap, fetchBusinessCategories()

### Community 45 - "alert-dialog.tsx"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 49 - "BusinessCategoryDto"
Cohesion: 0.40
Nodes (3): AccountFormData, accountFormSchema, Props

### Community 51 - "input-otp.tsx"
Cohesion: 0.15
Nodes (11): fontMono, inter, RootLayout(), LoadingProvider(), ThemeHotkey(), ThemeProvider(), CalendarDayButton(), InputOTPSlot() (+3 more)

### Community 53 - "page.tsx"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 55 - "field.tsx"
Cohesion: 0.18
Nodes (11): Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator(), FieldSet() (+3 more)

## Knowledge Gaps
- **240 isolated node(s):** `Props`, `Props`, `Appointment`, `colors`, `statusColors` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Location Picker & Map` to `Dashboard Pages`, `Root Layout & Auth`, `page.tsx`, `alert.tsx`, `OTP & Select Components`, `scroll-section.tsx`, `alert-dialog.tsx`, `Dropdown Menu`, `API Client Layer`, `input-otp.tsx`, `Item Components`, `page.tsx`, `input-otp.tsx`, `field.tsx`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `input-otp.tsx`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `react` connect `input-otp.tsx` to `NPM Dependencies`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `Appointment` to the rest of the system?**
  _240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.11313131313131314 - nodes in this community are weakly interconnected._
- **Should `Landing & Auth Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06025641025641026 - nodes in this community are weakly interconnected._