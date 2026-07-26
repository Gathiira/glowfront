# Graph Report - manshade  (2026-07-26)

## Corpus Check
- 124 files · ~57,711 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 726 nodes · 1293 edges · 54 communities (49 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6e88d3b0`
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
- page.tsx
- field.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 122 edges
2. `Button()` - 25 edges
3. `Card()` - 21 edges
4. `CardContent()` - 21 edges
5. `compilerOptions` - 16 edges
6. `PageHeader()` - 14 edges
7. `CardHeader()` - 14 edges
8. `CardTitle()` - 14 edges
9. `BusinessDetail()` - 12 edges
10. `fetchBusinessCategories()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `ThemeHotkey()` --references--> `react`  [EXTRACTED]
  components/theme-provider.tsx → package.json
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (54 total, 5 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.10
Nodes (30): appointments, clients, segments, payments, movements, transactions, allTransactions, days (+22 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.12
Nodes (19): BusinessDetail(), DAY_ORDER, formatDate(), formatDay(), formatTime(), getDaysInMonth(), getFirstDayOfMonth(), HOURS (+11 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.06
Nodes (24): FormDataType, formSchema, Mode, FormDataType, formSchema, Mode, Props, Step (+16 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.05
Nodes (41): fontMono, inter, RootLayout(), CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData (+33 more)

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
Cohesion: 0.06
Nodes (50): Catalog(), formatCurrency(), formatTimeDisplay(), Home(), DashboardLayout(), Props, ProfileDetails(), AddMember() (+42 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.15
Nodes (13): allInOnePoints, businessStats, features, marketplacePoints, metrics, successServices, BusinessFaq(), BusinessHeader() (+5 more)

### Community 12 - "Business Detail"
Cohesion: 0.22
Nodes (8): defaultCenter, defaultIcon, Location, LocationPicker(), Props, reverseGeocode(), searchQuery(), SearchResult

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
Cohesion: 0.27
Nodes (10): Appointment, Calendar(), colors, formatDate(), getDaysInMonth(), getFirstDayOfMonth(), HOURS, isPastDate() (+2 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.14
Nodes (19): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants, CardAction(), CardDescription(), CardFooter() (+11 more)

### Community 18 - "API Client Layer"
Cohesion: 0.14
Nodes (12): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer, Marker, neighborhoodCoords, Popup (+4 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 22 - "Input Group Components"
Cohesion: 0.14
Nodes (14): BrowseContent(), cities, BusinessPage(), Browse(), Pagination(), PaginationProps, CategoryBrowser(), fallbackIcons (+6 more)

### Community 24 - "K8s & CI/CD"
Cohesion: 0.70
Nodes (5): Glowfront ConfigMap, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace, Glowfront NodePort Service

### Community 25 - "Roles & Proxy"
Cohesion: 0.50
Nodes (3): Role, ROLE_CUSTOMER, ROLE_PARTNER

### Community 26 - "Alert Components"
Cohesion: 0.38
Nodes (4): BusinessCard(), gradients, ScrollSection(), BusinessCardDto

### Community 27 - "Project Overview"
Cohesion: 0.40
Nodes (5): Backend API Specification, Manshade Partner Management Platform, Next.js Framework, shadcn/ui Component Library, Project README

### Community 29 - "Graphify Skill"
Cohesion: 0.40
Nodes (4): Available commands, graphify, Project Agents, When to use

### Community 41 - "page.tsx"
Cohesion: 0.33
Nodes (5): BusinessTestimonials(), businessTestimonials, Button(), buttonVariants, Calendar()

### Community 42 - "alert.tsx"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 43 - "page.tsx"
Cohesion: 0.50
Nodes (4): Appointments(), BookingDetailDialog, formatDate(), Tab

### Community 44 - "scroll-section.tsx"
Cohesion: 0.20
Nodes (5): HoverCardContent(), Input(), PasswordInput(), PasswordInputProps, Switch()

### Community 45 - "alert-dialog.tsx"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 49 - "BusinessCategoryDto"
Cohesion: 0.40
Nodes (3): AccountFormData, accountFormSchema, Props

### Community 51 - "input-otp.tsx"
Cohesion: 0.25
Nodes (6): CalendarDayButton(), InputOTP(), InputOTPGroup(), InputOTPSlot(), react, react

### Community 53 - "page.tsx"
Cohesion: 0.53
Nodes (5): BookingDetailDialog, CustomerCalendar(), formatDate(), getDaysInMonth(), getFirstDayOfMonth()

### Community 55 - "field.tsx"
Cohesion: 0.18
Nodes (11): Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator(), FieldSet() (+3 more)

## Knowledge Gaps
- **231 isolated node(s):** `Step`, `Props`, `MapContainer`, `TileLayer`, `Marker` (+226 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Location Picker & Map` to `Dashboard Pages`, `Root Layout & Auth`, `page.tsx`, `alert.tsx`, `OTP & Select Components`, `scroll-section.tsx`, `alert-dialog.tsx`, `Dropdown Menu`, `API Client Layer`, `input-otp.tsx`, `Item Components`, `field.tsx`, `Alert Components`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `input-otp.tsx`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `react` connect `input-otp.tsx` to `NPM Dependencies`, `Root Layout & Auth`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `Step`, `Props`, `MapContainer` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1025974025974026 - nodes in this community are weakly interconnected._
- **Should `Landing & Auth Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05807200929152149 - nodes in this community are weakly interconnected._