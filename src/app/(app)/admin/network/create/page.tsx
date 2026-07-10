/** Admin — Create/Invite new member (full page). */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import { ApiError } from "@/lib/api";
import type { Organization, Country as ApiCountry } from "@/lib/types";

type Role = "agency" | "hotel" | "office";

/* ── Confetti colours ── */
const CONFETTI_COLORS = [
  "#d4af37", "#f5ecd0", "#e8d48b", "#c5a030",
  "#4ade80", "#60a5fa", "#f472b6", "#a78bfa",
  "#fb923c", "#facc15",
];

export default function CreateUserPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state — default role from URL query param
  const initialRole = (searchParams.get("role") as Role) || "agency";
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [officeId, setOfficeId] = useState<number | "">("");
  const [offices, setOffices] = useState<Organization[]>([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Custom dropdown state
  const [countryOpen, setCountryOpen] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<HTMLDivElement>(null);

  // Success modal
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const sentEmail = useRef("");
  const sentRole = useRef<Role>("agency");

  // Duplicate email warning modal
  const [duplicateKind, setDuplicateKind] = useState<"already_invited" | "already_registered" | null>(null);

  // Countries from backend API
  const [apiCountries, setApiCountries] = useState<ApiCountry[]>([]);

  // Fetch office organizations + countries from backend
  const fetchOffices = useCallback(async () => {
    try {
      const [orgRes, countriesRes] = await Promise.all([
        adminApi.listOrganizations({ kind: "office", per_page: 100 }),
        adminApi.listCountries({ enabled: "true" }),
      ]);
      setOffices(orgRes.organizations);
      setApiCountries(countriesRes.countries);
    } catch {
      // fail silently
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  // Auto-assign office based on country selection
  useEffect(() => {
    if (country && offices.length > 0) {
      const matchingOffice = offices.find(
        (o) => o.country_code?.toUpperCase() === country.toUpperCase()
      );
      if (matchingOffice) {
        setOfficeId(matchingOffice.id);
      }
    }
  }, [country, offices]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (officeRef.current && !officeRef.current.contains(e.target as Node)) setOfficeOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /** Get the selected country flag */
  function getCountryFlag(): string {
    if (!country) return "";
    const found = apiCountries.find((c) => c.code === country);
    return found?.flag_emoji || "";
  }

  /** Get the selected country name */
  function getCountryName(): string {
    if (!country) return "--";
    const found = apiCountries.find((c) => c.code === country);
    return found ? found.name : country;
  }

  /** Get the selected office name */
  function getOfficeName(): string {
    if (!officeId) return "--";
    const found = offices.find((o) => o.id === officeId);
    return found ? found.name : "--";
  }

  function closeModal() {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 200);
    setTimeout(() => {
      router.push("/admin/network");
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const invitePayload: Record<string, unknown> = {
        email,
        role: "owner",
      };

      // All roles: create a NEW org with the correct kind.
      invitePayload.org_kind = role;
      invitePayload.org_name = role === "office" && country
        ? `HUMANA ${apiCountries.find(c => c.code === country)?.name || country}`
        : email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      if (country) invitePayload.country_code = country;
      if (role !== "office" && officeId) invitePayload.assigned_office_id = Number(officeId);

      await adminApi.inviteUser(invitePayload as Parameters<typeof adminApi.inviteUser>[0]);
      sentEmail.current = email;
      sentRole.current = role;
      setShowModal(true);
    } catch (err) {
      if (err instanceof ApiError && (err.message === "already_invited" || err.message === "already_registered")) {
        setDuplicateKind(err.message);
      } else {
        setError(err instanceof ApiError ? err.message : "Failed to send invitation");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const roleOptions: { value: Role; label: string }[] = [
    { value: "agency", label: t.admin.invite.roles.agency },
    { value: "hotel", label: t.admin.invite.roles.hotel },
    { value: "office", label: t.admin.invite.roles.office },
  ];

  /* ── Role-specific labels for the modal ── */
  const roleLabel: Record<string, Record<Role, string>> = {
    en: { agency: "agency", hotel: "hotel", office: "office" },
    es: { agency: "agencia", hotel: "hotel", office: "oficina" },
    pt: { agency: "agência", hotel: "hotel", office: "escritório" },
  };

  const modalTitle: Record<string, string> = {
    en: "Invitation sent!",
    es: "Invitación enviada!",
    pt: "Convite enviado!",
  };

  const modalBody = (addr: string, r: Role): string => {
    const labels: Record<string, (a: string, rl: string) => string> = {
      en: (a, rl) => `An invitation link has been sent to ${a} to join as ${rl}.`,
      es: (a, rl) => `Se envió un enlace de invitación a ${a} para unirse como ${rl}.`,
      pt: (a, rl) => `Um link de convite foi enviado para ${a} para entrar como ${rl}.`,
    };
    const fn = labels[locale] || labels.en;
    const rl = (roleLabel[locale] || roleLabel.en)[r];
    return fn(addr, rl);
  };

  const hotelNote: Record<string, string> = {
    en: "Once they complete their profile and upload their property details, you'll need to review and approve their listing before it goes live.",
    es: "Una vez que completen su perfil y suban los datos de su propiedad, deberás revisar y aprobar su publicación antes de que se active.",
    pt: "Depois que completarem o perfil e enviarem os dados da propriedade, você precisará revisar e aprovar o anúncio antes de ativá-lo.",
  };

  return (
    <div className="mx-auto max-w-[1400px] px-16 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[12px] animate-[fade-in-up_0.4s_ease-out]">
        <Link
          href="/admin/network"
          className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink"
        >
          {t.admin.nav.network}
        </Link>
        <span className="text-humana-subtle">&rsaquo;</span>
        <span className="font-medium text-humana-ink">{t.admin.invite.breadcrumb}</span>
      </nav>

      {/* Eyebrow + Title */}
      <div className="mb-10 animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {t.admin.invite.eyebrow}
        </span>
        <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
          {t.admin.invite.title}
        </h1>
        <p className="mt-1 text-[14px] text-humana-muted">
          {t.admin.invite.subtitle}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_380px] gap-16 animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
        {/* Left column — Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* ROLE selection */}
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
              {t.admin.invite.selectRole}
            </label>
            <div className="flex gap-3">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setRole(opt.value); setOfficeId(""); }}
                  className={`cursor-pointer flex flex-1 items-center gap-3 rounded-lg border bg-white px-5 py-3.5 text-[14px] font-medium transition-all duration-200 ${
                    role === opt.value
                      ? "border-humana-gold text-humana-ink shadow-[0_0_0_1px_#d4af37]"
                      : "border-humana-line text-humana-muted hover:border-humana-gold/40"
                  }`}
                >
                  {/* Radio indicator */}
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      role === opt.value
                        ? "border-humana-gold"
                        : "border-humana-line"
                    }`}
                  >
                    {role === opt.value && (
                      <span className="h-2 w-2 rounded-full bg-humana-gold" />
                    )}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* EMAIL ADDRESS */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
              {t.admin.invite.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.admin.invite.emailPlaceholder}
              className="rounded-lg border border-humana-line bg-white px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
            <p className="text-[12px] text-humana-muted">{t.admin.invite.emailHint}</p>
          </div>

          {/* COUNTRY — custom dropdown with flags */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
              {t.admin.invite.country}
            </label>
            <div className="relative" ref={countryRef}>
              <button
                type="button"
                onClick={() => { setCountryOpen(!countryOpen); setOfficeOpen(false); }}
                className={`cursor-pointer flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-[15px] transition-colors ${
                  countryOpen ? "border-humana-gold" : "border-humana-line hover:border-humana-gold/40"
                }`}
              >
                <span className={`flex items-center gap-2.5 ${country ? "text-humana-ink" : "text-humana-subtle"}`}>
                  {country ? (
                    <>
                      <span className="text-[18px] leading-none">{getCountryFlag()}</span>
                      {getCountryName()}
                    </>
                  ) : (
                    <span>{locale === "es" ? "Seleccionar país" : locale === "pt" ? "Selecionar país" : "Select country"}</span>
                  )}
                </span>
                <svg className={`h-4 w-4 text-humana-muted transition-transform duration-200 ${countryOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {countryOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[260px] overflow-y-auto rounded-lg border border-humana-line bg-white py-1 shadow-lg animate-[fade-in-up_0.15s_ease-out]">
                  {apiCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { setCountry(c.code); setCountryOpen(false); }}
                      className={`cursor-pointer flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] transition-colors ${
                        country === c.code
                          ? "bg-humana-gold-light/50 font-medium text-humana-ink"
                          : "text-humana-ink hover:bg-humana-stone"
                      }`}
                    >
                      <span className="text-[18px] leading-none">{c.flag_emoji || ""}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Divider + Assigned Office — only shown for agency/hotel roles */}
          {role !== "office" && (
            <>
              <hr className="border-humana-line" />

              {/* ASSIGNED OFFICE — custom dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
                  {t.admin.invite.office}
                </label>
                <div className="relative" ref={officeRef}>
                  <button
                    type="button"
                    onClick={() => { setOfficeOpen(!officeOpen); setCountryOpen(false); }}
                    className={`cursor-pointer flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-[15px] transition-colors ${
                      officeOpen ? "border-humana-gold" : "border-humana-line hover:border-humana-gold/40"
                    }`}
                  >
                    <span className={`flex items-center gap-2.5 ${officeId ? "text-humana-ink" : "text-humana-subtle"}`}>
                      {officeId ? (
                        <>
                          <svg className="h-4 w-4 shrink-0 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                          </svg>
                          {getOfficeName()}
                        </>
                      ) : (
                        <span>{locale === "es" ? "Seleccionar oficina" : locale === "pt" ? "Selecionar escritório" : "Select office"}</span>
                      )}
                    </span>
                    <svg className={`h-4 w-4 text-humana-muted transition-transform duration-200 ${officeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {officeOpen && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[260px] overflow-y-auto rounded-lg border border-humana-line bg-white py-1 shadow-lg animate-[fade-in-up_0.15s_ease-out]">
                      {offices.length === 0 ? (
                        <div className="px-4 py-3 text-[13px] text-humana-muted">
                          {locale === "es" ? "No hay oficinas disponibles" : locale === "pt" ? "Nenhum escritório disponível" : "No offices available"}
                        </div>
                      ) : (
                        offices.map((office) => (
                          <button
                            key={office.id}
                            type="button"
                            onClick={() => { setOfficeId(office.id); setOfficeOpen(false); }}
                            className={`cursor-pointer flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] transition-colors ${
                              officeId === office.id
                                ? "bg-humana-gold-light/50 font-medium text-humana-ink"
                                : "text-humana-ink hover:bg-humana-stone"
                            }`}
                          >
                            <svg className="h-4 w-4 shrink-0 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            <div className="min-w-0">
                              <span className="block truncate">{office.name}</span>
                              {office.city && (
                                <span className="block text-[11px] text-humana-muted">{office.city}{office.country ? `, ${office.country}` : ""}</span>
                              )}
                            </div>
                            {officeId === office.id && (
                              <svg className="ml-auto h-4 w-4 shrink-0 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[12px] text-humana-muted">{t.admin.invite.officeHint}</p>
              </div>
            </>
          )}

          {/* Error message */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-[13px] text-red-600 animate-[fade-in-up_0.2s_ease-out]">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !email}
              className="cursor-pointer flex items-center gap-2.5 rounded-lg bg-humana-ink px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black hover:shadow-lg disabled:opacity-60"
            >
              {submitting ? t.admin.invite.sending : t.admin.invite.send}
              {!submitting && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Right column — Invite Preview card */}
        <div className="self-start">
          <div className="rounded-xl border border-humana-line bg-white p-8">
            <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.admin.invite.preview}
            </h3>

            <div className="flex flex-col gap-4">
              <PreviewRow label={t.admin.invite.previewRole} value={role ? t.admin.invite.roles[role] : "--"} />
              <PreviewRow label={t.admin.invite.previewEmail} value={email || "--"} />
              <PreviewRow label={t.admin.invite.previewCountry} value={getCountryName()} />
              {role !== "office" && (
                <PreviewRow label={t.admin.invite.previewOffice} value={getOfficeName()} />
              )}
              <PreviewRow label={t.admin.invite.previewExpires} value={t.admin.invite.previewExpiresValue} bold />
              <PreviewRow
                label={t.admin.invite.previewApproval}
                value={role === "hotel"
                  ? (locale === "es" ? "Requiere revisión" : locale === "pt" ? "Requer revisão" : "Requires review")
                  : t.admin.invite.previewApprovalValue
                }
                highlight={role !== "hotel"}
                warning={role === "hotel"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Duplicate Email Warning Modal ── */}
      {duplicateKind && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]"
          onClick={() => setDuplicateKind(null)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative z-10 w-full max-w-[440px] rounded-xl bg-white p-8 shadow-2xl animate-[modal-enter_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h2 className="mb-2 text-[18px] font-semibold text-humana-ink">
              {duplicateKind === "already_invited"
                ? (locale === "es" ? "Invitación ya enviada" : locale === "pt" ? "Convite já enviado" : "Invitation already sent")
                : (locale === "es" ? "Usuario ya registrado" : locale === "pt" ? "Usuário já registrado" : "User already registered")}
            </h2>

            <p className="mb-5 text-[14px] leading-relaxed text-humana-muted">
              {duplicateKind === "already_invited"
                ? (locale === "es"
                    ? `Ya se envió una invitación a ${email}. Puedes reenviarla desde la sección de invitaciones si es necesario.`
                    : locale === "pt"
                      ? `Já foi enviado um convite para ${email}. Você pode reenviá-lo na seção de convites, se necessário.`
                      : `An invitation has already been sent to ${email}. You can resend it from the invitations section if needed.`)
                : (locale === "es"
                    ? `El email ${email} ya está registrado en la plataforma y no puede recibir otra invitación.`
                    : locale === "pt"
                      ? `O email ${email} já está registrado na plataforma e não pode receber outro convite.`
                      : `The email ${email} is already registered on the platform and cannot receive another invitation.`)}
            </p>

            {/* Email badge */}
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3">
              <svg className="h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="text-[13px] font-medium text-humana-ink">{email}</span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDuplicateKind(null);
                  router.push("/admin/network");
                }}
                className="cursor-pointer rounded-lg bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-black"
              >
                {locale === "es" ? "Entendido" : locale === "pt" ? "Entendido" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal with Confetti ── */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${closing ? "animate-[fade-out_0.25s_ease-in_forwards]" : "animate-[fade-in_0.2s_ease-out]"}`}
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Confetti layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }, (_, i) => {
              const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
              const left = 30 + Math.random() * 40;
              const delay = Math.random() * 0.6;
              const duration = 1.2 + Math.random() * 1.2;
              const size = 4 + Math.random() * 6;
              const rotation = Math.random() * 360;
              const xDrift = -120 + Math.random() * 240;
              return (
                <span
                  key={i}
                  className="absolute rounded-sm"
                  style={{
                    left: `${left}%`,
                    top: "40%",
                    width: `${size}px`,
                    height: `${size * (0.4 + Math.random() * 0.6)}px`,
                    backgroundColor: color,
                    opacity: 0,
                    transform: `rotate(${rotation}deg)`,
                    animation: `confetti-burst ${duration}s ${delay}s ease-out forwards`,
                    // @ts-expect-error css custom props
                    "--x-drift": `${xDrift}px`,
                  }}
                />
              );
            })}
          </div>

          {/* Modal card */}
          <div
            className={`relative z-10 w-full max-w-[420px] rounded-xl bg-white p-10 text-center shadow-2xl ${closing ? "animate-[modal-exit_0.25s_ease-in_forwards]" : "animate-[modal-enter_0.35s_ease-out]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Check circle */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 animate-[fade-in-scale_0.4s_ease-out_0.1s_both]">
              <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="mb-2 text-[20px] font-semibold text-humana-ink animate-[fade-in-up_0.3s_ease-out_0.15s_both]">
              {modalTitle[locale] || modalTitle.en}
            </h2>

            <p className="mb-2 text-[14px] leading-relaxed text-humana-muted animate-[fade-in-up_0.3s_ease-out_0.2s_both]">
              {modalBody(sentEmail.current, sentRole.current)}
            </p>

            {/* Hotel-specific note */}
            {sentRole.current === "hotel" && (
              <div className="mx-auto mt-4 max-w-[340px] rounded-lg bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-700 animate-[fade-in-up_0.3s_ease-out_0.25s_both]">
                <span className="mr-1 font-semibold">
                  {locale === "es" ? "Nota:" : locale === "pt" ? "Nota:" : "Note:"}
                </span>
                {hotelNote[locale] || hotelNote.en}
              </div>
            )}

            {/* Email badge */}
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-humana-stone px-4 py-2 animate-[fade-in-up_0.3s_ease-out_0.3s_both]">
              <svg className="h-3.5 w-3.5 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="text-[12px] font-medium text-humana-ink">{sentEmail.current}</span>
            </div>

            {/* CTA */}
            <div className="mt-8 animate-[fade-in-up_0.3s_ease-out_0.35s_both]">
              <button
                onClick={closeModal}
                className="cursor-pointer rounded-lg bg-humana-ink px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black"
              >
                {locale === "es" ? "Volver a la red" : locale === "pt" ? "Voltar à rede" : "Back to Network"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function PreviewRow({
  label,
  value,
  bold,
  highlight,
  warning,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-humana-line/50 pb-3">
      <span className="text-[13px] text-humana-muted">{label}</span>
      <span
        className={`text-[13px] ${
          warning
            ? "font-medium text-amber-600"
            : highlight
              ? "font-medium text-emerald-600"
              : bold
                ? "font-semibold text-humana-ink"
                : "font-medium text-humana-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
