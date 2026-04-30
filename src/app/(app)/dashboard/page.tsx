"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LanguageSwitcher, useLocale } from "@/i18n/LocaleProvider";
import type { Retreat } from "@/i18n/dictionary";
import { retreats as retreatsData } from "@/data/retreats";
import { countries, countryIdToSlug } from "@/data/countries";
import { CounterControl } from "@/components/CounterControl";
import { FilterChip } from "@/components/FilterChip";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full border border-humana-line bg-humana-stone shimmer" />
  ),
});

export default function AgencyDashboard() {
  return (
    <div className="flex flex-col">
      <Hero />
      <MapCoverage />
      <RetreatsSection />
      <CreateRetreatBanner />
    </div>
  );
}

function Hero() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-10 px-16 pt-20 pb-10">
      <div className="flex max-w-[820px] flex-col gap-5">
        <div className="flex items-center gap-3.5">
          <span className="h-px w-7 bg-humana-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-gold">
            {t.hero.eyebrow}
          </span>
        </div>
        <h1 className="text-[48px] font-light leading-[56px] tracking-[-0.02em] text-humana-ink">
          {t.hero.headline[0]}
          <br />
          {t.hero.headline[1]}
        </h1>
        <p className="max-w-[620px] text-[15px] leading-[22px] text-[#4A463E]">
          {t.hero.subhead}
        </p>
      </div>
      <SearchBar />
    </section>
  );
}

