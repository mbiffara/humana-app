/** Office — Invite new hotel/agency member (mirrors admin create UI). */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { officeApi } from "@/lib/api/office";
import { ApiError } from "@/lib/api";

type OrgKind = "hotel" | "agency";

const CONFETTI_COLORS = [
  "#d4af37", "#f5ecd0", "#e8d48b", "#c5a030",
  "#4ade80", "#60a5fa", "#f472b6", "#a78bfa",
  "#fb923c", "#facc15",
];

export default function OfficeCreateUserPage() {
  const { t, locale } = useLocale();
  const { user } = useAuth();
  const router = useRouter();

  const countryCode = user?.organization?.country_code || "";
  const countryName = user?.organization?.country || "";
  const officeName = user?.organization?.name || "";

  // Form state
  const [orgKind, setOrgKind] = useState<OrgKind>("hotel");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Success modal
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const sentEmail = useRef("");
  const sentKind = useRef<OrgKind>("hotel");

  // Duplicate email warning modal
  const [duplicateKind, setDuplicateKind] = useState<"already_invited" | "already_registered" | null>(null);

  function closeModal() {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 200);
    setTimeout(() => {
      router.push("/office/network");
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await officeApi.inviteUser({
        email,
        org_name: orgName || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        org_kind: orgKind,
        country_code: countryCode,
      });
      sentEmail.current = email;
      sentKind.current = orgKind;
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

  const roleOptions: { value: OrgKind; label: string }[] = [
    { value: "hotel", label: t.officeWs.network.create.hotel },
    { value: "agency", label: t.officeWs.network.create.agency },
  ];

  const kindLabel: Record<string, Record<OrgKind, string>> = {
    en: { hotel: "hotel", agency: "agency" },
    es: { hotel: "hotel", agency: "agencia" },
    pt: { hotel: "hotel", agency: "agência" },
  };

  const modalTitle: Record<string, string> = {
    en: "Invitation sent!",
    es: "Invitación enviada!",
    pt: "Convite enviado!",
  };

  const modalBody = (addr: string, k: OrgKind): string => {
    const labels: Record<string, (a: string, rl: string) => string> = {
      en: (a, rl) => `An invitation link has been sent to ${a} to join as ${rl}. Awaiting admin approval.`,
      es: (a, rl) => `Se envió un enlace de invitación a ${a} para unirse como ${rl}. Esperando aprobación del admin.`,
      pt: (a, rl) => `Um link de convite foi enviado para ${a} para entrar como ${rl}. Aguardando aprovação do admin.`,
    };
    const fn = labels[locale] || labels.en;
    const rl = (kindLabel[locale] || kindLabel.en)[k];
    return fn(addr, rl);
  };

  const hotelNote: Record<string, string> = {
    en: "Once they complete their profile and upload their property details, an admin will need to review and approve their listing.",
    es: "Una vez que completen su perfil y suban los datos de su propiedad, un administrador deberá revisar y aprobar su publicación.",
    pt: "Depois que completarem o perfil e enviarem os dados da propriedade, um administrador precisará revisar e aprovar o anúncio.",
  };

  return (
    <div className="mx-auto max-w-[1400px] px-16 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[12px] animate-[fade-in-up_0.4s_ease-out]">
        <Link
          href="/office/network"
          className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink"
        >
          {t.officeWs.nav.network}
        </Link>
        <span className="text-humana-subtle">&rsaquo;</span>
        <span className="font-medium text-humana-ink">{t.officeWs.network.create.breadcrumb}</span>
      </nav>

      {/* Eyebrow + Title */}
      <div className="mb-10 animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {t.officeWs.network.create.eyebrow}
        </span>
        <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
          {t.officeWs.network.create.title}
        </h1>
        <p className="mt-1 text-[14px] text-humana-muted">
          {t.officeWs.network.create.subtitle}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_380px] gap-16 animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
        {/* Left column — Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* ROLE selection */}
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
              {t.officeWs.network.create.orgKind}
            </label>
            <div className="flex gap-3">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOrgKind(opt.value)}
                  className={`cursor-pointer flex flex-1 items-center gap-3 rounded-lg border bg-white px-5 py-3.5 text-[14px] font-medium transition-all duration-200 ${
                    orgKind === opt.value
                      ? "border-humana-gold text-humana-ink shadow-[0_0_0_1px_#d4af37]"
                      : "border-humana-line text-humana-muted hover:border-humana-gold/40"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      orgKind === opt.value ? "border-humana-gold" : "border-humana-line"
                    }`}
                  >
                    {orgKind === opt.value && (
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
              {t.officeWs.network.create.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.officeWs.network.create.emailPlaceholder}
              className="rounded-lg border border-humana-line bg-white px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
            <p className="text-[12px] text-humana-muted">{t.officeWs.network.create.emailHint}</p>
          </div>

          {/* ORGANIZATION NAME */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
              {t.officeWs.network.create.orgName}
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder={t.officeWs.network.create.orgNamePlaceholder}
              className="rounded-lg border border-humana-line bg-white px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          {/* COUNTRY (read-only, pre-filled from office) */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
              {t.officeWs.network.create.country}
            </label>
            <div className="flex items-center gap-2.5 rounded-lg border border-humana-line bg-humana-stone/50 px-4 py-3 text-[15px] text-humana-muted">
              <svg className="h-4 w-4 shrink-0 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              {countryName} ({countryCode})
            </div>
          </div>

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
              {submitting ? t.officeWs.network.create.submitting : t.officeWs.network.create.submit}
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
              {t.officeWs.network.create.preview}
            </h3>

            <div className="flex flex-col gap-4">
              <PreviewRow label={t.officeWs.network.create.previewRole} value={orgKind === "hotel" ? t.officeWs.network.create.hotel : t.officeWs.network.create.agency} />
              <PreviewRow label={t.officeWs.network.create.previewEmail} value={email || "--"} />
              <PreviewRow label={t.officeWs.network.create.previewCountry} value={countryName || "--"} />
              <PreviewRow label={t.officeWs.network.create.previewOffice} value={officeName || "--"} />
              <PreviewRow label={t.officeWs.network.create.previewExpires} value={t.officeWs.network.create.previewExpiresValue} bold />
              <PreviewRow
                label={t.officeWs.network.create.previewApproval}
                value={t.officeWs.network.create.previewApprovalValue}
                warning
              />
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Email Warning Modal */}
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
                    ? `Ya se envió una invitación a ${email}. Puedes contactar al administrador si necesitas reenviarla.`
                    : locale === "pt"
                      ? `Já foi enviado um convite para ${email}. Contacte o administrador se precisar reenviá-lo.`
                      : `An invitation has already been sent to ${email}. Contact the administrator if you need to resend it.`)
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

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  setDuplicateKind(null);
                  router.push("/office/network");
                }}
                className="cursor-pointer rounded-lg bg-humana-ink px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-black"
              >
                {locale === "es" ? "Entendido" : locale === "pt" ? "Entendido" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal with Confetti */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${closing ? "animate-[fade-out_0.25s_ease-in_forwards]" : "animate-[fade-in_0.2s_ease-out]"}`}
          onClick={closeModal}
        >
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
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-humana-gold-light animate-[fade-in-scale_0.4s_ease-out_0.1s_both]">
              <svg className="h-8 w-8 text-humana-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="mb-2 text-[20px] font-semibold text-humana-ink animate-[fade-in-up_0.3s_ease-out_0.15s_both]">
              {modalTitle[locale] || modalTitle.en}
            </h2>

            <p className="mb-2 text-[14px] leading-relaxed text-humana-muted animate-[fade-in-up_0.3s_ease-out_0.2s_both]">
              {modalBody(sentEmail.current, sentKind.current)}
            </p>

            {/* Hotel-specific note */}
            {sentKind.current === "hotel" && (
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
              ? "font-medium text-humana-gold"
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
