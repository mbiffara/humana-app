/** Agency retreat wizard confirmation — shown after submitting for review.
 *  Reads the just-submitted retreat from the wizard context, then clears it
 *  when the user leaves. */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAgencyRetreatWizard } from "@/contexts/AgencyRetreatWizardContext";

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

export default function AgencyRetreatConfirmationPage() {
  const { t, locale } = useLocale();
  const tw = t.agencyWs.retreats.wizard;
  const router = useRouter();
  const { state, reset, hydrated } = useAgencyRetreatWizard();

  useEffect(() => {
    if (hydrated && !state.retreatId) router.replace("/agency/my-retreats");
  }, [hydrated, state.retreatId, router]);

  if (!hydrated || !state.retreatId) return null;

  const reference = `RET-${new Date().getFullYear()}-${String(state.retreatId).padStart(4, "0")}`;
  const startLabel = state.startDate
    ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(`${state.startDate}T00:00:00`),
      )
    : "—";
  const minPriceCents = state.pricing.reduce((min, p) => {
    const cents = toCents(p.price);
    return cents > 0 && (min === 0 || cents < min) ? cents : min;
  }, 0);
  const pricedCount = state.pricing.filter((p) => p.included !== false && toCents(p.price) > 0).length;

  const fields: { label: string; value: string }[] = [
    { label: tw.confirmation.retreat, value: state.name },
    { label: tw.confirmation.startDate, value: startLabel },
    {
      label: tw.confirmation.hotel,
      value: state.hotelName
        ? `${state.hotelName}${state.hotelCity ? ` · ${state.hotelCity}` : ""}`
        : "—",
    },
    { label: tw.confirmation.capacity, value: tw.preview.guests(state.capacity) },
    {
      label: tw.confirmation.type,
      value: `${tw.types[state.retreatType]} · ${tw.preview.nightsCount(state.nights)}`,
    },
    {
      label: tw.confirmation.priceFrom,
      value: minPriceCents
        ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(minPriceCents / 100)} USD`
        : "—",
    },
  ];

  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center px-10 py-20 text-center">
      <div className="animate-fade-in-scale">
        <Image src="/brand/isotipo.png" alt="" width={64} height={64} />
      </div>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold animate-fade-in-up">
        {tw.confirmation.eyebrow}
      </p>
      <h1 className="mt-3 text-[34px] font-light leading-[42px] tracking-[-0.01em] text-humana-ink animate-fade-in-up">
        {tw.confirmation.title(state.name)}
      </h1>
      <p className="mt-2 text-[15px] leading-[22px] text-humana-muted animate-fade-in-up">
        {tw.confirmation.subtitle}
      </p>

      <div className="mt-10 w-full rounded-xl border border-humana-line bg-white p-8 text-left shadow-sm animate-fade-in-up-delay-1">
        <div className="flex items-center justify-between border-b border-humana-line pb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {tw.confirmation.reference}
          </span>
          <span className="text-[16px] font-bold tracking-wide text-humana-ink">{reference}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-5">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                {field.label}
              </p>
              <p className="mt-1 text-[14px] font-medium text-humana-ink">{field.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-lg bg-humana-stone px-4 py-3">
          <span className="text-[13px] text-humana-muted">{tw.confirmation.roomsConfigured}</span>
          <span className="text-[13px] font-semibold text-humana-gold">
            {tw.confirmation.typesCount(pricedCount)}
          </span>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4 animate-fade-in-up-delay-2">
        <Link
          href={`/agency/retreats/create/step-6?id=${state.retreatId}`}
          className="border border-humana-line bg-white px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:border-humana-ink"
        >
          {tw.confirmation.viewRetreat}
        </Link>
        <Link
          href="/agency/my-retreats"
          onClick={reset}
          className="flex items-center gap-2 bg-humana-ink px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
        >
          {tw.confirmation.backToRetreats}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
