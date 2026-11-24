# AGENTS.md — Master AI Agent Rules (YCR "The Highway" & KMK Platform)

> **AI Agent Instructions**: Read this file before modifying any code, schema, or configuration. This repository powers the **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra** web platform for **Youth Catholic Revival (YCR — "The Highway")**, **Webinar**, **Ziarah**, and **Baksos**.

---

## 1. Team & Ownership Architecture

To guarantee zero merge conflicts and preserve modularity, every agent and team member must strictly operate inside their assigned scope:

| Member | Role | Student Email | GitHub | Primary Scope & Directories |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, docs, repo setup, releases, shared constants (`src/lib/constants.ts`), shared contracts lock |
| **Ken** (Kenneth Jonathan Halim) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Expanding Timeline Bar, D-Day Hero Showcase Centerpiece, Homepage Assembly (`/`), site layout<br>• `src/app/(public)/`, `src/app/page.tsx`<br>• `src/components/timeline/` (`TimelineBar.tsx`, `TimelineModal.tsx`, `mock-timeline.ts`), `src/components/layout/`, `src/components/ui/` |
| **Dave** (Dave Tristian Nurcahyo) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: Context-Aware Paid Registration Form, Official Merchandise Store (`/marketplace`), Admin Dashboard, Gate Scanner<br>• `src/components/registration/` (`RegistrationForm.tsx`, `WebinarForm.tsx`, `YcrForm.tsx`, `PriceSummary.tsx`)<br>• `src/app/marketplace/`, `src/components/marketplace/` (Active first-class merch store — Retained & Complete)<br>• `src/app/admin/`, `src/components/admin/` (Complete)<br>• `src/app/mock-registration.ts` |
| **Sean** (Sean Lawton) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: PostgreSQL Schema & Migrations (`0001`, `0003`, `0004`, `0006`), RLS Policies, Auth Middleware, Timeline Service & API Route, Check-In Verification RPC, Admin Reporting<br>• `supabase/migrations/0001*`, `0003*`, `0004*`, `0006*`<br>• `src/lib/supabase/`, `src/middleware.ts`<br>• `src/services/events.service.ts`, `src/services/timeline.service.ts`, `src/services/admin.service.ts`, `src/services/registrations.service.ts`<br>• `src/app/api/timeline/route.ts` |
| **Keane** (Keane Juan Suryanto) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: PostgreSQL Schema & Migrations (`0002`, `0005`), Orders Engine, Atomic Group Registration RPC, Tripay/Midtrans Gateway & HMAC Webhook, Merch Orders & Backend Donations<br>• `supabase/migrations/0002*`, `0005*`<br>• `src/services/orders.service.ts`, `src/services/payments.service.ts`, `src/services/donations.service.ts`<br>• `src/app/api/webhooks/payment/route.ts` |

---

## 2. Shared Contracts & Single Source of Truth

- **Shared Constants (`src/lib/constants.ts`)**:
  - The **single source of truth** for all dates, base pricing, and group discount percentages:
    - `YCR_OPENS_AT`, `YCR_DATE_MIDNIGHT`
    - `PRICE_WEBINAR_IDR = 50_000`
    - `PRICE_YCR_INDIVIDUAL_IDR = 150_000`
    - `DISCOUNT_TIER_5 = 0.10` (10%)
    - `DISCOUNT_TIER_10 = 0.20` (20%)
- **Contracts Directory**: `src/lib/contracts/` is the strict contract layer between Frontend and Backend.
  - `common.contract.ts` — Shared field validators (Indonesian WhatsApp regex, payment method enum `PaidMethodSchema`).
  - `registration.contract.ts` — Member schema (`MemberSchema` with optional `nimOrInstitution`), paid webinar registration (`CreateWebinarRegistrationSchema` with `member` and `paymentMethod`), paid YCR individual registration (`CreateYcrRegistrationSchema` with `member` and `paymentMethod`), and paid YCR group registration (`CreateYcrGroupSchema` with `members` array and `paymentMethod`).
  - `timeline.contract.ts` — Milestone & session rundown schemas (`TimelineMilestone`, `RundownSession`, `EventTimelineResponse`), reused for both the pre-D-Day timeline bar and the expanded D-Day hero stage.
  - `marketplace.contract.ts` — Product, variant, and merch order schemas (active contract for `/marketplace`).
  - `donations.contract.ts` — Retained for backend use; not exposed as a standalone frontend route.
  - `payments.contract.ts` — Unified checkout response contract (`CheckoutSessionResponse`).
  - `admin.contract.ts` — Committee dashboard KPIs, table models, and export schemas.
