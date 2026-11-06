# DESIGN.md — "Sunlit Highway" Design System

> **Owner:** Dave. Everyone reads it; changes go through Dave (see section 13).
> **Implemented by:** Kenneth, in `src/app/tokens.css` and the shared UI kit `src/components/ui/`.
> **Applies to:** every page, component and style in this repository. AI agents must read this file before writing or changing any UI.

---

## 1. Where the look comes from

The design follows the official announcement poster for **"Welcome to The Highway"**, made by the committee's design team:

- A **sunlit storybook forest**: round, cloud-like olive and chartreuse treetops, warm brown trunks, soft golden light beams.
- A **golden road winding through the middle**, which is literally "The Highway". The road is our main motif.
- A **glowing white-and-pink flower** at the centre, **white butterflies**, small **sparkles and stars**, and **holly berries** as tiny red accents.
- **Chunky, rounded lettering** with a cream-to-gold fill and a thick wood-brown outline. The headline "WELCOME TO THE HIGHWAY" is heavy and slightly slanted.
- The three emblems in a row: **Universitas Ciputra**, **KMK**, and **The Highway**.

**Mood words:** warm, hopeful, youthful, welcoming, a journey taken together. It's playful but not childish, and reverent but not stiff.

**The one rule behind everything:** the site should feel like walking down that sunlit road. Decoration welcomes people in; once they're filling in a form or paying, it gets out of the way.

---

## 2. Brand assets

| Asset | Where it goes | Status |
| :--- | :--- | :--- |
| Universitas Ciputra emblem | header (small), footer | Waiting on original file from the design team |
| KMK emblem | header (small), footer | Waiting on original file |
| The Highway emblem | header, favicon, e-ticket | Waiting on original file |
| Forest / road illustration (layered) | landing hero, thank-you screens | Waiting on layered PNG / SVG from the design team |

- Logo and illustration files go in `public/brand/` (owned by Kenneth). Use SVG for logos and WebP or AVIF for illustrations, sized for phones first (hero ≤ 200 KB at 750 px wide).
- Never redraw, recolour, stretch or add effects to the emblems. Give them clear space of at least half their height.
- Until the real files arrive, use plain placeholders (a circle with the initials). Don't use stock art or AI-generated look-alikes.

---

## 3. Colour

All colours are **design tokens** (CSS custom properties). Feature code never uses raw hex values. The site follows the phone's light or dark setting automatically.

### 3.1 Tokens

| Token | Role | Light | Dark |
| :--- | :--- | :--- | :--- |
| `--canvas` | Page background | `#FFF8E7` cream | `#1C1A0E` dusk forest |
| `--surface` | Cards, sheets, inputs | `#FFFDF6` | `#2A2814` |
| `--surface-raised` | Modals, popovers, cart drawer | `#FFFFFF` | `#34321A` |
| `--ink` | Main text | `#3B2A14` wood | `#F6EFD8` cream |
| `--ink-2` | Supporting text | `#6B5A3E` | `#CFC4A0` |
| `--ink-muted` | Captions, placeholders, metadata | `#7A6A4C` | `#A39A7C` |
| `--line` | Hairline borders, dividers | `#E8DDBF` | `#3A3720` |
| `--line-strong` | Input borders, emphasised dividers | `#D9CBA3` | `#55512F` |
| `--forest` | Brand green: secondary buttons, links, icons, "paid" | `#4F6B16` | `#B5CC5A` |
| `--forest-ink` | Green text on light tints | `#3E5410` | `#D3E28F` |
| `--on-forest` | Text on a solid `--forest` fill | `#FFF8E7` | `#1C1A0E` |
| `--leaf` | Light green decorative fill | `#C9D86A` | `#5E7320` |
| `--leaf-soft` | Success tint background | `#EEF3D2` | `#2F3A12` |
| `--sun` | Gold: highlights, "now" markers, display-title fill | `#F2C230` | `#F5C842` |
| `--sun-soft` | Pending / highlight tint background | `#FBEBB0` | `#4A3D10` |
| `--road` | Orange: the primary action | `#B5520C` | `#F08A24` |
| `--road-hover` | Primary action hover / pressed | `#9A440A` | `#F5A04A` |
| `--on-road` | Text on `--road` | `#FFF8E7` | `#2A1606` |
| `--wood` | Outlines on display titles, illustration strokes | `#7A4A12` | `#5A3A0C` |
| `--berry` | Errors and destructive actions **only** | `#B3261E` | `#F2867E` |
| `--berry-ink` | Error text on `--berry-soft` | `#8C1D17` | `#F2867E` |
| `--berry-soft` | Error tint background | `#F9DEDB` | `#4A1E1A` |
| `--lotus` | Rare soft accent (thank-you, donation) | `#F6C9D6` | `#E8A9BC` |
| `--focus` | Keyboard focus ring | `#7A4A12` | `#F5C842` |

