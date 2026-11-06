# ARCHITECTURE.md — Next.js + Supabase System Design & Contracts

> **Purpose**: Defines the directory structure, database schema (PostgreSQL/Supabase), Row Level Security (RLS) rules, and TypeScript/Zod contracts shared between **Frontend (Ken & Dave)** and **Backend (Sean & Keane)**.

---

## 1. High-Level System Architecture

```mermaid
flowchart LR
    subgraph Client["Mobile & Desktop Browser (85%+ Mobile)"]
        FE_Public["Next.js Public & Event Pages\n(Ken)"]
        FE_Market["Next.js Marketplace & Admin UI\n(Dave)"]
    end

    subgraph NextServer["Next.js App Router Server"]
        RSC["Server Components & Server Actions\n(Sean & Keane)"]
        Webhook["POST /api/webhooks/payment\nHMAC Signature Verifier (Keane)"]
    end

    subgraph Supabase["Supabase Backend (Sean & Keane)"]
        DB[("PostgreSQL + RLS\nAtomic RPCs")]
        Auth["Supabase Auth\n(Committee Admin)"]
        RT["Supabase Realtime\n(Order Status Stream)"]
    end

    subgraph PG["Payment Gateway (Tripay / Midtrans)"]
        QRIS["QRIS / Virtual Account"]
    end

    FE_Public --> RSC
    FE_Market --> RSC
    RSC --> DB
    FE_Market <--> RT
    RSC -->|"1. Create Invoice"| QRIS
    QRIS -->|"2. Server Webhook (HMAC)"| Webhook
    Webhook -->|"3. Service Role Update"| DB
    DB -->|"4. Broadcast PAID"| RT
```

---

## 2. Repository Directory Structure (Conflict-Free Ownership)

```text
├── AGENTS.md                          # Master AI instructions
├── CLAUDE.md                          # Claude Code entry pointer
├── docs/
│   ├── PRD.md                         # Product Requirements Document
│   ├── ARCHITECTURE.md                # System Architecture & Contracts
│   └── TEAM_WORKFLOW.md               # Role splits & AI prompts for Ken, Dave, Sean, Keane
├── supabase/                          # [OWNED BY: Sean & Keane]
│   ├── config.toml
│   ├── seed.sql
│   └── migrations/
│       ├── 0001_events_and_tickets.sql       # [Sean]
│       ├── 0002_marketplace_and_orders.sql   # [Keane]
│       └── 0003_rls_and_rpcs.sql             # [Sean & Keane]
└── src/
    ├── types/
    │   └── database.types.ts          # Auto-generated via `supabase gen types`
    ├── lib/
    │   ├── contracts/                 # [SHARED CONTRACT LAYER — Read before coding]
    │   │   ├── events.contract.ts
    │   │   ├── marketplace.contract.ts
    │   │   └── payments.contract.ts
    │   └── supabase/                  # [OWNED BY: Sean]
    │       ├── client.ts              # Browser client (@supabase/ssr)
    │       ├── server.ts              # RSC / Server Action client
    │       └── admin.ts               # Service-role client (WEBHOOKS ONLY)
    ├── services/                      # [OWNED BY: Sean & Keane — Backend Logic]
    │   ├── events.service.ts          # [Sean] Event & quota queries
    │   ├── registrations.service.ts   # [Sean] Participant registration & check-in
    │   ├── orders.service.ts          # [Keane] Atomic cart checkout & stock lock
    │   └── payments.service.ts        # [Keane] Midtrans/Tripay invoice + HMAC verify
    ├── components/                    # [OWNED BY: Ken & Dave — Frontend UI]
    │   ├── ui/                        # Shared shadcn/ui primitives
    │   ├── events/                    # [Ken] Hero, Schedule, RegForm, TicketCard
    │   ├── marketplace/               # [Dave] ProductGrid, CartDrawer, PaymentModal
    │   └── admin/                     # [Dave] KPIStats, OrdersTable, QRScanner
    └── app/
        ├── (public)/                  # [Ken] Home & KMK overview
        ├── events/                    # [Ken] /events/[slug], /events/[slug]/register
        ├── tickets/[code]/            # [Ken] Digital QR E-Ticket page
        ├── marketplace/               # [Dave] Merch & bundle storefront
        ├── admin/                     # [Dave] Committee dashboard & /admin/scan
        └── api/
            └── webhooks/
                └── payment/
                    └── route.ts       # [Keane] Payment gateway callback endpoint
```

---

## 3. Supabase Database Schema (ERD)

