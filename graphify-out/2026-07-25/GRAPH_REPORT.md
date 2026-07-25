# Graph Report - manshade  (2026-07-19)

## Corpus Check
- 123 files · ~54,421 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 708 nodes · 1468 edges · 48 communities (42 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `90938260`
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
- `BusinessPage()` --calls--> `fetchBusinessCategories()`  [EXTRACTED]
  app/(root)/business/page.tsx → lib/api/customer.ts
- `StarRating()` --calls--> `cn()`  [EXTRACTED]
  app/(root)/platform/browse/[slug]/page.tsx → lib/utils.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (48 total, 6 thin omitted)

### Community 0 - "Dashboard Pages"
Cohesion: 0.08
Nodes (41): appointments, clients, segments, payments, reviews, movements, transactions, allTransactions (+33 more)

### Community 1 - "Landing & Auth Pages"
Cohesion: 0.14
Nodes (15): BusinessDetail(), DAY_ORDER, formatDate(), formatDay(), formatTime(), getDaysInMonth(), getFirstDayOfMonth(), HOURS (+7 more)

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
Cohesion: 0.07
Nodes (31): fontMono, inter, RootLayout(), CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData (+23 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): ./*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 7 - "Business Browse"
Cohesion: 0.07
Nodes (35): fetchSection(), LandingPage(), allInOnePoints, BusinessPage(), businessStats, features, marketplacePoints, metrics (+27 more)

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
Cohesion: 0.16
Nodes (13): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+5 more)

### Community 12 - "Business Detail"
Cohesion: 0.27
Nodes (10): Appointment, Calendar(), colors, formatDate(), getDaysInMonth(), getFirstDayOfMonth(), HOURS, isPastDate() (+2 more)

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
Cohesion: 0.16
Nodes (19): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), MapContainer, Marker, Popup, StarRating() (+11 more)

### Community 17 - "Location Picker & Map"
Cohesion: 0.17
Nodes (13): categories, initialServices, Service, Select(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel() (+5 more)

### Community 18 - "API Client Layer"
Cohesion: 0.14
Nodes (12): BusinessWithCoords, cities, FlyTo, getBusinessCoords(), MapContainer, Marker, neighborhoodCoords, Popup (+4 more)

### Community 19 - "OpenCode Config"
Cohesion: 0.14
Nodes (13): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+5 more)

### Community 20 - "Item Components"
Cohesion: 0.13
Nodes (20): ProfileDetails(), CardAction(), CardFooter(), Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel() (+12 more)

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
Cohesion: 0.22
Nodes (10): BrowseContent(), cities, Browse(), Pagination(), PaginationProps, fetchBusinessCategories(), searchBusinesses(), BusinessCardDto (+2 more)

### Community 42 - "page.tsx"
Cohesion: 0.29
Nodes (7): BusinessTypes(), CategoryBrowser(), fallbackIcons, getIcon(), iconMap, Skeleton(), BusinessCategoryDto

### Community 43 - "scroll-section.tsx"
Cohesion: 0.28
Nodes (6): api, ApiError, ApiResponse, getMsg(), isPublicPath(), PUBLIC_PATHS

## Knowledge Gaps
- **223 isolated node(s):** `BusinessCategory`, `ServiceType`, `BusinessService`, `BusinessTeamMember`, `ServiceCategory` (+218 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Item Components` to `Dashboard Pages`, `Landing & Auth Pages`, `Root Layout & Auth`, `Business Browse`, `page.tsx`, `OTP & Select Components`, `scroll-section.tsx`, `Platform Layout & Context`, `Dropdown Menu`, `Business Detail Page`, `Location Picker & Map`, `API Client Layer`, `Input Group Components`, `Alert Components`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Dev Tooling & Linting`, `Root Layout & Auth`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `react` connect `Root Layout & Auth` to `NPM Dependencies`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **What connects `BusinessCategory`, `ServiceType`, `BusinessService` to the rest of the system?**
  _223 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0824561403508772 - nodes in this community are weakly interconnected._
- **Should `Landing & Auth Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._
- **Should `Auth Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06155632984901278 - nodes in this community are weakly interconnected._