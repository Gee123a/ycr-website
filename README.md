# YCR ("The Highway") & KMK Events Platform (`ycr-website`)

Official repository for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, and **Baksos**.

---

## 1. Team & Role Ownership

| Member | Role | Student Email | GitHub | Primary Track |
| :--- | :--- | :--- | :--- | :--- |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | Landing Page, Event Hub (`ycr`, `heart`, `ziarah`, `baksos`), Registration Form, QR E-Ticket Card |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | YCR Marketplace Storefront, Cart Drawer, Embedded QRIS/VA Payment Modal, Committee Admin & Gate Scanner |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | PostgreSQL Schema & Migrations, Row Level Security (RLS), Committee Auth, Atomic Registration & Check-In RPCs |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | Marketplace Order Engine, Atomic 15-min Stock Reservation RPC, Tripay/Midtrans Integration & HMAC Webhook |

---

## 2. AI-Assisted Development Documentation

Before writing any code or prompting your AI coding assistant (Claude Code, Antigravity/Agy, Cursor, Windsurf), read these core documents in the repository root:

1. **[AGENTS.md](./AGENTS.md) / [CLAUDE.md](./CLAUDE.md)** — Master AI rules, strict folder ownership boundaries (zero merge conflicts), and security guardrails.
2. **[TECH_STACK.md](./TECH_STACK.md)** — Detailed breakdown of the Next.js App Router + Supabase + Payment Gateway stack.
3. **[PRD.md](./PRD.md)** — Functional requirements across all 5 modules (Event Hub, Registration & QR Tickets, YCR Marketplace, QRIS/VA Checkout, Committee Admin).
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — System architecture diagram, conflict-free directory layout, PostgreSQL ERD, and shared TypeScript/Zod contracts (`src/lib/contracts/index.ts`).
5. **[TEAM_WORKFLOW.md](./TEAM_WORKFLOW.md)** — Parallel workstreams, Git branch conventions (`feat/fe-ken-*`, `feat/fe-dave-*`, `feat/be-sean-*`, `feat/be-keane-*`), and ready-to-paste AI prompts for each team member.