### 3.2 Colour rules

- **Gold never carries text.** `--sun` fails contrast as a text colour on cream. Use it for fills, markers, highlights and the display-title fill only. Text on a gold fill is `--ink`.
- **Orange (`--road`) means "the main thing to do here".** One `--road` button per screen.
- **Berry red means something went wrong**, nothing else. Holly-berry decoration in illustrations is fine; berry red in UI chrome isn't.
- **Status colours are fixed:**

  | Status | Background | Text / icon |
  | :--- | :--- | :--- |
  | Paid / checked in / success | `--leaf-soft` | `--forest-ink` |
  | Pending / now | `--sun-soft` | `--ink` |
  | Expired / unchecked / neutral | `--surface` + `--line` border | `--ink-2` |
  | Failed / error | `--berry-soft` | `--berry-ink` |

  Always pair a status colour with a text label or icon. Never rely on colour alone.
- Large areas stay calm: `--canvas` and `--surface`. Green, gold and orange are accents, not backgrounds for whole sections. The landing hero illustration is the one exception.

### 3.3 Checked contrast (WCAG 2.1)

| Pair | Light | Dark |
| :--- | :--- | :--- |
| `--ink` on `--canvas` | 12.99 | 15.17 |
| `--ink-2` on `--canvas` | 6.28 | 10.02 |
| `--ink-muted` on `--canvas` | 4.97 | 6.21 |
| `--on-road` on `--road` | 4.75 | 6.88 |
| `--forest` on `--canvas` | 5.75 | — |
| `--on-forest` on `--forest` | 5.75 | 9.76 |
| `--berry` on `--canvas` | 6.17 | 7.05 |
| `--ink` on `--sun` | 8.21 | — |
| `--ink` on `--sun-soft` | 11.53 | 9.29 |
| `--berry-ink` on `--berry-soft` | 7.16 | 5.69 |
| `--forest-ink` on `--leaf-soft` | 7.41 | 8.67 |

Every pair passes AA for normal text (4.5:1). Re-check whenever a token changes.

### 3.4 Implementation

Kenneth defines the tokens once in `src/app/tokens.css`, imported by `src/app/globals.css`, and maps them to Tailwind v4 utilities:

```css
/* src/app/tokens.css */
:root {
  color-scheme: light dark;
  --canvas: #FFF8E7;
  --surface: #FFFDF6;
  --ink: #3B2A14;
  --road: #B5520C;
  /* ...every token from 3.1, light values... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #1C1A0E;
    --surface: #2A2814;
    --ink: #F6EFD8;
    --road: #F08A24;
    /* ...every token from 3.1, dark values... */
  }
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-muted: var(--ink-muted);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-forest: var(--forest);
  --color-forest-ink: var(--forest-ink);
  --color-on-forest: var(--on-forest);
  --color-leaf: var(--leaf);
  --color-leaf-soft: var(--leaf-soft);
  --color-sun: var(--sun);
  --color-sun-soft: var(--sun-soft);
  --color-road: var(--road);
  --color-road-hover: var(--road-hover);
  --color-on-road: var(--on-road);
  --color-wood: var(--wood);
  --color-berry: var(--berry);
  --color-berry-ink: var(--berry-ink);
  --color-berry-soft: var(--berry-soft);
  --color-lotus: var(--lotus);
}
```

Feature code then writes `bg-canvas`, `text-ink`, `bg-road text-on-road`, `border-line`, and so on. There's no manual dark-mode class: the tokens flip on their own.

