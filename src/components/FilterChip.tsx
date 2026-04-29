"use client";

export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3.5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-150 hover:opacity-90 active:scale-[0.98] ${
        active
          ? "border-humana-ink bg-humana-ink text-white"
          : "border-[#D8D4C8] text-[#4A463E] hover:border-humana-ink"
      }`}
    >
      {label}
    </button>
  );
}
