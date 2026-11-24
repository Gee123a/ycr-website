# Product Requirements Document (PRD) — YCR ("The Highway") & KMK Web Platform

| Field | Details |
| :--- | :--- |
| **Organization** | UKM Keluarga Mahasiswa Katolik (KMK) — Universitas Ciputra |
| **Division** | PDD Website (Production, Documentation, and Development) |
| **Events Covered** | **Baksos**, **Ziarah**, **Webinar**, **Youth Catholic Revival (YCR — "The Highway")** |
| **Coordinator** | **Gee** — oversees all tracks, owns scope, schedule, and ownership rules |
| **Frontend Team** | **Ken** (FE-1: Timeline Bar, D-Day Hero Centerpiece & Homepage), **Dave** (FE-2: Registration Form, Marketplace & Admin) — *Next.js* |
| **Backend Team** | **Sean** (BE-1: Schema, Auth, Events & Timeline), **Keane** (BE-2: Orders, Payments & Webhooks) — *Supabase* |
| **Target Scale** | 50 Concurrent Users / 100 Peak Concurrent Users (85%+ Mobile Traffic) |

---

## 1. Product Vision & Scope

Build a streamlined, mobile-first web platform (`*.site`) for UKM KMK Universitas Ciputra. The web platform delivers a focused, multi-page visitor and attendee experience centered around the Highway journey, official merchandise, and committee operations:

1. **Expanding Timeline Bar & D-Day Showcase Stage**:
   - **Pre-D-Day**: A sticky progress bar at the top of the viewport guiding visitors through the sequence of KMK events (**Baksos**, **Ziarah**, **Webinar**, **YCR**).
   - **On D-Day (`Date.now() >= YCR_DATE_MIDNIGHT`)**: The timeline expands significantly from a simple top bar into the **primary visual hero focus of the page** (an expanded live Rundown Showcase stage with prominent session cards, live time indicator, speakers, and room locations). The registration form steps down into a secondary role (or displays "Registration Closed / Today's Live Event").
2. **Context-Aware Paid Registration Form**:
   - The unified registration form on the homepage automatically adapts to the current date—presenting either the **Webinar** registration or the **YCR** registration (with individual/group toggles and live tiered pricing).
   - **Both Webinar and YCR are PAID events** (Webinar: Rp 50.000 placeholder; YCR Individual: Rp 150.000 placeholder) and trigger checkout sessions via the payment gateway.
   - `nimOrInstitution` (NIM / School / Institution) is supported as an optional field on all member registrations.
3. **Official Marketplace (`/marketplace`)**:
   - Dave's completed work is retained as an **active, first-class page** in this repository. It features the official merch catalog, category filters, a persistent cart drawer, and a direct checkout modal.

