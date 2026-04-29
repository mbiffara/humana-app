"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";
import { countryIdToSlug } from "@/data/countries";

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

export default function SelectAccommodationPage() {
  const { t } = useLocale();
  const { state, set } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const countrySlug = retreat ? (countryIdToSlug[retreat.country] ?? retreat.country) : "mexico";
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);

  const [selectedRoom, setSelectedRoom] = useState(hotel?.roomTypes[0]?.id ?? "");
  const [preNights, setPreNights] = useState(state.preNights);
  const [postNights, setPostNights] = useState(state.postNights);

  const room = hotel?.roomTypes.find((r) => r.id === selectedRoom);
  const pricePerNight = room?.pricePerNight ?? 185;
  const retreatNights = retreat?.nights ?? 7;

  const retreatStart = state.dates?.start ?? retreat?.startDate ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? retreat?.endDate ?? "2026-06-01";

  const computedCheckIn = useMemo(() => {
    return preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart;
  }, [retreatStart, preNights]);

  const computedCheckOut = useMemo(() => {
    return postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd;
  }, [retreatEnd, postNights]);

  const totalNights = retreatNights + preNights + postNights;
  const retreatCost = retreatNights * pricePerNight;
  const preCost = preNights * pricePerNight;
  const postCost = postNights * pricePerNight;
  const total = retreatCost + preCost + postCost;
  const commission = Math.round(total * 0.16);

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: hotel?.name ?? "Hotel Itzamna", href: retreat ? `/select-country/${countrySlug}/retreats/${retreat.slug}` : "/select-country" },
          { label: "Fechas", href: "/select-dates" },
          { label: "Alojamiento" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          PASO 3 DE 5
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Seleccionar alojamiento
        </h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">
          Elegi el tipo de habitacion y agrega noches pre/post retiro si tu cliente lo necesita.
        </p>
      </div>

      <div className="flex gap-12">
        {/* Room cards */}
        <div className="flex flex-1 flex-col gap-6">
          {hotel?.roomTypes.map((rt) => {
            const isSelected = selectedRoom === rt.id;
            const availability = rt.id === hotel.roomTypes[0]?.id ? 3 : rt.id === hotel.roomTypes[1]?.id ? 2 : 1;
            const isLow = availability <= 2;

            return (
              <button
                key={rt.id}
                type="button"
                onClick={() => setSelectedRoom(rt.id)}
                className={`flex items-start gap-6 border p-6 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-humana-gold"
                    : "border-humana-line hover:border-humana-ink"
                }`}
              >
                <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden bg-humana-stone">
                  <Image src={rt.image} alt={rt.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      {isSelected && (
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
                          SELECCIONADA
                        </span>
                      )}
                      <h3 className="text-[16px] font-medium text-humana-ink">{rt.name}</h3>
                    </div>
                    <span className="text-[15px] font-medium text-humana-ink">
                      ${rt.pricePerNight} USD/noche
                    </span>
                  </div>
                  <p className="text-[14px] text-humana-muted">{rt.description}</p>
                  <div className="flex items-center gap-2 text-[13px] text-humana-subtle">
                    <span>{rt.maxGuests} huespedes</span>
                    <span>|</span>
                    <span>42 m2</span>
                    <span>|</span>
                    <span>WiFi · A/C · Terraza</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px]">
                    <span className={isLow ? "text-yellow-500" : "text-green-500"}>●</span>
                    <span className={isLow ? "text-yellow-600" : "text-green-600"}>
                      {availability} disponibles para tus fechas
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="w-[340px] shrink-0">
          <div className="sticky top-8 flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              RESUMEN DE RESERVA
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-humana-ink">{hotel?.name ?? "Hotel Itzamna"}</span>
              <span className="text-[13px] text-humana-muted">{hotel?.location ?? "Tulum, Mexico"}</span>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Retreat dates */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-humana-muted">Retiro</span>
              <span className="text-[13px] font-medium text-humana-ink">
                {formatDateShort(retreatStart)} — {formatDateShort(retreatEnd)}
              </span>
            </div>

            {/* Pre-retreat counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-ink">Noches pre-retiro</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={preNights <= 0}
                    onClick={() => setPreNights(Math.max(0, preNights - 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30"
                  >
                    –
                  </button>
                  <span className="w-5 text-center text-[15px] font-medium text-humana-ink">{preNights}</span>
                  <button
                    type="button"
                    disabled={preNights >= 5}
                    onClick={() => setPreNights(Math.min(5, preNights + 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              {preNights > 0 && (
                <span className="text-[12px] text-humana-subtle">
                  Check-in: {formatDateShort(computedCheckIn)}
                </span>
              )}
            </div>

            {/* Post-retreat counter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-ink">Noches post-retiro</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={postNights <= 0}
                    onClick={() => setPostNights(Math.max(0, postNights - 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30"
                  >
                    –
                  </button>
                  <span className="w-5 text-center text-[15px] font-medium text-humana-ink">{postNights}</span>
                  <button
                    type="button"
                    disabled={postNights >= 5}
                    onClick={() => setPostNights(Math.min(5, postNights + 1))}
                    className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              {postNights > 0 && (
                <span className="text-[12px] text-humana-subtle">
                  Check-out: {formatDateShort(computedCheckOut)}
                </span>
              )}
            </div>

            <div className="h-px bg-humana-line" />

            {/* Price breakdown */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Retiro ({retreatNights} noches x ${pricePerNight})</span>
                <span className="text-[14px] font-medium text-humana-ink">${retreatCost.toLocaleString()}</span>
              </div>
              {preNights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Pre-retiro ({preNights} noches x ${pricePerNight})</span>
                  <span className="text-[14px] font-medium text-humana-ink">${preCost.toLocaleString()}</span>
                </div>
              )}
              {postNights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Post-retiro ({postNights} noches x ${pricePerNight})</span>
                  <span className="text-[14px] font-medium text-humana-ink">${postCost.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-humana-ink">Total alojamiento</span>
              <span className="text-[18px] font-semibold text-humana-ink">${total.toLocaleString()} USD</span>
            </div>

            <span className="text-[14px] font-medium text-humana-gold">
              Tu comision estimada: ${commission.toLocaleString()} USD (16%)
            </span>

            <Link
              href="/assign-client"
              onClick={() => set({ roomTypeId: selectedRoom, preNights, postNights })}
              className="flex items-center justify-center gap-3 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
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
