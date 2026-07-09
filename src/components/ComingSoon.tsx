/** Coming Soon landing for non-admin users. */
"use client";

import Image from "next/image";
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
          {/* Logo */}
          <div className="mb-8 flex justify-center animate-[pulse-gold_3s_ease-in-out_infinite]">
            <Image src="/brand/isotipo.png" alt="HUMANA" width={56} height={56} />
          </div>

          {/* Eyebrow */}
          <div className="mb-6 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.comingSoon.eyebrow}
            </span>
            <h1 className="mt-2 text-[24px] font-light tracking-[-0.01em] text-humana-ink">
              {t.comingSoon.title}, {user?.name}
            </h1>
            <p className="mt-2 text-[14px] text-humana-muted leading-relaxed">
              {t.comingSoon.subtitle(roleLabel)}
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

          {/* Logout */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={logout}
              className="text-[12px] font-medium text-humana-muted transition-colors hover:text-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
