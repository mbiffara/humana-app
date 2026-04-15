"use client";

import Image from "next/image";
import { LanguageSwitcher, useLocale } from "@/i18n/LocaleProvider";
import type { Retreat } from "@/i18n/dictionary";

type MarkerKey = "usa" | "mexico" | "brazil" | "spain" | "india" | "indonesia";

const markers: { key: MarkerKey; count: number; x: string; y: string }[] = [
  { key: "usa", count: 5, x: "18%", y: "33%" },
  { key: "mexico", count: 3, x: "19%", y: "47%" },
  { key: "brazil", count: 1, x: "30%", y: "64%" },
  { key: "spain", count: 2, x: "47%", y: "32%" },
  { key: "india", count: 2, x: "65%", y: "48%" },
  { key: "indonesia", count: 2, x: "76%", y: "65%" },
];

export default function AgencyDashboard() {
  return (
    <main className="flex min-h-screen flex-col">
      <TopNav />
      <Hero />
      <MapCoverage />
      <RetreatsSection />
    </main>
  );
}

function TopNav() {
  const { t } = useLocale();
  const links = [t.nav.discover, t.nav.bookings, t.nav.clients, t.nav.commissions];
  return (
    <nav className="flex items-center justify-between border-b border-humana-line px-16 py-6">
      <div className="flex items-center gap-3.5">
        <Image
          src="/brand/isotipo.png"
          alt=""
          width={32}
          height={32}
          priority
        />
        <Image
          src="/brand/logotipo.svg"
          alt="HUMANA"
          width={108}
          height={37}
          priority
        />
      </div>
      <div className="flex items-center gap-10">
        {links.map((label, i) => (
          <a
            key={label}
            href="#"
            className={`text-[13px] ${
              i === 0
                ? "font-medium text-humana-ink"
                : "font-normal text-humana-muted hover:text-humana-ink"
            }`}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <LanguageSwitcher />
        <span className="h-3.5 w-px bg-[#D8D4C8]" />
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-humana-stone">
            <span className="text-[11px] font-semibold text-humana-ink">
              VE
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-humana-ink">
              {t.nav.agencyName}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-humana-subtle">
              {t.nav.agencyMeta}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-10 px-16 pt-20 pb-10">
      <div className="flex max-w-[820px] flex-col gap-5">
        <div className="flex items-center gap-3.5">
          <span className="h-px w-7 bg-humana-gold" />
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-humana-gold">
            {t.hero.eyebrow}
          </span>
        </div>
        <h1 className="text-[48px] font-light leading-[56px] tracking-[-0.02em] text-humana-ink">
          {t.hero.headline[0]}
          <br />
          {t.hero.headline[1]}
        </h1>
        <p className="max-w-[620px] text-[14px] leading-[22px] text-[#4A463E]">
          {t.hero.subhead}
        </p>
      </div>
      <SearchBar />
    </section>
  );
}

function SearchBar() {
  const { t } = useLocale();
  return (
    <div className="flex items-stretch border border-humana-ink">
      <SearchField
        label={t.search.destination}
        value={t.search.destinationValue}
        flex="1.4"
        icon={
          <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </>
        }
      />
      <SearchField
        label={t.search.dates}
        value={t.search.datesValue}
        flex="1.2"
        icon={
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        }
      />
      <SearchField
        label={t.search.guests}
        value={t.search.guestsValue}
        flex="0.9"
        icon={
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        }
      />
      <SearchField
        label={t.search.experience}
        value={t.search.experienceValue}
        flex="1"
        isLast
        icon={
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20" />
          </>
        }
      />
      <button
        type="button"
        className="group flex shrink-0 items-center justify-center gap-3 bg-humana-ink px-10 text-white"
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.22em]">
          {t.search.submit}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}

function SearchField({
  label,
  value,
  icon,
  flex,
  isLast,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  flex: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 px-7 py-5 ${
        isLast ? "" : "border-r border-humana-line"
      }`}
      style={{ flex }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-humana-muted">
        {label}
      </span>
      <div className="flex items-center gap-2.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111111"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          {icon}
        </svg>
        <span className="truncate text-[14px] text-humana-ink">{value}</span>
      </div>
    </div>
  );
}

function MapCoverage() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-7 px-16 pt-4">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-humana-subtle">
            {t.map.eyebrow}
          </span>
          <h3 className="text-[22px] font-light tracking-[-0.01em] text-humana-ink">
            {t.map.title}
          </h3>
        </div>
        <div className="flex items-center gap-7">
          <Legend color="#D4AF37" label={t.map.legendActive} />
          <Legend color="#111111" label={t.map.legendUpcoming} />
          <a
            href="#"
            className="text-[12px] font-medium text-humana-gold underline underline-offset-4"
          >
            {t.map.fullscreen}
          </a>
        </div>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden border border-humana-line bg-humana-stone">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            backgroundImage: "url('/brand/world.svg')",
            backgroundSize: "cover",
            backgroundPosition: "30% center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {markers.map((m) => (
          <MapMarker
            key={m.key}
            markerKey={m.key}
            count={m.count}
            x={m.x}
            y={m.y}
          />
        ))}
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[11px] font-medium text-[#4A463E]">{label}</span>
    </div>
  );
}

function MapMarker({
  markerKey,
  count,
  x,
  y,
}: {
  markerKey: MarkerKey;
  count: number;
  x: string;
  y: string;
}) {
  const { t } = useLocale();
  const country = t.map.countries[markerKey];
  const countLabel =
    count === 1 ? t.map.experiencesSingular : t.map.experiencesPlural(count);
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2 border border-humana-ink bg-white px-3 py-2 pl-2.5">
        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-humana-ink">
          <span className="text-[11px] font-semibold text-humana-gold">
            {count}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-humana-subtle">
            {country}
          </span>
          <span className="text-[11px] font-medium text-humana-ink">
            {countLabel}
          </span>
        </div>
      </div>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="#111111">
        <path d="M5 8L0 0h10z" />
      </svg>
    </div>
  );
}

function RetreatsSection() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-10 px-16 py-20">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-humana-subtle">
            {t.retreats.eyebrow}
          </span>
          <h2 className="text-[30px] font-light leading-[38px] tracking-[-0.01em] text-humana-ink">
            {t.retreats.title}
          </h2>
          <p className="text-[13px] leading-[20px] text-humana-muted">
            {t.retreats.count}
          </p>
        </div>
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2.5">
            <FilterChip label={t.retreats.filters.all} active />
            <FilterChip label={t.retreats.filters.retreat} />
            <FilterChip label={t.retreats.filters.masterclass} />
            <FilterChip label={t.retreats.filters.corporate} />
          </div>
          <a
            href="#"
            className="text-[12px] font-medium text-humana-gold underline underline-offset-4"
          >
            {t.retreats.seeAll}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {t.retreats.items.map((r) => (
          <RetreatCard key={r.slug} retreat={r} />
        ))}
      </div>
    </section>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`border px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] ${
        active
          ? "border-humana-ink bg-humana-ink text-white"
          : "border-[#D8D4C8] text-[#4A463E] hover:border-humana-ink"
      }`}
    >
      {label}
    </button>
  );
}

function RetreatCard({ retreat }: { retreat: Retreat }) {
  return (
    <article className="flex flex-col overflow-hidden border border-humana-line bg-white">
      <div className="relative h-64 w-full bg-humana-stone">
        <Image
          src={retreat.image}
          alt={retreat.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-4 top-4 bg-white px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
            {retreat.tag}
          </span>
        </div>
        <button
          type="button"
          aria-label="Save"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-white/90 hover:bg-white"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111111"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8A8578"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-humana-muted">
              {retreat.location}
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#4A463E]">
            {retreat.dates}
          </span>
        </div>

        <h3 className="text-[20px] font-normal leading-[26px] tracking-[-0.01em] text-humana-ink">
          {retreat.title}
          <br />
          {retreat.property}
        </h3>

        <p className="text-[13px] leading-[20px] text-humana-muted">
          {retreat.description}
        </p>

        <div className="h-px bg-humana-line" />

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-humana-subtle">
              {retreat.fromLabel}
            </span>
            <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
              {retreat.price}
              <span className="text-[12px] font-normal text-humana-subtle">
                {retreat.perGuest}
              </span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-humana-gold">
              {retreat.commission}
            </span>
            <a
              href="#"
              className="text-[12px] font-medium text-humana-ink hover:text-humana-gold"
            >
              {retreat.cta}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
