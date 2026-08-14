"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { inclusionsByCategory, INCLUSION_CATALOG } from "@/lib/inclusion-catalog";

interface InclusionPickerProps {
  selected: string[];
  customItems: string[];
  onToggle: (id: string) => void;
  onAddCustom: (name: string) => void;
  onRemoveCustom: (name: string) => void;
}

export function InclusionPicker({
  selected,
  customItems,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: InclusionPickerProps) {
  const { t } = useLocale();
  const [customInput, setCustomInput] = useState("");
  const grouped = inclusionsByCategory();

  function handleAddCustom() {
    const name = customInput.trim();
    if (!name || customItems.includes(name)) return;
    onAddCustom(name);
    setCustomInput("");
  }

  return (
    <div className="flex flex-col gap-5">
      {grouped.map(({ category, items }) => (
        <div key={category}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
            {t.inclusionCategories[category]}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const isSelected = selected.includes(item.id);
              const label = t.inclusionNames[item.id] ?? INCLUSION_CATALOG[item.id].name;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                    isSelected
                      ? "border-humana-gold bg-humana-gold-light font-medium text-humana-ink"
                      : "border-humana-line bg-white text-humana-muted hover:border-humana-gold/40"
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-humana-gold">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom items */}
      {customItems.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
            {t.inclusionCategories.custom}
          </p>
          <div className="flex flex-wrap gap-2">
            {customItems.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1.5 rounded-full border border-humana-gold bg-humana-gold-light px-3.5 py-1.5 text-[13px] font-medium text-humana-ink"
              >
                {name}
                <button
                  type="button"
                  onClick={() => onRemoveCustom(name)}
                  className="cursor-pointer text-humana-subtle transition-colors hover:text-red-500"
                  aria-label="Remove"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          placeholder={t.inclusionCategories.customPlaceholder}
          className="border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold w-[280px]"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="cursor-pointer text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
        >
          + {t.inclusionCategories.addCustom}
        </button>
      </div>
    </div>
  );
}
