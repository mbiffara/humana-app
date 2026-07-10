"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import PlacesAutocomplete, { type PlaceResult } from "@/components/PlacesAutocomplete";

/* ─── Reusable white input class ─── */
const INPUT =
  "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20";

/* ─── Star Rating Picker (compact) ─── */
function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label?: string }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="inline-flex items-center gap-3 rounded-[6px] border border-humana-line bg-white px-4 py-2.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= display;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star === value ? 0 : star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="cursor-pointer p-0.5 transition-transform duration-150 hover:scale-110 active:scale-90"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={active ? "#d4af37" : "none"}
                stroke={active ? "#d4af37" : "#d1cdc4"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200"
                style={{
                  filter: active ? "drop-shadow(0 1px 3px rgba(212, 175, 55, 0.3))" : "none",
                }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          );
        })}
      </div>
      {value > 0 && (
        <span className="text-[13px] font-semibold text-humana-gold">{label}</span>
      )}
    </div>
  );
}

/* ─── Smart Time Picker ─── */

// Generate all preset times (every 30 min) in 12h format
const PRESET_TIMES: { label: string; value: string }[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h < 12 ? "AM" : "PM";
    const label = `${h12}:${String(m).padStart(2, "0")} ${period}`;
    const val = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    PRESET_TIMES.push({ label, value: val });
  }
}

/** Parse flexible time input → "HH:mm" (24h) or null */
function parseTimeInput(raw: string): string | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!s) return null;

  // "16 hrs", "16hrs", "16h"
  let match = s.match(/^(\d{1,2})\s*(?:hrs?|h)$/);
  if (match) {
    const h = parseInt(match[1], 10);
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, "0")}:00`;
    return null;
  }

  // "16:30", "8:00" (no am/pm → 24h)
  match = s.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59)
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return null;
  }

  // "11am", "11 am", "4pm", "4 pm", "11:30am", "11:30 am", "4:15pm"
  match = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2] ? parseInt(match[2], 10) : 0;
    const isPm = match[3] === "pm";
    if (h < 1 || h > 12 || m < 0 || m > 59) return null;
    if (isPm && h !== 12) h += 12;
    if (!isPm && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Just a number: "15" → 15:00, "3" → 03:00
  match = s.match(/^(\d{1,2})$/);
  if (match) {
    const h = parseInt(match[1], 10);
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, "0")}:00`;
    return null;
  }

  return null;
}

