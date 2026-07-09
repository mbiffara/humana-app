/** Office onboarding — regional setup form. */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function OfficeOnboarding() {
  const { t } = useLocale();
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [region, setRegion] = useState("");
  const [timezone, setTimezone] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // In a full implementation, this would call the API
    setTimeout(() => router.push("/dashboard"), 500);
  }

  return (
    <div className="mx-auto max-w-[560px] px-6 py-16 animate-[fade-in-up_0.5s_ease-out]">
      <div className="rounded-2xl bg-white p-10 shadow-sm">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {user?.organization?.name}
        </span>
        <h1 className="mt-2 mb-1 text-[24px] font-light tracking-[-0.01em] text-humana-ink">
          {t.onboarding.office.title}
        </h1>
        <p className="mb-8 text-[14px] text-humana-muted">{t.onboarding.office.subtitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={t.onboarding.office.region}>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Latin America, Europe, Asia-Pacific"
              className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </Field>

          <Field label={t.onboarding.office.timezone}>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-humana-line bg-white px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            >
              <option value="">Select timezone...</option>
              <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/Madrid">Europe/Madrid (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </Field>

          <Field label={t.onboarding.office.phone}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-humana-line px-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
            />
          </Field>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-[13px] font-medium text-humana-muted hover:text-humana-ink transition-colors"
            >
              {t.onboarding.office.skip}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-humana-ink px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black disabled:opacity-60"
            >
              {submitting ? "..." : t.onboarding.office.submit}
            </button>
          </div>
        </form>
      </div>
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
