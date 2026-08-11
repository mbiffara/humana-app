"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useBooking } from "@/contexts/BookingContext";
import { formatDateShort, addDays, diffDays } from "@/lib/calendar-utils";

export default function ConfirmationPage({ params }: { params: Promise<{ country: string }> }) {
  React.use(params);
  const { t } = useLocale();
  const { state, reset } = useBooking();

  const retreatStart = state.dates?.start ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? "2026-06-01";
  const retreatNights = diffDays(retreatStart, retreatEnd);
  const pricePerNight = state.display ? state.display.pricePerNightCents / 100 : 185;
  const preNights = state.preNights;
  const postNights = state.postNights;
  const total = (retreatNights + preNights + postNights) * pricePerNight;
  const commissionRate = state.display?.commissionRate ?? 0.16;
  const commission = Math.round(total * commissionRate);
  const reservationId = state.bookingReference ?? "HMN-000000";

  const computedCheckIn = useMemo(() => preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart, [retreatStart, preNights]);
  const computedCheckOut = useMemo(() => postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd, [retreatEnd, postNights]);

  const displayHotelName = state.display?.hotelName ?? "Hotel";
  const displayHotelLocation = state.display?.hotelLocation ?? "";
  const displayRoomName = state.display?.roomTypeName ?? "Suite";
  const isHotelDirect = state.flowType === "hotels" && !!state.roomTypeApiId;

  return (
    <div className="flex flex-col items-center gap-10 bg-humana-stone min-h-screen px-16 py-20">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-check-pop">
        <circle cx="40" cy="40" r="38" stroke="#d4af37" strokeWidth="2" className="animate-check-circle" />
        <path d="M24 41l11 11 21-24" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-check-stroke" />
      </svg>

      <div className="animate-fade-in-up flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">{state.inventoryMode ? `${isHotelDirect ? "PASO 4 DE 4" : "PASO 5 DE 5"} \u00B7 PLAZAS ADQUIRIDAS` : `${isHotelDirect ? "PASO 4 DE 4" : "PASO 5 DE 5"} \u00B7 RESERVA CONFIRMADA`}</span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">{state.inventoryMode ? "Plazas guardadas en inventario" : "Reserva creada exitosamente"}</h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">{state.inventoryMode ? "Las plazas estan disponibles en tu inventario para asignar un cliente en el futuro." : `Se ha enviado un email de confirmacion con la referencia ${reservationId}.`}</p>
      </div>

      <div className="animate-fade-in-up-delay-1 flex w-full max-w-[640px] flex-col gap-6 border border-humana-line bg-white p-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">REFERENCIA</span>
          <span className="text-[16px] font-bold tracking-[0.05em] text-humana-ink">{reservationId}</span>
        </div>
        <div className="h-px bg-humana-line" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col gap-1"><span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">HOTEL</span><span className="text-[14px] font-medium text-humana-ink">{displayHotelName} · {displayRoomName}</span></div>
          <div className="flex flex-col gap-1"><span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">CHECK-IN</span><span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)} · 15:00</span></div>
          <div className="flex flex-col gap-1"><span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">UBICACION</span><span className="text-[14px] font-medium text-humana-ink">{displayHotelLocation}</span></div>
          <div className="flex flex-col gap-1"><span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">CHECK-OUT</span><span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)} · 11:00</span></div>
          <div className="flex flex-col gap-1"><span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{state.inventoryMode ? "TIPO" : "CLIENTE"}</span><span className="text-[14px] font-medium text-humana-ink">{state.inventoryMode ? "Inventario \u2014 sin asignar" : "Cliente asignado"}</span></div>
          <div className="flex flex-col gap-1"><span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">TOTAL PAGADO</span><span className="text-[14px] font-medium text-humana-ink">U$D {total.toLocaleString()}.00</span></div>
        </div>
        <div className="h-px bg-humana-line" />
        <div className="flex items-center justify-between bg-humana-stone p-4">
          <span className="text-[13px] font-medium text-humana-ink">{state.inventoryMode ? "Comision estimada al revender" : "Comision ganada por esta reserva"}</span>
          <span className="text-[18px] font-medium text-humana-gold">U$D {commission.toLocaleString()}.00</span>
        </div>
      </div>

      <div className="animate-fade-in-up-delay-2 flex items-center gap-4">
        <button type="button" className="flex items-center justify-center gap-2 border border-humana-line bg-white px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-all duration-150 hover:border-humana-ink hover:text-humana-ink active:scale-[0.98]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          DESCARGAR PDF
        </button>
        <Link href="/dashboard" onClick={reset} className="group/cta flex items-center justify-center gap-3 bg-humana-ink px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]">
          {state.inventoryMode ? "VER INVENTARIO" : "VER MIS RESERVAS"}
          <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5"><path d="M1 5h14M10 1l4 4-4 4" /></svg>
        </Link>
      </div>
    </div>
  );
}
