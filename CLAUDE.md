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
├─ LocaleProvider (i18n, localStorage)
├─ AuthProvider (JWT auth, localStorage)
│
├─ / → Login page (public, outside route group)
├─ /accept-invite → Invitation acceptance (own layout, no auth required)
│
└─ (app) route group (src/app/(app)/layout.tsx)
   ├─ Auth guard: redirects to / if not logged in
   ├─ BookingProvider (sessionStorage)
   ├─ WizardProvider (sessionStorage)
   ├─ TopNav (shown for non-admin, non-hotel-onboarding)
   │
   ├─ /admin/* → Admin layout with AdminTopNav
   ├─ /onboarding/* → Onboarding wizards (hotel 4-step, agency, office)
   └─ All other pages (dashboard, booking flow, retreats, etc.)
```

### Routes

**Public (no auth):**
- `/` — Login
- `/accept-invite`, `/accept-invite/welcome` — Invitation acceptance flow

**Admin (`/admin/*`):**
- `/admin/dashboard` — KPIs, pending reviews, quick actions
- `/admin/network`, `/admin/network/create` — Organization management
- `/admin/subscriptions` — Subscription management
- `/admin/settings` — Platform settings

**Onboarding (`/onboarding/*`):**
- `/onboarding/hotel/step-1` through `step-4`, `/onboarding/hotel/under-review` — Hotel 4-step wizard
- `/onboarding/agency`, `/onboarding/agency/welcome` — Agency onboarding
- `/onboarding/office` — Office onboarding

**Agency workspace:**
- `/dashboard` — Main dashboard
- `/map` — Standalone map view
- `/select-country/[country]` — Country detail with tabs for retreats/hotels
- `/select-country/[country]/retreats`, `/select-country/[country]/retreats/[slug]` — Browse/detail
- `/select-country/[country]/hotels`, `/select-country/[country]/hotels/[slug]` — Browse/detail
- `/select-country/[country]/step-1-select-dates` through `step-5-confirmation` — Booking flow (5 steps within country context)
- `/select-dates`, `/select-accommodation`, `/assign-client`, `/checkout`, `/confirmation` — Legacy booking flow
- `/create-retreat/step-1` through `step-6` — Retreat creation wizard (own layout with StepIndicator)

### State Management

**Four context providers:**

| Provider | Hook | Storage | Purpose |
|---|---|---|---|
| `AuthProvider` | `useAuth()` → `{ user, loading, login, logout, setUser, isAdmin }` | localStorage `humana.token` | JWT auth, user state |
| `LocaleProvider` | `useLocale()` → `{ locale, setLocale, t }` | localStorage `humana.locale` | i18n (en/es/pt) |
| `BookingProvider` | `useBooking()` → `{ state, set, reset }` | sessionStorage `humana.booking` | Booking flow state |
| `WizardProvider` | `useWizard()` → `{ state, set, reset }` | sessionStorage `humana.wizard` | Create-retreat wizard state |

A fifth context, `HotelWizardContext`, is used specifically for the hotel onboarding wizard at `/onboarding/hotel/*`.

### API Client Layer

Full backend integration via `src/lib/`:

- **`api.ts`** — Core fetch wrapper with JWT token management (`tokenStore`), auto-redirect on 401, error normalization via `ApiError` class. Base URL from `NEXT_PUBLIC_API_URL`.
- **`api/admin.ts`** — Admin endpoints: stats, organizations, users (invite/approve/reject/suspend), invitations, countries, platform settings, subscription plans, subscriptions
- **`api/hotel.ts`** — Hotel workspace: profile, room types, amenities, images
- **`api/invitations.ts`** — Public invitation validation + acceptance
- **`types.ts`** — TypeScript interfaces matching Rails serializer output (Organization, User, Invitation, SubscriptionPlan, Subscription, PlatformSetting, Country, LoginResponse, MeResponse, PaginationMeta)

### Static Data Layer

Some data still comes from static TypeScript modules in `src/data/` (used by agency booking/wizard flows):
- `types.ts` — Frontend-only type definitions (Country, Hotel, RoomType, RetreatData, Client, InventoryBlock)
- `countries.ts`, `hotels.ts`, `retreats.ts`, `clients.ts`, `inventory.ts` — Sample records

These coexist with the API layer — admin and hotel onboarding use the API; agency booking flow still uses static data.

### i18n

`src/i18n/dictionary.ts` (~2500 lines) holds nested translation objects for en/es/pt. Access via `const { t } = useLocale()` then `t.sectionName.key`. Default locale is `"en"`.

### Components (`src/components/`)

**Shared:** Breadcrumb, TopNav, ComingSoon, CounterControl, FilterChip, FormField, HotelCard, RetreatCard, StepIndicator, WizardVistaPrevia, WorldMap.

**Admin (`src/components/admin/`):** AdminTopNav, ApproveModal, CreateUserModal, DateRangePicker, KpiCard, OfficeCard, Pagination, PendingInvitationsList, QuickActionCard, RejectModal, ReviewDrawer, StatusBadge.

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
