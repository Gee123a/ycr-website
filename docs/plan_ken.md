# AI Implementation Plan: Ken (Frontend Track FE-1)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Ken (Kenneth Jonathan Halim)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Dave, Sean, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Kenneth Jonathan Halim (Ken)
- **Email**: `kjonathan08@student.ciputra.ac.id` | **GitHub**: [@Kiyono-kouji](https://github.com/Kiyono-kouji)
- **Branch Prefix**: `feat/fe-ken-*`
- **Primary Deliverables**:
  1. Shared UI layout, header, and mobile navigation.
  2. Flagship YCR landing page (`/`) and multi-event hub (`/events/[slug]`).
  3. Registration form page (`/events/[slug]/register`).
  4. Scannable Digital QR E-Ticket page (`/tickets/[code]`).
  5. Event Timeline & rundown page (`/timeline`).

### Allowed Files & Directories (READ & WRITE)
- `src/app/(public)/`
- `src/app/events/`
- `src/app/tickets/`
- `src/app/timeline/`
- `src/components/events/`
- `src/components/timeline/`
- `src/components/layout/`
- `src/components/ui/` (shared shadcn/ui components)

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/marketplace/**`, `src/app/donate/**`, `src/app/admin/**` *(Owned by Dave)*
- `src/components/marketplace/**`, `src/components/donation/**`, `src/components/admin/**` *(Owned by Dave)*
- `supabase/**` *(Owned by Sean & Keane)*
- `src/services/**`, `src/app/api/**` *(Owned by Sean & Keane)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/contracts/events.contract.ts` (Registration Zod schemas & types)
2. `src/lib/contracts/timeline.contract.ts` (Timeline response shapes)
3. `src/app/tokens.css` (Sunlit Highway CSS design tokens)
4. `docs/DESIGN.md` (Design system guidelines: Lilita One headings, Nunito body)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Shared Shell & Navigation (`src/components/layout/`)**
  - [ ] Build responsive navbar with YCR logo, links (`Events`, `Marketplace`, `Donate`, `Timeline`), and mobile hamburger drawer.
  - [ ] Build footer with UKM KMK Universitas Ciputra branding, Instagram link, and campus address.
  - [ ] Ensure tap targets are at least `44x44px` on mobile.

- [ ] **Task 2: Flagship Landing Page (`src/app/(public)/page.tsx`)**
  - [ ] Build Hero section with "The Highway" visual theme, event dates, and dynamic countdown timer.
  - [ ] Build Event Overview grid highlighting YCR flagship and sub-events (Heart, Ziarah, Baksos).
  - [ ] Build Speakers & Worship Leaders showcase card grid.
  - [ ] Build FAQ accordion component using shadcn/ui.

- [ ] **Task 3: Dynamic Event Hub (`src/app/events/[slug]/page.tsx`)**
  - [ ] Fetch and display event details for `ycr`, `heart`, `ziarah`, and `baksos`.
  - [ ] Display ticket tiers (Early Bird, Regular, VIP) with live quota badges.
  - [ ] Add prominent "Register Now" CTA linking to registration flow.

- [ ] **Task 4: Registration Flow (`src/app/events/[slug]/register/page.tsx`)**
  - [ ] Build multi-step or single-page mobile form validated by `CreateRegistrationSchema` (`react-hook-form` + `@hookform/resolvers/zod`).
  - [ ] Fields: Full Name, NIM / Institution, Email, WhatsApp number, Ticket Tier selector, Payment Method selector (`FREE` vs `QRIS` vs `VA`).
  - [ ] Connect form submission to mock function returning `CheckoutSessionResponse`.
  - [ ] If free: immediately redirect to `/tickets/[code]`. If paid: trigger payment modal trigger.

- [ ] **Task 5: Digital QR E-Ticket View (`src/app/tickets/[code]/page.tsx`)**
  - [ ] Render ticket details: Event title, participant name, tier name, and check-in status badge (`UNCHECKED` vs `CHECKED_IN`).
  - [ ] Render scannable QR code via `qrcode.react` encoding `ticket_code`.
  - [ ] Add "Download E-Ticket Image" button using HTML5 canvas / DOM screenshot.

- [ ] **Task 6: Event Timeline (`src/app/timeline/page.tsx`)**
  - [ ] Build vertical chronological milestone timeline for key event milestones.
  - [ ] Build optional D-Day rundown section (flagged as tentative).

---

## 3. Pre-Merge Verification
```bash
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings
```
