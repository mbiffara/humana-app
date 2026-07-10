/** Admin — Settings: admin profile, commission rates (read-only), countries CRUD. */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { adminApi } from "@/lib/api/admin";
import type { PlatformSetting, Country, User } from "@/lib/types";

/** Convert a 2-letter ISO country code to its flag emoji.
 *  Each letter is offset into the Regional Indicator Symbol range (U+1F1E6). */
function codeToFlag(code: string): string {
  if (code.length !== 2) return "";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    0x1f1e6 + upper.charCodeAt(0) - 65,
    0x1f1e6 + upper.charCodeAt(1) - 65,
  );
}

/** Country name → ISO-2 code lookup. Supports EN / ES / PT names. */
const COUNTRY_MAP: Record<string, string> = {
  // A
  afghanistan: "AF", albania: "AL", algeria: "DZ", andorra: "AD", angola: "AO",
  "antigua and barbuda": "AG", argentina: "AR", armenia: "AM", australia: "AU",
  austria: "AT", azerbaijan: "AZ",
  // B
  bahamas: "BS", bahrain: "BH", bangladesh: "BD", barbados: "BB", belarus: "BY",
  belgium: "BE", belgica: "BE", bélgica: "BE", belize: "BZ", belice: "BZ",
  benin: "BJ", bhutan: "BT", butan: "BT", butao: "BT", bolivia: "BO",
  "bosnia and herzegovina": "BA", "bosnia y herzegovina": "BA", botswana: "BW",
  brazil: "BR", brasil: "BR", brunei: "BN", bulgaria: "BG", "burkina faso": "BF",
  burundi: "BI",
  // C
  "cabo verde": "CV", cambodia: "KH", camboya: "KH", camboja: "KH",
  cameroon: "CM", camerun: "CM", camaroes: "CM", canada: "CA", canadá: "CA",
  chad: "TD", chile: "CL", china: "CN", colombia: "CO", comoros: "KM",
  congo: "CG", "costa rica": "CR", "cote d'ivoire": "CI",
  "costa de marfil": "CI", croatia: "HR", croacia: "HR", croácia: "HR",
  cuba: "CU", cyprus: "CY", chipre: "CY", czechia: "CZ",
  "czech republic": "CZ", "republica checa": "CZ", "república checa": "CZ",
  // D
  denmark: "DK", dinamarca: "DK", djibouti: "DJ", dominica: "DM",
  "dominican republic": "DO", "republica dominicana": "DO", "república dominicana": "DO",
  // E
  ecuador: "EC", egypt: "EG", egipto: "EG", egito: "EG",
  "el salvador": "SV", "equatorial guinea": "GQ", "guinea ecuatorial": "GQ",
  eritrea: "ER", estonia: "EE", eswatini: "SZ", ethiopia: "ET", etiopia: "ET",
  etiópia: "ET",
  // F
  fiji: "FJ", finland: "FI", finlandia: "FI", finlândia: "FI",
  france: "FR", francia: "FR", franca: "FR", frança: "FR",
  // G
  gabon: "GA", gabón: "GA", gabao: "GA", gambia: "GM", georgia: "GE",
  germany: "DE", alemania: "DE", alemanha: "DE", ghana: "GH",
  greece: "GR", grecia: "GR", grécia: "GR", grenada: "GD", granada: "GD",
  guatemala: "GT", guinea: "GN", "guinea-bissau": "GW", guyana: "GY",
  // H
  haiti: "HT", haití: "HT", honduras: "HN", hungary: "HU", hungria: "HU",
  hungría: "HU",
  // I
  iceland: "IS", islandia: "IS", islândia: "IS", india: "IN", indonesia: "ID",
  iran: "IR", irán: "IR", ira: "IR", iraq: "IQ", irak: "IQ", iraque: "IQ",
  ireland: "IE", irlanda: "IE", israel: "IL", italy: "IT", italia: "IT",
  itália: "IT",
  // J
  jamaica: "JM", japan: "JP", japon: "JP", japón: "JP", japao: "JP", japão: "JP",
  jordan: "JO", jordania: "JO", jordânia: "JO",
  // K
  kazakhstan: "KZ", kazajistan: "KZ", kazajistán: "KZ", cazaquistao: "KZ",
  kenya: "KE", kenia: "KE", quênia: "KE", kiribati: "KI",
  "south korea": "KR", "corea del sur": "KR", "coreia do sul": "KR",
  korea: "KR", corea: "KR", coreia: "KR",
  kuwait: "KW", kyrgyzstan: "KG",
  // L
  laos: "LA", latvia: "LV", letonia: "LV", letônia: "LV",
  lebanon: "LB", libano: "LB", líbano: "LB", lesotho: "LS",
  liberia: "LR", libya: "LY", libia: "LY", líbia: "LY",
  liechtenstein: "LI", lithuania: "LT", lituania: "LT", lituânia: "LT",
  luxembourg: "LU", luxemburgo: "LU",
  // M
  madagascar: "MG", malawi: "MW", malaysia: "MY", malasia: "MY", malásia: "MY",
  maldives: "MV", maldivas: "MV", mali: "ML", malta: "MT",
  mauritania: "MR", mauritius: "MU", mauricio: "MU",
  mexico: "MX", méxico: "MX", moldova: "MD", moldavia: "MD", moldávia: "MD",
  monaco: "MC", mónaco: "MC", mongolia: "MN", montenegro: "ME",
  morocco: "MA", marruecos: "MA", marrocos: "MA", mozambique: "MZ", myanmar: "MM",
  // N
  namibia: "NA", namíbia: "NA", nauru: "NR", nepal: "NP",
  netherlands: "NL", "paises bajos": "NL", "países bajos": "NL", holanda: "NL",
  "new zealand": "NZ", "nueva zelanda": "NZ", "nova zelandia": "NZ", "nova zelândia": "NZ",
  nicaragua: "NI", niger: "NE", nigeria: "NG", nigéria: "NG",
  "north macedonia": "MK", "macedonia del norte": "MK", norway: "NO", noruega: "NO",
  // O
  oman: "OM", omán: "OM", oma: "OM",
  // P
  pakistan: "PK", pakistán: "PK", paquistao: "PK", paquistão: "PK",
  palau: "PW", panama: "PA", panamá: "PA",
  "papua new guinea": "PG", paraguay: "PY", peru: "PE", perú: "PE",
  philippines: "PH", filipinas: "PH", poland: "PL", polonia: "PL", polônia: "PL",
  portugal: "PT", qatar: "QA", catar: "QA",
  // R
  romania: "RO", rumania: "RO", rumanía: "RO", romênia: "RO",
  russia: "RU", rusia: "RU", rússia: "RU", rwanda: "RW", ruanda: "RW",
  // S
  "saudi arabia": "SA", "arabia saudita": "SA", "arábia saudita": "SA",
  senegal: "SN", serbia: "RS", sérvia: "RS", "sierra leone": "SL",
  singapore: "SG", singapur: "SG", cingapura: "SG",
  slovakia: "SK", eslovaquia: "SK", eslováquia: "SK",
  slovenia: "SI", eslovenia: "SI", eslovênia: "SI",
  somalia: "SO", "south africa": "ZA", "sudafrica": "ZA", "sudáfrica": "ZA",
  "africa do sul": "ZA", "áfrica do sul": "ZA",
  spain: "ES", espana: "ES", españa: "ES", espanha: "ES",
  "sri lanka": "LK", sudan: "SD", sudán: "SD", sudao: "SD", sudão: "SD",
  suriname: "SR", sweden: "SE", suecia: "SE", suécia: "SE",
  switzerland: "CH", suiza: "CH", suíça: "CH", suica: "CH",
  syria: "SY", siria: "SY", síria: "SY",
  // T
  taiwan: "TW", tajikistan: "TJ", tanzania: "TZ", tanzânia: "TZ",
  thailand: "TH", tailandia: "TH", tailândia: "TH",
  togo: "TG", tonga: "TO", "trinidad and tobago": "TT", "trinidad y tobago": "TT",
  tunisia: "TN", tunez: "TN", túnez: "TN", tunísia: "TN",
  turkey: "TR", turquia: "TR", turquía: "TR",
  turkmenistan: "TM", tuvalu: "TV",
  // U
  uganda: "UG", ukraine: "UA", ucrania: "UA", ucrânia: "UA",
  "united arab emirates": "AE", "emiratos arabes unidos": "AE", "emiratos árabes unidos": "AE",
  "united kingdom": "GB", "reino unido": "GB",
  "united states": "US", "estados unidos": "US",
  usa: "US", "eeuu": "US", "eua": "US",
  uruguay: "UY", uzbekistan: "UZ",
  // V
  vanuatu: "VU", venezuela: "VE", vietnam: "VN",
  // Y
  yemen: "YE",
  // Z
  zambia: "ZM", zimbabwe: "ZW", zimbabue: "ZW",
};

