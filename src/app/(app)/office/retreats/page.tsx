"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { officeApi } from "@/lib/api/office";
import { Pagination } from "@/components/admin/Pagination";
import type { OfficeRetreatSummary, PaginationMeta } from "@/lib/types";

export default function OfficeRetreatsPage() {
  const { t } = useLocale();
  const [retreats, setRetreats] = useState<OfficeRetreatSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchRetreats = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await officeApi.listRetreats(params);
      setRetreats(res.retreats);
      setMeta(res.meta);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchRetreats();
  }, [fetchRetreats]);

  const filters = [
    { label: t.officeWs.retreats.filters.all, value: "" },
    { label: t.officeWs.retreats.filters.active, value: "active" },
    { label: t.officeWs.retreats.filters.draft, value: "draft" },
    { label: t.officeWs.retreats.filters.closed, value: "closed" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-12 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {t.officeWs.retreats.eyebrow}
        </span>
        <h1 className="mt-2 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
          {t.officeWs.retreats.title}
        </h1>
        <p className="mt-1 text-[15px] text-humana-muted">
          {t.officeWs.retreats.subtitle}
        </p>
      </div>

      {/* Filter pills */}
      <div className="mb-6 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatusFilter(f.value); setPage(1); }}
            className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
              statusFilter === f.value
                ? "bg-humana-ink text-white"
                : "border border-humana-line text-humana-muted hover:border-humana-ink hover:text-humana-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : retreats.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-humana-subtle">{t.officeWs.retreats.empty}</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-[6px] border border-humana-line bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-humana-line">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.retreats.columns.name}</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.retreats.columns.hotel}</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.retreats.columns.type}</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.retreats.columns.dates}</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.retreats.columns.capacity}</th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted" />
                </tr>
              </thead>
              <tbody>
                {retreats.map((r, i) => {
                  const countryCode = r.hotel?.country_code?.toLowerCase();
                  const previewHref = countryCode && r.slug
                    ? `/select-country/${countryCode}/retreats/${r.slug}`
                    : null;
                  return (
                  <tr
                    key={r.id}
                    className="border-b border-humana-line/50 transition-colors hover:bg-humana-stone/30 animate-[fade-in-up_0.3s_ease-out_both]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-5 py-4 text-[14px] font-medium text-humana-ink">{r.name}</td>
                    <td className="px-5 py-4 text-[14px] text-humana-muted">{r.hotel?.name || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-humana-line px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-humana-subtle">
                        {r.retreat_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-humana-muted">
                      {r.starts_on && r.ends_on
                        ? `${new Date(r.starts_on).toLocaleDateString()} — ${new Date(r.ends_on).toLocaleDateString()}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-[14px] text-humana-ink">{r.capacity}</td>
                    <td className="px-5 py-4 text-center">
                      {previewHref ? (
                        <Link
                          href={previewHref}
                          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t.officeWs.retreats.preview}
                        </Link>
                      ) : (
                        <span className="text-[12px] text-humana-subtle">—</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {meta && meta.total_pages > 1 && (
            <div className="mt-6">
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
