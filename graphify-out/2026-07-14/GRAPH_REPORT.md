# Graph Report - manshade  (2026-07-14)

## Corpus Check
- 120 files · ~53,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 697 nodes · 1556 edges · 45 communities (40 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75c1452e`
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
- Business Categories
- K8s & CI/CD
- Roles & Proxy
- Alert Components
- Project Overview
- Hover Card
- Graphify Skill
- ESLint Config
- Next.js Config
- PostCSS Config
- UI Assets
- page.tsx
- page.tsx
- header.tsx
- scroll-section.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 145 edges
2. `Button()` - 39 edges
3. `Card()` - 32 edges
4. `CardContent()` - 32 edges
5. `PageHeader()` - 23 edges
6. `CardHeader()` - 23 edges
7. `CardTitle()` - 23 edges
8. `Input()` - 19 edges
9. `extractError()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `PartnerRegistrationFlow()` --calls--> `registerPartner()`  [EXTRACTED]
  app/(root)/auth/_components/partner-registration-flow.tsx → lib/api/partner.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/business/[slug]/page.tsx → lib/utils.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/platform/browse/[slug]/page.tsx → lib/utils.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Kubernetes Deployment Stack** — k8s_kustomization, k8s_namespace, k8s_configmap, k8s_deployment, k8s_service, k8s_hpa [EXTRACTED 1.00]
- **Glowfront Application Lifecycle** — _github_workflows_deploy, _github_workflows_cleanup, k8s_deployment, k8s_service, concept_glowfront [INFERRED 0.75]

## Communities (45 total, 5 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.08
Nodes (44): appointments, clients, segments, todayAppointment, topServices, payments, reviews, movements (+36 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.15
Nodes (14): fetchSection(), LandingPage(), CityBrowser(), CtaSection(), Hero(), HowItWorks(), steps, Reviews() (+6 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.08
Nodes (34): FormDataType, formSchema, Mode, FormDataType, formSchema, Mode, PartnerRegistrationFlow(), Props (+26 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.08
Nodes (25): fontMono, inter, RootLayout(), CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData (+17 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.20
Nodes (9): BrowseContent(), cities, BusinessPage(), Browse(), Pagination(), PaginationProps, fetchBusinessCategories(), BusinessSearchDto (+1 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.15
Nodes (20): Props, navItems, PlatformSidebar(), bottomNavItems, NavItem, navItems, Sidebar(), SubMenuItem (+12 more)

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.10
Nodes (22): BUSINESS_CATEGORIES, BusinessAmenityDto, BusinessDto, BusinessGalleryDto, BusinessLocationDto, BusinessOpeningHoursDto, BusinessService, BusinessSocialMediaDto (+14 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.17
Nodes (5): HoverCardContent(), InputOTP(), InputOTPGroup(), InputOTPSlot(), Spinner()

### Community 12 - "Business Detail"
Cohesion: 0.15
Nodes (14): BusinessDetail(), DAY_ORDER, formatDate(), formatDay(), formatTime(), getDaysInMonth(), getFirstDayOfMonth(), HOURS (+6 more)

### Community 13 - "Platform Layout & Context"
Cohesion: 0.14
Nodes (14): Props, CustomerContext, CustomerContextType, CustomerProvider(), mockAppointments, mockBusinesses, mockProfile, profileFromStorage() (+6 more)

### Community 14 - "Field Components"
Cohesion: 0.13
Nodes (20): ProfileDetails(), CardAction(), CardFooter(), FieldContent(), FieldDescription(), FieldLabel(), FieldLegend(), FieldSeparator() (+12 more)

### Community 15 - "Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "Business Detail Page"
Cohesion: 0.16
Nodes (12): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, StarRating() (+4 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.16
Nodes (12): defaultCenter, defaultIcon, FlyTo(), Location, LocationPicker(), Props, reverseGeocode(), searchQuery() (+4 more)

### Community 18 - "API Client Layer"
Cohesion: 0.24
Nodes (14): StepBusinessSetup(), api, extractError(), fetchBusinessBySlug(), fetchBusinessReviews(), fetchCustomerDashboard(), searchBusinesses(), customerLogin() (+6 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 21 - "API Routes & Client"
Cohesion: 0.23
Nodes (5): ApiError, ApiResponse, getMsg(), isPublicPath(), PUBLIC_PATHS

### Community 22 - "Input Group Components"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 23 - "Business Categories"
Cohesion: 0.29
Nodes (7): BusinessTypes(), CategoryBrowser(), fallbackIcons, getIcon(), iconMap, Skeleton(), BusinessCategoryDto

### Community 24 - "K8s & CI/CD"
Cohesion: 0.44
Nodes (9): Cleanup GHCR Images Workflow, Build & Deploy Workflow, Glowfront Application, Glowfront ConfigMap, Glowfront Deployment, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace (+1 more)

### Community 25 - "Roles & Proxy"
Cohesion: 0.33
Nodes (6): Role, ROLE_CUSTOMER, ROLE_PARTNER, config, extractRole(), proxy()

### Community 26 - "Alert Components"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 27 - "Project Overview"
Cohesion: 0.40
Nodes (5): Backend API Specification, Manshade Partner Management Platform, Next.js Framework, shadcn/ui Component Library, Project README

### Community 28 - "Hover Card"
Cohesion: 0.13
Nodes (14): allInOnePoints, businessStats, features, marketplacePoints, metrics, successServices, BusinessFaq(), BusinessHeader() (+6 more)

### Community 29 - "Graphify Skill"
Cohesion: 0.40
Nodes (4): Available commands, graphify, Project Agents, When to use

### Community 41 - "page.tsx"
Cohesion: 0.20
Nodes (11): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer, Marker, neighborhoodCoords, Popup (+3 more)

### Community 42 - "page.tsx"
Cohesion: 0.27
Nodes (10): Appointment, Calendar(), colors, formatDate(), getDaysInMonth(), getFirstDayOfMonth(), HOURS, isPastDate() (+2 more)

### Community 44 - "scroll-section.tsx"
Cohesion: 0.38
Nodes (4): BusinessCard(), gradients, ScrollSection(), BusinessCardDto

## Knowledge Gaps
- **217 isolated node(s):** `Available commands`, `When to use`, `$schema`, `AGENTS.md`, `graphify *` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Field Components` to `Dashboard Pages`, `Auth Form Components`, `Root Layout & Auth`, `Dashboard Layout & Sidebar`, `page.tsx`, `OTP & Select Components`, `Business Detail`, `scroll-section.tsx`, `Dropdown Menu`, `Business Detail Page`, `Location Picker & Map`, `Item Components`, `Input Group Components`, `Business Categories`, `Alert Components`, `Hover Card`?**
  _High betweenness centrality (0.358) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Location Picker & Map`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **Why does `react` connect `Location Picker & Map` to `NPM Dependencies`, `OTP & Select Components`, `Root Layout & Auth`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **What connects `Available commands`, `When to use`, `$schema` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Landing & Auth Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08417508417508418 - nodes in this community are weakly interconnected._