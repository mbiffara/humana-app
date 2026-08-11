"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useLocale } from "@/i18n/LocaleProvider";
import { countries } from "@/data/countries";
import { agencyApi, type CoverageMarker } from "@/lib/api/agency";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type MarkerKey =
  | "spain"
  | "colombia"
  | "ecuador"
  | "peru"
  | "brazil"
  | "paraguay"
  | "chile"
  | "argentina"
  | "uruguay"
  | "costa-rica"
  | "el-salvador"
  | "panama"
  | "dominican-republic"
  | "usa"
  | "mexico";

const markerCoords: Record<MarkerKey, [number, number]> = {
  spain: [-3.7, 40],
  colombia: [-74, 4.5],
  ecuador: [-78.5, -1.8],
  peru: [-76, -10],
  brazil: [-47, -12],
  paraguay: [-58, -22],
  chile: [-75, -38],
  argentina: [-62, -30],
  uruguay: [-54, -34],
  "costa-rica": [-84, 10],
  "el-salvador": [-89, 13.7],
  panama: [-80, 9],
  "dominican-republic": [-70, 19],
  usa: [-98, 38],
  mexico: [-102, 23],
};

const markerFlagCodes: Record<MarkerKey, string> = {
  spain: "es",
  colombia: "co",
  ecuador: "ec",
  peru: "pe",
  brazil: "br",
  paraguay: "py",
  chile: "cl",
  argentina: "ar",
  uruguay: "uy",
  "costa-rica": "cr",
  "el-salvador": "sv",
  panama: "pa",
  "dominican-republic": "do",
  usa: "us",
  mexico: "mx",
};

const markerCountryIds: Record<MarkerKey, string> = {
  spain: "es",
  colombia: "co",
  ecuador: "ec",
  peru: "pe",
  brazil: "br",
  paraguay: "py",
  chile: "cl",
  argentina: "ar",
  uruguay: "uy",
  "costa-rica": "cr",
  "el-salvador": "sv",
  panama: "pa",
  "dominican-republic": "do",
  usa: "us",
  mexico: "mx",
};

/** ISO 3166-1 numeric → MarkerKey */
const isoNumericToMarker: Record<string, MarkerKey> = {
  "724": "spain",
  "170": "colombia",
  "218": "ecuador",
  "604": "peru",
  "076": "brazil",
  "600": "paraguay",
  "152": "chile",
  "032": "argentina",
  "858": "uruguay",
  "188": "costa-rica",
  "222": "el-salvador",
  "591": "panama",
  "214": "dominican-republic",
  "840": "usa",
  "484": "mexico",
};

const markerKeys: MarkerKey[] = [
  "spain",
  "colombia",
  "ecuador",
  "peru",
  "brazil",
  "paraguay",
  "chile",
  "argentina",
  "uruguay",
  "costa-rica",
  "el-salvador",
  "panama",
  "dominican-republic",
  "usa",
  "mexico",
];

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
      <button
        type="button"
        onClick={() => zoomIn()}
        className="flex h-8 w-8 items-center justify-center border border-humana-line bg-white/90 text-[16px] font-medium text-humana-ink backdrop-blur-sm transition-all hover:border-humana-ink hover:bg-white"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => zoomOut()}
        className="flex h-8 w-8 items-center justify-center border border-humana-line bg-white/90 text-[16px] font-medium text-humana-ink backdrop-blur-sm transition-all hover:border-humana-ink hover:bg-white"
      >
        −
      </button>
      <button
        type="button"
        onClick={() => resetTransform()}
        className="flex h-8 w-8 items-center justify-center border border-humana-line bg-white/90 backdrop-blur-sm transition-all hover:border-humana-ink hover:bg-white"
        title="Reset"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  );
}

