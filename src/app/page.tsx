"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LanguageSwitcher, useLocale } from "@/i18n/LocaleProvider";
import { locales, type Locale } from "@/i18n/dictionary";
import { useAuth } from "@/lib/AuthProvider";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { t, setLocale } = useLocale();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const { user } = await signIn(email, password);
      if (locales.includes(user.locale as Locale)) {
        setLocale(user.locale as Locale);
      }
      router.push("/dashboard");
    } catch (err) {
      const isNetwork = err instanceof ApiError && err.status === 0;
      setError(isNetwork ? t.login.errorNetwork : t.login.errorInvalid);
      setSubmitting(false);
    }
  }

  return (
    <main className="fixed inset-0 flex flex-row overflow-hidden">
      {/* Brand panel */}
      <section className="relative hidden lg:flex w-[44%] max-w-[640px] flex-col justify-between overflow-hidden bg-humana-stone px-16 py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-no-repeat opacity-70"
          style={{
            backgroundImage: "url('/brand/world.svg')",
            backgroundSize: "cover",
            backgroundPosition: "15% center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative flex items-center gap-4">
          <Image
            src="/brand/isotipo.png"
            alt=""
            width={36}
            height={36}
            priority
          />
          <Image
            src="/brand/logotipo.svg"
            alt="HUMANA"
            width={124}
            height={43}
            priority
          />
        </div>

        <div className="relative flex max-w-[460px] flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-7 bg-humana-gold" />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-muted">
              {t.login.eyebrow}
            </span>
          </div>
          <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
            {t.login.headline[0]}
            <br />
            {t.login.headline[1]}
            <br />
            {t.login.headline[2]}
          </h1>
          <p className="max-w-[380px] text-[14px] leading-[22px] text-[#4A463E]">
            {t.login.subhead}
          </p>
        </div>

        <div className="relative flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-humana-subtle">
            {t.login.networkLabel}
          </span>
          <span className="text-[13px] text-humana-ink">
            {t.login.cities}
          </span>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 flex-col justify-between px-8 py-8 sm:px-16 lg:px-20">
        <div className="flex items-center justify-end gap-5">
          <LanguageSwitcher />
          <span className="h-3 w-px bg-[#D8D4C8]" />
          <a
            href="#"
            className="text-[13px] text-[#4A463E] hover:text-humana-ink"
          >
            {t.login.langSupport}
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[400px] flex-col gap-5"
        >
          <header className="flex flex-col gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-humana-gold">
              {t.login.portal}
            </span>
            <h2 className="text-[28px] font-light leading-[36px] tracking-[-0.01em] text-humana-ink">
              {t.login.title}
            </h2>
            <p className="text-[14px] leading-[20px] text-humana-muted">
              {t.login.intro}
            </p>
          </header>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted"
            >
              {t.login.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder={t.login.emailPlaceholder}
              className="border-b border-humana-ink bg-transparent py-3 text-[15px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted"
              >
                {t.login.passwordLabel}
              </label>
              <a
                href="#"
                className="text-[12px] font-medium text-humana-gold underline underline-offset-4"
              >
                {t.login.recover}
              </a>
            </div>
            <div className="flex items-center gap-3 border-b border-[#D8D4C8] py-3 focus-within:border-humana-ink">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder={t.login.passwordPlaceholder}
                className="flex-1 bg-transparent text-[16px] tracking-[0.3em] text-humana-ink outline-none placeholder:text-humana-subtle"
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8A8578"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-[14px] w-[14px] cursor-pointer accent-humana-ink"
            />
            <span className="text-[13px] text-[#4A463E]">
              {t.login.remember}
            </span>
          </label>

          {error && (
            <p className="text-[13px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group/cta flex items-center justify-center gap-3 bg-humana-ink px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t.login.signingIn : t.login.submit}
            {!submitting && (
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
            )}
          </button>
        </form>

        <div className="flex justify-center">
          <span className="text-[12px] text-humana-muted">
            {t.login.joinPrompt}{" "}
            <a
              href="#"
              className="font-medium text-humana-ink underline underline-offset-4"
            >
              {t.login.joinLink}
            </a>
          </span>
        </div>
      </section>
    </main>
  );
}
