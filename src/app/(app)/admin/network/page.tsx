/** Admin Network — user table with tabs, kind filter, "..." actions menu, and review drawer. */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ReviewDrawer } from "@/components/admin/ReviewDrawer";
import { ApproveModal } from "@/components/admin/ApproveModal";
import { RejectModal } from "@/components/admin/RejectModal";
import type { User, PaginationMeta } from "@/lib/types";

type Tab = "all" | "active" | "pending" | "suspended";
type KindFilter = "all" | "hotel" | "agency" | "office";

const KIND_COLORS: Record<string, string> = {
  hotel: "bg-blue-50 text-blue-600",
  agency: "bg-amber-50 text-amber-600",
  office: "bg-emerald-50 text-emerald-600",
};

const KIND_LABELS: Record<string, Record<string, string>> = {
  hotel: { en: "Hotel", es: "Hotel", pt: "Hotel" },
  agency: { en: "Agency", es: "Agencia", pt: "Agência" },
  office: { en: "Office", es: "Oficina", pt: "Escritório" },
};

export default function NetworkPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "all";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, per_page: 30, total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [suspendedCount, setSuspendedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Three-dot menu
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuContainerRef = useRef<HTMLTableCellElement | null>(null);

  // Modal/drawer state
  const [reviewUser, setReviewUser] = useState<User | null>(null);
  const [approveUser, setApproveUser] = useState<User | null>(null);
  const [rejectUser, setRejectUser] = useState<User | null>(null);

  // Hotel feedback modal
  const [feedbackUser, setFeedbackUser] = useState<User | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Delete confirmation modal
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ── Data fetching ── */

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        per_page: 30,
        q: search || undefined,
        status: tab !== "all" ? tab : undefined,
        kind: kindFilter !== "all" ? kindFilter : undefined,
      };
      const res = await adminApi.listUsers(params);
      setUsers(res.users);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [tab, search, kindFilter]);

  const fetchCounts = useCallback(async () => {
    try {
      const [allRes, pendingRes, activeRes, suspendedRes] = await Promise.all([
        adminApi.listUsers({ per_page: 1 }),
        adminApi.listUsers({ status: "pending", per_page: 1 }),
        adminApi.listUsers({ status: "active", per_page: 1 }),
        adminApi.listUsers({ status: "suspended", per_page: 1 }),
      ]);
      setTotalCount(allRes.meta.total);
      setPendingCount(pendingRes.meta.total);
      setActiveCount(activeRes.meta.total);
      setSuspendedCount(suspendedRes.meta.total);
    } catch {
      // fail silently
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCounts();
  }, [fetchUsers, fetchCounts]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  // Close menu on any click outside
  useEffect(() => {
    if (openMenuId === null) return;
    function close(e: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenuId]);

  /* ── Handlers ── */

  function handleRefresh() {
    fetchUsers(meta.page);
    fetchCounts();
  }

  async function handleSuspend(user: User) {
    await adminApi.suspendUser(user.id);
    setReviewUser(null);
    setOpenMenuId(null);
    handleRefresh();
  }

  async function handleReactivate(user: User) {
    await adminApi.reactivateUser(user.id);
    setReviewUser(null);
    setOpenMenuId(null);
    handleRefresh();
  }

  function openFeedbackModal(user: User) {
    setOpenMenuId(null);
    setFeedbackUser(user);
    setFeedbackText("");
    setFeedbackSent(false);
  }

  async function handleSendFeedback() {
    if (!feedbackUser || !feedbackText.trim()) return;
    setSendingFeedback(true);
    try {
      await adminApi.rejectUser(feedbackUser.id, feedbackText.trim());
      setFeedbackSent(true);
      setTimeout(() => { setFeedbackUser(null); handleRefresh(); }, 1500);
    } finally {
      setSendingFeedback(false);
    }
  }

  function openDeleteModal(user: User) {
    setOpenMenuId(null);
    setDeleteUser(user);
    setDeleteConfirmInput("");
  }

  async function handleDeleteUser() {
    if (!deleteUser || deleteConfirmInput !== deleteUser.email) return;
    setDeleting(true);
    try {
      await adminApi.deleteUser(deleteUser.id);
      setDeleteUser(null);
      handleRefresh();
    } finally {
      setDeleting(false);
    }
  }

  /* ── Helpers ── */

  function getRoleSubtitle(user: User): string {
    const orgKind = user.organization?.kind;
    if (orgKind === "hotel") return locale === "es" ? "Gerente de Hotel" : locale === "pt" ? "Gerente de Hotel" : "Hotel Manager";
    if (orgKind === "agency") return locale === "es" ? "Agente de Viajes" : locale === "pt" ? "Agente de Viagens" : "Travel Agent";
    if (orgKind === "office") return locale === "es" ? "Gerente de Oficina" : locale === "pt" ? "Gerente de Escritório" : "Office Manager";
    return user.role;
  }

  function getKindBadge(kind?: string) {
    if (!kind || kind === "admin") return null;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] leading-none ${KIND_COLORS[kind] || "bg-humana-stone text-humana-muted"}`}>
        {KIND_LABELS[kind]?.[locale] || kind}
      </span>
    );
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString(locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  function formatLastLogin(dateStr: string | null): string {
    if (!dateStr) return "–";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diffMs / 3_600_000);
    if (h < 1) return locale === "es" ? "Ahora" : locale === "pt" ? "Agora" : "Just now";
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d`;
    return new Date(dateStr).toLocaleDateString(locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US", {
      day: "numeric", month: "short",
    });
  }

  function getInitials(name?: string): string {
    return name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  }

  /** Context menu items — differ by status and org kind */
  function getMenuItems(user: User): { label: string; onClick: () => void; danger?: boolean; divider?: boolean }[] {
    const items: { label: string; onClick: () => void; danger?: boolean; divider?: boolean }[] = [];
    const isHotel = user.organization?.kind === "hotel";

    if (user.status === "pending") {
      // Pending: Approve, Reject (+ Send Feedback for hotels)
      items.push({ label: t.admin.network.approve, onClick: () => { setOpenMenuId(null); setApproveUser(user); } });
      items.push({ label: t.admin.network.reject, onClick: () => { setOpenMenuId(null); setRejectUser(user); } });
      if (isHotel) {
        items.push({ label: t.admin.network.sendFeedback, onClick: () => openFeedbackModal(user) });
      }
    }

    if (user.status === "active") {
      // Active: Suspend, Delete
      items.push({ label: t.admin.network.suspend, onClick: () => { setOpenMenuId(null); handleSuspend(user); }, danger: true });
      items.push({ label: t.admin.network.deleteUser, onClick: () => openDeleteModal(user), danger: true });
    }

    if (user.status === "suspended" || user.status === "rejected") {
      // Suspended/Rejected: Reactivate, Delete
      items.push({ label: t.admin.network.reactivate, onClick: () => { setOpenMenuId(null); handleReactivate(user); } });
      items.push({ label: t.admin.network.deleteUser, onClick: () => openDeleteModal(user), danger: true, divider: true });
    }

    return items;
  }

  /* ── Derived ── */

  const tabItems: { key: Tab; label: string; count: number; badge?: boolean }[] = [
    { key: "all", label: t.admin.network.tabs.all, count: totalCount },
    { key: "active", label: t.admin.network.tabs.active, count: activeCount },
    { key: "pending", label: t.admin.network.tabs.pending, count: pendingCount, badge: pendingCount > 0 },
    { key: "suspended", label: t.admin.network.tabs.suspended, count: suspendedCount },
  ];

  const kindChips: { key: KindFilter; label: string }[] = [
    { key: "all", label: t.admin.network.kindAll },
    { key: "hotel", label: KIND_LABELS.hotel[locale] || "Hotel" },
    { key: "agency", label: KIND_LABELS.agency[locale] || "Agency" },
    { key: "office", label: KIND_LABELS.office[locale] || "Office" },
  ];

  const from = meta.total > 0 ? (meta.page - 1) * meta.per_page + 1 : 0;
  const to = Math.min(meta.page * meta.per_page, meta.total);

  /* ── Render ── */

  return (
    <div className="mx-auto max-w-[1400px] px-16 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[12px] animate-[fade-in-up_0.4s_ease-out]">
        <Link href="/admin/dashboard" className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink">
          Dashboard
        </Link>
        <span className="text-humana-subtle">&rsaquo;</span>
        <span className="font-medium text-humana-ink">{t.admin.nav.network}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
        <div>
          <h1 className="text-[28px] font-light tracking-[-0.01em] text-humana-ink">{t.admin.network.title}</h1>
          <p className="mt-1 text-[14px] text-humana-muted">
            {t.admin.network.subtitle} {totalCount} total {t.admin.network.showingOf}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.admin.network.searchPlaceholder}
              className="w-[220px] rounded-lg border border-humana-line bg-white py-2.5 pl-10 pr-4 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>
          <button
            onClick={() => router.push("/admin/network/create")}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-humana-ink px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black hover:shadow-lg"
          >
            {t.admin.network.createUser}
          </button>
        </div>
      </div>

      {/* Tabs + Kind filter */}
      <div className="mb-6 flex items-center justify-between border-b border-humana-line animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
        <div className="flex gap-1">
          {tabItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`cursor-pointer relative flex items-center gap-1.5 px-5 py-3 text-[13px] font-medium transition-all duration-200 ${
                tab === item.key ? "text-humana-ink" : "text-humana-muted hover:text-humana-ink"
              }`}
            >
              {item.label}
              {item.badge ? (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-humana-gold px-1.5 text-[10px] font-bold text-white">
                  {item.count}
                </span>
              ) : (
                <span className="text-[13px] text-humana-muted">({item.count})</span>
              )}
              {tab === item.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-humana-gold animate-[shimmer_0.5s_ease-out]" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-humana-muted">{t.admin.network.kindFilter}:</span>
          {kindChips.map((item) => (
            <button
              key={item.key}
              onClick={() => setKindFilter(item.key)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                kindFilter === item.key
                  ? "bg-humana-ink text-white"
                  : "border border-humana-line bg-white text-humana-muted hover:border-humana-gold/40 hover:text-humana-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-humana-line bg-white animate-[fade-in-up_0.4s_ease-out_0.15s_both]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-[14px] text-humana-muted">{t.admin.network.noResults}</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-humana-line">
                  <th className="py-3 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.user}</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.organization}</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.type}</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.status}</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.invitedBy}</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.registered}</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.network.table.lastLogin}</th>
                  <th className="py-3 pl-3 pr-6 w-12"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => {
                  const menuItems = getMenuItems(user);
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
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-humana-ink">{user.name}</p>
                            <p className="truncate text-[11px] text-humana-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="px-3 py-3.5">
                        <p className="truncate text-[13px] text-humana-ink">{user.organization?.name || "--"}</p>
                        <p className="truncate text-[11px] text-humana-subtle">{getRoleSubtitle(user)}</p>
                      </td>

                      {/* Type */}
                      <td className="px-3 py-3.5">{getKindBadge(user.organization?.kind)}</td>

                      {/* Status */}
                      <td className="px-3 py-3.5"><StatusBadge status={user.status} /></td>

                      {/* Invited by */}
                      <td className="px-3 py-3.5 text-[13px] text-humana-muted whitespace-nowrap">
                        {user.invited_by_organization && user.invited_by_organization.kind !== "admin"
                          ? user.invited_by_organization.name
                          : "–"}
                      </td>

                      {/* Registered */}
                      <td className="px-3 py-3.5 text-[13px] text-humana-muted whitespace-nowrap">{formatDate(user.created_at)}</td>

                      {/* Last login */}
                      <td className="px-3 py-3.5 text-[13px] text-humana-muted whitespace-nowrap">{formatLastLogin(user.last_login_at)}</td>

                      {/* "..." menu */}
                      <td
                        className="relative py-3.5 pl-3 pr-6"
                        ref={openMenuId === user.id ? menuContainerRef : undefined}
                      >
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="4" r="1.8" />
                            <circle cx="10" cy="10" r="1.8" />
                            <circle cx="10" cy="16" r="1.8" />
                          </svg>
                        </button>

                        {openMenuId === user.id && (
                          <div className="absolute right-6 top-full z-30 mt-0.5 w-48 rounded-lg border border-humana-line bg-white py-1 shadow-xl animate-[fade-in-scale_0.12s_ease-out]">
                            {menuItems.map((item, idx) => (
                              <div key={idx}>
                                {item.divider && <div className="my-1 border-t border-humana-line" />}
                                <button
                                  onClick={item.onClick}
                                  className={`cursor-pointer flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors ${
                                    item.danger ? "text-red-600 hover:bg-red-50" : "text-humana-ink hover:bg-humana-stone"
                                  }`}
                                >
                                  {item.danger && item.label === t.admin.network.deleteUser ? (
                                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  ) : item.danger ? (
                                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                  ) : null}
                                  {item.label}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-humana-line px-6 py-3.5">
              <span className="text-[12px] text-humana-muted">
                {meta.total > 0
                  ? `${t.admin.network.showing} ${from}–${to} of ${meta.total} ${t.admin.network.showingOf}`
                  : `0 ${t.admin.network.showingOf}`}
              </span>
              {meta.total_pages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fetchUsers(meta.page - 1)}
                    disabled={meta.page <= 1}
                    className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-30"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(meta.total_pages, 5) }, (_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => fetchUsers(p)}
                        className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-[13px] transition-all duration-200 ${
                          p === meta.page ? "bg-humana-ink font-medium text-white" : "text-humana-muted hover:bg-humana-stone"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => fetchUsers(meta.page + 1)}
                    disabled={meta.page >= meta.total_pages}
                    className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-30"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Drawers & Modals ── */}

      <ReviewDrawer
        open={!!reviewUser}
        user={reviewUser}
        onClose={() => setReviewUser(null)}
        onApprove={(u) => { setReviewUser(null); setApproveUser(u); }}
        onReject={(u) => { setReviewUser(null); setRejectUser(u); }}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
      />
      <ApproveModal open={!!approveUser} user={approveUser} onClose={() => setApproveUser(null)} onSuccess={handleRefresh} />
      <RejectModal open={!!rejectUser} user={rejectUser} onClose={() => setRejectUser(null)} onSuccess={handleRefresh} />

      {/* Hotel Feedback Modal */}
      {feedbackUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]" onClick={() => !sendingFeedback && setFeedbackUser(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-[480px] rounded-xl bg-white p-8 shadow-2xl animate-[modal-enter_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            {feedbackSent ? (
              <div className="flex flex-col items-center py-4 animate-[fade-in-up_0.3s_ease-out]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <svg className="h-7 w-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-humana-ink">
                  {locale === "es" ? "Comentarios enviados" : locale === "pt" ? "Feedback enviado" : "Feedback sent"}
                </p>
                <p className="mt-1 text-[13px] text-humana-muted">
                  {locale === "es" ? `Se envió un email a ${feedbackUser.email}` : locale === "pt" ? `Um email foi enviado para ${feedbackUser.email}` : `An email was sent to ${feedbackUser.email}`}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    {locale === "es" ? "REVISIÓN DE HOTEL" : locale === "pt" ? "REVISÃO DE HOTEL" : "HOTEL REVIEW"}
                  </span>
                  <h2 className="mt-2 text-[18px] font-semibold text-humana-ink">{t.admin.network.sendFeedback}</h2>
                  <p className="mt-1 text-[13px] text-humana-muted">
                    {locale === "es"
                      ? `Envía comentarios a ${feedbackUser.name} sobre los cambios necesarios en su publicación.`
                      : locale === "pt"
                        ? `Envie feedback para ${feedbackUser.name} sobre as mudanças necessárias na publicação.`
                        : `Send feedback to ${feedbackUser.name} about changes needed in their listing.`}
                  </p>
                </div>
                <div className="mb-5 flex items-center gap-3 rounded-lg bg-humana-stone px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-humana-gold/10 text-[10px] font-semibold text-humana-gold">
                    {getInitials(feedbackUser.name)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-humana-ink">{feedbackUser.name}</p>
                    <p className="text-[11px] text-humana-muted">{feedbackUser.email}</p>
                  </div>
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={locale === "es" ? "Describe los cambios que necesita hacer en su publicación..." : locale === "pt" ? "Descreva as mudanças que precisam ser feitas na publicação..." : "Describe the changes needed in their listing..."}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-humana-line bg-white px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
                <p className="mt-3 text-[11px] text-humana-subtle">
                  {locale === "es" ? "Este mensaje se enviará por email al hotel con las acciones requeridas." : locale === "pt" ? "Esta mensagem será enviada por email ao hotel com as ações necessárias." : "This message will be sent via email to the hotel with the required actions."}
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={() => setFeedbackUser(null)} className="cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone">
                    {locale === "es" ? "Cancelar" : locale === "pt" ? "Cancelar" : "Cancel"}
                  </button>
                  <button onClick={handleSendFeedback} disabled={!feedbackText.trim() || sendingFeedback} className="cursor-pointer rounded-lg bg-humana-ink px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-black disabled:opacity-50">
                    {sendingFeedback ? "..." : t.admin.network.sendFeedback}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]" onClick={() => !deleting && setDeleteUser(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-[460px] rounded-xl bg-white p-8 shadow-2xl animate-[modal-enter_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            {/* Warning icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="mb-2 text-[18px] font-semibold text-humana-ink">{t.admin.network.deleteTitle}</h2>
            <p className="mb-5 text-[13px] leading-relaxed text-humana-muted">{t.admin.network.deleteWarning}</p>

            {/* User card */}
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50/50 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-semibold text-red-600">
                {getInitials(deleteUser.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-humana-ink">{deleteUser.name}</p>
                <p className="truncate text-[11px] text-humana-muted">{deleteUser.email}</p>
              </div>
            </div>

            {/* Email confirmation */}
            <div className="mb-6">
              <p className="mb-2 text-[13px] font-medium text-humana-ink">{t.admin.network.deleteConfirmHint(deleteUser.email)}</p>
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={t.admin.network.deleteConfirmPlaceholder}
                className="w-full rounded-lg border border-humana-line bg-white px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-red-400"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteUser(null)} disabled={deleting} className="cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-50">
                {locale === "es" ? "Cancelar" : locale === "pt" ? "Cancelar" : "Cancel"}
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteConfirmInput !== deleteUser.email || deleting}
                className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? t.admin.network.deleting : t.admin.network.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modal-enter {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
