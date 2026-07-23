"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { BookingProvider } from "@/contexts/BookingContext";
import { WizardProvider } from "@/contexts/WizardContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();
  const isOnboarding = pathname.startsWith("/onboarding/");
  const isHotelWorkspace = pathname.startsWith("/hotel/");

  // Once the persisted session has been read, bounce unauthenticated visitors
  // back to the login portal.
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    if (!loading && user?.status === "suspended") {
      router.replace("/suspended");
      return;
    }
    // Redirect users who haven't completed onboarding to their wizard
    if (!loading && user && !user.organization?.onboarding_completed && !isOnboarding) {
      const kind = user.organization?.kind;
      if (kind === "hotel") {
        router.replace("/onboarding/hotel/step-1");
      } else if (kind === "agency") {
        router.replace("/onboarding/agency");
      } else if (kind === "office") {
        router.replace("/onboarding/office");
      }
    }
  }, [loading, user, router, isOnboarding]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-humana-stone">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">
            Loading
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (user.status === "suspended") return null;

  return (
    <BookingProvider>
      <WizardProvider>
        {!isAdmin && !isOnboarding && !isHotelWorkspace && <TopNav />}
        <main className="flex-1">{children}</main>
      </WizardProvider>
    </BookingProvider>
  );
}
