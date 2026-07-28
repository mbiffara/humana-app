/** Hotel workspace dashboard (HT-02): KPI row, next check-ins, active
 *  retreat programs, and quick actions. Data comes from a single
 *  /hotel/dashboard aggregate endpoint. */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { hotelApi, type HotelDashboard } from "@/lib/api/hotel";

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function money(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default function HotelDashboardPage() {
  const { t, locale } = useLocale();
  const td = t.hotelWs.dashboard;
  const [data, setData] = useState<HotelDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi
      .getDashboard()
      .then((res) => setData(res.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (!data) return null;

  const now = new Date();
  const monthYear = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(now);
  const prevMonthName = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
  );
  const memberSince = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(`${data.hotel.member_since}T00:00:00`),
  );

  const occupancyPct = Math.round(data.occupancy.rate * 100);
  const occupancyDelta = Math.round((data.occupancy.rate - data.occupancy.previous_rate) * 100);
  const revenueDelta = data.revenue.current_cents - data.revenue.previous_cents;
  const activeRetreats = data.retreats.in_progress + data.retreats.upcoming;

  const kpis = [
    {
      label: td.kpis.occupancy,
      value: `${occupancyPct}%`,
      hint: td.kpis.occupancyDelta(occupancyDelta),
    },
    {
      label: td.kpis.revenue,
      value: money(data.revenue.current_cents, data.revenue.currency, locale),
      hint: td.kpis.revenueDelta(
        `${revenueDelta >= 0 ? "+" : "-"}${money(Math.abs(revenueDelta), data.revenue.currency, locale)}`,
        prevMonthName,
      ),
    },
    {
      label: td.kpis.upcomingGuests,
      value: String(data.upcoming.guests),
      hint: td.kpis.upcomingHint(data.upcoming.check_ins_today),
    },
    {
      label: td.kpis.activeRetreats,
      value: String(activeRetreats),
      hint: td.kpis.retreatsHint(data.retreats.in_progress, data.retreats.upcoming),
    },
  ];

  const quickActions = [
    { label: td.quickActions.blockDates, href: "/hotel/calendar" },
    { label: td.quickActions.createRetreat, href: "/hotel/retreats/create/step-1", clearWizard: true },
    { label: td.quickActions.updatePricing, href: "/hotel/rooms" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between animate-fade-in-up">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {monthYear} · {td.eyebrowWeek(isoWeek(now))}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">
            {td.welcome(data.hotel.name)}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">
            {[
              td.roomsCount(data.hotel.rooms_total),
              [data.hotel.city, data.hotel.country].filter(Boolean).join(", "),
              td.memberSince(memberSince),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <span className="rounded border border-humana-line bg-white px-4 py-2 text-[12px] font-medium text-humana-ink">
          {td.lastThirtyDays}
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-5 stagger-children">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {kpi.label}
            </p>
            <p className="mt-2 text-[30px] font-bold text-humana-ink">{kpi.value}</p>
            <p className="mt-1 text-[12px] text-humana-muted">{kpi.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-6">
        {/* Next check-ins */}
        <section className="min-w-0 flex-1">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {td.checkIns.eyebrow}
              </p>
              <h2 className="mt-1 text-[20px] font-bold text-humana-ink">{td.checkIns.title}</h2>
            </div>
            <Link
              href="/hotel/calendar"
              className="text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
            >
              {td.checkIns.viewAll}
            </Link>
          </div>

          {data.next_check_ins.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-xl border border-humana-line bg-white py-14 text-center">
              <p className="text-[15px] font-medium text-humana-ink">{td.checkIns.empty}</p>
              <p className="mt-1 max-w-sm text-[13px] text-humana-muted">{td.checkIns.emptyHint}</p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {data.next_check_ins.map((checkIn) => {
                const date = new Date(`${checkIn.starts_on}T00:00:00`);
                const details = [
                  checkIn.room_type,
                  checkIn.nights != null ? t.hotelWs.retreats.nights(checkIn.nights) : null,
                  checkIn.agency,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <div
                    key={checkIn.id}
                    className="flex items-center gap-5 rounded-xl border border-humana-line bg-white px-6 py-4"
                  >
                    <div className="w-10 shrink-0 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">
                        {new Intl.DateTimeFormat(locale, { month: "short" }).format(date)}
                      </p>
                      <p className="text-[20px] font-bold leading-tight text-humana-ink">
                        {date.getDate()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-humana-ink">
                        {checkIn.guest_name ?? checkIn.reference}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-humana-muted">{details}</p>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        checkIn.days_until === 0
                          ? "bg-humana-gold-light text-humana-ink"
                          : "bg-humana-stone text-humana-muted"
                      }`}
                    >
                      {checkIn.days_until === 0 ? td.checkIns.today : td.checkIns.inDays(checkIn.days_until)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right column */}
        <aside className="flex w-[320px] shrink-0 flex-col gap-5">
          {/* Active programs */}
          <div className="rounded-xl border border-humana-line bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {td.retreats.eyebrow}
            </p>
            <h3 className="mt-1 text-[16px] font-bold text-humana-ink">{td.retreats.title}</h3>
            {data.retreats.items.length === 0 ? (
              <div className="mt-4 text-center">
                <p className="text-[13px] font-medium text-humana-ink">{td.retreats.empty}</p>
                <p className="mt-1 text-[12px] text-humana-muted">{td.retreats.emptyHint}</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col divide-y divide-humana-line">
                {data.retreats.items.map((retreat) => {
                  const range =
                    retreat.starts_on && retreat.ends_on
                      ? `${new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${retreat.starts_on}T00:00:00`))} – ${new Intl.DateTimeFormat(locale, { day: "numeric" }).format(new Date(`${retreat.ends_on}T00:00:00`))}`
                      : null;
                  return (
                    <Link
                      key={retreat.id}
                      href={`/hotel/retreats/create/step-1?id=${retreat.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-opacity hover:opacity-75"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-humana-ink">
                          {retreat.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-humana-muted">
                          {[range, retreat.capacity ? td.retreats.guests(retreat.capacity) : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ${
                          retreat.state === "in_progress"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-humana-gold-light text-humana-ink"
                        }`}
                      >
                        {retreat.state === "in_progress" ? td.retreats.inProgress : td.retreats.upcoming}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-xl bg-humana-ink p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {td.quickActions.title}
            </p>
            <div className="mt-3 flex flex-col divide-y divide-white/10">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={() => {
                    if (action.clearWizard) sessionStorage.removeItem("humana.retreat-wizard");
                  }}
                  className="group flex items-center justify-between py-3.5 text-[13px] text-white transition-opacity hover:opacity-80"
                >
                  {action.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/50 transition-transform group-hover:translate-x-0.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
