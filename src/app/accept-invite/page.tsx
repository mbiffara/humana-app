/** Accept invitation page — split-screen layout matching Paper design AG-00b. */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { invitationsApi } from "@/lib/api/invitations";
import { tokenStore, ApiError } from "@/lib/api";
import type { InvitationPublic } from "@/lib/types";

/* ─── Stepper data ─── */
const steps = [
  { label: "Create password", description: "Current step" },
  { label: "Agency details", description: "Your organization info" },
  { label: "Choose plan", description: "Select your subscription" },
];

/* ─── Lock icon for readonly email ─── */
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

/* ─── Vertical Stepper ─── */
function VerticalStepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isActive = i === activeStep;
        const isCompleted = i < activeStep;

        return (
          <div key={i} className="flex gap-4">
            {/* Indicator column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-humana-gold text-white"
                    : isCompleted
                      ? "bg-humana-gold/20 text-humana-gold"
                      : "bg-humana-line/60 text-humana-subtle"
                }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div
                  className={`w-px flex-1 min-h-[32px] ${
                    isActive || isCompleted ? "bg-humana-gold/30" : "bg-humana-line"
                  }`}
                />
              )}
            </div>
            {/* Text column */}
            <div className="pb-6 pt-1">
              <p
                className={`text-[14px] font-medium leading-tight ${
                  isActive ? "text-humana-ink" : "text-humana-subtle"
                }`}
              >
                {step.label}
              </p>
              <p
                className={`mt-0.5 text-[12px] leading-tight ${
                  isActive ? "text-humana-muted" : "text-humana-subtle/70"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Left Panel — Brand & Stepper ─── */
function LeftPanel() {
  return (
    <section className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-humana-stone px-16 py-12">
      {/* Decorative background circle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #d4af37 0%, #d4af37 30%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #d4af37 0%, #d4af37 40%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="relative flex items-center gap-3 animate-[fade-in-up_0.5s_ease-out]">
        <Image
          src="/brand/isotipo.png"
          alt=""
          width={32}
          height={32}
          priority
        />
        <span className="text-[18px] font-semibold tracking-[0.12em] text-humana-gold">
          HUMANA
        </span>
      </div>

      {/* Center content */}
      <div className="relative flex flex-col gap-8 max-w-[380px] animate-[fade-in-up_0.5s_ease-out_0.1s_both]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-humana-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Welcome to the network
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[32px] font-light leading-[40px] tracking-[-0.02em] text-humana-ink">
          Set up your agency account in three simple steps.
        </h1>

        {/* Vertical stepper */}
        <VerticalStepper activeStep={0} />
      </div>

      {/* Bottom trust line */}
      <div className="relative animate-[fade-in-up_0.5s_ease-out_0.3s_both]">
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-humana-subtle">
          Trusted by 200+ agencies worldwide
        </span>
      </div>
    </section>
  );
}

/* ─── Right Panel — Form ─── */
function RightPanel({
  invitation,
  onSubmit,
  submitting,
  formError,
}: {
  invitation: InvitationPublic;
  onSubmit: (password: string, confirm: string, agreed: boolean) => void;
  submitting: boolean;
  formError: string;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(password, confirm, agreed);
  }

  return (
    <section className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-20">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[440px] flex-col gap-6 animate-[fade-in-up_0.5s_ease-out]"
      >
        {/* Eyebrow */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Create Account
          </span>
          <h2 className="text-[28px] font-light leading-[36px] tracking-[-0.01em] text-humana-ink">
            Set your password
          </h2>
          <p className="text-[14px] leading-[20px] text-humana-muted">
            Choose a secure password for your HUMANA account.
          </p>
        </div>

        {/* Email field (readonly) */}
        <div className="flex flex-col gap-2 animate-[fade-in-up_0.5s_ease-out_0.1s_both]">
          <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            Email
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

        {/* Password field */}
        <div className="flex flex-col gap-2 animate-[fade-in-up_0.5s_ease-out_0.15s_both]">
          <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            Password
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-humana-line px-4 py-3 transition-colors focus-within:border-humana-gold">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="flex-1 bg-transparent text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-humana-subtle hover:text-humana-muted transition-colors"
              tabIndex={-1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
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
          </div>
        </div>

        {/* Confirm Password field */}
        <div className="flex flex-col gap-2 animate-[fade-in-up_0.5s_ease-out_0.2s_both]">
          <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            Confirm Password
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-humana-line px-4 py-3 transition-colors focus-within:border-humana-gold">
            <input
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="flex-1 bg-transparent text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="cursor-pointer text-humana-subtle hover:text-humana-muted transition-colors"
              tabIndex={-1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {showConfirm ? (
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
          </div>
        </div>

        {/* Terms checkbox */}
        <label className="flex cursor-pointer items-start gap-3 animate-[fade-in-up_0.5s_ease-out_0.25s_both]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-[16px] w-[16px] shrink-0 cursor-pointer rounded border-humana-line accent-humana-ink"
          />
          <span className="text-[13px] leading-[18px] text-humana-muted">
            I agree to the HUMANA{" "}
            <a href="#" className="cursor-pointer font-medium text-humana-ink underline underline-offset-2 hover:text-humana-gold transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="cursor-pointer font-medium text-humana-ink underline underline-offset-2 hover:text-humana-gold transition-colors">
              Privacy Policy
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

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !agreed}
          className="cursor-pointer group/cta mt-1 flex items-center justify-center gap-3 rounded-lg bg-humana-ink px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed animate-[fade-in-up_0.5s_ease-out_0.3s_both]"
        >
          {submitting ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating Account...
            </div>
          ) : (
            <>
              Create Account
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
    </section>
  );
}

/* ─── Main Form Logic ─── */
function AcceptInviteForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const token = searchParams.get("token") || "";

  const [invitation, setInvitation] = useState<InvitationPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(t.acceptInvite.invalidToken);
      setLoading(false);
      return;
    }

    invitationsApi
      .validate(token)
      .then((res) => setInvitation(res.invitation))
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 410) setError(t.acceptInvite.expired);
          else if (err.status === 409) setError(t.acceptInvite.alreadyAccepted);
          else setError(t.acceptInvite.invalidToken);
        } else {
          setError(t.acceptInvite.invalidToken);
        }
      })
      .finally(() => setLoading(false));
  }, [token, t]);

  async function handleSubmit(password: string, confirm: string, agreed: boolean) {
    setFormError("");

    if (!agreed) {
      setFormError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const emailPrefix = invitation?.email.split("@")[0] || "User";
      const res = await invitationsApi.accept(token, {
        name: emailPrefix,
        password,
        password_confirmation: confirm,
      });
      tokenStore.set(res.token);
      setUser(res.user);
      router.push("/accept-invite/welcome");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ─ Loading state ─ */
  if (loading) {
    return (
      <main className="fixed inset-0 flex flex-row overflow-hidden">
        <LeftPanel />
        <section className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
            <span className="text-[12px] text-humana-subtle">Validating invitation...</span>
          </div>
        </section>
      </main>
    );
  }

  /* ─ Error state ─ */
  if (error) {
    return (
      <main className="fixed inset-0 flex flex-row overflow-hidden">
        <LeftPanel />
        <section className="flex flex-1 items-center justify-center px-8">
          <div className="flex flex-col items-center text-center max-w-[400px] animate-[fade-in-up_0.5s_ease-out]">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="mb-2 text-[22px] font-light text-humana-ink">Invitation Error</h2>
            <p className="text-[14px] leading-relaxed text-humana-muted">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer mt-6 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold hover:text-[#c5a030] transition-colors"
            >
              Back to Login
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* ─ Form state ─ */
  if (!invitation) return null;

  return (
    <main className="fixed inset-0 flex flex-row overflow-hidden">
      <LeftPanel />
      <RightPanel
        invitation={invitation}
        onSubmit={handleSubmit}
        submitting={submitting}
        formError={formError}
      />
    </main>
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
