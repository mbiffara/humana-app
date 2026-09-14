"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export interface PlaceResult {
  address: string;
  city: string;
  state_region: string;
  country: string;
  country_code: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

let optionsSet = false;

function ensureOptions() {
  if (!optionsSet) {
    setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" });
    optionsSet = true;
  }
}

function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[],
): { city: string; state_region: string; country: string; country_code: string; postal_code: string } {
  let city = "";
  let state_region = "";
  let country = "";
  let country_code = "";
  let postal_code = "";

  for (const component of components) {
    const types = component.types;
    if (types.includes("locality")) {
      city = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      state_region = component.long_name;
    }
    if (types.includes("country")) {
      country = component.long_name;
      country_code = component.short_name;
    }
    if (types.includes("postal_code")) {
      postal_code = component.long_name;
    }
  }

  // Places without a locality (rural addresses) fall back to the region
  if (!city) city = state_region;

  return { city, state_region, country, country_code, postal_code };
}

interface Prediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Start typing an address...",
  required = false,
  className,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [loaded, setLoaded] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize AutocompleteService (no widget — avoids CSS zoom positioning bug)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    ensureOptions();
    importLibrary("places")
      .then(() => {
        serviceRef.current = new google.maps.places.AutocompleteService();
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        setLoaded(true);
      })
      .catch(() => {
        // Google Maps failed to load — input works as plain text fallback
      });
  }, []);

  const fetchPredictions = useCallback((input: string) => {
    if (!serviceRef.current || !input.trim()) {
      setPredictions([]);
      return;
    }

    serviceRef.current.getPlacePredictions(
      {
        input,
        types: ["address"],
        sessionToken: sessionTokenRef.current!,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(
            results.map((r) => ({
              placeId: r.place_id,
              mainText: r.structured_formatting.main_text,
              secondaryText: r.structured_formatting.secondary_text || "",
            })),
          );
        } else {
          setPredictions([]);
        }
      },
    );
  }, []);

  function handleInputChange(val: string) {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length > 1) {
      setShowDropdown(true);
      debounceRef.current = setTimeout(() => fetchPredictions(val), 250);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  }

  function handleSelect(prediction: Prediction) {
    setShowDropdown(false);
    onChange(`${prediction.mainText}, ${prediction.secondaryText}`);

    // Fetch full place details for address components
    const div = document.createElement("div");
    const placesService = new google.maps.places.PlacesService(div);
    placesService.getDetails(
      {
        placeId: prediction.placeId,
        fields: ["formatted_address", "address_components", "geometry"],
        sessionToken: sessionTokenRef.current!,
      },
      (place, status) => {
        // Reset session token after getDetails (per Google billing best practices)
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();

        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const address = place.formatted_address || `${prediction.mainText}, ${prediction.secondaryText}`;
          onChange(address);

          if (place.address_components) {
            const parsed = parseAddressComponents(place.address_components);
            const location = place.geometry?.location;
            onPlaceSelect({
              address,
              ...parsed,
              latitude: location ? location.lat() : null,
              longitude: location ? location.lng() : null,
            });
          }
        }
      },
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        required={required}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (predictions.length > 0) setShowDropdown(true);
        }}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={loaded ? "Address with autocomplete" : "Address"}
        className={
          className ??
          "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20"
        }
      />
      {showDropdown && predictions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-[10px] border border-humana-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]">
          {predictions.map((p) => (
            <button
              key={p.placeId}
              type="button"
              onClick={() => handleSelect(p)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-humana-stone"
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
                <span className="text-[13px] font-medium text-humana-ink">{p.mainText}</span>
                {p.secondaryText && (
                  <span className="text-[12px] text-humana-subtle">{p.secondaryText}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
