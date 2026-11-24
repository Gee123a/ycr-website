# TEAM_WORKFLOW.md — AI-Assisted Development Playbook (Gee, Ken, Dave, Sean, Keane)

> **How to use this file**: Each member of the PDD Website division has an isolated track, branch prefix, and ready-to-copy AI prompt. Paste your prompt into Claude Code / Antigravity / Cursor. Your agent must first read `AGENTS.md`, `docs/PRD.md`, and `docs/ARCHITECTURE.md` (and `docs/DESIGN.md` for UI work) to ensure seamless integration on the first try.

---

## 1. Team Tracks & Parallel Workstreams

| Track | Member | Branch Prefix | Primary Deliverables |
| :--- | :--- | :--- | :--- |
| **Coordination** | **Gee** | `chore/gee-*` | 1. Agent rules, project scope, schedule, docs, and config<br>2. Next.js + Supabase scaffold, shared constants (`src/lib/constants.ts`), and shared contracts lock<br>3. Staging deployment, end-to-end testing, and release management |
| **Track FE-1 (Timeline Bar, D-Day Hero & Homepage)** | **Ken** (Kenneth Jonathan Halim) | `feat/fe-ken-*` | 1. **Sticky Timeline Bar** (`TimelineBar.tsx`): Pinned top bar connecting milestone nodes (Baksos $\rightarrow$ Ziarah $\rightarrow$ Webinar $\rightarrow$ YCR) with `PAST`, `NOW`, `UPCOMING` states<br>2. **Timeline Modal** (`TimelineModal.tsx`): Detail popup on node click and hover tooltip<br>3. **D-Day Hero Transformation**: On D-Day (`Date.now() >= YCR_DATE_MIDNIGHT` via `src/lib/constants.ts`), timeline expands significantly from a simple top bar into the **primary visual hero focus of the page** (an expanded live Rundown Showcase stage with prominent session cards, live time indicator, speakers, and room locations)<br>4. **Homepage Assembly** (`/`): Hosting Expanding Timeline / D-Day Hero stage and Dave's Context-Aware Paid Registration Form, plus site layout and footer |
| **Track FE-2 (Registration Form, Marketplace & Admin)** | **Dave** (Dave Tristian Nurcahyo) | `feat/fe-dave-*` | 1. **Registration Contract** (`src/lib/contracts/registration.contract.ts`): MemberSchema with optional `nimOrInstitution`, paid Webinar and paid YCR schemas (both with `paymentMethod: PaidMethodSchema`)<br>2. **Context-Aware Registration Form** (`RegistrationForm.tsx`): Switches between Paid Webinar form (before `YCR_OPENS_AT`) and Paid YCR form (on/after `YCR_OPENS_AT`)<br>3. **YCR Group Registration**: Pill selector (Individual vs Group), dynamic member addition/removal, optional `nimOrInstitution`, and live tiered pricing via `src/lib/constants.ts` (1–4: Rp 150k, 5–9: 10% off, $\ge$10: 20% off)<br>4. **Official Marketplace Store** (`/marketplace`): *Retained and active first-class page* (Merch catalog, persistent Cart Drawer, Payment Modal)<br>5. **Committee Admin & Gate Scanner** (`/admin`, `/admin/scan`): *Complete*<br>6. **Cleanup**: Delete `/donate` route and components |
| **Track BE-1 (Schema, Auth, Events & Timeline)** | **Sean** (Sean Lawton) | `feat/be-sean-*` | 1. PostgreSQL migrations for `events`, `event_milestones`, `event_sessions`, and `registrations` (supporting optional `nim_or_institution`)<br>2. Supabase SSR clients (`client.ts`, `server.ts`, `admin.ts`) & `/admin` auth middleware<br>3. Timeline service (`timeline.service.ts`) providing milestone nodes and expanded D-Day rundown schedule<br>4. Registration check-in RPC (`verify_and_checkin_ticket`) for the admin gate scanner<br>5. Timeline API route: `GET /api/timeline` (src/app/api/timeline/route.ts) returning `EventTimelineResponse` |
| **Track BE-2 (Orders, Payments & Webhooks)** | **Keane** (Keane Juan Suryanto) | `feat/be-keane-*` | 1. Migrations for `orders`, `order_items`, and `payment_logs`<br>2. Atomic registration order RPC (`register_ycr_group`) with quota check and server-side pricing validation based on `src/lib/constants.ts`<br>3. Tripay / Midtrans payment gateway service (`payments.service.ts`) handling paid Webinar, paid YCR, and marketplace orders<br>4. Idempotent server webhook (`POST /api/webhooks/payment/route.ts`) verifying HMAC signature and activating registrations<br>5. Retain backend donation service and schema for eventual marketplace integration |

---

## 2. Step-by-Step Integration Order (Zero Blockers)

