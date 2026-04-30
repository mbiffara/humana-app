"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";

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

const CHECK_IN_TIME = "15:00";
const CHECK_OUT_TIME = "11:00";

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
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

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function getDayName(dateStr: string, localeIdx: number): string {
  const dayNames = [
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  ];
  const d = new Date(dateStr + "T12:00:00");
  return dayNames[localeIdx][d.getDay()];
}

export default function SelectDatesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t, locale } = useLocale();
  const { state, hydrated, set } = useBooking();

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);
  const room = hotel?.roomTypes[0];

  const localeIdx = locale === "es" ? 1 : locale === "pt" ? 2 : 0;
  const months = MONTH_NAMES[localeIdx];
  const weekdays = WEEKDAY_NAMES[localeIdx];

  /* ── Retreat dates are FIXED ── */
  const retreatStart = retreat?.startDate ?? "2026-05-28";
  const retreatEnd = retreat?.endDate ?? "2026-06-01";
  const retreatNights = retreat?.nights ?? 7;

  const [preNights, setPreNights] = useState(state.preNights);
  const [postNights, setPostNights] = useState(state.postNights);

  /* Calendar view starts at retreat month */
  const retreatStartMonth = new Date(retreatStart + "T12:00:00").getMonth();
  const retreatStartYear = new Date(retreatStart + "T12:00:00").getFullYear();
  const [viewYear, setViewYear] = useState(retreatStartYear);
  const [viewMonth, setViewMonth] = useState(retreatStartMonth);

  const pricePerNight = room?.pricePerNight ?? 280;
  const totalNights = retreatNights + preNights + postNights;
  const retreatCost = retreatNights * pricePerNight;
  const preCost = preNights * pricePerNight;
  const postCost = postNights * pricePerNight;
  const totalPrice = retreatCost + preCost + postCost;
  const commission = Math.round(totalPrice * 0.16);

  const computedCheckIn = useMemo(() => preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart, [retreatStart, preNights]);
  const computedCheckOut = useMemo(() => postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd, [retreatEnd, postNights]);

  function handlePrevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function handleNextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
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
      const isRetreatStart = dateStr === retreatStart;
      const isRetreatEnd = dateStr === retreatEnd;
      const isInRetreat = dateStr > retreatStart && dateStr < retreatEnd;
      const isPreDay = computedCheckIn && dateStr >= computedCheckIn && dateStr < retreatStart;
      const isPostDay = computedCheckOut && dateStr > retreatEnd && dateStr <= computedCheckOut;
      const isToday = dateStr === "2026-04-29";

      let cls = "flex h-11 w-11 items-center justify-center text-[14px] transition-all duration-150 ";

      if (isRetreatStart) {
        cls += "calendar-day-range-start font-semibold rounded-l-full";
      } else if (isRetreatEnd) {
        cls += "calendar-day-range-end font-semibold rounded-r-full";
      } else if (isInRetreat) {
        cls += "calendar-day-in-range";
      } else if (isPreDay || isPostDay) {
        cls += "border border-humana-gold/40 bg-humana-gold/8 text-humana-gold font-medium";
      } else {
        cls += "text-humana-muted";
        if (isToday) cls += " ring-1 ring-humana-gold/40 rounded-full";
      }

      cells.push(
        <div key={d} className={cls}>
          {d}
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col gap-0 border border-humana-line">
        <h3 className="border-b border-humana-line py-4 text-center text-[16px] font-medium tracking-[-0.01em] text-humana-ink">
          {months[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-y-1.5 p-4">
          {weekdays.map((wd, i) => (
            <div key={`${wd}-${i}`} className="flex h-10 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
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
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: hotel?.name ?? "Hotel", href: retreat ? `/select-country/${country}/retreats/${retreat.slug}` : `/select-country/${country}` },
          { label: "Fechas" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          PASO 1 DE 5
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Fechas del retiro
        </h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">
          Las fechas del retiro son fijas. Podes agregar noches adicionales antes o despues para tu cliente.
        </p>
      </div>

      <div className="flex items-start gap-16">
        {/* ── Left: calendar + retreat schedule ── */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Retreat dates info card */}
          <div className="flex items-stretch gap-0 border border-humana-line">
            <div className="flex flex-1 flex-col gap-1.5 border-r border-humana-line p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">CHECK-IN</span>
              <span className="text-[18px] font-medium text-humana-ink">{getDayName(computedCheckIn, localeIdx)}, {formatDateShort(computedCheckIn)}</span>
              <span className="text-[13px] text-humana-muted">A partir de las {CHECK_IN_TIME} hs</span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">CHECK-OUT</span>
              <span className="text-[18px] font-medium text-humana-ink">{getDayName(computedCheckOut, localeIdx)}, {formatDateShort(computedCheckOut)}</span>
              <span className="text-[13px] text-humana-muted">Antes de las {CHECK_OUT_TIME} hs</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-4">
              <button type="button" onClick={handlePrevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-humana-line text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={handleNextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-humana-line text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            <div className="flex gap-6">
              {renderMonth(viewYear, viewMonth)}
              {renderMonth(secondYear, secondMonth)}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 px-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-humana-gold" />
                <span className="text-[12px] text-humana-muted">Fechas del retiro</span>
              </div>
              {(preNights > 0 || postNights > 0) && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border-2 border-humana-gold/30 bg-humana-gold/8" />
                  <span className="text-[12px] text-humana-muted">Dias adicionales</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── Summary sidebar ── */}
        <div className="w-[340px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              RESUMEN DE RESERVA
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-humana-ink">{hotel?.name ?? "Hotel"}</span>
              <span className="text-[13px] text-humana-muted">{hotel?.location ?? ""}</span>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Retreat fixed dates */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Retiro</span>
                <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(retreatStart)} — {formatDateShort(retreatEnd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Noches retiro</span>
                <span className="text-[14px] font-medium text-humana-ink">{retreatNights}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Check-in / check-out times */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] text-humana-ink">Check-in</span>
                  <span className="text-[12px] text-humana-subtle">A partir de las {CHECK_IN_TIME}</span>
                </div>
                <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] text-humana-ink">Check-out</span>
                  <span className="text-[12px] text-humana-subtle">Antes de las {CHECK_OUT_TIME}</span>
                </div>
                <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Pre-retreat counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-ink">Noches pre-retiro</span>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={preNights <= 0} onClick={() => setPreNights(Math.max(0, preNights - 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">–</button>
                  <span className="w-5 text-center text-[15px] font-medium text-humana-ink">{preNights}</span>
                  <button type="button" disabled={preNights >= 5} onClick={() => setPreNights(Math.min(5, preNights + 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">+</button>
                </div>
              </div>
              {preNights > 0 && (
                <span className="text-[12px] text-humana-subtle">Check-in anticipado: {formatDateShort(computedCheckIn)} · {CHECK_IN_TIME}</span>
              )}
            </div>

            {/* Post-retreat counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-ink">Noches post-retiro</span>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={postNights <= 0} onClick={() => setPostNights(Math.max(0, postNights - 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">–</button>
                  <span className="w-5 text-center text-[15px] font-medium text-humana-ink">{postNights}</span>
                  <button type="button" disabled={postNights >= 5} onClick={() => setPostNights(Math.min(5, postNights + 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">+</button>
                </div>
              </div>
              {postNights > 0 && (
                <span className="text-[12px] text-humana-subtle">Check-out extendido: {formatDateShort(computedCheckOut)} · {CHECK_OUT_TIME}</span>
              )}
            </div>

            <div className="h-px bg-humana-line" />

            {/* Price breakdown */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Retiro ({retreatNights} noches x ${pricePerNight})</span>
                <span className="text-[14px] font-medium text-humana-ink">${retreatCost.toLocaleString("en-US")}</span>
              </div>
              {preNights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Pre-retiro ({preNights} noches x ${pricePerNight})</span>
                  <span className="text-[14px] font-medium text-humana-ink">${preCost.toLocaleString("en-US")}</span>
                </div>
              )}
              {postNights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Post-retiro ({postNights} noches x ${pricePerNight})</span>
                  <span className="text-[14px] font-medium text-humana-ink">${postCost.toLocaleString("en-US")}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-humana-ink">Total alojamiento</span>
              <span className="text-[18px] font-semibold text-humana-ink">${totalPrice.toLocaleString("en-US")} USD</span>
            </div>
            <span className="text-[14px] font-medium text-humana-gold">
              Tu comision estimada: ${commission.toLocaleString("en-US")} USD (16%)
            </span>

            <Link
              href={`/select-country/${country}/step-2-select-accommodation`}
              onClick={() => set({ dates: { start: retreatStart, end: retreatEnd }, preNights, postNights })}
              className="group/cta flex items-center justify-center gap-3 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
            >
              CONTINUAR
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                <path d="M1 5h14M10 1l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
