# ARCHITECTURE.md — Next.js + Supabase System Design & Contracts

> **Purpose**: Defines the directory structure, database schema (PostgreSQL/Supabase), Row Level Security (RLS) rules, shared constants, and TypeScript/Zod contracts shared between **Frontend (Ken & Dave)** and **Backend (Sean & Keane)** under the unified web platform architecture.

---

## 1. High-Level System Architecture

```mermaid
flowchart LR
    subgraph Client["Client Browser (85%+ Mobile)"]
        FE_Public["Next.js Homepage (/)\n• Expanding Timeline Bar / D-Day Hero (Ken)\n• Context-Aware Paid Reg Form (Dave)"]
        FE_Market["Next.js Marketplace (/marketplace)\n• Official Merch Catalog & Cart (Dave - Retained)"]
        FE_Admin["Next.js Admin & Scanner (/admin, /admin/scan)\n(Dave - Complete)"]
    end

    subgraph NextServer["Next.js App Router Server"]
        RSC["Server Components & Server Actions\n(Sean & Keane)"]
        TimelineAPI["GET /api/timeline\n(Sean)"]
        Webhook["POST /api/webhooks/payment\nHMAC Signature Verifier (Keane)"]
        Constants["src/lib/constants.ts\nDates & Pricing Source of Truth"]
    end

    subgraph Supabase["Supabase Backend (Sean & Keane)"]
        DB[("PostgreSQL + RLS\nAtomic RPCs")]
        Auth["Supabase Auth\n(Committee Admin)"]
        RT["Supabase Realtime\n(Payment & Order Stream)"]
    end

    subgraph PG["Payment Gateway (Tripay / Midtrans)"]
        QRIS["QRIS / Virtual Account"]
    end

    FE_Public --> RSC
    FE_Market --> RSC
    FE_Admin --> RSC
    RSC --> DB
    FE_Public <--> RT
    FE_Market <--> RT
    FE_Public --> TimelineAPI
    RSC -->|"1. Create Registration / Merch Order"| QRIS
    QRIS -->|"2. Server Webhook (HMAC)"| Webhook
    Webhook -->|"3. Service Role Update"| DB
    DB -->|"4. Broadcast PAID"| RT
```

---

## 2. Repository Directory Structure (Conflict-Free Ownership)