---

## 4. Typography

### 4.1 Fonts

| Use | Font | Weights | Loaded with |
| :--- | :--- | :--- | :--- |
| **Display** (big titles) | **Lilita One** | 400 | `next/font/google`, `display: 'swap'` |
| **Text** (everything else) | **Nunito** | 400, 600, 700, 800 | `next/font/google`, `display: 'swap'` |

Both are free Google Fonts, cover Indonesian and English, and are loaded through `next/font` so there's no layout shift. Don't add other font families.

### 4.2 Scale (mobile first)

| Token | Size / line height | Font | Use |
| :--- | :--- | :--- | :--- |
| `display-xl` | 44 / 46 px (56 / 58 on ≥ 768 px) | Lilita One | Landing hero headline only |
| `display-lg` | 32 / 36 px (40 / 44) | Lilita One | Page title (one per page) |
| `display-md` | 26 / 30 px | Lilita One | Section title |
| `heading` | 20 / 28 px, 800 | Nunito | Card and modal titles |
| `subheading` | 17 / 24 px, 700 | Nunito | Group labels, timeline milestone titles |
| `body` | 16 / 24 px, 400 | Nunito | Body text, inputs (16 px stops iOS zoom-on-focus) |
| `small` | 14 / 20 px, 400–600 | Nunito | Helper text, metadata |
| `caption` | 12 / 16 px, 600 | Nunito | Badges, tiny labels (never below 12 px) |

Prices and countdowns use `font-variant-numeric: tabular-nums` so digits don't jump.

### 4.3 The display treatment

The poster lettering becomes a **display title style**:

```css
.display-title {
  font-family: var(--font-lilita);
  color: var(--sun);
  -webkit-text-stroke: 2px var(--wood);
  paint-order: stroke fill;
  text-shadow: 0 3px 0 var(--wood);
}
```

- Outlined gold titles only at **28 px and above**, and only on `--canvas` or over the illustration. Below 28 px, or on a busy background, use solid `--ink` Lilita One instead.
- At most **one outlined title per screen**. Section titles below it use solid `--ink` or `--forest` Lilita One.
- The **slanted** treatment (`transform: skewX(-8deg)`) is reserved for the landing hero line "Welcome to The Highway".
- Never set Lilita One for paragraphs, buttons, form labels, tables or the admin area.
- Sentence case for UI text. Display titles may follow the poster's title case ("The Highway Committee"). Never write paragraphs in capitals.

---

## 5. Space, shape and depth

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64 px. Page side padding is 16 px on phones and 24 px on tablets and up. The content max-width is 1120 px; forms and reading text max out at 640 px.
- **Breakpoints:** design at 375 px first, then check 768 px and 1280 px.
- **Corners:**
  - Buttons, chips and badges are **pills** (`9999px`).
  - Inputs and small controls: `12px`.
  - Cards use a **"leaf" radius**, slightly uneven like the poster's treetops: `border-radius: 20px 28px 22px 26px`. Use it on content cards only, not on inputs, tables or the admin area.
  - Modals and sheets: `24px` (top corners only for bottom sheets).
- **Shadows** are warm and soft, never grey-black:
  - `--shadow-card: 0 2px 0 var(--line), 0 6px 16px rgb(122 74 18 / 0.08)`
  - `--shadow-raised: 0 12px 32px rgb(122 74 18 / 0.16)`
  - In dark mode, use a 1 px `--line-strong` border instead of shadows.
- **Tap targets:** at least 44 × 44 px, with at least 8 px between neighbouring targets.

---

## 6. Motifs

### 6.1 The road (main motif)

- A **dashed golden road line** (`--sun`, 4 px, dash 10 / gap 8, round caps) on a soft `--leaf-soft` / `--sun-soft` verge.
- **Where it appears:**
  - `/timeline` uses the road as the vertical spine, with each milestone a stop along it.
  - Step indicators (registration, checkout, donation) are short road segments.
  - Section dividers on the landing page.
