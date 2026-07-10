/** Custom date range picker: calendar button + presets dropdown, side by side. */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface DateRangePickerProps {
  from: string;
  to: string;
  locale: string;
  onChange: (range: { from: string; to: string }) => void;
  platformSince?: string;
}

const MONTH_NAMES: Record<string, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
};

const DAY_NAMES: Record<string, string[]> = {
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
  pt: ["Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
};

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parse(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function isSameDay(a: string, b: string) {
  return a === b;
}

function isInRange(date: string, from: string, to: string) {
  return date > from && date < to;
}

/* ── Calendar month grid ─────────────────────────────────────── */

function CalendarMonth({
  year, month, locale, selectedFrom, selectedTo, hoverDate, onSelect, onHover, onPrev, onNext,
}: {
  year: number; month: number; locale: string;
  selectedFrom: string | null; selectedTo: string | null; hoverDate: string | null;
  onSelect: (date: string) => void; onHover: (date: string | null) => void;
  onPrev?: () => void; onNext?: () => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days = DAY_NAMES[locale] || DAY_NAMES.en;
  const months = MONTH_NAMES[locale] || MONTH_NAMES.en;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const rangeEnd = selectedTo || hoverDate;

  return (
    <div className="w-[260px]">
      <div className="mb-3 flex items-center justify-between">
        {onPrev ? (
          <button onClick={onPrev} className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md text-humana-muted transition-colors hover:bg-humana-stone hover:text-humana-ink">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        ) : <span className="w-7" />}
        <span className="text-[13px] font-semibold text-humana-ink">{months[month]} {year}</span>
        {onNext ? (
          <button onClick={onNext} className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md text-humana-muted transition-colors hover:bg-humana-stone hover:text-humana-ink">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ) : <span className="w-7" />}
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0">
        {days.map((d, i) => (
          <div key={i} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-humana-subtle">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="h-8" />;
          const dateStr = fmt(new Date(year, month, day));
          const isFrom = selectedFrom && isSameDay(dateStr, selectedFrom);
          const isTo = selectedTo && isSameDay(dateStr, selectedTo);
          const isSelected = isFrom || isTo;
          const inRange = selectedFrom && rangeEnd && isInRange(dateStr, selectedFrom < rangeEnd ? selectedFrom : rangeEnd, selectedFrom < rangeEnd ? rangeEnd : selectedFrom);
          const isToday = dateStr === fmt(new Date());
          return (
            <button
              key={dateStr}
              onClick={() => onSelect(dateStr)}
              onMouseEnter={() => onHover(dateStr)}
              className={`cursor-pointer relative flex h-8 items-center justify-center text-[12px] transition-all duration-100 ${
                isSelected
                  ? "z-10 rounded-full bg-humana-gold font-semibold text-white"
                  : inRange
                    ? "bg-humana-gold/10 text-humana-ink"
                    : "text-humana-ink hover:rounded-full hover:bg-humana-stone"
              } ${isToday && !isSelected ? "font-semibold text-humana-gold" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Presets config ───────────────────────────────────────────── */

const PRESET_LABELS: Record<string, Record<string, string>> = {
  "1d":   { en: "Today",    es: "Hoy",       pt: "Hoje" },
  "7d":   { en: "7 days",   es: "7 días",    pt: "7 dias" },
  "30d":  { en: "1 month",  es: "1 mes",     pt: "1 mês" },
  "90d":  { en: "Quarter",  es: "Trimestre", pt: "Trimestre" },
  "365d": { en: "1 year",   es: "1 año",     pt: "1 ano" },
  "all":  { en: "Total",    es: "Total",     pt: "Total" },
};

const PRESETS = [
  { key: "1d", days: 0 },
  { key: "7d", days: 7 },
  { key: "30d", days: 30 },
  { key: "90d", days: 90 },
  { key: "365d", days: 365 },
  { key: "all", days: -1 },
];

/* ── Main component ──────────────────────────────────────────── */

export function DateRangePicker({ from, to, locale, onChange, platformSince }: DateRangePickerProps) {
  const [calOpen, setCalOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [selecting, setSelecting] = useState<"from" | "to">("from");
  const [tempFrom, setTempFrom] = useState<string | null>(from);
  const [tempTo, setTempTo] = useState<string | null>(to);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState("all");
  const calRef = useRef<HTMLDivElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);

  const fromDate = parse(from);
  const [leftMonth, setLeftMonth] = useState(fromDate.getMonth());
  const [leftYear, setLeftYear] = useState(fromDate.getFullYear());

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
      if (presetsRef.current && !presetsRef.current.contains(e.target as Node)) setPresetsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback((dateStr: string) => {
    if (selecting === "from") {
      setTempFrom(dateStr);
      setTempTo(null);
      setSelecting("to");
    } else {
      const finalFrom = tempFrom && dateStr < tempFrom ? dateStr : tempFrom!;
      const finalTo = tempFrom && dateStr < tempFrom ? tempFrom : dateStr;
      setTempFrom(finalFrom);
      setTempTo(finalTo);
      onChange({ from: finalFrom, to: finalTo });
      setSelecting("from");
      setCalOpen(false);
      setActivePreset("");
    }
  }, [selecting, tempFrom, onChange]);

  const prevMonth = () => {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(leftYear - 1); }
    else setLeftMonth(leftMonth - 1);
  };
  const nextMonth = () => {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(leftYear + 1); }
    else setLeftMonth(leftMonth + 1);
  };

  const openCalendar = () => {
    setTempFrom(from);
    setTempTo(to);
    setSelecting("from");
    const d = parse(from);
    setLeftMonth(d.getMonth());
    setLeftYear(d.getFullYear());
    setPresetsOpen(false);
    setCalOpen(true);
  };

  const applyPreset = (key: string, days: number) => {
    const end = new Date();
    const start = days === -1 ? parse(platformSince || fmt(new Date())) : new Date();
    if (days !== -1) start.setDate(start.getDate() - days);
    const range = { from: fmt(start), to: fmt(end) };
    setTempFrom(range.from);
    setTempTo(range.to);
    setActivePreset(key);
    onChange(range);
    setPresetsOpen(false);
  };

  const localeStr = locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US";
  const formatDisplay = (d: string) =>
    parse(d).toLocaleDateString(localeStr, { day: "numeric", month: "short" });

  const activeLabel = activePreset
    ? (PRESET_LABELS[activePreset]?.[locale] || PRESET_LABELS[activePreset]?.en)
    : null;

  return (
    <div className="flex items-center gap-2">
      {/* ── Presets dropdown (first) ──────────────────────── */}
      <div ref={presetsRef} className="relative">
        <button
          onClick={() => { setPresetsOpen(!presetsOpen); setCalOpen(false); }}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-humana-line bg-white px-3.5 py-2 text-[12px] font-medium text-humana-ink transition-all duration-200 hover:border-humana-gold/30 hover:shadow-sm"
        >
          <span>{activeLabel || formatDisplay(from) + " — " + formatDisplay(to)}</span>
          <svg className="h-3 w-3 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {presetsOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-xl border border-humana-line bg-white py-2 shadow-xl shadow-black/8 animate-[fade-in-up_0.15s_ease-out]">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key, p.days)}
                className={`cursor-pointer flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12px] transition-colors ${
                  activePreset === p.key
                    ? "bg-humana-gold/10 font-semibold text-humana-gold"
                    : "text-humana-ink hover:bg-humana-stone"
                }`}
              >
                {activePreset === p.key && (
                  <svg className="h-3.5 w-3.5 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                <span className={activePreset === p.key ? "" : "ml-6"}>
                  {PRESET_LABELS[p.key][locale] || PRESET_LABELS[p.key].en}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Calendar button ────────────────────────────────── */}
      <div ref={calRef} className="relative">
        <button
          onClick={openCalendar}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-humana-line bg-white px-3.5 py-2 text-[12px] font-medium text-humana-ink transition-all duration-200 hover:border-humana-gold/30 hover:shadow-sm"
        >
          <svg className="h-4 w-4 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>{formatDisplay(from)}</span>
          <span className="text-humana-muted">—</span>
          <span>{formatDisplay(to)}</span>
        </button>

        {calOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 rounded-xl border border-humana-line bg-white p-5 shadow-xl shadow-black/8 animate-[fade-in-up_0.15s_ease-out]">
            <div className="flex gap-6">
              <CalendarMonth
                year={leftYear} month={leftMonth} locale={locale}
                selectedFrom={tempFrom} selectedTo={tempTo}
                hoverDate={selecting === "to" ? hoverDate : null}
                onSelect={handleSelect} onHover={setHoverDate} onPrev={prevMonth}
              />
              <div className="w-px bg-humana-line" />
              <CalendarMonth
                year={rightYear} month={rightMonth} locale={locale}
                selectedFrom={tempFrom} selectedTo={tempTo}
                hoverDate={selecting === "to" ? hoverDate : null}
                onSelect={handleSelect} onHover={setHoverDate} onNext={nextMonth}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
