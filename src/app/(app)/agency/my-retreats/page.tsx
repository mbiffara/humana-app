/** Agency workspace — My Retreats management page.
 *  Lists agency-created retreats with status filters, KPIs, and CRUD actions. */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiRetreat } from "@/lib/api/agency";

type RetreatStatus = "draft" | "pending_review" | "active" | "closed";
type FilterStatus = "all" | RetreatStatus;

const STATUS_COLORS: Record<string, string> = {
  draft: "border-humana-line text-humana-muted",
  pending_review: "border-humana-gold text-humana-gold",
  active: "border-emerald-400 text-emerald-600",
  upcoming: "border-blue-300 text-blue-600",
  closed: "border-humana-ink text-humana-ink",
  cancelled: "border-red-300 text-red-500",
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
  const [submitModal, setSubmitModal] = useState<ApiRetreat | null>(null);
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
  const pendingCount = retreats.filter((r) => r.status === "pending_review").length;

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: tr.filters.all },
    { key: "draft", label: tr.filters.draft },
    { key: "pending_review", label: tr.filters.pending_review },
    { key: "active", label: tr.filters.active },
    { key: "closed", label: tr.filters.closed },
  ];

  const handleDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    try {
      await agencyApi.deleteRetreat(deleteModal.id);
      setRetreats((prev) => prev.filter((r) => r.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!submitModal) return;
    setActionLoading(true);
    try {
      const res = await agencyApi.submitRetreatForReview(submitModal.id);
      setRetreats((prev) =>
        prev.map((r) => (r.id === submitModal.id ? { ...r, status: res.retreat.status } : r))
      );
      setSubmitModal(null);
    } catch {
      // ignore
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
          href="/create-retreat/step-1"
          className="rounded-lg bg-humana-gold px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
        >
          {tr.createRetreat}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-4 gap-5 stagger-children">
        <div className="rounded-xl border border-humana-line bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
            {tr.kpis.total}
          </p>
          <p className="mt-2 text-[30px] font-bold text-humana-ink">{total}</p>
        </div>
        <div className="rounded-xl border border-humana-line bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
            {tr.kpis.active}
          </p>
          <p className="mt-2 text-[30px] font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-humana-line bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
            {tr.kpis.draft}
          </p>
          <p className="mt-2 text-[30px] font-bold text-humana-ink">{draftCount}</p>
        </div>
        <div className="rounded-xl border border-humana-line bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
            {tr.kpis.pending}
          </p>
          <p className="mt-2 text-[30px] font-bold text-humana-gold">{pendingCount}</p>
        </div>
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

      {/* Retreat rows */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : retreats.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{tr.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tr.emptyHint}</p>
          <Link
            href="/create-retreat/step-1"
            className="mt-6 rounded-lg bg-humana-gold px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
          >
            {tr.createRetreat}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 stagger-children">
          {retreats.map((retreat) => (
            <article
              key={retreat.id}
              className="flex items-center rounded-xl border border-humana-line bg-white px-6 py-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
            >
              {/* Cover image */}
              <div className="relative mr-4 h-14 w-20 shrink-0 overflow-hidden rounded bg-humana-stone">
                {retreat.cover_image_url ? (
                  <Image src={retreat.cover_image_url} alt={retreat.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-humana-subtle">
                    No img
                  </div>
                )}
              </div>

              {/* Name + type */}
              <div className="min-w-0 flex-1 pr-3">
                <p className="truncate text-[14px] font-medium text-humana-ink">{retreat.name}</p>
                <p className="mt-0.5 text-[12px] capitalize text-humana-muted">
                  {retreat.retreat_type} · {retreat.duration_nights}n
                </p>
              </div>

              {/* Hotel */}
              <div className="w-[160px] shrink-0 px-3">
                <p className="truncate text-[14px] text-humana-ink">{retreat.hotel?.name ?? "—"}</p>
                <p className="mt-0.5 truncate text-[12px] text-humana-muted">
                  {retreat.hotel?.city ?? ""}
                </p>
              </div>

              {/* Dates */}
              <div className="w-[160px] shrink-0 text-[14px] text-humana-ink">
                {retreat.starts_on && retreat.ends_on
                  ? formatDateRange(retreat.starts_on, retreat.ends_on, tag)
                  : "—"}
              </div>

              {/* Capacity */}
              <div className="w-[70px] shrink-0 text-center text-[14px] text-humana-ink">
                {retreat.capacity > 0 ? retreat.capacity : "—"}
              </div>

              {/* Price */}
              <div className="w-[100px] shrink-0 text-right text-[14px] font-medium text-humana-ink">
                {retreat.min_price_cents > 0
                  ? money(retreat.min_price_cents, retreat.currency, tag)
                  : "—"}
              </div>

              {/* Status Badge */}
              <div className="w-[110px] shrink-0 flex items-center justify-end">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    STATUS_COLORS[retreat.status] ?? STATUS_COLORS.draft
                  }`}
                >
                  {tr.statusLabels[retreat.status as keyof typeof tr.statusLabels] ?? retreat.status}
                </span>
              </div>

              {/* Actions */}
              <div className="ml-4 flex shrink-0 items-center gap-2">
                {retreat.status === "draft" && (
                  <>
                    <button
                      onClick={() => setSubmitModal(retreat)}
                      title={tr.submitTitle}
                      className="rounded border border-humana-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-gold transition-colors hover:bg-humana-gold hover:text-white"
                    >
                      {tr.submitConfirm}
                    </button>
                    <button
                      onClick={() => setDeleteModal(retreat)}
                      title={tr.deleteTitle}
                      className="rounded border border-humana-line px-2.5 py-1.5 text-[10px] text-humana-subtle transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </>
                )}
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
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
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

      {/* Submit for Review Modal */}
      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-humana-line bg-white p-8 shadow-xl animate-fade-in-scale">
            <h3 className="text-[18px] font-bold text-humana-ink">{tr.submitTitle}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-humana-muted">{tr.submitMessage}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSubmitModal(null)}
                className="rounded-lg border border-humana-line px-5 py-2.5 text-[12px] font-semibold text-humana-ink transition-colors hover:border-humana-ink"
              >
                {tr.submitCancel}
              </button>
              <button
                onClick={handleSubmitForReview}
                disabled={actionLoading}
                className="rounded-lg bg-humana-gold px-5 py-2.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {actionLoading ? "…" : tr.submitConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
