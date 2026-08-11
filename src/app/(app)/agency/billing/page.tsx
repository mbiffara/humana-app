"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type BillingSale, type BillingSummary, type ApiBooking } from "@/lib/api/agency";
import type { PaginationMeta } from "@/lib/types";

type Tab = "commissions" | "retreatSales";

export default function AgencyBillingPage() {
  const { t, locale } = useLocale();
  const tb = t.agencyWs.billing;
  const localeTag = locale === "es" ? "es-ES" : locale === "pt" ? "pt-PT" : "en-US";

  const [activeTab, setActiveTab] = useState<Tab>("commissions");

  // Commissions (own bookings) state
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [bookingsMeta, setBookingsMeta] = useState<PaginationMeta | null>(null);
  const [bookingsSummary, setBookingsSummary] = useState<{ commission_cents: number; volume_cents: number }>({ commission_cents: 0, volume_cents: 0 });
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Retreat sales state
  const [sales, setSales] = useState<BillingSale[]>([]);
  const [salesSummary, setSalesSummary] = useState<BillingSummary>({ total_count: 0, total_revenue_cents: 0, total_commission_cents: 0 });
  const [salesMeta, setSalesMeta] = useState<PaginationMeta | null>(null);
  const [salesPage, setSalesPage] = useState(1);
  const [salesLoading, setSalesLoading] = useState(true);

  const fmt = (cents: number) =>
    new Intl.NumberFormat(localeTag, { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);

  const fetchBookings = useCallback(async (p: number) => {
    setBookingsLoading(true);
    try {
      const res = await agencyApi.listBookings({ page: p, per_page: 25 });
      setBookings(res.bookings);
      setBookingsMeta(res.meta);
      if (res.summary) {
        setBookingsSummary({ commission_cents: res.summary.commission_cents, volume_cents: res.summary.volume_cents });
      }
    } catch {
      // ignore
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  const fetchSales = useCallback(async (p: number) => {
    setSalesLoading(true);
    try {
      const res = await agencyApi.getBilling({ page: p, per_page: 25 });
      setSales(res.sales);
      setSalesSummary(res.summary);
      setSalesMeta(res.meta);
    } catch {
      // ignore
    } finally {
      setSalesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(bookingsPage);
  }, [fetchBookings, bookingsPage]);

  useEffect(() => {
    fetchSales(salesPage);
  }, [fetchSales, salesPage]);

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(localeTag, { day: "numeric", month: "short", year: "numeric" }).format(d);
  }

  function formatShort(iso: string): string {
    const d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat(localeTag, { day: "numeric", month: "short" }).format(d);
  }

  const totalCommission = bookingsSummary.commission_cents + salesSummary.total_commission_cents;
  const totalVolume = bookingsSummary.volume_cents + salesSummary.total_revenue_cents;

  const kpis = [
    { label: tb.kpis.totalCommission, value: fmt(totalCommission), gold: true },
    { label: tb.kpis.commissionFromBookings, value: fmt(bookingsSummary.commission_cents) },
    { label: tb.kpis.retreatSalesRevenue, value: fmt(salesSummary.total_revenue_cents) },
    { label: tb.kpis.totalVolume, value: fmt(totalVolume) },
  ];

  const statusColors: Record<string, string> = {
    inquiry: "border-amber-300 bg-amber-50 text-amber-700",
    confirmed: "border-emerald-300 bg-emerald-50 text-emerald-700",
    completed: "border-blue-300 bg-blue-50 text-blue-700",
    cancelled: "border-red-300 bg-red-50 text-red-700",
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-10 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tb.eyebrow}
        </p>
        <h1 className="mt-2 text-[32px] font-bold text-humana-ink">{tb.title}</h1>
        <p className="mt-1 text-[14px] text-humana-muted">{tb.subtitle}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5 stagger-children">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{kpi.label}</p>
            <p className={`mt-1.5 text-[30px] font-bold ${kpi.gold ? "text-humana-gold" : "text-humana-ink"}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-humana-line">
        {(["commissions", "retreatSales"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              activeTab === tab
                ? "border-b-2 border-humana-gold text-humana-gold"
                : "text-humana-subtle hover:text-humana-ink"
            }`}
          >
            {tb.tabs[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "commissions" ? (
        <CommissionsTab
          bookings={bookings}
          meta={bookingsMeta}
          loading={bookingsLoading}
          page={bookingsPage}
          setPage={setBookingsPage}
          tb={tb}
          fmt={fmt}
          formatDate={formatDate}
          formatShort={formatShort}
        />
      ) : (
        <RetreatSalesTab
          sales={sales}
          meta={salesMeta}
          loading={salesLoading}
          page={salesPage}
          setPage={setSalesPage}
          tb={tb}
          fmt={fmt}
          formatDate={formatDate}
          formatShort={formatShort}
          statusColors={statusColors}
        />
      )}
    </div>
  );
}

/* --- Commissions Tab (own bookings) --- */

function CommissionsTab({
  bookings,
  meta,
  loading,
  page,
  setPage,
  tb,
  fmt,
  formatDate,
  formatShort,
}: {
  bookings: ApiBooking[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  setPage: (p: number | ((p: number) => number)) => void;
  tb: {
    columns: { reference: string; client: string; type: string; hotel: string; guests: string; dates: string; amount: string; commission: string; status: string; created: string };
    bookingType: { retreat: string; lodging: string };
    commissionsEmpty: string;
    commissionsEmptyHint: string;
  };
  fmt: (cents: number) => string;
  formatDate: (iso: string) => string;
  formatShort: (iso: string) => string;
}) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
        <p className="text-[18px] font-medium text-humana-ink">{tb.commissionsEmpty}</p>
        <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tb.commissionsEmptyHint}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-humana-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-humana-line bg-[#fafaf7]">
              <Th>{tb.columns.reference}</Th>
              <Th>{tb.columns.client}</Th>
              <Th>{tb.columns.type}</Th>
              <Th>{tb.columns.hotel}</Th>
              <Th>{tb.columns.guests}</Th>
              <Th>{tb.columns.dates}</Th>
              <Th align="right">{tb.columns.amount}</Th>
              <Th align="right">{tb.columns.commission}</Th>
              <Th>{tb.columns.created}</Th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, idx) => {
              const isRetreat = !!booking.experience;
              return (
                <tr
                  key={booking.id}
                  className={`border-b border-humana-line/60 transition-colors hover:bg-humana-stone/40 ${idx % 2 === 1 ? "bg-[#fdfdfb]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold tracking-wide text-humana-ink">{booking.reference}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-humana-ink">{booking.client?.name ?? "\u2014"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${isRetreat ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-teal-200 bg-teal-50 text-teal-600"}`}>
                      {isRetreat ? tb.bookingType.retreat : tb.bookingType.lodging}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-humana-ink">{booking.hotel?.name ?? booking.experience?.hotel?.name ?? "\u2014"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-humana-ink">{booking.guests}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap text-[13px] text-humana-ink">
                      {formatShort(booking.starts_on)} &ndash; {formatShort(booking.ends_on)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="whitespace-nowrap text-[13px] font-semibold text-humana-ink">{fmt(booking.amount_cents)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="whitespace-nowrap text-[13px] font-semibold text-humana-gold">{fmt(booking.commission_cents)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap text-[12px] text-humana-subtle">{formatDate(booking.created_at)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {meta && meta.total_pages > 1 && (
        <Pagination page={page} totalPages={meta.total_pages} setPage={setPage} />
      )}
    </div>
  );
}

/* --- Retreat Sales Tab --- */

function RetreatSalesTab({
  sales,
  meta,
  loading,
  page,
  setPage,
  tb,
  fmt,
  formatDate,
  formatShort,
  statusColors,
}: {
  sales: BillingSale[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  setPage: (p: number | ((p: number) => number)) => void;
  tb: {
    empty: string;
    emptyHint: string;
    columns: { reference: string; retreat: string; agency: string; roomType: string; guests: string; dates: string; amount: string; commission: string; status: string; created: string };
  };
  fmt: (cents: number) => string;
  formatDate: (iso: string) => string;
  formatShort: (iso: string) => string;
  statusColors: Record<string, string>;
}) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-humana-line bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
        <p className="text-[18px] font-medium text-humana-ink">{tb.empty}</p>
        <p className="mt-2 max-w-md text-[14px] text-humana-muted">{tb.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-humana-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-humana-line bg-[#fafaf7]">
              <Th>{tb.columns.reference}</Th>
              <Th>{tb.columns.retreat}</Th>
              <Th>{tb.columns.agency}</Th>
              <Th>{tb.columns.roomType}</Th>
              <Th>{tb.columns.guests}</Th>
              <Th>{tb.columns.dates}</Th>
              <Th align="right">{tb.columns.amount}</Th>
              <Th align="right">{tb.columns.commission}</Th>
              <Th>{tb.columns.status}</Th>
              <Th>{tb.columns.created}</Th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, idx) => (
              <tr
                key={sale.id}
                className={`border-b border-humana-line/60 transition-colors hover:bg-humana-stone/40 ${idx % 2 === 1 ? "bg-[#fdfdfb]" : ""}`}
              >
                <td className="px-4 py-3">
                  <span className="text-[13px] font-semibold tracking-wide text-humana-ink">{sale.reference}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] text-humana-ink">{sale.retreat_name ?? "\u2014"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] text-humana-ink">{sale.buying_agency ?? "\u2014"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] text-humana-muted">{sale.room_type?.name ?? "\u2014"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] text-humana-ink">{sale.guests}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="whitespace-nowrap text-[13px] text-humana-ink">
                    {formatShort(sale.starts_on)} &ndash; {formatShort(sale.ends_on)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="whitespace-nowrap text-[13px] font-semibold text-humana-ink">
                    {fmt(sale.amount_cents)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="whitespace-nowrap text-[13px] font-semibold text-humana-gold">
                    {fmt(sale.commission_cents)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusColors[sale.status] ?? "border-humana-line text-humana-muted"}`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="whitespace-nowrap text-[12px] text-humana-subtle">{formatDate(sale.created_at)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.total_pages > 1 && (
        <Pagination page={page} totalPages={meta.total_pages} setPage={setPage} />
      )}
    </div>
  );
}

/* --- Shared Components --- */

function Th({ children, align }: { children: React.ReactNode; align?: "left" | "right" }) {
  const alignCls = align === "right" ? "text-right" : "text-left";
  return (
    <th className={`px-4 py-3 ${alignCls} text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle`}>
      {children}
    </th>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number | ((p: number) => number)) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 border-t border-humana-line px-4 py-4">
      <button
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
        className="rounded-lg border border-humana-line px-4 py-2 text-[13px] font-semibold text-humana-ink transition-colors hover:border-humana-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        &larr;
      </button>
      <span className="text-[13px] text-humana-muted">
        {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="rounded-lg border border-humana-line px-4 py-2 text-[13px] font-semibold text-humana-ink transition-colors hover:border-humana-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        &rarr;
      </button>
    </div>
  );
}
