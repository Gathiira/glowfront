# Graph Report - manshade  (2026-07-26)

## Corpus Check
- 137 files · ~56,878 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 747 nodes · 1094 edges · 90 communities (58 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be81a7fa`
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
- alert.tsx
- customer-flow.tsx
- scroll-section.tsx
- alert-dialog.tsx
- BusinessCategoryDto
- input-otp.tsx
- page.tsx
- left-side.tsx
- field.tsx
- page.tsx
- partner-flow.tsx
- map-loader.ts
- page.tsx
- page.tsx
- review-modal.tsx
- page.tsx
- how-it-works.tsx
- scroll-section.tsx
- page.tsx
- button.tsx
- category-browser.tsx
- loading-state.tsx
- clsx
- @hookform/resolvers
- input-otp
- lucide-react
- next
- next-themes
- radix-ui
- react-day-picker
- react-dom
- react-leaflet
- shadcn
- sonner
- swr
- tailwind-merge
- @tanstack/react-table
- tw-animate-css
- wretch
- zod

## God Nodes (most connected - your core abstractions)
1. `cn()` - 120 edges
2. `Button()` - 20 edges
3. `Card()` - 16 edges
4. `CardContent()` - 16 edges
5. `compilerOptions` - 16 edges
6. `CardHeader()` - 10 edges
7. `CardTitle()` - 10 edges
8. `bash` - 9 edges
9. `PageHeader()` - 8 edges
10. `BookingModal()` - 7 edges

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

## Communities (90 total, 32 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.10
Nodes (25): appointments, clients, segments, payments, PageHeader(), Props, Props, StatCard() (+17 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.08
Nodes (21): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), Props, ReviewFormData, ReviewModal(), reviewSchema (+13 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.10
Nodes (17): defaultCenter, defaultIcon, Location, LocationPicker(), Props, reverseGeocode(), searchQuery(), SearchResult (+9 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.22
Nodes (9): class-variance-authority, date-fns, leaflet, dependencies, class-variance-authority, date-fns, leaflet, react-hook-form (+1 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.19
Nodes (6): api, ApiError, ApiResponse, getMsg(), isPublicPath(), PUBLIC_PATHS

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.05
Nodes (42): BrowseContent(), cities, allInOnePoints, BusinessPage(), businessStats, features, marketplacePoints, metrics (+34 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.33
Nodes (4): bottomNavItems, NavItem, navItems, SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.10
Nodes (20): Business, BUSINESS_CATEGORIES, BusinessAmenityDto, BusinessCategory, BusinessGalleryDto, BusinessLocationDto, BusinessOpeningHoursDto, BusinessReview (+12 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.11
Nodes (9): CreateServicePayload, CreateStaffPayload, CustomerAccountData, CustomerLoginData, DashboardSummaryDto, PartnerAccountData, PartnerBusinessData, TopServiceDto (+1 more)

### Community 12 - "Business Detail"
Cohesion: 0.60
Nodes (4): AddMember(), createPartnerStaff(), fetchPartnerServices(), ServiceDto

### Community 13 - "Platform Layout & Context"
Cohesion: 0.18
Nodes (8): Props, navItems, PlatformSidebar(), CustomerContext, CustomerContextType, CustomerProvider(), mockProfile, profileFromStorage()

### Community 14 - "Field Components"
Cohesion: 0.60
Nodes (4): config, extractRoles(), normalizeRole(), proxy()

### Community 15 - "Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "Business Detail Page"
Cohesion: 0.12
Nodes (19): AppointmentModal(), Props, Props, SaleModal(), Appointment, Calendar(), colors, HOURS (+11 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.17
Nodes (17): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+9 more)

### Community 18 - "API Client Layer"
Cohesion: 0.12
Nodes (7): CustomerBookingPayload, BookingDto, BusinessDetailDto, BusinessDto, CustomerDashboardDto, ReviewDto, StaffDto

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 22 - "Input Group Components"
Cohesion: 0.67
Nodes (3): DashboardLayout(), Props, fetchPartnerBusiness()

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

### Community 42 - "alert.tsx"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 43 - "customer-flow.tsx"
Cohesion: 0.18
Nodes (6): LoginFormData, loginSchema, Mode, RegisterFormData, registerSchema, Header()

### Community 44 - "scroll-section.tsx"
Cohesion: 0.18
Nodes (4): HoverCardContent(), InputOTP(), InputOTPGroup(), Switch()

### Community 45 - "alert-dialog.tsx"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 49 - "BusinessCategoryDto"
Cohesion: 0.40
Nodes (3): AccountFormData, accountFormSchema, Props

### Community 51 - "input-otp.tsx"
Cohesion: 0.21
Nodes (9): fontMono, inter, RootLayout(), Anchor, LoadingContext, LoadingProvider(), useLoading(), Toaster() (+1 more)

### Community 53 - "page.tsx"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 54 - "left-side.tsx"
Cohesion: 0.22
Nodes (5): FormDataType, formSchema, Mode, Props, Step

### Community 55 - "field.tsx"
Cohesion: 0.16
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

### Community 56 - "page.tsx"
Cohesion: 0.31
Nodes (8): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), getKenyaBounds(), neighborhoodCoords, SearchPage(), seededRandom()

### Community 57 - "partner-flow.tsx"
Cohesion: 0.29
Nodes (3): FormDataType, formSchema, Mode

### Community 58 - "map-loader.ts"
Cohesion: 0.40
Nodes (4): MapContainer, Marker, Popup, TileLayer

### Community 61 - "review-modal.tsx"
Cohesion: 0.25
Nodes (6): ThemeHotkey(), ThemeProvider(), CalendarDayButton(), InputOTPSlot(), react, react

## Knowledge Gaps
- **242 isolated node(s):** `loginSchema`, `registerSchema`, `LoginFormData`, `RegisterFormData`, `Mode` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Location Picker & Map` to `Dashboard Pages`, `Business Browse`, `alert.tsx`, `scroll-section.tsx`, `alert-dialog.tsx`, `Dropdown Menu`, `input-otp.tsx`, `Item Components`, `page.tsx`, `field.tsx`, `review-modal.tsx`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Dev Tooling & Linting`, `review-modal.tsx`, `clsx`, `@hookform/resolvers`, `input-otp`, `lucide-react`, `next`, `next-themes`, `radix-ui`, `react-day-picker`, `react-dom`, `react-leaflet`, `shadcn`, `sonner`, `swr`, `tailwind-merge`, `@tanstack/react-table`, `tw-animate-css`, `wretch`, `zod`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `react` connect `review-modal.tsx` to `NPM Dependencies`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `loginSchema`, `registerSchema`, `LoginFormData` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.10042283298097252 - nodes in this community are weakly interconnected._
- **Should `Landing & Auth Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08143939393939394 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09846153846153846 - nodes in this community are weakly interconnected._