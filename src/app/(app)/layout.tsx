"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { BookingProvider } from "@/contexts/BookingContext";
import { WizardProvider } from "@/contexts/WizardContext";
import { useAuth } from "@/lib/AuthProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Once the persisted session has been read, bounce unauthenticated visitors
  // back to the login portal.
  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <BookingProvider>
      <WizardProvider>
        <TopNav />
        <main className="flex-1">{children}</main>
      </WizardProvider>
    </BookingProvider>
  );
}
