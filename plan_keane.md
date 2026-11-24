# AI Implementation Plan: Keane (Backend Track BE-2)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Keane (Keane Juan Suryanto)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Ken, Dave, or Sean to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Keane Juan Suryanto (Keane)
- **Email**: `ksuryanto@student.ciputra.ac.id` | **GitHub**: [@Kenn-jpg](https://github.com/Kenn-jpg)
- **Branch Prefix**: `feat/be-keane-*`
- **Primary Deliverables**:
  1. Supabase PostgreSQL migrations for orders, order items, and payment logs.
  2. Maintenance of payment contract (`src/lib/contracts/payments.contract.ts` with `CheckoutSessionResponse`).
  3. Tripay / Midtrans payment gateway client and invoice generation (`src/services/payments.service.ts`) for paid Webinar registrations (Rp 50.000), paid YCR registrations (Rp 150.000 base, tiered group discounts from `src/lib/constants.ts`), and merchandise orders (`/marketplace`).
  4. Cryptographic HMAC-SHA256 signature verification and idempotent payment webhook (`POST /api/webhooks/payment`).
  5. Marketplace backend schema & stock reservation: the official merch catalog (`/marketplace`) is an active first-class page in this repository, supported directly.

### Allowed Files & Directories (READ & WRITE)
- `supabase/migrations/0002_marketplace_and_orders.sql`
- `supabase/migrations/0005_donations.sql`
- `src/lib/contracts/payments.contract.ts`
- `src/services/orders.service.ts`
- `src/services/payments.service.ts`
- `src/services/donations.service.ts`
- `src/app/api/webhooks/payment/route.ts`

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/app/marketplace/**`, `src/app/admin/**` *(Owned by Ken & Dave)*
- `src/components/**` *(Owned by Ken & Dave)*
- `supabase/migrations/0001_*`, `0003_*`, `0004_*`, `0006_*` *(Owned by Sean)*
- `src/services/events.service.ts`, `src/services/registrations.service.ts`, `src/middleware.ts` *(Owned by Sean)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/constants.ts` (Single source of truth: `PRICE_WEBINAR_IDR`, `PRICE_YCR_INDIVIDUAL_IDR`, `DISCOUNT_TIER_5`, `DISCOUNT_TIER_10`)
2. `src/lib/contracts/payments.contract.ts` (`CheckoutSessionResponse`)
3. `src/lib/contracts/registration.contract.ts` (Paid Webinar & Paid YCR schemas, MemberSchema with optional `nimOrInstitution`)
4. `src/lib/contracts/marketplace.contract.ts` (Merch products and orders)
5. `docs/ARCHITECTURE.md` (Sections 3, 4, 5 & 6: Orders ERD, RLS matrix, and Webhook security rules)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Orders & Payment Logs Migration (`0002_marketplace_and_orders.sql`)**
  - [ ] Create `orders` table (`id`, `order_code`, `order_type`, `buyer_name`, `buyer_email`, `buyer_whatsapp`, `amount_subtotal_idr`, `amount_discount_idr`, `amount_total_idr`, `payment_method`, `payment_reference`, `payment_qr_or_va`, `payment_status`, `expires_at`, `paid_at`).
  - [ ] Create `order_items` table (`id`, `order_id`, `product_id`, `variant_label`, `quantity`, `unit_price_idr`).
  - [ ] Create `payment_logs` table (`id`, `order_id`, `raw_payload`, `signature_header`, `is_valid_signature`, `received_at`).
  - [ ] Create `products` and `product_variants` tables to power the official merchandise store (`/marketplace`).
  - [ ] Enable RLS on all tables with `service_role` write lock on payment fields.

- [ ] **Task 2: Payment Contract & Gateway Client (`src/lib/contracts/payments.contract.ts`, `src/services/payments.service.ts`)**
  - [ ] Maintain `src/lib/contracts/payments.contract.ts` with `CheckoutSessionResponse` (payment URL, QR string, VA number, expiration timestamp).
  - [ ] Implement Tripay / Midtrans Snap API client in `src/services/payments.service.ts`.
  - [ ] Handle checkout session creation for:
    - **Webinar Registration**: `PRICE_WEBINAR_IDR` (Rp 50.000).
    - **YCR Registration**: Individual (`PRICE_YCR_INDIVIDUAL_IDR` = Rp 150.000) and Group (volume discounts: 5–9 pax 10% off, 10+ pax 20% off from `src/lib/constants.ts`).
    - **Official Merchandise**: itemized cart total from `/marketplace`.
  - [ ] Generate dynamic QRIS QR strings and Virtual Account numbers.
  - [ ] Return unified `CheckoutSessionResponse`.

- [ ] **Task 3: Atomic Group Registration RPC (`register_ycr_group`)**
  - [ ] Implement PostgreSQL RPC function `register_ycr_group`:
    - Locks `ticket_tiers` row using `SELECT ... FOR UPDATE`.
    - Verifies quota availability for the group size.
    - Server-side validates tiered pricing against `src/lib/constants.ts` to prevent frontend price tampering.
    - Inserts `orders` record and creates corresponding `registrations` records with `checkin_status = 'UNCHECKED'`.

- [ ] **Task 4: Idempotent Payment Webhook (`POST /api/webhooks/payment/route.ts`)**
  - [ ] Extract raw request body and signature header (`X-Callback-Signature` / `signature_key`).
  - [ ] Verify cryptographic HMAC-SHA256 signature against `PAYMENT_GATEWAY_PRIVATE_KEY`.
  - [ ] Log every attempt to `payment_logs` table.
  - [ ] **Idempotency Guard**: If `order.payment_status === 'PAID'`, return `200 OK` immediately.
  - [ ] On `PAID`: Update `orders.payment_status = 'PAID'`, set `paid_at = NOW()`.
  - [ ] If `order_type === 'EVENT_TICKET'`: Activate participant registration and trigger ticket QR code generation.
  - [ ] If `order_type === 'MARKETPLACE'`: Deduct inventory stock and mark order as confirmed.

- [ ] **Task 5: Backend Donations (`supabase/migrations/0005_donations.sql`, `src/services/donations.service.ts`)**
  - [ ] Retain donation table migration and backend service in codebase for Keane's backend engineering (public donations will eventually be routed through the marketplace checkout flow).

---

## 3. Pre-Merge Verification
```bash
npx supabase db reset --local   # Migrations must apply cleanly
npm run db:types                # Auto-generate TypeScript definitions
npm run typecheck               # Must compile with 0 errors
```