- On the timeline it's a **gentle S-curve on tablet and desktop** and a **straight line on phones**, so the content stays readable.
- **Milestone markers:**
  - past: filled `--forest` dot with a check icon;
  - now: `--sun` dot with a soft halo, labelled "Now";
  - upcoming: hollow dot with a `--line-strong` ring.

### 6.2 Leaves, light and life

- **Leaf cards:** see the radius in section 5. An optional `--leaf` blob peeking from a corner, decorative only.
- **Light beams:** a very soft diagonal gold wash, only in the landing hero and on thank-you screens.
- **Butterflies and sparkles:** small SVGs, at most 3 per viewport, only in the hero, empty states and success screens. They never sit on top of text or controls, and are `aria-hidden="true"`.
- **The flower (lotus):** used once, as the success / thank-you emblem after payment or donation.
- **Holly berries:** illustration detail only, never a UI colour (see 3.2).

---

## 7. Components

Kenneth builds these in `src/components/ui/` on shadcn/ui. Feature owners use them and never restyle a private copy. If something is missing, ask Kenneth.

### Buttons
| Variant | Look | Use |
| :--- | :--- | :--- |
| **Primary** | `--road` fill, `--on-road` text, Nunito 800 | The one main action per screen: Register, Pay, Donate, Check out |
| **Secondary** | `--forest` 1.5 px outline, `--forest-ink` text | Alternatives: View timeline, Continue shopping |
| **Ghost** | No border, `--ink-2` text, `--surface` on hover | Low-emphasis actions, icon buttons |
| **Danger** | `--berry` outline and text | Destructive admin actions only, always with a confirm step |

- Pill shape, height 48 px (44 px compact in admin), label in sentence case, verb first.
- Show a spinner and keep the label while loading; don't let people double-tap Pay.

### Form fields
- Label above (14 px, 700), input 48 px tall, 16 px text, `--surface` fill, `--line-strong` border, 12 px radius.
- Focus: 2 px `--focus` outline with a 2 px offset. Error: `--berry` border, message below in `--berry` with an icon.
- Helper text in `--ink-2`. Placeholders show a real example (`0812 3456 7890`), never the label.
- Use the right keyboard: `inputmode="tel"` for WhatsApp, `type="email"` for email, `inputmode="numeric"` for amounts.

### Cards
- `--surface`, leaf radius, `--shadow-card`, 16–20 px padding. Event, product and ticket cards share this base.
- Product cards: square image on top, name, price (tabular), stock badge. A sold-out card is dimmed with a "Sold out" badge but stays readable.

### Badges
- Pill, `caption` text, colours from the status table in 3.2.
- Stock badges: "In stock" (forest), "Only 3 left" (sun), "Sold out" (neutral).

### Timeline (Kenneth)
- See 6.1. Each milestone has a title (`subheading`), date and time (`small`, `--ink-2`, e.g. "Sat, 20 Dec · 09:00 WIB"), and an optional one-line description.
- The rundown section (tentative) uses the same road style with time blocks, and stays hidden until it has content.

### Payment modal (Dave)
- A bottom sheet on phones, a centred modal on wider screens, `--surface-raised`.
- Order: amount (large, tabular) → QRIS image or VA number with a copy button → countdown (turns `--berry` in the last 60 s) → "Waiting for payment…" status.
- Success: the lotus emblem, a "Payment received" heading and the order code. Expired: a neutral state with a "Try again" primary button.
- No decorative animation while waiting; only the countdown moves.

### Donation (Dave)
- Campaign switch as two large pills (YCR / Baksos), preset amount chips in a grid, a "Custom amount" field, then donor details.
- Thank-you screen: lotus, warm short copy, order code, a share button (optional).

### E-ticket (Kenneth)
- A ticket-shaped card with notched sides. QR on a pure white panel (even in dark mode, for scanners), at least 220 px, with name, tier and check-in badge below.
- "Save ticket image" exports the light version.

### Admin (Dave)
- Same tokens and fonts, but **no motifs**: no road, leaves, butterflies or display titles. Use straight 12 px corners, compact 44 px controls, dense tables with `--line` row dividers, and `heading` (Nunito) for page titles.
- The gate scanner screen is full-bleed camera with a huge result banner: `--leaf-soft` "Checked in" / `--berry-soft` "Already checked in" / "Not found", readable from arm's length.

