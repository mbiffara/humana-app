"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";

export function SubscriptionPaywall() {
  const { t } = useLocale();
  const tp = t.agencyWs.paywall;
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-humana-stone/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-humana-line p-10 text-center shadow-lg animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-humana-gold-light">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tp.eyebrow}
        </p>
        <h2 className="mt-3 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
          {tp.title}
        </h2>
        <p className="mt-2 text-[14px] text-humana-muted leading-relaxed">
          {tp.body}
        </p>
        <button
          onClick={() => router.push("/agency/settings?tab=subscription")}
          className="mt-6 w-full cursor-pointer bg-humana-gold px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
        >
          {tp.cta}
        </button>
      </div>
    </div>
  );
}
