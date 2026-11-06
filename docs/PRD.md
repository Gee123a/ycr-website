# Product Requirements Document (PRD) — YCR ("The Highway") & KMK Web Platform

| Field | Details |
| :--- | :--- |
| **Organization** | UKM Keluarga Mahasiswa Katolik (KMK) — Universitas Ciputra |
| **Division** | PDD Website (Production, Documentation, and Development) |
| **Events Covered** | **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, **Baksos** |
| **Coordinator** | **Gee** — oversees all tracks, owns scope, schedule and ownership rules |
| **Frontend Team** | **Ken** (Kenneth Jonathan Halim), **Dave** (Dave Tristian Nurcahyo) — *Next.js* |
| **Backend Team** | **Sean** (Sean Lawton), **Keane** (Keane Juan Suryanto) — *Supabase* |
| **Target Scale** | 50 Concurrent Users / 100 Peak Concurrent Users (85%+ Mobile Traffic) |

---

## 1. Product Vision & Scope

Build a unified, mobile-first web platform (`*.site`) for UKM KMK Universitas Ciputra that serves **Youth Catholic Revival ("The Highway")** as its flagship event while hosting sub-pages/registration flows for **Heart**, **Ziarah**, and **Baksos** at zero additional hosting cost.

Visitors can: **sign up for an event** (and receive a QR e-ticket), **buy YCR merch**, **donate**, and **view the event timeline**.

The platform solves these core operational bottlenecks:
1. **Manual Registration & Line Bottlenecks**: Replaces manual Google Forms + manual bank transfer screenshot checking with instant QRIS/Virtual Account payment verification and automated QR E-Ticket issuance.
2. **YCR Marketplace & Merch Pre-Orders**: Provides an integrated online storefront for YCR merchandise, food/beverage bundles, and event kits with real-time stock locking.
3. **Real-Time Committee Operations**: Gives committee members a live dashboard to track registrations, verify payments, and scan participant QR codes at the venue gate.
4. **Online Donations**: Replaces manual transfer-and-screenshot donations with QRIS/VA donations confirmed automatically by the payment webhook.

---

## 2. Core Functional Modules & Ownership

### Module A: Public Event Hub & Landing Pages (`Owner: Ken [FE] + Sean [BE]`)
- **YCR "The Highway" Flagship Landing Page**:
  - Hero section with countdown timer, event theme story, guest speakers/worship leaders, a short "key dates" preview linking to `/timeline`, venue map, and FAQ accordion.
- **Multi-Event Sub-Routes**:
  - `/events/ycr` — Youth Catholic Revival ("The Highway")
  - `/events/heart` — Heart participant registration
  - `/events/ziarah` — Ziarah registration & itinerary
  - `/events/baksos` — Baksos landing page & volunteer form; its "Donate" button links to `/donate?campaign=baksos` (Module F)

### Module B: Event Registration & QR E-Ticketing (`Owner: Ken [FE] + Sean [BE]`)
- **Participant Registration Flow**:
  - Collects full name, NIM / institution, WhatsApp number, email, ticket tier (Early Bird / Regular / VIP / Bundle), and dietary/medical notes.
  - Supports both **Free Events** (instant confirmation) and **Paid Events** (creates `PENDING` registration and triggers payment flow).
- **Digital E-Ticket**:
  - Once status becomes `PAID`, generates a unique signed ticket token (`ticket_code`) rendered as a downloadable/scannable QR code on `/tickets/[ticketCode]`.
  - Participants can look up their ticket anytime via email/WhatsApp + order reference.

### Module C: YCR Marketplace (`Owner: Dave [FE] + Keane [BE]`)
- **Product Catalog**:
  - Displays official YCR merchandise (t-shirts, totebags, lanyards, stickers) and F&B/donation bundles with variants (sizes S/M/L/XL) and live stock counts.
- **Cart & Atomic Stock Reservation**:
  - Client-side persistent cart drawer with instant total calculation.
  - On checkout submission, backend atomically checks and reserves stock inside a PostgreSQL transaction/RPC (`create_marketplace_order`) for 15 minutes while awaiting payment.

### Module D: Payment Gateway & Webhook Engine (`Owner: Dave [FE] + Keane [BE]`)
- **Embedded Checkout (QRIS & Virtual Account)**:
  - Integrates **Tripay** or **Midtrans Snap** so participants scan QRIS or copy a Virtual Account number directly inside a popup/modal on the website without leaving the domain.
  - Displays a 15-minute countdown timer and polls/subscribes via Supabase Realtime to `orders.payment_status`.
- **Server-to-Server Webhook (`POST /api/webhooks/payment`)**:
  - Verifies cryptographic HMAC signature from the payment gateway.
  - Transitions order/registration status (`PENDING` $\rightarrow$ `PAID` | `EXPIRED` | `FAILED`).
  - If `EXPIRED` or `FAILED`, automatically releases reserved stock back to inventory.

### Module E: Committee Admin & Gate Scanner (`Owner: Dave [FE] + Sean/Keane [BE]`)
- **Role-Protected `/admin` Portal** (Supabase Auth):
  - Overview KPI cards: Total Revenue, Tickets Sold per Tier, Merch Orders, Checked-In Count.
  - Filterable table of participants & marketplace orders with **1-Click CSV/Excel Export**.
  - Mobile camera **QR Code Scanner** (`/admin/scan`) for D-Day gate check-in with instant duplicate-scan detection (`ALREADY_CHECKED_IN` warning).

### Module F: Donation Page (`Owner: Dave [FE] + Keane [BE]`)
- **`/donate` page** with a campaign selector (`ycr` | `baksos`, preselected via `?campaign=`), preset and custom amounts, donor name, email, WhatsApp, an optional message, and an "anonymous" toggle.
- Reuses the **embedded QRIS/VA payment modal** from Module D. A donation creates an `orders` row with `order_type = 'DONATION'` plus a `donations` row; only the verified webhook marks it `PAID`.
- After payment: a thank-you screen with the order code. No stock or quota is involved.
- Committee admin sees donation totals per campaign on the dashboard (Module E).
- *Open decision (Gee / committee)*: minimum donation amount and whether a public donor list or progress bar is shown.

### Module G: Event Timeline & Rundown (`Owner: Ken [FE] + Sean [BE]`)
- **`/timeline` page (confirmed)**: the YCR event timeline as a vertical, mobile-first list of milestones (e.g. registration opens, Early Bird ends, registration closes, merch pre-order closes, event day), each with date/time, title, short description and a "past / now / upcoming" state. Data comes from the `event_milestones` table so the committee can change dates without a deploy.
- **Event-day rundown (tentative)**: sessions, speakers/worship leaders and times for the event day, stored in `event_sessions`. The content is **waiting on approval from the KMK leadership**; the timeline page leaves a section for it, but no rundown work starts until its task in `schedule.txt` is no longer marked `(tentative)`.

---

## 3. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | First Contentful Paint (FCP) < 1.5s on 4G mobile; API/RPC p95 latency < 300ms under 100 peak concurrent users. |
| **Payments** | Tickets, merch and donations share one order + webhook pipeline; amounts are integer rupiah. |
| **Concurrency & Stock** | Zero overselling on limited-stock merch or Early Bird ticket quotas (enforced via PostgreSQL row-level locking `FOR UPDATE`). |
| **Security** | Supabase RLS enabled on all tables; payment status can only be mutated by verified HMAC webhook using service-role client. |
| **Reliability** | Idempotent webhook processing; graceful fallback UI if payment gateway sandbox/production endpoint is slow. |
