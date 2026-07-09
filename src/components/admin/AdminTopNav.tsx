/** Admin-specific top navigation with gold accent and admin badge. */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher, useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";

export function AdminTopNav() {
  const { t } = useLocale();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { label: t.admin.nav.overview, href: "/admin/dashboard" },
    { label: t.admin.nav.network, href: "/admin/network" },
    { label: t.admin.nav.subscriptions, href: "/admin/subscriptions" },
    { label: t.admin.nav.settings, href: "/admin/settings" },
  ];

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <nav className="sticky top-0 z-50 border-b border-humana-line bg-white/95 backdrop-blur-sm animate-[fade-in-down_0.4s_ease-out]">
    <div className="mx-auto flex max-w-[1480px] items-center justify-between px-10 py-5">
      {/* Left: Logo + Admin badge */}
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <Image
          src="/brand/isotipo.png"
          alt="HUMANA"
          width={36}
          height={36}
          priority
        />
        <Image
          src="/brand/humana-text.svg"
          alt=""
          width={160}
          height={50}
          className="h-[34px] w-auto"
          priority
        />
        <span className="ml-1 rounded bg-humana-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-humana-gold">
          {t.admin.badge}
        </span>
      </Link>

      {/* Center: Nav links */}
      <div className="flex items-center gap-10">
        {links.map((link) => {
          const isActive =
            link.href !== "#" && pathname.startsWith(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative pb-1 text-[14px] transition-all duration-200 ${
                isActive
                  ? "font-medium text-humana-ink"
                  : "font-normal text-humana-muted hover:text-humana-ink"
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-humana-gold animate-[shimmer_1s_ease-out]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: Language + User */}
      <div className="flex items-center gap-5">
        <LanguageSwitcher />
        <span className="h-3.5 w-px bg-[#D8D4C8]" />

        <div className="flex items-center gap-2.5">
          <Link href="/admin/settings" className="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-humana-gold transition-transform hover:scale-105">
              <span className="text-[12px] font-semibold text-white">
                {initials}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-humana-ink">
                {user?.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                HUMANA ADMIN
              </span>
            </div>
          </Link>
          <button
            onClick={logout}
            className="ml-3 cursor-pointer text-[12px] text-humana-muted transition-colors hover:text-red-600"
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
    </div>
    </nav>
  );
}
