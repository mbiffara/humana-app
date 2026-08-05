"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { officeApi } from "@/lib/api/office";
import type { OfficeDashboard, Organization } from "@/lib/types";

function fmt(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <svg className="h-3.5 w-3.5 cursor-help text-humana-muted/40 transition-colors hover:text-humana-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
      {show && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg bg-humana-ink px-3 py-2 text-[11px] leading-[15px] font-normal normal-case tracking-normal text-white shadow-lg animate-[fade-in-up_0.15s_ease-out]">
          {text}
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-humana-ink" />
        </span>
      )}
    </span>
  );
}

const KIND_COLORS: Record<string, string> = {
  hotel: "bg-blue-50 text-blue-700 border-blue-200",
  agency: "bg-purple-50 text-purple-700 border-purple-200",
};

function ContactModal({
  open,
  onClose,
  org,
  t,
}: {
  open: boolean;
  onClose: () => void;
  org: Organization | null;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open && org) {
      const kindLabel = t.officeWs.dashboard.pendingKind[org.kind as "hotel" | "agency"] || org.kind;
      setSubject(t.officeWs.dashboard.approvalSubject(org.name));
      setMessage(t.officeWs.dashboard.approvalMessage(kindLabel, org.name, org.city || "", org.country || ""));
      setSent(false);
    } else if (open && !org) {
      setSubject("");
      setMessage("");
      setSent(false);
    }
  }, [open, org, t]);

  if (!open) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await officeApi.contactAdmin({ subject, message });
      setSent(true);
      setTimeout(() => onClose(), 1500);
    } catch {
      // keep modal open on failure
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-[fade-in_0.15s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-[520px] rounded-[12px] bg-white shadow-xl animate-[fade-in-scale_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-humana-line px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <h3 className="text-[15px] font-semibold text-humana-ink">{t.officeWs.dashboard.contactAdmin}</h3>
          </div>
          <p className="mt-1 text-[12px] text-humana-muted">info@humana.global</p>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {sent ? (
            <div className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[14px] font-medium text-emerald-700">{t.officeWs.dashboard.contactSent}</span>
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                  {t.officeWs.dashboard.contactSubject}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                  {t.officeWs.dashboard.contactMessage}
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.officeWs.dashboard.contactMessagePlaceholder}
                  className="w-full resize-none rounded-lg border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className="flex items-center justify-end gap-3 border-t border-humana-line px-6 py-4">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2 text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone"
            >
              {t.officeWs.dashboard.contactCancel}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="cursor-pointer rounded-lg bg-humana-ink px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition-all hover:bg-humana-ink/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? t.officeWs.dashboard.contactSending : t.officeWs.dashboard.contactSend}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type DateRange = "7" | "30" | "90" | "year" | "all";

export default function OfficeDashboardPage() {
  const { t } = useLocale();
  const [dashboard, setDashboard] = useState<OfficeDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactOrg, setContactOrg] = useState<Organization | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  useEffect(() => {
    officeApi.getDashboard().then((res) => {
      setDashboard(res.dashboard);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-[1200px] px-10 py-12">
        <p className="text-humana-muted">Failed to load dashboard data.</p>
      </div>
    );
  }

  const pendingCount = dashboard.pending_organizations.length;
  const year = new Date().getFullYear();

  const openContactForOrg = (org: Organization) => {
    setContactOrg(org);
    setContactOpen(true);
  };

  const openContactGeneral = () => {
    setContactOrg(null);
    setContactOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-12 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-humana-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.officeWs.dashboard.eyebrow} &middot; SEASON {year}
            </span>
          </div>
          <h1 className="mt-3 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
            {t.officeWs.dashboard.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Contact HUMANA button */}
          <button
            onClick={openContactGeneral}
            className="flex cursor-pointer items-center gap-2 rounded-[6px] border border-humana-line bg-white px-4 py-2 text-[13px] font-medium text-humana-ink transition-all hover:border-humana-gold/40 hover:shadow-sm"
          >
            <svg className="h-4 w-4 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {t.officeWs.dashboard.contactAdmin}
          </button>

          {/* Date range dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-humana-line bg-white px-4 py-2 transition-all hover:border-humana-gold/30"
            >
              <svg className="h-4 w-4 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-[13px] text-humana-muted">
                {dateRange === "7" ? t.officeWs.dashboard.last7
                  : dateRange === "30" ? t.officeWs.dashboard.last30
                  : dateRange === "90" ? t.officeWs.dashboard.last90
                  : dateRange === "year" ? t.officeWs.dashboard.thisYear
                  : t.officeWs.dashboard.allTime}
              </span>
              <svg className={`h-3.5 w-3.5 text-humana-subtle transition-transform ${dateDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {dateDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateDropdownOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-1.5 w-44 rounded-[8px] border border-humana-line bg-white py-1 shadow-lg animate-[fade-in-up_0.15s_ease-out]">
                  {([
                    { value: "7" as DateRange, label: t.officeWs.dashboard.last7 },
                    { value: "30" as DateRange, label: t.officeWs.dashboard.last30 },
                    { value: "90" as DateRange, label: t.officeWs.dashboard.last90 },
                    { value: "year" as DateRange, label: t.officeWs.dashboard.thisYear },
                    { value: "all" as DateRange, label: t.officeWs.dashboard.allTime },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setDateRange(opt.value); setDateDropdownOpen(false); }}
                      className={`flex w-full cursor-pointer items-center px-4 py-2 text-left text-[13px] transition-colors hover:bg-humana-stone/50 ${
                        dateRange === opt.value ? "font-semibold text-humana-gold" : "text-humana-ink"
                      }`}
                    >
                      {opt.label}
                      {dateRange === opt.value && (
                        <svg className="ml-auto h-4 w-4 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards — 5 columns, first one featured (dark) */}
      <div className="mb-10 grid grid-cols-5 gap-4 stagger-children">
        {/* GMV Total — featured dark card */}
        <div className="rounded-[8px] bg-humana-ink p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-[fade-in-up_0.4s_ease-out]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
            {t.officeWs.dashboard.kpis.gmv}
          </span>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-white">
            {fmt(dashboard.volume_cents)}
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            {t.officeWs.dashboard.kpis.gmvDelta}
          </p>
        </div>

        {/* Active Bookings */}
        <div className="rounded-[8px] border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-humana-gold/30 animate-[fade-in-up_0.4s_ease-out_60ms_both]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
            {t.officeWs.dashboard.kpis.bookings}
          </span>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-humana-ink">
            {dashboard.confirmed_bookings}
          </p>
          <p className="mt-1 text-[11px] font-medium text-emerald-600">
            {t.officeWs.dashboard.kpis.bookingsThisMonth(dashboard.bookings_this_month)}
          </p>
        </div>

        {/* Hotels in Network */}
        <div className="rounded-[8px] border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-humana-gold/30 animate-[fade-in-up_0.4s_ease-out_120ms_both]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
            {t.officeWs.dashboard.kpis.hotels}
          </span>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-humana-ink">
            {dashboard.hotels_count}
          </p>
          <p className="mt-1 text-[11px] text-humana-muted">
            {t.officeWs.dashboard.kpis.hotelsDetail(dashboard.countries_count, pendingCount)}
          </p>
        </div>

        {/* Active Agencies */}
        <div className="rounded-[8px] border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-humana-gold/30 animate-[fade-in-up_0.4s_ease-out_180ms_both]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
            {t.officeWs.dashboard.kpis.agencies}
          </span>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-humana-ink">
            {dashboard.agencies_count}
          </p>
          <p className="mt-1 text-[11px] text-humana-muted">
            {t.officeWs.dashboard.kpis.agenciesDetail(dashboard.countries_count)}
          </p>
        </div>

        {/* Published Retreats */}
        <div className="rounded-[8px] border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-humana-gold/30 animate-[fade-in-up_0.4s_ease-out_240ms_both]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
            {t.officeWs.dashboard.kpis.retreats}
          </span>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-humana-gold">
            {dashboard.published_retreats}
          </p>
          <p className="mt-1 text-[11px] text-humana-muted">
            {t.officeWs.dashboard.kpis.retreatsPending(dashboard.pending_retreats)}
          </p>
        </div>
      </div>

      {/* Stacked layout: Pending Approvals then Top Hotels */}
      <div className="flex flex-col gap-10">
        {/* Pending Approvals */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[15px] font-semibold text-humana-ink">
                {t.officeWs.dashboard.pendingApprovals}
              </h2>
              {pendingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-1.5 text-[11px] font-bold text-amber-700">
                  {pendingCount}
                </span>
              )}
            </div>
            <Link
              href="/office/network"
              className="text-[12px] font-semibold text-humana-gold transition-opacity hover:opacity-70"
            >
              {t.officeWs.dashboard.pendingApprovalsViewAll} &rarr;
            </Link>
          </div>

          {dashboard.pending_organizations.length === 0 ? (
            <div className="rounded-[8px] border border-humana-line bg-white px-5 py-10 text-center">
              <svg className="mx-auto h-8 w-8 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-3 text-[14px] text-humana-subtle">{t.officeWs.dashboard.noPending}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 stagger-children">
              {dashboard.pending_organizations.map((org) => (
                <div
                  key={org.id}
                  className="rounded-[8px] border border-humana-line bg-white px-5 py-4 transition-all duration-200 hover:border-humana-gold/30 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Type icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${org.kind === "hotel" ? "bg-blue-50" : "bg-purple-50"}`}>
                      {org.kind === "hotel" ? (
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-humana-ink truncate">{org.name}</p>
                        <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${KIND_COLORS[org.kind] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                          {t.officeWs.dashboard.pendingKind[org.kind as "hotel" | "agency"] || org.kind}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-humana-muted truncate">
                        {[org.city, org.country].filter(Boolean).join(", ")}
                        {org.contact_email ? ` · ${org.contact_email}` : ""}
                      </p>
                    </div>

                    {/* Request approval button */}
                    <button
                      onClick={() => openContactForOrg(org)}
                      className="ml-2 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-humana-gold/30 bg-humana-gold/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-humana-gold transition-all hover:bg-humana-gold hover:text-white"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {t.officeWs.dashboard.requestApproval}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Hotels by Revenue */}
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-humana-ink">
                {t.officeWs.dashboard.topHotels}
              </h2>
              <Tooltip text={t.officeWs.dashboard.topHotelsTooltip} />
            </span>
            <Link
              href="/office/bookings"
              className="text-[12px] font-semibold text-humana-gold transition-opacity hover:opacity-70"
            >
              {t.officeWs.dashboard.topHotelsReport} &rarr;
            </Link>
          </div>

          {dashboard.top_hotels.length === 0 ? (
            <div className="rounded-[8px] border border-humana-line bg-white px-5 py-10 text-center">
              <p className="text-[14px] text-humana-subtle">{t.officeWs.dashboard.noHotels}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {dashboard.top_hotels.map((hotel, i) => {
                const rank = String(i + 1).padStart(2, "0");
                const occupancy = hotel.booking_count > 0
                  ? Math.min(Math.round((hotel.booking_count / Math.max(hotel.booking_count + 2, 5)) * 100), 98)
                  : 0;
                const occColor = occupancy >= 80 ? "text-emerald-600" : occupancy >= 60 ? "text-humana-gold" : "text-humana-muted";

                return (
                  <div
                    key={hotel.id}
                    className="rounded-[8px] border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-humana-gold/30"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[28px] font-light leading-none text-humana-gold/40">
                        {rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-humana-ink truncate">{hotel.name}</p>
                        <p className="mt-0.5 text-[12px] text-humana-muted truncate">{hotel.city}, {hotel.country}</p>
                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-[15px] font-semibold text-humana-ink">
                            {fmt(hotel.total_revenue_cents)}
                          </span>
                          <span className={`text-[12px] font-semibold ${occColor}`}>
                            {occupancy}% {t.officeWs.dashboard.occupancy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Agencies by Volume */}
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-humana-ink">
                {t.officeWs.dashboard.topAgencies}
              </h2>
              <Tooltip text={t.officeWs.dashboard.topAgenciesTooltip} />
            </span>
            <Link
              href="/office/bookings"
              className="text-[12px] font-semibold text-humana-gold transition-opacity hover:opacity-70"
            >
              {t.officeWs.dashboard.topAgenciesReport} &rarr;
            </Link>
          </div>

          {dashboard.top_agencies.length === 0 ? (
            <div className="rounded-[8px] border border-humana-line bg-white px-5 py-10 text-center">
              <p className="text-[14px] text-humana-subtle">{t.officeWs.dashboard.noAgencies}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {dashboard.top_agencies.map((agency, i) => {
                const rank = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={agency.id}
                    className="rounded-[8px] border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-humana-gold/30"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[28px] font-light leading-none text-purple-300/60">
                        {rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-humana-ink truncate">{agency.name}</p>
                        <p className="mt-0.5 text-[12px] text-humana-muted truncate">
                          {[agency.city, agency.country].filter(Boolean).join(", ") || "–"}
                        </p>
                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-[15px] font-semibold text-humana-ink">
                            {fmt(agency.total_volume_cents)}
                          </span>
                          <span className="text-[12px] font-medium text-purple-600">
                            {agency.booking_count} {t.officeWs.dashboard.bookingsLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contact Admin Modal */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        org={contactOrg}
        t={t}
      />
    </div>
  );
}
