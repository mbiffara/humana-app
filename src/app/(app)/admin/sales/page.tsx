/** Admin — Sales: all bookings across the platform with filters by country, agency, hotel, status. */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import { Pagination } from "@/components/admin/Pagination";
import type { AdminBooking, AdminBookingsSummary, PaginationMeta, Organization } from "@/lib/types";


function formatCurrency(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cents / 100);
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US",
    { day: "2-digit", month: "short", year: "numeric" },
  );
}

export default function SalesPage() {
  const { t, locale } = useLocale();
  const s = t.admin.sales;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, per_page: 20, total: 0, total_pages: 0 });
  const [summary, setSummary] = useState<AdminBookingsSummary>({ total_amount_cents: 0, total_commission_cents: 0, count: 0 });

  // Filters
  const [countryCode, setCountryCode] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Available filter options (fetched once)
  const [countries, setCountries] = useState<{ code: string; name: string; flag_emoji: string | null }[]>([]);
  const [agencies, setAgencies] = useState<Organization[]>([]);

  // Fetch filter options on mount
  useEffect(() => {
    Promise.all([
      adminApi.listCountries().catch(() => ({ countries: [] })),
      adminApi.listOrganizations({ kind: "agency", per_page: 100 }).catch(() => ({ organizations: [] })),
    ]).then(([countriesRes, agenciesRes]) => {
      setCountries(countriesRes.countries.filter((c) => c.enabled).map((c) => ({ code: c.code, name: c.name, flag_emoji: c.flag_emoji })));
      setAgencies(agenciesRes.organizations);
    });
  }, []);

  const fetchBookings = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await adminApi.listBookings({
        country_code: countryCode || undefined,
        q: search || undefined,
        page: p,
        per_page: 20,
      });
      setBookings(res.bookings);
      setMeta(res.meta);
      setSummary(res.summary);
    } catch {
      // API unavailable
    } finally {
      setLoading(false);
    }
  }, [countryCode, search]);

  useEffect(() => {
    setPage(1);
    fetchBookings(1);
  }, [fetchBookings]);

  function handlePageChange(newPage: number) {
    setPage(newPage);
    fetchBookings(newPage);
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">
            {t.common.loading}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-16 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[12px] animate-[fade-in-up_0.4s_ease-out]">
        <Link href="/admin/dashboard" className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink">
          Dashboard
        </Link>
        <span className="text-humana-subtle">&rsaquo;</span>
        <span className="font-medium text-humana-ink">{s.breadcrumb}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {s.eyebrow}
        </span>
        <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
          {s.title}
        </h1>
        <p className="mt-1 text-[14px] text-humana-muted">{s.subtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
        <div className="rounded-xl border border-humana-line bg-white p-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{s.totalVolume}</span>
          <p className="mt-2 text-[28px] font-light tracking-[-0.02em] text-humana-ink">
            {formatCurrency(summary.total_amount_cents)}
          </p>
        </div>
        <div className="rounded-xl border border-humana-line bg-white p-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{s.totalBookings}</span>
          <p className="mt-2 text-[28px] font-light tracking-[-0.02em] text-humana-ink">
            {summary.count}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 animate-[fade-in-up_0.4s_ease-out_0.15s_both]">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={s.searchPlaceholder}
            className="h-10 rounded-lg border border-humana-line bg-white pl-9 pr-4 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold w-[220px]"
          />
        </div>

        {/* Country filter */}
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="h-10 cursor-pointer rounded-lg border border-humana-line bg-white px-3 pr-8 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
        >
          <option value="">{s.allCountries}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag_emoji} {c.name}
            </option>
          ))}
        </select>

        {/* Loading indicator */}
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-humana-line bg-white animate-[fade-in-up_0.4s_ease-out_0.2s_both]">
        {/* Table header */}
        <div className="grid grid-cols-[120px_100px_1fr_1fr_1fr_80px_120px] items-center gap-3 border-b border-humana-line px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted">{s.reference}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted">{s.type}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted">{s.agency}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted">{s.hotel}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted">{s.client}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted text-center">{s.guests}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-muted text-right">{s.amount}</span>
        </div>

        {/* Table body */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            <p className="text-[14px] text-humana-muted">{s.noResults}</p>
          </div>
        ) : (
          bookings.map((booking, i) => (
            <div
              key={booking.id}
              className="grid grid-cols-[120px_100px_1fr_1fr_1fr_80px_120px] items-center gap-3 border-b border-humana-line/50 px-5 py-4 transition-colors hover:bg-humana-stone/30 animate-[fade-in-up_0.3s_ease-out_both]"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Reference + Date */}
              <div>
                <p className="text-[13px] font-medium text-humana-ink font-mono">{booking.reference}</p>
                <p className="text-[11px] text-humana-muted">{formatDate(booking.created_at, locale)}</p>
              </div>

              {/* Type */}
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                booking.booking_type === "retreat"
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-sky-50 text-sky-700 border-sky-200"
              }`}>
                {booking.booking_type === "retreat" ? s.retreat : s.lodging}
              </span>

              {/* Agency */}
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-humana-ink">{booking.agency?.name || "—"}</p>
                <p className="truncate text-[11px] text-humana-muted">
                  {[booking.agency?.city, booking.agency?.country].filter(Boolean).join(", ") || "—"}
                </p>
              </div>

              {/* Hotel */}
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-humana-ink">{booking.hotel?.name || "—"}</p>
                <p className="truncate text-[11px] text-humana-muted">
                  {booking.hotel ? [booking.hotel.city, booking.hotel.country].filter(Boolean).join(", ") : booking.experience?.title || "—"}
                </p>
              </div>

              {/* Client */}
              <div className="min-w-0">
                <p className="truncate text-[13px] text-humana-ink">{booking.client?.name || "—"}</p>
                <p className="truncate text-[11px] text-humana-muted">{booking.client?.email || ""}</p>
              </div>

              {/* Guests */}
              <p className="text-[13px] text-humana-ink text-center">{booking.guests}</p>

              {/* Amount */}
              <p className="text-[13px] font-medium text-humana-ink text-right">
                {formatCurrency(booking.amount_cents, booking.currency)}
              </p>
            </div>
          ))
        )}

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div className="px-5 py-3">
            <Pagination meta={meta} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
