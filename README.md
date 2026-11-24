# YCR ("The Highway") & KMK Events Platform (`ycr-website`)

Official repository for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Webinar**, **Ziarah**, and **Baksos**.

The web platform delivers a cohesive multi-page experience:
1. **Main Event Landing (`/`)**:
   - **Expanding Timeline Bar & D-Day Hero Centerpiece**: A pinned horizontal milestone bar (**Baksos**, **Ziarah**, **Webinar**, **YCR**) that automatically expands on D-Day (`Date.now() >= YCR_DATE_MIDNIGHT`) into the **primary visual hero focus of the page** (an expanded live Rundown Showcase stage with prominent session cards, live time indicator, speakers, and room locations).
   - **Context-Aware Paid Registration Form**: Dynamically switches between **Webinar** registration (Rp 50.000 placeholder) and **YCR** registration (Rp 150.000 placeholder with individual/group toggles, dynamic member rows, optional `nimOrInstitution`, and live volume discount calculations). Both events are paid and trigger payment gateway checkout sessions.
2. **Official Merchandise Store (`/marketplace`)**:
   - Dave's completed work is retained and active as a first-class page in this repository, featuring the official merchandise catalog, category filters, a persistent sliding Cart Drawer, and an integrated Payment Modal.
3. **Committee Operations (`/admin` & `/admin/scan`)**:
   - Role-protected **Admin Dashboard (`/admin`)** and a mobile camera **QR Gate Scanner (`/admin/scan`)** for attendee check-in.

*Note on Donations*: Dedicated `/donate` route has been removed. Public donations will eventually merge into the marketplace checkout flow.

---

## 1. Team & Role Ownership

| Member | Role | Student Email | GitHub | Primary Track |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, shared constants (`src/lib/constants.ts`), contracts lock, staging deployment, releases |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Expanding Timeline Bar (`TimelineBar.tsx`, `TimelineModal.tsx`), D-Day Hero Rundown Showcase, Homepage Assembly (`/`), site layout |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: Context-Aware Paid Registration Form (`RegistrationForm.tsx`), Registration contract, Official Merch Store (`/marketplace`), Admin Dashboard & Gate Scanner |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: Schema & Migrations, RLS Policies, Committee Auth Middleware, Timeline Service & API Route, Admin Queries |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: Orders Engine, Registration & Merch Payments, Tripay/Midtrans Gateway & HMAC Webhook, Backend Donations |

---

## 2. Documentation Suite for Agent-Driven Development

Before writing code or prompting your AI coding assistant (Claude Code, Antigravity, Cursor, Windsurf), read these core documents:

1. **[AGENTS.md](./AGENTS.md) / [CLAUDE.md](./CLAUDE.md)** — Master AI rules, strict directory ownership boundaries (zero merge conflicts), and security guardrails.
2. **[docs/PLAYBOOK.md](./docs/PLAYBOOK.md)** — High-level architecture overview and parallel development playbook.
3. **[docs/PRD.md](./docs/PRD.md)** — Functional requirements for the Main Landing (Expanding Timeline, Paid Registration Form), Official Marketplace (`/marketplace`), and Admin Portal & Gate Scanner.
4. **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System diagram, directory layout, PostgreSQL ERD, shared constants (`src/lib/constants.ts`), RLS rules, and shared Zod contracts (`src/lib/contracts/`).
5. **[docs/TECH_STACK.md](./docs/TECH_STACK.md)** — Next.js App Router + Supabase + Payment Gateway stack specifications.
6. **[docs/TEAM_WORKFLOW.md](./docs/TEAM_WORKFLOW.md)** — Tracks, integration order, branch prefixes, and ready-to-paste AI prompts per member.
7. **[docs/DESIGN.md](./docs/DESIGN.md)** — The "Sunlit Highway" design system (colours, fonts, motifs, components, accessibility) based on the official poster.

### Dedicated Member AI Plans (Zero-Token-Waste)
Each member has an isolated implementation plan:
- **Ken (FE-1)**: **[plan_ken.md](./plan_ken.md)** — Expanding Timeline Bar, nodes, modal, D-Day Hero Rundown Showcase, Homepage assembly.
- **Dave (FE-2)**: **[plan_dave.md](./plan_dave.md)** — Paid Registration Form, Webinar/YCR switching, group member rows, optional `nimOrInstitution`, live pricing via `src/lib/constants.ts`, Official Merch Store, Admin & Scanner.
- **Sean (BE-1)**: **[plan_sean.md](./plan_sean.md)** — Supabase Schema, RLS, Auth, Timeline service & API route, Check-in verification RPC.
- **Keane (BE-2)**: **[plan_keane.md](./plan_keane.md)** — Orders Engine, Registration & Merch Payments, Tripay/Midtrans & HMAC Webhook.

---

## 3. Quick Start & Development Commands

```bash
# 1. Clone repository
git clone https://github.com/Gee123a/ycr-website.git
cd ycr-website

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local

# 4. Start Next.js development server
npm run dev

# 5. Typecheck & linting before committing
npm run typecheck
npm run lint
```
