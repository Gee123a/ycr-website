# CLAUDE.md — YCR ("The Highway") & KMK Web Platform

> See [AGENTS.md](./AGENTS.md) for master AI agent rules, directory boundaries, and coding guardrails.
> See [docs/PRD.md](./docs/PRD.md) for product requirements across the single-page experience, admin portal, and marketplace stub.
> See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design, database schema, and contracts.
> See [docs/DESIGN.md](./docs/DESIGN.md) for the "Sunlit Highway" design system tokens.
> See [docs/TEAM_WORKFLOW.md](./docs/TEAM_WORKFLOW.md) for role-specific prompts and branch workflows.
> See [docs/TECH_STACK.md](./docs/TECH_STACK.md) for library specifications and versions.

## Quick Team Ownership
- **Gee** (Coordinator): Scope, schedule, contracts, staging deployment, releases (`chore/gee-*`)
- **Ken** (Frontend FE-1): Sticky Timeline Bar, Homepage Assembly, site layout (`feat/fe-ken-*`)
- **Dave** (Frontend FE-2): Context-Aware Registration Form, Admin Dashboard & Scanner (complete), Marketplace stub (`feat/fe-dave-*`)
- **Sean** (Backend BE-1): Migrations, RLS, Auth Middleware, Timeline Service & Admin Queries (`feat/be-sean-*`)
- **Keane** (Backend BE-2): Orders Engine, Registration Payments, Tripay/Midtrans & HMAC Webhook (`feat/be-keane-*`)

## Core Rule
All frontend-backend interaction must conform to Zod schemas in `src/lib/contracts/` and generated types in `src/types/database.types.ts`. All UI components must use design tokens from `src/app/tokens.css` (`docs/DESIGN.md`).