/* ─── Calendar helpers (shared with select-dates) ─── */
const MONTH_NAMES = [
  ["January","February","March","April","May","June","July","August","September","October","November","December"],
  ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
  ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
];
const WEEKDAY_NAMES = [
  ["Mo","Tu","We","Th","Fr","Sa","Su"],
  ["Lu","Ma","Mi","Ju","Vi","Sá","Do"],
  ["Se","Te","Qu","Qu","Se","Sá","Do"],
];
function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year: number, month: number) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }
function toDateStr(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

type DropdownId = "destination" | "dates" | "guests" | "experience";

function SearchBar() {
  const { locale, t } = useLocale();
  const barRef = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(
    () => new Set(["retreat", "masterclass"])
  );
  const [startDate, setStartDate] = useState<string | null>("2026-05-14");
  const [endDate, setEndDate] = useState<string | null>("2026-05-21");
  const [calMonth, setCalMonth] = useState(4); // May = 4
  const [calYear, setCalYear] = useState(2026);

  const toggle = useCallback((id: DropdownId) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  // Click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape key
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Display values
  const localeIdx = locale === "es" ? 1 : locale === "pt" ? 2 : 0;

  const destDisplay = selectedDestination
    ? `${countries.find((c) => c.id === selectedDestination)?.flag ?? ""} ${t.map.countries[countryIdToSlug[selectedDestination] as keyof typeof t.map.countries] ?? ""}`
    : null;

  const guestDisplay = `${t.search.adultCount(adults)} · ${t.search.roomCount(rooms)}`;

  const expLabels: Record<string, string> = {
    retreat: t.retreats.filters.retreat,
    masterclass: t.retreats.filters.masterclass,
    corporate: t.retreats.filters.corporate,
  };
  const expDisplay =
    selectedExperiences.size > 0
      ? Array.from(selectedExperiences)
          .map((k) => expLabels[k])
          .join(" · ")
      : null;

  const formatDateRange = () => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const sm = MONTH_NAMES[localeIdx][s.getMonth()].slice(0, 3).toLowerCase();
    const em = MONTH_NAMES[localeIdx][e.getMonth()].slice(0, 3).toLowerCase();
    return locale === "en"
      ? `${sm.charAt(0).toUpperCase() + sm.slice(1)} ${s.getDate()} — ${em.charAt(0).toUpperCase() + em.slice(1)} ${e.getDate()}`
      : `${s.getDate()} ${sm} — ${e.getDate()} ${em}`;
  };

  const toggleExperience = (key: string) => {
    setSelectedExperiences((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Calendar date click
  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
    } else {
      if (dateStr < startDate) {
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  const calPrev = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const calNext = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };
  const month2 = calMonth === 11 ? 0 : calMonth + 1;
  const year2 = calMonth === 11 ? calYear + 1 : calYear;

  return (
    <div ref={barRef} className="relative flex items-stretch border border-humana-ink">
      {/* Destination */}
      <SearchField
        label={t.search.destination}
        displayValue={destDisplay}
        placeholder={t.search.destinationValue}
        flex="1.4"
        isOpen={openDropdown === "destination"}
        onClick={() => toggle("destination")}
        icon={
          <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </>
        }
      >
        <div className="absolute left-0 top-full z-50 mt-px w-[340px] animate-fade-in-down border border-humana-line bg-white shadow-lg">
          <div className="px-5 pt-5 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.search.popularDestinations}
            </span>
          </div>
          <div className="flex flex-col">
            {countries.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setSelectedDestination(c.id); setOpenDropdown(null); }}
                className={`flex items-center gap-3.5 px-5 py-3 text-left transition-colors duration-150 hover:bg-humana-stone ${
                  selectedDestination === c.id ? "bg-humana-stone" : ""
                }`}
              >
                <span className="text-[18px]">{c.flag}</span>
                <span className="text-[14px] text-humana-ink">
                  {t.map.countries[countryIdToSlug[c.id] as keyof typeof t.map.countries] ?? c.name}
                </span>
                {selectedDestination === c.id && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="h-1.5" />
        </div>
      </SearchField>

      {/* Dates */}
      <SearchField
        label={t.search.dates}
        displayValue={formatDateRange()}
        placeholder={t.search.datesValue}
        flex="1.2"
        isOpen={openDropdown === "dates"}
        onClick={() => toggle("dates")}
        icon={
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        }
      >
        <div className="absolute left-1/2 top-full z-50 mt-px w-[520px] -translate-x-1/2 animate-fade-in-down border border-humana-line bg-white p-6 shadow-lg">
          {/* Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={calPrev} className="flex h-8 w-8 items-center justify-center border border-humana-line transition-colors hover:border-humana-ink">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div className="flex gap-16 text-[14px] font-medium text-humana-ink">
              <span>{MONTH_NAMES[localeIdx][calMonth]} {calYear}</span>
              <span>{MONTH_NAMES[localeIdx][month2]} {year2}</span>
            </div>
            <button type="button" onClick={calNext} className="flex h-8 w-8 items-center justify-center border border-humana-line transition-colors hover:border-humana-ink">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
          {/* Two month grids */}
          <div className="flex gap-6">
            <CalendarMonth year={calYear} month={calMonth} weekdays={WEEKDAY_NAMES[localeIdx]} startDate={startDate} endDate={endDate} onDateClick={handleDateClick} />
            <CalendarMonth year={year2} month={month2} weekdays={WEEKDAY_NAMES[localeIdx]} startDate={startDate} endDate={endDate} onDateClick={handleDateClick} />
          </div>
        </div>
      </SearchField>

      {/* Guests */}
      <SearchField
        label={t.search.guests}
        displayValue={guestDisplay}
        placeholder={t.search.guestsValue}
        flex="0.9"
        isOpen={openDropdown === "guests"}
        onClick={() => toggle("guests")}
        icon={
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        }
      >
        <div className="absolute left-0 top-full z-50 mt-px w-[300px] animate-fade-in-down border border-humana-line bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-5">
            <CounterControl label={t.search.adultsLabel} value={adults} min={1} onChange={setAdults} />
            <CounterControl label={t.search.roomsLabel} value={rooms} min={1} onChange={setRooms} />
          </div>
        </div>
      </SearchField>

      {/* Experience */}
      <SearchField
        label={t.search.experience}
        displayValue={expDisplay}
        placeholder={t.search.experienceValue}
        flex="1"
        isLast
        isOpen={openDropdown === "experience"}
        onClick={() => toggle("experience")}
        icon={
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20" />
          </>
        }
      >
        <div className="absolute right-0 top-full z-50 mt-px w-[300px] animate-fade-in-down border border-humana-line bg-white p-6 shadow-lg">
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.search.experienceLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <FilterChip label={t.retreats.filters.retreat} active={selectedExperiences.has("retreat")} onClick={() => toggleExperience("retreat")} />
            <FilterChip label={t.retreats.filters.masterclass} active={selectedExperiences.has("masterclass")} onClick={() => toggleExperience("masterclass")} />
            <FilterChip label={t.retreats.filters.corporate} active={selectedExperiences.has("corporate")} onClick={() => toggleExperience("corporate")} />
          </div>
        </div>
      </SearchField>

      <button
        type="button"
        className="group flex shrink-0 cursor-pointer items-center justify-center gap-3 bg-humana-ink px-10 text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
      >
        <span className="text-[13px] font-semibold uppercase tracking-[0.22em]">
          {t.search.submit}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}

function SearchField({
  label,
  displayValue,
  placeholder,
  icon,
  flex,
  isLast,
  isOpen,
  onClick,
  children,
}: {
  label: string;
  displayValue: string | null;
  placeholder: string;
  icon: React.ReactNode;
  flex: string;
  isLast?: boolean;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" style={{ flex, minWidth: 0 }}>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full min-w-0 cursor-pointer flex-col gap-1.5 px-7 py-5 text-left transition-colors duration-150 ${
          isLast ? "" : "border-r border-humana-line"
        } ${isOpen ? "bg-humana-stone/50" : "hover:bg-humana-stone/30"}`}
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">
          {label}
        </span>
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            {icon}
          </svg>
          <span className="min-w-0 flex-1 truncate text-[15px] text-humana-ink">
            {displayValue ?? placeholder}
          </span>
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {isOpen && (
          <span className="absolute bottom-0 left-7 right-7 h-[2px] bg-humana-gold" />
        )}
      </button>
      {isOpen && children}
    </div>
  );
}

/* ─── Calendar month grid ─── */
function CalendarMonth({
  year, month, weekdays, startDate, endDate, onDateClick,
}: {
  year: number; month: number; weekdays: string[];
  startDate: string | null; endDate: string | null;
  onDateClick: (d: string) => void;
}) {
  const days = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);
  const cells: (number | null)[] = [
    ...Array.from<null>({ length: offset }).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex-1">
      <div className="mb-2 grid grid-cols-7 gap-0">
        {weekdays.map((wd, i) => (
          <span key={i} className="py-1 text-center text-[11px] font-medium uppercase tracking-wider text-humana-muted">
            {wd}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const dateStr = toDateStr(year, month, day);
          const isStart = dateStr === startDate;
          const isEnd = dateStr === endDate;
          const inRange = !!(startDate && endDate && dateStr > startDate && dateStr < endDate);

          let cls = "calendar-day flex h-9 items-center justify-center text-[13px]";
          if (isStart) cls += " calendar-day-range-start";
          else if (isEnd) cls += " calendar-day-range-end";
          else if (inRange) cls += " calendar-day-in-range";

          return (
            <button key={i} type="button" onClick={() => onDateClick(dateStr)} className={cls}>
              {day}
            </button>
          );
        })}
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
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-subtle">
            {t.map.eyebrow}
          </span>
          <h3 className="text-[22px] font-light tracking-[-0.01em] text-humana-ink">
            {t.map.title}
          </h3>
        </div>
        <Link
          href="/map"
          className="flex items-center gap-2 border border-humana-line px-4 py-2 text-[13px] font-medium text-humana-ink transition-all hover:border-humana-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          {t.map.fullscreen}
        </Link>
      </div>

      <WorldMap />
    </section>
  );
}


function RetreatsSection() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-10 px-16 py-20">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-subtle">
            {t.retreats.eyebrow}
          </span>
          <h2 className="text-[30px] font-light leading-[38px] tracking-[-0.01em] text-humana-ink">
            {t.retreats.title}
          </h2>
          <p className="text-[14px] leading-[20px] text-humana-muted">{t.retreats.count}</p>
        </div>
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2.5">
            <FilterChipLocal label={t.retreats.filters.all} active />
            <FilterChipLocal label={t.retreats.filters.retreat} />
            <FilterChipLocal label={t.retreats.filters.masterclass} />
            <FilterChipLocal label={t.retreats.filters.corporate} />
          </div>
          <span className="text-[13px] font-medium text-humana-gold underline underline-offset-4 cursor-default">
            {t.retreats.seeAll}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {t.retreats.items.map((r) => (
          <RetreatCardLocal key={r.slug} retreat={r} />
        ))}
      </div>
    </section>
  );
}

function CreateRetreatBanner() {
  const { t } = useLocale();
  return (
    <section className="relative mx-16 mb-20 overflow-hidden bg-humana-ink">
      {/* Decorative isotipo */}
      <div className="pointer-events-none absolute -right-12 -bottom-10 h-[320px] w-[320px] opacity-[0.07]">
        <Image src="/brand/isotipo.png" alt="" fill className="object-contain" />
      </div>
      {/* Subtle gold gradient accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-humana-gold/[0.06] via-transparent to-transparent" />

      <div className="relative flex items-center justify-between gap-10 px-14 py-16">
        <div className="flex items-center gap-10">
          {/* Small isotipo inline */}
          <div className="relative hidden h-16 w-16 shrink-0 lg:block">
            <Image src="/brand/isotipo.png" alt="" fill className="object-contain opacity-80" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <span className="h-px w-7 bg-humana-gold" />
              <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-humana-gold">
                {t.nav.agencyName}
              </span>
            </div>
            <h3 className="text-[28px] font-light tracking-[-0.01em] text-white">
              {t.dashboard.createRetreatTitle}
            </h3>
            <p className="max-w-[520px] text-[15px] leading-[22px] text-white/60">
              {t.dashboard.createRetreatDesc}
            </p>
          </div>
        </div>
        <Link
          href="/create-retreat/step-1"
          className="group/cta flex shrink-0 items-center gap-3 border border-humana-gold bg-humana-gold px-10 py-4.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-all duration-200 hover:bg-transparent hover:text-humana-gold active:scale-[0.98]"
        >
          {t.dashboard.createRetreatCta}
          <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
            <path d="M1 5h14M10 1l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function FilterChipLocal({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`border px-3.5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-150 hover:opacity-90 active:scale-[0.98] ${
        active
          ? "border-humana-ink bg-humana-ink text-white"
          : "border-[#D8D4C8] text-[#4A463E] hover:border-humana-ink"
      }`}
    >
      {label}
    </button>
  );
}

function RetreatCardLocal({ retreat }: { retreat: Retreat }) {
  const dataRetreat = retreatsData.find(r => r.slug === retreat.slug);
  const countrySlug = dataRetreat ? (countryIdToSlug[dataRetreat.country] ?? dataRetreat.country) : "mexico";
  return (
    <article className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/select-country/${countrySlug}/retreats/${retreat.slug}`} className="relative h-64 w-full bg-humana-stone">
        <Image src={retreat.image} alt={retreat.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <div className="absolute left-4 top-4 bg-white px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">{retreat.tag}</span>
        </div>
      </Link>

      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-humana-muted">{retreat.location}</span>
          </div>
          <span className="text-[12px] font-medium text-[#4A463E]">{retreat.dates}</span>
        </div>

        <h3 className="text-[20px] font-normal leading-[26px] tracking-[-0.01em] text-humana-ink">
          {retreat.title}
          <br />
          {retreat.property}
        </h3>

        <p className="text-[14px] leading-[20px] text-humana-muted">{retreat.description}</p>

        <div className="h-px bg-humana-line" />

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{retreat.fromLabel}</span>
            <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
              {retreat.price}
              <span className="text-[13px] font-normal text-humana-subtle">{retreat.perGuest}</span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-gold">{retreat.commission}</span>
            <Link href={`/select-country/${countrySlug}/retreats/${retreat.slug}`} className="text-[13px] font-medium text-humana-ink transition-colors hover:text-humana-gold">
              {retreat.cta}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
