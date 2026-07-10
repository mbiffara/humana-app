/** Coming Soon landing for non-admin users. */
"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/admin/StatusBadge";

export function ComingSoon() {
  const { t } = useLocale();
  const { user, logout } = useAuth();

  const roleLabel =
    user?.organization?.kind === "agency"
      ? "Travel Agency"
      : user?.organization?.kind === "hotel"
        ? "Hotel Partner"
        : user?.organization?.kind === "office"
          ? "Regional Office"
          : "Member";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-humana-stone px-4 py-16">
      <div className="w-full max-w-[520px] animate-[fade-in-up_0.6s_ease-out]">
        <div className="rounded-2xl bg-white p-10 shadow-sm">
          {/* Eyebrow */}
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
              </svg>
              {t.comingSoon.eyebrow}
            </span>
            <h1 className="mt-2 text-[24px] font-light tracking-[-0.01em] text-humana-ink">
              {t.comingSoon.title}, {user?.name}
            </h1>
            <p className="mt-2 text-[14px] font-medium text-humana-ink leading-relaxed">
              {t.comingSoon.subtitle(roleLabel)}
            </p>
            <p className="mt-3 text-[13px] text-humana-muted leading-relaxed">
              {t.comingSoon.description}
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-humana-line" />

          {/* Account info */}
          <div className="flex flex-col gap-4 animate-[fade-in-up_0.4s_ease-out_0.3s_both]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
                {t.comingSoon.status}
              </span>
              <StatusBadge status={user?.status || "active"} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[12px] text-humana-muted">Role</span>
              <span className="text-[12px] font-medium text-humana-ink capitalize">{user?.role}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[12px] text-humana-muted">Organization</span>
              <span className="text-[12px] font-medium text-humana-ink">{user?.organization?.name}</span>
            </div>

            {user?.email && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-humana-muted">{t.comingSoon.contact}</span>
                <span className="text-[12px] font-medium text-humana-ink">{user.email}</span>
              </div>
            )}
          </div>

          {/* Contact + Logout */}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href="mailto:info@humana.global"
              className="tooltip relative flex w-full items-center justify-center gap-2 rounded-lg bg-humana-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black"
              data-tooltip="info@humana.global"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {t.comingSoon.contactCta}
            </a>
            <button
              onClick={logout}
              className="cursor-pointer w-full rounded-lg border border-humana-line px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-all duration-200 hover:border-humana-ink hover:text-humana-ink"
            >
              {t.comingSoon.signOut}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
