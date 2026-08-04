/** Retreat wizard step 3 — per-room-type pricing with the estimated
 *  earnings split (agency / office / creator). */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRetreatWizard } from "@/contexts/RetreatWizardContext";
import { hotelApi, type RoomType } from "@/lib/api/hotel";

const AGENCY_PCT = 16;
const OFFICE_PCT = 2;
const CREATOR_PCT = 82;

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

export default function RetreatPricingStep() {
  const { t } = useLocale();
  const tw = t.hotelWs.retreats.wizard;
  const { state, set } = useRetreatWizard();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi
      .listRoomTypes()
      .then((res) => setRoomTypes(res.room_types))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Ensure the wizard holds one pricing entry per room type
  useEffect(() => {
    if (!roomTypes.length) return;
    const known = new Set(state.pricing.map((p) => p.roomTypeId));
    const missing = roomTypes.filter((rt) => !known.has(rt.id));
    if (missing.length) {
      set({
        pricing: [
          ...state.pricing.filter((p) => roomTypes.some((rt) => rt.id === p.roomTypeId)),
          ...missing.map((rt) => ({ roomTypeId: rt.id, price: "" })),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypes]);

  const totalCents = roomTypes.reduce((sum, rt) => {
    const entry = state.pricing.find((p) => p.roomTypeId === rt.id);
    return sum + (entry ? toCents(entry.price) * rt.capacity : 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tw.stepOf(3, 5)}
        </p>
        <h2 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">{tw.pricing.title}</h2>
        <p className="mt-1 text-[15px] leading-[22px] text-humana-muted">{tw.pricing.subtitle}</p>

        {roomTypes.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-lg border border-dashed border-humana-line py-14 text-center">
            <p className="text-[15px] font-medium text-humana-ink">{tw.pricing.empty}</p>
            <p className="mt-1 max-w-sm text-[13px] text-humana-muted">{tw.pricing.emptyHint}</p>
            <Link
              href="/hotel/rooms"
              className="mt-6 bg-humana-ink px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
            >
              {t.hotelWs.nav.rooms}
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            {/* Table header */}
            <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-4 border-b border-humana-line pb-3">
              {[tw.pricing.room, tw.pricing.roomsCapacity, tw.pricing.pricePerGuest, tw.pricing.totalPrice].map(
                (header) => (
                  <span
                    key={header}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle"
                  >
                    {header}
                  </span>
                ),
              )}
            </div>
            {roomTypes.map((roomType) => {
              const entry = state.pricing.find((p) => p.roomTypeId === roomType.id);
              const cents = entry ? toCents(entry.price) : 0;
              return (
                <div
                  key={roomType.id}
                  className="grid grid-cols-[1.8fr_1fr_1fr_1fr] items-center gap-4 border-b border-humana-line py-4"
                >
                  <div>
                    <p className="text-[14px] font-medium text-humana-ink">{roomType.name}</p>
                    <p className="mt-0.5 text-[12px] text-humana-muted">
                      {roomType.category}
                      {roomType.description ? ` · ${roomType.description}` : ""}
                    </p>
                  </div>
                  <span className="text-[13px] text-humana-ink">
                    {tw.pricing.guests(roomType.capacity)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-humana-subtle">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={entry?.price ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.]/g, "");
                        set({
                          pricing: state.pricing.map((p) =>
                            p.roomTypeId === roomType.id ? { ...p, price: raw } : p,
                          ),
                        });
                      }}
                      placeholder="0"
                      className="w-[110px] border border-humana-line bg-white px-3 py-2 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                    />
                  </div>
                  <span className="text-[14px] font-medium text-humana-ink">
                    {cents > 0 ? `${formatMoney(cents * roomType.capacity)} USD` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {roomTypes.length > 0 && (
        <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {tw.pricing.earningsTitle}
          </p>
          <div className="mt-4 flex flex-col divide-y divide-humana-line">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-humana-muted">
                {tw.pricing.agencyCommission(AGENCY_PCT)}
              </span>
              <span className="text-[13px] font-medium text-humana-gold">
                {formatMoney((totalCents * AGENCY_PCT) / 100)} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-humana-muted">
                {tw.pricing.officeCommission(OFFICE_PCT)}
              </span>
              <span className="text-[13px] font-medium text-humana-ink">
                {formatMoney((totalCents * OFFICE_PCT) / 100)} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-humana-muted">
                {tw.pricing.creatorIncome(CREATOR_PCT)}
              </span>
              <span className="text-[13px] font-medium text-humana-ink">
                {formatMoney((totalCents * CREATOR_PCT) / 100)} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[14px] font-semibold text-humana-ink">
                {tw.pricing.totalEarnings}
              </span>
              <span className="text-[15px] font-bold text-humana-ink">
                {formatMoney(totalCents)} USD
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
