"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { agencyApi, type ApiExperience } from "@/lib/api/agency";
import { retreatToExperience } from "@/lib/retreat-experience";
import { countryIdToSlug } from "@/data/countries";
import { SearchBar } from "@/components/SearchBar";

export default function RetreatsPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const countriesParam = searchParams.get("countries");
  const typesParam = searchParams.get("types");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const guestsParam = searchParams.get("guests");

  const [experiences, setExperiences] = useState<ApiExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCountries = countriesParam ? countriesParam.split(",").filter(Boolean) : [];
  const activeTypes = typesParam ? typesParam.split(",").filter(Boolean) : [];
  const guestsNum = guestsParam ? parseInt(guestsParam, 10) : undefined;
  const hasFilters = activeCountries.length > 0 || activeTypes.length > 0 || !!fromParam || (guestsNum && guestsNum > 1);

  useEffect(() => {
    setLoading(true);
    const params: { country_code?: string[]; kind?: string[]; from?: string; to?: string; guests?: number } = {};
    if (activeCountries.length) params.country_code = activeCountries;
    if (activeTypes.length) params.kind = activeTypes;
    if (fromParam) params.from = fromParam;
    if (toParam) params.to = toParam;
    if (guestsNum && guestsNum > 1) params.guests = guestsNum;

    Promise.all([
      agencyApi.listExperiences(params).then((res) => res.experiences).catch(() => [] as ApiExperience[]),
      agencyApi.listPublicRetreats(params).then((res) => res.retreats.map(retreatToExperience)).catch(() => [] as ApiExperience[]),
    ])
      .then(([exps, retreats]) => {
        const merged = [...exps, ...retreats].sort((a, b) => (a.starts_on || "").localeCompare(b.starts_on || ""));
        setExperiences(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countriesParam, typesParam, fromParam, toParam, guestsParam]);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col px-16 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[13px] text-humana-muted">
        <Link href="/dashboard" className="transition-colors hover:text-humana-ink">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-humana-ink">{t.retreats.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <span className="h-px w-7 bg-humana-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.retreats.eyebrow}
          </span>
        </div>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          {t.retreats.title}
        </h1>
        <p className="text-[14px] text-humana-muted">
          {loading ? "..." : t.exploreRetreats.showing(experiences.length)}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <SearchBar
          initialDestinations={activeCountries}
          initialTypes={activeTypes}
          initialFrom={fromParam ?? undefined}
          initialTo={toParam ?? undefined}
          initialGuests={guestsNum}
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p className="text-[16px] font-medium text-humana-ink">{t.retreats.empty}</p>
          <p className="max-w-[460px] text-center text-[14px] leading-[20px] text-humana-muted">
            {t.retreats.emptyHint}
          </p>
          {hasFilters && (
            <Link
              href="/retreats"
              className="mt-4 border border-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-all hover:bg-humana-ink hover:text-white"
            >
              {t.retreats.filters.all}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ experience }: { experience: ApiExperience }) {
  const { t } = useLocale();
  const countrySlug = experience.country_code
    ? (countryIdToSlug[experience.country_code.toLowerCase()] ?? experience.country_code.toLowerCase())
    : "mexico";
  const nights = Math.max(
    1,
    Math.round(
      (new Date(experience.ends_on).getTime() - new Date(experience.starts_on).getTime()) /
        86400000,
    ),
  );
  const kindLabel = t.hotelWs?.retreats?.wizard?.types?.[experience.kind as keyof typeof t.hotelWs.retreats.wizard.types] ?? experience.kind;
  const tag = `${kindLabel} · ${nights} ${nights === 1 ? "noche" : "noches"}`;
  const location = experience.location ?? experience.country ?? "";
  const startF = formatShortDate(experience.starts_on);
  const endF = formatShortDate(experience.ends_on);

  return (
    <article className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/select-country/${countrySlug}/retreats/${experience.slug}`} className="relative h-52 w-full bg-humana-stone">
        {experience.image_url && (
          <Image src={experience.image_url} alt={experience.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
        )}
        <div className="absolute left-3 top-3 bg-white px-2.5 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-humana-ink">{tag}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-humana-muted">{location}</span>
          </div>
          <span className="text-[11px] font-medium text-[#4A463E]">{startF} — {endF}</span>
        </div>

        <h3 className="text-[16px] font-medium leading-[22px] tracking-[-0.01em] text-humana-ink line-clamp-2">
          {experience.title}{experience.hotel ? ` — ${experience.hotel.name}` : ""}
        </h3>

        <p className="text-[13px] leading-[18px] text-humana-muted line-clamp-2">{experience.description}</p>

        <div className="mt-auto h-px bg-humana-line" />

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-humana-subtle">{t.retreatDetail.startingFrom}</span>
            <span className="whitespace-nowrap text-[16px] font-light tracking-[-0.01em] text-humana-ink">
              {experience.currency} {experience.price.toLocaleString()}
              <span className="text-[11px] font-normal text-humana-subtle"> / {t.retreatDetail.perGuest}</span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            {experience.commission_percent && (
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-humana-gold">
                {t.retreatDetail.commission} {experience.commission_percent}
              </span>
            )}
            <Link href={`/select-country/${countrySlug}/retreats/${experience.slug}`} className="whitespace-nowrap text-[12px] font-medium text-humana-ink transition-colors hover:text-humana-gold">
              {t.retreatDetail.bookNow} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[d.getMonth()]}`;
}
