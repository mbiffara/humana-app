/** Room type editor step 1 — details (HT-03b): identity, capacity,
 *  units (backed by individual Room records), bed, size, and status. */
"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRoomTypeEditor } from "@/contexts/RoomTypeEditorContext";
import type { RoomTypeStatus } from "@/lib/api/hotel";

const BED_TYPES = ["single", "double", "queen", "king", "twin", "bunk", "sofa_bed"] as const;
const STATUSES: RoomTypeStatus[] = ["active", "draft", "inactive"];

const STATUS_DOTS: Record<RoomTypeStatus, string> = {
  active: "bg-emerald-500",
  draft: "bg-humana-gold",
  inactive: "bg-red-400",
};

const inputClass =
  "w-full border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function RoomDetailsStep() {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state, set } = useRoomTypeEditor();

  return (
    <section className="rounded-xl border border-humana-line bg-white p-8 animate-fade-in-up">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {te.stepOf(1, 5)}
      </p>
      <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{te.details.title}</h2>
      <p className="mt-1 text-[13px] text-humana-muted">{te.details.subtitle}</p>

      <div className="mt-8 flex flex-col gap-6">
        <Field label={te.details.name}>
          <input
            type="text"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder={te.details.namePlaceholder}
            className={inputClass}
          />
        </Field>

        <Field label={te.details.description}>
          <textarea
            value={state.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder={te.details.descriptionPlaceholder}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label={te.details.maxGuests}>
            <input
              type="number"
              min={1}
              max={20}
              value={state.capacity || ""}
              onChange={(e) => set({ capacity: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className={inputClass}
            />
          </Field>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                {te.details.totalUnits}
              </label>
              {state.roomTypeId && (
                <Link
                  href="/hotel/rooms/units"
                  className="text-[11px] font-medium text-humana-gold transition-opacity hover:opacity-75"
                >
                  {te.details.unitsHint}
                </Link>
              )}
            </div>
            <input
              type="number"
              min={1}
              max={500}
              value={state.totalRooms || ""}
              onChange={(e) => set({ totalRooms: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label={te.details.bedType}>
            <select
              value={state.bedType}
              onChange={(e) => set({ bedType: e.target.value })}
              className={`${inputClass} cursor-pointer`}
            >
              {BED_TYPES.map((bed) => (
                <option key={bed} value={bed}>
                  {te.details.bedTypes[bed]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={te.details.roomSize}>
            <input
              type="text"
              inputMode="decimal"
              value={state.areaSqm}
              onChange={(e) => set({ areaSqm: e.target.value.replace(/[^0-9.]/g, "") })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label={te.details.status}>
          <div className="flex items-center gap-2.5">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => set({ status })}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium transition-all ${
                  state.status === status
                    ? "border-humana-ink bg-humana-ink text-white"
                    : "border-humana-line bg-white text-humana-muted hover:border-humana-ink"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status]}`} />
                {t.hotelWs.roomTypes.statuses[status]}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </section>
  );
}
