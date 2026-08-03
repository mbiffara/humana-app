"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.organization?.kind !== "agency") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user || user.organization?.kind !== "agency") return null;

  return <>{children}</>;
}
