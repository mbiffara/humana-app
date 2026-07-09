"use client";

import { useState, useRef, useEffect } from "react";
import { useHotelWizard } from "@/contexts/HotelWizardContext";

/* ─── Mock address suggestions ─── */
const MOCK_SUGGESTIONS = [
  { address: "Carretera Tulum-Boca Paila Km 7.5", city: "Tulum", country: "Mexico" },
  { address: "Calle Mayor 12, Zona Centro", city: "San Miguel de Allende", country: "Mexico" },
  { address: "Av. Kukulcán Km 14.5, Zona Hotelera", city: "Cancún", country: "Mexico" },
  { address: "Camino Real a Huamantla 123", city: "Puebla", country: "Mexico" },
  { address: "Rua das Flores 456, Bairro Jardim", city: "Florianópolis", country: "Brazil" },
];

export default function HotelWizardStep1() {
  const { state, set } = useHotelWizard();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressQuery, setAddressQuery] = useState(state.address);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = MOCK_SUGGESTIONS.filter((s) =>
    `${s.address} ${s.city} ${s.country}`
      .toLowerCase()
      .includes(addressQuery.toLowerCase())
  );

  function selectSuggestion(suggestion: (typeof MOCK_SUGGESTIONS)[0]) {
    const fullAddress = `${suggestion.address}, ${suggestion.city}, ${suggestion.country}`;
    setAddressQuery(fullAddress);
    set({
      address: fullAddress,
      city: suggestion.city,
      country: suggestion.country,
    });
    setShowSuggestions(false);
  }

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[640px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          Step 1 of 4 &middot; Property Identity
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          Tell us about your property.
        </h1>

        {/* Subtitle */}
        <p className="mt-2 max-w-[520px] text-[15px] leading-[22px] text-humana-muted">
          Start with the hotel&apos;s public name and its physical location. We&apos;ll use
          this to verify the property before it joins the network.
        </p>

        {/* Form */}
        <div className="mt-12 flex flex-col gap-10">
          {/* Hotel Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="hotel-name"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted"
            >
              Hotel Name
            </label>
            <input
              id="hotel-name"
              type="text"
              value={state.hotelName}
              onChange={(e) => set({ hotelName: e.target.value })}
              placeholder="Casa del Faro"
              className="border-b border-humana-line bg-transparent py-3 text-[17px] text-humana-ink outline-none transition-colors duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold"
            />
            <span className="text-[12px] text-humana-subtle">
              This is how your property will appear across the HUMANA network.
            </span>
          </div>

          {/* Physical Address */}
          <div className="relative flex flex-col gap-2" ref={suggestionsRef}>
            <label
              htmlFor="address"
              className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted"
            >
              <span>Physical Address</span>
              <span className="flex items-center gap-1 rounded-full bg-humana-gold-light px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-humana-gold">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Autocomplete
              </span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-humana-subtle">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <input
                id="address"
                type="text"
                value={addressQuery}
                onChange={(e) => {
                  setAddressQuery(e.target.value);
                  set({ address: e.target.value });
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (addressQuery.length > 0) setShowSuggestions(true);
                }}
                placeholder="Start typing an address..."
                className="w-full border-b border-humana-line bg-transparent py-3 pl-6 text-[17px] text-humana-ink outline-none transition-colors duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold"
              />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 border border-humana-line bg-white shadow-lg animate-fade-in-down">
                {filteredSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-humana-stone"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8a8578"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-humana-ink">
                        {suggestion.address}
                      </span>
                      <span className="text-[12px] text-humana-subtle">
                        {suggestion.city}, {suggestion.country}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visual hint */}
        <div className="mt-16 flex items-center gap-3 rounded-lg border border-humana-line/60 bg-white p-5 animate-fade-in-up-delay-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium text-humana-ink">
              Verification required
            </span>
            <span className="text-[12px] leading-relaxed text-humana-muted">
              After submission, our team will verify your property details within 24-48
              hours before listing it on the network.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