```mermaid
flowchart TD
    S0["Phase 0 (Gee): Scaffold + shared constants (src/lib/constants.ts) + shared contracts lock (src/lib/contracts/)"]
    S0 --> FE1["Ken (FE-1): Expanding Timeline Bar, D-Day Hero & Homepage assembly against mock contracts"]
    S0 --> FE2["Dave (FE-2): Paid Registration Form against mock contracts (Marketplace & Admin active/complete)"]
    S0 --> BE1["Sean (BE-1): Timeline service, events schema, and admin auth"]
    S0 --> BE2["Keane (BE-2): Orders RPC, payment gateway service, and HMAC webhook"]
    BE1 --> GEN["Run `npm run db:types` -> commit src/types/database.types.ts"]
    BE2 --> GEN
    FE1 --> INT["Phase 2: Wire up mock calls in FE to Sean & Keane's real backend services"]
    FE2 --> INT
    GEN --> INT
    INT --> QA["Phase 3: End-to-end validation, hardening, go-live (Gee)"]
```

1. **Contract Lock (Phase 0)**: Shared constants in `src/lib/constants.ts` and contracts in `src/lib/contracts/` define the single source of truth and API boundaries before implementation.
2. **Parallel Build (Phase 1)**:
   - **Ken** builds the Expanding Timeline Bar with mock milestone and rundown data, verifying visual states and D-Day hero expansion.
   - **Dave** builds the Context-Aware Paid Registration Form with date-based switching, optional `nimOrInstitution`, dynamic group member fields, live price summary, and preserves the `/marketplace` active route. (Admin and scanner are already done).
   - **Sean & Keane** implement database migrations, timeline services, registration RPCs, and payment webhook verification.
3. **Wire-Up (Phase 2)**: Replace mock data with Supabase services. Because both frontend and backend adhere to `src/lib/contracts/` and `src/lib/constants.ts`, TypeScript guarantees type safety.
4. **Testing & Hardening (Phase 3)**: Verify gate scanning on mobile, payment webhooks in sandbox, and responsive layout across mobile and desktop.

---

## 3. Ready-to-Paste AI Prompts per Member

### For Ken — Frontend (Expanding Timeline Bar, D-Day Hero Showcase & Homepage)
```text
Read AGENTS.md, docs/PRD.md and docs/ARCHITECTURE.md first. Follow all ownership rules.
I am Ken (Frontend Track FE-1). Stay inside my assigned paths:
- src/components/timeline/ (TimelineBar.tsx, TimelineModal.tsx, mock-timeline.ts)
- src/components/layout/
- src/app/(public)/ or src/app/page.tsx

My deliverables:
1. Sticky Timeline Bar (Pre-D-Day): Full-width horizontal bar pinned at top of the page (sticky on scroll). A progress line connects circular nodes left-to-right representing events in chronological order: Baksos, Ziarah, Webinar, YCR.
2. Node States: PAST = filled green, NOW = pulsing gold, UPCOMING = hollow with border.
3. Interactions: Hover shows tooltip with 1-line summary (title + date). Click opens TimelineModal with full event details (title, date, venue, description).
4. D-Day Hero Centerpiece: On and after YCR event date midnight (auto-detected by Date.now() >= YCR_DATE_MIDNIGHT via src/lib/constants.ts):
   - The timeline expands significantly from a simple top bar into the PRIMARY VISUAL HERO FOCUS of the page.
   - Renders an expanded live Rundown Showcase stage with prominent session cards, live time indicator ("HAPPENING NOW"), speaker highlights, and room/stage locations.
   - Registration form below steps down into a secondary role (or displays "Registration Closed / Today's Live Event").
5. Homepage Assembly: Assemble the root page (/) hosting the Expanding Timeline / D-Day Hero Showcase at the top and Dave's Context-Aware Paid Registration Form below it.
6. Mock data provider (src/components/timeline/mock-timeline.ts) using TimelineMilestone and RundownSession interfaces.
Use design tokens from src/app/tokens.css (Sunlit Highway theme). Mobile-first, min 44x44px touch targets.
```

