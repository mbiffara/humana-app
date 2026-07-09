/** Agency onboarding — AG-00c: split layout with stepper + profile form. */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

/* ─── Stepper data ─── */
const steps = [
  {
    number: 1,
    title: "Create password",
    description: "Via email link — completed",
    status: "completed" as const,
  },
  {
    number: 2,
    title: "Agency details",
    description: "Current step",
    status: "active" as const,
  },
  {
    number: 3,
    title: "Choose plan",
    description: "Select your subscription",
    status: "inactive" as const,
  },
];

export default function AgencyOnboarding() {
  const { user } = useAuth();
  const router = useRouter();

  const [legalName, setLegalName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState(user?.name || "");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!confirmed) {
      setError("Please confirm the information is accurate.");
      return;
    }

    setSubmitting(true);
    try {
      await api.patch("/agency/profile", {
        organization: {
          name: user?.organization?.name,
          legal_name: legalName,
          phone,
          primary_contact: contactName,
        },
      });
      router.push("/onboarding/agency/welcome");
    } catch {
      // Non-blocking — proceed to welcome even if API is not yet available
      router.push("/onboarding/agency/welcome");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] animate-[fade-in-up_0.5s_ease-out]">
      {/* ─── LEFT PANEL ─── */}
      <div className="relative hidden w-[480px] shrink-0 flex-col justify-between overflow-hidden bg-humana-ink px-12 py-12 lg:flex">
        {/* Decorative gold circle / swirl */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-humana-gold/[0.06]" />
        <div className="pointer-events-none absolute -left-20 bottom-24 h-[300px] w-[300px] rounded-full border border-humana-gold/[0.08]" />
        <div className="pointer-events-none absolute right-16 bottom-48 h-[180px] w-[180px] rounded-full border border-humana-gold/[0.05]" />

        <div className="relative z-10 flex flex-col">
          {/* HUMANA logo small gold */}
          <div className="mb-16">
            <Image
              src="/brand/isotipo.png"
              alt="HUMANA"
              width={36}
              height={36}
              className="brightness-0 invert opacity-40"
            />
          </div>

          {/* Eyebrow + title */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Welcome to the Network
          </span>
          <h2 className="mt-3 max-w-[320px] text-[26px] font-light leading-[1.3] tracking-[-0.01em] text-white">
            Set up your agency account in three simple steps.
          </h2>

          {/* Vertical stepper */}
          <div className="mt-10 flex flex-col gap-0">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-4">
                {/* Line + circle column */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                      step.status === "completed"
                        ? "bg-humana-gold text-humana-ink"
                        : step.status === "active"
                          ? "border-2 border-humana-gold bg-transparent text-humana-gold"
                          : "border border-white/20 bg-transparent text-white/40"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className={`my-1 w-px flex-1 min-h-[32px] ${
                        step.status === "completed" ? "bg-humana-gold/40" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pb-8">
                  <p
                    className={`text-[14px] font-medium ${
                      step.status === "completed"
                        ? "text-white/70"
                        : step.status === "active"
                          ? "text-white"
                          : "text-white/40"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`mt-0.5 text-[12px] ${
                      step.status === "active" ? "text-humana-gold" : "text-white/30"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/25">
          Trusted by 200+ agencies worldwide
        </p>
      </div>

      {/* ─── RIGHT PANEL (FORM) ─── */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-8 py-16 lg:px-16">
        <div className="w-full max-w-[520px]">
          {/* Eyebrow */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Agency Profile
          </span>

          {/* Title + subtitle */}
          <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
            Your agency details
          </h1>
          <p className="mt-1 mb-8 text-[14px] text-humana-muted">
            Tell us about your travel agency to complete your profile.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Agency Name (locked / pre-filled) */}
            <Field label="Agency Name" required>
              <div className="relative">
                <input
                  type="text"
                  value={user?.organization?.name || ""}
                  readOnly
                  className="w-full rounded-lg border border-humana-line bg-humana-stone/60 px-4 py-3 pr-10 text-[14px] text-humana-ink/60 outline-none cursor-not-allowed"
                />
                {/* Lock icon */}
                <svg
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-humana-subtle"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
            </Field>

            {/* Legal / Business Name */}
            <Field label="Legal / Business Name">
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Registered business name"
                className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
              />
            </Field>

            {/* Phone */}
            <Field label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
              />
            </Field>

            {/* Primary Contact */}
            <Field label="Primary Contact">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
              />
            </Field>

            {/* Confirmation checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-humana-line text-humana-gold accent-humana-gold"
              />
              <span className="text-[13px] leading-relaxed text-humana-muted">
                I confirm this information is accurate and authorized.
              </span>
            </label>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600 animate-[fade-in-up_0.2s_ease-out]">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !confirmed}
              className="cursor-pointer mt-2 flex items-center justify-center gap-2 rounded-lg bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black disabled:opacity-50"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Continue
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
        {label}
        {required && <span className="ml-0.5 text-humana-gold">*</span>}
      </label>
      {children}
    </div>
  );
}
