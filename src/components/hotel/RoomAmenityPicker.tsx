/** Room amenity catalog as toggle chips, shared by the onboarding wizard
 *  (step 2) and the room type editor (step 2) so both offer the same list.
 *  Amenities saved outside the catalog stay listed as custom chips. */
"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ROOM_AMENITIES, ROOM_AMENITY_IDS, roomAmenityLabel } from "@/lib/room-catalog";

export function RoomAmenityPicker({
  selected,
  onChange,
  allowCustom,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  allowCustom?: boolean;
}) {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const items = te.amenitiesStep.items;
  const [customInput, setCustomInput] = useState("");

  // Anything on the room type that isn't in the catalog is a custom amenity
  const customAmenities = selected.filter((a) => !ROOM_AMENITY_IDS.has(a));

  function toggle(item: string) {
    onChange(
      selected.includes(item) ? selected.filter((a) => a !== item) : [...selected, item],
    );
  }

  function addCustom() {
    const name = customInput.trim();
    if (!name) return;
    const needle = name.toLowerCase();
    // Don't let a typed amenity duplicate one already picked, nor a catalog
    // entry the owner could have toggled by its id or its translated label.
    const exists =
      selected.some((a) => a.toLowerCase() === needle) ||
      [...ROOM_AMENITY_IDS].some(
        (id) =>
          id.toLowerCase() === needle ||
          roomAmenityLabel(id, items).toLowerCase() === needle,
      );
    if (!exists) onChange([...selected, name]);
    setCustomInput("");
  }

  return (
    <div>
      <div className="flex flex-col gap-7">
        {ROOM_AMENITIES.map(({ group, items: groupItems }) => (
          <div key={group}>
            <p className="mb-3 text-[13px] font-semibold text-humana-ink">
              {te.amenitiesStep.groups[group]}
            </p>
            <div className="flex flex-wrap gap-2">
              {groupItems.map((item) => {
                const isSelected = selected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(item)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${
                      isSelected
                        ? "border-humana-ink bg-humana-ink text-white"
                        : "border-humana-line bg-white text-humana-muted hover:border-humana-ink hover:text-humana-ink"
                    }`}
                  >
                    {roomAmenityLabel(item, items)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom amenities — also where amenities from an older catalog land */}
      {(allowCustom || customAmenities.length > 0) && (
        <div className="mt-7">
          <p className="mb-3 text-[13px] font-semibold text-humana-ink">
            {te.amenitiesStep.customGroup}
          </p>
          {customAmenities.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {customAmenities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  title={te.availability.remove}
                  className="group cursor-pointer flex items-center gap-2 rounded-full border border-humana-gold/50 bg-humana-gold-light px-4 py-2 text-[13px] text-humana-ink transition-all hover:border-humana-ink"
                >
                  {roomAmenityLabel(item, items)}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50 transition-opacity group-hover:opacity-100">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              ))}
            </div>
          )}
          {allowCustom && (
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
                type="button"
                onClick={addCustom}
                disabled={!customInput.trim()}
                className="cursor-pointer rounded-full bg-humana-ink px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {te.amenitiesStep.addCustom}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="mt-8 text-[12px] text-humana-subtle">
        {te.amenitiesStep.selected(selected.length)}
      </p>
    </div>
  );
}