### Route Architecture
- **`/` (Main Event Landing)**: Contains the Sticky Timeline Bar (which expands into the Hero Rundown Showcase stage on D-Day) and the Context-Aware Registration Form.
- **`/marketplace` (Official Merchandise Store)**: Active first-class page containing the official merchandise catalog, persistent cart drawer, and payment modal (Dave's completed work is retained and valued!).
- **`/admin` & `/admin/scan`**: Dedicated committee portal for registration tracking, KPIs, CSV export, and gate QR check-in (Dave's completed work is preserved).
- **`/donate` (DELETED)**: Dedicated donation route is removed from this site. Public donations will eventually merge into the marketplace flow. Backend Zod schemas and tables are retained for backend engineering.

---

## 2. Core Functional Modules & Ownership

### Module A: Expanding Timeline Bar & D-Day Showcase Stage (`Owner: Ken [FE] + Sean [BE]`)
- **Pinned Top Bar (Pre-D-Day Mode)**:
  - Full-width horizontal bar pinned at the top of the homepage (sticky on scroll).
  - A connecting progress line links circular nodes horizontally from left to right.
  - Chronological event sequence: **Baksos** $\rightarrow$ **Ziarah** $\rightarrow$ **Webinar** $\rightarrow$ **YCR**.
- **Node Visual States**:
  - `PAST`: Filled green circle indicating completed milestones.
  - `NOW`: Pulsing gold circle highlighting the currently active milestone.
  - `UPCOMING`: Hollow circle with border for future events.
- **Interactive States**:
  - **Hover**: Tooltip with a 1-line summary displaying event title and date.
  - **Click**: Modal popup (`TimelineModal.tsx`) showing full event details (title, date, venue, description).
- **D-Day Hero Transformation (Automatic Switch)**:
  - On and after YCR's event date (auto-detected at midnight by `Date.now() >= YCR_DATE_MIDNIGHT` via `src/lib/constants.ts`):
  - The timeline expands significantly from a simple top bar into the **primary visual hero focus of the page**.
  - Renders an expanded live **Rundown Showcase stage** featuring prominent session cards, live time indicator ("HAPPENING NOW"), speaker highlights, and room/stage locations.
  - The registration form steps down into a secondary role below the rundown (or displays "Registration Closed / Today's Live Event").

### Module B: Context-Aware Registration Form (`Owner: Dave [FE] + Sean/Keane [BE]`)
- **Single Source of Truth Constants**:
  - Date thresholds and prices are imported strictly from `src/lib/constants.ts` (`YCR_OPENS_AT`, `YCR_DATE_MIDNIGHT`, `PRICE_WEBINAR_IDR = 50_000`, `PRICE_YCR_INDIVIDUAL_IDR = 150_000`, `DISCOUNT_TIER_5 = 0.10`, `DISCOUNT_TIER_10 = 0.20`).
- **Date-Aware Form Switching**:
  - **Before `YCR_OPENS_AT`**: Displays the **Webinar** registration form.
  - **On/After `YCR_OPENS_AT`**: Displays the **YCR ("The Highway")** registration form.
- **Webinar Registration Form (PAID)**:
  - Individual participant registration (Rp 50.000 placeholder).
  - Member fields: Full Name, Email, WhatsApp number, and optional `nimOrInstitution`.
  - Payment method selector (`PaidMethodSchema`: QRIS, BCAVA, BRIVA, BNIVA, MANDIRIVA).
  - Form submission triggers a checkout session via Tripay/Midtrans Snap.
- **YCR Registration Form (PAID)**:
  - Pill selector toggle between **Individual** and **Group** registration.
  - **Individual Mode**:
    - Member fields: Full Name, Email, WhatsApp number, optional `nimOrInstitution`.
    - Base price: Rp 150.000 (placeholder from `PRICE_YCR_INDIVIDUAL_IDR`).
    - Payment method selector (`PaidMethodSchema`).
    - Triggers checkout session via payment gateway.
  - **Group Mode**:
    - Leader row (Member 1): Full Name, Email, WhatsApp, optional `nimOrInstitution`.
    - "Add Member" button dynamically appends member rows (Full Name, Email, WhatsApp, optional `nimOrInstitution` each).
    - Remove button (`×`) on each additional member row.
    - Payment method selector (`PaidMethodSchema`).
  - **Live Tiered Price Summary**:
    - Positioned at the bottom of the YCR registration form.
    - 1–4 participants: Rp 150.000 / person (`PRICE_YCR_INDIVIDUAL_IDR`).
    - 5–9 participants: 10% discount (`DISCOUNT_TIER_5` = 0.10) $\rightarrow$ Rp 135.000 / person.
    - $\ge$ 10 participants: 20% discount (`DISCOUNT_TIER_10` = 0.20) $\rightarrow$ Rp 120.000 / person.
    - Live subtotal, discount, and grand total recalculate dynamically as members are added or removed.

### Module C: YCR Official Marketplace (`Owner: Dave [FE] + Keane [BE]`) — Active Page
- **First-Class `/marketplace` Route**:
  - Dave's completed marketplace work is retained and fully integrated in this repository.
  - Features:
    - Official YCR merch catalog (T-shirts, hoodies, wristbands, lanyard bundles).
    - Category filters and stock badge indicators.
    - Persistent sliding Cart Drawer (`CartDrawer.tsx`) powered by Zustand store.
    - Direct payment checkout modal (`PaymentModal.tsx`) with QRIS & Virtual Account support.
  - Public donations will eventually be merged into this marketplace checkout flow.

### Module D: Payment Gateway & Webhook Engine (`Owner: Dave [FE] + Keane [BE]`)
- **Embedded Payment Modal**:
  - Handles payment for paid registrations (both Webinar and YCR) and marketplace merchandise via **Tripay** or **Midtrans Snap** (QRIS & Virtual Accounts).
  - Displays dynamic payment instructions and listens for Supabase Realtime payment confirmation.
- **Server-to-Server Webhook (`POST /api/webhooks/payment`)**:
  - Verifies cryptographic HMAC-SHA256 signature from the payment gateway.
  - Transitions order/registration status from `PENDING` $\rightarrow$ `PAID` | `EXPIRED` | `FAILED`.
  - On `PAID`, marks all registered members as confirmed and generates scannable ticket codes.

### Module E: Committee Admin & Gate Scanner (`Owner: Dave [FE] + Sean/Keane [BE]`)
*(Dave's implementation is complete and preserved as-is).*
- **Role-Protected `/admin` Portal** (Supabase Auth):
  - Overview KPI cards: Total Registrations (Webinar & YCR), Total Revenue, Checked-In Count, Merch Sold.
  - Filterable table of registered participants with **1-Click CSV/Excel Export**.
- **Mobile Camera QR Scanner (`/admin/scan`)**:
  - Real-time mobile gate check-in for committee members with instant duplicate scan detection (`ALREADY_CHECKED_IN` warning).

### Module F: Donations (Backend Only / Externalized)
- **`/donate` UI route, donation form, and standalone donation buttons are completely deleted from this website.**
- Public donations will eventually be folded into the marketplace checkout flow.
- The `donations.contract.ts` schema and backend database tables are retained in the codebase for Keane's backend engineering, but are not exposed as a standalone `/donate` page.

---

## 3. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | First Contentful Paint (FCP) < 1.5s on 4G mobile; initial page weight optimized for single-page scroll. |
| **Responsiveness** | Mobile-first architecture (85%+ mobile visitors), minimum 44×44px touch targets on timeline nodes and form buttons. |
| **Data Integrity** | Zod contract validation on both client and server; live group pricing calculations synchronized via `src/lib/constants.ts`. |
| **Concurrency** | Row-level locking (`SELECT ... FOR UPDATE`) in PostgreSQL RPCs to prevent overselling quotas during peak registration windows. |
| **Security** | Supabase Row Level Security (RLS) on all tables; payment status mutations restricted to verified HMAC webhooks. |
| **Reliability** | Idempotent webhook handling; fallback states for offline or degraded payment gateway connections. |
