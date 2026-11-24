# CLAUDE.md — YCR ("The Highway") & KMK Web Platform

> See [AGENTS.md](./AGENTS.md) for master AI agent rules, directory boundaries, and coding guardrails.
> See [docs/PRD.md](./docs/PRD.md) for product requirements across all 5 modules.
> See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design, database schema, and contracts.
> See [docs/DESIGN.md](./docs/DESIGN.md) for the "Sunlit Highway" design system tokens.
> See [docs/TEAM_WORKFLOW.md](./docs/TEAM_WORKFLOW.md) for role-specific prompts and branch workflows.
> See [docs/TECH_STACK.md](./docs/TECH_STACK.md) for library specifications and versions.

## Quick Team Ownership
- **Gee** (Coordinator): Scope, schedule, contracts, staging deployment, releases (`chore/gee-*`)
- **Ken** (Frontend FE-1): Landing, Event Hub, Registration, E-Tickets, Timeline (`feat/fe-ken-*`)
- **Dave** (Frontend FE-2): Marketplace, Cart, QRIS/VA Payment Modal, Donation, Admin Scanner (`feat/fe-dave-*`)
- **Sean** (Backend BE-1): Migrations, RLS, Auth Middleware, Registration RPC, QR Check-In (`feat/be-sean-*`)
- **Keane** (Backend BE-2): Orders Engine, 15-min Stock Reservation, Donations, Payment Webhook (`feat/be-keane-*`)

## Core Rule
All frontend-backend interaction must conform to Zod schemas in `src/lib/contracts/` and generated types in `src/types/database.types.ts`. All UI components must use design tokens from `src/app/tokens.css` (`docs/DESIGN.md`).
