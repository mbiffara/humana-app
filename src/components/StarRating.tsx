"use client";

import { useState } from "react";

export function StarRating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
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
                  filter: active
                    ? "drop-shadow(0 1px 3px rgba(212, 175, 55, 0.3))"
                    : "none",
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
