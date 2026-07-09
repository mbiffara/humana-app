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
  const isHotelWizard = pathname.startsWith("/onboarding/hotel");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

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

  return (
    <BookingProvider>
      <WizardProvider>
        {!isAdmin && !isHotelWizard && <TopNav />}
        <main className="flex-1">{children}</main>
      </WizardProvider>
    </BookingProvider>
  );
}