- **Database Types**: `src/types/database.types.ts` is auto-generated via `npm run db:types`. Never manually edit generated types.

---

## 3. Non-Negotiable Coding Guardrails

1. **Design System Adherence**:
   - Every UI component built by Ken or Dave must strictly consume CSS variables defined in `src/app/tokens.css` and follow `docs/DESIGN.md` ("Sunlit Highway" design tokens: Sunlit Gold, Desert Amber, Highway Blue, Lilita One headings, Nunito body).
2. **Website Architecture**:
   - **Main Event Landing (`/`)**:
     - **Expanding Timeline Bar & D-Day Hero Stage**:
       - *Pre-D-Day*: Pinned full-width bar at top of page, connecting milestone nodes (Baksos, Ziarah, Webinar, YCR) with states `PAST` (green), `NOW` (pulsing gold), `UPCOMING` (hollow). Hover triggers tooltip; click opens `TimelineModal`.
       - *On D-Day (`Date.now() >= YCR_DATE_MIDNIGHT` via `src/lib/constants.ts`)*: Automatically expands significantly from a simple top bar into the **primary visual hero focus of the page** (an expanded live Rundown Showcase stage with prominent session cards, live time indicator, speakers, and room locations). The registration form steps down into a secondary role (or displays "Registration Closed / Today's Live Event").
     - **Context-Aware Paid Registration Form**:
       - Automatically renders Webinar registration before `YCR_OPENS_AT` and YCR registration on/after `YCR_OPENS_AT`.
       - **Both Webinar and YCR are PAID events** that require payment method selection (`PaidMethodSchema`) and trigger checkout sessions via the payment gateway.
       - `nimOrInstitution` is optional in `MemberSchema`.
       - YCR form supports Individual/Group toggle with dynamic member rows and live volume discount calculations from `src/lib/constants.ts` (1–4: Rp 150k, 5–9: 10% off, $\ge$10: 20% off).
   - **Official Merchandise Store (`/marketplace`)**:
     - **Retained and active first-class page** in this repository. Dave's completed merch catalog, persistent cart drawer (`CartDrawer.tsx`), and checkout payment modal (`PaymentModal.tsx`) are preserved and celebrated.
   - **No Standalone Donation UI**:
     - The `/donate` route and donation UI components have been removed. Public donations will eventually merge into the marketplace flow.
3. **Next.js App Router Architecture**:
   - Default to **React Server Components (RSC)** for data fetching (`src/app/**`).
   - Add `'use client'` **only** at leaf interactive components (forms, timeline interactive bar/modal, payment modal, cart drawer, QR scanner).
   - Never import `src/lib/supabase/admin.ts` (service-role key) into client components or client bundles.
4. **Database Security & Concurrency**:
   - All PostgreSQL tables in Supabase **must** have Row Level Security (`ENABLE ROW LEVEL SECURITY`) turned on.
   - Quotas and registration transactions **must** be executed atomically via PostgreSQL RPC functions with `SELECT ... FOR UPDATE` row locks to prevent overselling.
5. **Payment Webhook Integrity**:
   - Never transition order or registration status to `PAID` from frontend callbacks.
   - Status changes to `PAID` can **only** be executed server-to-server by `POST /api/webhooks/payment/route.ts` after verifying the HMAC-SHA256 signature with the gateway secret.
   - Webhook processing must be idempotent: repeated callbacks return `200 OK` immediately without duplicate ticket generation.
6. **Mobile-First UX (85%+ Mobile Traffic)**:
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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
