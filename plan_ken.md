# AI Implementation Plan: Ken (Frontend Track FE-1)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Ken (Kenneth Jonathan Halim)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Dave, Sean, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Kenneth Jonathan Halim (Ken)
- **Email**: `kjonathan08@student.ciputra.ac.id` | **GitHub**: [@Kiyono-kouji](https://github.com/Kiyono-kouji)
- **Branch Prefix**: `feat/fe-ken-*`
- **Primary Deliverables**:
  1. Sticky Timeline Bar (`src/components/timeline/TimelineBar.tsx`): full-width horizontal progress bar sticky at top of page, milestone nodes (Baksos, Ziarah, Webinar, YCR), node states (PAST, NOW, UPCOMING), hover tooltips, and midnight D-day auto-switch to rundown view.
  2. Milestone & Rundown Details Modal (`src/components/timeline/TimelineModal.tsx`): opened on node click to show full event/session details.
  3. Mock Timeline data provider (`src/components/timeline/mock-timeline.ts`) adhering to `TimelineMilestone` and `RundownSession` contracts until Sean wires Supabase.
  4. Homepage assembly (`src/app/(public)/page.tsx`): mounting sticky Timeline Bar at top and Dave's `RegistrationForm` below.
  5. Shared shell / navbar & footer (future iteration / tentative).

### Allowed Files & Directories (READ & WRITE)
- `src/app/(public)/page.tsx` (Homepage assembly)
- `src/components/timeline/` (`TimelineBar.tsx`, `TimelineModal.tsx`, `mock-timeline.ts`, etc.)
- `src/components/layout/` (Shared shell, navbar, footer)
- `src/components/ui/` (Shared UI primitives)

### Strictly Forbidden (DO NOT READ OR MODIFY)
- `src/app/marketplace/**`, `src/app/admin/**` *(Owned by Dave)*
- `src/components/marketplace/**`, `src/components/admin/**`, `src/components/registration/**` *(Owned by Dave)*
- `supabase/**` *(Owned by Sean & Keane)*
- `src/services/**`, `src/app/api/**` *(Owned by Sean & Keane)*

### Context Files to Read (Minimal Token Load)
1. `src/lib/contracts/timeline.contract.ts` (`TimelineMilestone`, `RundownSession`, `EventTimelineResponse`)
2. `src/components/registration/RegistrationForm.tsx` (Dave's registration form component for homepage assembly)
3. `src/app/tokens.css` (Sunlit Highway CSS design tokens)
4. `docs/DESIGN.md` (Design system guidelines: Lilita One headings, Nunito body)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Sticky Timeline Bar (`src/components/timeline/TimelineBar.tsx`)**
  - [ ] Implement full-width horizontal progress bar component sticky at the top of the viewport (`sticky top-0 z-40`).
  - [ ] Render milestone nodes in chronological order: Baksos, Ziarah, Webinar, YCR.
  - [ ] Support three distinct visual node states:
    - `PAST`: Filled green circle with completed indicator.
    - `NOW`: Pulsing gold glow (`box-shadow` / animation token) indicating the active milestone.
    - `UPCOMING`: Hollow circle with subtle border.
  - [ ] Hover interaction: Floating tooltip displaying milestone title and date label.
  - [ ] **D-day auto-switch logic**: Check current timestamp against YCR event date midnight; automatically switch from milestone view to rundown view (same horizontal progress bar and node layout, displaying rundown data: session title, speaker, location, and time window).
  - [ ] Connect to mock data in `src/components/timeline/mock-timeline.ts` until Sean's backend timeline endpoint is wired.

- [ ] **Task 2: Milestone & Rundown Details Modal (`src/components/timeline/TimelineModal.tsx`)**
  - [ ] Click interaction: Clicking any milestone or rundown node opens a responsive detail modal.
  - [ ] Display full event/session information: title, description, speaker/facilitator, location, and schedule.
  - [ ] Modal UX: Accessible backdrop overlay, Esc key close handler, focus management, and mobile-friendly dismiss button.

- [ ] **Task 3: Mock Timeline Data (`src/components/timeline/mock-timeline.ts`)**
  - [ ] Define mock milestones adhering strictly to `TimelineMilestone` from `src/lib/contracts/timeline.contract.ts` (Baksos, Ziarah, Webinar, YCR).
  - [ ] Define mock rundown sessions adhering to `RundownSession` from `src/lib/contracts/timeline.contract.ts`.
  - [ ] Export helper functions/constants to easily toggle or test D-day switch state.

- [ ] **Task 4: Homepage Assembly (`src/app/(public)/page.tsx`)**
  - [ ] Replace legacy placeholder hero page with the simplified single-page layout.
  - [ ] Mount the sticky `TimelineBar` at the top of the page.
  - [ ] Embed Dave's `RegistrationForm` (`src/components/registration/RegistrationForm.tsx`) directly below the timeline bar.
  - [ ] Apply "Sunlit Highway" container styling, background rhythm, and mobile responsive padding (`px-4 sm:px-6`).

- [ ] **Task 5: Shared Shell, Navbar & Footer (`src/components/layout/`) — [Future / TBD]**
  - [ ] Build minimal site header/navbar with YCR branding.
  - [ ] Build footer with UKM KMK Universitas Ciputra branding, Instagram link, and campus address.
  - [ ] Ensure tap targets are at least `44x44px` on mobile.

---

## 3. Pre-Merge Verification
```bash
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings
```
