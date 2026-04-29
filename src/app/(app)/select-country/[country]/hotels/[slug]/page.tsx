"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { hotels } from "@/data/hotels";
import type { RoomType } from "@/data/types";
import { countries, countrySlugToId } from "@/data/countries";

export default function HotelDetailPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = React.use(params);
  const { t } = useLocale();
  const hotel = hotels.find((h) => h.slug === slug);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const countryId = countrySlugToId[country] ?? country;
  const countryData = countries.find((c) => c.id === countryId);
  const countryName = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    if (selectedRoom || lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [selectedRoom, lightboxIdx]);

  // Keyboard handler for lightbox + escape for room modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (lightboxIdx !== null) setLightboxIdx(null);
      else setSelectedRoom(null);
    }
    if (lightboxIdx !== null && hotel) {
      const total = hotel.gallery.length;
      if (e.key === "ArrowRight") setLightboxIdx((prev) => (prev !== null ? (prev + 1) % total : null));
      if (e.key === "ArrowLeft") setLightboxIdx((prev) => (prev !== null ? (prev - 1 + total) % total : null));
    }
  }, [lightboxIdx, hotel]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!hotel) {
    return (
      <div className="px-16 py-20 text-center">
        <h1 className="text-[24px] font-light text-humana-ink">{t.hotelDetail.notFound}</h1>
        <Link href={`/select-country/${country}/hotels`} className="mt-4 text-[14px] text-humana-gold underline">
          {t.common.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col">
      {/* Gallery — click to open lightbox */}
      <div className="flex gap-2 px-16 pt-8">
        <button type="button" onClick={() => setLightboxIdx(0)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ flex: "0 0 65%", height: 400 }}>
          <Image src={hotel.gallery[0]} alt={hotel.name} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
        </button>
        <div className="flex flex-col gap-2" style={{ flex: "0 0 35%" }}>
          <button type="button" onClick={() => setLightboxIdx(1)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ height: 198 }}>
            <Image src={hotel.gallery[1] ?? hotel.gallery[0]} alt={`${hotel.name} 2`} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </button>
          <button type="button" onClick={() => setLightboxIdx(2)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ height: 198 }}>
            <Image src={hotel.gallery[2] ?? hotel.gallery[0]} alt={`${hotel.name} 3`} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-16 pt-6">
        <Breadcrumb
          items={[
            { label: t.breadcrumb.home, href: "/dashboard" },
            { label: countryName, href: `/select-country/${country}` },
            { label: t.breadcrumb.hotels, href: `/select-country/${country}/hotels` },
            { label: hotel.name },
          ]}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8 px-16 pt-8 pb-16">
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.hotelDetail.boutiqueHotel.toUpperCase()} &middot; {hotel.location.toUpperCase()}
          </span>
          <h1 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-humana-ink">{hotel.name}</h1>
          <p className="max-w-[720px] text-[15px] leading-[24px] text-humana-muted">{hotel.description}</p>
        </div>

        {/* Tab bar (visual only — rooms tab is always active) */}
        <div className="flex gap-8 border-b border-humana-line">
          <span className="border-b-2 border-humana-ink pb-3 text-[14px] font-bold text-humana-ink">
            {t.hotelDetail.rooms}
          </span>
          <span className="cursor-default pb-3 text-[14px] font-medium text-humana-muted/50">
            {t.breadcrumb.retreats}
          </span>
          <span className="cursor-default pb-3 text-[14px] font-medium text-humana-muted/50">
            {t.hotelDetail.info}
          </span>
        </div>

        {/* Horizontal room cards */}
        <div className="flex flex-col gap-5">
          {hotel.roomTypes.map((rt) => (
            <div
              key={rt.id}
              className="flex overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative w-[320px] shrink-0 bg-humana-stone">
                <Image src={rt.image} alt={rt.name} fill className="object-cover" />
                <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-[11px] font-semibold text-humana-ink">{rt.maxGuests}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4 p-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-medium tracking-[-0.01em] text-humana-ink">{rt.name}</h3>
                  <p className="max-w-[480px] text-[14px] leading-[22px] text-humana-muted">{rt.description}</p>
                </div>
                <div className="flex items-end justify-between gap-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{t.hotelDetail.priceFrom}</span>
                    <span className="text-[24px] font-light tracking-[-0.01em] text-humana-ink">
                      ${rt.pricePerNight}
                      <span className="text-[13px] font-normal text-humana-muted"> / {t.hotelDetail.perNight}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(rt)}
                    className="shrink-0 cursor-pointer bg-humana-ink px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                  >
                    {t.hotelDetail.viewRooms}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room detail modal — portaled to body so it covers the TopNav */}
      {selectedRoom && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
          onClick={() => setSelectedRoom(null)}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] animate-fade-in" />

          {/* Modal card */}
          <div
            className="relative flex w-full max-w-[900px] overflow-hidden bg-white shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center border border-humana-line bg-white shadow-sm transition-all hover:border-humana-ink hover:shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Image side */}
            <div className="relative w-[420px] shrink-0 bg-humana-stone">
              <Image src={selectedRoom.image} alt={selectedRoom.name} fill className="object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Info side */}
            <div className="flex flex-1 flex-col justify-between p-10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    {hotel.name}
                  </span>
                  <h2 className="text-[28px] font-light tracking-[-0.02em] text-humana-ink">
                    {selectedRoom.name}
                  </h2>
                </div>

                <div className="h-px bg-humana-line" />

                <div className="flex flex-col gap-4">
                  {/* Room type */}
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                      <path d="M21 10H3" />
                      <path d="M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
                    </svg>
                    <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                      {t.hotelDetail.rooms}
                    </span>
                    <span className="text-[14px] text-humana-muted">{selectedRoom.name}</span>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                      {t.hotelDetail.capacity}
                    </span>
                    <span className="text-[14px] text-humana-muted">{t.hotelDetail.personCount(selectedRoom.maxGuests)}</span>
                  </div>

                  {/* Description */}
                  <div className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <p className="text-[14px] leading-[22px] text-humana-muted">{selectedRoom.description}</p>
                  </div>
                </div>

                <div className="h-px bg-humana-line" />

                {/* Amenities */}
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                    {t.hotelDetail.amenities}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="border border-humana-line px-3 py-1.5 text-[12px] text-humana-muted"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: price + CTA */}
              <div className="flex items-end justify-between gap-6 pt-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{t.hotelDetail.priceFrom}</span>
                  <span className="text-[32px] font-light tracking-[-0.02em] text-humana-gold">
                    ${selectedRoom.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-[13px] text-humana-muted">USD / {t.hotelDetail.perNight}</span>
                </div>
                <span className="shrink-0 cursor-default bg-humana-ink px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white">
                  {t.hotelDetail.bookNow}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Gallery lightbox — portaled to body */}
      {lightboxIdx !== null && hotel && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] animate-fade-in" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <span className="absolute left-6 top-6 z-10 text-[13px] font-medium text-white/70">
            {lightboxIdx + 1} / {hotel.gallery.length}
          </span>

          {/* Prev arrow */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + hotel.gallery.length) % hotel.gallery.length); }}
            className="absolute left-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % hotel.gallery.length); }}
            className="absolute right-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Main image */}
          <div
            className="relative z-10 h-[75vh] w-[75vw] max-w-[1200px] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={hotel.gallery[lightboxIdx]}
              alt={`${hotel.name} ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              sizes="75vw"
            />
          </div>

          {/* Thumbnails strip */}
          <div
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {hotel.gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIdx(i)}
                className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden transition-all ${
                  i === lightboxIdx ? "ring-2 ring-humana-gold ring-offset-2 ring-offset-black" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
