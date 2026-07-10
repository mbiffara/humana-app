/** Accept invitation page — header + centered card, locale set from country. */
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/dictionary";
import { useAuth } from "@/contexts/AuthContext";
import { invitationsApi } from "@/lib/api/invitations";
import { api, tokenStore, ApiError } from "@/lib/api";
import OnboardingHeader from "@/components/OnboardingHeader";
import type { InvitationPublic } from "@/lib/types";

type OrgKind = "agency" | "hotel" | "office";

/* ─── Total steps per role ─── */
const TOTAL_STEPS: Record<OrgKind, number> = {
  office: 2,
  agency: 2,
  hotel: 5,
};

/* ─── Map country code → locale ─── */
const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "EC", "VE", "UY", "PY",
  "BO", "CR", "CU", "DO", "GT", "HN", "NI", "PA", "SV",
]);
const PORTUGUESE_COUNTRIES = new Set(["BR", "PT", "AO", "MZ"]);

function countryToLocale(code: string | null | undefined): Locale {
  if (!code) return "en";
  const upper = code.toUpperCase();
  if (SPANISH_COUNTRIES.has(upper)) return "es";
  if (PORTUGUESE_COUNTRIES.has(upper)) return "pt";
  return "en";
}

/* ─── Lock icon for readonly fields ─── */
function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-humana-subtle"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ─── Eye toggle SVG ─── */
function EyeToggle({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer text-humana-subtle hover:text-humana-muted transition-colors"
      tabIndex={-1}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {visible ? (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        ) : (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}

/* ─── Main Form Logic ─── */
function AcceptInviteForm() {
  const { t, setLocale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const token = searchParams.get("token") || "";
  const fetchedRef = useRef(false);

  const [invitation, setInvitation] = useState<InvitationPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const orgKind = (invitation?.organization?.kind || "agency") as OrgKind;
  const totalSteps = TOTAL_STEPS[orgKind] || 2;

  // Validate token once — set locale from country code
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (!token) {
      setError("invalid");
      setLoading(false);
      return;
    }

    invitationsApi
      .validate(token)
      .then((res) => {
        setInvitation(res.invitation);
        setLocale(countryToLocale(res.invitation.organization?.country_code));
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 410) setError("expired");
          else if (err.status === 409) {
            // Invitation already accepted — if user is logged in, redirect to onboarding/dashboard
            const existingToken = tokenStore.get();
            if (existingToken) {
              // User is already authenticated, send them to continue onboarding
              api.get<{ user: { organization?: { kind?: string; onboarding_completed?: boolean } } }>("/auth/me")
                .then((me) => {
                  const kind = me.user.organization?.kind;
                  if (me.user.organization?.onboarding_completed) {
                    router.replace("/dashboard");
                  } else if (kind === "office") {
                    router.replace("/onboarding/office");
                  } else if (kind === "agency") {
                    router.replace("/onboarding/agency");
                  } else if (kind === "hotel") {
                    router.replace("/onboarding/hotel/step-1");
                  } else {
                    router.replace("/dashboard");
                  }
                })
                .catch(() => {
                  router.replace("/");
                });
              return;
            }
            setError("accepted");
          } else {
            setError("invalid");
          }
        } else {
          setError("invalid");
        }
      })
      .finally(() => setLoading(false));
  }, [token, setLocale]);

  // Map error codes to translated messages
  function errorMessage() {
    if (error === "expired") return t.acceptInvite.expired;
    if (error === "accepted") return t.acceptInvite.alreadyAccepted;
    return t.acceptInvite.invalidToken;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!agreed) {
      setFormError(t.acceptInvite.termsRequired);
      return;
    }
    if (password !== confirm) {
      setFormError(t.acceptInvite.passwordMismatch);
      return;
    }
    if (password.length < 8) {
      setFormError(t.acceptInvite.passwordTooShort);
      return;
    }

    setSubmitting(true);
    try {
      const emailPrefix = invitation?.email.split("@")[0] || "User";
      const locale = countryToLocale(invitation?.organization?.country_code);
      const res = await invitationsApi.accept(token, {
        name: emailPrefix,
        password,
        password_confirmation: confirm,
        locale,
      });
      tokenStore.set(res.token);
      setUser(res.user);

      const kind = res.user.organization?.kind;
      if (kind === "office") router.push("/onboarding/office");
      else if (kind === "agency") router.push("/onboarding/agency");
      else if (kind === "hotel") router.push("/onboarding/hotel/step-1");
      else router.push("/dashboard");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : t.acceptInvite.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  /* ─ Loading state ─ */
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-humana-stone">
        <OnboardingHeader role="agency" currentStep={1} totalSteps={2} />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
            <span className="text-[12px] text-humana-subtle">{t.acceptInvite.validating}</span>
          </div>
        </main>
      </div>
    );
  }

  /* ─ Error state ─ */
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-humana-stone">
        <OnboardingHeader role={orgKind} currentStep={1} totalSteps={totalSteps} />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="flex flex-col items-center text-center max-w-[400px] animate-[fade-in-up_0.5s_ease-out]">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="mb-2 text-[22px] font-light text-humana-ink">{t.acceptInvite.errorTitle}</h2>
            <p className="text-[14px] leading-relaxed text-humana-muted">{errorMessage()}</p>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer mt-6 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold hover:text-[#c5a030] transition-colors"
            >
              {t.acceptInvite.backToLogin}
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ─ Form state ─ */
  if (!invitation) return null;

  const org = invitation.organization;
  const countryName = org?.country || "";
  const flagEmoji = org?.flag_emoji || "";
  const countryDisplay = flagEmoji ? `${flagEmoji} ${countryName}` : countryName;

  return (
    <div className="flex min-h-screen flex-col bg-humana-stone">
      <OnboardingHeader role={orgKind} currentStep={1} totalSteps={totalSteps} />
      <main className="flex flex-1 items-start justify-center px-6 py-16">
        <div className="w-full max-w-[480px] animate-[fade-in-up_0.5s_ease-out]">
          <div className="rounded-2xl bg-white p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Eyebrow + Title */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                  {t.acceptInvite.eyebrow}
                </span>
                <h2 className="text-[24px] font-light leading-[32px] tracking-[-0.01em] text-humana-ink">
                  {t.acceptInvite.title}
                </h2>
                <p className="text-[14px] leading-[20px] text-humana-muted">
                  {t.acceptInvite.subtitle}
                </p>
              </div>

              {/* Email (readonly) */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                  {t.acceptInvite.email}
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-humana-line bg-humana-stone/50 px-4 py-3">
                  <input
                    type="email"
                    readOnly
                    value={invitation.email}
                    tabIndex={-1}
                    className="flex-1 bg-transparent text-[14px] text-humana-subtle outline-none cursor-default"
                  />
                  <LockIcon />
                </div>
              </div>

              {/* Country (readonly) */}
              {countryDisplay && (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    {t.acceptInvite.country}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg border border-humana-line bg-humana-stone/50 px-4 py-3">
                    <span className="flex-1 text-[14px] text-humana-subtle">{countryDisplay}</span>
                    <LockIcon />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                  {t.acceptInvite.password}
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-humana-line px-4 py-3 transition-colors focus-within:border-humana-gold">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.acceptInvite.passwordPlaceholder}
                    className="flex-1 bg-transparent text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle"
                  />
                  <EyeToggle visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                  {t.acceptInvite.confirmPassword}
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-humana-line px-4 py-3 transition-colors focus-within:border-humana-gold">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder={t.acceptInvite.confirmPasswordPlaceholder}
                    className="flex-1 bg-transparent text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle"
                  />
                  <EyeToggle visible={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-[16px] w-[16px] shrink-0 cursor-pointer rounded border-humana-line accent-humana-ink"
                />
                <span className="text-[13px] leading-[18px] text-humana-muted">
                  {t.acceptInvite.terms}{" "}
                  <a href="#" className="cursor-pointer font-medium text-humana-ink underline underline-offset-2 hover:text-humana-gold transition-colors">
                    {t.acceptInvite.termsLink}
                  </a>{" "}
                  &{" "}
                  <a href="#" className="cursor-pointer font-medium text-humana-ink underline underline-offset-2 hover:text-humana-gold transition-colors">
                    {t.acceptInvite.privacyLink}
                  </a>
                  .
                </span>
              </label>

              {/* Error */}
              {formError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600 animate-[fade-in-up_0.2s_ease-out]">
                  {formError}
                </p>
              )}

              {/* Submit — "Next" for multi-step flow */}
              <button
                type="submit"
                disabled={submitting || !agreed}
                className="cursor-pointer group/cta flex items-center justify-center gap-3 rounded-lg bg-humana-ink px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t.acceptInvite.submitting}
                  </div>
                ) : (
                  <>
                    {t.acceptInvite.next}
                    <svg
                      width="14"
                      height="9"
                      viewBox="0 0 16 10"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
                    >
                      <path d="M1 5h14M10 1l4 4-4 4" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Page Export with Suspense ─── */
export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          </div>
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
