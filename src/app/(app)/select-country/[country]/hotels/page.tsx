"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { hotels } from "@/data/hotels";
import { retreats } from "@/data/retreats";
import { countries, countrySlugToId } from "@/data/countries";

export default function CountryHotelsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();

  const countryId = countrySlugToId[country] ?? country;
  const countryData = countries.find((c) => c.id === countryId);
  const countryName = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);

  const countryHotels = hotels.filter((h) => h.country === countryId);

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: countryName, href: `/select-country/${country}` },
          { label: t.breadcrumb.hotels },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-humana-gold" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.breadcrumb.hotels}
          </span>
        </div>

        <h1 className="flex items-center gap-3 text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          <Image
            src={`https://hatscripts.github.io/circle-flags/flags/${countryId}.svg`}
            alt={countryName}
            width={28}
            height={28}
            className="rounded-full"
            unoptimized
          />
          {countryName}
        </h1>

        <p className="text-[15px] leading-[22px] text-humana-muted">
          {t.exploreHotels.showing(countryHotels.length)}. {t.hotelDetail.hotelSubtitle}
        </p>
      </div>

      {/* 3-column hotel card grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {countryHotels.map((h) => {
          const hotelRetreats = retreats.filter((r) => r.hotelId === h.id);
          const roomCount = h.roomTypes.length;

          return (
            <article
              key={h.slug}
              className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link href={`/select-country/${country}/hotels/${h.slug}`} className="relative h-[300px] w-full bg-humana-stone">
                <Image src={h.image} alt={h.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </Link>

              <div className="flex flex-col gap-4 p-8">
                <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                  {t.hotelDetail.boutiqueHotel} · {h.location.split(",")[0]?.trim()}
                </span>

                <h3 className="text-[22px] font-normal leading-[30px] tracking-[-0.01em] text-humana-ink">
                  {h.name}
                </h3>

                <p className="text-[15px] leading-[22px] text-humana-muted">{h.shortDescription}</p>

                <div className="flex items-center gap-2 text-[14px] text-humana-muted">
                  <span>{t.hotelDetail.roomCount(roomCount)}</span>
                  <span className="text-humana-line">|</span>
                  <span>{t.hotelDetail.activeRetreats(hotelRetreats.length)}</span>
                </div>

                <Link
                  href={`/select-country/${country}/hotels/${h.slug}`}
                  className="mt-2 flex items-center justify-center border border-humana-ink py-3.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-all duration-150 hover:bg-humana-ink hover:text-white"
                >
                  {t.hotelDetail.viewRooms} →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
