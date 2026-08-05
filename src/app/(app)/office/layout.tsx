"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { OfficeTopNav } from "@/components/office/OfficeTopNav";

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isOffice } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isOffice)) {
      router.replace("/");
    }
  }, [loading, user, isOffice, router]);

  if (loading || !user || !isOffice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-humana-stone">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-humana-stone">
      <OfficeTopNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
