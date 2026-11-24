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
  3. Tripay / Midtrans payment gateway client and invoice generation (`src/services/payments.service.ts`).
  4. Cryptographic HMAC-SHA256 signature verification and idempotent payment webhook (`POST /api/webhooks/payment`).
  5. Marketplace backend schema & stock reservation (marketplace is a future separate project; preserved/prepared for standalone extraction).

### Allowed Files & Directories (READ & WRITE)
- `supabase/migrations/0002_marketplace_and_orders.sql`
- `src/lib/contracts/payments.contract.ts`
- `src/services/orders.service.ts`
- `src/services/payments.service.ts`
- `src/app/api/webhooks/payment/route.ts`

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/app/events/**`, `src/app/marketplace/**`, `src/app/admin/**` *(Owned by Ken & Dave)*
- `src/components/**` *(Owned by Ken & Dave)*
- `supabase/migrations/0001_*`, `0003_*`, `0004_*`, `0006_*` *(Owned by Sean)*
- `src/services/events.service.ts`, `src/services/registrations.service.ts`, `src/middleware.ts` *(Owned by Sean)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/contracts/payments.contract.ts` (`CheckoutSessionResponse`)
2. `src/lib/contracts/registration.contract.ts` (Group payment method linkage)
3. `src/lib/contracts/marketplace.contract.ts`
4. `docs/ARCHITECTURE.md` (Sections 3 & 5: Orders ERD, RLS matrix, and Webhook security rules)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Orders & Payment Logs Migration (`0002_marketplace_and_orders.sql`)**
  - [ ] Create `orders` table (`id`, `order_code`, `order_type`, `buyer_name`, `buyer_email`, `buyer_whatsapp`, `amount_subtotal_idr`, `amount_fee_idr`, `amount_total_idr`, `payment_method`, `payment_reference`, `payment_qr_or_va`, `payment_status`, `expires_at`, `paid_at`).
  - [ ] Create `order_items` table (`id`, `order_id`, `product_id`, `variant_label`, `quantity`, `unit_price_idr`).
  - [ ] Create `payment_logs` table (`id`, `order_id`, `raw_payload`, `signature_header`, `is_valid_signature`, `received_at`).
  - [ ] Enable RLS on all tables with `service_role` write lock on payment fields.
  - [ ] *Note*: Products table and stock reservation RPC remain in migration for the standalone marketplace project.

- [ ] **Task 2: Payment Contract & Gateway Client (`src/lib/contracts/payments.contract.ts`, `src/services/payments.service.ts`)**
  - [ ] Maintain `src/lib/contracts/payments.contract.ts` with `CheckoutSessionResponse` (payment URL, QR string, VA number, expiration timestamp).
  - [ ] Implement Tripay / Midtrans Snap API client in `src/services/payments.service.ts`.
  - [ ] Generate dynamic QRIS QR strings and Virtual Account numbers.
  - [ ] Return unified `CheckoutSessionResponse` for paid flows.

- [ ] **Task 3: Idempotent Payment Webhook (`POST /api/webhooks/payment/route.ts`)**
  - [ ] Extract raw request body and signature header (`X-Callback-Signature` / `signature_key`).
  - [ ] Verify cryptographic HMAC-SHA256 signature against `PAYMENT_GATEWAY_PRIVATE_KEY`.
  - [ ] Log every attempt to `payment_logs` table.
  - [ ] **Idempotency Guard**: If `order.payment_status === 'PAID'`, return `200 OK` immediately.
  - [ ] On `PAID`: Update `orders.payment_status = 'PAID'`, set `paid_at = NOW()`.
  - [ ] If `order_type === 'EVENT_TICKET'`: Activate participant registration and trigger ticket generation.

- [ ] **Task 4: Standalone Marketplace Project Preparation — [Future / Separate Project]**
  - [ ] *Note*: The full marketplace (merch catalog, cart, stock reservation, and donations) is decoupled and moving to a separate standalone project.
  - [ ] Donation form UI on this site is deleted; donations are routed to the separate marketplace project.
  - [ ] Preserve marketplace database schema (`0002_marketplace_and_orders.sql`) and stock reservation RPC logic for seamless extraction into the future marketplace repository.

---

## 3. Pre-Merge Verification
```bash
npx supabase db reset --local   # Migrations must apply cleanly
npm run db:types                # Auto-generate TypeScript definitions
npm run typecheck               # Must compile with 0 errors
```
