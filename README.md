# YCR ("The Highway") & KMK Events Platform (`ycr-website`)

Official repository for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, and **Baksos**.

Visitors can sign up for events and get a QR e-ticket, buy YCR merchandise, donate, and view the event timeline. The committee gets a real-time admin dashboard and a mobile QR gate scanner.

---

## 1. Team & Role Ownership

| Member | Role | Student Email | GitHub | Primary Track |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, contracts, staging deployment, releases |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Landing Page, Event Hub (`ycr`, `heart`, `ziarah`, `baksos`), Registration Form, QR E-Ticket, Event Timeline |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: YCR Marketplace, Cart Drawer, QRIS/VA Payment Modal, Donation Page, Committee Admin & Gate Scanner |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: Schema & Migrations, RLS, Committee Auth, Registration & Check-In RPCs, Timeline Data |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: Marketplace Orders, 15-min Stock Reservation, Donations, Tripay/Midtrans & HMAC Webhook |

---

## 2. Documentation Suite for Agent-Driven Development

Before writing code or prompting your AI coding assistant (Claude Code, Antigravity, Cursor, Windsurf), read these core documents:

1. **[AGENTS.md](./AGENTS.md) / [CLAUDE.md](./CLAUDE.md)** — Master AI rules, strict directory ownership boundaries (zero merge conflicts), and security guardrails.
2. **[docs/PLAYBOOK.md](./docs/PLAYBOOK.md)** — High-level architecture overview and parallel development playbook.
3. **[docs/PRD.md](./docs/PRD.md)** — Functional requirements for every module (Event Hub, Registration & QR Tickets, Marketplace, Checkout, Admin, Donation, Timeline).
4. **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System diagram, directory layout, PostgreSQL ERD, RLS rules, and shared Zod contracts (`src/lib/contracts/`).
5. **[docs/TECH_STACK.md](./docs/TECH_STACK.md)** — Next.js App Router + Supabase + Payment Gateway stack specifications.
6. **[docs/TEAM_WORKFLOW.md](./docs/TEAM_WORKFLOW.md)** — Tracks, integration order, branch prefixes, and ready-to-paste AI prompts per member.
7. **[docs/DESIGN.md](./docs/DESIGN.md)** — The "Sunlit Highway" design system (colours, fonts, motifs, components, accessibility) based on the official poster.

### Dedicated Member AI Plans (Zero-Token-Waste)
Each member has an isolated, token-efficient implementation plan. Give your AI agent only your file:
- **Ken (FE-1)**: **[plan_ken.md](./plan_ken.md)** — Landing page, Event Hub, Registration, E-Tickets, Timeline.
- **Dave (FE-2)**: **[plan_dave.md](./plan_dave.md)** — Marketplace, Cart Drawer, Payment Modal, Donations, Admin Scanner.
- **Sean (BE-1)**: **[plan_sean.md](./plan_sean.md)** — Supabase Schema, RLS, Auth, Atomic Registration & Check-in RPCs.
- **Keane (BE-2)**: **[plan_keane.md](./plan_keane.md)** — Orders Engine, 15-min Stock Lock RPC, Donations, Payment Webhook.

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
