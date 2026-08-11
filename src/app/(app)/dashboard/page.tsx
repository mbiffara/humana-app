"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLocale } from "@/i18n/LocaleProvider";
import { countries, countryIdToSlug } from "@/data/countries";
import { SearchBar } from "@/components/SearchBar";

import { useAuth } from "@/contexts/AuthContext";
import { agencyApi, type ApiExperience, type AgencyDashboard } from "@/lib/api/agency";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full border border-humana-line bg-humana-stone shimmer" />
  ),
});

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [isAdmin, router]);

  return (
    <>
      <div className="mx-auto flex max-w-[1400px] flex-col">
        <BannerSection />
        <DashboardKpis />
        <Hero />
        <MapCoverage />
        <RetreatsSection />
      </div>
      <Footer />
    </>
  );
}

function BannerSection() {
  return (
    <section className="px-16 pt-12">
      <CreateRetreatBanner />
    </section>
  );
}

function DashboardKpis() {
  const { t, locale } = useLocale();
  const [dashboard, setDashboard] = useState<AgencyDashboard | null>(null);

  useEffect(() => {
    agencyApi.getDashboard()
      .then((res) => setDashboard(res.dashboard))
      .catch(() => {});
  }, []);

  if (!dashboard) return null;

  const tag = locale === "es" ? "es-ES" : locale === "pt" ? "pt-PT" : "en-US";
  const fmt = (cents: number) =>
    new Intl.NumberFormat(tag, { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);

  const kpis = [
    { label: t.agencyWs.bookings.kpis.total, value: String(dashboard.total_bookings) },
    { label: t.agencyWs.bookings.kpis.volume, value: fmt(dashboard.volume_cents), gold: true },
    { label: t.agencyWs.bookings.kpis.commission, value: fmt(dashboard.commission_earned_cents) },
    { label: t.agencyWs.clients.title, value: String(dashboard.active_clients) },
  ];

  return (
    <section className="px-16 pt-8">
      <div className="grid grid-cols-4 gap-5 stagger-children">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border border-humana-line bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">{kpi.label}</p>
            <p className={`mt-1.5 text-[26px] font-bold ${kpi.gold ? "text-humana-gold" : "text-humana-ink"}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-8 px-16 pt-14 pb-10">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3.5">
          <span className="h-px w-7 bg-humana-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-gold">
            {t.hero.eyebrow(new Date().getFullYear())}
          </span>
        </div>
        <h1 className="text-[42px] font-light leading-[50px] tracking-[-0.02em] text-humana-ink">
          {t.hero.headline[0]}
          <br />
          {t.hero.headline[1]}
        </h1>
        <p className="max-w-[620px] text-[15px] leading-[22px] text-[#4A463E]">
          {t.hero.subhead}
        </p>
      </div>
      <SearchBar />
    </section>
  );
}

function MapCoverage() {
  const { t } = useLocale();
  return (
    <section className="flex flex-col gap-7 px-16 pt-4">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-subtle">
            {t.map.eyebrow(countries.length)}
          </span>
          <h3 className="text-[22px] font-light tracking-[-0.01em] text-humana-ink">
            {t.map.title}
          </h3>
        </div>
        <Link
          href="/map"
          className="flex items-center gap-2 border border-humana-line px-4 py-2 text-[13px] font-medium text-humana-ink transition-all hover:border-humana-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          {t.map.fullscreen}
        </Link>
      </div>

      <WorldMap />
    </section>
  );
}


const FILTER_KINDS: { key: string; labelKey: "all" | "wellness" | "spiritual" | "breathwork" | "mindfulness" }[] = [
  { key: "all", labelKey: "all" },
  { key: "wellness", labelKey: "wellness" },
  { key: "spiritual", labelKey: "spiritual" },
  { key: "breathwork", labelKey: "breathwork" },
  { key: "mindfulness", labelKey: "mindfulness" },
];

function RetreatsSection() {
  const { t } = useLocale();
  const [experiences, setExperiences] = useState<ApiExperience[]>([]);
  const [loadingExp, setLoadingExp] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setLoadingExp(true);
    agencyApi
      .listExperiences()
      .then((res) => setExperiences(res.experiences))
      .catch(() => {})
      .finally(() => setLoadingExp(false));
  }, []);

  const filtered = activeFilter === "all"
    ? experiences
    : experiences.filter((e) => e.kind === activeFilter);

  return (
    <section className="flex flex-col gap-10 px-16 py-20">
      <div className="flex items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-humana-subtle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {t.retreats.eyebrow}
          </span>
          <h2 className="text-[30px] font-light leading-[38px] tracking-[-0.01em] text-humana-ink">
            {t.retreats.title}
          </h2>
          <p className="text-[14px] leading-[20px] text-humana-muted">
            {loadingExp ? "..." : t.exploreRetreats.showing(filtered.length)}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {FILTER_KINDS.map((f) => (
            <FilterChipLocal
              key={f.key}
              label={t.retreats.filters[f.labelKey]}
              active={activeFilter === f.key}
              onClick={() => setActiveFilter(f.key)}
            />
          ))}
          <Link
            href="/retreats"
            className="ml-2 text-[13px] font-medium text-humana-ink transition-colors hover:text-humana-gold"
          >
            {t.retreats.seeAll}
          </Link>
        </div>
      </div>

      {loadingExp ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p className="text-[15px] font-medium text-humana-ink">{t.retreats.empty}</p>
          <p className="max-w-[400px] text-center text-[13px] leading-[19px] text-humana-muted">{t.retreats.emptyHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}

    </section>
  );
}

function CreateRetreatBanner() {
  const { t } = useLocale();
  const { user } = useAuth();
  return (
    <div className="relative overflow-hidden bg-humana-ink">
      {/* Decorative isotipo */}
      <div className="pointer-events-none absolute -right-12 -bottom-10 h-[320px] w-[320px] opacity-[0.07]">
        <Image src="/brand/isotipo.png" alt="" fill className="object-contain" />
      </div>
      {/* Subtle gold gradient accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-humana-gold/[0.06] via-transparent to-transparent" />

      <div className="relative flex items-center justify-between gap-10 px-14 py-16">
        <div className="flex items-center gap-10">
          {/* Small isotipo inline */}
          <div className="relative hidden h-16 w-16 shrink-0 lg:block">
            <Image src="/brand/isotipo.png" alt="" fill className="object-contain opacity-80" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <span className="h-px w-7 bg-humana-gold" />
              <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-humana-gold">
                {t.dashboard.welcome(user?.organization?.name ?? "")}
              </span>
            </div>
            <h3 className="text-[28px] font-light tracking-[-0.01em] text-white">
              {t.dashboard.createRetreatTitle}
            </h3>
            <p className="max-w-[640px] text-[15px] leading-[22px] text-white/60">
              {t.dashboard.createRetreatDesc}
            </p>
          </div>
        </div>
        <Link
          href="/agency/retreats/create/step-1"
          className="group/cta flex shrink-0 items-center gap-3 border border-humana-gold bg-humana-gold px-10 py-4.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-all duration-200 hover:bg-transparent hover:text-humana-gold active:scale-[0.98]"
        >
          {t.dashboard.createRetreatCta}
          <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
            <path d="M1 5h14M10 1l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function FilterChipLocal({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border px-3.5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-150 hover:opacity-90 active:scale-[0.98] ${
        active
          ? "border-humana-ink bg-humana-ink text-white"
          : "border-[#D8D4C8] text-[#4A463E] hover:border-humana-ink"
      }`}
    >
      {label}
    </button>
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
        {experience.image_url ? (
          <Image src={experience.image_url} alt={experience.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4d0c4" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
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

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-humana-subtle">{t.retreatDetail.startingFrom}</span>
              <span className="whitespace-nowrap text-[16px] font-light tracking-[-0.01em] text-humana-ink">
                {experience.currency} {experience.price.toLocaleString()}
                <span className="text-[11px] font-normal text-humana-subtle"> / {t.retreatDetail.perGuest}</span>
              </span>
            </div>
            {experience.commission_percent && (
              <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-humana-gold">
                {experience.commission_percent}%
              </span>
            )}
          </div>
          <Link href={`/select-country/${countrySlug}/retreats/${experience.slug}`} className="block text-center rounded-md border border-humana-ink py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:bg-humana-ink hover:text-white">
            {t.retreatDetail.bookNow}
          </Link>
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

function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-humana-line bg-humana-stone px-16 py-12">
      <div className="flex items-start justify-between gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/isotipo.png" alt="" width={24} height={24} />
            <Image src="/brand/logotipo.svg" alt="HUMANA" width={90} height={30} />
          </div>
          <p className="max-w-[480px] text-[13px] leading-[20px] text-humana-muted">
            {t.hero.subhead}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">Contacto</span>
          <nav className="flex flex-col gap-2">
            <span className="text-[13px] text-humana-muted">info@humana.global</span>
          </nav>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-humana-line pt-6">
        <span className="text-[12px] text-humana-subtle">&copy; 2026 Humana Global. Todos los derechos reservados.</span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-[12px] text-humana-subtle hover:text-humana-ink">Privacidad</a>
          <a href="#" className="text-[12px] text-humana-subtle hover:text-humana-ink">Términos</a>
        </div>
      </div>
    </footer>
  );
}
