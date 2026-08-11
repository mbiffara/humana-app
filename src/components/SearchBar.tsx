"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { countries, countryIdToSlug } from "@/data/countries";
import { CounterControl } from "@/components/CounterControl";

/* ─── Calendar helpers ─── */
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

interface SearchBarProps {
  initialDestinations?: string[];
  initialTypes?: string[];
  initialFrom?: string;
  initialTo?: string;
  initialGuests?: number;
}

export function SearchBar({ initialDestinations, initialTypes, initialFrom, initialTo, initialGuests }: SearchBarProps) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<Set<string>>(
    () => new Set(initialDestinations ?? [])
  );
  const [guests, setGuests] = useState(initialGuests ?? 1);
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(
    () => new Set(initialTypes ?? [])
  );
  const [startDate, setStartDate] = useState<string | null>(initialFrom ?? null);
  const [endDate, setEndDate] = useState<string | null>(initialTo ?? null);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());

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

  const destDisplay = selectedDestinations.size > 0
    ? Array.from(selectedDestinations)
        .map((id) => {
          const c = countries.find((c) => c.id === id);
          return `${c?.flag ?? ""} ${t.map.countries[countryIdToSlug[id] as keyof typeof t.map.countries] ?? ""}`;
        })
        .join(", ")
    : null;

  const guestDisplay = t.search.guestCount(guests);

  const expLabels: Record<string, string> = {
    wellness: t.hotelWs.retreats.wizard.types.wellness,
    spiritual: t.hotelWs.retreats.wizard.types.spiritual,
    liderazgo_mujeres: t.hotelWs.retreats.wizard.types.liderazgo_mujeres,
    constelaciones_familiares: t.hotelWs.retreats.wizard.types.constelaciones_familiares,
    breathwork: t.hotelWs.retreats.wizard.types.breathwork,
    neurociencia: t.hotelWs.retreats.wizard.types.neurociencia,
    kabbalah: t.hotelWs.retreats.wizard.types.kabbalah,
    mindfulness: t.hotelWs.retreats.wizard.types.mindfulness,
  };
  const expDisplay =
    selectedExperiences.size > 0
      ? Array.from(selectedExperiences)
          .map((k) => expLabels[k])
          .join(" · ")
      : t.search.experienceValue;

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDestinations.size > 0) {
      params.set("countries", Array.from(selectedDestinations).join(","));
    }
    if (selectedExperiences.size > 0) {
      params.set("types", Array.from(selectedExperiences).join(","));
    }
    if (startDate && endDate) {
      params.set("from", startDate);
      params.set("to", endDate);
    }
    if (guests > 1) {
      params.set("guests", String(guests));
    }
    const qs = params.toString();
    router.push(qs ? `/retreats?${qs}` : "/retreats");
  };

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
          <div className="flex max-h-[320px] flex-col overflow-y-auto">
            {countries.map((c) => {
              const isSelected = selectedDestinations.has(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedDestinations((prev) => {
                      const next = new Set(prev);
                      if (next.has(c.id)) next.delete(c.id);
                      else next.add(c.id);
                      return next;
                    });
                  }}
                  className={`flex cursor-pointer items-center gap-3.5 px-5 py-3 text-left transition-colors duration-150 hover:bg-humana-stone ${
                    isSelected ? "bg-humana-stone" : ""
                  }`}
                >
                  <span className="text-[18px]">{c.flag}</span>
                  <span className="text-[14px] text-humana-ink">
                    {t.map.countries[countryIdToSlug[c.id] as keyof typeof t.map.countries] ?? c.name}
                  </span>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
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
            <CounterControl label={t.search.guests} value={guests} min={1} onChange={setGuests} />
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
        <div className="absolute right-0 top-full z-50 mt-px w-[300px] animate-fade-in-down border border-humana-line bg-white shadow-lg">
          <div className="px-6 pt-6 pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.search.experienceLabel}
            </span>
          </div>
          <div className="flex max-h-[320px] flex-col overflow-y-auto px-6 pb-6">
            {Object.entries(expLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleExperience(key)}
                className={`flex cursor-pointer items-center justify-between px-3 py-2.5 text-left text-[14px] transition-colors duration-150 hover:bg-humana-stone ${
                  selectedExperiences.has(key) ? "bg-humana-stone font-medium text-humana-ink" : "text-humana-muted"
                }`}
              >
                <span>{label}</span>
                {selectedExperiences.has(key) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </SearchField>

      <button
        type="button"
        onClick={handleSearch}
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
          <span className={`min-w-0 flex-1 truncate text-[15px] ${displayValue ? "text-humana-ink" : "text-humana-muted"}`}>
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
