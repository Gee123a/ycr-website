# AI Implementation Plan: Keane (Backend Track BE-2)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Keane (Keane Juan Suryanto)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Ken, Dave, or Sean to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Keane Juan Suryanto (Keane)
- **Email**: `ksuryanto@student.ciputra.ac.id` | **GitHub**: [@Kenn-jpg](https://github.com/Kenn-jpg)
- **Branch Prefix**: `feat/be-keane-*`
- **Primary Deliverables**:
  1. Supabase PostgreSQL migrations for marketplace products, orders, order items, and payment logs.
  2. Atomic PostgreSQL RPC `create_marketplace_order` with 15-minute stock reservation.
  3. Tripay / Midtrans payment gateway client and invoice generation.
  4. Cryptographic HMAC-SHA256 signature verification and idempotent payment webhook (`POST /api/webhooks/payment`).
  5. Automatic stock release cron/routine for expired or failed orders.

### Allowed Files & Directories (READ & WRITE)
- `supabase/migrations/0002_marketplace_and_orders.sql`
- `supabase/migrations/0005_donations.sql`
- `src/services/orders.service.ts`
- `src/services/donations.service.ts`
- `src/services/payments.service.ts`
- `src/app/api/webhooks/payment/route.ts`

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/app/events/**`, `src/app/marketplace/**`, `src/app/admin/**` *(Owned by Ken & Dave)*
- `src/components/**` *(Owned by Ken & Dave)*
- `supabase/migrations/0001_*`, `0003_*`, `0004_*`, `0006_*` *(Owned by Sean)*
- `src/services/events.service.ts`, `src/services/registrations.service.ts`, `src/middleware.ts` *(Owned by Sean)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/contracts/marketplace.contract.ts`
2. `src/lib/contracts/donations.contract.ts`
3. `src/lib/contracts/payments.contract.ts` (`CheckoutSessionResponse`)
4. `docs/ARCHITECTURE.md` (Sections 3 & 5: Orders ERD, RLS matrix, and Webhook security rules)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Marketplace & Orders Migration (`0002_marketplace_and_orders.sql`)**
  - [ ] Create `products` table (`id`, `slug`, `name`, `category`, `price_idr`, `stock_available`, `image_url`, `is_active`).
  - [ ] Create `orders` table (`id`, `order_code`, `order_type`, `buyer_name`, `buyer_email`, `buyer_whatsapp`, `amount_subtotal_idr`, `amount_fee_idr`, `amount_total_idr`, `payment_method`, `payment_reference`, `payment_qr_or_va`, `payment_status`, `expires_at`, `paid_at`).
  - [ ] Create `order_items` table (`id`, `order_id`, `product_id`, `variant_label`, `quantity`, `unit_price_idr`).
  - [ ] Create `payment_logs` table (`id`, `order_id`, `raw_payload`, `signature_header`, `is_valid_signature`, `received_at`).
  - [ ] Enable RLS on all tables with `service_role` write lock on payment fields.

- [ ] **Task 2: Atomic 15-Minute Stock Reservation RPC (`create_marketplace_order`)**
  - [ ] Implement PostgreSQL RPC function accepting order items array.
  - [ ] Lock each product row via `SELECT stock_available FROM products WHERE id = p_id FOR UPDATE`.
  - [ ] Verify `stock_available >= quantity` for all items; raise exception if insufficient.
  - [ ] Deduct inventory atomically (`stock_available = stock_available - quantity`).
  - [ ] Insert `orders` record with `payment_status = 'PENDING'` and `expires_at = NOW() + INTERVAL '15 minutes'`.
  - [ ] Return generated `order_code` and total amount.

- [ ] **Task 3: Donations Migration & Service (`0005_donations.sql`, `donations.service.ts`)**
  - [ ] Add `DONATION` to `order_type` enum.
  - [ ] Create `donations` table (`id`, `order_id`, `donor_name`, `is_anonymous`, `prayer_intention`).
  - [ ] Implement `createDonationOrder` returning `CheckoutSessionResponse`.

- [ ] **Task 4: Payment Gateway Client (`src/services/payments.service.ts`)**
  - [ ] Implement Tripay / Midtrans Snap API client.
  - [ ] Generate QRIS dynamic QR string / Virtual Account number.
  - [ ] Construct unified `CheckoutSessionResponse` (QR URL, VA number, 15-minute expiration timestamp).

- [ ] **Task 5: Idempotent Payment Webhook (`POST /api/webhooks/payment/route.ts`)**
  - [ ] Extract raw request body and signature header (`X-Callback-Signature` / `signature_key`).
  - [ ] Verify cryptographic HMAC-SHA256 signature against `PAYMENT_GATEWAY_PRIVATE_KEY`.
  - [ ] Log every attempt to `payment_logs` table.
  - [ ] **Idempotency Guard**: If `order.payment_status === 'PAID'`, return `200 OK` immediately.
  - [ ] On `PAID`: Update `orders.payment_status = 'PAID'`, set `paid_at = NOW()`.
  - [ ] On `EXPIRED` or `FAILED`: Automatically return reserved quantities back to `products.stock_available`.
  - [ ] If `order_type === 'EVENT_TICKET'`: Activate participant registration.

---

## 3. Pre-Merge Verification
```bash
npx supabase db reset --local   # Migrations must apply cleanly
npm run db:types                # Auto-generate TypeScript definitions
npm run typecheck               # Must compile with 0 errors
```
