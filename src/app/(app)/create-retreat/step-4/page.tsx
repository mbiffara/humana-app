"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWizard } from "@/contexts/WizardContext";
import { WizardVistaPrevia } from "@/components/WizardVistaPrevia";
import { hotels } from "@/data/hotels";
import { inventoryBlocks } from "@/data/inventory";
import { StepIndicator } from "@/components/StepIndicator";


export default function WizardStep4() {
  const { t } = useLocale();
  const { state, set } = useWizard();
  const hotel = hotels.find((h) => h.id === state.hotelId);

  /* Only show room types that have inventory for this hotel */
  const hotelInv = inventoryBlocks.filter((b) => b.hotelId === state.hotelId && b.availableRooms > 0);
  const availableRoomTypes = hotel?.roomTypes.filter((rt) =>
    hotelInv.some((b) => b.roomTypeId === rt.id)
  ) ?? [];

  const [pricing, setPricing] = useState<{ roomTypeId: string; retailPrice: number }[]>(
    state.pricing.length > 0
      ? state.pricing
      : availableRoomTypes.map((rt) => {
          const inv = hotelInv.find((b) => b.roomTypeId === rt.id);
          return {
            roomTypeId: rt.id,
            retailPrice: Math.round((inv?.pricePerNight ?? rt.pricePerNight) * 1.3),
          };
        })
  );

  /* Raw string values for each input so users can freely clear & retype */
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  function updatePrice(roomTypeId: string, raw: string) {
    const cleaned = raw.replace(/[^0-9]/g, "");
    setEditValues((prev) => ({ ...prev, [roomTypeId]: cleaned }));
    const num = cleaned === "" ? 0 : parseInt(cleaned);
    setPricing((prev) => prev.map((p) => (p.roomTypeId === roomTypeId ? { ...p, retailPrice: num } : p)));
  }

  function handleBlur(roomTypeId: string) {
    setEditValues((prev) => {
      const next = { ...prev };
      delete next[roomTypeId];
      return next;
    });
  }

  /** Calcula margen por tipo: (precio/huésped × huéspedes × habs × días) − (costo/noche × habs × días) */
  function calcMargin(retailPrice: number, costPerNight: number, maxGuests: number, availableRooms: number) {
    const income = retailPrice * maxGuests * availableRooms * state.nights;
    const cost = costPerNight * availableRooms * state.nights;
    const margin = income - cost;
    const pct = cost > 0 ? Math.round((margin / cost) * 100) : 0;
    return { margin, pct };
  }

  /* Total profit calculation (only rooms with inventory) */
  const totalSale = availableRoomTypes.reduce((s, rt) => {
    const entry = pricing.find((p) => p.roomTypeId === rt.id);
    const inv = hotelInv.find((b) => b.roomTypeId === rt.id);
    const costPerNight = inv?.pricePerNight ?? rt.pricePerNight;
    const retail = entry?.retailPrice ?? Math.round(costPerNight * 1.3);
    const rooms = inv?.availableRooms ?? 0;
    return s + retail * rt.maxGuests * rooms * state.nights;
  }, 0);
  const totalCost = availableRoomTypes.reduce((s, rt) => {
    const inv = hotelInv.find((b) => b.roomTypeId === rt.id);
    const rooms = inv?.availableRooms ?? 0;
    return s + (inv?.pricePerNight ?? rt.pricePerNight) * rooms * state.nights;
  }, 0);
  const grossMargin = totalSale - totalCost;
  const agencyComm = Math.round(totalSale * 0.16);
  const officeComm = Math.round(totalSale * 0.02);
  const netProfit = grossMargin - agencyComm - officeComm;

  return (
    <div className="animate-fade-in-up flex flex-col gap-0 px-16 py-10">
      <div className="flex gap-12">
        {/* LEFT: main content */}
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              PASO 4 DE 6
            </span>
            <h2 className="text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
              Precios por habitacion
            </h2>
            <p className="text-[15px] leading-[22px] text-humana-muted">
              {t.createRetreat.step4.subtitle}
            </p>
          </div>

          <StepIndicator
            steps={t.createRetreat?.steps ?? ["Hotel", "Info básica", "Programa", "Precios", "Galería", "Revisión"]}
            currentStep={3}
            className="flex items-center gap-0 py-6"
          />

          {/* Pricing table */}
          <div className="overflow-hidden border border-humana-line bg-white">
            {/* Table header */}
            <div className="grid grid-cols-[48px_1.8fr_1fr_0.8fr_1fr_1fr] items-center gap-4 border-b border-humana-line bg-humana-stone px-6 py-3">
              <span />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                Habitación
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                Habs / Capacidad
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                Costo/noche
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                Precio/huésped
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                Margen
              </span>
            </div>

            {/* Room rows */}
            {availableRoomTypes.map((rt) => {
              const priceEntry = pricing.find((p) => p.roomTypeId === rt.id);
              const inv = hotelInv.find((b) => b.roomTypeId === rt.id);
              const costPerNight = inv?.pricePerNight ?? rt.pricePerNight;
              const retail = priceEntry?.retailPrice ?? Math.round(costPerNight * 1.3);
              const { margin, pct: marginPct } = calcMargin(retail, costPerNight, rt.maxGuests, inv?.availableRooms ?? 0);

              return (
                <div
                  key={rt.id}
                  className="grid grid-cols-[48px_1.8fr_1fr_0.8fr_1fr_1fr] items-center gap-4 border-b border-humana-line px-6 py-4 last:border-b-0"
                >
                  <div className="relative h-[36px] w-[48px] overflow-hidden rounded">
                    <Image src={rt.image} alt={rt.name} fill className="object-cover" />
                  </div>
                  <span className="text-[15px] font-medium text-humana-ink">{rt.name}</span>
                  <span className="text-[14px] text-humana-ink">
                    {inv?.availableRooms ?? 0} habs · {(inv?.availableRooms ?? 0) * rt.maxGuests} pers.
                  </span>
                  <span className="text-[14px] text-humana-muted">
                    ${costPerNight.toLocaleString("en-US")}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] text-humana-muted">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editValues[rt.id] ?? String(retail)}
                      onChange={(e) => updatePrice(rt.id, e.target.value)}
                      onBlur={() => handleBlur(rt.id)}
                      className="w-full border border-humana-line bg-white px-2 py-1.5 text-[14px] text-humana-ink outline-none focus:border-humana-gold transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-[14px] font-semibold ${margin > 0 ? "text-emerald-600" : margin < 0 ? "text-red-500" : "text-humana-muted"}`}>
                      {margin >= 0 ? "+" : "−"}${Math.abs(margin).toLocaleString("en-US")}
                    </span>
                    <span className={`text-[12px] ${margin > 0 ? "text-emerald-600" : margin < 0 ? "text-red-500" : "text-humana-subtle"}`}>
                      {margin >= 0 ? "+" : "−"}{Math.abs(marginPct)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total de ganancia */}
          {availableRoomTypes.length > 0 && (
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                Total de ganancia
              </span>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Ingresos por venta</span>
                  <span className="text-[14px] font-medium text-humana-ink">
                    ${totalSale.toLocaleString("en-US")} USD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Costo de habitaciones</span>
                  <span className="text-[14px] text-humana-muted">
                    −${totalCost.toLocaleString("en-US")} USD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Comisión agencia (16%)</span>
                  <span className="text-[14px] text-humana-muted">
                    −${agencyComm.toLocaleString("en-US")} USD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Comisión oficina (2%)</span>
                  <span className="text-[14px] text-humana-muted">
                    −${officeComm.toLocaleString("en-US")} USD
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-humana-line pt-3">
                  <span className="text-[15px] font-semibold text-humana-ink">Ganancia neta</span>
                  <span className={`text-[16px] font-semibold ${netProfit > 0 ? "text-emerald-600" : netProfit < 0 ? "text-red-500" : "text-humana-muted"}`}>
                    ${netProfit.toLocaleString("en-US")} USD
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: VISTA PREVIA sidebar */}
        <WizardVistaPrevia currentStep={4} localPricing={pricing} onNext={() => set({ pricing })} />
      </div>
    </div>
  );
}
