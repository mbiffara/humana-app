/** Reusable pagination component with page numbers and navigation. */
"use client";

import type { PaginationMeta } from "@/lib/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, per_page, total, total_pages } = meta;
  const from = (page - 1) * per_page + 1;
  const to = Math.min(page * per_page, total);

  if (total_pages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= total_pages; i++) {
    if (i === 1 || i === total_pages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-humana-line px-1 pt-4">
      <span className="text-[12px] text-humana-muted">
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-[12px] text-humana-muted">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] transition-all duration-200 ${
                p === page
                  ? "bg-humana-ink text-white font-medium"
                  : "text-humana-muted hover:bg-humana-stone"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
