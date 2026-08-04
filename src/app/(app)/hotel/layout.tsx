/** Hotel workspace layout — guards for hotel-org users, renders HotelTopNav,
 *  and shows paywall overlay when no active subscription. */
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { HotelTopNav } from "@/components/hotel/HotelTopNav";

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, subscription } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHotelUser = user?.organization?.kind === "hotel";

  useEffect(() => {
    if (!loading && (!user || !isHotelUser)) {
      router.replace("/dashboard");
    }
  }, [loading, user, isHotelUser, router]);

  if (loading || !user || !isHotelUser) return null;

  // Pages exempt from paywall — settings (where you pick a plan) and onboarding
  const isExempt = pathname.startsWith("/hotel/settings") || pathname.startsWith("/onboarding");

  const hasActiveSubscription =
    subscription != null &&
    (subscription.status === "active" || subscription.status === "trialing");

  const showPaywall = !isExempt && !hasActiveSubscription;

  return (
    <>
      <HotelTopNav />
      <div className="relative min-h-screen bg-humana-stone">
        {children}
        {showPaywall && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-humana-stone/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white border border-humana-line p-10 text-center shadow-lg animate-fade-in-up">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-humana-gold-light">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                SUBSCRIPTION REQUIRED
              </p>
              <h2 className="mt-3 text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                Choose a plan to continue
              </h2>
              <p className="mt-2 text-[14px] text-humana-muted leading-relaxed">
                Select a subscription plan to unlock your hotel workspace and start managing your property, bookings, and retreats.
              </p>
              <button
                onClick={() => router.push("/hotel/settings?tab=subscription")}
                className="mt-6 w-full cursor-pointer bg-humana-gold px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
              >
                SELECT A PLAN
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
