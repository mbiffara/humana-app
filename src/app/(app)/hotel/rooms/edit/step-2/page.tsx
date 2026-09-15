/** Room type editor step 2 — amenities (HT-03d): the shared room amenity
 *  catalog, stored on the room type's amenities array. */
"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useRoomTypeEditor } from "@/contexts/RoomTypeEditorContext";
import { RoomAmenityPicker } from "@/components/hotel/RoomAmenityPicker";

export default function RoomAmenitiesStep() {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state, set } = useRoomTypeEditor();

  return (
    <section className="rounded-xl border border-humana-line bg-white p-8 animate-fade-in-up">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {te.stepOf(2, 5)}
      </p>
      <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{te.amenitiesStep.title}</h2>
      <p className="mt-1 text-[13px] text-humana-muted">{te.amenitiesStep.subtitle}</p>

      <div className="mt-8">
        <RoomAmenityPicker
          selected={state.amenities}
          onChange={(amenities) => set({ amenities })}
          allowCustom
        />
      </div>
    </section>
  );
}
