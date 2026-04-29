"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-humana-stone shimmer" />
  ),
});

export default function MapPage() {
  const { t } = useLocale();

  return (
    <div className="map-viewport overflow-hidden">
      {/* Map fills entire area, back button floats */}
      <div className="relative h-full max-h-full overflow-hidden bg-humana-stone">
        <Link
          href="/dashboard"
          className="absolute left-6 top-5 z-10 flex items-center gap-2 border border-humana-line bg-white/90 px-5 py-2.5 text-[13px] font-medium text-humana-ink backdrop-blur-sm transition-colors hover:border-humana-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.map.back}
        </Link>
        <WorldMap mode="full" />
      </div>
    </div>
  );
}
