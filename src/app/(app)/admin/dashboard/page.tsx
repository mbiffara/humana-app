/** Admin Dashboard — KPIs, quick actions, pending invitations, approval queue, and office cards.
 *  Matches Paper design artboard 8I-0 ("Admin Dashboard — HUMANA"). */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import { KpiCard } from "@/components/admin/KpiCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { OfficeCard } from "@/components/admin/OfficeCard";
import { PendingInvitationsList } from "@/components/admin/PendingInvitationsList";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import type { Organization, Invitation } from "@/lib/types";

function SectionTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="flex cursor-pointer text-humana-muted/50 transition-colors hover:text-humana-ink">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </span>
      {show && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg bg-humana-ink px-3.5 py-2.5 text-[11px] leading-[16px] font-normal normal-case tracking-normal text-white shadow-lg animate-[fade-in-up_0.15s_ease-out]">
          {text}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-humana-ink" />
        </div>
      )}
    </div>
  );
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminDashboard() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({ agencies: 0, hotels: 0, bookings: 0, gmv_cents: 0, pendingOrgs: 0 });
  const [platformSince, setPlatformSince] = useState(todayStr);
  const [dateRange, setDateRange] = useState(() => ({ from: todayStr(), to: todayStr() }));
  const [offices, setOffices] = useState<Organization[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);

  const initialFetchDone = useRef(false);

  const fetchData = useCallback(async (range: { from: string; to: string }) => {
    try {
      const [statsRes, invitationsRes, officesRes, pendingOrgsRes] = await Promise.all([
        adminApi.getStats({ from: range.from, to: range.to }),
        adminApi.listInvitations({ status: "pending", per_page: 5 }),
        adminApi.listOrganizations({ kind: "office", per_page: 10 }),
        adminApi.listOrganizations({ status: "pending", per_page: 5 }),
      ]);

      const since = statsRes.stats.platform_since || todayStr();
      setPlatformSince(since);

      // On first load, set the range to platform_since → today
      if (!initialFetchDone.current) {
        initialFetchDone.current = true;
        setDateRange({ from: since, to: todayStr() });
      }

      setKpi({
        agencies: statsRes.stats.agencies,
        hotels: statsRes.stats.hotels,
        bookings: statsRes.stats.bookings,
        gmv_cents: statsRes.stats.gmv_cents,
        pendingOrgs: pendingOrgsRes.meta.total,
      });
      setPendingInvitations(invitationsRes.invitations);
      setOffices(officesRes.organizations);
      setPendingOrgs(pendingOrgsRes.organizations);
    } catch {
      // Silently handle — KPIs will show 0
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(dateRange);
  }, [fetchData, dateRange]);

  if (loading) {
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
      {/* Hero header + date filter */}
      <div className="mb-10 flex items-start justify-between animate-[fade-in-up_0.5s_ease-out]">
        <div>
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-humana-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-humana-gold" />
            </span>
            {new Date().toLocaleDateString(locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
            {t.admin.dashboard.title}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">{t.admin.dashboard.subtitle}</p>
        </div>

        <div className="pt-5">
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            locale={locale}
            onChange={setDateRange}
            platformSince={platformSince}
          />
        </div>
      </div>

      {/* KPI Cards — 4 columns per Paper */}
      <div className="mb-10 grid grid-cols-4 gap-3 stagger-children">
        <KpiCard
          label={t.admin.dashboard.kpi.agencies}
          value={kpi.agencies}
          delay={0}
          tooltip={t.admin.dashboard.kpi.agenciesTooltip}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
        <KpiCard
          label={t.admin.dashboard.kpi.hotels}
          value={kpi.hotels}
          delay={100}
          tooltip={t.admin.dashboard.kpi.hotelsTooltip}
          subtitle={kpi.pendingOrgs > 0 ? `${kpi.pendingOrgs} ${t.admin.dashboard.pendingReview}` : undefined}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          }
        />
        <KpiCard
          label={t.admin.dashboard.kpi.bookings}
          value={kpi.bookings}
          delay={200}
          tooltip={t.admin.dashboard.kpi.bookingsTooltip}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
        />
        <KpiCard
          label={t.admin.dashboard.kpi.gmv}
          value={kpi.gmv_cents / 100}
          prefix="$"
          delay={300}
          tooltip={t.admin.dashboard.kpi.gmvTooltip}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions — 3 columns per Paper */}
      <div className="mb-10 animate-[fade-in-up_0.5s_ease-out_0.2s_both]">
        <div className="grid grid-cols-3 gap-4">
          <QuickActionCard
            label={t.admin.dashboard.inviteAgency}
            description={t.admin.dashboard.inviteAgencyDesc}
            href="/admin/network/create?role=agency"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            }
          />
          <QuickActionCard
            label={t.admin.dashboard.inviteHotel}
            description={t.admin.dashboard.inviteHotelDesc}
            href="/admin/network/create?role=hotel"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            }
          />
          <QuickActionCard
            label={t.admin.dashboard.createOffice}
            description={t.admin.dashboard.createOfficeDesc}
            href="/admin/network/create?role=office"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Two-column: Pending Invitations + Approval Queue (per Paper) */}
      <div className="mb-10 grid grid-cols-2 gap-6 animate-[fade-in-up_0.5s_ease-out_0.3s_both]">
        {/* Pending Invitations */}
        <div className="rounded-[6px] border border-humana-line bg-white p-6">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
            <SectionTooltip text={t.admin.dashboard.pendingInvitationsTooltip} />
            {t.admin.dashboard.pendingInvitations}
          </div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-humana-ink">
              {t.admin.dashboard.awaitingAcceptance}
            </h3>
            <button
              onClick={() => router.push("/admin/network")}
              className="cursor-pointer text-[12px] font-medium text-humana-gold transition-colors hover:text-[#c5a030]"
            >
              {t.admin.dashboard.sendNewInvite} &rarr;
            </button>
          </div>
          <PendingInvitationsList
            invitations={pendingInvitations}
            onResend={async (inv) => {
              await adminApi.resendInvitation(inv.id);
              fetchData(dateRange);
            }}
          />
        </div>

        {/* Approval Queue — pending organizations from API */}
        <div className="rounded-[6px] border border-humana-line bg-white p-6">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
            <SectionTooltip text={t.admin.dashboard.approvalQueueTooltip} />
            {t.admin.dashboard.approvalQueue}
          </div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-humana-ink">
              {t.admin.dashboard.orgsUnderReview}
            </h3>
            {pendingOrgs.length > 0 && (
              <span className="rounded-full bg-humana-gold-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-humana-gold">
                {kpi.pendingOrgs} {t.admin.dashboard.waiting}
              </span>
            )}
          </div>

          {pendingOrgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-humana-stone">
                <svg className="h-5 w-5 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[13px] text-humana-muted">{t.admin.dashboard.noApprovals}</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-humana-line">
              {pendingOrgs.map((org, i) => {
                const initials = org.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const kindColors: Record<string, string> = {
                  hotel: "bg-blue-50 text-blue-600",
                  agency: "bg-amber-50 text-amber-600",
                  office: "bg-emerald-50 text-emerald-600",
                };
                const kindLabels: Record<string, Record<string, string>> = {
                  hotel: { en: "Hotel", es: "Hotel", pt: "Hotel" },
                  agency: { en: "Agency", es: "Agencia", pt: "Agência" },
                  office: { en: "Office", es: "Oficina", pt: "Escritório" },
                };
                const orgKind = org.kind || "hotel";
                const created = org.created_at ? new Date(org.created_at) : null;
                const daysAgo = created ? Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)) : null;
                const timeLabel = daysAgo === 0
                  ? (locale === "es" ? "Hoy" : locale === "pt" ? "Hoje" : "Today")
                  : daysAgo !== null
                    ? (locale === "es" ? `Hace ${daysAgo}d` : locale === "pt" ? `Há ${daysAgo}d` : `${daysAgo}d ago`)
                    : "";
                return (
                  <div
                    key={org.id}
                    className="flex items-center gap-3 py-3.5 animate-[fade-in-up_0.3s_ease-out_both]"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-humana-stone text-[12px] font-semibold text-humana-muted">
                      {initials}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-medium text-humana-ink">
                          {org.name}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${kindColors[orgKind] || "bg-humana-stone text-humana-muted"}`}>
                          {kindLabels[orgKind]?.[locale] || orgKind}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-humana-muted">
                        {[org.city, org.country].filter(Boolean).join(", ")}
                        {timeLabel && <span> &middot; {timeLabel}</span>}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => router.push("/admin/network?tab=pending")}
                        className="cursor-pointer rounded-full border border-humana-line px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-humana-muted transition-all duration-200 hover:border-humana-gold hover:text-humana-gold"
                      >
                        {t.admin.network.review}
                      </button>
                      <button
                        onClick={() => router.push("/admin/network?tab=pending")}
                        className="cursor-pointer rounded-full bg-humana-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-humana-ink/80"
                      >
                        {t.admin.network.approve}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Operational Footprint — Offices (per Paper: 4-col grid) */}
      <div className="animate-[fade-in-up_0.5s_ease-out_0.4s_both]">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.admin.dashboard.officesEyebrow}
            </span>
            <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.01em] text-humana-ink">
              {t.admin.dashboard.officesTitle}
            </h2>
            <p className="mt-1 text-[13px] text-humana-muted">
              {t.admin.dashboard.officesSubtitle}
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/network")}
            className="cursor-pointer mt-4 inline-flex items-center gap-2 rounded-lg bg-humana-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-humana-ink/90 hover:shadow-md"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t.admin.dashboard.createOffice}
          </button>
        </div>

        {offices.length === 0 ? (
          <div className="rounded-xl border border-humana-line bg-white p-12 text-center">
            <svg className="mx-auto mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <p className="text-[14px] text-humana-muted">{t.admin.dashboard.noOffices}</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {offices.map((office, i) => (
              <OfficeCard
                key={office.id}
                office={office}
                delay={i * 100}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
