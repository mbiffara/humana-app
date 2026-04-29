"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";
import { countries } from "@/data/countries";

const slugToCountryId: Record<string, string> = {
  mexico: "mx",
  argentina: "ar",
  usa: "us",
  spain: "es",
  brazil: "br",
  india: "in",
  indonesia: "id",
};

export default function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();
  const { set } = useBooking();

  const countryId = slugToCountryId[country];
  const countryData = countries.find((c) => c.id === countryId);

  const countryRetreats = retreats.filter((r) => r.country === countryId);
  const countryHotels = hotels.filter((h) => h.country === countryId);

  const name = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);
  const flagCode = countryId ?? country;

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-16 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: name },
        ]}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-humana-gold" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.selectCountry.title}
          </span>
        </div>

        <h1 className="flex items-center gap-4 text-[42px] font-light leading-[50px] tracking-[-0.02em] text-humana-ink">
          <div className="relative h-[36px] w-[36px] shrink-0">
            <Image
              src={`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`}
              alt={name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          {name}
        </h1>

        <p className="text-[15px] leading-[22px] text-humana-muted">
          {countryRetreats.length} retiros disponibles · {countryHotels.length} hoteles certificados en la red HUMANA.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Retreats card */}
        <Link
          href={`/select-country/${country}/retreats`}
          onClick={() => set({ flowType: "retreats" })}
          className="group flex flex-col border border-humana-line bg-white p-12 transition-all duration-200 hover:-translate-y-0.5 hover:border-humana-ink hover:shadow-lg"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Explorar experiencias
          </span>

          <h3 className="mt-4 text-[30px] font-light leading-[38px] tracking-[-0.01em] text-humana-ink">
            {t.selectCountry.retreatsTitle}
          </h3>

          <p className="mt-3 text-[15px] leading-[22px] text-humana-muted">
            {t.selectCountry.retreatsDesc}
          </p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-[42px] font-light leading-none tracking-[-0.02em] text-humana-ink">
              {countryRetreats.length}
            </span>
            <span className="text-[15px] text-humana-muted">retiros disponibles</span>
          </div>

          <div className="mt-8">
            <span className="inline-flex items-center justify-center bg-humana-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-colors group-hover:bg-humana-gold">
              Ver retiros →
            </span>
          </div>
        </Link>

        {/* Hotels card */}
        <Link
          href={`/select-country/${country}/hotels`}
          onClick={() => set({ flowType: "hotels" })}
          className="group flex flex-col border border-humana-line bg-white p-12 transition-all duration-200 hover:-translate-y-0.5 hover:border-humana-ink hover:shadow-lg"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Alojamientos
          </span>

          <h3 className="mt-4 text-[30px] font-light leading-[38px] tracking-[-0.01em] text-humana-ink">
            {t.selectCountry.hotelsTitle}
          </h3>

          <p className="mt-3 text-[15px] leading-[22px] text-humana-muted">
            {t.selectCountry.hotelsDesc}
          </p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-[42px] font-light leading-none tracking-[-0.02em] text-humana-ink">
              {countryHotels.length}
            </span>
            <span className="text-[15px] text-humana-muted">hoteles disponibles</span>
          </div>

          <div className="mt-8">
            <span className="inline-flex items-center justify-center border border-humana-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors group-hover:border-humana-gold group-hover:text-humana-gold">
              Ver hoteles →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
