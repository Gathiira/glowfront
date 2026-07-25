# Graph Report - manshade  (2026-07-25)

## Corpus Check
- 123 files · ~56,076 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 711 nodes · 1365 edges · 57 communities (49 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0d4da3d`
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
- page.tsx
- scroll-section.tsx
- scroll-section.tsx
- types.ts
- page.tsx
- page.tsx
- input-otp.tsx
- scroll-section.tsx
- header.tsx
- PaginatedResponse
- field.tsx
- loading-provider.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 133 edges
2. `Button()` - 29 edges
3. `Card()` - 25 edges
4. `CardContent()` - 25 edges
5. `PageHeader()` - 18 edges
6. `CardHeader()` - 16 edges
7. `CardTitle()` - 16 edges
8. `compilerOptions` - 16 edges
9. `Input()` - 12 edges
10. `fetchBusinessCategories()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `AlertTitle()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.tsx → lib/utils.ts
- `AlertDescription()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.tsx → lib/utils.ts
- `AlertAction()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (57 total, 8 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.08
Nodes (42): appointments, clients, segments, payments, movements, transactions, allTransactions, days (+34 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.15
Nodes (13): BusinessDetail(), DAY_ORDER, formatDate(), formatDay(), formatTime(), getDaysInMonth(), getFirstDayOfMonth(), HOURS (+5 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.06
Nodes (26): FormDataType, formSchema, Mode, defaultCenter, defaultIcon, Location, LocationPicker(), Props (+18 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.14
Nodes (15): CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData, registerSchema, Dialog(), DialogContent() (+7 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.16
Nodes (14): fetchSection(), LandingPage(), CityBrowser(), CtaSection(), Hero(), HowItWorks(), steps, Reviews() (+6 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.33
Nodes (4): bottomNavItems, NavItem, navItems, SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.16
Nodes (18): formatCurrency(), formatTimeDisplay(), Home(), CreateServicePayload, CreateStaffPayload, customerLogin(), fetchDashboardSummary(), fetchTopServices() (+10 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.14
Nodes (13): allInOnePoints, businessStats, features, marketplacePoints, metrics, successServices, BusinessFaq(), BusinessHeader() (+5 more)

### Community 12 - "Business Detail"
Cohesion: 0.27
Nodes (10): Appointment, Calendar(), colors, formatDate(), getDaysInMonth(), getFirstDayOfMonth(), HOURS, isPastDate() (+2 more)

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
Cohesion: 0.18
Nodes (8): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, TileLayer

### Community 17 - "Location Picker & Map"
Cohesion: 0.11
Nodes (22): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+14 more)

### Community 18 - "API Client Layer"
Cohesion: 0.11
Nodes (23): BrowseContent(), BusinessPage(), Browse(), BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer (+15 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 22 - "Input Group Components"
Cohesion: 0.19
Nodes (11): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+3 more)

### Community 24 - "K8s & CI/CD"
Cohesion: 0.70
Nodes (5): Glowfront ConfigMap, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace, Glowfront NodePort Service

### Community 25 - "Roles & Proxy"
Cohesion: 0.40
Nodes (3): Role, ROLE_CUSTOMER, ROLE_PARTNER

### Community 26 - "Alert Components"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 27 - "Project Overview"
Cohesion: 0.40
Nodes (5): Backend API Specification, Manshade Partner Management Platform, Next.js Framework, shadcn/ui Component Library, Project README

### Community 29 - "Graphify Skill"
Cohesion: 0.40
Nodes (4): Available commands, graphify, Project Agents, When to use

### Community 41 - "page.tsx"
Cohesion: 0.19
Nodes (8): cities, Pagination(), PaginationProps, Footer(), Button(), buttonVariants, Calendar(), BusinessSearchDto

### Community 42 - "page.tsx"
Cohesion: 0.15
Nodes (11): fontMono, inter, RootLayout(), LoadingProvider(), ThemeHotkey(), ThemeProvider(), CalendarDayButton(), InputOTPSlot() (+3 more)

### Community 43 - "scroll-section.tsx"
Cohesion: 0.19
Nodes (13): api, ApiError, ApiResponse, extractError(), getMsg(), isPublicPath(), PUBLIC_PATHS, fetchBusinessBySlug() (+5 more)

### Community 45 - "types.ts"
Cohesion: 0.12
Nodes (16): BookingDto, BUSINESS_CATEGORIES, BusinessAmenityDto, BusinessCategory, BusinessGalleryDto, BusinessLocationDto, BusinessOpeningHoursDto, BusinessService (+8 more)

### Community 49 - "page.tsx"
Cohesion: 0.39
Nodes (7): Catalog(), AddMember(), createPartnerService(), createPartnerStaff(), fetchPartnerCategories(), fetchPartnerServices(), ServiceDto

### Community 50 - "page.tsx"
Cohesion: 0.32
Nodes (6): DashboardLayout(), Props, ProfileDetails(), fetchPartnerBusiness(), BusinessDto, ReviewDto

### Community 52 - "scroll-section.tsx"
Cohesion: 0.38
Nodes (4): BusinessCard(), gradients, ScrollSection(), BusinessCardDto

### Community 54 - "PaginatedResponse"
Cohesion: 0.50
Nodes (4): TeamMembers(), fetchPartnerStaff(), PaginatedResponse, StaffDto

### Community 55 - "field.tsx"
Cohesion: 0.18
Nodes (11): Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator(), FieldSet() (+3 more)

### Community 56 - "loading-provider.tsx"
Cohesion: 0.47
Nodes (4): Anchor, LoadingContext, useLoading(), Spinner()

## Knowledge Gaps
- **220 isolated node(s):** `navItems`, `SubMenuItem`, `NavItem`, `navItems`, `bottomNavItems` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Location Picker & Map` to `Dashboard Pages`, `Root Layout & Auth`, `page.tsx`, `page.tsx`, `OTP & Select Components`, `scroll-section.tsx`, `Dropdown Menu`, `API Client Layer`, `input-otp.tsx`, `scroll-section.tsx`, `Item Components`, `Input Group Components`, `field.tsx`, `loading-provider.tsx`, `Alert Components`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `page.tsx`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `react` connect `page.tsx` to `NPM Dependencies`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `navItems`, `SubMenuItem`, `NavItem` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0821917808219178 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06155632984901278 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._