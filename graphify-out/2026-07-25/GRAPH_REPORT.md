# Graph Report - manshade  (2026-07-25)

## Corpus Check
- 123 files · ~56,213 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 713 nodes · 1351 edges · 50 communities (44 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `101a12e2`
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
- input-otp.tsx
- header.tsx
- field.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 133 edges
2. `Button()` - 29 edges
3. `Card()` - 25 edges
4. `CardContent()` - 25 edges
5. `PageHeader()` - 18 edges
6. `CardHeader()` - 16 edges
7. `CardTitle()` - 16 edges
8. `compilerOptions` - 16 edges
9. `BusinessDetail()` - 12 edges
10. `fetchBusinessCategories()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `ThemeHotkey()` --references--> `react`  [EXTRACTED]
  components/theme-provider.tsx → package.json
- `AlertTitle()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.tsx → lib/utils.ts
- `AlertDescription()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (50 total, 6 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.08
Nodes (43): appointments, clients, segments, payments, movements, transactions, allTransactions, days (+35 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.09
Nodes (28): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, TileLayer (+20 more)

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
Cohesion: 0.06
Nodes (36): CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData, registerSchema, Appointment, Calendar() (+28 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.15
Nodes (15): fetchSection(), LandingPage(), CityBrowser(), Hero(), HowItWorks(), steps, Reviews(), StatsBar() (+7 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.33
Nodes (4): bottomNavItems, NavItem, navItems, SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.06
Nodes (48): Catalog(), formatCurrency(), formatTimeDisplay(), Home(), DashboardLayout(), Props, ProfileDetails(), AddMember() (+40 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.14
Nodes (13): allInOnePoints, businessStats, features, marketplacePoints, metrics, successServices, BusinessFaq(), BusinessHeader() (+5 more)

### Community 12 - "Business Detail"
Cohesion: 0.29
Nodes (7): BusinessTypes(), CategoryBrowser(), fallbackIcons, getIcon(), iconMap, Skeleton(), BusinessCategoryDto

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
Cohesion: 0.42
Nodes (4): CtaSection(), Button(), buttonVariants, Calendar()

### Community 17 - "Location Picker & Map"
Cohesion: 0.12
Nodes (21): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+13 more)

### Community 18 - "API Client Layer"
Cohesion: 0.16
Nodes (16): BrowseContent(), BusinessPage(), Browse(), BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer (+8 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 22 - "Input Group Components"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

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
Cohesion: 0.21
Nodes (7): cities, Pagination(), PaginationProps, Footer(), BusinessCardDto, BusinessSearchDto, PaginatedResponse

### Community 42 - "page.tsx"
Cohesion: 0.24
Nodes (6): fontMono, inter, RootLayout(), ThemeHotkey(), ThemeProvider(), Toaster()

### Community 44 - "scroll-section.tsx"
Cohesion: 0.20
Nodes (5): Anchor, LoadingProvider(), HoverCardContent(), Spinner(), Switch()

### Community 51 - "input-otp.tsx"
Cohesion: 0.25
Nodes (6): CalendarDayButton(), InputOTP(), InputOTPGroup(), InputOTPSlot(), react, react

### Community 55 - "field.tsx"
Cohesion: 0.18
Nodes (11): Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator(), FieldSet() (+3 more)

## Knowledge Gaps
- **223 isolated node(s):** `MapContainer`, `TileLayer`, `Marker`, `Popup`, `DAY_ORDER` (+218 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Location Picker & Map` to `Dashboard Pages`, `Root Layout & Auth`, `page.tsx`, `OTP & Select Components`, `scroll-section.tsx`, `Business Detail`, `Dropdown Menu`, `Business Detail Page`, `API Client Layer`, `input-otp.tsx`, `Item Components`, `Input Group Components`, `field.tsx`, `Alert Components`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `input-otp.tsx`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `react` connect `input-otp.tsx` to `page.tsx`, `NPM Dependencies`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `MapContainer`, `TileLayer`, `Marker` to the rest of the system?**
  _223 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07723855092276145 - nodes in this community are weakly interconnected._
- **Should `Landing & Auth Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.09358974358974359 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06155632984901278 - nodes in this community are weakly interconnected._