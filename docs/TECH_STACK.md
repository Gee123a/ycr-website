# TECH_STACK.md — PDD Website (YCR "The Highway" & KMK Events Platform)

| Layer | Technology | Version / Tier | Primary Owners |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | v15+ / v16 (React 19, TypeScript) | **Ken** & **Dave** |
| **Styling & UI Kit** | **Tailwind CSS + shadcn/ui** | Tailwind v4, Lucide Icons, Radix Primitives | **Ken** & **Dave** |
| **Design System** | **"Sunlit Highway" tokens** (`docs/DESIGN.md`) | Lilita One + Nunito via `next/font`, light/dark via `prefers-color-scheme` | **Dave** (system) & **Ken** (implementation) |
| **Shared Constants** | **Single Source of Truth** (`src/lib/constants.ts`) | Dates (`YCR_OPENS_AT`, `YCR_DATE_MIDNIGHT`), Prices & Volume Tiers | **Shared** |
| **Client State & Forms** | **React Hook Form + Zod** | Dynamic group member rows, tiered pricing & validation | **Ken** & **Dave** |
| **Cart State** | **Zustand** | Persistent client cart for official merchandise (`/marketplace`) | **Dave** |
| **Backend & Database** | **Supabase (PostgreSQL)** | Managed PostgreSQL 15+ with RLS & Atomic RPCs | **Sean** & **Keane** |
| **Authentication** | **Supabase Auth (`@supabase/ssr`)** | Cookie-based SSR Auth for Committee Admin Portal (`/admin`) | **Sean** |
| **Realtime Engine** | **Supabase Realtime** | Live registration payment updates via WebSockets | **Dave** & **Keane** |
| **Storage** | **Supabase Storage** | Event assets, badges, and E-Ticket generation | **Sean** & **Keane** |
| **Payment Gateway** | **Tripay / Midtrans Snap** | QRIS (0.7% MDR) & Virtual Accounts + HMAC Webhook | **Keane** |
| **QR Ticket Engine** | **`qrcode.react` + `html5-qrcode`** | Scannable QR generation + Mobile Camera Gate Scanner (`/admin/scan`) | **Ken** & **Dave** |

---

## 1. Team Directory & GitHub Accounts

