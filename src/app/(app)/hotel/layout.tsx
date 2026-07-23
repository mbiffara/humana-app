/** Hotel workspace layout — guards for hotel-org users and renders HotelTopNav. */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { HotelTopNav } from "@/components/hotel/HotelTopNav";

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isHotelUser = user?.organization?.kind === "hotel";

  useEffect(() => {
    if (!loading && (!user || !isHotelUser)) {
      router.replace("/dashboard");
    }
  }, [loading, user, isHotelUser, router]);

  if (loading || !user || !isHotelUser) return null;

  return (
    <>
      <HotelTopNav />
      <div className="min-h-screen bg-humana-stone">{children}</div>
    </>
  );
}
