# AGENTS.md / CLAUDE.md — YCR ("The Highway") & KMK Web Platform

> **AI Agent Instructions**: Read this file before modifying any code, schema, or configuration. This repository powers the **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra** web platform for **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, and **Baksos**.

---

## 1. Tech Stack & Core Architecture

- **Frontend**: Next.js (App Router, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons)
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security, Storage, Edge Functions / Next.js Route Handlers)
- **Validation & Contracts**: Zod + Supabase generated TypeScript types (`src/types/database.types.ts`)
- **Payment Gateway**: Midtrans Snap / Tripay Direct QRIS & Virtual Account with HMAC-SHA256 webhook verification

---

## 2. Team Ownership & Directory Boundaries

To prevent merge conflicts and keep AI coding sessions isolated, every team member and their AI assistant must respect strict directory ownership:

| Member | Role | Primary Ownership Scope | Owned Directories |
| :--- | :--- | :--- | :--- |
| **Ken** (Kenneth Jonathan Halim) | **Frontend** (Next.js) | Landing pages, Event Hub (Heart, Ziarah, Baksos, YCR), Registration Forms, E-Ticket QR View | `src/app/(public)/`, `src/app/events/`, `src/components/events/`, `src/components/ui/` |
| **Dave** (Dave Tristian Nurcahyo) | **Frontend** (Next.js) | YCR Marketplace UI (Catalog, Cart, Checkout Modal), Committee Admin & Scanner Dashboard | `src/app/marketplace/`, `src/app/admin/`, `src/components/marketplace/`, `src/components/admin/` |
| **Sean** (Sean Lawton) | **Backend** (Supabase) | PostgreSQL Schema, Migrations, RLS Policies, Auth, Event & Registration Queries/Actions | `supabase/migrations/`, `src/lib/supabase/`, `src/services/events.ts`, `src/services/registrations.ts` |
| **Keane** (Keane Juan Suryanto) | **Backend** (Supabase) | Marketplace Order Engine, Stock Reservation, Payment Gateway (Midtrans/Tripay) & Webhooks | `src/app/api/webhooks/`, `src/services/orders.ts`, `src/services/payments.ts` |

> **Shared Contract Rule**: `src/types/database.types.ts` and `src/lib/contracts/` are the single source of truth between Frontend (Ken & Dave) and Backend (Sean & Keane). Never invent ad-hoc JSON shapes in frontend components or backend handlers.

---

## 3. Non-Negotiable Coding Guardrails for AI Agents

1. **Contract-First Development**:
   - Before building a form (Frontend) or a mutation (Backend), check `src/lib/contracts/` for the Zod schema and TypeScript interface.
   - After any SQL change in `supabase/migrations/`, regenerate types via `npm run db:types`.
2. **Next.js App Router Conventions**:
   - Default to **React Server Components (RSC)** for data fetching (`src/app/**`).
   - Add `'use client'` **only** at leaf interactive components (forms, cart drawers, QR scanner, payment popup triggers).
   - Never import `src/lib/supabase/admin.ts` (service-role key) inside any Client Component or file reachable by the client bundle.
3. **Supabase & Security Rules**:
   - Use `createServerClient` (`@supabase/ssr`) in Server Components, Server Actions, and Route Handlers.
   - Use `createServiceRoleClient` **strictly** inside verified server-to-server webhooks (`src/app/api/webhooks/payment/route.ts`).
   - All tables in `public` schema **must** have Row Level Security (`ENABLE ROW LEVEL SECURITY`) turned on before merging.
4. **Payment & Order Integrity**:
   - Never mark an order or registration as `PAID` from client-side callbacks (`onSuccess` in browser).
   - Only `POST /api/webhooks/payment` after verifying the cryptographic signature (`X-Callback-Signature` / `signature_key`) may transition an order from `PENDING` to `PAID`.
   - Webhook handlers must be **idempotent**: if an order is already `PAID`, return `200 OK` immediately without duplicate ticket generation or stock deduction.
5. **Mobile-First Performance (50–100 Concurrent Users)**:
   - Over 85% of YCR participants open links from Instagram/WhatsApp mobile browsers.
   - Keep client bundles small, optimize images via `next/image`, and ensure all tap targets are at least `44x44px`.

---

## 4. Standard Commands

```bash
# Development
npm run dev                  # Start Next.js local server (http://localhost:3000)
npm run build                # Production build check
npm run lint                 # ESLint check
npm run typecheck            # tsc --noEmit

# Supabase CLI
npx supabase start           # Start local Supabase stack
npx supabase db reset        # Apply all migrations + seed.sql locally
npx supabase gen types typescript --local > src/types/database.types.ts
```
