/** Welcome screen after successful invitation acceptance — auto-redirects. */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomePage() {
  const { t } = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Stagger the animations
    setTimeout(() => setShow(true), 100);

    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      const orgKind = user?.organization?.kind;
      if (orgKind === "agency") {
        router.push("/onboarding/agency");
      } else if (orgKind === "hotel") {
        router.push("/onboarding/hotel/step-1");
      } else if (orgKind === "office") {
        router.push("/onboarding/office");
      } else {
        router.push("/dashboard");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-humana-stone px-4">
      <div className={`flex flex-col items-center text-center transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Logo with pulse */}
        <div className="mb-8 animate-[pulse-gold_2s_ease-in-out_infinite]">
          <Image src="/brand/isotipo.png" alt="HUMANA" width={64} height={64} />
        </div>

        {/* Checkmark circle */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 animate-[fade-in-scale_0.5s_ease-out_0.3s_both]">
          <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" className="animate-[check-stroke-draw_0.6s_ease-out_0.6s_both]" style={{ strokeDasharray: 30, strokeDashoffset: 30 }} />
          </svg>
        </div>

        {/* Welcome text */}
        <h1 className="mb-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink animate-[fade-in-up_0.5s_ease-out_0.4s_both]">
          {t.welcome.title(user?.name || "")}
        </h1>
        <p className="mb-8 text-[15px] text-humana-muted animate-[fade-in-up_0.5s_ease-out_0.5s_both]">
          {t.welcome.subtitle}
        </p>

        {/* Redirecting */}
        <div className="flex items-center gap-2 animate-[fade-in-up_0.5s_ease-out_0.7s_both]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          <span className="text-[12px] text-humana-subtle">{t.welcome.redirecting}</span>
        </div>
      </div>
    </div>
  );
}
