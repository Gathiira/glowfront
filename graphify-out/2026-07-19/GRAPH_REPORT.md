# Graph Report - manshade  (2026-07-16)

## Corpus Check
- 123 files · ~54,404 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 711 nodes · 1477 edges · 49 communities (44 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `430651cd`
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
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/business/[slug]/page.tsx → lib/utils.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/platform/browse/[slug]/page.tsx → lib/utils.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `ThemeHotkey()` --references--> `react`  [EXTRACTED]
  components/theme-provider.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Kubernetes Deployment Stack** — k8s_kustomization, k8s_namespace, k8s_configmap, k8s_deployment, k8s_service, k8s_hpa [EXTRACTED 1.00]
- **Glowfront Application Lifecycle** — _github_workflows_deploy, _github_workflows_cleanup, k8s_deployment, k8s_service, concept_glowfront [INFERRED 0.75]

## Communities (49 total, 5 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.08
Nodes (41): appointments, clients, segments, payments, reviews, movements, transactions, allTransactions (+33 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.16
Nodes (14): fetchSection(), LandingPage(), CityBrowser(), CtaSection(), Hero(), HowItWorks(), steps, Reviews() (+6 more)

### Community 2 - "Auth Form Components"
Cohesion: 0.06
Nodes (27): FormDataType, formSchema, Mode, defaultCenter, defaultIcon, Location, LocationPicker(), Props (+19 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react, next (+37 more)

### Community 4 - "Dev Tooling & Linting"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+30 more)

### Community 5 - "Root Layout & Auth"
Cohesion: 0.06
Nodes (38): fontMono, inter, RootLayout(), CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData (+30 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.15
Nodes (13): allInOnePoints, businessStats, features, marketplacePoints, metrics, successServices, BusinessFaq(), BusinessHeader() (+5 more)

### Community 8 - "Dashboard Layout & Sidebar"
Cohesion: 0.25
Nodes (6): Props, bottomNavItems, NavItem, navItems, Sidebar(), SubMenuItem

### Community 9 - "UI Config & Utilities"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Business Types & DTOs"
Cohesion: 0.05
Nodes (47): formatCurrency(), formatTimeDisplay(), Home(), Props, customerLogin(), fetchDashboardSummary(), fetchTopServices(), fetchTopTeamMember() (+39 more)

### Community 11 - "OTP & Select Components"
Cohesion: 0.25
Nodes (6): CalendarDayButton(), InputOTP(), InputOTPGroup(), InputOTPSlot(), react, react

### Community 12 - "Business Detail"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

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
Cohesion: 0.07
Nodes (41): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, StarRating() (+33 more)

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
Cohesion: 0.17
Nodes (18): ProfileDetails(), CardAction(), CardFooter(), Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel() (+10 more)

### Community 21 - "API Routes & Client"
Cohesion: 0.33
Nodes (5): BusinessTestimonials(), businessTestimonials, Button(), buttonVariants, Calendar()

### Community 22 - "Input Group Components"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 24 - "K8s & CI/CD"
Cohesion: 0.44
Nodes (9): Cleanup GHCR Images Workflow, Build & Deploy Workflow, Glowfront Application, Glowfront ConfigMap, Glowfront Deployment, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace (+1 more)

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
Cohesion: 0.18
Nodes (10): BrowseContent(), cities, Browse(), Pagination(), PaginationProps, Footer(), searchBusinesses(), BusinessCategoryDto (+2 more)

### Community 42 - "page.tsx"
Cohesion: 0.38
Nodes (6): BusinessPage(), CategoryBrowser(), fallbackIcons, getIcon(), iconMap, fetchBusinessCategories()

### Community 43 - "scroll-section.tsx"
Cohesion: 0.38
Nodes (4): BusinessCard(), gradients, ScrollSection(), BusinessCardDto

### Community 44 - "scroll-section.tsx"
Cohesion: 0.22
Nodes (3): HoverCardContent(), Spinner(), Switch()

## Knowledge Gaps
- **222 isolated node(s):** `BusinessCategory`, `ServiceType`, `BusinessService`, `BusinessTeamMember`, `ServiceCategory` (+217 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Item Components` to `Dashboard Pages`, `Root Layout & Auth`, `Business Browse`, `scroll-section.tsx`, `OTP & Select Components`, `Platform Layout & Context`, `scroll-section.tsx`, `Dropdown Menu`, `Business Detail Page`, `Business Detail`, `API Client Layer`, `Location Picker & Map`, `API Routes & Client`, `Input Group Components`, `Alert Components`?**
  _High betweenness centrality (0.348) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `OTP & Select Components`, `Dev Tooling & Linting`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `react` connect `OTP & Select Components` to `NPM Dependencies`, `Root Layout & Auth`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **What connects `BusinessCategory`, `ServiceType`, `BusinessService` to the rest of the system?**
  _222 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0824561403508772 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06155632984901278 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._