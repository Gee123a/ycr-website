# Graph Report - ycr-website  (2026-11-25)

## Corpus Check
- Corpus is ~24,812 words - fits in a single context window. You may not need a graph.

## Summary
- 348 nodes · 719 edges · 31 communities (12 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Donation & Core Tests
- Package & ESLint Config
- Marketplace Cart Store
- Checkout & Zod Contracts
- Admin Dashboard & Tables
- Marketplace Catalog & UI
- Platform Architecture & Contracts
- Gate QR Check-In Scanner
- TypeScript Compiler Config
- Team Ownership & Webhooks
- Root Layout & Typography
- Project Documentation Index
- Design Tokens & Contrast
- Payment Gateway & HMAC
- Timeline & Zod Contracts
- Admin Scanner Scope
- Parallel Integration Workflow
- Supabase Database ERD
- System Architecture Overview
- Road & Leaf Motifs
- Display & Body Typography
- Multi-Page Hero Architecture
- Official Marketplace Route
- Next.js Leaf Client Pattern
- QR Ticket Scanner Stack
- Committee Admin Operations

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `lucide-react` - 14 edges
3. `react` - 14 edges
4. `formatRupiah()` - 14 edges
5. `next` - 13 edges
6. `CartDrawer()` - 13 edges
7. `DonationForm()` - 12 edges
8. `PaymentModal()` - 12 edges
9. `AdminTables()` - 11 edges
10. `zod` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Atomic Group Registration RPC (register_ycr_group)` --semantically_similar_to--> `Atomic Participant Registration RPC (register_participant)`  [INFERRED] [semantically similar]
  plan_keane.md → plan_sean.md
- `Shared Constants Single Source of Truth` --semantically_similar_to--> `CSS Custom Property Design Tokens`  [INFERRED] [semantically similar]
  docs/ARCHITECTURE.md → docs/DESIGN.md
- `Contract-First Parallel Development` --semantically_similar_to--> `Four-Phase Integration Pipeline`  [INFERRED] [semantically similar]
  docs/PLAYBOOK.md → docs/TEAM_WORKFLOW.md
- `checkInTicket()` --calls--> `getAdminDashboard()`  [EXTRACTED]
  src/app/admin/scan/mock-check-in.ts → src/app/admin/mock-dashboard.ts
- `ScanPage()` --calls--> `GateScanner()`  [EXTRACTED]
  src/app/admin/scan/page.tsx → src/components/admin/GateScanner.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Paid Registration & Webhook Settlement Flow** — plan_dave_registration_form, plan_keane_register_ycr_group_rpc, plan_keane_payments_service, plan_keane_payment_webhook_route [EXTRACTED 1.00]
- **Timeline & D-Day Hero Showcase Pipeline** — plan_sean_timeline_rundown_migrations, plan_sean_timeline_api, plan_ken_timeline_bar, plan_ken_homepage_assembly [EXTRACTED 1.00]
- **Isolated 4-Track AI Development Model** — plan_ken_fe1_track, plan_dave_fe2_track, plan_sean_be1_track, plan_keane_be2_track [EXTRACTED 1.00]
- **Contract-First Parallel Delivery Pattern** — docs_architecture_shared_contracts, docs_architecture_constants_single_source, docs_playbook_contract_first_parallel_dev, docs_team_workflow_integration_pipeline [EXTRACTED 1.00]
- **End-to-End Paid Registration & Webhook Flow** — docs_prd_context_aware_registration, docs_prd_payment_gateway_engine, docs_architecture_atomic_concurrency_rls, docs_architecture_hmac_webhook_verification [EXTRACTED 1.00]
- **Sunlit Highway Design System Architecture** — docs_design_sunlit_highway_theme, docs_design_css_tokens, docs_design_typography_scale, docs_design_road_motif [EXTRACTED 1.00]

## Communities (31 total, 19 thin omitted)

### Community 0 - "Donation & Core Tests"
Cohesion: 0.09
Nodes (32): react, DonatePage(), metadata, PreselectedForm(), parseRupiah(), CAMPAIGNS, DonationForm(), submit() (+24 more)

### Community 1 - "Package & ESLint Config"
Cohesion: 0.07
Nodes (36): eslintConfig, dependencies, lucide-react@^1.69.0, next@16.4.5, react@19.3.0, react-dom@19.3.0, zod@^4.6.7, devDependencies (+28 more)

### Community 2 - "Marketplace Cart Store"
Cohesion: 0.14
Nodes (31): AddToCart(), add(), CartItem, CartItemSchema, CartLine, MAX_PER_LINE, maxQuantity(), parseCart() (+23 more)

### Community 3 - "Checkout & Zod Contracts"
Cohesion: 0.13
Nodes (23): zod, createDonation(), createMarketplaceOrder(), cartTotalIdr(), isMockCheckoutOpen, mockCheckoutSession(), AdminDashboardResponse, AdminOrder (+15 more)

### Community 4 - "Admin Dashboard & Tables"
Cohesion: 0.12
Nodes (26): getAdminDashboard(), AdminPage(), metadata, AdminTables(), exportCsv(), dateTime, downloadCsv(), formatWib() (+18 more)

### Community 5 - "Marketplace Catalog & UI"
Cohesion: 0.13
Nodes (23): nextConfig, lucide-react, next, getMarketplaceProducts(), MOCK_PRODUCTS, Catalog(), MarketplacePage(), metadata (+15 more)

### Community 6 - "Platform Architecture & Contracts"
Cohesion: 0.08
Nodes (25): Context-Aware Paid Registration Form, Shared Contracts Layer (src/lib/contracts/), Expanding Timeline Bar & D-Day Hero Stage, MemberSchema, Shared Constants (src/lib/constants.ts), Sunlit Highway Design System, Dave Frontend Track FE-2, Mobile Camera QR Gate Scanner (/admin/scan) (+17 more)

### Community 7 - "Gate QR Check-In Scanner"
Cohesion: 0.12
Nodes (18): html5-qrcode@^2.3.8, html5-qrcode, checkIns, checkInTicket(), TicketCodeSchema, metadata, ScanPage(), BANNERS (+10 more)

### Community 8 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Team Ownership & Webhooks"
Cohesion: 0.17
Nodes (11): YCR ("The Highway") & KMK Platform, CLAUDE.md Platform Guide, Committee Admin Dashboard (/admin), Keane Backend Track BE-2, Orders & Payment Logs Migration (0002_marketplace_and_orders.sql), Idempotent Payment Webhook (POST /api/webhooks/payment), Ken Frontend Track FE-1, Sean Backend Track BE-1 (+3 more)

### Community 10 - "Root Layout & Typography"
Cohesion: 0.29
Nodes (4): lilita, metadata, nunito, viewport

### Community 11 - "Project Documentation Index"
Cohesion: 0.67
Nodes (6): ARCHITECTURE.md — System Design & Contracts, DESIGN.md — Sunlit Highway Design System, PLAYBOOK.md — AI-Assisted Product Development Playbook, PRD.md — Product Requirements Document, TEAM_WORKFLOW.md — Team Tracks & Integration Order, TECH_STACK.md — Technology Stack & Versions

## Knowledge Gaps
- **27 isolated node(s):** `Sunlit Highway Design System`, `Committee Operations (/admin & /admin/scan)`, `Documentation Suite (docs/)`, `Mock Registration Handler (mock-registration.ts)`, `Committee Admin Dashboard (/admin)` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 117 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Marketplace Catalog & UI` to `Donation & Core Tests`, `Package & ESLint Config`, `Admin Dashboard & Tables`, `Gate QR Check-In Scanner`, `Root Layout & Typography`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `Sunlit Highway Design System`, `Committee Operations (/admin & /admin/scan)`, `Documentation Suite (docs/)` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Donation & Core Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09397163120567376 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Donation & Core Tests` to `Package & ESLint Config`, `Marketplace Cart Store`, `Admin Dashboard & Tables`, `Marketplace Catalog & UI`, `Gate QR Check-In Scanner`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Package & ESLint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06685633001422475 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Marketplace Catalog & UI` to `Donation & Core Tests`, `Package & ESLint Config`, `Marketplace Cart Store`, `Admin Dashboard & Tables`, `Gate QR Check-In Scanner`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `Marketplace Cart Store` be split into smaller, more focused modules?**
  _Cohesion score 0.13813813813813813 - nodes in this community are weakly interconnected._