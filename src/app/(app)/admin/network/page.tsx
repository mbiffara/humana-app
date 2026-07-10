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
import { SuspendModal } from "@/components/admin/SuspendModal";
import { ReactivateModal } from "@/components/admin/ReactivateModal";
import type { User, PaginationMeta } from "@/lib/types";

type Tab = "all" | "active" | "pending" | "suspended";
type KindFilter = "all" | "hotel" | "agency" | "office";

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
  const [menuPos, setMenuPos] = useState<{ top: number; right: number; openUp: boolean }>({ top: 0, right: 0, openUp: false });
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Modal/drawer state
  const [reviewUser, setReviewUser] = useState<User | null>(null);
  const [approveUser, setApproveUser] = useState<User | null>(null);
  const [rejectUser, setRejectUser] = useState<User | null>(null);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [reactivateUser, setReactivateUser] = useState<User | null>(null);

  // Hotel feedback modal
  const [feedbackUser, setFeedbackUser] = useState<User | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Delete confirmation modal
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Resend invitation toast + cooldown (2 min per invitation)
  const [resendToast, setResendToast] = useState<{ message: string; success: boolean } | null>(null);
  const [resendCooldowns, setResendCooldowns] = useState<Record<number, number>>({});

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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  function handleSuspend(user: User) {
    setReviewUser(null);
    setOpenMenuId(null);
    setSuspendUser(user);
  }

  function handleReactivate(user: User) {
    setReviewUser(null);
    setOpenMenuId(null);
    setReactivateUser(user);
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
      await adminApi.sendFeedback(feedbackUser.id, feedbackText.trim());
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
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeleting(false);
    }
  }

  function isResendOnCooldown(invitationId: number): boolean {
    const until = resendCooldowns[invitationId];
    return !!until && Date.now() < until;
  }

  async function handleResendInvitation(user: User) {
    const invId = user.invitation_id!;
    if (isResendOnCooldown(invId)) return;
    setOpenMenuId(null);
    try {
      await adminApi.resendInvitation(invId);
      setResendCooldowns((prev) => ({ ...prev, [invId]: Date.now() + 2 * 60 * 1000 }));
      setResendToast({ message: `${t.admin.network.resendSuccess}. ${t.admin.network.resendCooldown}`, success: true });
    } catch {
      setResendToast({ message: t.admin.network.resendFailed, success: false });
    }
    setTimeout(() => setResendToast(null), 3000);
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
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${KIND_COLORS[kind] || "bg-humana-stone text-humana-muted"}`}>
        {kind === "hotel" && (
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
          </svg>
        )}
        {kind === "agency" && (
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        )}
        {kind === "office" && (
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        )}
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

  function getInitials(name?: string): string {
    return name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  }

  /** Context menu items — differ by status and org kind */
  function getMenuItems(user: User): { label: string; icon: string; onClick: () => void; danger?: boolean; divider?: boolean; disabled?: boolean }[] {
    const items: { label: string; icon: string; onClick: () => void; danger?: boolean; divider?: boolean; disabled?: boolean }[] = [];
    const isHotel = user.organization?.kind === "hotel";

    if (user.invitation_id && user.invitation_accepted === false) {
      const onCooldown = isResendOnCooldown(user.invitation_id);
      items.push({
        label: t.admin.network.resendInvitation,
        icon: "resend",
        onClick: () => handleResendInvitation(user),
        disabled: onCooldown,
      });
    }

    if (user.status === "pending") {
      const needsOnboarding = isHotel || user.organization?.kind === "office";
      const onboardingDone = !!user.organization?.onboarding_completed;
      const invitedByAdmin = user.invited_by_organization?.kind === "admin";

      // Hotels & offices: only show approve/reject/review after onboarding is complete
      if (!needsOnboarding || onboardingDone) {
        // Hotel preview button
        if (isHotel && user.organization?.hotel_id) {
          items.push({ label: t.admin.network.preview, icon: "preview", onClick: () => { setOpenMenuId(null); router.push(`/admin/network/preview/${user.organization.hotel_id}`); } });
        }
        items.push({ label: t.admin.network.approve, icon: "approve", onClick: () => { setOpenMenuId(null); setApproveUser(user); } });
        // "Send feedback" (review) is ONLY for hotels invited by admin
        if (isHotel && invitedByAdmin) {
          items.push({ label: t.admin.network.sendFeedback, icon: "feedback", onClick: () => openFeedbackModal(user) });
        } else {
          items.push({ label: t.admin.network.reject, icon: "reject", onClick: () => { setOpenMenuId(null); setRejectUser(user); } });
        }
      }
      // Always allow delete for pending users
      items.push({ label: t.admin.network.deleteUser, icon: "delete", onClick: () => openDeleteModal(user), danger: true, divider: items.length > 0 });
    }

    if (user.status === "active") {
      const hasAccepted = !user.invitation_id || user.invitation_accepted !== false;
      if (hasAccepted) {
        items.push({ label: t.admin.network.suspend, icon: "suspend", onClick: () => { setOpenMenuId(null); handleSuspend(user); }, danger: true });
      }
      items.push({ label: t.admin.network.deleteUser, icon: "delete", onClick: () => openDeleteModal(user), danger: true, divider: !hasAccepted ? false : true });
    }

    if (user.status === "suspended" || user.status === "rejected") {
      items.push({ label: t.admin.network.reactivate, icon: "reactivate", onClick: () => { setOpenMenuId(null); handleReactivate(user); } });
      items.push({ label: t.admin.network.deleteUser, icon: "delete", onClick: () => openDeleteModal(user), danger: true, divider: true });
    }

    return items;
  }

  /* ── Derived ── */

  const tabItems: { key: Tab; label: string; count: number; badge?: boolean }[] = [
    { key: "all", label: t.admin.network.tabs.all, count: totalCount },
    { key: "pending", label: t.admin.network.tabs.pending, count: pendingCount, badge: pendingCount > 0 },
    { key: "active", label: t.admin.network.tabs.active, count: activeCount },
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
      <div className="overflow-visible rounded-xl border border-humana-line bg-white animate-[fade-in-up_0.4s_ease-out_0.15s_both]">
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
                  <th className="py-3 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.user} <HeaderTooltip text={t.admin.network.table.tooltipUser} /></span></th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.organization} <HeaderTooltip text={t.admin.network.table.tooltipOrganization} /></span></th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.type} <HeaderTooltip text={t.admin.network.table.tooltipType} /></span></th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.status} <HeaderTooltip text={t.admin.network.table.tooltipStatus} /></span></th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.invitedBy} <HeaderTooltip text={t.admin.network.table.tooltipInvitedBy} /></span></th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.invitedAt} <HeaderTooltip text={t.admin.network.table.tooltipInvitedAt} /></span></th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted"><span className="inline-flex items-center gap-1.5">{t.admin.network.table.onboarding} <HeaderTooltip text={t.admin.network.table.tooltipOnboarding} /></span></th>
                  <th className="py-3 pl-3 pr-6 w-12"><span className="sr-only">{t.admin.network.table.actions}</span></th>
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
                            {user.organization?.onboarding_completed ? getInitials(user.name) : "–"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-humana-ink">{user.organization?.onboarding_completed ? user.name : "–"}</p>
                            <p className="truncate text-[11px] text-humana-muted">{user.email}</p>
                            {user.phone && <p className="truncate text-[11px] text-humana-subtle">{user.phone}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="px-3 py-3.5">
                        <p className="truncate text-[13px] text-humana-ink">{user.organization?.onboarding_completed ? (user.organization?.name || "–") : "–"}</p>
                        <p className="truncate text-[11px] text-humana-subtle">{getRoleSubtitle(user)}</p>
                      </td>

                      {/* Type */}
                      <td className="px-3 py-3.5">{getKindBadge(user.organization?.kind)}</td>

                      {/* Status */}
                      <td className="px-3 py-3.5"><StatusBadge status={user.status} label={t.admin.network.status[user.status as keyof typeof t.admin.network.status] || user.status} /></td>

                      {/* Invited by */}
                      <td className="px-3 py-3.5 text-[13px] text-humana-muted whitespace-nowrap">
                        {user.invited_by_organization
                          ? user.invited_by_organization.kind === "admin"
                            ? "HUMANA Admin"
                            : user.invited_by_organization.name
                          : "–"}
                      </td>

                      {/* Invited at */}
                      <td className="px-3 py-3.5 text-[13px] text-humana-muted whitespace-nowrap">{formatDate(user.invited_at ?? user.created_at)}</td>

                      {/* Onboarding */}
                      <td className="px-3 py-3.5">
                        {user.organization?.onboarding_completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] leading-none text-emerald-600">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {t.admin.network.onboardingComplete}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] leading-none text-amber-600">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {t.admin.network.onboardingPending}
                          </span>
                        )}
                      </td>

                      {/* "..." menu */}
                      <td className="py-3.5 pl-3 pr-6">
                        <button
                          onClick={(e) => {
                            if (openMenuId === user.id) {
                              setOpenMenuId(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const openUp = i >= users.length - 2;
                              setMenuPos({
                                top: openUp ? rect.top : rect.bottom + 6,
                                right: window.innerWidth - rect.left + 8,
                                openUp,
                              });
                              setOpenMenuId(user.id);
                            }
                          }}
                          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-humana-muted transition-colors hover:bg-humana-stone"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="4" r="1.8" />
                            <circle cx="10" cy="10" r="1.8" />
                            <circle cx="10" cy="16" r="1.8" />
                          </svg>
                        </button>
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

      {/* ── Fixed dropdown menu (rendered outside table to avoid overflow/z-index issues) ── */}
      {openMenuId !== null && (() => {
        const menuUser = users.find((u) => u.id === openMenuId);
        if (!menuUser) return null;
        const items = getMenuItems(menuUser);
        return (
          <div
            ref={menuRef}
            className="fixed z-[9999] w-52 rounded-xl border border-humana-line bg-white py-1.5 shadow-2xl ring-1 ring-black/5 animate-[fade-in-scale_0.12s_ease-out]"
            style={{
              top: menuPos.openUp ? undefined : menuPos.top,
              bottom: menuPos.openUp ? `${window.innerHeight - menuPos.top}px` : undefined,
              right: menuPos.right,
            }}
          >
            {items.map((item, idx) => (
              <div key={idx}>
                {item.divider && <div className="my-1 border-t border-humana-line" />}
                <button
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] transition-colors ${
                    item.disabled
                      ? "cursor-not-allowed opacity-40"
                      : item.danger
                        ? "cursor-pointer text-red-600 hover:bg-red-50"
                        : "cursor-pointer text-humana-ink hover:bg-humana-stone"
                  }`}
                >
                  <MenuIcon type={item.icon} danger={item.danger} />
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Drawers & Modals ── */}

      <ReviewDrawer
        open={!!reviewUser}
        user={reviewUser}
        onClose={() => setReviewUser(null)}
        onApprove={(u) => { setReviewUser(null); setApproveUser(u); }}
        onReject={(u) => {
          setReviewUser(null);
          const isAdminInvitedHotel = u.organization?.kind === "hotel" && u.invited_by_organization?.kind === "admin";
          if (isAdminInvitedHotel) {
            openFeedbackModal(u);
          } else {
            setRejectUser(u);
          }
        }}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
      />
      <ApproveModal open={!!approveUser} user={approveUser} onClose={() => setApproveUser(null)} onSuccess={handleRefresh} />
      <RejectModal open={!!rejectUser} user={rejectUser} onClose={() => setRejectUser(null)} onSuccess={handleRefresh} />
      <SuspendModal open={!!suspendUser} user={suspendUser} onClose={() => setSuspendUser(null)} onSuccess={handleRefresh} />
      <ReactivateModal open={!!reactivateUser} user={reactivateUser} onClose={() => setReactivateUser(null)} onSuccess={handleRefresh} />

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

            <div className="flex items-center gap-3">
              <button onClick={() => setDeleteUser(null)} disabled={deleting} className="flex-1 cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-50 text-center justify-center">
                {locale === "es" ? "Cancelar" : locale === "pt" ? "Cancelar" : "Cancel"}
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteConfirmInput !== deleteUser.email || deleting}
                className="flex-1 cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? t.admin.network.deleting : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    {t.admin.network.deleteConfirm}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resend Invitation Toast */}
      {resendToast && (
        <div className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg px-5 py-3 shadow-lg animate-[fade-in-up_0.3s_ease-out] ${resendToast.success ? "bg-emerald-600" : "bg-red-600"} text-white`}>
          <div className="flex items-center gap-2.5">
            {resendToast.success ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span className="text-[13px] font-medium">{resendToast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

/** SVG icon for dropdown menu items. */
function MenuIcon({ type, danger }: { type: string; danger?: boolean }) {
  const cls = `h-4 w-4 shrink-0 ${danger ? "text-red-400" : "text-humana-muted"}`;
  switch (type) {
    case "preview":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "approve":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "reject":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "feedback":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      );
    case "resend":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      );
    case "reactivate":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.985 4.356v4.992" />
        </svg>
      );
    case "suspend":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
    case "delete":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      );
    default:
      return null;
  }
}