```mermaid
erDiagram
    EVENTS ||--o{ TICKET_TIERS : has
    EVENTS ||--o{ REGISTRATIONS : receives
    TICKET_TIERS ||--o{ REGISTRATIONS : prices
    ORDERS ||--o{ REGISTRATIONS : pays_for
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : includes
    ORDERS ||--o{ PAYMENT_LOGS : audits

    EVENTS {
        uuid id PK
        text slug UK "ycr | heart | ziarah | baksos"
        text title
        timestamptz event_date
        text venue
        boolean is_active
    }

    TICKET_TIERS {
        uuid id PK
        uuid event_id FK
        text name "Early Bird | Regular | VIP"
        integer price_idr "Pure integer (e.g. 50000)"
        integer quota_total
        integer quota_sold
    }

    REGISTRATIONS {
        uuid id PK
        uuid event_id FK
        uuid ticket_tier_id FK
        uuid order_id FK
        text full_name
        text nim_or_institution
        text email
        text whatsapp
        text ticket_code UK "Signed QR token"
        text checkin_status "UNCHECKED | CHECKED_IN"
        timestamptz checked_in_at
        timestamptz created_at
    }

    PRODUCTS {
        uuid id PK
        text slug UK
        text name
        text category "MERCH | FNB | BUNDLE"
        integer price_idr
        integer stock_available
        text image_url
        boolean is_active
    }

    ORDERS {
        uuid id PK
        text order_code UK "YCR-2026-XXXX"
        text order_type "EVENT_TICKET | MARKETPLACE"
        text buyer_name
        text buyer_email
        text buyer_whatsapp
        integer amount_subtotal_idr
        integer amount_fee_idr
        integer amount_total_idr
        text payment_method "QRIS | BRIVA | BCAVA | MANDIRIVA"
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
        uuid product_id FK
        text variant_label "Size S | M | L | XL"
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

## 4. Shared Frontend–Backend Contracts (`src/lib/contracts/`)

Both Frontend (**Ken & Dave**) and Backend (**Sean & Keane**) must import these exact Zod schemas and return types so UI forms and Supabase services integrate with zero friction:

```typescript
// src/lib/contracts/index.ts
import { z } from 'zod';

// 1. Event Registration Request (Ken FE -> Sean BE)
export const CreateRegistrationSchema = z.object({
  eventSlug: z.enum(['ycr', 'heart', 'ziarah', 'baksos']),
  ticketTierId: z.string().uuid(),
  fullName: z.string().min(3).max(100),
  nimOrInstitution: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, 'Invalid Indonesian WhatsApp number'),
  paymentMethod: z.enum(['FREE', 'QRIS', 'BCAVA', 'BRIVA', 'BNIVA', 'MANDIRIVA']),
});
export type CreateRegistrationInput = z.infer<typeof CreateRegistrationSchema>;

// 2. Marketplace Checkout Request (Dave FE -> Keane BE)
export const CreateMarketplaceOrderSchema = z.object({
  buyerName: z.string().min(3).max(100),
  buyerEmail: z.string().email(),
  buyerWhatsapp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/),
  paymentMethod: z.enum(['QRIS', 'BCAVA', 'BRIVA', 'BNIVA', 'MANDIRIVA']),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      variantLabel: z.string().optional(),
      quantity: z.number().int().min(1).max(10),
    })
  ).min(1),
});
export type CreateMarketplaceOrderInput = z.infer<typeof CreateMarketplaceOrderSchema>;

// 3. Unified Checkout Response (Sean/Keane BE -> Ken/Dave FE)
export interface CheckoutSessionResponse {
  orderCode: string;
  paymentStatus: 'PENDING' | 'PAID';
  amountTotalIdr: number;
  paymentMethod: string;
  qrImageUrl?: string;      // Populated when QRIS is selected
  vaNumber?: string;        // Populated when Virtual Account is selected
  snapToken?: string;       // Populated if using Midtrans Snap popup
  expiresAt: string;        // ISO8601 timestamp (15 mins from creation)
  ticketCode?: string;      // Immediately populated if event is FREE
}
```

---

## 5. Atomic Concurrency & RLS Rules (`Sean & Keane`)

1. **Preventing Overselling Under 100 Peak Users**:
   - Never do `SELECT stock` in TypeScript followed by `UPDATE stock = stock - 1` in a separate query.
   - Always use a PostgreSQL RPC function (`reserve_ticket_or_merch`) that locks the target row via `SELECT ... FOR UPDATE`, verifies `stock_available >= p_quantity`, decrements stock, and inserts the `orders` row in a single database transaction.
2. **Row Level Security (RLS) Matrix**:
   - `events`, `ticket_tiers`, `products`: `SELECT` open to `anon` and `authenticated` where `is_active = true`. Writes restricted to `authenticated` committee admins.
   - `registrations`, `orders`, `order_items`: Created via `SECURITY DEFINER` RPCs; `SELECT` allowed by matching `order_code` or `ticket_code` or committee admin role.
   - `payment_logs`: Strictly `service_role` only.