| Name | Role | Student Email | GitHub Username |
| :--- | :--- | :--- | :--- |
| **Gee** | Coordinator / maintainer (scope, schedule, ownership, docs, config) | `ssantoso04@student.ciputra.ac.id` | [`Gee123a`](https://github.com/Gee123a) |
| **Kenneth Jonathan Halim** (Ken) | Frontend (Next.js — Expanding Timeline Bar, D-Day Hero Centerpiece, Homepage Assembly) | `kjonathan08@student.ciputra.ac.id` | [`Kiyono-kouji`](https://github.com/Kiyono-kouji) |
| **Dave Tristian Nurcahyo** (Dave) | Frontend (Next.js — Paid Registration Form, Official Merch Store, Admin Portal & Scanner) | `dtristian@student.ciputra.ac.id` | [`Dave03062006`](https://github.com/Dave03062006) |
| **Sean Lawton** (Sean) | Backend (Supabase — Schema, Auth, Events & Timeline Service) | `slawton01@student.ciputra.ac.id` | [`Sean-230`](https://github.com/Sean-230) |
| **Keane Juan Suryanto** (Keane) | Backend (Supabase — Orders, Registration & Merch Payments, HMAC Webhooks) | `ksuryanto@student.ciputra.ac.id` | [`Kenn-jpg`](https://github.com/Kenn-jpg) |

---

## 2. Frontend Stack (`Ken` & `Dave`)

- **Next.js App Router Multi-Page Architecture (`src/app/`)**:
  - **Main Event Landing (`/`)**:
    - **Expanding Timeline Bar & D-Day Hero** (`src/components/timeline/TimelineBar.tsx`): Pinned horizontal navigation displaying milestone nodes (Baksos, Ziarah, Webinar, YCR). On D-Day (`Date.now() >= YCR_DATE_MIDNIGHT` from `src/lib/constants.ts`), it expands into the **primary visual hero focus of the page** (an expanded live Rundown Showcase stage with prominent session cards, live time indicator, speakers, and room locations). Owned by Ken.
    - **Context-Aware Paid Registration Form** (`src/components/registration/RegistrationForm.tsx`): Date-aware form switching between Webinar (Rp 50.000 placeholder) and YCR (Rp 150.000 placeholder with group discount tiers), with optional `nimOrInstitution` and integrated payment method selection. Owned by Dave.
  - **Official Merchandise Store (`/marketplace`)**:
    - First-class active route featuring official YCR apparel and merchandise, category filtering, persistent sliding cart drawer (`CartDrawer.tsx`), and embedded payment checkout modal (`PaymentModal.tsx`). Dave's completed work is retained and valued in this repository.
  - **Committee Operations (`/admin`, `/admin/scan`)**:
    - KPI analytics, exportable registration tables, and mobile camera QR gate scanner (Dave's completed work).
  - **Donations UI Removed**:
    - Dedicated `/donate` route and donation components have been removed from the frontend UI. Public donations will eventually be merged into the marketplace checkout flow.
  - **Server vs. Client Components**:
    - **React Server Components (RSC)** default for layout, initial event date checks, and admin data fetching.
    - **Client Components (`'use client'`)** strictly at interactive leaf nodes: timeline interactive bar and modal, context-aware registration form with dynamic rows, payment modal, cart drawer, and QR gate scanner.
- **Shared Constants (`src/lib/constants.ts`)**:
  - Single source of truth for all pricing and scheduling constants (`PRICE_WEBINAR_IDR`, `PRICE_YCR_INDIVIDUAL_IDR`, `DISCOUNT_TIER_5`, `DISCOUNT_TIER_10`, `YCR_OPENS_AT`, `YCR_DATE_MIDNIGHT`).
- **Tailwind CSS + `shadcn/ui`**:
  - Accessible, pre-built primitives (`Dialog`, `Form`, `Table`, `Badge`, `Tabs`, `Toast`).
- **QR Code Generation & Scanning**:
  - `qrcode.react` for rendering digital E-Tickets.
  - `html5-qrcode` / `@yudiel/react-qr-scanner` for the mobile gate scanner on `/admin/scan`.
- **Mock Data Providers (parallel development)**:
  - Ken: `src/components/timeline/mock-timeline.ts` — matches `TimelineMilestone` and `RundownSession` interfaces until Sean's `/api/timeline` is wired.
  - Dave: `src/app/mock-registration.ts` — validates with Zod (`CreateWebinarRegistrationSchema`, `CreateYcrRegistrationSchema`, `CreateYcrGroupSchema`); simulates payment gateway checkout session responses (`CheckoutSessionResponse`).

---

## 3. Backend & Database Stack (`Sean` & `Keane`)

- **Supabase Three-Client Pattern (`src/lib/supabase/`)**:
  1. `client.ts` (`createBrowserClient`): Browser-side Supabase Realtime subscriptions.
  2. `server.ts` (`createServerClient`): Server Components & Server Actions with secure cookie handling.
  3. `admin.ts` (`SUPABASE_SERVICE_ROLE_KEY`): Strictly server-only inside `POST /api/webhooks/payment/route.ts`.
- **Atomic Concurrency & Quota Protection**:
  - PostgreSQL RPC functions (`register_ycr_group`) lock quota records using `SELECT ... FOR UPDATE` to prevent overselling during registration surges.
  - Server-side price calculation directly validates against `src/lib/constants.ts` discount tiers.
- **Payment Gateway & Webhook (`Keane`)**:
  - **Tripay** or **Midtrans Snap** for embedded QRIS & Virtual Accounts, verified via cryptographic HMAC-SHA256 signature verification in the webhook callback.
  - Supports both registration ticket orders and merchandise orders.
- **Timeline API Endpoint (`src/app/api/timeline/route.ts`) — Sean**:
  - `GET /api/timeline` returns a typed `EventTimelineResponse` (from `timeline.contract.ts`).
  - Pre-D-Day: returns `milestones[]` for the timeline bar.
  - On D-Day: returns `rundown[]` sessions for the expanded hero showcase stage.
  - Ken's `TimelineBar.tsx` fetches from this endpoint; falls back to `src/components/timeline/mock-timeline.ts` during local development.
