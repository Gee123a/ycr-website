# AI Implementation Plan: Sean (Backend Track BE-1)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Sean (Sean Lawton)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Ken, Dave, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Sean Lawton (Sean)
- **Email**: `slawton01@student.ciputra.ac.id` | **GitHub**: [@Sean-230](https://github.com/Sean-230)
- **Branch Prefix**: `feat/be-sean-*`
- **Primary Deliverables**:
  1. Supabase PostgreSQL migrations for events, ticket tiers, registrations (with optional `nim_or_institution`), timeline milestones, and rundown sessions.
  2. Row Level Security (RLS) policies and Committee Admin authentication middleware (`src/middleware.ts`).
  3. Atomic PostgreSQL RPC `register_participant` (quota locking with `SELECT ... FOR UPDATE`).
  4. QR check-in verification RPC `verify_and_checkin_ticket`.
  5. Timeline data API endpoint (`src/app/api/timeline/route.ts`) returning `EventTimelineResponse` (milestones for pre-D-Day, detailed session rundown for the expanded D-Day hero centerpiece).
  6. Server Actions / query services for events, registrations, timeline data, and admin metrics.

### Allowed Files & Directories (READ & WRITE)
- `supabase/migrations/0001_events_and_tickets.sql`
- `supabase/migrations/0003_rls_and_rpcs.sql`
- `supabase/migrations/0004_event_timeline.sql`
- `supabase/migrations/0006_event_rundown.sql`
- `supabase/seed.sql`
- `src/lib/supabase/` (`client.ts`, `server.ts`, `admin.ts`)
- `src/middleware.ts` (Admin auth guard)
- `src/app/api/timeline/route.ts` (Timeline API endpoint)
- `src/services/events.service.ts`
- `src/services/registrations.service.ts`
- `src/services/timeline.service.ts`
- `src/services/admin.service.ts`

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/(public)/**`, `src/app/marketplace/**`, `src/app/admin/**` *(Owned by Ken & Dave)*
- `src/components/**` *(Owned by Ken & Dave)*
- `supabase/migrations/0002_*`, `0005_*` *(Owned by Keane — Marketplace & Orders)*
- `src/services/orders.service.ts`, `src/services/payments.service.ts`, `src/app/api/webhooks/**` *(Owned by Keane)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/constants.ts` (Single source of truth for dates and pricing)
2. `src/lib/contracts/timeline.contract.ts` (`TimelineMilestone`, `RundownSession`, `EventTimelineResponse`)
3. `src/lib/contracts/registration.contract.ts` (Registration data contracts: MemberSchema with optional `nimOrInstitution`, Paid Webinar and Paid YCR schemas)
4. `src/lib/contracts/events.contract.ts`
5. `docs/ARCHITECTURE.md` (Sections 3, 4, 5 & 6: Database Schema ERD, RLS matrix, and RPC patterns)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Supabase SSR Clients & Auth Middleware (`src/lib/supabase/`, `src/middleware.ts`)**
  - [ ] Implement `client.ts` using `createBrowserClient` from `@supabase/ssr`.
  - [ ] Implement `server.ts` using `createServerClient` with Next.js cookie store forwarding.
  - [ ] Implement `admin.ts` using `SUPABASE_SERVICE_ROLE_KEY` strictly for secure backend routines.
  - [ ] Implement `src/middleware.ts` protecting `/admin/**` routes, redirecting unauthenticated users to `/admin/login`.

- [ ] **Task 2: Events & Tickets Migration (`0001_events_and_tickets.sql`)**
  - [ ] Create `events` table (`id`, `slug`, `title`, `description`, `event_date`, `venue`, `banner_url`, `is_active`).
  - [ ] Create `ticket_tiers` table (`id`, `event_id`, `name`, `price_idr`, `quota_total`, `quota_sold`) supporting Webinar (Rp 50.000) and YCR (Rp 150.000).
  - [ ] Create `registrations` table (`id`, `event_id`, `ticket_tier_id`, `order_id`, `full_name`, `email`, `whatsapp`, `nim_or_institution`, `ticket_code`, `checkin_status`, `checked_in_at`):
    - Note: `nim_or_institution` column is optional / nullable (`TEXT NULL`).
  - [ ] Add B-tree indexes on `events(slug)`, `registrations(ticket_code)`, and `registrations(email)`.

- [ ] **Task 3: Row Level Security & Atomic RPCs (`0003_rls_and_rpcs.sql`)**
  - [ ] Enable RLS on `events`, `ticket_tiers`, `registrations`.
  - [ ] Public read access for active events and ticket tiers.
  - [ ] Write a PostgreSQL transactional RPC `register_participant`:
    - Row-lock `ticket_tiers` using `SELECT ... FOR UPDATE`.
    - Verify `quota_sold < quota_total`.
    - Atomically increment `quota_sold = quota_sold + 1`.
    - Insert registration with unique cryptographically random `ticket_code`.
  - [ ] Write check-in RPC `verify_and_checkin_ticket(p_ticket_code)`:
    - Atomically check if `ticket_code` exists and `checkin_status == 'UNCHECKED'`.
    - If valid: update `checkin_status = 'CHECKED_IN'` and set `checked_in_at = NOW()`.
    - If already checked in: return structured error `ALREADY_CHECKED_IN`.

- [ ] **Task 4: Timeline & Rundown Migrations (`0004_event_timeline.sql`, `0006_event_rundown.sql`)**
  - [ ] Create `event_milestones` table (`id`, `event_id`, `title`, `description`, `starts_at`, `ends_at`, `sort_order`, `is_published`).
  - [ ] Create `event_sessions` table (`id`, `event_id`, `title`, `speaker`, `location`, `starts_at`, `ends_at`, `sort_order`, `is_published`) to supply data for Ken's expanded D-Day hero stage.
  - [ ] Seed milestone data for Baksos, Ziarah, Webinar, YCR.
  - [ ] Seed full session rundown data for YCR event day.

- [ ] **Task 5: Timeline Data API Route & Service (`src/app/api/timeline/route.ts`, `src/services/timeline.service.ts`)**
  - [ ] Implement `src/services/timeline.service.ts` to query chronological milestones and rundown sessions from Supabase.
  - [ ] Implement `src/app/api/timeline/route.ts` (`GET /api/timeline`) returning payload formatted according to `EventTimelineResponse` (`eventSlug`, `milestones`, `rundown`).
  - [ ] Ensure milestones return correct chronological status (`PAST`, `NOW`, `UPCOMING`) and rundown sessions include start/end times, speakers, and locations for the D-Day hero centerpiece.

- [ ] **Task 6: Server Action & Admin Services (`src/services/`)**
  - [ ] `events.service.ts`: Query active events, ticket tiers, and remaining quotas.
  - [ ] `registrations.service.ts`: Wrap `register_participant` and `verify_and_checkin_ticket`.
  - [ ] `admin.service.ts`: Aggregate dashboard KPIs and generate CSV export query.

---

## 3. Pre-Merge Verification
```bash
npx supabase db reset --local   # Migrations must apply cleanly
npm run db:types                # Auto-generate TypeScript definitions
npm run typecheck               # Must compile with 0 errors
```
