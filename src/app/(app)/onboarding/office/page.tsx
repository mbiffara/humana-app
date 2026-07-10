/** Office onboarding — Step 2 of 2: office name + profile fields. */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { officeApi } from "@/lib/api/office";
import { api } from "@/lib/api";
import OnboardingHeader from "@/components/OnboardingHeader";
import PlacesAutocomplete, { type PlaceResult } from "@/components/PlacesAutocomplete";
import type { MeResponse } from "@/lib/types";

const STORAGE_KEY = "humana.onboarding.office";

interface FormData {
  orgName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  countryCode: string;
}

function loadDraft(): Partial<FormData> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(data: FormData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearDraft() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export default function OfficeOnboarding() {
  const { t } = useLocale();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const initialized = useRef(false);

  const [orgName, setOrgName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const allFilled = orgName.trim() && firstName.trim() && lastName.trim() && phone.trim() && address.trim();

  // Persist form data to sessionStorage on every change
  useEffect(() => {
    if (!initialized.current) return;
    saveDraft({ orgName, firstName, lastName, phone, address, city, country, countryCode });
  }, [orgName, firstName, lastName, phone, address, city, country, countryCode]);

  // Load: sessionStorage draft first, then fill gaps from API
  useEffect(() => {
    if (user?.organization?.onboarding_completed) {
      router.push("/dashboard");
      return;
    }

    async function load() {
      const draft = loadDraft();

      try {
        const res = await officeApi.getProfile();
        const org = res.organization;

        setOrgName(draft.orgName || org.name || "");
        if (draft.firstName !== undefined) {
          setFirstName(draft.firstName);
          setLastName(draft.lastName || "");
        } else if (org.primary_contact) {
          const parts = org.primary_contact.split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        }
        setPhone(draft.phone || org.phone || "");
        setAddress(draft.address || org.address || org.city || "");
        setCity(draft.city || org.city || "");
        setCountry(draft.country || org.country || "");
        setCountryCode(draft.countryCode || org.country_code || "");
      } catch {
        if (draft.orgName) setOrgName(draft.orgName);
        if (draft.firstName) setFirstName(draft.firstName);
        if (draft.lastName) setLastName(draft.lastName);
        if (draft.phone) setPhone(draft.phone);
        if (draft.address) setAddress(draft.address);
        if (draft.city) setCity(draft.city);
        if (draft.country) setCountry(draft.country);
        if (draft.countryCode) setCountryCode(draft.countryCode);
      } finally {
        initialized.current = true;
        setLoading(false);
      }
    }
    load();
  }, [user, router]);

  const handlePlaceSelect = useCallback((place: PlaceResult) => {
    setAddress(place.address);
    setCity(place.city);
    setCountry(place.country);
    setCountryCode(place.country_code);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    try {
      await officeApi.updateProfile(
        {
          name: orgName.trim(),
          primary_contact: fullName,
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          country_code: countryCode.trim(),
        },
        fullName,
      );
      clearDraft();
      const me = await api.get<MeResponse>("/auth/me");
      setUser(me.user);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-humana-stone">
      <OnboardingHeader role="office" currentStep={2} totalSteps={2} />

      <main className="flex flex-1 items-start justify-center px-6 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          </div>
        ) : (
          <div className="w-full max-w-[480px] animate-[fade-in-up_0.5s_ease-out]">
            <div className="rounded-[6px] bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                  {t.onboarding.header.office}
                </span>
                <span className="text-[11px] font-medium text-humana-subtle">
                  {t.onboarding.stepOf(2, 2)}
                </span>
              </div>
              <h1 className="mb-1 text-[24px] font-light tracking-[-0.01em] text-humana-ink">
                {t.onboarding.office.title}
              </h1>
              <p className="mb-8 text-[14px] text-humana-muted">{t.onboarding.office.subtitle}</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Office Name */}
                <Field label={t.onboarding.office.orgName}>
                  <input
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="HUMANA Argentina"
                    className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                  />
                </Field>

                {/* First Name + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t.onboarding.office.firstName}>
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                    />
                  </Field>
                  <Field label={t.onboarding.office.lastName}>
                    <input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Smith"
                      className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                    />
                  </Field>
                </div>

                <Field label={t.onboarding.office.phone}>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                  />
                </Field>

                <Field label={t.onboarding.office.address}>
                  <PlacesAutocomplete
                    required
                    value={address}
                    onChange={setAddress}
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Miami, FL, USA"
                  />
                </Field>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600 animate-[fade-in-up_0.2s_ease-out]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !allFilled}
                  className="cursor-pointer mt-2 flex items-center justify-center gap-3 rounded-lg bg-humana-ink px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      {t.onboarding.office.submit}
                      <svg
                        width="14"
                        height="9"
                        viewBox="0 0 16 10"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 5h14M10 1l4 4-4 4" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
