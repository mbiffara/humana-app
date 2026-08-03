/** Hotel workspace — booking management (HT-06).
 *  Reservations list view with KPIs + filters. */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  hotelApi,
  type HotelBooking,
  type BookingSummary,
  type BookingStatus,
} from "@/lib/api/hotel";

const LOCALE_TAGS: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-PT" };

type FilterStatus = "all" | BookingStatus;

const STATUS_COLORS: Record<BookingStatus, string> = {
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

export default function HotelBookingsPage() {
  const { t, locale } = useLocale();
  const tb = t.hotelWs.bookings;
  const tag = LOCALE_TAGS[locale] ?? "en-US";

  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchBookings = useCallback(async (statusFilter?: FilterStatus, q?: string) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      if (q) params.q = q;
      const res = await hotelApi.listBookings(params);
      setBookings(res.bookings);
      setSummary(res.summary);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(filter, search);
  }, [fetchBookings, filter, search]);

  function handleSearch(value: string) {
    setSearch(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchBookings(filter, value);
    }, 300);
  }

  async function handleConfirm(id: number) {
    try {
      await hotelApi.confirmBooking(id);
      fetchBookings(filter, search);
    } catch {
      // ignore
    }
  }

  async function handleCancel(id: number) {
    try {
      await hotelApi.cancelBooking(id);
      fetchBookings(filter, search);
    } catch {
      // ignore
    }
  }

  const filterCounts = summary
    ? {
        all: summary.total,
        inquiry: summary.inquiry,
        confirmed: summary.confirmed,
        completed: summary.completed,
        cancelled: summary.cancelled,
      }
    : null;

  const filters: { key: FilterStatus; label: string; countKey: string }[] = [
    { key: "all", label: tb.filters.all, countKey: "all" },
    { key: "confirmed", label: tb.filters.confirmed, countKey: "confirmed" },
    { key: "inquiry", label: tb.filters.pending, countKey: "inquiry" },
    { key: "completed", label: tb.filters.checkedIn, countKey: "completed" },
    { key: "cancelled", label: tb.filters.cancelled, countKey: "cancelled" },
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-humana-subtle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={tb.searchPlaceholder}
              className="w-[220px] rounded-lg border border-humana-line bg-white py-2.5 pl-9 pr-4 text-[13px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>
          <button className="rounded-lg bg-humana-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85">
            {tb.exportBtn}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="mb-6 grid grid-cols-4 gap-5 stagger-children">
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{tb.kpis.total}</p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{tb.kpis.pending}</p>
            <p className="mt-2 text-[30px] font-bold text-humana-gold">{summary.inquiry}</p>
          </div>
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{tb.kpis.revenue}</p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">
              {money(summary.revenue_cents, "USD", locale)}
            </p>
          </div>
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{tb.kpis.occupancy}</p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">{summary.occupancy_rate}%</p>
          </div>
        </div>
      )}

      {/* Status Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = filterCounts ? (filterCounts as Record<string, number>)[f.countKey] ?? 0 : 0;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
                isActive
                  ? "bg-humana-ink text-white"
                  : f.key === "inquiry"
                    ? "border border-humana-gold text-humana-gold hover:bg-humana-gold-light"
                    : "border border-humana-line text-humana-muted hover:border-humana-ink hover:text-humana-ink"
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Booking cards */}
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
        <div className="flex flex-col gap-3">
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

                {/* Guest + Agency */}
                <div className="min-w-0 flex-1 px-3">
                  <p className="truncate text-[14px] font-medium text-humana-ink">
                    {booking.client?.name ?? "—"}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-humana-muted">
                    {[booking.agency?.name, booking.agency?.country].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>

                {/* Retreat / Room */}
                <div className="w-[180px] shrink-0 px-3">
                  <p className="truncate text-[14px] text-humana-ink">
                    {booking.experience?.title ?? "—"}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-humana-muted">
                    {booking.room_type?.name ?? "—"}
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
                  {money(booking.amount_cents, booking.currency, locale)}
                </div>

                {/* Status + Actions */}
                <div className="w-[140px] shrink-0 flex items-center justify-end gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      STATUS_COLORS[booking.status]
                    }`}
                  >
                    {tb.statusLabels[booking.status]}
                  </span>
                  {booking.status === "inquiry" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleConfirm(booking.id)}
                        title={tb.confirmAction}
                        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300 text-emerald-500 transition-colors hover:bg-emerald-50"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        title={tb.cancelAction}
                        className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border border-red-300 text-red-400 transition-colors hover:bg-red-50"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
