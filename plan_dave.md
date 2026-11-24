# AI Implementation Plan: Dave (Frontend Track FE-2)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Dave (Dave Tristian Nurcahyo)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Ken, Sean, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Dave Tristian Nurcahyo (Dave)
- **Email**: `dtristian@student.ciputra.ac.id` | **GitHub**: [@Dave03062006](https://github.com/Dave03062006)
- **Branch Prefix**: `feat/fe-dave-*`
- **Primary Deliverables**:
  1. Registration Zod contract (`src/lib/contracts/registration.contract.ts`): MemberSchema with optional `nimOrInstitution`, paid Webinar, paid YCR individual, and paid YCR group schemas.
  2. Context-aware Paid Registration Form (`src/components/registration/RegistrationForm.tsx`): switches between Paid Webinar (before `YCR_OPENS_AT`) and Paid YCR (on/after `YCR_OPENS_AT`), supports Individual vs Group (dynamic member rows), optional `nimOrInstitution`, integrated payment method selection (`PaidMethodSchema`), and live tiered pricing calculation referencing `src/lib/constants.ts`.
  3. Client-side mock registration submission (`src/app/mock-registration.ts`): returns mock `CheckoutSessionResponse`.
  4. Cleanup: Delete `/donate` route (`src/app/donate/`) and `src/components/donation/` (public donations will eventually merge into the marketplace checkout flow).
  5. Committee Admin dashboard (`/admin`) — **[x] DONE**.
  6. Mobile Camera QR Gate Scanner (`/admin/scan`) — **[x] DONE**.
  7. Official Marketplace Catalog, Cart Drawer, and Payment Modal (`/marketplace`) — **[x] DONE (Active & Retained)**: Dave's completed marketplace storefront is celebrated, valued, and retained in this repository as an active first-class page!

### Allowed Files & Directories (READ & WRITE)
- `src/lib/contracts/registration.contract.ts`
- `src/components/registration/` (`RegistrationForm.tsx`, `WebinarForm.tsx`, `YcrForm.tsx`, `PriceSummary.tsx`)
- `src/app/mock-registration.ts`
- `src/app/marketplace/` (Active, retained first-class official merch store)
- `src/components/marketplace/` (Active, retained merch catalog, CartDrawer, PaymentModal)
- `src/app/admin/` (Completed admin dashboard)
- `src/components/admin/` (Completed admin components)
- `src/app/donate/` *(Marked for deletion)*
- `src/components/donation/` *(Marked for deletion)*

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/components/timeline/**`, `src/components/layout/**` *(Owned by Ken)*
- `supabase/**` *(Owned by Sean & Keane)*
- `src/services/**`, `src/app/api/**` *(Owned by Sean & Keane)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/constants.ts` (Single source of truth for dates, base prices, and discount tiers)
2. `src/lib/contracts/common.contract.ts` (Shared field validators: WhatsApp regex, PaidMethodSchema)
3. `src/lib/contracts/payments.contract.ts` (`CheckoutSessionResponse`)
4. `src/lib/contracts/admin.contract.ts` (Admin check-in and attendee schemas)
5. `src/app/tokens.css` & `docs/DESIGN.md` (Sunlit Highway design tokens)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Registration Zod Contract (`src/lib/contracts/registration.contract.ts`)**
  - [ ] Define and export `MemberSchema` with optional `nimOrInstitution`:
    ```ts
    import { z } from 'zod';
    import { WhatsappSchema, PaidMethodSchema } from './common.contract';

    export const MemberSchema = z.object({
      fullName: z.string().min(3).max(100),
      email: z.email(),
      whatsapp: WhatsappSchema,
      nimOrInstitution: z.string().max(100).optional(),
    });
    export type Member = z.infer<typeof MemberSchema>;
    ```
  - [ ] Define and export `CreateWebinarRegistrationSchema` (PAID - Rp 50.000 placeholder):
    ```ts
    export const CreateWebinarRegistrationSchema = z.object({
      member: MemberSchema,
      paymentMethod: PaidMethodSchema,
    });
    export type CreateWebinarRegistrationInput = z.infer<typeof CreateWebinarRegistrationSchema>;
    ```
  - [ ] Define and export `CreateYcrRegistrationSchema` (PAID - Rp 150.000 placeholder):
    ```ts
    export const CreateYcrRegistrationSchema = z.object({
      member: MemberSchema,
      paymentMethod: PaidMethodSchema,
    });
    export type CreateYcrRegistrationInput = z.infer<typeof CreateYcrRegistrationSchema>;
    ```
  - [ ] Define and export `CreateYcrGroupSchema` (PAID - Tiered volume pricing):
    ```ts
    export const CreateYcrGroupSchema = z.object({
      members: z.array(MemberSchema).min(1),
      paymentMethod: PaidMethodSchema,
    });
    export type CreateYcrGroupInput = z.infer<typeof CreateYcrGroupSchema>;
    ```
  - [ ] Export inferred TypeScript types for all registration schemas.

- [ ] **Task 2: Context-Aware Paid Registration Form (`src/components/registration/RegistrationForm.tsx`)**
  - [ ] Import constants from `src/lib/constants.ts` (`YCR_OPENS_AT`, `PRICE_WEBINAR_IDR`, `PRICE_YCR_INDIVIDUAL_IDR`, `DISCOUNT_TIER_5`, `DISCOUNT_TIER_10`).
  - [ ] Implement context-aware form switcher based on current time vs `YCR_OPENS_AT`:
    - Before `YCR_OPENS_AT`: Render Webinar registration form (individual only).
    - After `YCR_OPENS_AT`: Render YCR registration form with Individual / Group toggle.
  - [ ] **Webinar Form (PAID - Rp 50.000)**:
    - Input fields: Full Name, Email, WhatsApp number, optional NIM / Institution (`nimOrInstitution`).
    - Payment method selector (`PaidMethodSchema`: QRIS, BCAVA, BRIVA, BNIVA, MANDIRIVA).
    - Display price badge: `Rp 50.000`.
    - Validated by `CreateWebinarRegistrationSchema`.
    - On submit, triggers checkout session via payment gateway / mock handler.
  - [ ] **YCR Form (PAID - Individual vs Group)**:
    - Pill toggle selector: "Individual" vs "Group".
    - *Individual Mode*:
      - Member fields: Full Name, Email, WhatsApp, optional `nimOrInstitution`.
      - Base price: `PRICE_YCR_INDIVIDUAL_IDR` (Rp 150.000).
      - Payment method selector (`PaidMethodSchema`).
      - Validated by `CreateYcrRegistrationSchema`.
    - *Group Mode*:
      - Leader row (Member 1): Full Name, Email, WhatsApp, optional `nimOrInstitution`.
      - "Add Member" button to append new member input rows dynamically (Full Name, Email, WhatsApp, optional `nimOrInstitution`).
      - Remove button (`×`) on each appended member row to delete.
      - Payment method selector (`PaidMethodSchema`).
      - Validated by `CreateYcrGroupSchema`.
  - [ ] **Live Tiered Price Calculator (YCR Registration)**:
    - Calculate and display live price summary dynamically using `src/lib/constants.ts`:
      - 1–4 people: `PRICE_YCR_INDIVIDUAL_IDR` = Rp 150.000 / person
      - 5–9 people: 10% discount (`DISCOUNT_TIER_5`) $\rightarrow$ Rp 135.000 / person
      - ≥10 people: 20% discount (`DISCOUNT_TIER_10`) $\rightarrow$ Rp 120.000 / person
      - Live subtotal, discount, and grand total recalculate dynamically as members are added or removed.
  - [ ] Connect form submission to mock submit handler in `src/app/mock-registration.ts` with loading state, payment modal display, and success feedback.

- [ ] **Task 3: Client Mock Registration Handler (`src/app/mock-registration.ts`)**
  - [ ] Implement mock submission function handling both Webinar and YCR payloads.
  - [ ] Simulate network delay (`500ms`) and return mock `CheckoutSessionResponse` (with `orderCode`, `paymentStatus: 'PENDING'`, `amountTotalIdr`, and mock QRIS URL or VA number).

- [ ] **Task 4: Delete `/donate` Route & Components (Scope Cleanup)**
  - [ ] Delete `src/app/donate/` route directory (`page.tsx`, `mock-donation.ts`).
  - [ ] Delete `src/components/donation/` directory (`DonationForm.tsx`, `amount.ts`, `amount.test.mjs`).
  - [ ] Note: Public donations will eventually be merged into the marketplace flow.

- [x] **Task 5: Official Marketplace Catalog & Payment Modal (`src/app/marketplace/`) — [DONE / RETAINED]**
  - [x] Marketplace catalog, Category Filter, Cart Drawer (`CartDrawer.tsx`), and Payment Modal (`PaymentModal.tsx`) completed.
  - [x] Retained in repository as an active, first-class route (`/marketplace`).

- [x] **Task 6: Committee Admin Dashboard (`src/app/admin/page.tsx`) — [DONE]**
  - [x] KPI Summary cards: Total Revenue, Total Registrations, Merch Sold, Total Checked In.
  - [x] Filterable orders and participants table with search by name/order code (`AdminTables.tsx`).
  - [x] 1-Click "Export to CSV" button (`report.ts`).

- [x] **Task 7: Mobile Camera QR Gate Scanner (`src/app/admin/scan/page.tsx`) — [DONE]**
  - [x] Camera QR code scanner integration (`GateScanner.tsx`).
  - [x] On QR scan: Send `ticket_code` to verification service / mock check-in (`mock-check-in.ts`).
  - [x] Visual & audio feedback: Green card for valid ticket, Red alert for duplicate scan (`ALREADY_CHECKED_IN`).

---

## 3. Pre-Merge Verification
```bash
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings
```