/** Normalize string: lowercase, remove accents. */
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Try to match a country name to an ISO-2 code. */
function nameToCode(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const key = normalize(trimmed);
  // Exact match first
  if (COUNTRY_MAP[key]) return COUNTRY_MAP[key];
  // Try matching without accents in dictionary keys too
  for (const [k, v] of Object.entries(COUNTRY_MAP)) {
    if (normalize(k) === key) return v;
  }
  return "";
}

export default function SettingsPage() {
  const { t } = useLocale();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PlatformSetting | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Editable profile fields
  const [adminName, setAdminName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Original values to track dirty state
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const hasChanges = adminName !== originalName || supportEmail !== originalEmail;

  // Add country modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [creatingCountry, setCreatingCountry] = useState(false);

  // Detected code from country name input
  const detectedCode = newCountryCode || nameToCode(newCountryName);

  // Toggle enable/disable confirmation
  const [togglingCountry, setTogglingCountry] = useState<Country | null>(null);

  // Delete country modal (GitHub-style)
  const [deletingCountry, setDeletingCountry] = useState<Country | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [settingsRes, countriesRes] = await Promise.all([
        adminApi.getPlatformSettings().catch(() => null),
        adminApi.listCountries().catch(() => ({ countries: [] })),
      ]);
      if (settingsRes) {
        setSettings(settingsRes.platform_setting);
        setSupportEmail(settingsRes.platform_setting.support_email || "");
        setOriginalEmail(settingsRes.platform_setting.support_email || "");
      }
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

  // Initialize admin name from user
  useEffect(() => {
    if (user) {
      setAdminName(user.name || "");
      setOriginalName(user.name || "");
    }
  }, [user]);

  /** Save admin name + support email. */
  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      if (adminName !== originalName) {
        const res = await api.patch<{ user: User }>("/auth/me", { user: { name: adminName } });
        setUser(res.user);
        setOriginalName(res.user.name);
      }
      if (supportEmail !== originalEmail) {
        const settingsRes = await adminApi.updatePlatformSettings({ support_email: supportEmail });
        setSettings(settingsRes.platform_setting);
        setOriginalEmail(settingsRes.platform_setting.support_email);
      }
    } catch {
      // silently fail
    } finally {
      setSavingProfile(false);
    }
  }

  /** Confirm and toggle a country's enabled status. */
  async function handleConfirmToggle() {
    if (!togglingCountry) return;
    setTogglingId(togglingCountry.id);
    try {
      const res = await adminApi.updateCountry(togglingCountry.id, { enabled: !togglingCountry.enabled });
      setCountries((prev) =>
        prev.map((c) => (c.id === togglingCountry.id ? res.country : c)),
      );
    } catch {
      // silently fail
    } finally {
      setTogglingId(null);
      setTogglingCountry(null);
    }
  }

  /** Create a new country. */
  async function handleCreateCountry() {
    const code = detectedCode;
    if (!newCountryName.trim() || !code) return;
    setCreatingCountry(true);
    try {
      const res = await adminApi.createCountry({
        name: newCountryName.trim(),
        code: code.toUpperCase(),
        flag_emoji: codeToFlag(code),
      });
      setCountries((prev) => [...prev, res.country].sort((a, b) => a.name.localeCompare(b.name)));
      setShowAddModal(false);
      setNewCountryName("");
      setNewCountryCode("");
    } catch {
      // silently fail
    } finally {
      setCreatingCountry(false);
    }
  }

  /** Delete a country with password + confirmation text. */
  async function handleDeleteCountry() {
    if (!deletingCountry) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await adminApi.deleteCountry(deletingCountry.id, {
        password: deletePassword,
        confirmation_text: deleteConfirmText,
      });
      setCountries((prev) => prev.filter((c) => c.id !== deletingCountry.id));
      closeDeleteModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  }

  function closeDeleteModal() {
    setDeletingCountry(null);
    setDeleteConfirmText("");
    setDeletePassword("");
    setDeleteError("");
  }

  const deleteConfirmValid =
    deletingCountry !== null &&
    deleteConfirmText.trim() === deletingCountry.name &&
    deletePassword.length >= 8;

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
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[12px] animate-[fade-in-up_0.4s_ease-out]">
        <Link href="/admin/dashboard" className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink">
          Dashboard
        </Link>
        <span className="text-humana-subtle">&rsaquo;</span>
        <span className="font-medium text-humana-ink">{t.admin.nav.settings}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
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

      {/* Section 1 — Admin Profile (editable) */}
      <div className="mb-8 rounded-xl border border-humana-line bg-white p-8 animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
        <h2 className="mb-6 text-[15px] font-semibold text-humana-ink">
          {t.admin.settings.profile}
        </h2>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.settings.adminName}
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="rounded-lg border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.settings.supportEmail}
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="rounded-lg border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile || !hasChanges}
            className="cursor-pointer rounded-lg bg-humana-ink px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {savingProfile ? t.admin.settings.saving : t.admin.settings.save}
          </button>
        </div>
      </div>

      {/* Section 2 — Commission Rates (read-only) */}
      <div className="mb-8 rounded-xl border border-humana-line bg-white p-8 animate-[fade-in-up_0.4s_ease-out_0.15s_both]">
        <h2 className="mb-6 text-[15px] font-semibold text-humana-ink">
          {t.admin.settings.commissions}
        </h2>
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
        <p className="mt-5 flex items-center gap-2 text-[12px] text-humana-muted">
          <svg className="h-4 w-4 shrink-0 text-humana-subtle" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {t.admin.settings.ratesNote}
        </p>
      </div>

      {/* Section 3 — Countries & Regions */}
      <div className="rounded-xl border border-humana-line bg-white p-8 animate-[fade-in-up_0.4s_ease-out_0.2s_both]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-humana-ink">
            {t.admin.settings.countriesTitle}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-humana-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-humana-ink/90 hover:shadow-md"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t.admin.settings.addCountry}
          </button>
        </div>

        <p className="mb-6 flex items-center gap-2 text-[12px] text-humana-muted">
          <svg className="h-4 w-4 shrink-0 text-humana-subtle" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {t.admin.settings.enabledHint}
        </p>

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
            <div className="grid grid-cols-[1fr_100px_60px] items-center gap-3 border-b border-humana-line px-2 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.country}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.settings.enabled}</span>
              <span />
            </div>

            {/* Table rows */}
            {countries.map((country) => (
              <div
                key={country.id}
                className={`grid grid-cols-[1fr_100px_60px] items-center gap-3 border-b border-humana-line/50 px-2 py-4 transition-colors hover:bg-humana-stone/30 ${
                  !country.enabled ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[20px] leading-none">{country.flag_emoji || "\u{1F3F3}\u{FE0F}"}</span>
                  <span className="text-[14px] font-medium text-humana-ink">{country.name}</span>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setTogglingCountry(country)}
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
                <div className="flex justify-center">
                  <button
                    onClick={() => setDeletingCountry(country)}
                    className="cursor-pointer rounded-lg p-1.5 text-humana-muted transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Country Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]" onClick={() => !creatingCountry && setShowAddModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-[400px] rounded-xl bg-white p-8 shadow-2xl animate-[modal-enter_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-6 text-[18px] font-semibold text-humana-ink">
              {t.admin.settings.addCountryTitle}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                  {t.admin.settings.countryName}
                </label>
                <div className="flex items-center gap-3">
                  {detectedCode ? (
                    <span className="text-[32px] leading-none">{codeToFlag(detectedCode)}</span>
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-stone text-[16px] text-humana-muted">🏳️</span>
                  )}
                  <input
                    type="text"
                    value={newCountryName}
                    onChange={(e) => {
                      setNewCountryName(e.target.value);
                      const code = nameToCode(e.target.value);
                      setNewCountryCode(code);
                    }}
                    placeholder="España, Brazil, Thailand..."
                    autoFocus
                    className="flex-1 rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  />
                </div>
              </div>

            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={creatingCountry}
                className="flex-1 cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-center text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-50"
              >
                {t.admin.settings.cancel}
              </button>
              <button
                onClick={handleCreateCountry}
                disabled={creatingCountry || !newCountryName.trim() || !detectedCode}
                className="flex-1 cursor-pointer rounded-lg bg-humana-ink px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {creatingCountry ? t.admin.settings.creating : t.admin.settings.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Enable/Disable Confirmation Modal */}
      {togglingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]" onClick={() => togglingId === null && setTogglingCountry(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-[420px] rounded-xl bg-white p-8 shadow-2xl animate-[modal-enter_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[28px] leading-none">{togglingCountry.flag_emoji || "\u{1F3F3}\u{FE0F}"}</span>
              <div>
                <h2 className="text-[16px] font-semibold text-humana-ink">
                  {togglingCountry.name}
                </h2>
                <p className="text-[12px] text-humana-muted">
                  {togglingCountry.enabled
                    ? t.admin.settings.confirmDisableHint
                    : t.admin.settings.confirmEnableHint}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTogglingCountry(null)}
                disabled={togglingId !== null}
                className="flex-1 cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-center text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-50"
              >
                {t.admin.settings.cancel}
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={togglingId !== null}
                className={`flex-1 cursor-pointer rounded-lg px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                  togglingCountry.enabled
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {togglingCountry.enabled ? t.admin.settings.disable : t.admin.settings.enable}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Country — GitHub-style Confirmation Modal */}
      {deletingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]" onClick={() => !deleting && closeDeleteModal()}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-[480px] rounded-xl bg-white shadow-2xl animate-[modal-enter_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            {/* Red top bar */}
            <div className="rounded-t-xl border-b border-red-200 bg-red-50 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-red-900">
                    {t.admin.settings.deleteCountry}
                  </h2>
                  <p className="text-[13px] text-red-700">
                    {deletingCountry.flag_emoji} {deletingCountry.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              {/* Warning */}
              <p className="mb-6 text-[13px] leading-relaxed text-humana-muted">
                {t.admin.settings.deleteCountryWarning}
              </p>

              {/* Confirmation text input */}
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-humana-ink">
                  {t.admin.settings.deleteCountryType(deletingCountry.name)}
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={deletingCountry.name}
                  className="rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-red-400"
                />
              </div>

              {/* Password input */}
              <div className="mb-5 flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-humana-ink">
                  {t.admin.settings.deleteCountryPassword}
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-red-400"
                />
              </div>

              {/* Error */}
              {deleteError && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-[12px] text-red-600">
                  {deleteError}
                </p>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-center text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-50"
                >
                  {t.admin.settings.cancel}
                </button>
                <button
                  onClick={handleDeleteCountry}
                  disabled={deleting || !deleteConfirmValid}
                  className="flex-1 cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting ? t.admin.settings.deleting : t.admin.settings.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
