"use client";

import Link from "next/link";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";

export default function HotelWizardUnderReview() {
  const { state } = useHotelWizard();
  const { t, locale } = useLocale();
  const h = t.onboarding.hotel;
  const fallbackName = locale === "es" ? "Tu propiedad" : locale === "pt" ? "Sua propriedade" : "Your property";
  const hotelName = state.hotelName || fallbackName;
  const submittedAt = new Date().toLocaleDateString(
    locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-humana-stone px-8">
      <div className="flex w-full max-w-[720px] flex-col items-center text-center">
        {/* Animated check circle */}
        <div className="animate-check-pop">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="40"
              r="38"
              stroke="#d4af37"
              strokeWidth="2"
              className="animate-check-circle"
            />
            <polyline
              points="26,42 35,51 54,32"
              stroke="#d4af37"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-check-stroke"
            />
          </svg>
        </div>

        {/* Eyebrow */}
        <span className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold animate-fade-in-up-delay-1">
          {h.reviewEyebrow}
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink animate-fade-in-up-delay-2">
          {h.reviewTitle}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 max-w-[520px] text-[15px] leading-[22px] text-humana-muted animate-fade-in-up-delay-3">
          {h.reviewSubtitle(hotelName)}
        </p>

        {/* Timeline cards */}
        <div className="mt-12 grid w-full grid-cols-3 gap-4 animate-fade-in-up-delay-4">
          {/* Step 1: Submitted */}
          <div className="flex flex-col items-center rounded-lg border border-humana-line bg-white p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-humana-gold">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
              {h.reviewStep1Label}
            </span>
            <span className="mt-2 text-[14px] font-medium text-humana-ink">
              {h.reviewStep1Title}
            </span>
            <span className="mt-1 text-[12px] text-humana-subtle">
              {submittedAt}
            </span>
          </div>

          {/* Step 2: In Progress */}
          <div className="flex flex-col items-center rounded-lg border border-humana-gold/30 bg-humana-gold-light/20 p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-humana-gold animate-pulse-gold">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
              {h.reviewStep2Label}
            </span>
            <span className="mt-2 text-[14px] font-medium text-humana-ink">
              {h.reviewStep2Title}
            </span>
            <span className="mt-1 text-[12px] leading-relaxed text-humana-subtle">
              {h.reviewStep2Description}
            </span>
          </div>

          {/* Step 3: Next */}
          <div className="flex flex-col items-center rounded-lg border border-humana-line bg-white p-6 text-center opacity-60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-humana-line">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8a8578"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
              {h.reviewStep3Label}
            </span>
            <span className="mt-2 text-[14px] font-medium text-humana-ink">
              {h.reviewStep3Title}
            </span>
            <span className="mt-1 text-[12px] leading-relaxed text-humana-subtle">
              {h.reviewStep3Description}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="cursor-pointer flex items-center gap-2 bg-humana-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-black active:scale-[0.98]"
          >
            {h.reviewDashboard}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <button
            type="button"
            className="cursor-pointer flex items-center gap-2 border border-humana-line px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-all hover:border-humana-ink active:scale-[0.98]"
          >
            {h.reviewViewSubmission}
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-10 text-[12px] text-humana-subtle">
          {h.reviewQuestions}{" "}
          <button
            type="button"
            className="cursor-pointer text-humana-gold underline underline-offset-2 transition-colors hover:text-humana-ink"
          >
            {h.reviewContact}
          </button>
          <span className="ml-0.5">&rarr;</span>
        </p>
      </div>
    </div>
  );
}
