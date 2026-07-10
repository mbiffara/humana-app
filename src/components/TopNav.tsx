"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher, useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";

const badgeTextColors: Record<string, string> = {
  office: "text-emerald-400",
  agency: "text-amber-400",
  hotel: "text-blue-400",
};

export function TopNav() {
  const { t } = useLocale();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const orgKind = user?.organization?.kind || "agency";
  const badgeLabel = t.onboarding.header[orgKind as keyof typeof t.onboarding.header] || orgKind;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-humana-line bg-white/95 px-16 py-5 backdrop-blur-sm animate-[fade-in-down_0.4s_ease-out]">
      <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/isotipo.png" alt="HUMANA" width={36} height={36} />
        <Image src="/brand/humana-text.svg" alt="" width={160} height={50} className="h-[34px] w-auto" priority />
        <span className={`ml-1 rounded bg-humana-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${badgeTextColors[orgKind] || "text-humana-gold"}`}>
          {badgeLabel}
        </span>
      </Link>

      <div className="flex items-center gap-5">
        <LanguageSwitcher />
        <span className="h-3.5 w-px bg-[#D8D4C8]" />
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-humana-gold">
            <span className="text-[12px] font-semibold text-white">{initials}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-humana-ink">{user?.name || t.nav.agencyName}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-humana-subtle">
              {user?.organization?.name || t.nav.agencyMeta}
            </span>
          </div>
          <button
            onClick={logout}
            className="ml-2 text-[12px] text-humana-muted transition-colors hover:text-red-600"
            title="Logout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
