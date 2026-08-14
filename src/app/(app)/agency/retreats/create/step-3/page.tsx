/** Agency retreat wizard step 3 — room selection & pricing.
 *  Shows inventory blocks for the selected hotel covering the retreat dates.
 *  Each block can be included/excluded, and a retail price per guest is set.
 *  Capacity coverage indicator + commission breakdown. */
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  useAgencyRetreatWizard,
  computeEndDate,
  type AgencyPricingEntry,
} from "@/contexts/AgencyRetreatWizardContext";
import { agencyApi, type ApiInventoryBlock } from "@/lib/api/agency";

const COMMISSION_PCT = 18;

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

const inputClass =
  "w-full border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

export default function AgencyRetreatRoomsStep() {
  const { t } = useLocale();
  const tw = t.agencyWs.retreats.wizard;
  const { state, set } = useAgencyRetreatWizard();
  const [blocks, setBlocks] = useState<ApiInventoryBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const endDate = computeEndDate(state.startDate, state.nights);

  useEffect(() => {
    if (!state.hotelId || !state.startDate || !endDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    agencyApi
      .listInventoryBlocks({ hotel_id: state.hotelId, from: state.startDate, to: endDate })
      .then((res) => {
        setBlocks(res.inventory_blocks.filter((b) => b.available_rooms > 0));
        // Initialize pricing entries if not yet set for these blocks
        if (state.pricing.length === 0 || state.pricing[0]?.inventoryBlockId === 0) {
          const entries: AgencyPricingEntry[] = res.inventory_blocks
            .filter((b) => b.available_rooms > 0)
            .map((block) => {
              const existing = state.pricing.find((p) => p.roomTypeId === block.room_type_id);
              return {
                inventoryBlockId: block.id,
                roomTypeId: block.room_type_id,
                price: existing?.price ?? "",
                included: existing?.included ?? true,
                availableRooms: block.available_rooms,
                costPerNightCents: block.cost_per_night_cents,
              };
            });
          set({ pricing: entries });
        }
      })
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hotelId, state.startDate, endDate]);

  // Update capacity covered whenever pricing changes
  useEffect(() => {
    const included = state.pricing.filter((p) => p.included !== false && toCents(p.price) > 0);
    let totalGuests = 0;
    for (const entry of included) {
      const block = blocks.find((b) => b.id === entry.inventoryBlockId);
      if (block) {
        const rooms = entry.allocatedRooms ?? block.available_rooms;
        totalGuests += rooms * (block.room_type?.capacity ?? 1);
      }
    }
    set({ capacityCovered: totalGuests });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pricing, blocks]);

  function updatePricing(blockId: number, patch: Partial<AgencyPricingEntry>) {
    set({
      pricing: state.pricing.map((p) =>
        p.inventoryBlockId === blockId ? { ...p, ...patch } : p,
      ),
    });
  }

  const capacityCovered = state.capacityCovered ?? 0;
  const capacityIsCovered = capacityCovered >= state.capacity;

  // Total revenue from included rooms
  const totalCents = state.pricing
    .filter((p) => p.included !== false)
    .reduce((sum, p) => {
      const block = blocks.find((b) => b.id === p.inventoryBlockId);
      if (!block) return sum;
      const guestsCents = toCents(p.price);
      return sum + guestsCents * block.available_rooms * (block.room_type?.capacity ?? 1);
    }, 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tw.stepOf(3, 6)}
        </p>
        <h2 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
          {tw.rooms.title}
        </h2>
        <p className="mt-1 text-[15px] leading-[22px] text-humana-muted">{tw.rooms.subtitle}</p>

        {blocks.length === 0 ? (
          <div className="mt-8 rounded-lg border border-humana-line bg-humana-stone/30 py-12 text-center">
            <p className="text-[15px] font-medium text-humana-ink">{tw.rooms.empty}</p>
            <p className="mt-2 text-[13px] text-humana-muted">{tw.rooms.emptyHint}</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {blocks.map((block) => {
              const entry = state.pricing.find((p) => p.inventoryBlockId === block.id);
              const isIncluded = entry?.included !== false;
              const rt = block.room_type;
              const spotsPerRoom = rt?.capacity ?? 1;
              const totalSpots = block.available_rooms * spotsPerRoom;

              return (
                <div
                  key={block.id}
                  className={`rounded-xl border p-5 transition-all ${
                    isIncluded ? "border-humana-gold/40 bg-white" : "border-humana-line bg-humana-stone/30 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => updatePricing(block.id, { included: !isIncluded })}
                      className={`mt-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-all ${
                        isIncluded ? "border-humana-gold bg-humana-gold" : "border-humana-line"
                      }`}
                    >
                      {isIncluded && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    {/* Room info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-humana-ink">{rt?.name ?? "Room"}</p>
                      <p className="mt-0.5 text-[12px] capitalize text-humana-muted">
                        {rt?.category ?? ""} · {tw.rooms.capacityLabel(spotsPerRoom)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-humana-subtle">
                        <span>{tw.rooms.available(block.available_rooms, block.total_rooms)}</span>
                        <span>{tw.rooms.spots(totalSpots)}</span>
                        <span>{tw.rooms.cost(formatMoney(block.cost_per_night_cents))}</span>
                      </div>
                    </div>

                    {/* Allocated rooms */}
                    <div className="w-[120px] shrink-0">
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-muted">
                        {tw.rooms.allocatedLabel}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          max={block.available_rooms}
                          value={entry?.allocatedRooms ?? ""}
                          onChange={(e) => {
                            const val = e.target.value === "" ? undefined : Math.max(1, Math.min(parseInt(e.target.value) || 1, block.available_rooms));
                            updatePricing(block.id, { allocatedRooms: val });
                          }}
                          disabled={!isIncluded}
                          className={`${inputClass} w-[60px] text-center ${!isIncluded ? "opacity-40" : ""}`}
                          placeholder={String(block.available_rooms)}
                        />
                        <span className="text-[12px] text-humana-subtle">/ {block.available_rooms}</span>
                      </div>
                    </div>

                    {/* Price input */}
                    <div className="w-[160px] shrink-0">
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-muted">
                        {tw.rooms.pricePerGuest}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-humana-muted">$</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={entry?.price ?? ""}
                          onChange={(e) => updatePricing(block.id, { price: e.target.value })}
                          disabled={!isIncluded}
                          className={`${inputClass} pl-7 ${!isIncluded ? "opacity-40" : ""}`}
                          placeholder="0"
                        />
                      </div>
                      {isIncluded && entry && toCents(entry.price) > 0 && (
                        <p className="mt-1 text-[11px] text-humana-subtle">
                          {tw.rooms.margin}: {formatMoney(toCents(entry.price) - block.cost_per_night_cents * state.nights)}/{tw.rooms.guest}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Capacity coverage indicator */}
        {blocks.length > 0 && (
          <div className="mt-6">
            <div
              className={`flex items-start gap-3 rounded-lg px-4 py-3 ${
                capacityIsCovered ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {capacityIsCovered ? (
                <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <div>
                <p className={`text-[13px] font-medium ${capacityIsCovered ? "text-emerald-700" : "text-amber-700"}`}>
                  {tw.rooms.coverageLabel(capacityCovered, state.capacity)}
                </p>
                <p className="mt-0.5 text-[12px] text-humana-muted">
                  {capacityIsCovered ? tw.rooms.coverageOk : tw.rooms.coverageShort}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Commission */}
      {blocks.length > 0 && totalCents > 0 && (
        <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {tw.rooms.earningsTitle}
          </p>
          <div className="mt-4 flex flex-col divide-y divide-humana-line">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13px] text-humana-muted">
                {tw.rooms.commission(COMMISSION_PCT)}
              </span>
              <span className="text-[13px] font-medium text-humana-gold">
                {formatMoney((totalCents * COMMISSION_PCT) / 100)} USD
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[14px] font-semibold text-humana-ink">
                {tw.rooms.totalEarnings}
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
