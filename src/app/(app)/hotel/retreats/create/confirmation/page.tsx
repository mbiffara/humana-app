/** Retreat wizard confirmation — shown after publishing (HT-05 Confirmation).
 *  Reads the just-published retreat from the wizard context, then clears it
 *  when the user leaves. */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRetreatWizard } from "@/contexts/RetreatWizardContext";
import { hotelApi, type HotelProfile } from "@/lib/api/hotel";

function toCents(price: string): number {
  const parsed = parseFloat(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : 0;
}

export default function RetreatConfirmationPage() {
  const { t, locale } = useLocale();
  const tr = t.hotelWs.retreats;
  const tw = tr.wizard;
  const router = useRouter();
  const { state, reset, hydrated } = useRetreatWizard();
  const [hotel, setHotel] = useState<HotelProfile | null>(null);

  useEffect(() => {
    hotelApi.getProfile().then((res) => setHotel(res.hotel)).catch(() => {});
  }, []);

  // Direct navigation without a published retreat — nothing to confirm
  useEffect(() => {
    if (hydrated && !state.retreatId) router.replace("/hotel/retreats");
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
  const pricedCount = state.pricing.filter((p) => toCents(p.price) > 0).length;

  const fields: { label: string; value: string }[] = [
    { label: tw.confirmation.retreat, value: state.name },
    { label: tw.confirmation.startDate, value: startLabel },
    {
      label: tw.confirmation.hotel,
      value: hotel ? `${hotel.name}${hotel.city ? ` · ${hotel.city}` : ""}` : "—",
    },
    { label: tw.confirmation.capacity, value: tw.preview.guests(state.capacity) },
    {
      label: tw.confirmation.type,
      value: `${tw.types[state.retreatType]} · ${tr.nights(state.nights)}`,
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

      {/* Summary card */}
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

      {/* Actions */}
      <div className="mt-10 flex items-center gap-4 animate-fade-in-up-delay-2">
        <Link
          href={`/hotel/retreats/create/step-5?id=${state.retreatId}`}
          className="border border-humana-line bg-white px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-colors hover:border-humana-ink"
        >
          {tw.confirmation.viewRetreat}
        </Link>
        <Link
          href="/hotel/retreats"
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
