"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { officeApi } from "@/lib/api/office";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Pagination } from "@/components/admin/Pagination";
import type { User, PaginationMeta } from "@/lib/types";

function HeaderTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <svg className="h-3 w-3 cursor-help text-humana-muted/40 transition-colors hover:text-humana-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
      {show && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-humana-ink px-3 py-2 text-[10px] leading-[14px] font-normal normal-case tracking-normal text-white shadow-lg animate-[fade-in-up_0.15s_ease-out]">
          {text}
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-humana-ink" />
        </span>
      )}
    </span>
  );
}

const KIND_COLORS: Record<string, string> = {
  hotel: "bg-blue-50 text-blue-600",
  agency: "bg-purple-50 text-purple-600",
};

export default function OfficeNetworkPage() {
  const { t, locale } = useLocale();
  const ts = t.officeWs.network;
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 20 };
      if (search) params.q = search;
      if (kindFilter) params.kind = kindFilter;
      const res = await officeApi.listUsers(params);
      setUsers(res.users);
      setMeta(res.meta);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search, kindFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "–";
    return new Date(dateStr).toLocaleDateString(
      locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US",
      { day: "numeric", month: "short", year: "numeric" },
    );
  }

  function getInitials(name?: string): string {
    return name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  }

  const kindTabs = [
    { label: ts.tabs.all, value: "" },
    { label: ts.tabs.hotels, value: "hotel" },
    { label: ts.tabs.agencies, value: "agency" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-12 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {ts.eyebrow}
          </span>
          <h1 className="mt-2 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
            {ts.title}
          </h1>
          <p className="mt-1 text-[15px] text-humana-muted">
            {ts.subtitle}
          </p>
        </div>
        <Link
          href="/office/network/create"
          className="cursor-pointer rounded-[6px] bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
        >
          {ts.createUser}
        </Link>
      </div>

      {/* Kind filter pills + Search */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {kindTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setKindFilter(tab.value); setPage(1); }}
              className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all ${
                kindFilter === tab.value
                  ? "bg-humana-ink text-white"
                  : "border border-humana-line text-humana-muted hover:border-humana-ink hover:text-humana-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-humana-subtle" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={ts.searchPlaceholder}
            className="w-64 rounded-[6px] border border-humana-line bg-white py-2.5 pl-10 pr-4 text-[14px] text-humana-ink placeholder-humana-subtle/50 outline-none transition-colors focus:border-humana-gold"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center">
          <svg className="mx-auto mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p className="text-[15px] text-humana-subtle">{ts.empty}</p>
          <p className="mt-1 text-[13px] text-humana-muted">{ts.emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="overflow-visible rounded-[8px] border border-humana-line bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-humana-line">
                  <th className="py-3 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                    <span className="inline-flex items-center gap-1.5">{ts.columns.name} <HeaderTooltip text={ts.tooltips.name} /></span>
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                    <span className="inline-flex items-center gap-1.5">{ts.columns.organization} <HeaderTooltip text={ts.tooltips.organization} /></span>
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                    <span className="inline-flex items-center gap-1.5">{ts.columns.type} <HeaderTooltip text={ts.tooltips.type} /></span>
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                    <span className="inline-flex items-center gap-1.5">{ts.columns.status} <HeaderTooltip text={ts.tooltips.status} /></span>
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                    <span className="inline-flex items-center gap-1.5">{ts.columns.invitedAt} <HeaderTooltip text={ts.tooltips.invitedAt} /></span>
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                    <span className="inline-flex items-center gap-1.5">{ts.columns.onboarding} <HeaderTooltip text={ts.tooltips.onboarding} /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => {
                  const orgKind = user.organization?.kind as "hotel" | "agency" | undefined;
                  const onboarded = !!user.organization?.onboarding_completed;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-humana-line/50 transition-colors hover:bg-humana-stone/30 animate-[fade-in-up_0.3s_ease-out_both]"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {/* User — avatar + name + email */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold/10 text-[11px] font-semibold text-humana-gold">
                            {onboarded ? getInitials(user.name) : "–"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-humana-ink">
                              {onboarded ? user.name : "–"}
                            </p>
                            <p className="truncate text-[11px] text-humana-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="px-3 py-3.5">
                        <p className="truncate text-[13px] text-humana-ink">
                          {onboarded ? (user.organization?.name || "–") : "–"}
                        </p>
                        <p className="truncate text-[11px] text-humana-subtle">
                          {orgKind && ts.roleLabels[orgKind] ? ts.roleLabels[orgKind] : user.role}
                        </p>
                      </td>

                      {/* Type badge */}
                      <td className="px-3 py-3.5">
                        {orgKind && (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${KIND_COLORS[orgKind] || "bg-gray-50 text-gray-600"}`}>
                            {orgKind === "hotel" && (
                              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
                              </svg>
                            )}
                            {orgKind === "agency" && (
                              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                              </svg>
                            )}
                            {ts.kindLabels[orgKind] || orgKind}
                          </span>
                        )}
                      </td>

                      {/* Status — translated */}
                      <td className="px-3 py-3.5">
                        <StatusBadge
                          status={user.status}
                          label={ts.status[user.status as keyof typeof ts.status] || user.status}
                        />
                      </td>

                      {/* Invite date */}
                      <td className="px-3 py-3.5 text-[13px] text-humana-muted whitespace-nowrap">
                        {formatDate(user.invited_at ?? user.created_at)}
                      </td>

                      {/* Onboarding */}
                      <td className="px-3 py-3.5">
                        {onboarded ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] leading-none text-emerald-600">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {ts.onboardingComplete}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] leading-none text-amber-600">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {ts.onboardingPending}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
  );
}
