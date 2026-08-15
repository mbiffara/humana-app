/** Agency workspace — My Retreats management page.
 *  Lists agency-created retreats with status filters, KPIs, and CRUD actions. */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiRetreat } from "@/lib/api/agency";

type RetreatStatus = "draft" | "active" | "closed";
type FilterStatus = "all" | RetreatStatus;

const STATUS_COLORS: Record<string, string> = {
  draft: "border-humana-line text-humana-muted",
  active: "border-emerald-500 text-emerald-600",
  upcoming: "border-humana-gold text-humana-gold",
  closed: "border-humana-line text-humana-subtle",
  cancelled: "border-red-300 text-red-500",
};

const DOT_COLORS: Record<string, string> = {
  draft: "bg-humana-muted",
  active: "bg-emerald-500",
  upcoming: "bg-humana-gold",
  closed: "bg-humana-subtle",
  cancelled: "bg-red-400",
};

const LOCALE_TAGS: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-PT" };

function formatDateRange(start: string, end: string, tag: string): string {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const fmtStart = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" }).format(s);
  const fmtEnd = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", year: "numeric" }).format(e);
  return `${fmtStart} – ${fmtEnd}`;
}

function money(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default function AgencyMyRetreatsPage() {
  const { t, locale } = useLocale();
  const tr = t.agencyWs.myRetreats;
  const tag = LOCALE_TAGS[locale] ?? "en-US";

  const [retreats, setRetreats] = useState<ApiRetreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [deleteModal, setDeleteModal] = useState<ApiRetreat | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRetreats = useCallback(async (statusFilter: FilterStatus) => {
    setLoading(true);
    try {
      const params: { status?: string } = {};
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await agencyApi.listRetreats(params);
      setRetreats(res.retreats);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetreats(filter);
  }, [fetchRetreats, filter]);

  /* ─── KPI counts ─── */
  const total = retreats.length;
  const activeCount = retreats.filter((r) => r.status === "active" || r.status === "upcoming").length;
  const draftCount = retreats.filter((r) => r.status === "draft").length;
  const totalSales = retreats.reduce((sum, r) => sum + (r.bookings_count ?? 0), 0);

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: tr.filters.all },
    { key: "draft", label: tr.filters.draft },
    { key: "active", label: tr.filters.active },
    { key: "closed", label: tr.filters.closed },
  ];

  const handleDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    setDeleteError(null);
    try {
      await agencyApi.deleteRetreat(deleteModal.id);
      setRetreats((prev) => prev.filter((r) => r.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      setDeleteError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between animate-fade-in-up">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {tr.eyebrow}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">{tr.title}</h1>
          <p className="mt-1 text-[14px] text-humana-muted">{tr.subtitle}</p>
        </div>
        <Link
          href="/agency/retreats/create/step-1"
          className="rounded-lg bg-humana-gold px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
        >
          {tr.createRetreat}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-4 gap-5 stagger-children">
        {[
          { label: tr.kpis.total, value: total, color: "text-humana-ink", tooltip: tr.kpiTooltips.total },
          { label: tr.kpis.active, value: activeCount, color: "text-emerald-600", tooltip: tr.kpiTooltips.active },
          { label: tr.kpis.draft, value: draftCount, color: "text-humana-ink", tooltip: tr.kpiTooltips.draft },
          { label: tr.kpis.sales, value: totalSales, color: "text-humana-gold", tooltip: tr.kpiTooltips.sales },
        ].map((kpi) => (
          <div key={kpi.label} className="group relative cursor-pointer rounded-xl border border-humana-line bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                {kpi.label}
              </p>
              <svg className="h-3.5 w-3.5 text-humana-line group-hover:text-humana-subtle transition-colors" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11ZM8 5a.75.75 0 1 1 0-1.5A.75.75 0 0 1 8 5Zm-.75 1.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Z" />
              </svg>
            </div>
            <p className={`mt-2 text-[30px] font-bold ${kpi.color}`}>{kpi.value}</p>
            <span className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-humana-ink px-3 py-2 text-[11px] font-normal normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {kpi.tooltip}
              <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-humana-ink" />
            </span>
          </div>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
                isActive
                  ? "bg-humana-ink text-white"
                  : "border border-humana-line text-humana-muted hover:border-humana-ink hover:text-humana-ink"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Retreat cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : retreats.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{tr.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tr.emptyHint}</p>
          <Link
            href="/agency/retreats/create/step-1"
            className="mt-6 bg-humana-gold px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
          >
            {tr.createRetreat}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 stagger-children">
          {retreats.map((retreat) => (
            <article
              key={retreat.id}
              className="flex overflow-hidden rounded-xl border border-humana-line bg-white transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative w-[220px] shrink-0 bg-humana-stone">
                {retreat.cover_image_url ? (
                  <Image src={retreat.cover_image_url} alt={retreat.name} fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9c4b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between px-7 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[18px] font-semibold text-humana-ink">{retreat.name}</h2>
                    <p className="mt-0.5 text-[13px] text-humana-muted">
                      {retreat.hotel?.name ?? "—"}
                      {retreat.location ? ` · ${retreat.location}` : ""}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      STATUS_COLORS[retreat.status] ?? STATUS_COLORS.draft
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[retreat.status] ?? DOT_COLORS.draft}`} />
                    {tr.statusLabels[retreat.status as keyof typeof tr.statusLabels] ?? retreat.status}
                  </span>
                </div>

                {/* Stats row */}
                <div className="mt-5 flex gap-12">
                  {[
                    { label: tr.columns.dates, value: retreat.starts_on && retreat.ends_on ? formatDateRange(retreat.starts_on, retreat.ends_on, tag) : "—" },
                    { label: tr.columns.capacity, value: retreat.capacity > 0 ? String(retreat.capacity) : "—" },
                    { label: tr.columns.price, value: retreat.min_price_cents > 0 ? money(retreat.min_price_cents, retreat.currency, tag) : "—" },
                    { label: tr.columns.sales, value: String(retreat.bookings_count ?? 0), gold: true },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                        {stat.label}
                      </p>
                      <p className={`mt-1 text-[14px] font-medium ${"gold" in stat && stat.gold ? "text-humana-gold" : "text-humana-ink"}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action links */}
                <div className="mt-5 flex items-center gap-4 border-t border-humana-line pt-4">
                  {/* Preview */}
                  {retreat.slug && retreat.country_code && (
                    <Link
                      href={`/select-country/${retreat.country_code.toLowerCase()}/retreats/${retreat.slug}`}
                      className="flex items-center gap-1.5 text-[13px] text-humana-subtle transition-colors hover:text-humana-ink"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {tr.preview}
                    </Link>
                  )}
                  {retreat.slug && retreat.country_code && (
                    <span className="text-humana-line">·</span>
                  )}
                  {/* Edit */}
                  <Link
                    href={`/agency/retreats/create/step-1?id=${retreat.id}`}
                    className="flex items-center gap-1.5 text-[13px] text-humana-subtle transition-colors hover:text-humana-ink"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    {t.agencyWs.retreats.wizard.review.edit}
                  </Link>
                  <span className="text-humana-line">·</span>
                  {/* Delete */}
                  <button
                    onClick={() => setDeleteModal(retreat)}
                    className="flex cursor-pointer items-center gap-1.5 text-[13px] text-humana-subtle transition-colors hover:text-red-500"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    {tr.deleteConfirm}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-humana-line bg-white p-8 shadow-xl animate-fade-in-scale">
            <h3 className="text-[18px] font-bold text-humana-ink">{tr.deleteTitle}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-humana-muted">{tr.deleteMessage}</p>
            {deleteError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-600">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setDeleteModal(null); setDeleteError(null); }}
                className="rounded-lg border border-humana-line px-5 py-2.5 text-[12px] font-semibold text-humana-ink transition-colors hover:border-humana-ink"
              >
                {tr.deleteCancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {actionLoading ? "…" : tr.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
