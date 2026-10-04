# Graph Report - glowfront  (2026-10-04)

## Corpus Check
- 201 files · ~117,156 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .css 2, .ico 1)

## Summary
- 1153 nodes · 4385 edges · 66 communities (51 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cb99f66`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- call
- index.ts
- location-picker.tsx
- dependencies
- devDependencies
- client.ts
- compilerOptions
- react
- commissions.ts
- components.json
- types.ts
- partner.ts
- useConfirm
- useCustomer
- proxy.ts
- dropdown-menu.tsx
- lucide-react
- package.json
- (root)/browse/page.tsx
- bash
- cn
- Build & Deploy Workflow
- leave.ts
- [staffId]/page.tsx
- Kustomization Configuration
- usePagedList
- dashboard/layout.tsx
- Project README
- checkout-dialog.tsx
- graphify
- mpesa-payments-panel.tsx
- staff/commissions/page.tsx
- eslint.config.mjs
- next.config.mjs
- postcss.config.mjs
- GlowBuddy Auth Image
- input-otp.tsx
- input-group.tsx
- header.tsx
- alert.tsx
- booking-modal.tsx
- Product
- expense-dialog.tsx
- fetchBusinessCategories
- claim/page.tsx
- scripts
- app/layout.tsx
- Home
- data-table.tsx
- calendar.tsx
- showError
- radix-ui
- fetchAdminDashboard
- business-map.tsx
- app/page.tsx
- browse/[slug]/page.tsx
- search/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 157 edges
2. `react` - 122 edges
3. `Button()` - 74 edges
4. `showError()` - 74 edges
5. `extractError()` - 73 edges
6. `lucide-react` - 69 edges
7. `call()` - 66 edges
8. `showSuccess()` - 66 edges
9. `Input()` - 43 edges
10. `Card()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --semantically_similar_to--> `Backend API Specification`  [INFERRED] [semantically similar]
  README.md → backendimpl.md
- `BusinessPage()` --calls--> `fetchBusinessCategories()`  [EXTRACTED]
  app/(root)/business/page.tsx → lib/api/customer.ts
- `Appointments()` --indirect_call--> `showError()`  [INFERRED]
  app/(root)/dashboard/appointments/page.tsx → lib/toast.ts
- `ClientAnalytics()` --indirect_call--> `showError()`  [INFERRED]
  app/(root)/dashboard/clients/analytics/page.tsx → lib/toast.ts
- `ProfileSecurity()` --indirect_call--> `showError()`  [INFERRED]
  app/(root)/dashboard/profile/security/page.tsx → lib/toast.ts

## Import Cycles
- None detected.

## Communities (66 total, 6 thin omitted)

### Community 0 - "call"
Cohesion: 0.09
Nodes (38): Appointments(), ClientAnalytics(), pct(), ClientList(), day(), ClientSegments(), CashMovement(), Commissions() (+30 more)

### Community 1 - "index.ts"
Cohesion: 0.12
Nodes (33): AdminBusinesses(), AdminCategories(), AdminCustomers(), AdminPartners(), AdminReviews(), AdminCreateCategoryPayload, AdminCreateServicePayload, AdminDashboardDto (+25 more)

### Community 2 - "location-picker.tsx"
Cohesion: 0.22
Nodes (8): defaultCenter, defaultIcon, Location, LocationPicker(), Props, reverseGeocode(), searchQuery(), SearchResult

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, class-variance-authority, clsx, date-fns, @hookform/resolvers, input-otp, leaflet, lucide-react (+16 more)

### Community 4 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss, prettier, prettier-plugin-tailwindcss, tailwindcss (+6 more)

### Community 5 - "client.ts"
Cohesion: 0.11
Nodes (10): ACCESS_REVOKED, api, ApiError, ApiResponse, getMsg(), getSessionToken(), isPublicPath(), PUBLIC_PATHS (+2 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "react"
Cohesion: 0.11
Nodes (42): allInOnePoints, BusinessPage(), businessStats, features, marketplacePoints, metrics, successServices, Status (+34 more)

### Community 8 - "commissions.ts"
Cohesion: 0.12
Nodes (26): AppointmentDraft, blank(), NewAppointmentDialog(), Props, REMINDERS, REPEATS, isOpen(), MyAppointments() (+18 more)

### Community 9 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "types.ts"
Cohesion: 0.05
Nodes (40): CustomerContext, CustomerContextType, CustomerProvider(), mockProfile, profileFromStorage(), Business, BUSINESS_CATEGORIES, BusinessAmenityDto (+32 more)

### Community 11 - "partner.ts"
Cohesion: 0.10
Nodes (34): ProfileSecurity(), LoginCard(), OwnersAndManagers(), extractError(), fetchCustomerBusinessDetail(), pageQuery(), addMember(), changeMemberRole() (+26 more)

### Community 12 - "useConfirm"
Cohesion: 0.15
Nodes (26): Catalog(), AddMember(), empty, MemberServicesDialog(), Props, can(), Grid, key() (+18 more)

### Community 13 - "useCustomer"
Cohesion: 0.50
Nodes (5): PlatformHome(), loadDashboard(), Profile(), fetchCustomerDashboard(), useCustomer()

### Community 14 - "proxy.ts"
Cohesion: 0.29
Nodes (9): Role, ROLE_ADMIN, ROLE_CUSTOMER, ROLE_PARTNER, ROLE_STAFF, config, extractRoles(), normalizeRole() (+1 more)

### Community 15 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 16 - "lucide-react"
Cohesion: 0.05
Nodes (93): Props, AppointmentModal(), Props, Props, SaleModal(), Appointment, Calendar(), colors (+85 more)

### Community 17 - "package.json"
Cohesion: 0.07
Nodes (27): name, private, type, version, clsx, date-fns, eslint, eslint-config-next (+19 more)

### Community 18 - "(root)/browse/page.tsx"
Cohesion: 0.16
Nodes (14): BrowseContent(), BusinessCard(), cities, ProfileDetails(), Browse(), BusinessCard(), Footer(), gradients (+6 more)

### Community 19 - "bash"
Cohesion: 0.15
Nodes (12): git *, graphify *, node *, npm *, npx *, pip *, pnpm *, uv * (+4 more)

### Community 20 - "cn"
Cohesion: 0.13
Nodes (22): StarRating(), StarRating(), BookingDetailDialog(), AlertDialogOverlay(), CardAction(), CardDescription(), CardFooter(), DialogOverlay() (+14 more)

### Community 22 - "leave.ts"
Cohesion: 0.15
Nodes (24): Filter, LeaveRequests(), emptyForm(), MemberDetails(), emptyForm(), LeaveSection(), LeaveCard(), Props (+16 more)

### Community 23 - "[staffId]/page.tsx"
Cohesion: 0.15
Nodes (20): Advances(), day(), FILTERS, STATUS_LABEL, STATUS_STYLE, StaffCommissionsInner(), StatusFilter, approveAdvance() (+12 more)

### Community 24 - "Kustomization Configuration"
Cohesion: 0.70
Nodes (5): Glowfront ConfigMap, Glowfront HorizontalPodAutoscaler, Kustomization Configuration, Glowfront Namespace, Glowfront NodePort Service

### Community 25 - "usePagedList"
Cohesion: 0.17
Nodes (13): TeamMembers(), Advances(), day(), RequestsSection(), ServicesList(), cancelAdvance(), fetchMyAdvances(), fetchMyCommissions() (+5 more)

### Community 26 - "dashboard/layout.tsx"
Cohesion: 0.27
Nodes (9): DashboardLayout(), Props, DashboardMobileNav(), Sidebar(), fetchMyRole(), fetchPartnerBusiness(), BusinessRole, forgetMyRole() (+1 more)

### Community 27 - "Project README"
Cohesion: 0.40
Nodes (5): Backend API Specification, Manshade Partner Management Platform, Next.js Framework, shadcn/ui Component Library, Project README

### Community 28 - "checkout-dialog.tsx"
Cohesion: 0.19
Nodes (17): canDo(), CheckoutDialog(), Line, onService(), Props, TaskRow, checkout(), fetchCheckoutOptions() (+9 more)

### Community 29 - "graphify"
Cohesion: 0.40
Nodes (4): Available commands, graphify, Project Agents, When to use

### Community 31 - "mpesa-payments-panel.tsx"
Cohesion: 0.21
Nodes (14): Sale(), MpesaPaymentsPanel(), Props, Status, time(), fetchMpesaPayments(), fetchMySalesToday(), money() (+6 more)

### Community 36 - "staff/commissions/page.tsx"
Cohesion: 0.27
Nodes (10): day(), methodLabel(), Pay(), readSeen(), useFreshStamps(), fetchMyPayout(), fetchMyPayouts(), CommissionLineDto (+2 more)

### Community 41 - "input-otp.tsx"
Cohesion: 0.33
Nodes (4): InputOTP(), InputOTPGroup(), InputOTPSlot(), input-otp

### Community 42 - "input-group.tsx"
Cohesion: 0.33
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 43 - "header.tsx"
Cohesion: 0.17
Nodes (5): dynamic, dynamic, dynamic, dynamic, Header()

### Community 44 - "alert.tsx"
Cohesion: 0.33
Nodes (6): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants, class-variance-authority

### Community 45 - "booking-modal.tsx"
Cohesion: 0.24
Nodes (10): BookingFormData, BookingModal(), bookingSchema, formatDate(), getDaysInMonth(), getFirstDayOfMonth(), HOURS, isPastDate() (+2 more)

### Community 46 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 47 - "expense-dialog.tsx"
Cohesion: 0.25
Nodes (10): empty(), ExpenseDialog(), Props, recordExpense(), today(), EXPENSE_CATEGORIES, EXPENSE_LABEL, ExpenseCategory (+2 more)

### Community 48 - "fetchBusinessCategories"
Cohesion: 0.33
Nodes (7): CategoryBrowser(), fallbackIcons, getIcon(), iconMap, fetchBusinessCategories(), useCategories(), BusinessCategoryDto

### Community 49 - "claim/page.tsx"
Cohesion: 0.48
Nodes (6): Claim(), when(), claimTask(), fetchMyClaims(), unclaimTask(), ClaimSaleDto

### Community 50 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, start, typecheck

### Community 51 - "app/layout.tsx"
Cohesion: 0.21
Nodes (10): fontMono, inter, RootLayout(), LoadingProvider(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+2 more)

### Community 52 - "Home"
Cohesion: 0.53
Nodes (6): formatCurrency(), Home(), load(), fetchDashboardSummary(), fetchTopServices(), fetchTopTeamMember()

### Community 53 - "data-table.tsx"
Cohesion: 0.26
Nodes (10): Column, Props, Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead() (+2 more)

### Community 54 - "calendar.tsx"
Cohesion: 0.50
Nodes (4): buttonVariants, Calendar(), CalendarDayButton(), react-day-picker

### Community 55 - "showError"
Cohesion: 0.05
Nodes (73): AdminFlow(), LoginFormData, loginSchema, CustomerFlow(), LoginFormData, loginSchema, Mode, RegisterFormData (+65 more)

### Community 57 - "fetchAdminDashboard"
Cohesion: 1.00
Nodes (3): AdminHome(), load(), fetchAdminDashboard()

### Community 58 - "business-map.tsx"
Cohesion: 0.33
Nodes (7): Props, setupLeafletIcon(), MapContainer, Marker, Popup, TileLayer, react-leaflet

### Community 60 - "app/page.tsx"
Cohesion: 0.12
Nodes (17): fetchSection(), LandingPage(), BusinessFaq(), CityBrowser(), CtaSection(), Hero(), HowItWorks(), steps (+9 more)

### Community 70 - "browse/[slug]/page.tsx"
Cohesion: 0.15
Nodes (19): BusinessDetailPage(), DAY_ORDER, formatDay(), formatTime(), BusinessDetail(), DAY_ORDER, formatDay(), formatTime() (+11 more)

### Community 77 - "search/page.tsx"
Cohesion: 0.21
Nodes (10): BusinessWithCoords, cities, dynamic, FlyTo, getBusinessCoords(), getKenyaBounds(), neighborhoodCoords, SearchPage() (+2 more)

## Knowledge Gaps
- **294 isolated node(s):** `Props`, `loginSchema`, `LoginFormData`, `loginSchema`, `registerSchema` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 373 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `location-picker.tsx`, `commissions.ts`, `types.ts`, `useConfirm`, `dropdown-menu.tsx`, `lucide-react`, `package.json`, `(root)/browse/page.tsx`, `cn`, `leave.ts`, `[staffId]/page.tsx`, `usePagedList`, `dashboard/layout.tsx`, `checkout-dialog.tsx`, `mpesa-payments-panel.tsx`, `staff/commissions/page.tsx`, `input-otp.tsx`, `input-group.tsx`, `header.tsx`, `alert.tsx`, `booking-modal.tsx`, `expense-dialog.tsx`, `fetchBusinessCategories`, `claim/page.tsx`, `app/layout.tsx`, `data-table.tsx`, `calendar.tsx`, `showError`, `radix-ui`, `app/page.tsx`, `browse/[slug]/page.tsx`, `search/page.tsx`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `browse/[slug]/page.tsx`, `react`, `input-otp.tsx`, `input-group.tsx`, `alert.tsx`, `search/page.tsx`, `booking-modal.tsx`, `dropdown-menu.tsx`, `lucide-react`, `(root)/browse/page.tsx`, `app/layout.tsx`, `data-table.tsx`, `calendar.tsx`, `showError`, `radix-ui`, `leave.ts`, `dashboard/layout.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `react`, `useConfirm`, `dropdown-menu.tsx`, `package.json`, `(root)/browse/page.tsx`, `cn`, `checkout-dialog.tsx`, `input-otp.tsx`, `input-group.tsx`, `header.tsx`, `booking-modal.tsx`, `fetchBusinessCategories`, `app/layout.tsx`, `calendar.tsx`, `showError`, `business-map.tsx`, `app/page.tsx`, `browse/[slug]/page.tsx`, `search/page.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `showError()` (e.g. with `Appointments()` and `ClientAnalytics()`) actually correct?**
  _`showError()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Props`, `loginSchema`, `LoginFormData` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `call` be split into smaller, more focused modules?**
  _Cohesion score 0.08534850640113797 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12100840336134454 - nodes in this community are weakly interconnected._