/** Format "HH:mm" → "3:00 PM" */
function formatTime12(val: string): string {
  const [h24, m] = val.split(":").map(Number);
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  const period = h24 < 12 ? "AM" : "PM";
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const displayText = formatTime12(value);

  // Filter presets based on what user is typing
  const filtered = editing && inputText
    ? PRESET_TIMES.filter((t) => {
        const q = inputText.toLowerCase().replace(/\s/g, "");
        const l = t.label.toLowerCase().replace(/\s/g, "");
        return l.includes(q) || t.value.includes(q);
      })
    : PRESET_TIMES;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        commitInput();
        setOpen(false);
        setEditing(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  });

  // Scroll active item into view when dropdown opens
  useEffect(() => {
    if (open && listRef.current) {
      const active = listRef.current.querySelector("[data-active]");
      if (active) active.scrollIntoView({ block: "center" });
    }
  }, [open]);

  function commitInput() {
    if (!inputText) return;
    const parsed = parseTimeInput(inputText);
    if (parsed) onChange(parsed);
    setInputText("");
  }

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
    setEditing(false);
    setInputText("");
    inputRef.current?.blur();
  }

  function handleFocus() {
    setOpen(true);
    setEditing(true);
    setInputText("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputText) {
        commitInput();
        setOpen(false);
        setEditing(false);
      } else if (filtered.length > 0) {
        handleSelect(filtered[0].value);
      }
    }
    if (e.key === "Escape") {
      setOpen(false);
      setEditing(false);
      setInputText("");
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={editing ? inputText : displayText}
          placeholder={displayText}
          onChange={(e) => { setInputText(e.target.value); setOpen(true); }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={INPUT}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setOpen(!open); if (!open) inputRef.current?.focus(); }}
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-humana-subtle hover:text-humana-ink transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>

      {/* Dropdown list — opens upward */}
      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 bottom-full z-50 mb-1 max-h-[220px] overflow-y-auto rounded-[8px] border border-humana-line bg-white py-1 shadow-lg animate-fade-in-up"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-[13px] text-humana-subtle text-center">
              {inputText ? `"${inputText}" — Enter ↵` : "—"}
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.value}
                type="button"
                data-active={t.value === value ? "" : undefined}
                onClick={() => handleSelect(t.value)}
                className={`cursor-pointer w-full px-4 py-2 text-left text-[14px] transition-colors ${
                  t.value === value
                    ? "bg-humana-gold/10 text-humana-gold font-medium"
                    : "text-humana-ink hover:bg-humana-stone"
                }`}
              >
                {t.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function HotelWizardStep1() {
  const { state, set } = useHotelWizard();
  const { t } = useLocale();
  const { user } = useAuth();
  const h = t.onboarding.hotel;

  const handlePlaceSelect = useCallback(
    (place: PlaceResult) => {
      set({
        address: place.address,
        city: place.city,
        country: place.country,
        countryCode: place.country_code,
      });
    },
    [set],
  );

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[700px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step1Eyebrow}
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.step1Title}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.step1Subtitle}
        </p>

        {/* ─── Personal Data Section ─── */}
        <div className="mt-10">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {h.personalSection}
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.firstName}
              </label>
              <input
                type="text"
                value={state.ownerFirstName}
                onChange={(e) => set({ ownerFirstName: e.target.value })}
                placeholder="John"
                className={INPUT}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.lastName}
              </label>
              <input
                type="text"
                value={state.ownerLastName}
                onChange={(e) => set({ ownerLastName: e.target.value })}
                placeholder="Smith"
                className={INPUT}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.ownerPhone}
              </label>
              <input
                type="tel"
                value={state.ownerPhone}
                onChange={(e) => set({ ownerPhone: e.target.value })}
                placeholder="+1 555 123 4567"
                className={INPUT}
              />
            </div>

            {/* Personal Email (editable) */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.contactEmailLabel}
              </label>
              <input
                type="email"
                value={state.contactEmail}
                onChange={(e) => set({ contactEmail: e.target.value })}
                placeholder="john@email.com"
                className={INPUT}
              />
            </div>
          </div>
        </div>

        {/* ─── Divider ─── */}
        <div className="mt-10 mb-8 border-t border-humana-line" />

        {/* ─── Property Details ─── */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {h.propertySection}
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Hotel Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="hotel-name"
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted"
              >
                {h.hotelName}
              </label>
              <input
                id="hotel-name"
                type="text"
                value={state.hotelName}
                onChange={(e) => set({ hotelName: e.target.value })}
                placeholder={h.hotelNamePlaceholder}
                className={INPUT}
              />
              <span className="text-[12px] text-humana-subtle">
                {h.hotelNameHint}
              </span>
            </div>

            {/* Physical Address — PlacesAutocomplete */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.addressLabel}
              </label>
              <PlacesAutocomplete
                value={state.address}
                onChange={(val) => set({ address: val })}
                onPlaceSelect={handlePlaceSelect}
                placeholder={h.addressPlaceholder}
              />
            </div>

            {/* Description — full width */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.descriptionLabel}
              </label>
              <textarea
                value={state.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder={h.descriptionPlaceholder}
                rows={3}
                className={`${INPUT} resize-none`}
              />
            </div>

            {/* Star Rating */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.starsLabel}
              </label>
              <StarRating
                value={state.stars}
                onChange={(v) => set({ stars: v })}
                label={state.stars > 0 ? h.starLabel(state.stars) : undefined}
              />
            </div>

            {/* Hotel Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.hotelPhoneLabel}
              </label>
              <input
                type="tel"
                value={state.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="+34 912 345 678"
                className={INPUT}
              />
            </div>

            {/* Hotel Contact Email (readonly — from registration) */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                Email
              </label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className={`${INPUT} bg-humana-stone/50 text-humana-muted cursor-default`}
              />
            </div>

            {/* Check-in */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.checkInLabel}
              </label>
              <TimePicker
                value={state.checkInTime}
                onChange={(v) => set({ checkInTime: v })}
              />
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                {h.checkOutLabel}
              </label>
              <TimePicker
                value={state.checkOutTime}
                onChange={(v) => set({ checkOutTime: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
