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
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type MarkerKey =
  | "usa"
  | "mexico"
  | "argentina"
  | "brazil"
  | "spain"
  | "india"
  | "indonesia";

const markerCoords: Record<MarkerKey, [number, number]> = {
  usa: [-98, 38],
  mexico: [-102, 23],
  argentina: [-64, -34],
  brazil: [-51, -14],
  spain: [-3.7, 40],
  india: [78, 20],
  indonesia: [120, -2],
};

const markerFlagCodes: Record<MarkerKey, string> = {
  usa: "us",
  mexico: "mx",
  argentina: "ar",
  brazil: "br",
  spain: "es",
  india: "in",
  indonesia: "id",
};

const markerCountryIds: Record<MarkerKey, string> = {
  usa: "us",
  mexico: "mx",
  argentina: "ar",
  brazil: "br",
  spain: "es",
  india: "in",
  indonesia: "id",
};

/** ISO 3166-1 numeric → MarkerKey */
const isoNumericToMarker: Record<string, MarkerKey> = {
  "840": "usa",
  "484": "mexico",
  "032": "argentina",
  "076": "brazil",
  "724": "spain",
  "356": "india",
  "360": "indonesia",
};

const markerKeys: MarkerKey[] = [
  "usa",
  "mexico",
  "argentina",
  "brazil",
  "spain",
  "india",
  "indonesia",
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
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

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

  function renderMap(scale: number, center: [number, number], mapHeight: number) {
    return (
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale, center }}
        width={960}
        height={mapHeight}
        style={{ width: "100%", height: "100%", maxHeight: "100%", display: "block" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
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
          const cardWidth = Math.max(72, label.length * 6.5 + 44);
          const cardHeight = 24;
          const totalHeight = cardHeight + 6;

          return (
            <Marker
              key={key}
              coordinates={markerCoords[key]}
              onClick={() => handleMarkerClick(key)}
            >
              <g
                id={`marker-${key}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredMarker(key)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {/* Invisible hit area for hover detection */}
                <rect
                  x={-cardWidth / 2}
                  y={-totalHeight}
                  width={cardWidth}
                  height={totalHeight}
                  fill="transparent"
                />
                <foreignObject
                  x={-cardWidth / 2}
                  y={-totalHeight}
                  width={cardWidth}
                  height={totalHeight}
                  style={{ overflow: "visible" }}
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        border: "1px solid #111",
                        background: "#fff",
                        padding: "3px 7px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        whiteSpace: "nowrap",
                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      }}
                    >
                      <img
                        src={`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`}
                        alt={label}
                        width={14}
                        height={14}
                        style={{ borderRadius: "50%", display: "block", flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#111",
                          fontFamily: "var(--font-inter), system-ui, sans-serif",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    {/* Triangle arrow */}
                    <svg width="8" height="6" viewBox="0 0 10 8" fill="#111">
                      <path d="M5 8L0 0h10z" />
                    </svg>
                  </div>
                </foreignObject>
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
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
            contentStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
          >
            {renderMap(180, [15, 10], 420)}
          </TransformComponent>
          <ZoomControls />
        </TransformWrapper>

        {selectedCountry && (
          <CountrySidebar markerKey={selectedCountry} onClose={closeSidebar} />
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
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          {renderMap(185, [60, -10], 480)}
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
}: {
  markerKey: MarkerKey;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const countryId = markerCountryIds[markerKey];
  const flagCode = markerFlagCodes[markerKey];
  const countryName = t.map.countries[markerKey];

  const retreatCount = retreats.filter((r) => r.country === countryId).length;
  const hotelCount = hotels.filter((h) => h.country === countryId).length;

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
            {retreatCount} {t.selectCountry.retreatsTitle.toLowerCase()} · {hotelCount} {t.selectCountry.hotelsTitle.toLowerCase()}
          </p>
        </div>

        <div className="h-px bg-humana-line" />

        {/* Navigation cards */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-6">
          {/* Retreats card */}
          <Link
            href={`/select-country/${markerKey}/retreats`}
            className="group flex flex-col gap-4 border border-humana-line p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-humana-ink hover:shadow-lg"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.selectCountry.retreatsTitle}
            </span>
            <p className="text-[14px] leading-[20px] text-humana-muted">
              {t.selectCountry.retreatsDesc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[28px] font-light text-humana-ink">
                {retreatCount}
                <span className="ml-1.5 text-[13px] font-normal text-humana-muted">
                  retiros
                </span>
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors group-hover:text-humana-gold">
                {t.selectCountry.explore} →
              </span>
            </div>
          </Link>

          {/* Hotels card */}
          <Link
            href={`/select-country/${markerKey}/hotels`}
            className="group flex flex-col gap-4 border border-humana-line p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-humana-ink hover:shadow-lg"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.selectCountry.hotelsTitle}
            </span>
            <p className="text-[14px] leading-[20px] text-humana-muted">
              {t.selectCountry.hotelsDesc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[28px] font-light text-humana-ink">
                {hotelCount}
                <span className="ml-1.5 text-[13px] font-normal text-humana-muted">
                  hoteles
                </span>
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors group-hover:text-humana-gold">
                {t.selectCountry.explore} →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
