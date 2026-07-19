# Graph Report - manshade  (2026-07-19)

## Corpus Check
- 123 files · ~54,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 709 nodes · 1469 edges · 49 communities (43 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f56058ec`
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
- header.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 143 edges
2. `Button()` - 35 edges
3. `Card()` - 31 edges
4. `CardContent()` - 31 edges
5. `PageHeader()` - 22 edges
6. `CardHeader()` - 22 edges
7. `CardTitle()` - 22 edges
8. `compilerOptions` - 16 edges
9. `Input()` - 15 edges
10. `BusinessDetail()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `StepBusinessSetup()` --calls--> `useCategories()`  [EXTRACTED]
  app/(root)/auth/_components/step-business-setup.tsx → lib/api/swr.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/business/[slug]/page.tsx → lib/utils.ts
- `BusinessPage()` --calls--> `fetchBusinessCategories()`  [EXTRACTED]
  app/(root)/business/page.tsx → lib/api/customer.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/platform/browse/[slug]/page.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (49 total, 6 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.08
Nodes (41): appointments, clients, segments, payments, reviews, movements, transactions, allTransactions (+33 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.17
Nodes (13): fetchSection(), LandingPage(), BusinessFaq(), HowItWorks(), steps, Reviews(), StatsBar(), allCategories (+5 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.07
Nodes (24): FormDataType, formSchema, Mode, defaultCenter, defaultIcon, Location, LocationPicker(), Props (+16 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.08
Nodes (28): CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData, registerSchema, Appointment, Calendar() (+20 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.13
Nodes (16): allInOnePoints, BusinessPage(), businessStats, features, marketplacePoints, metrics, successServices, BusinessHeader() (+8 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.25
Nodes (6): Props, bottomNavItems, NavItem, navItems, Sidebar(), SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.06
Nodes (43): formatCurrency(), formatTimeDisplay(), Home(), Props, fetchDashboardSummary(), fetchTopServices(), fetchTopTeamMember(), CustomerContext (+35 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.20
Nodes (8): buttonVariants, Calendar(), CalendarDayButton(), InputOTP(), InputOTPGroup(), InputOTPSlot(), react, react

### Community 12 - "Business Detail"
Cohesion: 0.24
Nodes (6): fontMono, inter, RootLayout(), ThemeHotkey(), ThemeProvider(), Toaster()

### Community 13 - "Platform Layout & Context"
Cohesion: 0.20
Nodes (14): navItems, PlatformSidebar(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+6 more)

### Community 14 - "Field Components"
Cohesion: 0.60
Nodes (4): config, extractRoles(), normalizeRole(), proxy()

### Community 15 - "Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "Business Detail Page"
Cohesion: 0.06
Nodes (47): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, StarRating() (+39 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.17
Nodes (13): categories, initialServices, Service, Select(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel() (+5 more)

### Community 18 - "API Client Layer"
Cohesion: 0.20
Nodes (11): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer, Marker, neighborhoodCoords, Popup (+3 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.11
Nodes (30): ProfileDetails(), CardAction(), CardFooter(), Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel() (+22 more)

### Community 22 - "Input Group Components"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

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
Cohesion: 0.20
Nodes (10): BrowseContent(), cities, Browse(), Pagination(), PaginationProps, Footer(), fetchBusinessCategories(), searchBusinesses() (+2 more)

### Community 42 - "page.tsx"
Cohesion: 0.29
Nodes (7): BusinessTypes(), CategoryBrowser(), fallbackIcons, getIcon(), iconMap, Skeleton(), BusinessCategoryDto

### Community 43 - "scroll-section.tsx"
Cohesion: 0.38
Nodes (4): BusinessCard(), gradients, ScrollSection(), BusinessCardDto

### Community 44 - "scroll-section.tsx"
Cohesion: 0.18
Nodes (7): Anchor, LoadingContext, LoadingProvider(), useLoading(), HoverCardContent(), Spinner(), Switch()

## Knowledge Gaps
- **224 isolated node(s):** `BusinessCategory`, `ServiceType`, `BusinessService`, `BusinessTeamMember`, `ServiceCategory` (+219 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Item Components` to `Dashboard Pages`, `Landing & Auth Pages`, `Root Layout & Auth`, `Business Browse`, `page.tsx`, `scroll-section.tsx`, `Business Detail`, `Platform Layout & Context`, `scroll-section.tsx`, `OTP & Select Components`, `Business Detail Page`, `Dropdown Menu`, `API Client Layer`, `Location Picker & Map`, `Input Group Components`, `Alert Components`?**
  _High betweenness centrality (0.350) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `OTP & Select Components`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `react` connect `OTP & Select Components` to `NPM Dependencies`, `Business Detail`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **What connects `BusinessCategory`, `ServiceType`, `BusinessService` to the rest of the system?**
  _224 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0824561403508772 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06543385490753911 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._