/** Room type editor step 2 — amenities (HT-03d): grouped catalog of
 *  toggle chips stored on the room type's amenities array. */
"use client";

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

export default function RoomAmenitiesStep() {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state, set } = useRoomTypeEditor();

  function toggle(item: string) {
    set({
      amenities: state.amenities.includes(item)
        ? state.amenities.filter((a) => a !== item)
        : [...state.amenities, item],
    });
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

      <p className="mt-8 text-[12px] text-humana-subtle">
        {te.amenitiesStep.selected(state.amenities.length)}
      </p>
    </section>
  );
}
