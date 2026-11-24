# YCR ("The Highway") & KMK Events Platform (`ycr-website`)

Official repository for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Webinar**, **Ziarah**, and **Baksos**.

Under the unified single-page product direction, the public website is focused on **ONE main page (`/`)**:
1. **Sticky Timeline Bar**: Pinned at the top of the viewport, connecting circular milestone nodes (**Baksos**, **Ziarah**, **Webinar**, **YCR**) with interactive tooltips and detail modals, automatically switching on D-Day to the YCR session rundown.
2. **Context-Aware Registration Form**: The single form on the website, dynamically switching between **Webinar** registration and **YCR** registration (featuring individual/group toggles, dynamic member rows, and live volume discount calculations).

The committee manages operations via a role-protected **Admin Dashboard (`/admin`)** and a mobile camera **QR Gate Scanner (`/admin/scan`)**.

The **`/marketplace`** route is preserved as a placeholder/stub for a future separate project. **`/donate` has been removed**; public donations will be handled by the marketplace website.

---

## 1. Team & Role Ownership

| Member | Role | Student Email | GitHub | Primary Track |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, contracts lock, staging deployment, releases |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Sticky Timeline Bar (`TimelineBar.tsx`, `TimelineModal.tsx`), Homepage Assembly (`/`), site layout, D-Day rundown switch |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: Context-Aware Registration Form (`RegistrationForm.tsx`), Registration contract, Admin Dashboard & Gate Scanner (complete), Marketplace stub |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: Schema & Migrations, RLS Policies, Committee Auth Middleware, Timeline Service & Admin Queries |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: Orders Engine, Group Registration Payments, Tripay/Midtrans Gateway & HMAC Webhook, Backend Donations |

---

## 2. Documentation Suite for Agent-Driven Development

Before writing code or prompting your AI coding assistant (Claude Code, Antigravity, Cursor, Windsurf), read these core documents:

1. **[AGENTS.md](./AGENTS.md) / [CLAUDE.md](./CLAUDE.md)** — Master AI rules, strict directory ownership boundaries (zero merge conflicts), and security guardrails.
2. **[docs/PLAYBOOK.md](./docs/PLAYBOOK.md)** — High-level architecture overview and parallel development playbook.
3. **[docs/PRD.md](./docs/PRD.md)** — Functional requirements for the single-page experience (Sticky Timeline Bar, Context-Aware Registration Form), Admin Dashboard & Gate Scanner, and Marketplace stub.
4. **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System diagram, directory layout, PostgreSQL ERD, RLS rules, and shared Zod contracts (`src/lib/contracts/`).
5. **[docs/TECH_STACK.md](./docs/TECH_STACK.md)** — Next.js App Router + Supabase + Payment Gateway stack specifications.
6. **[docs/TEAM_WORKFLOW.md](./docs/TEAM_WORKFLOW.md)** — Tracks, integration order, branch prefixes, and ready-to-paste AI prompts per member.
7. **[docs/DESIGN.md](./docs/DESIGN.md)** — The "Sunlit Highway" design system (colours, fonts, motifs, components, accessibility) based on the official poster.

### Dedicated Member AI Plans (Zero-Token-Waste)
Each member has an isolated implementation plan:
- **Ken (FE-1)**: **[plan_ken.md](./plan_ken.md)** — Sticky Timeline Bar, nodes, modal, D-Day rundown switch, Homepage assembly.
- **Dave (FE-2)**: **[plan_dave.md](./plan_dave.md)** — Registration Form, Webinar/YCR switching, group member rows, live pricing, Admin & Scanner.
- **Sean (BE-1)**: **[plan_sean.md](./plan_sean.md)** — Supabase Schema, RLS, Auth, Timeline service, Check-in verification RPC.
- **Keane (BE-2)**: **[plan_keane.md](./plan_keane.md)** — Orders Engine, Group Registration Payments, Tripay/Midtrans & HMAC Webhook.

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
