# YCR ("The Highway") & KMK Events Platform (`ycr-website`)

Official repository for the **PDD Website Division** — **UKM Keluarga Mahasiswa Katolik (KMK) Universitas Ciputra**, powering **Youth Catholic Revival (YCR — "The Highway")**, **Heart**, **Ziarah**, and **Baksos**.

Visitors can sign up for events and get a QR e-ticket, buy YCR merch, donate, and view the event timeline. The committee gets an admin dashboard and a QR gate scanner.

---

## 1. Team & Role Ownership

| Member | Role | GitHub | Primary Track |
| :--- | :--- | :--- | :--- |
| **Gee** | **Coordinator** | [@Gee123a](https://github.com/Gee123a) | Scope, schedule, ownership rules, docs, project setup, releases |
| **Kenneth Jonathan Halim** (Ken) | **Frontend** (Next.js) | [@Kiyono-kouji](https://github.com/Kiyono-kouji) | Landing Page, Event Hub (`ycr`, `heart`, `ziarah`, `baksos`), Registration Form, QR E-Ticket, Event Timeline |
| **Dave Tristian Nurcahyo** (Dave) | **Frontend** (Next.js) | [@Dave03062006](https://github.com/Dave03062006) | YCR Marketplace, Cart Drawer, QRIS/VA Payment Modal, Donation Page, Committee Admin & Gate Scanner |
| **Sean Lawton** (Sean) | **Backend** (Supabase) | [@Sean-230](https://github.com/Sean-230) | Schema & Migrations, RLS, Committee Auth, Registration & Check-In RPCs, Timeline Data |
| **Keane Juan Suryanto** (Keane) | **Backend** (Supabase) | [@Kenn-jpg](https://github.com/Kenn-jpg) | Marketplace Orders, 15-min Stock Reservation, Donations, Tripay/Midtrans & HMAC Webhook |

---

## 2. Documentation

Before writing code or prompting your AI coding assistant (Claude Code, Antigravity, Cursor, Windsurf):

1. **`AGENTS.md`, `CLAUDE.md`, `owners.txt`, `schedule.txt`** — *local only, not in this repository.* Master AI rules, file ownership, and the dated task list. Get your copy from Gee and put them in the repository root; they are gitignored.
2. **[docs/PRD.md](./docs/PRD.md)** — Functional requirements for every module (Event Hub, Registration & QR Tickets, Marketplace, Checkout, Admin, Donation, Timeline).
3. **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System diagram, directory layout, PostgreSQL ERD, RLS rules, and shared Zod contracts (`src/lib/contracts/`).
4. **[docs/TECH_STACK.md](./docs/TECH_STACK.md)** — Next.js App Router + Supabase + payment gateway stack.
5. **[docs/TEAM_WORKFLOW.md](./docs/TEAM_WORKFLOW.md)** — Tracks, integration order, branch prefixes, and ready-to-paste AI prompts per member.
6. **[docs/DESIGN.md](./docs/DESIGN.md)** — The "Sunlit Highway" design system (colours, fonts, motifs, components, accessibility), based on the official "Welcome to The Highway" poster. Read it before any UI work.
