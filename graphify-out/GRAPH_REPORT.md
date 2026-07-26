# Graph Report - manshade  (2026-07-26)

## Corpus Check
- 154 files · ~64,488 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 829 nodes · 1272 edges · 79 communities (58 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a920c05e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Dashboard Pages
- admin.ts
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
- user-badge.tsx
- Project Overview
- Graphify Skill
- ESLint Config
- Next.js Config
- PostCSS Config
- UI Assets
- page.tsx
- alert.tsx
- customer-flow.tsx
- alert.tsx
- admin-flow.tsx
- BusinessCategoryDto
- input-otp.tsx
- page.tsx
- left-side.tsx
- field.tsx
- hover-card.tsx
- partner-flow.tsx
- map-loader.ts
- page.tsx
- page.tsx
- page.tsx
- how-it-works.tsx
- scroll-section.tsx
- page.tsx
- button.tsx
- category-browser.tsx
- loading-state.tsx
- mobile-nav.tsx
- input-otp
- sidebar.tsx
- sidebar.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 134 edges
2. `fmt()` - 21 edges
3. `Button()` - 19 edges
4. `compilerOptions` - 16 edges
5. `Card()` - 14 edges
6. `CardContent()` - 14 edges
7. `fmtNum()` - 13 edges
8. `CardHeader()` - 10 edges
9. `CardTitle()` - 10 edges
10. `AdminBusinesses()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/business/[slug]/page.tsx → lib/utils.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/platform/browse/[slug]/page.tsx → lib/utils.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `AlertAction()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (79 total, 21 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.13
Nodes (20): appointments, clients, segments, payments, days, Shift, PageHeader(), Props (+12 more)

### Community 1 - "admin.ts"
Cohesion: 0.07
Nodes (42): AdminBusinesses(), AdminCategories(), AdminCustomers(), AdminPartners(), AdminReviews(), movements, transactions, allTransactions (+34 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.12
Nodes (16): defaultCenter, defaultIcon, Location, LocationPicker(), Props, reverseGeocode(), searchQuery(), SearchResult (+8 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

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
Cohesion: 0.06
Nodes (34): allInOnePoints, BusinessPage(), businessStats, features, marketplacePoints, metrics, successServices, PaginationProps (+26 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.40
Nodes (3): NavItem, navItems, SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.09
Nodes (21): Business, BUSINESS_CATEGORIES, BusinessAmenityDto, BusinessCategory, BusinessGalleryDto, BusinessLocationDto, BusinessOpeningHoursDto, BusinessReview (+13 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.10
Nodes (9): CreateServicePayload, CreateStaffPayload, CustomerAccountData, CustomerLoginData, DashboardSummaryDto, PartnerAccountData, PartnerBusinessData, TopServiceDto (+1 more)

### Community 12 - "Business Detail"
Cohesion: 0.60
Nodes (4): AddMember(), createPartnerStaff(), fetchPartnerServices(), ServiceDto

### Community 13 - "Platform Layout & Context"
Cohesion: 0.29
Nodes (5): CustomerContext, CustomerContextType, CustomerProvider(), mockProfile, profileFromStorage()

### Community 14 - "Field Components"
Cohesion: 0.31
Nodes (8): Role, ROLE_ADMIN, ROLE_CUSTOMER, ROLE_PARTNER, config, extractRoles(), normalizeRole(), proxy()

### Community 15 - "Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "Business Detail Page"
Cohesion: 0.15
Nodes (14): AppointmentModal(), Props, Props, SaleModal(), Appointment, Calendar(), colors, HOURS (+6 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 18 - "API Client Layer"
Cohesion: 0.11
Nodes (7): CustomerBookingPayload, BookingDto, BusinessDetailDto, BusinessDto, BusinessSearchDto, CustomerDashboardDto, StaffDto

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 24 - "K8s & CI/CD"
Cohesion: 0.70
Nodes (5): Glowfront ConfigMap, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace, Glowfront NodePort Service

### Community 26 - "user-badge.tsx"
Cohesion: 0.18
Nodes (7): Props, Props, Props, Props, UserBadge(), UserProfile, useUser()

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
Cohesion: 0.20
Nodes (6): LoginFormData, loginSchema, Mode, RegisterFormData, registerSchema, Header()

### Community 44 - "alert.tsx"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 49 - "BusinessCategoryDto"
Cohesion: 0.40
Nodes (3): AccountFormData, accountFormSchema, Props

### Community 51 - "input-otp.tsx"
Cohesion: 0.12
Nodes (15): fontMono, inter, RootLayout(), Anchor, LoadingContext, LoadingProvider(), useLoading(), ThemeHotkey() (+7 more)

### Community 53 - "page.tsx"
Cohesion: 0.14
Nodes (20): CardAction(), CardDescription(), CardFooter(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+12 more)

### Community 54 - "left-side.tsx"
Cohesion: 0.22
Nodes (5): FormDataType, formSchema, Mode, Props, Step

### Community 55 - "field.tsx"
Cohesion: 0.16
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

### Community 56 - "hover-card.tsx"
Cohesion: 0.20
Nodes (5): HoverCardContent(), Input(), PasswordInput(), PasswordInputProps, Switch()

### Community 57 - "partner-flow.tsx"
Cohesion: 0.29
Nodes (3): FormDataType, formSchema, Mode

### Community 58 - "map-loader.ts"
Cohesion: 0.40
Nodes (4): MapContainer, Marker, Popup, TileLayer

### Community 70 - "category-browser.tsx"
Cohesion: 0.06
Nodes (32): BusinessCard(), cities, BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), StarRating(), formatCurrency() (+24 more)

### Community 74 - "input-otp"
Cohesion: 0.40
Nodes (3): Props, ReviewFormData, reviewSchema

### Community 77 - "page.tsx"
Cohesion: 0.31
Nodes (8): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), getKenyaBounds(), neighborhoodCoords, SearchPage(), seededRandom()

## Knowledge Gaps
- **255 isolated node(s):** `AdminCreateServicePayload`, `AdminCreateCategoryPayload`, `Props`, `loginSchema`, `LoginFormData` (+250 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page.tsx` to `Dashboard Pages`, `category-browser.tsx`, `Business Browse`, `page.tsx`, `alert.tsx`, `alert.tsx`, `page.tsx`, `Dropdown Menu`, `Location Picker & Map`, `input-otp.tsx`, `Item Components`, `field.tsx`, `hover-card.tsx`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `input-otp.tsx`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `react` connect `input-otp.tsx` to `NPM Dependencies`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `AdminCreateServicePayload`, `AdminCreateCategoryPayload`, `Props` to the rest of the system?**
  _255 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.12685560053981107 - nodes in this community are weakly interconnected._
- **Should `admin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.074034902168165 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._