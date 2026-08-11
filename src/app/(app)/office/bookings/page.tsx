"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { officeApi } from "@/lib/api/office";
import { KpiCard } from "@/components/admin/KpiCard";
import { Pagination } from "@/components/admin/Pagination";
import type { OfficeBooking, OfficeBookingSummary, OfficeRevenue, PaginationMeta } from "@/lib/types";

function fmt(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);
}

type ViewMode = "bookings" | "monthly";

export default function OfficeBookingsPage() {
  const { t } = useLocale();
  const [view, setView] = useState<ViewMode>("bookings");
  const [bookings, setBookings] = useState<OfficeBooking[]>([]);
  const [summary, setSummary] = useState<OfficeBookingSummary | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Revenue data for monthly view
  const [revenue, setRevenue] = useState<OfficeRevenue | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await officeApi.listBookings({ page, per_page: 20, status: "confirmed" });
      setBookings(res.bookings);
      setSummary(res.summary);
      setMeta(res.meta);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchRevenue = useCallback(async () => {
    setRevenueLoading(true);
    try {
      const res = await officeApi.getRevenue();
      setRevenue(res.revenue);
    } catch {
      // ignore
    } finally {
      setRevenueLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (view === "monthly" && !revenue) {
      fetchRevenue();
    }
  }, [view, revenue, fetchRevenue]);

  const col = t.officeWs.bookings.columns;

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-12 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.officeWs.bookings.eyebrow}
          </span>
          <h1 className="mt-2 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
            {t.officeWs.bookings.title}
          </h1>
          <p className="mt-1 text-[15px] text-humana-muted">
            {t.officeWs.bookings.subtitle}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex rounded-[6px] border border-humana-line bg-white p-1">
          <button
            onClick={() => setView("bookings")}
            className={`cursor-pointer rounded-[4px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
              view === "bookings"
                ? "bg-humana-ink text-white"
                : "text-humana-muted hover:text-humana-ink"
            }`}
          >
            {t.officeWs.bookings.viewBookings}
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`cursor-pointer rounded-[4px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
              view === "monthly"
                ? "bg-humana-ink text-white"
                : "text-humana-muted hover:text-humana-ink"
            }`}
          >
            {t.officeWs.bookings.viewMonthly}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="mb-10 grid grid-cols-4 gap-5 stagger-children">
          <KpiCard
            label={t.officeWs.bookings.kpis.total}
            value={summary.total}
            delay={0}
            icon={
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
          />
          <KpiCard
            label={t.officeWs.bookings.kpis.confirmed}
            value={summary.confirmed}
            delay={60}
            icon={
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <KpiCard
            label={t.officeWs.bookings.kpis.volume}
            value={fmt(summary.volume_cents)}
            delay={120}
            icon={
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            }
          />
          <KpiCard
            label={t.officeWs.bookings.kpis.officeRevenue}
            value={fmt(summary.office_revenue_cents)}
            delay={180}
            subtitle="2% fee"
            icon={
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* ─── Monthly Revenue View ─── */}
      {view === "monthly" && (
        <div className="animate-[fade-in-up_0.3s_ease-out]">
          {revenueLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
            </div>
          ) : !revenue || revenue.monthly.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-humana-subtle">{t.officeWs.bookings.empty}</p>
          ) : (
            <>
              {/* Monthly chart title */}
              <h2 className="mb-6 text-[18px] font-medium text-humana-ink">
                {t.officeWs.bookings.monthlyRevenue}
              </h2>

              {/* Bar chart */}
              <div className="mb-10 overflow-hidden rounded-[6px] border border-humana-line bg-white p-6">
                {(() => {
                  const maxVol = Math.max(...revenue.monthly.map((m) => m.volume_cents), 1);
                  return (
                    <div className="flex items-end gap-2" style={{ height: 220 }}>
                      {revenue.monthly.map((m, i) => {
                        const pct = (m.volume_cents / maxVol) * 100;
                        const feePct = (m.office_revenue_cents / maxVol) * 100;
                        return (
                          <div
                            key={m.month}
                            className="group relative flex flex-1 flex-col items-center animate-[fade-in-up_0.4s_ease-out_both]"
                            style={{ animationDelay: `${i * 40}ms` }}
                          >
                            {/* Tooltip */}
                            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 rounded-[6px] border border-humana-line bg-white px-3 py-2 opacity-0 shadow-md transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                              <p className="text-[12px] font-medium text-humana-ink">{fmt(m.volume_cents)}</p>
                              <p className="text-[11px] text-humana-gold">{fmt(m.office_revenue_cents)} fee</p>
                              <p className="text-[11px] text-humana-muted">{m.booking_count} bookings</p>
                            </div>

                            {/* Bars */}
                            <div className="relative w-full flex justify-center gap-0.5" style={{ height: 180 }}>
                              <div
                                className="w-[45%] rounded-t-[3px] bg-humana-ink/10 transition-all group-hover:bg-humana-ink/20"
                                style={{ height: `${Math.max(pct, 2)}%`, alignSelf: "flex-end" }}
                              />
                              <div
                                className="w-[45%] rounded-t-[3px] bg-humana-gold transition-all group-hover:bg-humana-gold/80"
                                style={{ height: `${Math.max(feePct, 2)}%`, alignSelf: "flex-end" }}
                              />
                            </div>

                            {/* Label */}
                            <span className="mt-2 text-[10px] font-medium text-humana-muted">
                              {m.label.split(" ")[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Legend */}
                <div className="mt-4 flex justify-center gap-6 border-t border-humana-line pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-[2px] bg-humana-ink/15" />
                    <span className="text-[11px] text-humana-muted">{t.officeWs.bookings.monthlyVolume}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-[2px] bg-humana-gold" />
                    <span className="text-[11px] text-humana-muted">{t.officeWs.bookings.monthlyOfficeFee}</span>
                  </div>
                </div>
              </div>

              {/* Monthly table */}
              <div className="overflow-hidden rounded-[6px] border border-humana-line bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-humana-line">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">Month</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.bookings.monthlyBookings}</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.bookings.monthlyVolume}</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.officeWs.bookings.monthlyOfficeFee}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...revenue.monthly].reverse().map((m, i) => (
                      <tr
                        key={m.month}
                        className="border-b border-humana-line/50 transition-colors hover:bg-humana-stone/30 animate-[fade-in-up_0.3s_ease-out_both]"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <td className="px-5 py-4 text-[14px] font-medium text-humana-ink">{m.label}</td>
                        <td className="px-5 py-4 text-right text-[14px] text-humana-muted">{m.booking_count}</td>
                        <td className="px-5 py-4 text-right text-[14px] font-medium text-humana-ink">{fmt(m.volume_cents)}</td>
                        <td className="px-5 py-4 text-right text-[14px] font-medium text-humana-gold">{fmt(m.office_revenue_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Bookings List View ─── */}
      {view === "bookings" && (
        <div className="animate-[fade-in-up_0.3s_ease-out]">
          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-humana-subtle">{t.officeWs.bookings.empty}</p>
          ) : (
            <>
              <div className="overflow-hidden rounded-[6px] border border-humana-line bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-humana-line">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.reference}</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.type}</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.agency}</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.hotel}</th>
                      <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.guests}</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.amount}</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{col.officeFee}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr
                        key={b.id}
                        className="border-b border-humana-line/50 transition-colors hover:bg-humana-stone/30 animate-[fade-in-up_0.3s_ease-out_both]"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-[13px] font-medium text-humana-ink">{b.reference}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                            b.booking_type === "retreat"
                              ? "bg-violet-50 text-violet-700 border-violet-200"
                              : "bg-sky-50 text-sky-700 border-sky-200"
                          }`}>
                            {b.booking_type === "retreat" ? col.retreat : col.lodging}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[14px] text-humana-muted">
                          {b.agency?.name || "—"}
                        </td>
                        <td className="px-5 py-4 text-[14px] text-humana-muted">
                          {b.hotel?.name || "—"}
                        </td>
                        <td className="px-5 py-4 text-[14px] text-humana-ink text-center">{b.guests}</td>
                        <td className="px-5 py-4 text-[14px] font-medium text-humana-ink text-right">
                          {fmt(b.amount_cents)}
                        </td>
                        <td className="px-5 py-4 text-[14px] font-medium text-humana-gold text-right">
                          {fmt(b.office_fee_cents)}
                        </td>
                      </tr>
                    ))}
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
      )}
    </div>
  );
}
