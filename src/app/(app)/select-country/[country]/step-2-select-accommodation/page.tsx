"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";

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

export default function SelectAccommodationPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();
  const { state, set } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);

  const [selectedRoom, setSelectedRoom] = useState(hotel?.roomTypes[0]?.id ?? "");
  const [preNights, setPreNights] = useState(state.preNights);
  const [postNights, setPostNights] = useState(state.postNights);

  const room = hotel?.roomTypes.find((r) => r.id === selectedRoom);
  const pricePerNight = room?.pricePerNight ?? 185;
  const retreatNights = retreat?.nights ?? 7;

  const retreatStart = state.dates?.start ?? retreat?.startDate ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? retreat?.endDate ?? "2026-06-01";

  const computedCheckIn = useMemo(() => preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart, [retreatStart, preNights]);
  const computedCheckOut = useMemo(() => postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd, [retreatEnd, postNights]);

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
          { label: hotel?.name ?? "Hotel", href: retreat ? `/select-country/${country}/retreats/${retreat.slug}` : `/select-country/${country}` },
          { label: "Fechas", href: `/select-country/${country}/step-1-select-dates` },
          { label: "Alojamiento" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          PASO 2 DE 5
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Seleccionar alojamiento
        </h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">
          Elegi el tipo de habitacion y agrega noches pre/post retiro si tu cliente lo necesita.
        </p>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-1 flex-col gap-6">
          {hotel?.roomTypes.map((rt) => {
            const isSelected = selectedRoom === rt.id;
            const availability = rt.id === hotel.roomTypes[0]?.id ? 3 : rt.id === hotel.roomTypes[1]?.id ? 2 : 1;
            const isLow = availability <= 2;
            return (
              <button key={rt.id} type="button" onClick={() => setSelectedRoom(rt.id)}
                className={`flex cursor-pointer overflow-hidden border text-left transition-all duration-200 ${isSelected ? "border-humana-gold" : "border-humana-line hover:border-humana-ink"}`}>
                {/* Image — taller when selected */}
                <div className={`relative shrink-0 bg-humana-stone transition-all duration-300 ${isSelected ? "w-[280px]" : "w-[180px]"}`}>
                  <Image src={rt.image} alt={rt.name} fill className="object-cover" />
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[11px] font-semibold text-humana-ink">{rt.maxGuests}</span>
                  </div>
                  {isSelected && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        {isSelected && (
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                              <circle cx="12" cy="12" r="10" stroke="#d4af37" strokeWidth="2" />
                              <path d="M8 12l3 3 5-5" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            SELECCIONADA
                          </span>
                        )}
                        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-humana-ink">{rt.name}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{t.hotelDetail.priceFrom}</span>
                        <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
                          ${rt.pricePerNight}
                          <span className="text-[12px] font-normal text-humana-muted"> / noche</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-[14px] leading-[22px] text-humana-muted">{rt.description}</p>
                  </div>

                  {/* Expanded detail — only when selected */}
                  {isSelected && (
                    <div className="flex flex-col gap-4 animate-fade-in-up">
                      <div className="h-px bg-humana-line" />

                      {/* Detail rows with icons */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                            <path d="M21 10H3" />
                            <path d="M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
                          </svg>
                          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.rooms}</span>
                          <span className="text-[14px] text-humana-muted">{rt.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.capacity}</span>
                          <span className="text-[14px] text-humana-muted">{t.hotelDetail.personCount(rt.maxGuests)}</span>
                        </div>
                      </div>

                      <div className="h-px bg-humana-line" />

                      {/* Amenities */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.amenities}</span>
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 6).map((a) => (
                            <span key={a} className="border border-humana-line px-3 py-1.5 text-[12px] text-humana-muted">{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer — availability */}
                  <div className="flex items-center gap-1.5 text-[13px]">
                    <span className={isLow ? "text-yellow-500" : "text-green-500"}>●</span>
                    <span className={isLow ? "text-yellow-600" : "text-green-600"}>{availability} disponibles para tus fechas</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-[340px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">RESUMEN DE RESERVA</span>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-humana-ink">{hotel?.name ?? "Hotel Itzamna"}</span>
              <span className="text-[13px] text-humana-muted">{hotel?.location ?? "Tulum, Mexico"}</span>
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-humana-muted">Retiro</span>
              <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(retreatStart)} — {formatDateShort(retreatEnd)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-ink">Noches pre-retiro</span>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={preNights <= 0} onClick={() => setPreNights(Math.max(0, preNights - 1))} className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">–</button>
                  <span className="w-5 text-center text-[15px] font-medium text-humana-ink">{preNights}</span>
                  <button type="button" disabled={preNights >= 5} onClick={() => setPreNights(Math.min(5, preNights + 1))} className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">+</button>
                </div>
              </div>
              {preNights > 0 && <span className="text-[12px] text-humana-subtle">Check-in: {formatDateShort(computedCheckIn)} · 15:00</span>}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-ink">Noches post-retiro</span>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={postNights <= 0} onClick={() => setPostNights(Math.max(0, postNights - 1))} className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">–</button>
                  <span className="w-5 text-center text-[15px] font-medium text-humana-ink">{postNights}</span>
                  <button type="button" disabled={postNights >= 5} onClick={() => setPostNights(Math.min(5, postNights + 1))} className="flex h-7 w-7 items-center justify-center border border-humana-line text-[14px] text-humana-ink transition-all hover:border-humana-ink disabled:opacity-30">+</button>
                </div>
              </div>
              {postNights > 0 && <span className="text-[12px] text-humana-subtle">Check-out: {formatDateShort(computedCheckOut)} · 11:00</span>}
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Retiro ({retreatNights} noches x ${pricePerNight})</span>
                <span className="text-[14px] font-medium text-humana-ink">${retreatCost.toLocaleString()}</span>
              </div>
              {preNights > 0 && <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Pre-retiro ({preNights} noches x ${pricePerNight})</span><span className="text-[14px] font-medium text-humana-ink">${preCost.toLocaleString()}</span></div>}
              {postNights > 0 && <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Post-retiro ({postNights} noches x ${pricePerNight})</span><span className="text-[14px] font-medium text-humana-ink">${postCost.toLocaleString()}</span></div>}
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-humana-ink">Total alojamiento</span>
              <span className="text-[18px] font-semibold text-humana-ink">${total.toLocaleString()} USD</span>
            </div>
            <span className="text-[14px] font-medium text-humana-gold">Tu comision estimada: ${commission.toLocaleString()} USD (16%)</span>
            <Link href={`/select-country/${country}/step-3-assign-client`} onClick={() => set({ roomTypeId: selectedRoom, preNights, postNights })}
              className="group/cta flex items-center justify-center gap-3 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]">
              CONTINUAR
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5"><path d="M1 5h14M10 1l4 4-4 4" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
