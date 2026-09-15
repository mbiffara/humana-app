/** Equipment catalog of a common space as toggle chips. One flat list — the
 *  catalog is short enough that groups would only add noise. Ids saved by
 *  another client stay listed so opening and re-saving never drops them. */
"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { SPACE_EQUIPMENT, equipmentLabel } from "@/lib/space-catalog";

export function SpaceEquipmentPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const { t } = useLocale();
  const c = t.commonSpaces;

  // Anything on the space that isn't in the catalog came from elsewhere
  const extras = selected.filter((id) => !(SPACE_EQUIPMENT as readonly string[]).includes(id));

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((e) => e !== id) : [...selected, id]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {[...SPACE_EQUIPMENT, ...extras].map((id) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${
              isSelected
                ? "border-humana-ink bg-humana-ink text-white"
                : "border-humana-line bg-white text-humana-muted hover:border-humana-ink hover:text-humana-ink"
            }`}
          >
            {equipmentLabel(c, id)}
          </button>
        );
      })}
    </div>
  );
}
