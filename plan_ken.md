# AI Implementation Plan: Ken (Frontend Track FE-1)

> **Instructions for AI**: You are the dedicated AI coding assistant for **Ken (Kenneth Jonathan Halim)**. Stay strictly within the scope and directory boundaries defined below. Do not read or modify files belonging to Dave, Sean, or Keane to minimize token waste and eliminate merge conflicts.

---

## 1. Identity & Scope Boundaries

- **Owner**: Kenneth Jonathan Halim (Ken)
- **Email**: `kjonathan08@student.ciputra.ac.id` | **GitHub**: [@Kiyono-kouji](https://github.com/Kiyono-kouji)
- **Branch Prefix**: `feat/fe-ken-*`
- **Primary Deliverables**:
  1. Sticky Timeline Bar (`src/components/timeline/TimelineBar.tsx`): full-width horizontal progress bar sticky at top of page, milestone nodes (Baksos, Ziarah, Webinar, YCR), node states (PAST, NOW, UPCOMING), hover tooltips.
  2. **D-Day Hero Centerpiece Transformation**: On D-Day (`Date.now() >= YCR_DATE_MIDNIGHT` via `src/lib/constants.ts`), the timeline expands significantly from a simple top bar into the **primary visual hero focus of the page** (an expanded live Rundown Showcase stage with prominent session cards, live time indicator, speakers, and room locations). The registration form steps down into a secondary role (or displays "Registration Closed / Today's Live Event").
  3. Milestone & Rundown Details Modal (`src/components/timeline/TimelineModal.tsx`): opened on node click to show full event/session details.
  4. Mock Timeline data provider (`src/components/timeline/mock-timeline.ts`) adhering to `TimelineMilestone` and `RundownSession` contracts until Sean wires Supabase.
  5. Homepage assembly (`src/app/(public)/page.tsx`): mounting the Expanding Timeline / D-Day Hero stage at top and Dave's `RegistrationForm` below.
  6. Shared shell / navbar & footer (future iteration / tentative).

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
1. `src/lib/constants.ts` (Single source of truth: `YCR_DATE_MIDNIGHT`, `YCR_OPENS_AT`)
2. `src/lib/contracts/timeline.contract.ts` (`TimelineMilestone`, `RundownSession`, `EventTimelineResponse`)
3. `src/components/registration/RegistrationForm.tsx` (Dave's registration form component for homepage assembly)
4. `src/app/tokens.css` (Sunlit Highway CSS design tokens)
5. `docs/DESIGN.md` (Design system guidelines: Lilita One headings, Nunito body)

---

## 2. Step-by-Step Task Checklist

- [ ] **Task 1: Sticky Timeline Bar & D-Day Hero Expansion (`src/components/timeline/TimelineBar.tsx`)**
  - [ ] Implement full-width horizontal progress bar component sticky at the top of the viewport (`sticky top-0 z-40`).
  - [ ] Render milestone nodes in chronological order: Baksos, Ziarah, Webinar, YCR.
  - [ ] Support three distinct visual node states:
    - `PAST`: Filled green circle with completed indicator.
    - `NOW`: Pulsing gold glow (`box-shadow` / animation token) indicating the active milestone.
    - `UPCOMING`: Hollow circle with subtle border.
  - [ ] Hover interaction: Floating tooltip displaying milestone title and date label.
  - [ ] **D-Day Hero Expansion Logic**:
    - Check current timestamp against `YCR_DATE_MIDNIGHT` from `src/lib/constants.ts` (`Date.now() >= YCR_DATE_MIDNIGHT`).
    - When D-Day arrives: The timeline expands significantly from a simple top bar into the **primary visual hero focus of the page**.
    - Renders an expanded live **Rundown Showcase stage**:
      - Prominent chronological session cards.
      - Dynamic "HAPPENING NOW" live time indicator for current session.
      - Speaker portraits/names, talk titles, and room/stage locations.
      - Upgraded hero layout and typography using "Sunlit Highway" tokens.
    - Below this hero stage, the registration form steps down into a secondary role (or displays "Registration Closed / Today's Live Event").
  - [ ] Connect to mock data in `src/components/timeline/mock-timeline.ts` until Sean's backend timeline endpoint is wired.

- [ ] **Task 2: Milestone & Rundown Details Modal (`src/components/timeline/TimelineModal.tsx`)**
  - [ ] Click interaction: Clicking any milestone or rundown node opens a responsive detail modal.
  - [ ] Display full event/session information: title, description, speaker/facilitator, location, and schedule.
  - [ ] Modal UX: Accessible backdrop overlay, Esc key close handler, focus management, and mobile-friendly dismiss button.

- [ ] **Task 3: Mock Timeline Data (`src/components/timeline/mock-timeline.ts`)**
  - [ ] Define mock milestones adhering strictly to `TimelineMilestone` from `src/lib/contracts/timeline.contract.ts` (Baksos, Ziarah, Webinar, YCR).
  - [ ] Define mock rundown sessions adhering to `RundownSession` from `src/lib/contracts/timeline.contract.ts`.
  - [ ] Export helper functions/constants to easily toggle or test the D-Day hero expansion state.

- [ ] **Task 4: Homepage Assembly (`src/app/(public)/page.tsx`)**
  - [ ] Mount the Expanding Timeline / D-Day Hero Showcase at the top of the page.
  - [ ] Embed Dave's `RegistrationForm` (`src/components/registration/RegistrationForm.tsx`) below the timeline hero.
  - [ ] When on D-Day, ensure the Rundown Showcase takes visual center stage while the registration section reflects secondary status or closed notice.
  - [ ] Apply "Sunlit Highway" container styling, background rhythm, and mobile responsive padding (`px-4 sm:px-6`).

- [ ] **Task 5: Shared Shell, Navbar & Footer (`src/components/layout/`) — [Future / TBD]**
  - [ ] Build minimal site header/navbar with YCR branding.
  - [ ] Include active navigation links to `/` (Event Landing) and `/marketplace` (Official Merch Store).
  - [ ] Build footer with UKM KMK Universitas Ciputra branding, Instagram link, and campus address.
  - [ ] Ensure tap targets are at least `44x44px` on mobile.

---

## 3. Pre-Merge Verification
```bash
npm run typecheck    # Must pass with 0 errors
npm run lint         # Must pass with 0 warnings
```
