"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher, useLocale } from "@/i18n/LocaleProvider";

export function TopNav() {
  const { t } = useLocale();
  const pathname = usePathname();

  const links = [
    { label: t.nav.discover, href: "/dashboard" },
    { label: t.nav.bookings, href: "#" },
    { label: t.nav.clients, href: "#" },
    { label: t.nav.myRetreats, href: "#" },
    { label: t.nav.billing, href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-humana-line bg-white/95 px-16 py-5 backdrop-blur-sm">
      <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
        <Image src="/brand/isotipo.png" alt="HUMANA" width={36} height={36} priority />
        <Image src="/brand/humana-text.svg" alt="" width={160} height={50} className="h-[34px] w-auto" priority />
      </Link>

      <div className="flex items-center gap-10">
        {links.map((link) => {
          const isActive =
            link.href !== "#" && pathname.startsWith(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[14px] transition-colors duration-200 ${
                isActive
                  ? "font-medium text-humana-ink"
                  : "font-normal text-humana-muted hover:text-humana-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        <LanguageSwitcher />
        <span className="h-3.5 w-px bg-[#D8D4C8]" />
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-humana-gold">
            <span className="text-[12px] font-semibold text-white">VE</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-humana-ink">{t.nav.agencyName}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-humana-subtle">
              {t.nav.agencyMeta}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