export default function WorldMap({
  mode = "inline",
}: {
  mode?: "inline" | "full";
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<MarkerKey | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MarkerKey | null>(null);
  const [zoomScale, setZoomScale] = useState(mode === "inline" ? 1.25 : 1);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [coverage, setCoverage] = useState<CoverageMarker[]>([]);

  useEffect(() => {
    agencyApi.getCoverage()
      .then((res) => setCoverage(res.markers))
      .catch(() => {});
  }, []);

  const closeSidebar = useCallback(() => {
    setSelectedCountry(null);
    transformRef.current?.resetTransform(400, "easeOut");
  }, []);

  function handleMarkerClick(key: MarkerKey) {
    if (mode === "full") {
      const el = document.getElementById(`marker-${key}`);
      if (el && transformRef.current) {
        transformRef.current.zoomToElement(el, 1.6, 500, "easeOut");
        setTimeout(() => setSelectedCountry(key), 550);
      } else {
        setSelectedCountry(key);
      }
    } else {
      router.push(`/select-country/${key}`);
    }
  }

  function handleGeoClick(geoId: string) {
    const marker = isoNumericToMarker[geoId];
    if (marker) handleMarkerClick(marker);
  }

  // Escape key to close sidebar
  useEffect(() => {
    if (mode !== "full" || !selectedCountry) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedCountry(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, selectedCountry]);

  const handleTransform = useCallback((_ref: ReactZoomPanPinchRef, state: { scale: number }) => {
    setZoomScale(state.scale);
  }, []);

  function renderMap(scale: number, center: [number, number], mapHeight: number, badgeScale = 1) {
    return (
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale, center }}
        width={960}
        height={mapHeight}
        style={{ width: "100%", height: "100%", maxHeight: "100%", display: "block" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: { id: string; properties: Record<string, string>; rsmKey: string }[] }) =>
            geographies.map((geo) => {
              const geoId = geo.id || geo.properties?.iso_a3_eh;
              const markerForGeo = isoNumericToMarker[geoId];
              const isActive = !!markerForGeo;
              const isHovered = markerForGeo === hoveredMarker;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleGeoClick(geoId)}
                  style={{
                    default: {
                      fill: isHovered ? "rgba(212, 175, 55, 0.22)" : "#e6e2d6",
                      stroke: "rgba(212, 175, 55, 0.28)",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: isActive ? "pointer" : "default",
                      transition: "fill 0.2s ease",
                    },
                    hover: {
                      fill: isActive ? "rgba(212, 175, 55, 0.18)" : "#e6e2d6",
                      stroke: "rgba(212, 175, 55, 0.4)",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: isActive ? "pointer" : "default",
                    },
                    pressed: {
                      fill: isActive ? "rgba(212, 175, 55, 0.3)" : "#e6e2d6",
                      stroke: "rgba(212, 175, 55, 0.4)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {markerKeys.map((key) => {
          const label = t.map.countries[key];
          const flagCode = markerFlagCodes[key];
          // Inverse scale: badges shrink as user zooms in
          const invScale = badgeScale / zoomScale;
          const baseFontSize = 8.5;
          const baseFlagSize = 12;
          const cardWidth = Math.max(60, label.length * (baseFontSize * 0.65) + 36);
          const cardHeight = 20;
          const totalHeight = cardHeight + 6;

          return (
            <Marker
              key={key}
              coordinates={markerCoords[key]}
            >
              <g
                id={`marker-${key}`}
                style={{ cursor: "pointer", pointerEvents: "none" }}
              >
                <g transform={`scale(${invScale})`}>
                  <foreignObject
                    x={-cardWidth / 2}
                    y={-totalHeight}
                    width={cardWidth}
                    height={totalHeight}
                    style={{ overflow: "visible", pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1px",
                      }}
                    >
                      {/* Card */}
                      <div
                        className="map-marker-card"
                        onClick={() => handleMarkerClick(key)}
                        onMouseEnter={() => setHoveredMarker(key)}
                        onMouseLeave={() => setHoveredMarker(null)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          border: "1px solid #111",
                          background: "#fff",
                          padding: "2px 6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          whiteSpace: "nowrap",
                          transition: "box-shadow 0.2s ease",
                          cursor: "pointer",
                          pointerEvents: "auto",
                        }}
                      >
                        <img
                          src={`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`}
                          alt={label}
                          width={baseFlagSize}
                          height={baseFlagSize}
                          style={{ borderRadius: "50%", display: "block", flexShrink: 0 }}
                        />
                        <span
                          style={{
                            fontSize: `${baseFontSize}px`,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#111",
                            fontFamily: "var(--font-inter), system-ui, sans-serif",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      {/* Triangle arrow */}
                      <svg width="6" height="5" viewBox="0 0 10 8" fill="#111">
                        <path d="M5 8L0 0h10z" />
                      </svg>
                    </div>
                  </foreignObject>
                </g>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    );
  }

  // ─── Full mode (used in /map route) ───
  if (mode === "full") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-humana-stone">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.8}
          maxScale={5}
          wheel={{ disabled: true }}
          pinch={{ disabled: true }}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true }}
          onTransform={handleTransform}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
            contentStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
          >
            {renderMap(180, [-40, 5], 420)}
          </TransformComponent>
          <ZoomControls />
        </TransformWrapper>

        {selectedCountry && (
          <CountrySidebar markerKey={selectedCountry} onClose={closeSidebar} coverage={coverage} />
        )}
      </div>
    );
  }

  // ─── Inline mode ───
  return (
    <div className="relative h-[480px] w-full overflow-hidden border border-humana-line bg-humana-stone">
      <TransformWrapper
        initialScale={1.25}
        minScale={0.8}
        maxScale={5}
        wheel={{ disabled: true }}
        pinch={{ disabled: true }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        onTransform={handleTransform}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          {renderMap(185, [-40, 5], 480, 1.15)}
        </TransformComponent>
        <ZoomControls />
      </TransformWrapper>
    </div>
  );
}

/** Slide-in sidebar from the right — fullscreen only */
function CountrySidebar({
  markerKey,
  onClose,
  coverage,
}: {
  markerKey: MarkerKey;
  onClose: () => void;
  coverage: CoverageMarker[];
}) {
  const { t } = useLocale();
  const countryId = markerCountryIds[markerKey];
  const flagCode = markerFlagCodes[markerKey];
  const countryName = t.map.countries[markerKey];

  const marker = coverage.find((m) => m.country_code.toLowerCase() === countryId);
  const retreatCount = marker?.experiences ?? 0;
  const hotelCount = marker?.hotels ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-backdrop-fade-in absolute inset-0 z-10 bg-black/20"
        onClick={onClose}
      />

      {/* Panel — slides from the right */}
      <div className="animate-sidebar-slide-in absolute right-0 top-0 z-20 flex h-full w-[380px] flex-col bg-white shadow-xl">
        {/* Close button */}
        <div className="flex justify-end px-5 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-humana-muted transition-colors hover:text-humana-ink"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Country header */}
        <div className="flex flex-col gap-4 px-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-[36px] w-[36px] shrink-0">
              <Image
                src={`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`}
                alt={countryName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <h3 className="text-[26px] font-light tracking-[-0.01em] text-humana-ink">
              {countryName}
            </h3>
          </div>
          <p className="text-[14px] leading-[20px] text-humana-muted">
            {retreatCount} retiros · {hotelCount} hoteles
          </p>
        </div>

        <div className="h-px bg-humana-line" />

        {/* Navigation cards */}
        <div className="flex flex-col gap-4 px-8 py-6">
          {/* Retreats card */}
          <Link
            href={`/select-country/${markerKey}/retreats`}
            className="group flex flex-col gap-3 border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-humana-ink hover:shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                Explorar experiencias
              </span>
            </div>
            <h4 className="text-[22px] font-light leading-[28px] tracking-[-0.01em] text-humana-ink">
              {t.selectCountry.retreatsTitle}
            </h4>
            <p className="text-[13px] leading-[19px] text-humana-muted">
              {t.selectCountry.retreatsDesc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[28px] font-light leading-none text-humana-ink">
                {retreatCount}
                <span className="ml-1.5 text-[13px] font-normal text-humana-muted">retiros</span>
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors group-hover:text-humana-gold">
                Explorar →
              </span>
            </div>
          </Link>

          {/* Hotels card */}
          <Link
            href={`/select-country/${markerKey}/hotels`}
            className="group flex flex-col gap-3 border border-humana-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-humana-ink hover:shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                <path d="M10 9h4" />
                <path d="M10 6h4" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                Alojamientos
              </span>
            </div>
            <h4 className="text-[22px] font-light leading-[28px] tracking-[-0.01em] text-humana-ink">
              {t.selectCountry.hotelsTitle}
            </h4>
            <p className="text-[13px] leading-[19px] text-humana-muted">
              {t.selectCountry.hotelsDesc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[28px] font-light leading-none text-humana-ink">
                {hotelCount}
                <span className="ml-1.5 text-[13px] font-normal text-humana-muted">hoteles</span>
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors group-hover:text-humana-gold">
                Explorar →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
