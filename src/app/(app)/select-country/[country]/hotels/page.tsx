"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { countries, countrySlugToId } from "@/data/countries";
import { agencyApi, type PublicHotel } from "@/lib/api/agency";

export default function CountryHotelsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();
  const [hotels, setHotels] = useState<PublicHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const countryId = countrySlugToId[country] ?? country;
  const countryData = countries.find((c) => c.id === countryId);
  const countryName = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);

  useEffect(() => {
    agencyApi
      .listHotels({ country: countryId.toUpperCase() })
      .then((res) => setHotels(res.hotels))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [countryId]);

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
          {loading ? "..." : t.exploreHotels.showing(hotels.length)}
        </p>
      </div>

      {/* 3-column hotel card grid */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hotels.map((h) => (
            <article
              key={h.id}
              className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link href={`/select-country/${country}/hotels/${h.id}`} className="relative h-[300px] w-full bg-humana-stone">
                {/* Use a placeholder since the list endpoint doesn't include images */}
                <div className="flex h-full items-center justify-center text-humana-subtle">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </Link>

              <div className="flex flex-col gap-4 p-8">
                <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                  {t.hotelDetail.boutiqueHotel} · {h.city}
                </span>

                <h3 className="text-[22px] font-normal leading-[30px] tracking-[-0.01em] text-humana-ink">
                  {h.name}
                </h3>

                <p className="text-[15px] leading-[22px] text-humana-muted">
                  {[h.city, h.country].filter(Boolean).join(", ")}
                </p>

                <Link
                  href={`/select-country/${country}/hotels/${h.id}`}
                  className="mt-2 flex items-center justify-center border border-humana-ink py-3.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-all duration-150 hover:bg-humana-ink hover:text-white"
                >
                  {t.hotelDetail.viewRooms} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
