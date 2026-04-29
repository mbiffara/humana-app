"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";
import { countryIdToSlug } from "@/data/countries";

const MONTH_NAMES = [
  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
];

const WEEKDAY_NAMES = [
  ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  ["Se", "Te", "Qu", "Qu", "Se", "Sá", "Do"],
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDate();
  const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export default function SelectDatesPage() {
  const { t, locale } = useLocale();
  const { state, set } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const countrySlug = retreat ? (countryIdToSlug[retreat.country] ?? retreat.country) : "mexico";
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);
  const room = hotel?.roomTypes[0];

  const localeIdx = locale === "es" ? 1 : locale === "pt" ? 2 : 0;
  const months = MONTH_NAMES[localeIdx];
  const weekdays = WEEKDAY_NAMES[localeIdx];

  const [startDate, setStartDate] = useState<string | null>(retreat?.startDate ?? null);
  const [endDate, setEndDate] = useState<string | null>(retreat?.endDate ?? null);

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(4); // May (0-indexed)

  const nightCount = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const pricePerNight = room?.pricePerNight ?? 280;
  const totalPrice = nightCount * pricePerNight;

  function handleDayClick(dateStr: string) {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
    } else {
      if (dateStr > startDate) {
        setEndDate(dateStr);
      } else {
        setStartDate(dateStr);
        setEndDate(null);
      }
    }
  }

  function isInRange(dateStr: string) {
    if (!startDate || !endDate) return false;
    return dateStr > startDate && dateStr < endDate;
  }

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const secondMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const secondYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  function renderMonth(year: number, month: number) {
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= days; d++) {
      const dateStr = toDateStr(year, month, d);
      const isStart = dateStr === startDate;
      const isEnd = dateStr === endDate;
      const inRange = isInRange(dateStr);
      const isPast = dateStr < "2026-04-27";

      cells.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => handleDayClick(dateStr)}
          className={`calendar-day flex h-10 w-10 items-center justify-center rounded-full text-[14px] ${
            isPast
              ? "calendar-day-disabled"
              : isStart
                ? "calendar-day-range-start font-medium"
                : isEnd
                  ? "calendar-day-range-end font-medium"
                  : inRange
                    ? "calendar-day-in-range"
                    : "hover:bg-humana-stone"
          }`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-center text-[15px] font-medium text-humana-ink">
          {months[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((wd, i) => (
            <div key={`${wd}-${i}`} className="flex h-8 items-center justify-center text-[11px] font-medium uppercase tracking-[0.14em] text-humana-subtle">
              {wd}
            </div>
          ))}
          {cells}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: hotel?.name ?? "Hotel Itzamna", href: "/dashboard" },
          { label: room?.name ?? "Suite Cenote", href: retreat ? `/select-country/${countrySlug}/retreats/${retreat.slug}` : "/select-country" },
          { label: "Fechas" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          SELECCIONAR FECHAS
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Elige check-in y check-out
        </h1>
      </div>

      <div className="flex gap-16">
        {/* Calendar area */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Navigation arrows */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center text-humana-muted transition-colors hover:text-humana-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center text-humana-muted transition-colors hover:text-humana-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Two side-by-side months */}
          <div className="flex gap-12">
            {renderMonth(viewYear, viewMonth)}
            {renderMonth(secondYear, secondMonth)}
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="w-[340px] shrink-0">
          <div className="flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              RESUMEN
            </span>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Habitacion</span>
                <span className="text-[14px] font-medium text-humana-ink">{room?.name ?? "Suite Cenote"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">{t.selectDates.checkIn}</span>
                <span className="text-[14px] font-medium text-humana-ink">{startDate ? formatDateShort(startDate) : "\u2014"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">{t.selectDates.checkOut}</span>
                <span className="text-[14px] font-medium text-humana-ink">{endDate ? formatDateShort(endDate) : "\u2014"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Noches</span>
                <span className="text-[14px] font-medium text-humana-ink">{nightCount > 0 ? nightCount : "\u2014"}</span>
              </div>
            </div>

            {nightCount > 0 && (
              <>
                <div className="h-px bg-humana-line" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-humana-muted">{nightCount} noches x ${pricePerNight}</span>
                    <span className="text-[16px] font-semibold text-humana-ink">${totalPrice.toLocaleString()} USD</span>
                  </div>
                </div>
              </>
            )}

            <Link
              href="/select-accommodation"
              onClick={() => {
                if (startDate && endDate) set({ dates: { start: startDate, end: endDate } });
              }}
              className={`flex items-center justify-center gap-3 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] transition-all duration-150 active:scale-[0.98] ${
                startDate && endDate
                  ? "bg-humana-ink text-white hover:bg-black"
                  : "pointer-events-none bg-humana-line text-humana-subtle"
              }`}
            >
              CONTINUAR
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 5h14M10 1l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
