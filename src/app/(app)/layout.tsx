"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { AgencyTopNav } from "@/components/agency/AgencyTopNav";
import { HotelTopNav } from "@/components/hotel/HotelTopNav";
import { BookingProvider } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin, isOffice } = useAuth();
  const isOnboarding = pathname.startsWith("/onboarding/");
  const isHotelWorkspace = pathname.startsWith("/hotel/");
  const isOfficeWorkspace = pathname.startsWith("/office/");
  const isSelectCountry = pathname.startsWith("/select-country/");
  const isAgency = user?.organization?.kind === "agency";
  const isHotel = user?.organization?.kind === "hotel";

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
      return;
    }
    // Hotels awaiting admin approval land on the review step, where they can
    // see their status and keep editing their submission.
    if (
      !loading &&
      user &&
      user.organization?.kind === "hotel" &&
      user.organization?.onboarding_completed &&
      user.organization?.status === "pending" &&
      !isOnboarding
    ) {
      router.replace("/onboarding/hotel/step-5");
    }
    // Office users landing on /dashboard get redirected to /office/dashboard
    if (!loading && user && isOffice && pathname === "/dashboard") {
      router.replace("/office/dashboard");
      return;
    }
  }, [loading, user, router, isOnboarding, isOffice, pathname]);

  // Paywall temporarily disabled — subscription selection is available
  // from agency settings without blocking the entire workspace.

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
      {!isAdmin && !isOnboarding && !isHotelWorkspace && !isOfficeWorkspace && isAgency && <AgencyTopNav />}
      {!isAdmin && !isOnboarding && isSelectCountry && isHotel && <HotelTopNav />}
      {!isAdmin && !isOnboarding && !isHotelWorkspace && !isOfficeWorkspace && !isSelectCountry && !isAgency && !isOffice && <TopNav />}
      <div className="relative flex-1">
        <main>{children}</main>
      </div>
    </BookingProvider>
  );
}
