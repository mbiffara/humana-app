"use client";

import { useState } from "react";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";

const INPUT =
  "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20";

/* ─── Amenity data ─── */
const GUEST_FAVORITES = [
  {
    id: "wifi",
    name: "Wifi",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
  },
  {
    id: "pool",
    name: "Pool",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
        <path d="M2 16c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
        <path d="M8 4v8" />
        <path d="M16 4v8" />
        <path d="M8 8h8" />
      </svg>
    ),
  },
  {
    id: "spa",
    name: "Spa & Sauna",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </svg>
    ),
  },
  {
    id: "breakfast",
    name: "Breakfast",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "parking",
    name: "Parking",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
  },
  {
    id: "ac",
    name: "Air conditioning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10" />
        <path d="m4.93 10.93 1.41 1.41" />
        <path d="M2 18h2" />
        <path d="M20 18h2" />
        <path d="m19.07 10.93-1.41 1.41" />
        <path d="M22 22H2" />
        <path d="m8 6 4-4 4 4" />
        <path d="M16 18a4 4 0 0 0-8 0" />
      </svg>
    ),
  },
  {
    id: "yoga-studio",
    name: "Yoga studio",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6v4" />
        <path d="m6 14 3-3 3 3 3-3 3 3" />
        <path d="M4 20h16" />
        <path d="M9 10l-3 4" />
        <path d="M15 10l3 4" />
      </svg>
    ),
  },
  {
    id: "gym",
    name: "Gym",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11" />
        <path d="M6.5 17.5h11" />
        <path d="M3 10V7a1 1 0 0 1 1-1h2v12H4a1 1 0 0 1-1-1v-3" />
        <path d="M21 10v-3a1 1 0 0 0-1-1h-2v12h2a1 1 0 0 0 1-1v-3" />
        <path d="M6 6v12" />
        <path d="M18 6v12" />
        <path d="M6 12h12" />
      </svg>
    ),
  },
];

const STANDOUT_AMENITIES = [
  {
    id: "meditation-room",
    name: "Meditation room",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
        <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
      </svg>
    ),
  },
  {
    id: "private-garden",
    name: "Private garden",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-7" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        <path d="M6 12h12" />
      </svg>
    ),
  },
  {
    id: "ocean-terrace",
    name: "Ocean terrace",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
        <path d="M17 8.5A5 5 0 0 0 7 8.5" />
        <path d="M12 3v2" />
        <path d="M4.22 10.22l1.42 1.42" />
        <path d="M18.36 11.64l1.42-1.42" />
        <path d="M2 16c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
      </svg>
    ),
  },
  {
    id: "private-chef",
    name: "Private chef",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" y1="17" x2="18" y2="17" />
      </svg>
    ),
  },
];

/* ─── Amenity Toggle Card ─── */
function AmenityCard({
  name,
  icon,
  selected,
  onToggle,
}: {
  name: string;
  icon: React.ReactNode;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`cursor-pointer flex flex-col justify-between rounded-[6px] border px-4 pb-4 pt-5 transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
        selected
          ? "border-humana-ink shadow-[0_0_0_1px_#111]"
          : "border-humana-line bg-white hover:border-humana-muted"
      }`}
      style={{ aspectRatio: "1 / 0.72" }}
    >
      <div
        className={`transition-colors duration-200 ${
          selected ? "text-humana-ink" : "text-humana-subtle"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-[13px] text-left leading-tight transition-colors duration-200 ${
          selected ? "font-medium text-humana-ink" : "text-humana-muted"
        }`}
      >
        {name}
      </span>
    </button>
  );
}

/* ─── Main Step 3 Page ─── */
export default function HotelWizardStep3() {
  const { state, toggleAmenity, addCustomAmenity, removeCustomAmenity } =
    useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const [customInput, setCustomInput] = useState("");

  function handleAddCustom() {
    const value = customInput.trim();
    if (value && !state.customAmenities.includes(value)) {
      addCustomAmenity(value);
      setCustomInput("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  }

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[700px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step3Eyebrow}
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.step3Title}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.step3Subtitle}
        </p>

        {/* Guest Favorites */}
        <div className="mt-10">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {h.guestFavorites}
          </h3>
          <div className="mt-4 grid grid-cols-4 gap-3 stagger-children">
            {GUEST_FAVORITES.map((amenity) => (
              <AmenityCard
                key={amenity.id}
                name={h.amenityNames[amenity.id] || amenity.name}
                icon={amenity.icon}
                selected={state.amenities.includes(amenity.id)}
                onToggle={() => toggleAmenity(amenity.id)}
              />
            ))}
          </div>
        </div>

        {/* Standout Amenities */}
        <div className="mt-10">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {h.standoutAmenities}
          </h3>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {STANDOUT_AMENITIES.map((amenity) => (
              <AmenityCard
                key={amenity.id}
                name={h.amenityNames[amenity.id] || amenity.name}
                icon={amenity.icon}
                selected={state.amenities.includes(amenity.id)}
                onToggle={() => toggleAmenity(amenity.id)}
              />
            ))}
          </div>
        </div>

        {/* Custom Amenity */}
        <div className="mt-10">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {h.customAmenity}
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={h.customPlaceholder}
              className={`flex-1 ${INPUT}`}
            />
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={!customInput.trim()}
              className="cursor-pointer flex items-center gap-1.5 rounded-[6px] bg-humana-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {h.addButton}
            </button>
          </div>

          {/* Custom amenity tags */}
          {state.customAmenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {state.customAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center gap-1.5 rounded-[6px] border border-humana-line bg-white px-3 py-1.5 text-[13px] text-humana-ink transition-all animate-fade-in-scale"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeCustomAmenity(amenity)}
                    className="cursor-pointer text-humana-subtle transition-colors hover:text-red-500"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
