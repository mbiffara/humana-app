"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { officeApi } from "@/lib/api/office";
import type { User } from "@/lib/types";

type SettingsTab = "profile" | "payments";

const SIDEBAR_TABS: { key: SettingsTab; icon: React.ReactNode }[] = [
  {
    key: "profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "payments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

export default function OfficeSettingsPage() {
  const { t } = useLocale();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState<SettingsTab>("profile");

  return (
    <div className="mx-auto max-w-[1200px] px-10 py-12 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {t.officeWs.settings.eyebrow}
        </span>
        <h1 className="mt-2 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
          {t.officeWs.settings.title}
        </h1>
        <p className="mt-1 text-[15px] text-humana-muted">
          {t.officeWs.settings.subtitle}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <nav className="w-[200px] shrink-0">
          <div className="sticky top-28 flex flex-col">
            {SIDEBAR_TABS.map((s) => {
              const isActive = tab === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setTab(s.key)}
                  className={`cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-all ${
                    isActive
                      ? "border border-humana-line bg-white font-semibold text-humana-ink"
                      : "border border-transparent text-humana-muted hover:text-humana-ink"
                  }`}
                >
                  <span className={isActive ? "text-humana-gold" : ""}>{s.icon}</span>
                  {t.officeWs.settings.tabs[s.key]}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-8">
          {tab === "profile" ? (
            <ProfileTab user={user} setUser={setUser} />
          ) : (
            <PaymentsTab />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, setUser }: { user: ReturnType<typeof useAuth>["user"]; setUser: (u: User) => void }) {
  const { t } = useLocale();
  const [name, setName] = useState(user?.organization?.name || "");
  const [contactEmail, setContactEmail] = useState(user?.organization?.contact_email || user?.email || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(user?.organization?.city || "");
  const [country, setCountry] = useState(user?.organization?.country || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    officeApi.getProfile().then((res) => {
      const org = res.organization;
      setName(org.name || "");
      setContactEmail(org.contact_email || user?.email || "");
      setPhone(org.phone || "");
      setCity(org.city || "");
      setCountry(org.country || "");
    }).catch(() => {});
  }, [user?.email]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await officeApi.updateProfile({
        phone,
        city,
      } as Parameters<typeof officeApi.updateProfile>[0]);
      if (user) {
        setUser({ ...user, organization: { ...user.organization, ...res.organization } });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const readOnlyFields = [
    { label: t.officeWs.settings.profile.officeName, value: name },
    { label: t.officeWs.settings.profile.contactEmail, value: contactEmail },
  ];

  const editableFields = [
    { label: t.officeWs.settings.profile.phone, value: phone, onChange: setPhone },
    { label: t.officeWs.settings.profile.location, value: city, onChange: setCity },
  ];

  return (
    <div className="border border-humana-line bg-white p-7 animate-[fade-in-up_0.3s_ease-out]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
        {t.officeWs.settings.profile.eyebrow}
      </span>
      <div className="mt-6 space-y-5">
        {/* Read-only fields: Office Name, Email */}
        {readOnlyFields.map((f) => (
          <div key={f.label}>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {f.label}
            </label>
            <input
              type="text"
              readOnly
              value={f.value}
              className="w-full rounded-[6px] border border-humana-line bg-humana-stone/50 px-3.5 py-2.5 text-[14px] text-humana-muted"
            />
          </div>
        ))}

        {/* Editable fields: Phone, Location */}
        {editableFields.map((f) => (
          <div key={f.label}>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {f.label}
            </label>
            <input
              type="text"
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="w-full rounded-[6px] border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            />
          </div>
        ))}

        {/* Country (read-only) */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
            {t.officeWs.settings.profile.country}
          </label>
          <input
            type="text"
            readOnly
            value={country}
            className="w-full rounded-[6px] border border-humana-line bg-humana-stone/50 px-3.5 py-2.5 text-[14px] text-humana-muted"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer rounded-[6px] bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? t.officeWs.settings.profile.saving : t.officeWs.settings.profile.save}
          </button>
          {saved && (
            <span className="text-[13px] font-medium text-humana-gold animate-[fade-in-up_0.3s_ease-out]">
              {t.officeWs.settings.profile.saved}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const { t } = useLocale();
  const ts = t.officeWs.settings.payments;
  const [bankHolder, setBankHolder] = useState("");
  const [bankIban, setBankIban] = useState("");
  const [bankSwift, setBankSwift] = useState("");
  const [bankCurrency, setBankCurrency] = useState("USD");
  const [bankCountry, setBankCountry] = useState("");
  const [bankStatus, setBankStatus] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    officeApi.getProfile().then((res) => {
      const org = res.organization;
      setBankHolder(org.bank_account_holder || "");
      setBankIban(org.bank_iban || "");
      setBankSwift(org.bank_swift || "");
      setBankCurrency(org.bank_currency || "USD");
      setBankCountry(org.bank_country || "");
      setBankStatus(org.bank_status || "pending");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await officeApi.updateProfile({
        bank_account_holder: bankHolder,
        bank_iban: bankIban,
        bank_swift: bankSwift,
        bank_currency: bankCurrency,
        bank_country: bankCountry,
      } as Parameters<typeof officeApi.updateProfile>[0]);
      setBankStatus("configured");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-humana-line bg-white p-7 animate-[fade-in-up_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {ts.eyebrow}
          </span>
          <h2 className="mt-2 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
            {ts.title}
          </h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${
          bankStatus === "configured"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {bankStatus === "configured" ? ts.statusConfigured : ts.statusPending}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex gap-5">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {ts.accountHolder}
            </label>
            <input
              type="text"
              value={bankHolder}
              onChange={(e) => setBankHolder(e.target.value)}
              className="w-full rounded-[6px] border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {ts.iban}
            </label>
            <input
              type="text"
              value={bankIban}
              onChange={(e) => setBankIban(e.target.value)}
              className="w-full rounded-[6px] border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {ts.swift}
            </label>
            <input
              type="text"
              value={bankSwift}
              onChange={(e) => setBankSwift(e.target.value)}
              className="w-full rounded-[6px] border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {ts.currency}
            </label>
            <select
              value={bankCurrency}
              onChange={(e) => setBankCurrency(e.target.value)}
              className="w-full rounded-[6px] border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="ARS">ARS</option>
              <option value="MXN">MXN</option>
              <option value="BRL">BRL</option>
              <option value="SGD">SGD</option>
              <option value="IDR">IDR</option>
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
              {ts.country}
            </label>
            <input
              type="text"
              value={bankCountry}
              onChange={(e) => setBankCountry(e.target.value)}
              className="w-full rounded-[6px] border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer rounded-[6px] bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? ts.saving : ts.save}
        </button>
        {saved && (
          <span className="text-[13px] font-medium text-humana-gold animate-[fade-in-up_0.3s_ease-out]">
            {t.officeWs.settings.profile.saved}
          </span>
        )}
      </div>
    </div>
  );
}
