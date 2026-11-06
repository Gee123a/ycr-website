# TECH_STACK.md — PDD Website (YCR "The Highway" & KMK Events Platform)

| Layer | Technology | Version / Tier | Primary Owners |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | v15+ / v16 (React 19, TypeScript) | **Ken** & **Dave** |
| **Styling & UI Kit** | **Tailwind CSS + shadcn/ui** | Tailwind v4, Lucide Icons, Radix Primitives | **Ken** & **Dave** |
| **Client State & Forms** | **React Hook Form + Zod** | Schema-first validation + `localStorage` Cart | **Ken** & **Dave** |
| **Backend & Database** | **Supabase (PostgreSQL)** | Managed PostgreSQL 15+ with RLS & Atomic RPCs | **Sean** & **Keane** |
| **Authentication** | **Supabase Auth (`@supabase/ssr`)** | Cookie-based SSR Auth for Committee Admin Portal | **Sean** |
| **Realtime Engine** | **Supabase Realtime** | Live `orders.payment_status` WebSocket updates | **Dave** & **Keane** |
| **Storage** | **Supabase Storage** | Event banners, merch product photos, E-Ticket assets | **Sean** & **Keane** |
| **Payment Gateway** | **Tripay / Midtrans Snap** | QRIS (0.7% MDR) & Virtual Accounts + HMAC Webhook | **Keane** |
| **QR Ticket Engine** | **`qrcode.react` + `html5-qrcode`** | Client QR rendering + Mobile Camera Gate Scanner | **Ken** & **Dave** |

---

## 1. Team Directory & GitHub Accounts

| Name | Role | Student Email | GitHub Username |
| :--- | :--- | :--- | :--- |
| **Kenneth Jonathan Halim** (Ken) | Frontend (Next.js — Events & E-Tickets) | `kjonathan08@student.ciputra.ac.id` | [`Kiyono-kouji`](https://github.com/Kiyono-kouji) |
| **Dave Tristian Nurcahyo** (Dave) | Frontend (Next.js — Marketplace & Admin) | `dtristian@student.ciputra.ac.id` | [`Dave03062006`](https://github.com/Dave03062006) |
| **Sean Lawton** (Sean) | Backend (Supabase — Schema, Auth, Events) | `slawton01@student.ciputra.ac.id` | [`Sean-230`](https://github.com/Sean-230) |
| **Keane Juan Suryanto** (Keane) | Backend (Supabase — Orders & Payments) | `ksuryanto@student.ciputra.ac.id` | [`Kenn-jpg`](https://github.com/Kenn-jpg) |

---

## 2. Frontend Stack (`Ken` & `Dave`)

- **Next.js App Router (`src/app/`)**:
  - **React Server Components (RSC)** by default for zero-bundle-size data fetching from Supabase (`events`, `ticket_tiers`, `products`).
  - **Client Components (`'use client'`)** strictly at interactive leaf nodes: registration forms, slide-over cart drawer, QRIS countdown modal, and camera QR scanner.
- **Tailwind CSS + `shadcn/ui`**:
  - Accessible, pre-built primitives (`Dialog`, `Sheet`, `Form`, `Table`, `Badge`, `Tabs`, `Toast`).
- **QR Code Generation & Scanning**:
  - `qrcode.react` for scannable E-Tickets on `/tickets/[code]` (Ken).
  - `html5-qrcode` / `@yudiel/react-qr-scanner` for the committee gate scanner on `/admin/scan` (Dave).

---

## 3. Backend & Database Stack (`Sean` & `Keane`)

- **Supabase Three-Client Pattern (`src/lib/supabase/`)**:
  1. `client.ts` (`createBrowserClient`): Client-side Supabase Realtime subscriptions.
  2. `server.ts` (`createServerClient`): Server Components & Server Actions with cookie forwarding.
  3. `admin.ts` (`SUPABASE_SERVICE_ROLE_KEY`): Strictly server-only inside `POST /api/webhooks/payment/route.ts`.
- **Atomic Concurrency (`SELECT ... FOR UPDATE`)**:
  - PostgreSQL RPC functions (`register_participant`, `create_marketplace_order`) prevent overselling under 50–100 peak concurrent users.
- **Payment Gateway & Webhook (`Keane`)**:
  - **Tripay** or **Midtrans Snap** for embedded QRIS & Virtual Accounts, verified via HMAC-SHA256 webhook signature.
