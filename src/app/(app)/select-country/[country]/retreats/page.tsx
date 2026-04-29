"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FilterChip } from "@/components/FilterChip";
import { retreats } from "@/data/retreats";
import { countries, countrySlugToId } from "@/data/countries";

type FilterType = "all" | "retreat" | "masterclass" | "corporate";

function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[d.getMonth()]}`;
}

export default function CountryRetreatsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();
  const [filter, setFilter] = useState<FilterType>("all");

  const countryId = countrySlugToId[country] ?? country;
  const countryData = countries.find((c) => c.id === countryId);
  const countryName = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);

  const countryRetreats = retreats.filter((r) => r.country === countryId);
  const filtered = filter === "all" ? countryRetreats : countryRetreats.filter((r) => r.type === filter);

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: countryName, href: `/select-country/${country}` },
          { label: t.breadcrumb.retreats },
        ]}
      />

      {/* Header row */}
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-humana-gold" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.exploreRetreats.eyebrow}
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
            {t.exploreRetreats.showing(filtered.length)}. Ordenados por fecha más próxima.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <FilterChip label={t.retreats.filters.all} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterChip label={t.retreats.filters.retreat} active={filter === "retreat"} onClick={() => setFilter("retreat")} />
          <FilterChip label={t.retreats.filters.masterclass} active={filter === "masterclass"} onClick={() => setFilter("masterclass")} />
        </div>
      </div>

      {/* 3-column retreat card grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => (
          <article
            key={r.slug}
            className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Link href={`/select-country/${country}/retreats/${r.slug}`} className="relative h-64 w-full bg-humana-stone">
              <Image
                src={r.image}
                alt={r.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4 bg-white px-3 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
                  {r.tag}
                </span>
              </div>
            </Link>

            <div className="flex flex-1 flex-col gap-4 p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-humana-gold">
                  {r.location.replace(",", " ·").toUpperCase()}
                </span>
                <span className="text-[12px] font-medium text-[#4A463E]">
                  {formatShortDate(r.startDate)} — {formatShortDate(r.endDate)}
                </span>
              </div>

              <h3 className="text-[16px] font-medium leading-[22px] tracking-[-0.01em] text-humana-ink">
                {r.name}
              </h3>

              <p className="text-[14px] leading-[18px] text-humana-muted">
                {r.hotelName}
              </p>

              <p className="line-clamp-3 text-[14px] leading-[20px] text-humana-muted">
                {r.description}
              </p>

              <div className="flex-1" />
              <div className="h-px bg-humana-line" />

              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">Desde</span>
                  <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
                    $ {r.price.toLocaleString()}
                    <span className="text-[13px] font-normal text-humana-subtle"> / huésped</span>
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    Comisión {r.commission}%
                  </span>
                  <Link
                    href={`/select-country/${country}/retreats/${r.slug}`}
                    className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                  >
                    Ver disponibilidad →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
