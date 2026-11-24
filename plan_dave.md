# AI Implementation Plan: Dave (Frontend Track FE-2)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Dave (Dave Tristian Nurcahyo)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Ken, Sean, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Dave Tristian Nurcahyo (Dave)
- **Email**: `dtristian@student.ciputra.ac.id` | **GitHub**: [@Dave03062006](https://github.com/Dave03062006)
- **Branch Prefix**: `feat/fe-dave-*`
- **Primary Deliverables**:
  1. Registration Zod contract (`src/lib/contracts/registration.contract.ts`).
  2. Context-aware Registration Form (`src/components/registration/RegistrationForm.tsx`): switches between Webinar (before `YCR_OPENS_AT`) and YCR (after `YCR_OPENS_AT`), supports Individual vs Group (dynamic member rows), and live tiered pricing calculation.
  3. Client-side mock registration submission (`src/app/mock-registration.ts`).
  4. Cleanup: Delete `/donate` route (`src/app/donate/`) and `src/components/donation/` (donations moved to separate marketplace project).
  5. Committee Admin dashboard (`/admin`) — **[x] DONE**.
  6. Mobile Camera QR Gate Scanner (`/admin/scan`) — **[x] DONE**.
  7. Marketplace catalog, Cart Drawer, and Payment Modal (`/marketplace`) — **[x] DONE** (retained in codebase; `/marketplace` is a placeholder/stub for this site, separate project).

### Allowed Files & Directories (READ & WRITE)
- `src/lib/contracts/registration.contract.ts`
- `src/components/registration/` (`RegistrationForm.tsx`, etc.)
- `src/app/mock-registration.ts`
- `src/app/admin/` (Completed admin dashboard)
- `src/components/admin/` (Completed admin components)
- `src/app/marketplace/` (Completed / retained stub)
- `src/components/marketplace/` (Completed / retained components)
- `src/app/donate/` *(Marked for deletion)*
- `src/components/donation/` *(Marked for deletion)*

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/components/timeline/**`, `src/components/layout/**` *(Owned by Ken)*
- `supabase/**` *(Owned by Sean & Keane)*
- `src/services/**`, `src/app/api/**` *(Owned by Sean & Keane)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/contracts/registration.contract.ts` (Member, Webinar, and YCR Zod schemas)
2. `src/lib/contracts/common.contract.ts` (Shared field validators: WhatsApp regex, PaidMethodSchema)
3. `src/lib/contracts/admin.contract.ts` (Admin check-in and attendee schemas)
4. `src/app/tokens.css` & `docs/DESIGN.md` (Sunlit Highway design tokens)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Registration Zod Contract (`src/lib/contracts/registration.contract.ts`)**
  - [ ] Define and export `MemberSchema`:
    ```ts
    export const MemberSchema = z.object({
      fullName: z.string().min(3).max(100),
      email: z.string().email(),
      whatsapp: WhatsappSchema,
    });
    ```
  - [ ] Define and export `CreateWebinarRegistrationSchema`:
    ```ts
    export const CreateWebinarRegistrationSchema = z.object({
      fullName: z.string().min(3).max(100),
      email: z.string().email(),
      whatsapp: WhatsappSchema,
    });
    ```
  - [ ] Define and export `CreateYcrRegistrationSchema`:
    ```ts
    export const CreateYcrRegistrationSchema = z.object({
      member: MemberSchema,
      paymentMethod: PaidMethodSchema,
    });
    ```
  - [ ] Define and export `CreateYcrGroupSchema`:
    ```ts
    export const CreateYcrGroupSchema = z.object({
      members: z.array(MemberSchema).min(1),
      paymentMethod: PaidMethodSchema,
    });
    ```
  - [ ] Export inferred TypeScript types for all registration schemas.

- [ ] **Task 2: Context-Aware Registration Form (`src/components/registration/RegistrationForm.tsx`)**
  - [ ] Implement context-aware form switcher based on current time vs `YCR_OPENS_AT`:
    - Before `YCR_OPENS_AT`: Render Webinar registration form (individual only).
    - After `YCR_OPENS_AT`: Render YCR registration form with Individual / Group toggle.
  - [ ] **Webinar Form (Individual only)**:
    - Input fields: Full Name, Email, WhatsApp number.
    - Validated by `CreateWebinarRegistrationSchema`.
  - [ ] **YCR Form (Individual vs Group)**:
    - Pill toggle selector: "Individual" vs "Group".
    - *Individual Mode*: Leader fields (Full Name, Email, WhatsApp) + Payment method selector (PaidMethodSchema).
    - *Group Mode*:
      - Leader row (Full Name, Email, WhatsApp).
      - "Add Member" button to append new member input rows dynamically.
      - Remove button (`×`) on each appended member row to delete.
      - Payment method selector (`PaidMethodSchema`).
  - [ ] **Live Tiered Price Calculator (YCR Registration)**:
    - Calculate and display live price summary dynamically:
      - 1–4 people: Rp 150.000 / person
      - 5–9 people: Rp 135.000 / person (10% discount)
      - ≥10 people: Rp 120.000 / person (20% discount)
      - Total = `count × unit price`, updating instantly as rows are added/removed.
  - [ ] Connect form submission to mock submit handler in `src/app/mock-registration.ts` with loading state and success feedback.

- [ ] **Task 3: Client Mock Registration Handler (`src/app/mock-registration.ts`)**
  - [ ] Implement mock submission function handling both Webinar and YCR payloads.
  - [ ] Simulate network delay (`500ms`) and return mock registration response with generated registration ID / confirmation code.

- [ ] **Task 4: Delete `/donate` Route & Components (Scope Cleanup)**
  - [ ] Delete `src/app/donate/` route directory (`page.tsx`, `mock-donation.ts`).
  - [ ] Delete `src/components/donation/` directory (`DonationForm.tsx`, `amount.ts`, `amount.test.mjs`).
  - [ ] Note: Donations are handled via the separate marketplace project.

- [x] **Task 5: Committee Admin Dashboard (`src/app/admin/page.tsx`) — [DONE]**
  - [x] KPI Summary cards: Total Revenue, Total Registrations, Merch Sold, Total Checked In.
  - [x] Filterable orders and participants table with search by name/order code (`AdminTables.tsx`).
  - [x] 1-Click "Export to CSV" button (`report.ts`).

- [x] **Task 6: Mobile Camera QR Gate Scanner (`src/app/admin/scan/page.tsx`) — [DONE]**
  - [x] Camera QR code scanner integration (`GateScanner.tsx`).
  - [x] On QR scan: Send `ticket_code` to verification service / mock check-in (`mock-check-in.ts`).
  - [x] Visual & audio feedback: Green card for valid ticket, Red alert for duplicate scan (`ALREADY_CHECKED_IN`).

- [x] **Task 7: Marketplace Catalog & Payment Modal (`src/app/marketplace/`) — [DONE]**
  - [x] Marketplace catalog, Cart Drawer, and Payment Modal completed (`src/components/marketplace/`).
  - [x] Code remains in repository; `/marketplace` is retained as a placeholder/stub route (marketplace is a future separate project).

---

## 3. Pre-Merge Verification
```bash
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings
```
