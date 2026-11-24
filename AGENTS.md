# AGENTS.md — Master AI Agent Rules (YCR "The Highway" & KMK Platform)

> **AI Agent Instructions**: Read this file before modifying any code, schema, or configuration. This repository powers the **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra** web platform for **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, and **Baksos**.

---

## 1. Team & Ownership Architecture

To guarantee zero merge conflicts and preserve modularity, every agent and team member must strictly operate inside their assigned scope:

| Member | Role | Student Email | GitHub | Primary Scope & Directories |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, docs, repo setup, releases, shared contracts lock |
| **Ken** (Kenneth Jonathan Halim) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Landing Page, Event Hub (`ycr`, `heart`, `ziarah`, `baksos`), Registration Forms, QR E-Ticket (`/tickets/[code]`), Event Timeline (`/timeline`)<br>• `src/app/(public)/`, `src/app/events/`, `src/app/tickets/`, `src/app/timeline/`<br>• `src/components/events/`, `src/components/timeline/`, `src/components/layout/`, `src/components/ui/` |
| **Dave** (Dave Tristian Nurcahyo) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: YCR Marketplace, Cart Drawer, Embedded QRIS/VA Payment Modal, Donation Page (`/donate`), Committee Admin & QR Gate Scanner (`/admin/scan`)<br>• `src/app/marketplace/`, `src/app/donate/`, `src/app/admin/`<br>• `src/components/marketplace/`, `src/components/donation/`, `src/components/admin/` |
| **Sean** (Sean Lawton) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: PostgreSQL Schema & Migrations (`0001`, `0003`, `0004`, `0006`), RLS Policies, Auth Middleware, Atomic Registration RPC, Check-In Verification RPC, Timeline & Admin Queries<br>• `supabase/migrations/0001*`, `0003*`, `0004*`, `0006*`<br>• `src/lib/supabase/`, `src/middleware.ts`<br>• `src/services/events.service.ts`, `src/services/registrations.service.ts`, `src/services/timeline.service.ts`, `src/services/admin.service.ts` |
| **Keane** (Keane Juan Suryanto) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: PostgreSQL Schema & Migrations (`0002`, `0005`), Marketplace Order Engine, 15-min Stock Reservation RPC, Donations Service, Tripay/Midtrans Gateway & HMAC Webhook Handler<br>• `supabase/migrations/0002*`, `0005*`<br>• `src/services/orders.service.ts`, `src/services/donations.service.ts`, `src/services/payments.service.ts`<br>• `src/app/api/webhooks/payment/route.ts` |

---

## 2. Shared Contracts & Single Source of Truth

- **Contracts Directory**: `src/lib/contracts/` is the strict contract layer between Frontend and Backend.
  - `common.contract.ts` — Shared field validators (Indonesian WhatsApp regex, payment method enum).
  - `events.contract.ts` — Registration payload schema (`CreateRegistrationSchema`).
  - `timeline.contract.ts` — Milestone & session schemas (`EventTimelineResponse`).
  - `marketplace.contract.ts` — Cart order schema (`CreateMarketplaceOrderSchema`).
  - `donations.contract.ts` — Donation schema (`CreateDonationSchema`).
  - `payments.contract.ts` — Unified checkout modal contract (`CheckoutSessionResponse`).
- **Database Types**: `src/types/database.types.ts` is auto-generated via `npm run db:types`. Never manually edit generated types.

---

## 3. Non-Negotiable Coding Guardrails

1. **Design System Adherence**:
   - Every UI component built by Ken or Dave must strictly consume CSS variables defined in `src/app/tokens.css` and follow `docs/DESIGN.md` ("Sunlit Highway" design tokens: Sunlit Gold, Desert Amber, Highway Blue, Lilita One headings, Nunito body).
2. **Next.js App Router Architecture**:
   - Default to **React Server Components (RSC)** for data fetching (`src/app/**`).
   - Add `'use client'` **only** at leaf interactive components (forms, slide-over cart, modal popups, QR scanner).
   - Never import `src/lib/supabase/admin.ts` (service-role key) into client components or client bundles.
3. **Database Security & Concurrency**:
   - All PostgreSQL tables in Supabase **must** have Row Level Security (`ENABLE ROW LEVEL SECURITY`) turned on.
   - Quotas (tickets) and inventory (merchandise) **must** be deducted atomically via PostgreSQL RPC functions with `SELECT ... FOR UPDATE` row locks to prevent overselling under 100 peak concurrent users.
4. **Payment Webhook Integrity**:
   - Never transition order or registration status to `PAID` from frontend callbacks (`onSuccess`).
   - Status changes to `PAID` can **only** be executed server-to-server by `POST /api/webhooks/payment/route.ts` after verifying the HMAC-SHA256 signature with the gateway secret.
   - Webhook processing must be idempotent: repeated callbacks return `200 OK` immediately without duplicate ticket generation.
5. **Mobile-First UX (85%+ Mobile Traffic)**:
   - Ensure all interactive elements have tap targets of at least `44x44px`.
   - Responsive layouts must look pristine on 375px viewport (iPhone SE) up to 4K desktop displays.

---

## 4. Standard Commands

```bash
# Development
npm run dev                  # Start local Next.js server (http://localhost:3000)
npm run build                # Production build check
npm run lint                 # ESLint check
npm run typecheck            # TypeScript compiler check (tsc --noEmit)

# Supabase CLI
npx supabase start           # Start local Supabase instance
npx supabase db reset        # Apply all migrations + seed.sql locally
npx supabase gen types typescript --local > src/types/database.types.ts
```
