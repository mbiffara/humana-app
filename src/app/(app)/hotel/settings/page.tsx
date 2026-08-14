/** Hotel workspace — settings (HT-07).
 *  Sidebar with 4 tabs: Profile, Account, Subscription, Payments.
 *  Matches Paper design: HT-07 · Settings. */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { api } from "@/lib/api";
import { hotelApi, type HotelProfile, type OrgProfile } from "@/lib/api/hotel";
import { uploadImage } from "@/lib/upload";
import PlacesAutocomplete, { type PlaceResult } from "@/components/PlacesAutocomplete";
import { TimePicker } from "@/components/TimePicker";
import { StarRating } from "@/components/StarRating";
import { AMENITY_CATALOG, amenityIdForName } from "@/lib/amenity-catalog";
import type { SubscriptionPlan, Subscription } from "@/lib/types";

type SettingsTab = "profile" | "property" | "account" | "subscription" | "payments";

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
    key: "property",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h1M9 13h1M14 9h1M14 13h1" />
        <path d="M10 21v-4h4v4" />
      </svg>
    ),
  },
  {
    key: "account",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    key: "subscription",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    key: "payments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

/* ─── Modals ─── */

function PasswordResetModal({ email, onClose, ts }: { email: string; onClose: () => void; ts: ReturnType<typeof useLocale>["t"]["hotelWs"]["settings"]["account"] }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      await api.post("/auth/request_password_reset", { auth: { email } });
      setSent(true);
    } catch {
      // still show success to avoid leaking email existence
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 animate-[backdrop-fade-in_0.2s_ease]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white p-8 shadow-2xl animate-[fade-in-scale_0.25s_ease]">
        {sent ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-[18px] font-semibold text-humana-ink">{ts.passwordModalSent}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-humana-muted">{ts.passwordModalSentHint}</p>
            <button onClick={onClose} className="mt-6 cursor-pointer bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85">
              OK
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-humana-ink">{ts.passwordModalTitle}</h3>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-humana-muted">{ts.passwordModalHint}</p>
            <div className="mt-5 flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">{ts.currentEmail}</label>
              <input type="email" value={email} readOnly className="w-full border border-humana-line bg-humana-stone/50 px-3.5 py-2.5 text-[14px] text-humana-ink outline-none" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleSend} disabled={sending} className="cursor-pointer flex-1 bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-40">
                {sending ? ts.passwordModalSending : ts.passwordModalSend}
              </button>
              <button onClick={onClose} className="cursor-pointer text-[13px] text-humana-muted transition-colors hover:text-humana-ink">
                {ts.deactivateModalCancel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeactivateModal({ onConfirm, onClose, ts }: { onConfirm: () => void; onClose: () => void; ts: ReturnType<typeof useLocale>["t"]["hotelWs"]["settings"]["account"] }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 animate-[backdrop-fade-in_0.2s_ease]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white p-8 shadow-2xl animate-[fade-in-scale_0.25s_ease]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 className="text-[18px] font-semibold text-humana-ink">{ts.deactivateModalTitle}</h3>
        </div>
        <div className="mt-4 rounded border border-amber-200 bg-amber-50/50 p-4">
          <p className="text-[13px] leading-relaxed text-humana-ink">{ts.deactivateModalWarning}</p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={onClose} disabled={loading} className="cursor-pointer flex-1 border border-humana-line bg-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-humana-ink transition-colors hover:bg-humana-stone disabled:opacity-40">
            {ts.deactivateModalCancel}
          </button>
          <button onClick={handleConfirm} disabled={loading} className="cursor-pointer flex-1 bg-red-600 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85 disabled:opacity-40">
            {loading ? ts.deactivateModalProcessing : ts.deactivateModalConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ onConfirm, onClose, ts }: { onConfirm: () => void; onClose: () => void; ts: ReturnType<typeof useLocale>["t"]["hotelWs"]["settings"]["account"] }) {
  const [step, setStep] = useState(1);
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  const phraseMatch = phrase.trim().toLowerCase() === ts.deleteModalConfirmPhrase.toLowerCase();

  async function handleDelete() {
    setLoading(true);
    await onConfirm();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 animate-[backdrop-fade-in_0.2s_ease]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white p-8 shadow-2xl animate-[fade-in-scale_0.25s_ease]">
        {step === 1 ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-humana-ink">{ts.deleteModalTitle}</h3>
            </div>
            <div className="mt-4 rounded border border-red-200 bg-red-50/50 p-4">
              <p className="text-[13px] leading-relaxed text-humana-ink">{ts.deleteModalWarningStep1}</p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onClose} className="cursor-pointer flex-1 border border-humana-line bg-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-humana-ink transition-colors hover:bg-humana-stone">
                {ts.deleteModalCancel}
              </button>
              <button onClick={() => setStep(2)} className="cursor-pointer flex-1 bg-red-600 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85">
                {ts.deleteModalContinue}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-humana-ink">{ts.deleteModalTitle}</h3>
            </div>
            <p className="mt-4 text-[14px] text-humana-muted">{ts.deleteModalStep2Hint}</p>
            <div className="mt-3 rounded border border-humana-line bg-humana-stone/50 px-3.5 py-2.5">
              <p className="text-[14px] font-mono font-medium text-humana-ink">{ts.deleteModalConfirmPhrase}</p>
            </div>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder={ts.deleteModalConfirmPhrase}
              className="mt-3 w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-red-400"
            />
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onClose} disabled={loading} className="cursor-pointer flex-1 border border-humana-line bg-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-humana-ink transition-colors hover:bg-humana-stone disabled:opacity-40">
                {ts.deleteModalCancel}
              </button>
              <button onClick={handleDelete} disabled={!phraseMatch || loading} className="cursor-pointer flex-1 bg-red-600 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85 disabled:opacity-40">
                {loading ? ts.deleteModalDeleting : ts.deleteModalDeleteForever}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function HotelSettingsPage() {
  const { t } = useLocale();
  const { user, logout, refreshAuth } = useAuth();
  const ts = t.hotelWs.settings;
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get("tab") as SettingsTab) || "profile";
  const [tab, setTab] = useState<SettingsTab>(initialTab);
  const [profile, setProfile] = useState<HotelProfile | null>(null);
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Profile form
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Property form
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [propertySaving, setPropertySaving] = useState(false);

  // Account modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Subscription
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [selectingPlanId, setSelectingPlanId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Payments (bank details)
  const [bankHolder, setBankHolder] = useState("");
  const [bankIban, setBankIban] = useState("");
  const [bankSwift, setBankSwift] = useState("");
  const [bankCurrency, setBankCurrency] = useState("USD");
  const [bankCountry, setBankCountry] = useState("");
  const [bankStatus, setBankStatus] = useState("pending");
  const [bankSaving, setBankSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await hotelApi.getProfile();
      const h = res.hotel;
      const org = res.organization;
      setOrgProfile(org);
      if (h) {
        setProfile(h);
        setName(h.name ?? "");
        setAddress(h.address ?? "");
        setCity(h.city ?? "");
        setCountry(h.country ?? "");
        setCountryCode(h.country_code ?? "");
        setContactEmail(h.contact_email ?? "");
        setPhone(h.phone ?? "");
        setLogoUrl(h.logo_url ?? null);
        // Property tab
        setDescription(h.description ?? "");
        setStars(h.stars ?? 0);
        setCheckInTime(h.check_in_time ?? "15:00");
        setCheckOutTime(h.check_out_time ?? "11:00");
        const ids: string[] = [];
        const custom: string[] = [];
        for (const a of h.amenities ?? []) {
          const id = amenityIdForName(a.name);
          if (id) ids.push(id);
          else custom.push(a.name);
        }
        setAmenityIds(ids);
        setCustomAmenities(custom);
        setPhotos((h.images ?? []).map((img) => img.image_url));
      }
      // Bank details from org
      if (org) {
        setBankHolder(org.bank_account_holder ?? "");
        setBankIban(org.bank_iban ?? "");
        setBankSwift(org.bank_swift ?? "");
        setBankCurrency(org.bank_currency ?? "USD");
        setBankCountry(org.bank_country ?? "");
        setBankStatus(org.bank_status ?? "pending");
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    setSubLoading(true);
    try {
      const [plansRes, subRes] = await Promise.all([
        hotelApi.getSubscriptionPlans(),
        hotelApi.getSubscription(),
      ]);
      setPlans(plansRes.plans);
      setCurrentSub(subRes.subscription);
    } catch {
      // ignore
    } finally {
      setSubLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (tab === "subscription" && plans.length === 0) {
      loadSubscription();
    }
  }, [tab, plans.length, loadSubscription]);

  // Detect return from Stripe Checkout
  useEffect(() => {
    const stripeStatus = searchParams.get("stripe");
    if (stripeStatus === "success") {
      setTab("subscription");
      const sessionId = searchParams.get("session_id");
      // Clean up URL params immediately
      const url = new URL(window.location.href);
      url.searchParams.delete("stripe");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
      // Verify the checkout session to create subscription in DB, then refresh
      (async () => {
        if (sessionId) {
          try {
            await hotelApi.verifyCheckout(sessionId);
          } catch {
            // Webhook may have already created it — continue to load
          }
        }
        await loadSubscription();
        await refreshAuth();
      })();
    }
  }, [searchParams, loadSubscription, refreshAuth]);

  function showSaved() {
    setSavedMsg(ts.profile.saved);
    setTimeout(() => setSavedMsg(""), 2000);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await hotelApi.updateProfile({
        name,
        city,
        country,
        country_code: countryCode,
        address,
        contact_email: contactEmail,
        phone,
      });
      showSaved();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  function handlePlaceSelect(place: PlaceResult) {
    setAddress(place.address);
    setCity(place.city);
    setCountry(place.country);
    setCountryCode(place.country_code);
  }

  async function saveProperty() {
    setPropertySaving(true);
    try {
      const allAmenities = [
        ...amenityIds.map((id) => {
          const entry = AMENITY_CATALOG[id];
          return entry
            ? { name: entry.name, category: entry.category, featured: entry.featured }
            : { name: id, category: "general", featured: false };
        }),
        ...customAmenities.map((n) => ({ name: n, category: "general", featured: false })),
      ];
      await Promise.all([
        hotelApi.updateProfile({
          description,
          stars,
          check_in_time: checkInTime,
          check_out_time: checkOutTime,
        }),
        hotelApi.batchAmenities(allAmenities),
        hotelApi.batchImages(
          photos.filter((url) => url.startsWith("http")).map((url) => ({ image_url: url })),
        ),
      ]);
      showSaved();
    } catch {
      // ignore
    } finally {
      setPropertySaving(false);
    }
  }

  function addCustomAmenity() {
    const nameTrimmed = customInput.trim();
    if (!nameTrimmed) return;
    const exists =
      customAmenities.some((a) => a.toLowerCase() === nameTrimmed.toLowerCase()) ||
      amenityIdForName(nameTrimmed) != null;
    if (!exists) setCustomAmenities((prev) => [...prev, nameTrimmed]);
    setCustomInput("");
  }

  async function handleAddPhotos(files: FileList) {
    setUploadingPhotos(true);
    try {
      const uploads = await Promise.allSettled(Array.from(files).map((f) => uploadImage(f)));
      const urls = uploads
        .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
        .map((r) => r.value)
        .filter((url) => url.startsWith("http"));
      if (urls.length) setPhotos((prev) => [...prev, ...urls]);
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
      if (url.startsWith("http")) {
        await hotelApi.updateProfile({ logo_url: url });
        showSaved();
      }
    } catch {
      // ignore
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleDeactivate() {
    try {
      await api.post("/auth/deactivate");
      logout();
    } catch {
      // ignore
    }
  }

  async function handleDeleteAccount() {
    try {
      await api.delete("/auth/account");
      logout();
    } catch {
      // ignore
    }
  }

  async function handleSelectPlan(planId: number) {
    setSelectingPlanId(planId);
    try {
      const res = await hotelApi.selectPlan(planId);
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      if (res.subscription) {
        setCurrentSub(res.subscription);
        refreshAuth();
      }
    } catch {
      // ignore
    } finally {
      setSelectingPlanId(null);
    }
  }

  async function handleCancelSubscription() {
    setCancelling(true);
    try {
      const res = await hotelApi.cancelSubscription();
      setCurrentSub(res.subscription);
      setShowCancelModal(false);
      refreshAuth();
    } catch {
      // ignore
    } finally {
      setCancelling(false);
    }
  }

  async function saveBankDetails() {
    setBankSaving(true);
    try {
      const res = await hotelApi.updateProfile({
        // need to send a dummy hotel field to satisfy the hotel params requirement
        name: profile?.name ?? name,
      });
      // Also send org bank details — we use a raw api.patch for this
      await api.patch("/hotel/profile", {
        hotel: { name: profile?.name ?? name },
        organization: {
          bank_account_holder: bankHolder,
          bank_iban: bankIban,
          bank_swift: bankSwift,
          bank_currency: bankCurrency,
          bank_country: bankCountry,
        },
      });
      setBankStatus("configured");
      void res;
      showSaved();
    } catch {
      // ignore
    } finally {
      setBankSaving(false);
    }
  }

  const initials = profile?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "H";

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-14 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1.5 animate-fade-in-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {ts.eyebrow}
        </p>
        <h1 className="mt-1 text-[32px] font-light tracking-[-0.02em] text-humana-ink">
          {ts.title}
        </h1>
        <p className="text-[14px] text-humana-muted">{ts.subtitle}</p>
      </div>

      {/* Saved toast */}
      {savedMsg && (
        <div className="fixed right-8 top-24 z-50 rounded-lg bg-emerald-600 px-5 py-3 text-[13px] font-medium text-white shadow-lg animate-fade-in-up">
          {savedMsg}
        </div>
      )}

      {/* Modals */}
      {showPasswordModal && (
        <PasswordResetModal email={user?.email ?? ""} onClose={() => setShowPasswordModal(false)} ts={ts.account} />
      )}
      {showDeactivateModal && (
        <DeactivateModal onConfirm={handleDeactivate} onClose={() => setShowDeactivateModal(false)} ts={ts.account} />
      )}
      {showDeleteModal && (
        <DeleteModal onConfirm={handleDeleteAccount} onClose={() => setShowDeleteModal(false)} ts={ts.account} />
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        <nav className="w-[200px] shrink-0">
          <div className="sticky top-28 flex flex-col">
            {SIDEBAR_TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-all ${
                    isActive
                      ? "border border-humana-line bg-white font-semibold text-humana-ink"
                      : "border border-transparent text-humana-muted hover:text-humana-ink"
                  }`}
                >
                  <span className={isActive ? "text-humana-gold" : ""}>{t.icon}</span>
                  {ts.tabs[t.key]}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* ─── Profile tab ─── */}
          {tab === "profile" && (
            <div className="border border-humana-line bg-white p-7 animate-fade-in-up">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {ts.profile.eyebrow}
              </p>

              {/* Avatar + fields row */}
              <div className="mt-6 flex gap-5">
                {/* Avatar with upload */}
                <label className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full bg-humana-gold overflow-hidden transition-all hover:opacity-90">
                  {logoUrl ? (
                    <Image src={logoUrl} alt={name} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="text-[20px] font-semibold text-white">{initials}</span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploadingLogo ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>

                {/* Fields */}
                <div className="flex flex-1 flex-col gap-5">
                  <div className="flex gap-5">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                        {ts.profile.hotelName}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                        {ts.profile.location}
                      </label>
                      <PlacesAutocomplete
                        value={address}
                        onChange={(val) => setAddress(val)}
                        onPlaceSelect={handlePlaceSelect}
                        placeholder="Search location..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                        {ts.profile.contactEmail}
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                        {ts.profile.phone}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="cursor-pointer bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {saving ? ts.profile.saving : ts.profile.save}
                </button>
              </div>
            </div>
          )}

          {/* ─── Property tab ─── */}
          {tab === "property" && (
            <div className="border border-humana-line bg-white p-7 animate-fade-in-up">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {ts.property.eyebrow}
              </p>
              <h2 className="mt-2 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                {ts.property.title}
              </h2>
              <p className="mt-1 text-[14px] text-humana-muted">{ts.property.subtitle}</p>

              {/* Description + stars + times */}
              <div className="mt-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                    {ts.property.descriptionLabel}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full resize-y border border-humana-line px-3.5 py-2.5 text-[14px] leading-relaxed text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                  />
                </div>
                <div className="flex flex-wrap items-end gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.property.starsLabel}
                    </label>
                    <StarRating value={stars} onChange={setStars} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.property.checkInLabel}
                    </label>
                    <TimePicker value={checkInTime} onChange={setCheckInTime} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.property.checkOutLabel}
                    </label>
                    <TimePicker value={checkOutTime} onChange={setCheckOutTime} />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-8 border-t border-humana-line pt-6">
                <p className="text-[13px] font-semibold text-humana-ink">{ts.property.amenitiesTitle}</p>
                <p className="mt-0.5 text-[12px] text-humana-muted">{ts.property.amenitiesHint}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(AMENITY_CATALOG).map(([id, entry]) => {
                    const selected = amenityIds.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() =>
                          setAmenityIds((prev) =>
                            selected ? prev.filter((a) => a !== id) : [...prev, id],
                          )
                        }
                        className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${
                          selected
                            ? "border-humana-ink bg-humana-ink text-white"
                            : "border-humana-line bg-white text-humana-muted hover:border-humana-ink hover:text-humana-ink"
                        }`}
                      >
                        {entry.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-5 text-[12px] font-semibold text-humana-ink">{ts.property.customAmenities}</p>
                {customAmenities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {customAmenities.map((nameItem) => (
                      <button
                        key={nameItem}
                        onClick={() => setCustomAmenities((prev) => prev.filter((a) => a !== nameItem))}
                        className="group cursor-pointer flex items-center gap-2 rounded-full border border-humana-gold/50 bg-humana-gold-light px-4 py-2 text-[13px] text-humana-ink transition-all hover:border-humana-ink"
                      >
                        {nameItem}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50 transition-opacity group-hover:opacity-100">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                    placeholder={ts.property.customPlaceholder}
                    className="max-w-[340px] flex-1 rounded-full border border-humana-line bg-white px-4 py-2 text-[13px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/60 focus:border-humana-gold"
                  />
                  <button
                    onClick={addCustomAmenity}
                    disabled={!customInput.trim()}
                    className="cursor-pointer rounded-full bg-humana-ink px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {ts.property.addCustom}
                  </button>
                </div>
              </div>

              {/* Photos */}
              <div className="mt-8 border-t border-humana-line pt-6">
                <p className="text-[13px] font-semibold text-humana-ink">{ts.property.photosTitle}</p>
                <p className="mt-0.5 text-[12px] text-humana-muted">{ts.property.photosHint}</p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {photos.map((url, i) => (
                    <div key={`${url}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-[6px] bg-humana-stone">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
                      {i === 0 && (
                        <span className="absolute left-2 top-2 rounded bg-humana-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                          {ts.property.cover}
                        </span>
                      )}
                      <button
                        onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label="Remove photo"
                        className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[6px] border-2 border-dashed border-humana-line text-humana-muted transition-colors hover:border-humana-gold hover:text-humana-gold">
                    {uploadingPhotos ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                          {ts.property.addPhotos}
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files?.length) handleAddPhotos(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Save */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveProperty}
                  disabled={propertySaving || uploadingPhotos}
                  className="cursor-pointer bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {propertySaving ? ts.profile.saving : ts.profile.save}
                </button>
              </div>
            </div>
          )}

          {/* ─── Account tab ─── */}
          {tab === "account" && (
            <div className="border border-humana-line bg-white p-7 animate-fade-in-up">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {ts.account.eyebrow}
              </p>

              {/* Change password */}
              <div className="mt-6 flex flex-col gap-1.5">
                <h3 className="text-[15px] font-semibold text-humana-ink">
                  {ts.account.changePasswordTitle}
                </h3>
                <p className="text-[13px] leading-[18px] text-humana-muted">
                  {ts.account.changePasswordHint}
                </p>
              </div>

              <div className="mt-6 flex items-end gap-4">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                    {ts.account.currentEmail}
                  </label>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    readOnly
                    className="w-full border border-humana-line bg-humana-stone/50 px-3.5 py-2.5 text-[14px] text-humana-ink outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="shrink-0 cursor-pointer bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
                >
                  {ts.account.changePasswordTitle}
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-humana-line" />

              {/* Deactivate / Delete */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[15px] font-semibold text-humana-ink">
                  {ts.account.deactivateTitle}
                </h3>
                <p className="text-[13px] leading-[18px] text-humana-muted">
                  {ts.account.deactivateHint}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="cursor-pointer border border-humana-line bg-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-humana-gold transition-colors hover:bg-humana-stone"
                >
                  {ts.account.deactivateAction}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer border border-red-600 bg-white px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-red-600 transition-colors hover:bg-red-50"
                >
                  {ts.account.deleteAction}
                </button>
              </div>
            </div>
          )}

          {/* ─── Subscription tab ─── */}
          {tab === "subscription" && (
            <div className="border border-humana-line bg-white p-7 animate-fade-in-up">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {ts.subscription.eyebrow}
              </p>
              <h2 className="mt-2 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                {ts.subscription.title}
              </h2>
              <p className="mt-1 text-[14px] text-humana-muted">{ts.subscription.subtitle}</p>

              {user?.organization?.sponsored && (
                <div className="mt-6 flex items-start gap-3 border border-humana-gold bg-humana-gold-light p-5">
                  <svg className="mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                      {ts.subscription.sponsoredTitle}
                    </p>
                    <p className="mt-1 text-[14px] text-humana-ink leading-relaxed">
                      {ts.subscription.sponsoredBody}
                    </p>
                  </div>
                </div>
              )}

              {subLoading ? (
                <div className="mt-8 flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-3 gap-5">
                  {plans.map((plan) => {
                    const isCurrent = currentSub?.plan?.id === plan.id;
                    const isSelecting = selectingPlanId === plan.id;
                    const featureKeys = Object.keys(plan.features).filter((k) => plan.features[k]);

                    return (
                      <div
                        key={plan.id}
                        className={`flex flex-col border p-6 transition-all ${
                          isCurrent
                            ? "border-humana-gold bg-humana-gold-light/30 shadow-sm"
                            : "border-humana-line bg-humana-stone/30 hover:shadow-md hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Plan name + badge */}
                        <div className="flex items-start justify-between">
                          <h3 className="text-[16px] font-semibold text-humana-ink">{plan.name.replace("Hotel ", "")}</h3>
                          {isCurrent && (
                            <span className="rounded-full bg-humana-gold px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                              {ts.subscription.currentPlan}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-[28px] font-light text-humana-ink">
                            ${(plan.price_cents / 100).toFixed(0)}
                          </span>
                          <span className="text-[13px] text-humana-muted">{ts.subscription.perMonth}</span>
                        </div>

                        {/* Commission */}
                        <p className="mt-1 text-[12px] text-humana-subtle">
                          {(plan.commission_rate * 100).toFixed(0)}% {ts.subscription.commission}
                        </p>

                        {/* Features */}
                        <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                          {featureKeys.map((key) => (
                            <li key={key} className="flex items-start gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span className="text-[13px] text-humana-ink">
                                {ts.subscription.features[key] ?? key.replace(/_/g, " ")}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Action button */}
                        <div className="mt-6">
                          {isCurrent ? (
                            <div className="flex items-center justify-center py-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-humana-gold">
                              {ts.subscription.currentPlan}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSelectPlan(plan.id)}
                              disabled={isSelecting}
                              className="w-full cursor-pointer bg-humana-gold px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                            >
                              {isSelecting ? ts.subscription.selecting : ts.subscription.selectPlan}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cancel subscription */}
              {currentSub && currentSub.status === "active" && currentSub.plan.price_cents > 0 && (
                <div className="mt-8 border-t border-humana-line pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] text-humana-ink font-medium">
                        Cancel Subscription
                      </p>
                      <p className="text-[13px] text-humana-muted mt-0.5">
                        Your plan will remain active until the end of the current billing period.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="cursor-pointer border border-red-300 bg-white px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-red-600 transition-colors hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancel subscription modal */}
          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-md bg-white p-8 shadow-xl animate-fade-in-scale">
                <h3 className="text-[18px] font-semibold text-humana-ink">
                  Cancel Subscription?
                </h3>
                <p className="mt-3 text-[14px] text-humana-muted leading-relaxed">
                  Are you sure you want to cancel your subscription? You&apos;ll continue to have access until the end of your current billing period.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="cursor-pointer border border-humana-line px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-humana-muted transition-colors hover:bg-humana-stone"
                  >
                    Keep Plan
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="cursor-pointer bg-red-600 px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                  >
                    {cancelling ? "..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Payments tab ─── */}
          {tab === "payments" && (
            <div className="border border-humana-line bg-white p-7 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    {ts.payments.eyebrow}
                  </p>
                  <h2 className="mt-2 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                    {ts.payments.title}
                  </h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${
                  bankStatus === "configured"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {bankStatus === "configured" ? ts.payments.statusConfigured : ts.payments.statusPending}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-5">
                <div className="flex gap-5">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.payments.accountHolder}
                    </label>
                    <input
                      type="text"
                      value={bankHolder}
                      onChange={(e) => setBankHolder(e.target.value)}
                      className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.payments.iban}
                    </label>
                    <input
                      type="text"
                      value={bankIban}
                      onChange={(e) => setBankIban(e.target.value)}
                      className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                    />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.payments.swift}
                    </label>
                    <input
                      type="text"
                      value={bankSwift}
                      onChange={(e) => setBankSwift(e.target.value)}
                      className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.payments.currency}
                    </label>
                    <select
                      value={bankCurrency}
                      onChange={(e) => setBankCurrency(e.target.value)}
                      className="w-full border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="MXN">MXN</option>
                      <option value="BRL">BRL</option>
                      <option value="SGD">SGD</option>
                      <option value="IDR">IDR</option>
                    </select>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                      {ts.payments.country}
                    </label>
                    <input
                      type="text"
                      value={bankCountry}
                      onChange={(e) => setBankCountry(e.target.value)}
                      className="w-full border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveBankDetails}
                  disabled={bankSaving}
                  className="cursor-pointer bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {bankSaving ? ts.payments.saving : ts.payments.save}
                </button>
              </div>

              {/* Payments received section */}
              <div className="mt-8 border-t border-humana-line pt-6">
                <h3 className="text-[15px] font-semibold text-humana-ink">{ts.payments.paymentsReceived}</h3>
                <div className="mt-4 flex flex-col items-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-humana-gold-light">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <p className="mt-3 text-[13px] text-humana-muted">{ts.payments.noPayments}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
