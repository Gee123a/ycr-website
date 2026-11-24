# TECH_STACK.md — PDD Website (YCR "The Highway" & KMK Events Platform)

| Layer | Technology | Version / Tier | Primary Owners |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | v15+ / v16 (React 19, TypeScript) | **Ken** & **Dave** |
| **Styling & UI Kit** | **Tailwind CSS + shadcn/ui** | Tailwind v4, Lucide Icons, Radix Primitives | **Ken** & **Dave** |
| **Design System** | **"Sunlit Highway" tokens** (`docs/DESIGN.md`) | Lilita One + Nunito via `next/font`, light/dark via `prefers-color-scheme` | **Dave** (system) & **Ken** (implementation) |
| **Client State & Forms** | **React Hook Form + Zod** | Dynamic group member rows, tiered pricing & validation | **Ken** & **Dave** |
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
| **Kenneth Jonathan Halim** (Ken) | Frontend (Next.js — Sticky Timeline Bar, Homepage Assembly & Layout) | `kjonathan08@student.ciputra.ac.id` | [`Kiyono-kouji`](https://github.com/Kiyono-kouji) |
| **Dave Tristian Nurcahyo** (Dave) | Frontend (Next.js — Registration Form, Admin Portal & Scanner, Marketplace Stub) | `dtristian@student.ciputra.ac.id` | [`Dave03062006`](https://github.com/Dave03062006) |
| **Sean Lawton** (Sean) | Backend (Supabase — Schema, Auth, Events & Timeline Service) | `slawton01@student.ciputra.ac.id` | [`Sean-230`](https://github.com/Sean-230) |
| **Keane Juan Suryanto** (Keane) | Backend (Supabase — Orders, Group Registration Payments & Webhook) | `ksuryanto@student.ciputra.ac.id` | [`Kenn-jpg`](https://github.com/Kenn-jpg) |

---

## 2. Frontend Stack (`Ken` & `Dave`)

- **Next.js App Router Architecture (`src/app/`)**:
  - **Single-Page Flagship Focus (`/`)**:
    - **Sticky Timeline Bar** (`src/components/timeline/TimelineBar.tsx`): Pinned horizontal navigation displaying milestone nodes (Baksos, Ziarah, Webinar, YCR) and auto-switching on D-Day to the session rundown. Owned by Ken.
    - **Context-Aware Registration Form** (`src/components/registration/RegistrationForm.tsx`): Date-aware form switching between Webinar and YCR (with individual/group toggle and live price calculation). Owned by Dave.
  - **Committee Operations (`/admin`, `/admin/scan`)**:
    - KPI analytics, exportable registration tables, and mobile camera QR gate scanner (Dave's completed work).
  - **Marketplace Placeholder (`/marketplace`)**:
    - Preserved as a stub route for a future separate project.
  - **Donations UI Removed**:
    - No `/donate` route or donation UI components exist on this website.
  - **Server vs. Client Components**:
    - **React Server Components (RSC)** default for layout, initial event date checks, and admin data fetching.
    - **Client Components (`'use client'`)** strictly at interactive leaf nodes: timeline interactive bar and modal, context-aware registration form with dynamic rows, payment modal, and QR gate scanner.
- **Tailwind CSS + `shadcn/ui`**:
  - Accessible, pre-built primitives (`Dialog`, `Form`, `Table`, `Badge`, `Tabs`, `Toast`).
- **QR Code Generation & Scanning**:
  - `qrcode.react` for rendering digital E-Tickets.
  - `html5-qrcode` / `@yudiel/react-qr-scanner` for the mobile gate scanner on `/admin/scan`.
- **Mock Data Providers (parallel development)**:
  - Ken: `src/components/timeline/mock-timeline.ts` — matches `TimelineMilestone` and `RundownSession` interfaces until Sean's `/api/timeline` is wired.
  - Dave: `src/app/mock-registration.ts` — mirrors `mock-checkout.ts` pattern; validates with Zod, returns `CheckoutResult`.

---

## 3. Backend & Database Stack (`Sean` & `Keane`)

- **Supabase Three-Client Pattern (`src/lib/supabase/`)**:
  1. `client.ts` (`createBrowserClient`): Browser-side Supabase Realtime subscriptions.
  2. `server.ts` (`createServerClient`): Server Components & Server Actions with secure cookie handling.
  3. `admin.ts` (`SUPABASE_SERVICE_ROLE_KEY`): Strictly server-only inside `POST /api/webhooks/payment/route.ts`.
- **Atomic Concurrency & Quota Protection**:
  - PostgreSQL RPC functions (`register_ycr_group`) lock quota records using `SELECT ... FOR UPDATE` to prevent overselling during registration surges.
- **Payment Gateway & Webhook (`Keane`)**:
  - **Tripay** or **Midtrans Snap** for embedded QRIS & Virtual Accounts, verified via cryptographic HMAC-SHA256 signature verification in the webhook callback.
- **Timeline API Endpoint (`src/app/api/timeline/route.ts`) — Sean**:
  - `GET /api/timeline` returns a typed `EventTimelineResponse` (from `timeline.contract.ts`).
  - Before D-Day: returns `milestones[]` for the sticky timeline bar.
  - On D-Day: returns `rundown[]` sessions for the auto-switched rundown view.
  - Ken's `TimelineBar.tsx` fetches from this endpoint; falls back to `src/components/timeline/mock-timeline.ts` during local development.
