"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function SuspendedPage() {
  const { t } = useLocale();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-humana-stone">
      {/* ─── Top Bar ─── */}
      <nav className="sticky top-0 z-50 flex items-center justify-center border-b border-humana-line bg-white/95 px-16 py-4 backdrop-blur-sm">
        <Image
          src="/brand/isotipo.png"
          alt="HUMANA"
          width={32}
          height={32}
          priority
        />
      </nav>

      {/* ─── Content ─── */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[560px] text-center animate-[fade-in-up_0.6s_ease-out]">
          {/* Warning icon */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 animate-[fade-in-up_0.5s_ease-out_0.05s_both]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b91c1c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Gold accent line */}
          <div className="mx-auto mb-8 h-px w-16 bg-humana-gold animate-[fade-in-up_0.5s_ease-out_0.1s_both]" />

          {/* Headline */}
          <h1 className="mb-4 text-[32px] font-light tracking-[-0.02em] text-humana-ink leading-[1.2] animate-[fade-in-up_0.5s_ease-out_0.15s_both]">
            {t.suspended.title}
          </h1>

          {/* Subtitle */}
          <p className="mb-3 text-[16px] font-medium text-humana-muted animate-[fade-in-up_0.5s_ease-out_0.2s_both]">
            {t.suspended.subtitle}
          </p>

          {/* User info */}
          {user && (
            <p className="mb-6 text-[13px] text-humana-subtle animate-[fade-in-up_0.5s_ease-out_0.25s_both]">
              {user.name} &middot; {user.email}
            </p>
          )}

          {/* Description */}
          <p className="mx-auto mb-10 max-w-[440px] text-[14px] leading-relaxed text-humana-muted animate-[fade-in-up_0.5s_ease-out_0.3s_both]">
            {t.suspended.description}
          </p>

          {/* Gold accent dots */}
          <div className="mb-10 flex items-center justify-center gap-2 animate-[fade-in-up_0.5s_ease-out_0.35s_both]">
            <span className="h-1.5 w-1.5 rounded-full bg-humana-gold/30" />
            <span className="h-1.5 w-6 rounded-full bg-humana-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-humana-gold/30" />
          </div>

          {/* CTA — contact support */}
          <div className="flex flex-col items-center gap-4 animate-[fade-in-up_0.5s_ease-out_0.4s_both]">
            <a
              href={`mailto:${t.suspended.contactEmail}`}
              className="tooltip relative inline-flex items-center gap-2 rounded-lg bg-humana-ink px-10 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black hover:shadow-lg"
              data-tooltip={t.suspended.contactEmail}
            >
              {t.suspended.contact}
              <svg
                width="14"
                height="9"
                viewBox="0 0 16 10"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 5h14M10 1l4 4-4 4" />
              </svg>
            </a>

            <button
              onClick={logout}
              className="cursor-pointer text-[13px] font-medium text-humana-muted underline underline-offset-4 transition-colors hover:text-humana-ink"
            >
              {t.suspended.backToLogin}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
