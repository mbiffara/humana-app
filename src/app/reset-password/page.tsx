/** Password reset page — public, outside (app) group.
 *  User lands here from the email magic link with ?token=xxx.
 *  Shows new password + confirm fields, resets password, auto-logs in. */
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";
import { api, tokenStore } from "@/lib/api";
import type { User } from "@/lib/types";

function ResetPasswordForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const ts = t.resetPassword;
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const redirectedRef = useRef(false);

  // If no token, show error immediately
  const hasToken = token.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(ts.errorMinLength);
      return;
    }
    if (password !== confirm) {
      setError(ts.errorMismatch);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ token: string; user: User }>("/auth/reset_password", {
        auth: { token, password },
      });
      tokenStore.set(res.token);
      setUser(res.user);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("expired")) {
        setError(ts.errorExpired);
      } else {
        setError(ts.errorInvalid);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Auto-redirect after success
  useEffect(() => {
    if (success && !redirectedRef.current) {
      redirectedRef.current = true;
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-humana-stone px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h2 className="text-[24px] font-light tracking-[-0.02em] text-humana-ink">
            <span className="font-semibold">HUMANA</span>
          </h2>
        </div>

        <div className="border border-humana-line bg-white p-8 shadow-sm animate-fade-in-up">
          {success ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="mt-4 text-[18px] font-semibold text-humana-ink">{ts.success}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-humana-muted">{ts.successHint}</p>
              <div className="mt-4 h-1 w-16 overflow-hidden rounded-full bg-humana-line">
                <div className="h-full animate-[shimmer_2s_ease-in-out] bg-humana-gold" style={{ width: "100%" }} />
              </div>
            </div>
          ) : !hasToken ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="mt-4 text-[18px] font-semibold text-humana-ink">{ts.errorInvalid}</h3>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                {ts.eyebrow}
              </p>
              <h1 className="mt-2 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                {ts.title}
              </h1>
              <p className="mt-1 text-[14px] text-humana-muted">{ts.subtitle}</p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                    {ts.newPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={ts.placeholder}
                      className="w-full border border-humana-line px-3.5 py-2.5 pr-10 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-humana-subtle transition-colors hover:text-humana-ink"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
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

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle">
                    {ts.confirmPassword}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder={ts.placeholder}
                      className="w-full border border-humana-line px-3.5 py-2.5 pr-10 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-humana-subtle transition-colors hover:text-humana-ink"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {showConfirm ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
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

                {/* Error */}
                {error && (
                  <p className="text-[13px] text-red-600">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !password || !confirm}
                  className="w-full cursor-pointer bg-humana-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  {submitting ? ts.submitting : ts.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-humana-stone">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
