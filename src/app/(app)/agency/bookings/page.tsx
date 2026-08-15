/** Agency workspace — booking history (AG-02).
 *  Split into Retreat & Lodging tables with tooltips on every column header. */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiBooking } from "@/lib/api/agency";

const LOCALE_TAGS: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-PT" };


function money(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(dateStr: string, tag: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", year: "2-digit" }).format(d);
}

function formatDateRange(start: string, end: string, tag: string): string {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const fmtStart = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" }).format(s);
  const fmtEnd = new Intl.DateTimeFormat(tag, { day: "numeric", month: "short" }).format(e);
  return `${fmtStart} – ${fmtEnd}`;
}

function diffNights(start: string, end: string): number {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

/* ─── Tooltip header cell ─── */
function Th({ children, tooltip, align = "left" }: { children: React.ReactNode; tooltip: string; align?: "left" | "center" | "right" }) {
  const alignCls = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <th className={`group relative px-4 py-3 ${alignCls} text-[10px] font-bold uppercase tracking-[0.18em] text-humana-subtle`}>
      <span className="inline-flex items-center gap-1">
        {children}
        <svg className="h-3 w-3 shrink-0 text-humana-line group-hover:text-humana-subtle transition-colors" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11ZM8 5a.75.75 0 1 1 0-1.5A.75.75 0 0 1 8 5Zm-.75 1.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Z" />
        </svg>
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 whitespace-nowrap rounded bg-humana-ink px-2.5 py-1.5 text-[11px] font-normal normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {tooltip}
      </span>
    </th>
  );
}

interface BookingSummary {
  total: number;
  confirmed: number;
  retreat_count: number;
  lodging_count: number;
  commission_cents: number;
  volume_cents: number;
}

export default function AgencyBookingsPage() {
  const { t, locale } = useLocale();
  const tb = t.agencyWs.bookings;
  const tag = LOCALE_TAGS[locale] ?? "en-US";
  const searchParams = useSearchParams();

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [stripeSuccessHasClient, setStripeSuccessHasClient] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const verifyAttempted = useRef(false);
  const [retreatHotelId, setRetreatHotelId] = useState<number | "">("");
  const [lodgingHotelId, setLodgingHotelId] = useState<number | "">("");
  const [onlyRetreatVenues, setOnlyRetreatVenues] = useState(false);

  const fetchBookings = useCallback(async (pg: number) => {
    setLoading(true);
    try {
      const res = await agencyApi.listBookings({ page: pg, per_page: 25 });
      setBookings(res.bookings);
      setTotalPages(res.meta?.total_pages ?? 1);
      if (res.summary) {
        setSummary({
          total: res.summary.total,
          confirmed: res.summary.confirmed,
          retreat_count: (res.summary as BookingSummary).retreat_count ?? 0,
          lodging_count: (res.summary as BookingSummary).lodging_count ?? 0,
          commission_cents: res.summary.commission_cents,
          volume_cents: res.summary.volume_cents,
        });
      } else {
        const total = res.meta?.total ?? res.bookings.length;
        const confirmed = res.bookings.filter((b) => b.status === "confirmed").length;
        const retreat_count = res.bookings.filter((b) => !!b.experience || !!b.retreat).length;
        const lodging_count = res.bookings.filter((b) => !b.experience && !b.retreat).length;
        const commission_cents = res.bookings.reduce((acc, b) => acc + (b.commission_cents ?? 0), 0);
        const volume_cents = res.bookings.reduce((acc, b) => acc + (b.amount_cents ?? 0), 0);
        setSummary({ total, confirmed, retreat_count, lodging_count, commission_cents, volume_cents });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(page);
  }, [fetchBookings, page]);

  // Detect return from Stripe Checkout — verify session and confirm booking
  useEffect(() => {
    const stripeStatus = searchParams.get("stripe");
    const sessionId = searchParams.get("session_id");
    const bookingId = searchParams.get("booking_id");

    if (stripeStatus === "success" && sessionId && bookingId && !verifyAttempted.current) {
      verifyAttempted.current = true;
      setVerifying(true);
      agencyApi
        .verifyBookingCheckout(Number(bookingId), sessionId)
        .then((res) => {
          setStripeSuccessHasClient(!!res.booking.client);
          setStripeSuccess(true);
          fetchBookings(1);
        })
        .catch(() => {
          // Fetch latest state anyway
          fetchBookings(1);
        })
        .finally(() => setVerifying(false));

      // Clean URL params
      const url = new URL(window.location.href);
      url.searchParams.delete("stripe");
      url.searchParams.delete("session_id");
      url.searchParams.delete("booking_id");
      window.history.replaceState({}, "", url.toString());
    } else if (stripeStatus === "cancelled") {
      const url = new URL(window.location.href);
      url.searchParams.delete("stripe");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, fetchBookings]);

  const col = tb.columns;
  const tip = tb.tooltips;

  // Extract unique hotels for filter dropdown
  const uniqueHotels = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    bookings.forEach((b) => {
      const h = b.experience?.hotel ?? b.hotel;
      if (h) map.set(h.id, { id: h.id, name: h.name });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [bookings]);

  // Split bookings by type, applying independent hotel filters
  const retreatBookings = bookings.filter((b) => {
    const isRetreat = !!b.experience || !!b.retreat;
    if (!isRetreat) return false;
    const hotelId = b.experience?.hotel?.id ?? b.hotel?.id;
    if (retreatHotelId !== "" && hotelId !== retreatHotelId) return false;
    return true;
  });
  const hotelBookings = bookings.filter((b) => {
    if (b.experience || b.retreat) return false;
    if (lodgingHotelId !== "" && b.hotel?.id !== lodgingHotelId) return false;
    if (onlyRetreatVenues && b.client != null) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Verifying overlay */}
      {verifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
            <p className="text-[14px] font-medium text-humana-ink">Verificando pago...</p>
          </div>
        </div>
      )}

      {/* Stripe success banner */}
      {stripeSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 animate-fade-in-up">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          <span className="flex-1 text-[14px] font-medium text-emerald-800">
            {stripeSuccessHasClient
              ? "Reserva confirmada. Se ha enviado un email de confirmacion al cliente."
              : "Reserva confirmada. Se ha enviado un email de confirmacion a tu cuenta."}
          </span>
          <button onClick={() => setStripeSuccess(false)} className="cursor-pointer text-emerald-400 transition-colors hover:text-emerald-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

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
        <div className="mb-6 grid grid-cols-5 gap-5 stagger-children">
          {[
            { label: tb.kpis.totalBookings, value: String(summary.total), tooltip: tb.kpiTooltips.totalBookings },
            { label: tb.kpis.retreats, value: String(summary.retreat_count), gold: true, tooltip: tb.kpiTooltips.retreats },
            { label: tb.kpis.lodging, value: String(summary.lodging_count), gold: true, tooltip: tb.kpiTooltips.lodging },
            { label: tb.kpis.commission, value: money(summary.commission_cents, "USD", tag), tooltip: tb.kpiTooltips.commission },
            { label: tb.kpis.volume, value: money(summary.volume_cents, "USD", tag), tooltip: tb.kpiTooltips.volume },
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
              <p className={`mt-2 text-[30px] font-bold ${kpi.gold ? "text-humana-gold" : "text-humana-ink"}`}>{kpi.value}</p>
              <span className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-humana-ink px-3 py-2 text-[11px] font-normal normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {kpi.tooltip}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-humana-ink" />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
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
        <div className="space-y-10">
          {/* ── Retreat Bookings ── */}
          <section>
            <div className="mb-3 pb-2 flex items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {tb.retreatSection}
              </p>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-humana-gold/10 px-1.5 text-[10px] font-bold text-humana-gold">
                {retreatBookings.length}
              </span>
              <select
                value={retreatHotelId}
                onChange={(e) => setRetreatHotelId(e.target.value === "" ? "" : Number(e.target.value))}
                className="ml-auto rounded-lg border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
              >
                <option value="">{tb.allHotels}</option>
                {uniqueHotels.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            {retreatBookings.length === 0 ? (
              <div className="rounded-xl border border-humana-line bg-white px-6 py-12 text-center">
                <p className="text-[14px] text-humana-muted">{tb.emptyRetreats}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-humana-line bg-white animate-fade-in-up">
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-humana-line bg-[#fafaf7]">
                        <Th tooltip={tip.reference}>{col.reference}</Th>
                        <Th tooltip={tip.client}>{col.client}</Th>
                        <Th tooltip={tip.experience}>{col.experience}</Th>
                        <Th tooltip={tip.type}>{col.type}</Th>
                        <Th tooltip={tip.hotel}>{col.hotel}</Th>
                        <Th tooltip={tip.guests} align="center">{col.guests}</Th>
                        <Th tooltip={tip.dates}>{col.dates}</Th>
                        <Th tooltip={tip.amount} align="right">{col.amount}</Th>
                        <Th tooltip={tip.commission} align="right">{col.commission}</Th>
                        <Th tooltip={tip.created}>{col.created}</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {retreatBookings.map((booking, idx) => {
                        return (
                          <tr
                            key={booking.id}
                            className={`border-b border-humana-line/60 transition-colors hover:bg-humana-stone/40 ${idx % 2 === 1 ? "bg-[#fdfdfb]" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <span className="text-[13px] font-semibold text-humana-ink tracking-wide">
                                {booking.reference}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium text-humana-ink">
                                  {booking.client?.name ?? "\u2014"}
                                </p>
                                <p className="truncate text-[11px] text-humana-subtle">
                                  {booking.client?.email ?? ""}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 max-w-[160px]">
                              <p className="truncate text-[13px] text-humana-ink">
                                {booking.experience?.title ?? booking.retreat?.name ?? "\u2014"}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[12px] capitalize text-humana-muted">
                                {booking.experience?.kind ?? booking.retreat?.retreat_type ?? "\u2014"}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-[140px]">
                              <p className="truncate text-[13px] text-humana-muted">
                                {booking.experience?.hotel?.name ?? booking.hotel?.name ?? "\u2014"}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-[13px] text-humana-ink">{booking.guests}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-[13px] text-humana-ink">
                                {booking.starts_on && booking.ends_on
                                  ? formatDateRange(booking.starts_on, booking.ends_on, tag)
                                  : "\u2014"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <span className="text-[13px] font-semibold text-humana-ink">
                                {money(booking.amount_cents, booking.currency, tag)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <span className="text-[13px] font-semibold text-humana-gold">
                                {money(booking.commission_cents, booking.currency, tag)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-[12px] text-humana-subtle">
                                {booking.created_at ? formatDate(booking.created_at.slice(0, 10), tag) : "\u2014"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* ── Lodging Bookings ── */}
          <section>
            <div className="mb-3 pb-2 flex items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {tb.lodgingSection}
              </p>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-humana-gold/10 px-1.5 text-[10px] font-bold text-humana-gold">
                {hotelBookings.length}
              </span>
              <div className="ml-auto flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-humana-muted select-none">
                  <input
                    type="checkbox"
                    checked={onlyRetreatVenues}
                    onChange={(e) => setOnlyRetreatVenues(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-humana-line accent-humana-gold"
                  />
                  {tb.onlyRetreatVenues}
                </label>
                <select
                  value={lodgingHotelId}
                  onChange={(e) => setLodgingHotelId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="rounded-lg border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                >
                  <option value="">{tb.allHotels}</option>
                  {uniqueHotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {hotelBookings.length === 0 ? (
              <div className="rounded-xl border border-humana-line bg-white px-6 py-12 text-center">
                <p className="text-[14px] text-humana-muted">{tb.emptyLodging}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-humana-line bg-white animate-fade-in-up">
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-humana-line bg-[#fafaf7]">
                        <Th tooltip={tip.reference}>{col.reference}</Th>
                        <Th tooltip={tip.client}>{col.client}</Th>
                        <Th tooltip={tip.hotel}>{col.hotel}</Th>
                        <Th tooltip={tip.room}>{col.room}</Th>
                        <Th tooltip={tip.guests} align="center">{col.guests}</Th>
                        <Th tooltip={tip.checkIn}>{col.checkIn}</Th>
                        <Th tooltip={tip.checkOut}>{col.checkOut}</Th>
                        <Th tooltip={tip.nights} align="center">{col.nights}</Th>
                        <Th tooltip={tip.amount} align="right">{col.amount}</Th>
                        <Th tooltip={tip.commission} align="right">{col.commission}</Th>
                        <Th tooltip={tip.created}>{col.created}</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelBookings.map((booking, idx) => {
                        const nights = booking.starts_on && booking.ends_on ? diffNights(booking.starts_on, booking.ends_on) : 0;
                        return (
                          <tr
                            key={booking.id}
                            className={`border-b border-humana-line/60 transition-colors hover:bg-humana-stone/40 ${idx % 2 === 1 ? "bg-[#fdfdfb]" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <span className="text-[13px] font-semibold text-humana-ink tracking-wide">
                                {booking.reference}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium text-humana-ink">
                                  {booking.client?.name ?? "\u2014"}
                                </p>
                                <p className="truncate text-[11px] text-humana-subtle">
                                  {booking.client?.email ?? ""}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 max-w-[140px]">
                              <p className="truncate text-[13px] text-humana-ink">
                                {booking.hotel?.name ?? "\u2014"}
                              </p>
                            </td>
                            <td className="px-4 py-3 max-w-[120px]">
                              <p className="truncate text-[13px] text-humana-muted">
                                {booking.room_type?.name ?? "\u2014"}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-[13px] text-humana-ink">{booking.room_type?.capacity ?? booking.guests}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-[13px] text-humana-ink">
                                {booking.starts_on ? formatDate(booking.starts_on, tag) : "\u2014"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-[13px] text-humana-ink">
                                {booking.ends_on ? formatDate(booking.ends_on, tag) : "\u2014"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-[13px] text-humana-ink">{nights}</span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <span className="text-[13px] font-semibold text-humana-ink">
                                {money(booking.amount_cents, booking.currency, tag)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <span className="text-[13px] font-semibold text-humana-gold">
                                {money(booking.commission_cents, booking.currency, tag)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-[12px] text-humana-subtle">
                                {booking.created_at ? formatDate(booking.created_at.slice(0, 10), tag) : "\u2014"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
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
