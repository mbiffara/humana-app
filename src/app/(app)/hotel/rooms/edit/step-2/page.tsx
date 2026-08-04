/** Room type editor step 2 — amenities (HT-03d): grouped catalog of
 *  toggle chips stored on the room type's amenities array. */
"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRoomTypeEditor } from "@/contexts/RoomTypeEditorContext";

const CATALOG: { group: "features" | "bathroom" | "technology" | "outdoor"; items: string[] }[] = [
  {
    group: "features",
    items: ["air_conditioning", "private_terrace", "king_bed", "minibar", "safe_box", "desk", "closet"],
  },
  {
    group: "bathroom",
    items: ["outdoor_shower", "rainfall_shower", "organic_toiletries", "bathtub", "bidet", "hair_dryer"],
  },
  {
    group: "technology",
    items: ["free_wifi", "smart_tv", "bluetooth_speaker", "usb_charging"],
  },
  {
    group: "outdoor",
    items: ["garden_view", "hammock", "ocean_view", "pool_access", "private_plunge_pool"],
  },
];

const CATALOG_ITEMS = new Set(CATALOG.flatMap((c) => c.items));

export default function RoomAmenitiesStep() {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state, set } = useRoomTypeEditor();
  const [customInput, setCustomInput] = useState("");

  // Anything on the room type that isn't in the catalog is a custom amenity
  const customAmenities = state.amenities.filter((a) => !CATALOG_ITEMS.has(a));

  function toggle(item: string) {
    set({
      amenities: state.amenities.includes(item)
        ? state.amenities.filter((a) => a !== item)
        : [...state.amenities, item],
    });
  }

  function addCustom() {
    const name = customInput.trim();
    if (!name) return;
    const exists = state.amenities.some((a) => a.toLowerCase() === name.toLowerCase());
    if (!exists) {
      set({ amenities: [...state.amenities, name] });
    }
    setCustomInput("");
  }

  return (
    <section className="rounded-xl border border-humana-line bg-white p-8 animate-fade-in-up">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {te.stepOf(2, 5)}
      </p>
      <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{te.amenitiesStep.title}</h2>
      <p className="mt-1 text-[13px] text-humana-muted">{te.amenitiesStep.subtitle}</p>

      <div className="mt-8 flex flex-col gap-7">
        {CATALOG.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-3 text-[13px] font-semibold text-humana-ink">
              {te.amenitiesStep.groups[group]}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => {
                const selected = state.amenities.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${
                      selected
                        ? "border-humana-ink bg-humana-ink text-white"
                        : "border-humana-line bg-white text-humana-muted hover:border-humana-ink hover:text-humana-ink"
                    }`}
                  >
                    {te.amenitiesStep.items[item] ?? item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom amenities */}
      <div className="mt-7">
        <p className="mb-3 text-[13px] font-semibold text-humana-ink">
          {te.amenitiesStep.customGroup}
        </p>
        {customAmenities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {customAmenities.map((item) => (
              <button
                key={item}
                onClick={() => toggle(item)}
                title={te.availability.remove}
                className="group cursor-pointer flex items-center gap-2 rounded-full border border-humana-gold/50 bg-humana-gold-light px-4 py-2 text-[13px] text-humana-ink transition-all hover:border-humana-ink"
              >
                {item}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50 transition-opacity group-hover:opacity-100">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder={te.amenitiesStep.customPlaceholder}
            className="flex-1 max-w-[360px] rounded-full border border-humana-line bg-white px-4 py-2 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/60 focus:border-humana-gold"
          />
          <button
            onClick={addCustom}
            disabled={!customInput.trim()}
            className="cursor-pointer rounded-full bg-humana-ink px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {te.amenitiesStep.addCustom}
          </button>
        </div>
      </div>

      <p className="mt-8 text-[12px] text-humana-subtle">
        {te.amenitiesStep.selected(state.amenities.length)}
      </p>
    </section>
  );
}
