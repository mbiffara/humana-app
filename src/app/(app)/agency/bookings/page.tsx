/** Agency workspace — booking history (AG-02).
 *  Reservations list view with KPIs, filters & pagination. */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiBooking } from "@/lib/api/agency";

const LOCALE_TAGS: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-PT" };

type BookingStatus = "inquiry" | "confirmed" | "completed" | "cancelled";
type FilterStatus = "all" | BookingStatus;

const STATUS_COLORS: Record<string, string> = {
  inquiry: "border-humana-gold text-humana-gold",
  confirmed: "border-emerald-400 text-emerald-600",
  completed: "border-humana-ink text-humana-ink",
  cancelled: "border-humana-line text-humana-subtle",
};

function money(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDateRange(start: string, end: string, tag: string): string {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const fmtStart = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" }).format(s);
  const fmtEnd = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" }).format(e);
  return `${fmtStart} – ${fmtEnd}`;
}

interface BookingSummary {
  total: number;
  confirmed: number;
  commission_cents: number;
  volume_cents: number;
}

export default function AgencyBookingsPage() {
  const { t, locale } = useLocale();
  const tb = t.agencyWs.bookings;
  const tag = LOCALE_TAGS[locale] ?? "en-US";

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async (statusFilter: FilterStatus, pg: number) => {
    setLoading(true);
    try {
      const params: { page: number; per_page: number; status?: string } = {
        page: pg,
        per_page: 25,
      };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await agencyApi.listBookings(params);
      setBookings(res.bookings);
      setTotalPages(res.meta?.total_pages ?? 1);
      if (res.summary) {
        setSummary(res.summary);
      } else {
        // Compute summary from bookings if backend doesn't provide it
        const total = res.meta?.total ?? res.bookings.length;
        const confirmed = res.bookings.filter((b) => b.status === "confirmed").length;
        const commission_cents = res.bookings.reduce((acc, b) => acc + (b.commission_cents ?? 0), 0);
        const volume_cents = res.bookings.reduce((acc, b) => acc + (b.amount_cents ?? 0), 0);
        setSummary({ total, confirmed, commission_cents, volume_cents });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    fetchBookings(filter, page);
  }, [fetchBookings, filter, page]);

  /* ─── Filter counts (computed from current bookings set) ─── */
  const statusCounts: Record<FilterStatus, number> = {
    all: summary?.total ?? bookings.length,
    inquiry: bookings.filter((b) => b.status === "inquiry").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: tb.filters.all },
    { key: "inquiry", label: tb.filters.inquiry },
    { key: "confirmed", label: tb.filters.confirmed },
    { key: "completed", label: tb.filters.completed },
    { key: "cancelled", label: tb.filters.cancelled },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between animate-fade-in-up">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {tb.eyebrow}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">
            {tb.title}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">{tb.subtitle}</p>
        </div>
        <button className="rounded-lg bg-humana-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85">
          {tb.exportBtn}
        </button>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="mb-6 grid grid-cols-4 gap-5 stagger-children">
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tb.kpis.total}
            </p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tb.kpis.confirmed}
            </p>
            <p className="mt-2 text-[30px] font-bold text-humana-gold">{summary.confirmed}</p>
          </div>
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tb.kpis.commission}
            </p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">
              {money(summary.commission_cents, "USD", tag)}
            </p>
          </div>
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {tb.kpis.volume}
            </p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">
              {money(summary.volume_cents, "USD", tag)}
            </p>
          </div>
        </div>
      )}

      {/* Status Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = statusCounts[f.key];
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
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Booking rows */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{tb.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tb.emptyHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 stagger-children">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            return (
              <article
                key={booking.id}
                className={`flex items-center rounded-xl border border-humana-line bg-white px-6 py-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md ${
                  isCancelled ? "opacity-50" : ""
                }`}
              >
                {/* Reference */}
                <div className="w-[120px] shrink-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">
                    {tb.columns.reference}
                  </p>
                  <p className="mt-0.5 text-[14px] font-medium text-humana-ink">
                    {booking.reference}
                  </p>
                </div>

                {/* Client */}
                <div className="min-w-0 flex-1 px-3">
                  <p className="truncate text-[14px] font-medium text-humana-ink">
                    {booking.client?.name ?? "—"}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-humana-muted">
                    {booking.client?.email ?? "—"}
                  </p>
                </div>

                {/* Experience */}
                <div className="w-[180px] shrink-0 px-3">
                  <p className="truncate text-[14px] text-humana-ink">
                    {booking.experience?.title ?? "—"}
                  </p>
                </div>

                {/* Dates */}
                <div className="w-[140px] shrink-0 text-[14px] text-humana-ink">
                  {booking.starts_on && booking.ends_on
                    ? formatDateRange(booking.starts_on, booking.ends_on, tag)
                    : "—"}
                </div>

                {/* Amount */}
                <div className="w-[90px] shrink-0 text-right text-[14px] font-medium text-humana-ink">
                  {money(booking.amount_cents, booking.currency, tag)}
                </div>

                {/* Commission */}
                <div className="w-[100px] shrink-0 text-right text-[14px] font-medium text-humana-gold">
                  {money(booking.commission_cents, booking.currency, tag)}
                </div>

                {/* Status Badge */}
                <div className="w-[110px] shrink-0 flex items-center justify-end">
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      STATUS_COLORS[booking.status] ?? STATUS_COLORS.inquiry
                    }`}
                  >
                    {tb.statusLabels[booking.status as BookingStatus] ?? booking.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && bookings.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-humana-line px-4 py-2 text-[13px] font-semibold text-humana-ink transition-colors hover:border-humana-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            &larr; Prev
          </button>
          <span className="text-[13px] text-humana-muted">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-humana-line px-4 py-2 text-[13px] font-semibold text-humana-ink transition-colors hover:border-humana-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
