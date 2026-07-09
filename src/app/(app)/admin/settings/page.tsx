/** Admin — Platform Settings (read-only display + countries table).
 *  Matches Paper design artboard 33B-0 ("AD-06 · Settings"). */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { PlatformSetting, Country } from "@/lib/types";

export default function SettingsPage() {
  const { t } = useLocale();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PlatformSetting | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [settingsRes, countriesRes] = await Promise.all([
        adminApi.getPlatformSettings().catch(() => null),
        adminApi.listCountries().catch(() => ({ countries: [] })),
      ]);
      if (settingsRes) setSettings(settingsRes.platform_setting);
      setCountries(countriesRes.countries);
    } catch {
      // API unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** Toggle a country's enabled status. */
  async function handleToggle(country: Country) {
    setTogglingId(country.id);
    try {
      const res = await adminApi.updateCountry(country.id, { enabled: !country.enabled });
      setCountries((prev) =>
        prev.map((c) => (c.id === country.id ? res.country : c)),
      );
    } catch {
      // silently fail
    } finally {
      setTogglingId(null);
    }
  }

  /** Format language display. */
  function langDisplay(code: string): string {
    if (code === "en") return "English (en)";
    if (code === "es") return "Español (es)";
    if (code === "pt") return "Português (pt)";
    return code;
  }

  /** Format currency display. */
  function currencyDisplay(code: string): string {
    const labels: Record<string, string> = {
      USD: "USD — United States Dollar",
      EUR: "EUR — Euro",
      MXN: "MXN — Mexican Peso",
      BRL: "BRL — Brazilian Real",
      ARS: "ARS — Argentine Peso",
    };
    return labels[code] || code;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">
            {t.common.loading}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-16 py-10">
      {/* Header — per Paper 33B-0 */}
      <div className="mb-10 animate-[fade-in-up_0.4s_ease-out]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {t.admin.settings.eyebrow}
        </span>
        <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
          {t.admin.settings.title}
        </h1>
        <p className="mt-1 text-[14px] text-humana-muted">
          {t.admin.settings.subtitle}
        </p>
      </div>

      {/* Section 1 — Platform Identity (read-only 2×2 grid) */}
      <div className="mb-8 rounded-xl border border-humana-line bg-white p-8 animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
        <h2 className="mb-6 text-[15px] font-semibold text-humana-ink">
          {t.admin.settings.identity}
        </h2>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <ReadOnlyField
            label={t.admin.settings.platformName}
            value={settings?.platform_name || "--"}
          />
          <ReadOnlyField
            label={t.admin.settings.supportEmail}
            value={settings?.support_email || "--"}
          />
          <ReadOnlyField
            label={t.admin.settings.currency}
            value={settings ? currencyDisplay(settings.default_currency) : "--"}
          />
          <ReadOnlyField
            label={t.admin.settings.language}
            value={settings ? langDisplay(settings.default_language) : "--"}
          />
        </div>
      </div>

      {/* Section 2 — Commission Rates (3 KPI cards) */}
      <div className="mb-8 rounded-xl border border-humana-line bg-white p-8 animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-humana-ink">
            {t.admin.settings.commissions}
          </h2>
          <button className="cursor-pointer text-[13px] font-medium text-humana-gold transition-colors hover:text-[#c5a030]">
            {t.admin.settings.editRates}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <CommissionCard
            label={t.admin.settings.agencyRate}
            value={settings ? `${Math.round(settings.agency_commission_rate * 100)}%` : "--"}
            hint={t.admin.settings.agencyHint}
          />
          <CommissionCard
            label={t.admin.settings.officeFee}
            value={settings ? `${Math.round(settings.office_fee_rate * 100)}%` : "--"}
            hint={t.admin.settings.officeHint}
          />
          <CommissionCard
            label={t.admin.settings.hotelNet}
            value={settings ? `${Math.round(settings.hotel_net_rate * 100)}%` : "--"}
            hint={t.admin.settings.hotelHint}
          />
        </div>
      </div>

      {/* Section 3 — Countries & Regions (table) */}
      <div className="rounded-xl border border-humana-line bg-white p-8 animate-[fade-in-up_0.4s_ease-out_0.15s_both]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-humana-ink">
            {t.admin.settings.countriesTitle}
          </h2>
          <button className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-humana-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-humana-ink/90 hover:shadow-md">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t.admin.settings.addCountry}
          </button>
        </div>

        {countries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <svg className="mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <p className="text-[14px] text-humana-muted">{t.admin.settings.noCountries}</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[60px_1.5fr_80px_80px_80px_100px_100px] items-center gap-3 border-b border-humana-line px-2 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.flag}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.country}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.code}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.hotels}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.retreats}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.status}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.enabled}</span>
            </div>

            {/* Table rows */}
            {countries.map((country) => (
              <div
                key={country.id}
                className="grid grid-cols-[60px_1.5fr_80px_80px_80px_100px_100px] items-center gap-3 border-b border-humana-line/50 px-2 py-4 transition-colors hover:bg-humana-stone/30"
              >
                <span className="text-[18px]">{country.flag_emoji || "🏳️"}</span>
                <span className="text-[14px] font-medium text-humana-ink">{country.name}</span>
                <span className="text-[13px] text-humana-muted">{country.code}</span>
                <span className="text-[13px] text-humana-ink">0</span>
                <span className="text-[13px] text-humana-ink">0</span>
                <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${
                  country.status === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}>
                  {country.status === "active" ? t.admin.settings.activeStatus : t.admin.settings.inactiveStatus}
                </span>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleToggle(country)}
                    disabled={togglingId === country.id}
                    className={`cursor-pointer relative h-6 w-11 rounded-full transition-colors duration-200 ${
                      country.enabled ? "bg-emerald-500" : "bg-humana-line"
                    } ${togglingId === country.id ? "opacity-60" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                        country.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/** Read-only field with label + value (underline style). */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
        {label}
      </span>
      <span className="border-b border-humana-line pb-3 text-[15px] text-humana-ink">
        {value}
      </span>
    </div>
  );
}

/** Commission rate card — displays a rate prominently with a hint below. */
function CommissionCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-humana-line p-6">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
        {label}
      </span>
      <p className="mt-2 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
        {value}
      </p>
      <p className="mt-1 text-[12px] text-humana-muted">{hint}</p>
    </div>
  );
}