```text
├── AGENTS.md                          # [Gee] Master AI agent rules & directory boundaries
├── CLAUDE.md                          # [Gee] Claude Code entry pointer
├── README.md                          # [shared] Repository overview & quick start
├── docs/                              # [Gee]
│   ├── PLAYBOOK.md                    # Master AI-assisted development playbook
│   ├── PRD.md                         # Product Requirements Document
│   ├── ARCHITECTURE.md                # System Architecture & Contracts (this file)
│   ├── TECH_STACK.md                  # Libraries & versions
│   ├── TEAM_WORKFLOW.md               # Tracks, integration order, AI prompts
│   └── DESIGN.md                      # [Dave] Design system ("Sunlit Highway")
├── supabase/
│   ├── config.toml                    # [Sean]
│   ├── seed.sql                       # [shared]
│   └── migrations/                    # [shared folder — new file per change, never edit another's]
│       ├── 0001_events_and_tickets.sql       # [Sean]
│       ├── 0002_marketplace_and_orders.sql   # [Keane]
│       ├── 0003_rls_and_rpcs.sql             # [Sean]  events/registrations RLS + RPCs
│       ├── 0004_event_timeline.sql           # [Sean]  event_milestones
│       ├── 0005_donations.sql                # [Keane] donations + DONATION order type (backend)
│       └── 0006_event_rundown.sql            # [Sean]  event_sessions (D-Day rundown)
└── src/
    ├── middleware.ts                  # [Sean] Protects /admin with Supabase Auth
    ├── types/
    │   └── database.types.ts          # [shared, generated] `npm run db:types` only
    ├── lib/
    │   ├── constants.ts               # [SHARED] Dates, pricing, discount tiers (Single Source of Truth)
    │   ├── contracts/                 # [SHARED CONTRACT LAYER — Read before coding]
    │   │   ├── index.ts               # Re-exports active contracts
    │   │   ├── common.contract.ts     # Shared field schemas (WhatsApp, payment methods)
    │   │   ├── registration.contract.ts # [NEW] Dave ↔ Sean/Keane (Webinar, YCR Indiv/Group — Both Paid)
    │   │   ├── timeline.contract.ts   # Ken ↔ Sean (Milestones & D-Day Rundown)
    │   │   ├── admin.contract.ts      # Dave ↔ Sean (Dashboard KPIs & reporting)
    │   │   ├── marketplace.contract.ts# Dave ↔ Keane (Merch products, variants, orders)
    │   │   ├── donations.contract.ts  # Keane (Retained for backend use; unused on standalone FE)
    │   │   └── payments.contract.ts   # All (CheckoutSessionResponse)
    │   └── supabase/                  # [Sean]
    │       ├── client.ts              # Browser client (@supabase/ssr)
    │       ├── server.ts              # RSC / Server Action client
    │       └── admin.ts               # Service-role client (WEBHOOKS ONLY)
    ├── services/                      # Backend logic (Server Actions / server-only)
    │   ├── events.service.ts          # [Sean]  Events query
    │   ├── registrations.service.ts   # [Sean]  Registration & check-in RPC wrappers
    │   ├── timeline.service.ts        # [Sean]  Milestones & D-Day rundown data
    │   ├── admin.service.ts           # [Sean]  Dashboard KPIs & CSV export queries
    │   ├── orders.service.ts          # [Keane] Orders creation & pricing verification
    │   ├── donations.service.ts       # [Keane] Backend donation service (external use)
    │   └── payments.service.ts        # [Keane] Tripay/Midtrans invoice & HMAC verify
    ├── components/
    │   ├── ui/                        # [Ken]  Shared shadcn/ui primitives
    │   ├── layout/                    # [Ken]  Root layout, sticky header container, footer
    │   ├── timeline/                  # [Ken]  TimelineBar.tsx, TimelineModal.tsx, D-Day Rundown Hero, mock-timeline.ts
    │   ├── registration/              # [Dave] Context-aware form (RegistrationForm, WebinarForm, YcrForm, PriceSummary)
    │   ├── marketplace/               # [Dave] Active merch components (CartDrawer, ProductGrid, PaymentModal) — Complete
    │   └── admin/                     # [Dave] Dashboard (KpiCards, AdminTables, GateScanner) — Complete
    └── app/
        ├── layout.tsx                 # [Ken]  Root layout
        ├── globals.css                # [shared] imports tokens.css
        ├── tokens.css                 # [Ken]  Design tokens from docs/DESIGN.md
        ├── (public)/page.tsx          # [Ken & Dave] Main landing (Expanding Timeline / D-Day Hero + Reg Form)
        ├── mock-registration.ts       # [Dave] Mock registration submit handler
        ├── marketplace/               # [Dave] Official merchandise store (Retained first-class route)
        │   └── page.tsx               # Active merch catalog with persistent cart drawer & payment modal
        ├── admin/                     # [Dave] Committee dashboard & /admin/scan (Complete)
        └── api/
            ├── timeline/
            │   └── route.ts           # [Sean] GET /api/timeline → EventTimelineResponse
            └── webhooks/
                └── payment/
                    └── route.ts       # [Keane] Payment gateway callback endpoint
```