### For Dave — Frontend (Paid Registration Form, Marketplace Store & Admin)
```text
Read AGENTS.md, docs/PRD.md and docs/ARCHITECTURE.md first. Follow all ownership rules.
I am Dave (Frontend Track FE-2). Stay inside my assigned paths:
- src/components/registration/ (RegistrationForm.tsx, WebinarForm.tsx, YcrForm.tsx, PriceSummary.tsx)
- src/lib/contracts/registration.contract.ts
- src/app/marketplace/ and src/components/marketplace/ (ACTIVE first-class merch store - retained and celebrated!)
- src/app/admin/ and src/components/admin/ (Completed)
- src/app/mock-registration.ts

Important scope updates:
- /marketplace is an ACTIVE first-class page containing the official merchandise catalog, cart drawer, and checkout modal. Retain and preserve all of this completed work.
- /donate route and UI are deleted. Public donations will eventually merge into the marketplace flow.
- Reference src/lib/constants.ts as the single source of truth for pricing and dates (PRICE_WEBINAR_IDR = 50_000, PRICE_YCR_INDIVIDUAL_IDR = 150_000, DISCOUNT_TIER_5 = 0.10, DISCOUNT_TIER_10 = 0.20, YCR_OPENS_AT).

My deliverables:
1. Registration Contract (src/lib/contracts/registration.contract.ts):
   export const MemberSchema = z.object({
     fullName: z.string().min(3).max(100),
     email: z.email(),
     whatsapp: WhatsappSchema,
     nimOrInstitution: z.string().max(100).optional(),
   });
   export const CreateWebinarRegistrationSchema = z.object({
     member: MemberSchema,
     paymentMethod: PaidMethodSchema,
   });
   export const CreateYcrRegistrationSchema = z.object({
     member: MemberSchema,
     paymentMethod: PaidMethodSchema,
   });
   export const CreateYcrGroupSchema = z.object({
     members: z.array(MemberSchema).min(1),
     paymentMethod: PaidMethodSchema,
   });
2. Context-Aware Registration Form:
   - Date-based switching: Before YCR_OPENS_AT -> show Webinar registration form. On/after YCR_OPENS_AT -> show YCR registration form.
   - Webinar Form (PAID - Rp 50.000): Member details (Full Name, Email, WhatsApp, optional nimOrInstitution) + payment method selector (PaidMethodSchema).
   - YCR Form (PAID - Rp 150.000 base): Pill selector toggle between Individual and Group.
     - Individual: Member details + payment method selector.
     - Group: Leader row (Member 1) + "Add Member" button to append member rows with remove button (×) + payment method selector.
   - Live Price Summary:
     - 1–4 people: Rp 150.000/person (PRICE_YCR_INDIVIDUAL_IDR)
     - 5–9 people: 10% off (DISCOUNT_TIER_5 -> Rp 135.000/person)
     - >=10 people: 20% off (DISCOUNT_TIER_10 -> Rp 120.000/person)
     - Total updates live as members are added or removed.
3. Embedded payment modal integration triggering checkout sessions for paid registrations via Tripay/Midtrans Snap.
4. Mock registration handler (src/app/mock-registration.ts) — validates Zod schema and returns CheckoutSessionResponse.
5. Scope cleanup: delete src/app/donate/ and src/components/donation/.
```

### For Sean — Backend (Schema, Auth, Events & Timeline)
```text
Read AGENTS.md, docs/PRD.md and docs/ARCHITECTURE.md first. Follow all ownership rules.
I am Sean (Backend Track BE-1). Stay inside my assigned paths:
- supabase/migrations/ (0001, 0003, 0004, 0006)
- src/lib/supabase/ (client.ts, server.ts, admin.ts)
- src/middleware.ts
- src/services/events.service.ts, src/services/registrations.service.ts, src/services/timeline.service.ts, src/services/admin.service.ts
- src/app/api/timeline/route.ts

My deliverables:
1. Migrations for events (Baksos, Ziarah, Webinar, YCR), event_milestones, event_sessions (D-Day rundown), and registrations (with optional nim_or_institution column) with RLS.
2. Timeline service returning EventTimelineResponse (milestone nodes for pre-D-Day and detailed session rundown for the expanded D-Day hero centerpiece).
3. Auth middleware protecting /admin for committee access.
4. Ticket verification and check-in RPC for Dave's gate scanner (/admin/scan).
5. Timeline API route (GET /api/timeline → EventTimelineResponse).
```

### For Keane — Backend (Orders, Registration & Merch Payments, Webhooks)
```text
Read AGENTS.md, docs/PRD.md and docs/ARCHITECTURE.md first. Follow all ownership rules.
I am Keane (Backend Track BE-2). Stay inside my assigned paths:
- supabase/migrations/ (0002, 0005)
- src/services/orders.service.ts, src/services/donations.service.ts, src/services/payments.service.ts
- src/app/api/webhooks/payment/route.ts

My deliverables:
1. Migrations for orders, order_items, payment_logs, and donations (retained for backend).
2. Atomic registration order RPC (register_ycr_group) locking quotas with SELECT ... FOR UPDATE and validating tiered pricing server-side against src/lib/constants.ts.
3. Handle paid orders for Webinar (Rp 50.000), YCR (individual and group), and marketplace merchandise.
4. Tripay / Midtrans payment gateway integration in payments.service.ts.
5. Idempotent webhook POST /api/webhooks/payment: verify HMAC signature, transition order to PAID, and generate ticket codes for all registered members.
```

---

## 4. Git & Contribution Rules

1. **One branch per task**, named with member prefix (`feat/fe-ken-*`, `feat/fe-dave-*`, `feat/be-sean-*`, `feat/be-keane-*`). Never commit directly to `main`.
2. **Strict file boundary compliance**: Operate strictly within assigned directories.
3. **Pre-merge validation**:
   - Run `npm run typecheck`, `npm run lint`, and `npm run build` locally before merging.
   - If database migrations were created, run `npm run db:types` and include updated types in the branch.
4. **No AI attribution** in commit messages or pull request descriptions.
5. **Environment Secrets**: Keep service role keys and payment secrets strictly on the server; never expose them with `NEXT_PUBLIC_`.
