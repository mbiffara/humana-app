"use client";

import { useState, useRef, useEffect } from "react";

const INPUT =
  "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20";

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

/** Parse flexible time input -> "HH:mm" (24h) or null */
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

  // "16:30", "8:00" (no am/pm -> 24h)
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

  // Just a number: "15" -> 15:00, "3" -> 03:00
  match = s.match(/^(\d{1,2})$/);
  if (match) {
    const h = parseInt(match[1], 10);
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, "0")}:00`;
    return null;
  }

  return null;
}

/** Format "HH:mm" -> "3:00 PM" */
function formatTime12(val: string): string {
  const [h24, m] = val.split(":").map(Number);
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  const period = h24 < 12 ? "AM" : "PM";
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const displayText = formatTime12(value);

  // Filter presets based on what user is typing
  const filtered =
    editing && inputText
      ? PRESET_TIMES.filter((t) => {
          const q = inputText.toLowerCase().replace(/\s/g, "");
          const l = t.label.toLowerCase().replace(/\s/g, "");
          return l.includes(q) || t.value.includes(q);
        })
      : PRESET_TIMES;

  function commitInput() {
    if (!inputText) return;
    const parsed = parseTimeInput(inputText);
    if (parsed) onChange(parsed);
    setInputText("");
  }

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
          onChange={(e) => {
            setInputText(e.target.value);
            setOpen(true);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={INPUT}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setOpen(!open);
            if (!open) inputRef.current?.focus();
          }}
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-humana-subtle hover:text-humana-ink transition-colors"
        >
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