> **Website Structure Clarification**: The platform contains `/` (Main Event Landing), `/marketplace` (Official Merch Catalog, persistent cart drawer, payment modal — Dave's work is active and preserved), and `/admin` & `/admin/scan` (Committee portal). Only `/donate` is removed; donations will eventually merge into the marketplace flow.

---

## 3. Shared Constants (`src/lib/constants.ts`)

To avoid drift and magical hardcoded numbers between frontend forms and backend RPCs, `src/lib/constants.ts` serves as the **single source of truth** for all dates, base prices, and group discount tiers:

```typescript
// src/lib/constants.ts

/**
 * Event Date Boundaries
 */
export const YCR_OPENS_AT = new Date('2026-04-01T00:00:00+07:00');
export const YCR_DATE_MIDNIGHT = new Date('2026-05-16T00:00:00+07:00');

/**
 * Base Event Pricing (in IDR)
 * Both Webinar and YCR Individual are PAID registrations.
 */
export const PRICE_WEBINAR_IDR = 50_000;
export const PRICE_YCR_INDIVIDUAL_IDR = 150_000;

/**
 * YCR Group Volume Discount Tiers
 */
export const DISCOUNT_TIER_5 = 0.10;   // 10% discount for 5–9 participants
export const DISCOUNT_TIER_10 = 0.20;  // 20% discount for 10+ participants
```

---

## 4. Supabase Database Schema (ERD)

```mermaid
erDiagram
    EVENTS ||--o{ TICKET_TIERS : has
    EVENTS ||--o{ REGISTRATIONS : receives
    EVENTS ||--o{ EVENT_MILESTONES : schedules
    EVENTS ||--o{ EVENT_SESSIONS : "runs (D-Day rundown)"
    TICKET_TIERS ||--o{ REGISTRATIONS : prices
    ORDERS ||--o{ REGISTRATIONS : pays_for
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENT_LOGS : audits
    PRODUCTS ||--o{ ORDER_ITEMS : includes

    EVENTS {
        uuid id PK
        text slug UK "baksos | ziarah | webinar | ycr"
        text title
        timestamptz event_date
        text venue
        boolean is_active
    }

    TICKET_TIERS {
        uuid id PK
        uuid event_id FK
        text name "Webinar | YCR Standard | YCR Group"
        integer price_idr "50000 | 150000"
        integer quota_total
        integer quota_sold
    }

    REGISTRATIONS {
        uuid id PK
        uuid event_id FK
        uuid ticket_tier_id FK
        uuid order_id FK
        text full_name
        text email
        text whatsapp
        text nim_or_institution "nullable / optional"
        text registration_type "INDIVIDUAL | GROUP"
        text ticket_code UK "Signed QR check-in token"
        text checkin_status "UNCHECKED | CHECKED_IN"
        timestamptz checked_in_at
        timestamptz created_at
    }

    EVENT_MILESTONES {
        uuid id PK
        uuid event_id FK
        text title "e.g. Baksos, Ziarah, Webinar, YCR"
        text description
        timestamptz starts_at
        timestamptz ends_at "nullable"
        integer sort_order
        boolean is_published
    }

    EVENT_SESSIONS {
        uuid id PK
        uuid event_id FK
        text title "Rundown session title"
        text speaker
        text location
        timestamptz starts_at
        timestamptz ends_at
        integer sort_order
        boolean is_published
    }

    ORDERS {
        uuid id PK
        text order_code UK "YCR-2026-XXXX"
        text order_type "EVENT_TICKET | MARKETPLACE | DONATION"
        text buyer_name
        text buyer_email
        text buyer_whatsapp
        integer amount_subtotal_idr
        integer amount_discount_idr
        integer amount_total_idr
        text payment_method "QRIS | BCAVA | BRIVA | BNIVA | MANDIRIVA"
        text payment_reference UK "Gateway reference ID"
        text payment_qr_or_va "QR URL or VA number"
        text payment_status "PENDING | PAID | EXPIRED | FAILED"
        timestamptz expires_at
        timestamptz paid_at
        timestamptz created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK "nullable for ticket orders"
        text description "e.g. YCR Group Registration (5 pax)"
        integer quantity
        integer unit_price_idr
    }

    PAYMENT_LOGS {
        uuid id PK
        uuid order_id FK
        jsonb raw_payload
        text signature_header
        boolean is_valid_signature
        timestamptz received_at
    }
```

---

## 5. Shared Frontend–Backend Contracts (`src/lib/contracts/`)

All schemas utilize standard Zod 4 syntax (`z.email()`, `z.uuid()`).

### 5.1 Common & Shared Types (`src/lib/contracts/common.contract.ts`)
```typescript
import { z } from 'zod';

export const WhatsappSchema = z
  .string()
  .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, 'Invalid Indonesian WhatsApp number');

export const PaidMethodSchema = z.enum(['QRIS', 'BCAVA', 'BRIVA', 'BNIVA', 'MANDIRIVA']);
export type PaidMethod = z.infer<typeof PaidMethodSchema>;
```

### 5.2 Context-Aware Registration (`src/lib/contracts/registration.contract.ts`)
```typescript
import { z } from 'zod';
import { WhatsappSchema, PaidMethodSchema } from './common.contract';

// Reusable member schema (nimOrInstitution is optional)
export const MemberSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.email(),
  whatsapp: WhatsappSchema,
  nimOrInstitution: z.string().max(100).optional(),
});
export type Member = z.infer<typeof MemberSchema>;

// Webinar Registration (PAID - Rp 50.000 placeholder, Individual only)
export const CreateWebinarRegistrationSchema = z.object({
  member: MemberSchema,
  paymentMethod: PaidMethodSchema,
});
export type CreateWebinarRegistrationInput = z.infer<typeof CreateWebinarRegistrationSchema>;

// YCR Individual Registration (PAID - Rp 150.000 placeholder)
export const CreateYcrRegistrationSchema = z.object({
  member: MemberSchema,
  paymentMethod: PaidMethodSchema,
});
export type CreateYcrRegistrationInput = z.infer<typeof CreateYcrRegistrationSchema>;

// YCR Group Registration (Leader is members[0] + dynamically appended members)
export const CreateYcrGroupSchema = z.object({
  members: z.array(MemberSchema).min(1),
  paymentMethod: PaidMethodSchema,
});
export type CreateYcrGroupInput = z.infer<typeof CreateYcrGroupSchema>;
```

### 5.3 Expanding Timeline Bar & D-Day Rundown Hero (`src/lib/contracts/timeline.contract.ts`)
> **Contract Reuse**: The existing `TimelineMilestone` and `RundownSession` interfaces power both the pre-D-Day Sticky Timeline Bar and the expanded D-Day Hero Rundown Showcase stage.

```typescript
export interface TimelineMilestone {
  id: string;
  title: string;             // e.g. "Baksos", "Ziarah", "Webinar", "YCR"
  description: string | null; // Venue, short context
  startsAt: string;          // ISO8601
  endsAt: string | null;     // ISO8601
  state: 'PAST' | 'NOW' | 'UPCOMING';
}

export interface RundownSession {
  id: string;
  title: string;             // Session title
  speaker: string | null;    // Guest speaker / worship leader
  location: string | null;   // Room / Stage
  startsAt: string;          // ISO8601
  endsAt: string;            // ISO8601
}

export interface EventTimelineResponse {
  eventSlug: 'baksos' | 'ziarah' | 'webinar' | 'ycr';
  milestones: TimelineMilestone[];
  rundown: RundownSession[];  // Populated for D-Day mode
}
```

- **Pre-D-Day Mode**: The bar displays the 4 milestone nodes (`milestones`) with states:
  - `PAST` = filled green
  - `NOW` = pulsing gold
  - `UPCOMING` = hollow circle
  - Hover triggers 1-line tooltip; click opens `TimelineModal`.
- **D-Day Hero Transformation Mode**: Triggered automatically when `Date.now() >= YCR_DATE_MIDNIGHT`.
  - The timeline expands significantly from a simple top bar into the **primary visual hero focus of the page**.
  - It becomes an expanded live **Rundown Showcase stage** with prominent session cards, live time indicator ("HAPPENING NOW"), speaker badges, and stage/room locations.
  - The registration form steps down into a secondary role below the rundown (or displays "Registration Closed / Today's Live Event").

### 5.4 Checkout & Payment Response (`src/lib/contracts/payments.contract.ts`)
Both Webinar and YCR are paid events, triggering a checkout session:

```typescript
export interface CheckoutSessionResponse {
  orderCode: string;
  orderType: 'EVENT_TICKET' | 'MARKETPLACE' | 'DONATION';
  paymentStatus: 'PENDING' | 'PAID';
  amountTotalIdr: number;
  paymentMethod: string;
  qrImageUrl?: string;      // Populated when QRIS is selected
  vaNumber?: string;        // Populated when Virtual Account is selected
  snapToken?: string;       // Populated if using Midtrans Snap modal
  expiresAt: string;        // ISO8601 timestamp (15 mins from creation)
  ticketCode?: string;      // Populated once order status transitions to PAID
}
```

### 5.5 Backend Donations Contract (`src/lib/contracts/donations.contract.ts`)
*(Retained in codebase for Keane's backend use; not exposed as a standalone `/donate` page).*
```typescript
import { z } from 'zod';
import { WhatsappSchema, PaidMethodSchema } from './common.contract';

export const CreateDonationSchema = z.object({
  campaign: z.enum(['ycr', 'baksos']),
  amountIdr: z.number().int().positive(),
  donorName: z.string().min(3).max(100),
  donorEmail: z.email(),
  donorWhatsapp: WhatsappSchema,
  isAnonymous: z.boolean().default(false),
  message: z.string().max(280).optional(),
  paymentMethod: PaidMethodSchema,
});
export type CreateDonationInput = z.infer<typeof CreateDonationSchema>;
```

---

## 6. Atomic Concurrency & RLS Rules (`Sean & Keane`)

1. **Atomic Group Registration & Quota Locking**:
   - For YCR registrations, frontend submits `members: Member[]` and `paymentMethod: PaidMethod`.
   - Backend RPC function (`register_ycr_group`) verifies quota availability using `SELECT quota_sold, quota_total FROM ticket_tiers WHERE ... FOR UPDATE`.
   - Atomically increments `quota_sold = quota_sold + array_length(members)` and inserts registration records linked to the newly generated `orders` record.
2. **Tiered Pricing Calculation (Server-Validated via Constants)**:
   - Price calculation on server enforces volume discounts matching `src/lib/constants.ts`:
     - 1–4 members: `PRICE_YCR_INDIVIDUAL_IDR` (Rp 150.000 / member)
     - 5–9 members: `DISCOUNT_TIER_5` (10% off $\rightarrow$ Rp 135.000 / member)
     - $\ge$ 10 members: `DISCOUNT_TIER_10` (20% off $\rightarrow$ Rp 120.000 / member)
   - Prevents client-side price tampering.
3. **Webinar Registration Pricing**:
   - Fixed at `PRICE_WEBINAR_IDR` (Rp 50.000 / member).
   - Generates an `orders` record of type `EVENT_TICKET` and creates payment gateway checkout.
4. **Webhook Verification (`Keane`)**:
   - `POST /api/webhooks/payment/route.ts` verifies HMAC-SHA256 signature.
   - Transitions order status to `PAID`.
   - On payment confirmation, generates unique QR `ticket_code`s for all registered participants and updates `registrations.checkin_status = 'UNCHECKED'`.
5. **Row Level Security (RLS)**:
   - `events`, `event_milestones`, `event_sessions`: public `SELECT` where `is_published = true`.
   - `registrations`: `INSERT` via verified RPC; `SELECT` restricted to committee admin auth or verified `ticket_code`.
   - `payment_logs`: strictly restricted to `service_role`.
