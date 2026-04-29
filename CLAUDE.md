# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Dev server (port 3000)
npm run build    # Production build — TypeScript strict, no errors allowed
npm run lint     # ESLint 9 (flat config)
```

No test framework is configured.

## Tech Stack

- **Next.js 16.2.3** (App Router) + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS v4** — configured via `@theme` block in `globals.css`, not a `tailwind.config` file
- **Inter** font via `next/font/google` (weights 300–700)
- **react-simple-maps** + **react-zoom-pan-pinch** for interactive world map
- Path alias: `@/*` → `./src/*`

## Architecture

### Layout Hierarchy

```
RootLayout (src/app/layout.tsx)
└─ LocaleProvider (i18n context, localStorage)
   ├─ / → Login page (public, outside route group)
   └─ (app) route group (src/app/(app)/layout.tsx)
      ├─ BookingProvider (sessionStorage)
      ├─ WizardProvider (sessionStorage)
      ├─ TopNav (sticky)
      └─ {page content}
```

### Routes (21 total)

- `/` — Login (public)
- `/dashboard` — Main dashboard
- `/retreats`, `/retreats/[slug]` — Retreat list + detail
- `/hotels`, `/hotels/[slug]` — Hotel list + detail
- `/select-country` → `/select-dates` → `/select-accommodation` → `/assign-client` → `/checkout` → `/confirmation` — Booking flow (6 steps, state in BookingContext)
- `/create-retreat` → `step-2` through `step-6` — Wizard (6 steps, state in WizardContext, own layout with StepIndicator)
- `/select-country/[country]` — Country-specific view
- `/inventory` — Inventory management

### State Management

All pages are `"use client"`. No API backend — static demo data only.

**Three context providers:**

| Provider | Hook | Storage | Purpose |
|---|---|---|---|
| `LocaleProvider` | `useLocale()` → `{ locale, setLocale, t }` | localStorage `humana.locale` | i18n (en/es/pt) |
| `BookingProvider` | `useBooking()` → `{ state, set, reset }` | sessionStorage `humana.booking` | Booking flow state |
| `WizardProvider` | `useWizard()` → `{ state, set, reset }` | sessionStorage `humana.wizard` | Create-retreat wizard state |

### Data Layer

Static TypeScript modules in `src/data/`:
- `types.ts` — All type definitions (Country, Hotel, RoomType, RetreatData, Client, InventoryBlock, etc.)
- `countries.ts` — 7 countries with emoji flags
- `hotels.ts` — Hotels with room types, amenities, galleries
- `retreats.ts` — Retreats with day-by-day programs, pricing, included items
- `clients.ts` — Sample client records
- `inventory.ts` — Room availability blocks

### i18n

`src/i18n/dictionary.ts` (~1400 lines) holds nested translation objects for en/es/pt. Access via `const { t } = useLocale()` then `t.sectionName.key`. Default locale is `"en"`.

### Components (`src/components/`)

Breadcrumb, TopNav, RetreatCard, HotelCard, FilterChip, CounterControl, FormField, StepIndicator, WorldMap.

## Theme & Styling

### Custom Colors (defined in `globals.css` `@theme` block)

| Token | Hex | Usage |
|---|---|---|
| `humana-gold` | `#d4af37` | Primary accent, CTAs, eyebrow labels |
| `humana-gold-light` | `#f5ecd0` | Light gold backgrounds |
| `humana-stone` | `#f5f5f0` | Page backgrounds |
| `humana-ink` | `#111` | Primary text |
| `humana-muted` | `#6e6a5f` | Secondary text |
| `humana-subtle` | `#8a8578` | Tertiary text |
| `humana-line` | `#e6e2d6` | Borders, dividers |

### Responsive Scaling

CSS `zoom` on `<html>` scales the entire UI on larger screens (1.05x at 1440px → 1.25x at 2560px). Base design target is ~1280px.

### Animation System

`globals.css` defines 14+ keyframe animations and a `.stagger-children` utility that auto-delays child animations (up to 8 items). Key animations: `fade-in-up`, `fade-in-scale`, `shimmer`, `pulse-gold`, `sidebar-slide-in`.

## UI Conventions

- Gold small-caps eyebrow: `text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold`
- Button text: `text-[13px] font-semibold uppercase tracking-[0.22em]`
- Breadcrumb at top of inner pages
- Gallery grid: 65% main image + 35% column of 2 stacked images
- Card hover: translate-y + shadow transition

## Next.js 16 Gotchas

- `useParams()` returns a Promise — use `React.use(params)` to unwrap
- Tailwind v4 uses `@theme` in CSS, not `tailwind.config.ts`
- Read `node_modules/next/dist/docs/` for updated API docs before implementing unfamiliar patterns
