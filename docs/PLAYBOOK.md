# PDD Website — AI-Assisted Product Development Playbook

Official development playbook for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, and **Baksos**.

---

## 1. Complete Documentation Suite

| Document | Purpose | Target Audience |
| :--- | :--- | :--- |
| **[README.md](../README.md)** | Repository overview, team roster, quick start guide, and standard commands. | All Contributors |
| **[AGENTS.md](../AGENTS.md) / [CLAUDE.md](../CLAUDE.md)** | Master AI instructions, strict directory boundaries, and non-negotiable coding guardrails. | AI Agents (Claude Code, Antigravity, Cursor) |
| **[docs/PRD.md](./PRD.md)** | Full Product Requirements Document covering Event Hub, Registration, Marketplace, Payments, and Admin Scanner. | All Contributors |
| **[docs/ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture diagram, conflict-free folder layout, Supabase ERD, and TypeScript/Zod contracts. | Sean, Keane, Ken, Dave |
| **[docs/TECH_STACK.md](./TECH_STACK.md)** | Detailed technology stack, package selections, versions, and deployment tiers. | All Contributors |
| **[docs/TEAM_WORKFLOW.md](./TEAM_WORKFLOW.md)** | Track definitions, parallel execution sequence, branch conventions, and copy-paste AI prompts per member. | Ken, Dave, Sean, Keane |
| **[docs/DESIGN.md](./DESIGN.md)** | "Sunlit Highway" visual identity system, color tokens, typography (Lilita One / Nunito), motifs, and UI components. | Ken, Dave |

---

## 2. Team Directory & Contact Roster

| Member | Role | Student Email | GitHub | Primary Track |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, contracts, staging deployment, releases |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Landing Page, Event Hub (`ycr`, `heart`, `ziarah`, `baksos`), Registration Forms, QR E-Ticket View (`/tickets/[code]`), Event Timeline (`/timeline`) |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: YCR Marketplace, Cart Drawer, Embedded QRIS/VA Payment Modal, Donation Page (`/donate`), Committee Admin & QR Gate Scanner (`/admin/scan`) |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: PostgreSQL Schema & Migrations, RLS Policies, Auth Middleware, Atomic Registration & Check-In RPCs, Timeline & Admin Queries |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: Marketplace Order Engine, 15-min Stock Reservation RPC, Donations Service, Tripay/Midtrans Gateway & HMAC Webhook Handler |

---

## 3. Core Architectural Pillars

1. **Strict Directory Isolation**:
   - Each engineer's AI agent operates strictly inside their assigned folders. Ken never touches marketplace routes; Dave never touches event hub routes; Sean and Keane own backend services and database migrations.
2. **Contract-First Parallel Development**:
   - `src/lib/contracts/` contains all shared Zod schemas (`CreateRegistrationSchema`, `CreateMarketplaceOrderSchema`, `CreateDonationSchema`, `CheckoutSessionResponse`). Frontend engineers build against typed contracts with zero waiting on backend infrastructure.
3. **Strict Concurrency & Database Security**:
   - Row Level Security (RLS) is enabled across all Supabase PostgreSQL tables.
   - Quotas and inventory are atomically decremented inside PostgreSQL RPC functions using `SELECT ... FOR UPDATE` row locking to prevent overselling.
4. **Server-Verified Payments**:
   - Client-side callbacks (`onSuccess`) are strictly treated as presentation-only.
   - Payment status transitions to `PAID` occur exclusively via `POST /api/webhooks/payment/route.ts` after cryptographic HMAC-SHA256 signature verification.
