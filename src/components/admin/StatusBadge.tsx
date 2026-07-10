/** Reusable status badge with color-coded variants. */
"use client";

const variants: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const style = variants[status] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${style} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active" || status === "verified"
            ? "bg-emerald-500"
            : status === "pending"
              ? "bg-amber-500 animate-pulse"
              : "bg-red-500"
        }`}
      />
      {label || status}
    </span>
  );
}
