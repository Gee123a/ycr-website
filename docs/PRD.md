# Product Requirements Document (PRD) — YCR ("The Highway") & KMK Web Platform

| Field | Details |
| :--- | :--- |
| **Organization** | UKM Keluarga Mahasiswa Katolik (KMK) — Universitas Ciputra |
| **Division** | PDD Website (Production, Documentation, and Development) |
| **Events Covered** | **Baksos**, **Ziarah**, **Webinar**, **Youth Catholic Revival (YCR — "The Highway")** |
| **Coordinator** | **Gee** — oversees all tracks, owns scope, schedule, and ownership rules |
| **Frontend Team** | **Ken** (FE-1: Timeline Bar & Homepage), **Dave** (FE-2: Registration Form & Admin) — *Next.js* |
| **Backend Team** | **Sean** (BE-1: Schema, Auth, Events & Timeline), **Keane** (BE-2: Orders, Payments & Webhooks) — *Supabase* |
| **Target Scale** | 50 Concurrent Users / 100 Peak Concurrent Users (85%+ Mobile Traffic) |

---

## 1. Product Vision & Scope

Build a streamlined, mobile-first web platform (`*.site`) for UKM KMK Universitas Ciputra. Under the updated product direction, the public website is simplified to **essentially ONE main page (`/`)**, delivering a high-focus visitor experience:

1. **Sticky Timeline Bar**: Always visible at the top of the viewport, guiding visitors through the sequence of KMK events (**Baksos**, **Ziarah**, **Webinar**, **YCR**) and transitioning automatically into the D-Day event rundown.
2. **Context-Aware Registration Form**: The single, unified form on the website that automatically adapts to the current date—presenting either the **Webinar** registration or the **YCR** registration (with individual/group toggles and live tiered pricing).

### Route Architecture
- **`/` (Main Homepage)**: Contains the Sticky Timeline Bar and the Context-Aware Registration Form.
- **`/admin` & `/admin/scan`**: Dedicated committee portal for registration tracking, KPIs, CSV export, and gate QR check-in (Dave's work is complete and preserved).
- **`/marketplace`**: Kept as a **placeholder / stub route** for a future separate project (not discussed yet).
- **`/donate` (DELETED)**: Donations are removed from this website and will be handled by the marketplace website. No donation forms, buttons, or donation routes exist on this site. (The backend Zod schema is retained for backend engineering).

---

## 2. Core Functional Modules & Ownership

### Module A: Sticky Timeline Bar (`Owner: Ken [FE] + Sean [BE]`)
- **Pinned Top Bar**:
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
- **D-Day Mode (Automatic Switch)**:
  - On and after YCR's event date (auto-detected at midnight by `Date.now() >= YCR_DATE_MIDNIGHT`), the timeline automatically transitions from the 4-event milestones to the **YCR Rundown**.
  - Reuses the same visual horizontal bar, node styling, and interactions, but node data switches to session-by-session schedule items (showing session title, speaker, time, and location).

### Module B: Context-Aware Registration Form (`Owner: Dave [FE] + Sean/Keane [BE]`)
- **Single Form on Site**:
  - Positioned prominently on the homepage below the Sticky Timeline Bar.
  - Context-aware rendering driven by date thresholds:
    - **Before `YCR_OPENS_AT`**: Displays the **Webinar** registration form.
    - **On/After `YCR_OPENS_AT`**: Displays the **YCR ("The Highway")** registration form.
    - *(Dates are defined as centralized constants, updatable without breaking layout).*
- **Webinar Registration Form**:
  - Individual participant registration only.
  - Fields: Full Name, Email, WhatsApp number.
- **YCR Registration Form**:
  - Pill selector toggle between **Individual** and **Group** registration.
  - **Individual Mode**:
    - Fields: Full Name, Email, WhatsApp number.
  - **Group Mode**:
    - Leader row: Full Name, Email, WhatsApp number.
    - "Add Member" button dynamically appends member rows (Full Name, Email, WhatsApp each).
    - Remove button (`×`) on each additional member row.
  - **Live Tiered Price Summary**:
    - Positioned at the bottom of the YCR registration form.
    - 1–4 participants: Rp 150.000 / person (placeholder standard rate).
    - 5–9 participants: Rp 135.000 / person — 10% discount (placeholder).
    - $\ge$ 10 participants: Rp 120.000 / person — 20% discount (placeholder).
    - Live subtotal, discount, and grand total recalculate dynamically as members are added or removed.

### Module C: YCR Marketplace (`Owner: Dave [FE] + Keane [BE]`) — Placeholder
- `/marketplace` route is preserved as a placeholder/stub for a future separate project.
- Merch pre-orders, cart drawer, and catalog are out of scope for the current single-page website and deferred to the future marketplace project.

### Module D: Payment Gateway & Webhook Engine (`Owner: Dave [FE] + Keane [BE]`)
- **Embedded Payment Modal**:
  - Handles payment for paid YCR registrations via **Tripay** or **Midtrans Snap** (QRIS & Virtual Accounts).
  - Displays dynamic payment instructions and listens for Supabase Realtime payment confirmation.
- **Server-to-Server Webhook (`POST /api/webhooks/payment`)**:
  - Verifies cryptographic HMAC-SHA256 signature from the payment gateway.
  - Transitions order/registration status from `PENDING` $\rightarrow$ `PAID` | `EXPIRED` | `FAILED`.
  - On `PAID`, marks all registered members as confirmed and generates scannable ticket codes.

### Module E: Committee Admin & Gate Scanner (`Owner: Dave [FE] + Sean/Keane [BE]`)
*(Dave's implementation is complete and preserved as-is).*
- **Role-Protected `/admin` Portal** (Supabase Auth):
  - Overview KPI cards: Total Registrations (Webinar & YCR), Revenue, Checked-In Count.
  - Filterable table of registered participants with **1-Click CSV/Excel Export**.
- **Mobile Camera QR Scanner (`/admin/scan`)**:
  - Real-time mobile gate check-in for committee members with instant duplicate scan detection (`ALREADY_CHECKED_IN` warning).

### Module F: Donations (Backend Only / Externalized)
- **`/donate` UI route, donation form, and all donation buttons are completely deleted from this website.**
- Public donations will be handled by the external marketplace website.
- The `donations.contract.ts` schema and backend database tables are retained in the codebase for Keane's backend engineering, but are not exposed anywhere in the frontend UI.

---

## 3. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | First Contentful Paint (FCP) < 1.5s on 4G mobile; initial page weight optimized for single-page scroll. |
| **Responsiveness** | Mobile-first architecture (85%+ mobile visitors), minimum 44×44px touch targets on timeline nodes and form buttons. |
| **Data Integrity** | Zod contract validation on both client and server; live group pricing calculations synchronized between UI and backend. |
| **Concurrency** | Row-level locking (`SELECT ... FOR UPDATE`) in PostgreSQL RPCs to prevent overselling quotas during peak registration windows. |
| **Security** | Supabase Row Level Security (RLS) on all tables; payment status mutations restricted to verified HMAC webhooks. |
| **Reliability** | Idempotent webhook handling; fallback states for offline or degraded payment gateway connections. |
