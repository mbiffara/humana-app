/** Room type editor step 5 — pricing (HT-03e): base nightly rate plus
 *  volume tiers (min rooms, optional date range, discounted rate). */
"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { generateId, useRoomTypeEditor, type TierEntry } from "@/contexts/RoomTypeEditorContext";

// Volume pricing is built but hidden for now — set to true to bring it back.
const SHOW_VOLUME_PRICING = false;

const inputClass =
  "border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

export default function RoomPricingStep() {
  const { t, locale } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state, set } = useRoomTypeEditor();

  const baseCents = toCents(state.baseRate);

  function updateTier(localId: string, patch: Partial<TierEntry>) {
    set({
      tiers: state.tiers.map((tier) => (tier.localId === localId ? { ...tier, ...patch } : tier)),
    });
  }

  function removeTier(tier: TierEntry) {
    set({
      tiers: state.tiers.filter((entry) => entry.localId !== tier.localId),
      removedTierIds: tier.id ? [...state.removedTierIds, tier.id] : state.removedTierIds,
    });
  }

  function vsBase(tier: TierEntry): string {
    const cents = toCents(tier.price);
    if (!baseCents || !cents) return "—";
    const pct = Math.round(((cents - baseCents) / baseCents) * 100);
    return `${pct > 0 ? "+" : ""}${pct}%`;
  }

  const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <section className="rounded-xl border border-humana-line bg-white p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {te.stepOf(5, 5)}
        </p>
        <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{te.pricing.title}</h2>
        <p className="mt-1 text-[13px] text-humana-muted">{te.pricing.subtitle}</p>

        {/* Base rate */}
        <p className="mt-8 text-[13px] font-semibold text-humana-ink">{te.pricing.baseRate}</p>
        <div className="mt-3 grid grid-cols-2 gap-6">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
              {te.pricing.pricePerNight}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={state.baseRate}
              onChange={(e) => set({ baseRate: e.target.value.replace(/[^0-9.]/g, "") })}
              placeholder="0.00"
              className={`${inputClass} w-full`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
              {te.pricing.currency}
            </label>
            <input
              type="text"
              value="U$D — US Dollar"
              readOnly
              tabIndex={-1}
              className={`${inputClass} pointer-events-none w-full bg-humana-stone text-humana-muted`}
            />
          </div>
        </div>
      </section>

      {/* Volume pricing — temporarily hidden; flip the flag when tiers launch */}
      {SHOW_VOLUME_PRICING && (
      <section className="rounded-xl border border-humana-line bg-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold text-humana-ink">{te.pricing.volumeTitle}</p>
            <p className="mt-1 max-w-md text-[12px] text-humana-muted">{te.pricing.volumeHint}</p>
          </div>
          <button
            onClick={() =>
              set({
                tiers: [
                  ...state.tiers,
                  { localId: generateId(), id: null, minRooms: "5", startsOn: "", endsOn: "", price: "" },
                ],
              })
            }
            className="cursor-pointer text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
          >
            + {te.pricing.addTier}
          </button>
        </div>

        {state.tiers.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-[110px_1fr_150px_80px_40px] gap-4 border-b border-humana-line pb-3">
              {[te.pricing.roomsCol, te.pricing.periodCol, te.pricing.priceCol, te.pricing.vsBase, ""].map(
                (header, i) => (
                  <span
                    key={`${header}-${i}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle"
                  >
                    {header}
                  </span>
                ),
              )}
            </div>
            {state.tiers.map((tier) => (
              <div
                key={tier.localId}
                className="grid grid-cols-[110px_1fr_150px_80px_40px] items-center gap-4 border-b border-humana-line py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-humana-gold-light px-1.5 py-0.5 text-[10px] font-bold text-humana-ink">
                    {tier.minRooms || "?"}+
                  </span>
                  <input
                    type="number"
                    min={2}
                    value={tier.minRooms}
                    onChange={(e) => updateTier(tier.localId, { minRooms: e.target.value })}
                    className={`${inputClass} w-[60px]`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={tier.startsOn}
                    onChange={(e) => updateTier(tier.localId, { startsOn: e.target.value })}
                    className={`${inputClass} flex-1`}
                  />
                  <span className="text-humana-subtle">—</span>
                  <input
                    type="date"
                    value={tier.endsOn}
                    onChange={(e) => updateTier(tier.localId, { endsOn: e.target.value })}
                    className={`${inputClass} flex-1`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] text-humana-subtle">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={tier.price}
                    onChange={(e) =>
                      updateTier(tier.localId, { price: e.target.value.replace(/[^0-9.]/g, "") })
                    }
                    placeholder="0"
                    className={`${inputClass} w-full`}
                  />
                </div>
                <span
                  className={`text-[13px] font-medium ${
                    vsBase(tier).startsWith("-") ? "text-emerald-600" : "text-humana-muted"
                  }`}
                >
                  {vsBase(tier)}
                </span>
                <button
                  onClick={() => removeTier(tier)}
                  className="cursor-pointer p-1 text-humana-subtle transition-colors hover:text-red-500"
                  aria-label="Remove tier"
                >
                  ✕
                </button>
              </div>
            ))}
            {state.tiers.some((tier) => tier.startsOn && tier.endsOn) && (
              <p className="mt-3 text-[11px] text-humana-subtle">
                {state.tiers
                  .filter((tier) => tier.startsOn && tier.endsOn)
                  .map(
                    (tier) =>
                      `${tier.minRooms}+ · ${dateFmt.format(new Date(`${tier.startsOn}T00:00:00`))} — ${dateFmt.format(new Date(`${tier.endsOn}T00:00:00`))}`,
                  )
                  .join("   ·   ")}
              </p>
            )}
          </div>
        )}

        <p className="mt-5 text-[12px] text-humana-subtle">{te.pricing.footnote}</p>
      </section>
      )}
    </div>
  );
}
