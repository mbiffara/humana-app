"use client";

/**
 * Textarea with a hard character cap and a live counter, used for the copy the
 * property writes about itself. The counter turns red once the cap is reached
 * so the owner sees why typing stopped.
 */

import { INPUT_CLASS, type PropertyFormVariant } from "@/components/hotel/PropertyFormBlocks";

export type CharCountTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  hint?: string;
  placeholder?: string;
  id?: string;
  rows?: number;
  variant?: PropertyFormVariant;
};

const LABEL_CLASS: Record<PropertyFormVariant, string> = {
  wizard: "text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted",
  settings: "text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle",
};

export function CharCountTextarea({
  label,
  value,
  onChange,
  max,
  hint,
  placeholder,
  id,
  rows = 4,
  variant = "wizard",
}: CharCountTextareaProps) {
  const atLimit = value.length >= max;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL_CLASS[variant]}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={max}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        className={`${INPUT_CLASS[variant]} resize-y leading-relaxed`}
      />
      <div className="flex items-start justify-between gap-4">
        {hint ? <span className="text-[12px] text-humana-subtle">{hint}</span> : <span />}
        <span
          className={`shrink-0 text-[12px] tabular-nums ${
            atLimit ? "text-red-600" : "text-humana-subtle"
          }`}
        >
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}
