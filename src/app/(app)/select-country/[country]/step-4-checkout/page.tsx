"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { agencyApi } from "@/lib/api/agency";
import { formatDateShort, addDays, diffDays } from "@/lib/calendar-utils";

export default function CheckoutPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();
  const { state } = useBooking();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retreatStart = state.dates?.start ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? "2026-06-01";
  const retreatNights = diffDays(retreatStart, retreatEnd);
  const pricePerNight = state.display ? state.display.pricePerNightCents / 100 : 185;
  const preNights = state.preNights;
  const postNights = state.postNights;
  const isRetreatFlow = state.flowType === "retreats";
  // Retreats: flat per-guest price (includes all nights). Hotels: per-night × nights.
  const retreatPricePerGuest = state.display?.retreatPricePerGuestCents
    ? state.display.retreatPricePerGuestCents / 100 : 0;
  const retreatCost = isRetreatFlow && retreatPricePerGuest > 0
    ? retreatPricePerGuest
    : retreatNights * pricePerNight;
  const preCost = preNights * pricePerNight;
  const postCost = postNights * pricePerNight;
  const total = retreatCost + preCost + postCost;
  const commissionRate = state.display?.commissionRate ?? 0.16;
  const officeFeeRate = 0.02;
  const totalCommissionRate = commissionRate + officeFeeRate;
  const totalCommission = Math.round(total * totalCommissionRate);

  const computedCheckIn = useMemo(() => preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart, [retreatStart, preNights]);
  const computedCheckOut = useMemo(() => postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd, [retreatEnd, postNights]);

  const displayHotelName = state.display?.hotelName ?? "Hotel";
  const displayHotelImage = state.display?.hotelImage ?? "/images/retreat-tulum.jpg";
  const displayHotelLocation = state.display?.hotelLocation ?? "";
  const displayRoomName = state.display?.roomTypeName ?? "Suite";
  const isHotelDirect = state.flowType === "hotels" && !!state.roomTypeApiId;

  async function handleSubmit() {
    if (processing || (!state.experienceId && !state.hotelApiId)) return;
    setProcessing(true);
    setError(null);

    try {
      const result = await agencyApi.createBooking({
        experience_id: state.experienceId ?? undefined,
        hotel_id: !state.experienceId ? (state.hotelApiId ?? undefined) : undefined,
        client_id: state.clientApiId ?? undefined,
        room_type_id: state.roomTypeApiId ?? undefined,
        retreat_id: state.retreatApiId ?? undefined,
        guests: state.guests,
        starts_on: computedCheckIn,
        ends_on: computedCheckOut,
      });

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error creating booking";
      if (message.toLowerCase().includes("availability")) {
        setError("La habitacion seleccionada ya no tiene disponibilidad para estas fechas. Por favor, vuelve al paso 2 y selecciona otra.");
      } else {
        setError(message);
      }
      setProcessing(false);
    }
  }

  return (
    <div className="animate-fade-in-up mx-auto flex w-full max-w-[1440px] flex-col gap-10 bg-humana-stone min-h-screen px-20 py-14">
      <Breadcrumb items={[
        { label: t.breadcrumb.home, href: "/dashboard" },
        { label: displayHotelName, href: `/select-country/${country}` },
        { label: "Alojamiento", href: `/select-country/${country}/step-2-select-accommodation` },
        { label: "Checkout" },
      ]} />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">{isHotelDirect ? "PASO 3 DE 4" : "PASO 4 DE 5"}</span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">Checkout y pago</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 border border-red-200 bg-red-50 px-6 py-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          <span className="text-[14px] text-red-700">{error}</span>
        </div>
      )}

      <div className="flex gap-12">
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-6 border border-humana-line bg-white p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">DETALLE DE LA RESERVA</span>
            <div className="flex items-center gap-4">
              <div className="relative h-[60px] w-[80px] shrink-0 overflow-hidden bg-humana-stone"><Image src={displayHotelImage} alt={displayHotelName} fill className="object-cover" /></div>
              <div className="flex flex-col gap-0.5"><span className="text-[15px] font-medium text-humana-ink">{displayHotelName}</span><span className="text-[13px] text-humana-muted">{displayRoomName} · {displayHotelLocation}</span></div>
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">{state.inventoryMode ? "Tipo" : "Cliente"}</span><span className="text-[14px] font-medium text-humana-ink">{state.inventoryMode ? "Compra para inventario" : (state.clientId ? "Cliente asignado" : "\u2014")}</span></div>
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Habitacion</span><span className="text-[14px] font-medium text-humana-ink">{displayRoomName}</span></div>
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Check-in</span><span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)} · 15:00</span></div>
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Check-out</span><span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)} · 11:00</span></div>
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">{isRetreatFlow ? "Retiro — 1 huésped" : `Retiro — ${retreatNights} noches x U$D ${pricePerNight}`}</span><span className="text-[14px] font-medium text-humana-ink">U$D {retreatCost.toLocaleString()}.00</span></div>
              {preNights > 0 && <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Pre-retiro — {preNights} noches x U$D {pricePerNight}</span><span className="text-[14px] font-medium text-humana-ink">U$D {preCost.toLocaleString()}.00</span></div>}
              {postNights > 0 && <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Post-retiro — {postNights} noches x U$D {pricePerNight}</span><span className="text-[14px] font-medium text-humana-ink">U$D {postCost.toLocaleString()}.00</span></div>}
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex items-center justify-between"><span className="text-[15px] font-semibold text-humana-ink">Total a cobrar</span><span className="text-[18px] font-semibold text-humana-ink">U$D {total.toLocaleString()}.00</span></div>
          </div>
          <div className="flex flex-col gap-5 border border-humana-line bg-white p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">DESGLOSE DE COMISIONES</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Comisión ({Math.round(totalCommissionRate * 100)}%)</span><span className="text-[15px] font-medium text-humana-gold">U$D {totalCommission.toLocaleString()}.00</span></div>
            </div>
          </div>
        </div>

        <div className="w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line bg-white p-8">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">PAGO SEGURO</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-humana-line pb-4">
                <span className="text-[14px] text-humana-muted">Total</span>
                <span className="text-[22px] font-semibold text-humana-ink">U$D {total.toLocaleString()}.00</span>
              </div>

              <p className="text-[13px] leading-relaxed text-humana-muted">
                Al hacer clic en &ldquo;Pagar&rdquo;, seras redirigido a Stripe para completar el pago de forma segura. Una vez confirmado, la reserva se activara automaticamente.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-humana-subtle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>Procesado de forma segura por Stripe</span>
            </div>
            <button type="button" onClick={handleSubmit} disabled={processing} className="flex cursor-pointer items-center justify-center gap-2 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98] disabled:opacity-60">
              {processing ? t.checkout.processing : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  PAGAR U$D {total.toLocaleString()}.00
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