### Feedback
- Toasts: `--surface-raised`, an icon in the status colour, one short sentence, auto-dismiss after 4 s (errors stay until closed).
- Loading: warm skeletons (`--line` blocks with a slow shimmer); no spinners for whole pages.
- Empty states: a small butterfly or leaf illustration, a one-line heading, and one action.

---

## 8. Icons

- **Lucide** icons at 1.75 px stroke, 20 px inline and 24 px standalone, coloured `currentColor`.
- Icon-only buttons need an `aria-label`. Decorative icons get `aria-hidden="true"`.
- Don't mix icon sets or use emoji as icons.

---

## 9. Imagery

- Illustrations come from the design team (see section 2). Photos (speakers, past events, merch) are warm and natural, with no heavy filters, and cropped to 4:5 or 1:1 for phones.
- Always use `next/image` with explicit sizes; lazy-load everything below the fold.
- Every meaningful image has a short, useful `alt` ("Black YCR 2026 t-shirt, front"). Decorative images have `alt=""`.

---

## 10. Motion

- Durations: 120 ms (press), 200 ms (hover / small changes), 320 ms (sheets, modals). Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Allowed: buttons lift slightly on hover; sheets slide up; timeline milestones fade in once as they scroll into view; butterflies drift slowly in the hero.
- Nothing loops forever except a slow butterfly drift and the payment countdown.
- **`prefers-reduced-motion: reduce`**: turn off all decorative motion and keep only instant state changes.

---

## 11. Dark mode

- Follows the phone automatically through `prefers-color-scheme`. No toggle is needed for launch.
- Tokens handle everything. Never write `dark:` overrides with raw colours in feature code.
- Illustrations get a slightly dimmed version (`filter: brightness(0.85)`) or a dusk variant from the design team.
- The ticket QR panel stays white in both modes.

---

## 12. Accessibility checklist

- Contrast: AA (4.5:1 for text, 3:1 for large text and UI borders). Use the pairs in 3.3.
- Visible focus on everything interactive (2 px `--focus` ring, 2 px offset). Never remove outlines without a replacement.
- Tap targets ≥ 44 px; inputs at 16 px text.
- Colour is never the only signal (status badges have text, errors have icons and messages).
- Headings in order (one `h1` per page); forms use real `<label>`s; the payment status change is announced with `aria-live="polite"`.
- Test every page at 375 px, with the phone's text size set larger, in both light and dark.

---

## 13. Changing the design

1. **Anyone** (including the committee's design team) can propose a change: post a screenshot or mockup and the reason to Dave.
2. **Dave** decides and updates this file in a pull request on a `chore/dave-*` branch.
3. **Kenneth** applies token or UI-kit changes in `src/app/tokens.css` and `src/components/ui/` in his own pull request.
4. Feature owners never invent new colours, fonts, radii or shadows. If you need something the system doesn't have, ask Dave instead of hard-coding it.

The design team's own direction always wins over this proposal. When they send updated colours, fonts or artwork, Dave updates the tokens here; the components follow automatically.

---

## 14. Do and don't

| Do | Don't |
| :--- | :--- |
| Use tokens: `bg-road text-on-road` | Write `#B5520C` or `bg-orange-700` in feature code |
| One orange primary button per screen | Put two orange buttons side by side |
| Outlined gold title once, at the top | Outline every heading, or use Lilita One for body text |
| Road motif on the timeline and step indicators | Draw roads behind forms or tables |
| Calm cream / dusk backgrounds | Fill whole sections with green, gold or orange |
| Status colour plus a text label | Show a red or green dot alone |
| Plain, dense admin screens | Butterflies and leaf corners in the admin |
| Real emblems from the design team | Redrawn, recoloured or AI-generated logos |

---

## 15. Open items

- [ ] Original emblem files and the layered forest / road illustration (design team → Dave → Kenneth puts them in `public/brand/`).
- [ ] Confirm or adjust the palette and fonts with the design team.
- [ ] Site language: Indonesian, English, or both (Gee / committee). Copy and font choices already support both.
- [ ] Dusk (dark) version of the hero illustration, if the design team can make one.
