# AI Implementation Plan: Dave (Frontend Track FE-2)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Dave (Dave Tristian Nurcahyo)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Ken, Sean, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Dave Tristian Nurcahyo (Dave)
- **Email**: `dtristian@student.ciputra.ac.id` | **GitHub**: [@Dave03062006](https://github.com/Dave03062006)
- **Branch Prefix**: `feat/fe-dave-*`
- **Primary Deliverables**:
  1. YCR Marketplace catalog storefront (`/marketplace`).
  2. Persistent Cart Drawer with variant & quantity management.
  3. Embedded QRIS / Virtual Account checkout modal.
  4. Donation page (`/donate`).
  5. Committee Admin dashboard (`/admin`) and mobile camera QR Gate Scanner (`/admin/scan`).

### Allowed Files & Directories (READ & WRITE)
- `src/app/marketplace/`
- `src/app/donate/`
- `src/app/admin/`
- `src/components/marketplace/`
- `src/components/donation/`
- `src/components/admin/`

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/app/events/**`, `src/app/tickets/**`, `src/app/timeline/**` *(Owned by Ken)*
- `src/components/events/**`, `src/components/timeline/**`, `src/components/layout/**` *(Owned by Ken)*
- `supabase/**` *(Owned by Sean & Keane)*
- `src/services/**`, `src/app/api/**` *(Owned by Sean & Keane)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/contracts/marketplace.contract.ts` (`CreateMarketplaceOrderSchema`)
2. `src/lib/contracts/donations.contract.ts` (`CreateDonationSchema`)
3. `src/lib/contracts/payments.contract.ts` (`CheckoutSessionResponse`)
4. `src/app/tokens.css` & `docs/DESIGN.md` (Sunlit Highway design tokens)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Marketplace Catalog (`src/app/marketplace/`)**
  - [ ] Build category filter tabs (`ALL`, `MERCH`, `FNB`, `BUNDLE`).
  - [ ] Render product cards with image, price in IDR, variant tags (S/M/L/XL), and real-time stock badge.
  - [ ] Wire "Add to Cart" button with instant feedback toast.

- [ ] **Task 2: Persistent Cart Drawer (`src/components/marketplace/CartDrawer.tsx`)**
  - [ ] Store cart state in `localStorage` (`items`, `quantities`, `variants`).
  - [ ] Calculate subtotal, dynamic order summary, and empty state.
  - [ ] Validate checkout form inputs (Buyer Name, WhatsApp, Email, Payment Method) using `CreateMarketplaceOrderSchema`.

- [ ] **Task 3: Embedded Payment Modal (`src/components/marketplace/PaymentModal.tsx`)**
  - [ ] Accept `CheckoutSessionResponse` from backend.
  - [ ] If QRIS: Display QR code image with 15-minute countdown timer and "Save QR Image" button.
  - [ ] If Virtual Account: Display bank name, copyable VA number with 1-click copy button, and payment instructions.
  - [ ] Subscribe to Supabase Realtime `orders` channel to detect `payment_status === 'PAID'` and auto-transition to success view.

- [ ] **Task 4: Donation Page (`src/app/donate/page.tsx`)**
  - [ ] Preset donation amount chips (`Rp 25.000`, `Rp 50.000`, `Rp 100.000`, `Custom`).
  - [ ] Donor info inputs (Name / Anonymous, Prayer Intention / Pesan Doa).
  - [ ] Reuse the embedded Payment Modal for instant QRIS checkout.

- [ ] **Task 5: Committee Admin Dashboard (`src/app/admin/page.tsx`)**
  - [ ] KPI Summary cards: Total Revenue, Total Registrations, Merch Sold, Total Checked In.
  - [ ] Filterable orders and participants table with search by name/order code.
  - [ ] 1-Click "Export to CSV" button.

- [ ] **Task 6: Mobile Camera QR Gate Scanner (`src/app/admin/scan/page.tsx`)**
  - [ ] Integrate `@yudiel/react-qr-scanner` or `html5-qrcode` accessing device camera.
  - [ ] On QR scan: Send `ticket_code` to verification service.
  - [ ] Visual & audio feedback: Green card for valid ticket, Red alert for duplicate scan (`ALREADY_CHECKED_IN`).

---

## 3. Pre-Merge Verification
```bash
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings
```
