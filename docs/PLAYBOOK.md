# PDD Website — AI-Assisted Product Development Playbook

Official development playbook for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Webinar**, **Ziarah**, and **Baksos**.

---

## 1. Complete Documentation Suite

| Document | Purpose | Target Audience |
| :--- | :--- | :--- |
| **[README.md](../README.md)** | Repository overview, team roster, quick start guide, and standard commands. | All Contributors |
| **[AGENTS.md](../AGENTS.md) / [CLAUDE.md](../CLAUDE.md)** | Master AI instructions, strict directory boundaries, and non-negotiable coding guardrails. | AI Agents (Claude Code, Antigravity, Cursor) |
| **[docs/PRD.md](./PRD.md)** | Product Requirements Document covering Single-Page Event Hub (Sticky Timeline Bar + Context-Aware Registration Form), Admin Dashboard & Gate Scanner, and Marketplace stub. | All Contributors |
| **[docs/ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture diagram, conflict-free folder layout, Supabase ERD, and TypeScript/Zod contracts. | Sean, Keane, Ken, Dave |
| **[docs/TECH_STACK.md](./TECH_STACK.md)** | Detailed technology stack, package selections, versions, and deployment tiers. | All Contributors |
| **[docs/TEAM_WORKFLOW.md](./TEAM_WORKFLOW.md)** | Track definitions, parallel execution sequence, branch conventions, and copy-paste AI prompts per member. | Ken, Dave, Sean, Keane |
| **[docs/DESIGN.md](./DESIGN.md)** | "Sunlit Highway" visual identity system, color tokens, typography (Lilita One / Nunito), motifs, and UI components. | Ken, Dave |

---

## 2. Team Directory & Contact Roster

| Member | Role | Student Email | GitHub | Primary Track |
| :--- | :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | `ssantoso04@student.ciputra.ac.id` | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, contracts, staging deployment, releases |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | `kjonathan08@student.ciputra.ac.id` | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | **Track FE-1**: Sticky Timeline Bar (`TimelineBar.tsx`, `TimelineModal.tsx`), Homepage Assembly (`/`), site layout, D-Day rundown switch |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | `dtristian@student.ciputra.ac.id` | [@Dave03062006](https://github.com/Dave03062006) | **Track FE-2**: Context-Aware Registration Form (`RegistrationForm.tsx`), Registration contract, Admin Dashboard & Gate Scanner (complete), Marketplace placeholder |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | `slawton01@student.ciputra.ac.id` | [@Sean-230](https://github.com/Sean-230) | **Track BE-1**: PostgreSQL Schema & Migrations, RLS Policies, Auth Middleware, Timeline Service & Admin Queries |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | `ksuryanto@student.ciputra.ac.id` | [@Kenn-jpg](https://github.com/Kenn-jpg) | **Track BE-2**: Orders Engine, Group Registration Payments, Tripay/Midtrans Gateway & HMAC Webhook, Backend Donations |

---

## 3. Core Architectural Pillars

1. **High-Focus Single-Page Architecture**:
   - The public website is unified into **ONE main page (`/`)** containing:
     - **Sticky Timeline Bar**: Pinned at the top of the viewport, connecting event milestones (Baksos $\rightarrow$ Ziarah $\rightarrow$ Webinar $\rightarrow$ YCR) and switching on D-Day to the session rundown.
     - **Context-Aware Registration Form**: The sole form on the site, dynamically toggling between Webinar registration (before `YCR_OPENS_AT`) and YCR registration (on/after `YCR_OPENS_AT`) with individual/group options and live volume discount calculations.
   - **`/admin` & `/admin/scan`**: Dedicated committee portal for participant management and gate QR check-in (Dave's work is complete).
   - **`/marketplace`**: Preserved as a placeholder/stub for a future separate project.
   - **`/donate` (DELETED)**: Donations are removed from this website and will be handled by the marketplace website.
2. **Contract-First Parallel Development**:
   - `src/lib/contracts/` defines the typed API boundaries (`registration.contract.ts`, `timeline.contract.ts`, `payments.contract.ts`).
   - Frontend engineers build against mock implementations conforming to the contracts with zero blocking on database infrastructure.
3. **Strict Concurrency & Database Security**:
   - Row Level Security (RLS) is enabled across all Supabase PostgreSQL tables.
   - Quotas and registration entries are atomically processed inside PostgreSQL RPC functions using `SELECT ... FOR UPDATE` row locks to prevent overselling.
4. **Server-Verified Payments**:
   - Client-side callbacks are strictly treated as presentation-only.
   - Payment status transitions to `PAID` occur exclusively via `POST /api/webhooks/payment/route.ts` after cryptographic HMAC-SHA256 signature verification.
