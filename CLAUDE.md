# CLAUDE.md — YCR ("The Highway") & KMK Web Platform

> See [AGENTS.md](./AGENTS.md) for the master AI agent instructions, team directory boundaries, and coding guardrails, [PRD.md](./PRD.md) for product requirements, [ARCHITECTURE.md](./ARCHITECTURE.md) for database schema & API contracts, and [TEAM_WORKFLOW.md](./TEAM_WORKFLOW.md) for role-specific prompts and workflows.

## Quick Reference
- **Frontend (Next.js App Router)**: **Ken** (`(public)`, `events`) & **Dave** (`marketplace`, `admin`)
- **Backend (Supabase + Webhooks)**: **Sean** (`migrations`, `events`, `registrations`) & **Keane** (`orders`, `payments`, `webhooks`)
- **Contracts**: All frontend-backend payloads must conform to Zod schemas in `src/lib/contracts/` and generated Supabase types in `src/types/database.types.ts`.
