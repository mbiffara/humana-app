"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking, type RetreatPricingCache } from "@/contexts/BookingContext";
import { agencyApi, type ApiExperience, type PublicRoomType } from "@/lib/api/agency";
import { fetchExperienceOrRetreat } from "@/lib/retreat-experience";
import {
  MONTH_NAMES, WEEKDAY_NAMES, daysInMonth, firstDayOfMonth, toDateStr,
  formatDateShort, getDayName, diffDays,
} from "@/lib/calendar-utils";

const CHECK_IN_TIME = "15:00";
const CHECK_OUT_TIME = "11:00";

export default function SelectDatesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t, locale } = useLocale();
  const { state, hydrated, set } = useBooking();

  const [experience, setExperience] = useState<ApiExperience | null>(null);
  const [hotelName, setHotelName] = useState("");
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelImage, setHotelImage] = useState("");
  const [firstRoom, setFirstRoom] = useState<PublicRoomType | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    async function fetchData() {
      try {
        // Fetch experiences for this country and find the matching one;
        // slugs that aren't experiences may be hotel-published retreats
        const expRes = await agencyApi.listExperiences({ country_code: country.toUpperCase() });
        let exp = expRes.experiences.find((e) => e.slug === state.retreatSlug) ?? null;
        if (!exp && state.retreatSlug) {
          exp = await fetchExperienceOrRetreat(state.retreatSlug);
        }
        exp = exp ?? expRes.experiences[0];
        if (!exp || cancelled) return;
        setExperience(exp);

        // Set calendar view to retreat start month
        if (exp.starts_on) {
          const d = new Date(exp.starts_on + "T12:00:00");
          setViewYear(d.getFullYear());
          setViewMonth(d.getMonth());
        }

        // Fetch hotel details
        if (exp.hotel?.id) {
          const hotelRes = await agencyApi.getHotel(exp.hotel.id);
          if (cancelled) return;
          const h = hotelRes.hotel;
          setHotelName(h.name);
          setHotelLocation(`${h.city}, ${h.country}`);
          const coverImg = h.images?.find((img) => img.is_cover);
          setHotelImage(coverImg?.image_url ?? h.images?.[0]?.image_url ?? "/images/retreat-tulum.jpg");
          const selectedRt = state.roomTypeApiId && h.room_types?.find((rt) => rt.id === state.roomTypeApiId);
          if (selectedRt) setFirstRoom(selectedRt);
          else if (h.room_types?.length > 0) setFirstRoom(h.room_types[0]);
        }
      } catch {
        // Silently handle — will show fallback data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [hydrated, country, state.retreatSlug, state.roomTypeApiId]);

  const localeIdx = locale === "es" ? 1 : locale === "pt" ? 2 : 0;
  const months = MONTH_NAMES[localeIdx];
  const weekdays = WEEKDAY_NAMES[localeIdx];

  /* ── Retreat dates are FIXED ── */
  const retreatStart = experience?.starts_on ?? "2026-05-28";
  const retreatEnd = experience?.ends_on ?? "2026-06-01";
  const retreatNights = diffDays(retreatStart, retreatEnd);

  const retreatPricings = experience?.pricing ?? null;
  const selectedPricing = retreatPricings?.find((p) => p.room_type.id === firstRoom?.id);
  // Retreat pricing is per guest (for the entire stay), not per night
  const pricePerGuest = selectedPricing?.price_per_guest ?? (retreatPricings?.[0]?.price_per_guest ?? null);
  const pricePerNight = firstRoom ? firstRoom.price_per_night_cents / 100 : 280;
  const displayPrice = pricePerGuest ?? retreatNights * pricePerNight;
  const commissionRate = experience?.commission_rate ?? 0.16;
  const officeFeeRate = 0.02;
  const totalCommissionRate = commissionRate + officeFeeRate;
  const commission = Math.round(displayPrice * totalCommissionRate);
  const hasRetreatPricing = retreatPricings && retreatPricings.length > 0;

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

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
      const isToday = dateStr === "2026-04-29";

      let cls = "flex h-11 w-11 items-center justify-center text-[14px] transition-all duration-150 ";

      if (isRetreatStart) {
        cls += "calendar-day-range-start font-semibold rounded-l-full";
      } else if (isRetreatEnd) {
        cls += "calendar-day-range-end font-semibold rounded-r-full";
      } else if (isInRetreat) {
        cls += "calendar-day-in-range";
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
      <div className="flex flex-1 flex-col gap-0 border border-humana-line bg-white">
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

  function handleContinue() {
    const pricingCache: RetreatPricingCache[] | undefined = retreatPricings?.map((p) => ({
      roomTypeId: p.room_type.id,
      pricePerGuestCents: p.price_per_guest_cents,
      currency: p.currency,
    }));
    set({
      dates: { start: retreatStart, end: retreatEnd },
      preNights: 0,
      postNights: 0,
      // Adapted retreats book through the direct hotel path — no experience_id
      experienceId: experience && !experience.is_retreat ? experience.id : null,
      hotelApiId: experience?.hotel?.id ?? null,
      display: {
        hotelName: hotelName || "Hotel",
        hotelImage,
        hotelLocation,
        roomTypeName: firstRoom?.name ?? "",
        retreatName: experience?.title ?? "",
        pricePerNightCents: firstRoom?.price_per_night_cents ?? 28000,
        retreatPricePerGuestCents: selectedPricing
          ? selectedPricing.price_per_guest_cents
          : (retreatPricings?.[0]?.price_per_guest_cents ?? undefined),
        currency: experience?.currency ?? "USD",
        commissionRate,
        retreatPricings: pricingCache,
      },
    });
  }

  return (
    <div className="animate-fade-in-up mx-auto flex w-full max-w-[1440px] flex-col gap-10 bg-humana-stone min-h-screen px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: hotelName || "Hotel", href: `/select-country/${country}` },
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
          Las fechas del retiro son fijas y no pueden modificarse.
        </p>
      </div>

      <div className="flex items-start gap-16">
        {/* ── Left: calendar + retreat schedule ── */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Retreat dates info card */}
          <div className="flex items-stretch gap-0 border border-humana-line bg-white">
            <div className="flex flex-1 flex-col gap-1.5 border-r border-humana-line p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">CHECK-IN</span>
              <span className="text-[18px] font-medium text-humana-ink">{getDayName(retreatStart, localeIdx)}, {formatDateShort(retreatStart)}</span>
              <span className="text-[13px] text-humana-muted">A partir de las {CHECK_IN_TIME} hs</span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">CHECK-OUT</span>
              <span className="text-[18px] font-medium text-humana-ink">{getDayName(retreatEnd, localeIdx)}, {formatDateShort(retreatEnd)}</span>
              <span className="text-[13px] text-humana-muted">Antes de las {CHECK_OUT_TIME} hs</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-4">
              <button type="button" onClick={handlePrevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-humana-line bg-white text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={handleNextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-humana-line bg-white text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink">
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
            </div>
          </div>

        </div>

        {/* ── Summary sidebar ── */}
        <div className="w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line bg-white p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              RESUMEN DE RESERVA
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-humana-ink">{hotelName || "Hotel"}</span>
              <span className="text-[13px] text-humana-muted">{hotelLocation}</span>
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
                <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(retreatStart)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] text-humana-ink">Check-out</span>
                  <span className="text-[12px] text-humana-subtle">Antes de las {CHECK_OUT_TIME}</span>
                </div>
                <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(retreatEnd)}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Price breakdown */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">
                  {retreatNights} noches x U$D {hasRetreatPricing ? Math.round(displayPrice / retreatNights) : pricePerNight}
                </span>
                <span className="text-[14px] font-medium text-humana-ink">U$D {displayPrice.toLocaleString("en-US")}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-humana-ink">Total por huésped c/u</span>
              <span className="text-[18px] font-semibold text-humana-ink">U$D {displayPrice.toLocaleString("en-US")}</span>
            </div>
            <span className="text-[14px] font-medium text-humana-gold">
              Tu comisión estimada: U$D {commission.toLocaleString("en-US")} ({Math.round(totalCommissionRate * 100)}%)
            </span>

            <Link
              href={`/select-country/${country}/step-2-select-accommodation`}
              onClick={handleContinue}
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
