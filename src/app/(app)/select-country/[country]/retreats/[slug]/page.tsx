"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { countries, countrySlugToId } from "@/data/countries";
import { agencyApi, type ApiExperience, type ApiRetreatPricing, type PublicHotelFull, type PublicRoomType } from "@/lib/api/agency";
import { fetchExperienceOrRetreat } from "@/lib/retreat-experience";

export default function RetreatDetailPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = React.use(params);
  const { t } = useLocale();
  const { set } = useBooking();
  const { user } = useAuth();
  const [experience, setExperience] = useState<ApiExperience | null>(null);
  const [hotel, setHotel] = useState<PublicHotelFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<PublicRoomType | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<ApiRetreatPricing | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showSelfPurchaseModal, setShowSelfPurchaseModal] = useState(false);

  const countryId = countrySlugToId[country] ?? country;
  const countryData = countries.find((c) => c.id === countryId);
  const countryName = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);

  useEffect(() => {
    fetchExperienceOrRetreat(slug)
      .then((exp) => {
        if (!exp) return;
        setExperience(exp);
        // Fetch full hotel details if the entry has a hotel
        if (exp.hotel?.id) {
          agencyApi
            .getHotel(exp.hotel.id)
            .then((hotelRes) => setHotel(hotelRes.hotel))
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Lock body scroll when room modal is open
  useEffect(() => {
    if (selectedRoom) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [selectedRoom]);

  // Escape closes room modal or self-purchase modal
  useEffect(() => {
    if (!selectedRoom && !showSelfPurchaseModal) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedRoom(null);
        setSelectedPricing(null);
        setShowSelfPurchaseModal(false);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedRoom, showSelfPurchaseModal]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="px-16 py-20 text-center">
        <h1 className="text-[24px] font-light text-humana-ink">Retreat not found</h1>
        <Link href={`/select-country/${country}/retreats`} className="mt-4 text-[14px] text-humana-gold underline">
          {t.common.back}
        </Link>
      </div>
    );
  }

  const nights = Math.max(
    1,
    Math.round(
      (new Date(experience.ends_on).getTime() - new Date(experience.starts_on).getTime()) / 86400000,
    ),
  );
  const days = nights + 1;
  const commissionRate = experience.commission_rate ?? 0.16;
  const commissionPct = Math.round(commissionRate * 100);
  const commissionAmount = Math.round(experience.price * commissionRate);
  const startFormatted = formatDate(experience.starts_on);
  const endFormatted = formatDate(experience.ends_on);
  const occupancy = Math.round(experience.capacity * 0.4);
  const occupancyPct = Math.round((occupancy / experience.capacity) * 100);

  // Build gallery from hotel images or fallback to experience image
  const gallery: string[] = [];
  if (hotel?.images && hotel.images.length > 0) {
    gallery.push(...hotel.images.map((i) => i.image_url));
  }
  if (gallery.length === 0 && experience.image_url) {
    gallery.push(experience.image_url);
  }
  // Ensure at least 3 images for gallery layout
  while (gallery.length > 0 && gallery.length < 3) {
    gallery.push(gallery[0]);
  }

  const isOwnRetreat = !!(experience.created_by_organization_id && user?.organization?.id && experience.created_by_organization_id === user.organization.id);
  const retreatPricings = experience.pricing && experience.pricing.length > 0 ? experience.pricing : null;

  const hotelName = experience.hotel?.name ?? hotel?.name ?? "";
  const location = experience.location ?? "";
  const kindLabel = (t.hotelWs?.retreats?.wizard?.types?.[experience.kind as keyof typeof t.hotelWs.retreats.wizard.types] ?? experience.kind).toUpperCase();

  return (
    <div className="animate-fade-in-up flex flex-col">
      {/* Gallery section — click to open lightbox */}
      {gallery.length > 0 && (
        <div className="flex gap-2 px-16 pt-8">
          <button type="button" onClick={() => setLightboxIdx(0)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ flex: "0 0 65%", height: 400 }}>
            <Image src={gallery[0]} alt={experience.title} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </button>
          <div className="flex flex-col gap-2" style={{ flex: "0 0 35%" }}>
            <button type="button" onClick={() => setLightboxIdx(1)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ height: 198 }}>
              <Image src={gallery[1] ?? gallery[0]} alt={`${experience.title} 2`} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </button>
            <button type="button" onClick={() => setLightboxIdx(2)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ height: 198 }}>
              <Image src={gallery[2] ?? gallery[0]} alt={`${experience.title} 3`} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-16 pt-6">
        <Breadcrumb
          items={[
            { label: t.breadcrumb.home, href: "/dashboard" },
            { label: countryName, href: `/select-country/${country}` },
            { label: t.breadcrumb.retreats, href: `/select-country/${country}/retreats` },
            { label: experience.title },
          ]}
        />
      </div>

      {/* Two-column layout */}
      <div className="flex gap-12 px-16 pt-8 pb-16">
        {/* Left content */}
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {kindLabel} &middot; {days} {t.retreatDetail.dayLabel.toUpperCase()}{days !== 1 ? "S" : ""} &middot; {nights} {t.common.nights(nights).split(" ").slice(1).join(" ").toUpperCase()}
            </span>
            <h1 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-humana-ink">
              {experience.title}
            </h1>
            <span className="flex items-center gap-2 text-[15px] text-humana-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {hotelName}{location ? ` · ${location}` : ""}
            </span>
          </div>

          {experience.description && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-humana-ink">
                {t.retreatDetail.aboutRetreat.toUpperCase()}
              </span>
              <p className="text-[15px] leading-[24px] text-humana-muted">{experience.description}</p>
            </div>
          )}

          {/* Facilitator */}
          {hotelName && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-humana-ink">FACILITADOR</span>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-humana-stone">
                  <span className="text-[15px] font-medium text-humana-muted">{experience.title.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-humana-ink">{hotelName}</span>
                  {experience.description && (
                    <span className="text-[14px] text-humana-muted line-clamp-1">{experience.description}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Room types — from retreat pricing when available, else hotel catalog */}
          {retreatPricings ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                  ALOJAMIENTO DEL RETIRO
                </span>
                <span className="text-[14px] text-humana-muted">{hotelName}</span>
              </div>

              <div className="flex flex-col gap-4">
                {retreatPricings.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { setSelectedRoom(p.room_type); setSelectedPricing(p); }}
                    className="flex cursor-pointer overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative w-[280px] shrink-0 bg-humana-stone">
                      {p.room_type.image_url && <Image src={p.room_type.image_url} alt={p.room_type.name} fill className="object-cover" />}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className="text-[11px] font-semibold text-humana-ink">{p.max_guests ?? p.room_type.capacity}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4 p-7">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-humana-ink">{p.room_type.name}</h3>
                        {p.occupancy_label && <span className="text-[12px] font-medium text-humana-gold">{p.occupancy_label}</span>}
                        <p className="max-w-[420px] text-[14px] leading-[22px] text-humana-muted">{p.room_type.description}</p>
                      </div>
                      <div className="flex items-end justify-between gap-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">PRECIO POR NOCHE</span>
                          <span className="text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                            {p.currency} {Math.round(p.price_per_guest / nights).toLocaleString()}
                            <span className="text-[13px] font-normal text-humana-muted"> / noche</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedRoom(p.room_type); setSelectedPricing(p); }}
                          className="shrink-0 cursor-pointer bg-humana-ink px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                        >
                          {t.hotelDetail.viewRooms}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : hotel && hotel.room_types && hotel.room_types.length > 0 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                  {t.hotelDetail.rooms.toUpperCase()}
                </span>
                <span className="text-[14px] text-humana-muted">{hotel.name}</span>
              </div>

              <div className="flex flex-col gap-4">
                {hotel.room_types.map((rt) => (
                  <div
                    key={rt.id}
                    onClick={() => { setSelectedRoom(rt); setSelectedPricing(null); }}
                    className="flex cursor-pointer overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative w-[280px] shrink-0 bg-humana-stone">
                      {rt.image_url && <Image src={rt.image_url} alt={rt.name} fill className="object-cover" />}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className="text-[11px] font-semibold text-humana-ink">{rt.capacity}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4 p-7">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-humana-ink">{rt.name}</h3>
                        <p className="max-w-[420px] text-[14px] leading-[22px] text-humana-muted">{rt.description}</p>
                      </div>
                      <div className="flex items-end justify-between gap-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{t.hotelDetail.priceFrom}</span>
                          <span className="text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                            {rt.currency} {rt.price_per_night}
                            <span className="text-[13px] font-normal text-humana-muted"> / {t.hotelDetail.perNight}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setSelectedRoom(rt); setSelectedPricing(null); }}
                          className="shrink-0 cursor-pointer bg-humana-ink px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                        >
                          {t.hotelDetail.viewRooms}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line bg-white p-9">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                {t.retreatDetail.startingFrom.toUpperCase()}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[40px] font-light tracking-[-0.02em] text-humana-ink">{experience.currency} {experience.price.toLocaleString()}</span>
                <span className="text-[15px] text-humana-muted">/ {t.retreatDetail.perGuest}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex flex-col gap-3">
              <SidebarRow label="Fechas" value={`${startFormatted} — ${endFormatted}`} bold />
              <SidebarRow label={t.retreatDetail.duration} value={t.common.nights(nights)} />
              {hotel?.check_in_time && <SidebarRow label="Check-in" value={hotel.check_in_time} />}
              {hotel?.check_out_time && <SidebarRow label="Check-out" value={hotel.check_out_time} />}
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-humana-muted">Plazas disponibles</span>
                <span className="text-[13px] font-medium text-humana-gold">{occupancy} / {experience.capacity}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-humana-stone">
                <div className="h-full rounded-full bg-humana-gold" style={{ width: `${occupancyPct}%` }} />
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex items-center justify-between">
              <span className="text-[13px] text-humana-muted">{t.retreatDetail.commission} ({commissionPct}%)</span>
              <span className="text-[15px] font-medium text-humana-gold">{experience.currency} {commissionAmount.toLocaleString()}</span>
            </div>

            {isOwnRetreat ? (
              <button
                type="button"
                onClick={() => setShowSelfPurchaseModal(true)}
                className="group/cta flex w-full cursor-pointer items-center justify-center gap-3 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
              >
                {t.retreatDetail.bookNow.toUpperCase()}
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                  <path d="M1 5h14M10 1l4 4-4 4" />
                </svg>
              </button>
            ) : (
              <Link
                href={`/select-country/${country}/step-1-select-dates`}
                onClick={() => set({ retreatSlug: experience.slug, flowType: "retreats" })}
                className="group/cta flex items-center justify-center gap-3 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
              >
                {t.retreatDetail.bookNow.toUpperCase()}
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                  <path d="M1 5h14M10 1l4 4-4 4" />
                </svg>
              </Link>
            )}

            <p className="text-center text-[12px] leading-[16px] text-humana-muted">
              Las fechas del retiro son fijas
            </p>
          </div>
        </div>
      </div>

      {/* Room detail modal — portaled to body so it covers the TopNav */}
      {selectedRoom && hotel && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
          onClick={() => setSelectedRoom(null)}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] animate-fade-in" />

          <div
            className="relative flex w-full max-w-[1040px] overflow-hidden bg-white shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center border border-humana-line bg-white shadow-sm transition-all hover:border-humana-ink hover:shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="relative w-[520px] shrink-0 bg-humana-stone">
              {selectedRoom.image_url && <Image src={selectedRoom.image_url} alt={selectedRoom.name} fill className="object-cover" />}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col justify-between p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    {hotel.name}
                  </span>
                  <h2 className="text-[24px] font-light tracking-[-0.02em] text-humana-ink">
                    {selectedRoom.name}
                  </h2>
                </div>

                <div className="h-px bg-humana-line" />

                <div className="flex flex-col gap-3">
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

                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                      {t.hotelDetail.capacity}
                    </span>
                    <span className="text-[14px] text-humana-muted">{t.hotelDetail.personCount(selectedRoom.capacity)}</span>
                  </div>

                  {selectedRoom.description && (
                    <div className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      <p className="text-[14px] leading-[22px] text-humana-muted">{selectedRoom.description}</p>
                    </div>
                  )}
                </div>

                <div className="h-px bg-humana-line" />

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                      {t.hotelDetail.amenities}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 4).map((a) => (
                        <span
                          key={a.id}
                          className="flex items-center gap-2 border border-humana-line px-4 py-1.5 text-[13px] text-humana-ink"
                          style={{ borderRadius: 9999 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <circle cx="12" cy="12" r="11" stroke="#d4af37" strokeWidth="1.5" />
                            <polyline points="7.5 12 10.5 15 16.5 9" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 pt-8">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">
                    {selectedPricing ? "PRECIO POR NOCHE" : t.hotelDetail.priceFrom}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="whitespace-nowrap text-[26px] font-light tracking-[-0.02em] text-humana-gold">
                      {selectedPricing ? `${selectedPricing.currency} ${Math.round(selectedPricing.price_per_guest / nights).toLocaleString()}` : `${selectedRoom.currency} ${selectedRoom.price_per_night}`}
                    </span>
                    <span className="whitespace-nowrap text-[13px] text-humana-muted">/ {selectedPricing ? "persona" : t.hotelDetail.perNight}</span>
                  </div>
                </div>
                {isOwnRetreat ? (
                  <button
                    type="button"
                    onClick={() => { setSelectedRoom(null); setSelectedPricing(null); setShowSelfPurchaseModal(true); }}
                    className="group/cta flex shrink-0 cursor-pointer items-center gap-2.5 bg-humana-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                  >
                    {t.hotelDetail.bookNow}
                    <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                      <path d="M1 5h14M10 1l4 4-4 4" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={`/select-country/${country}/step-1-select-dates`}
                    onClick={() => set({ retreatSlug: experience.slug, flowType: "retreats", roomTypeApiId: selectedRoom.id, roomTypeId: String(selectedRoom.id) })}
                    className="group/cta flex shrink-0 items-center gap-2.5 bg-humana-ink px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                  >
                    {t.hotelDetail.bookNow}
                    <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                      <path d="M1 5h14M10 1l4 4-4 4" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Self-purchase block modal */}
      {showSelfPurchaseModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
          onClick={() => setShowSelfPurchaseModal(false)}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] animate-fade-in" />
          <div
            className="relative flex w-full max-w-[440px] flex-col items-center gap-6 bg-white p-10 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-humana-gold-light">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              ACCI&Oacute;N NO PERMITIDA
            </span>
            <h2 className="text-center text-[22px] font-light tracking-[-0.02em] text-humana-ink">
              No puedes reservar tu propio retiro
            </h2>
            <p className="text-center text-[14px] leading-[22px] text-humana-muted">
              Este retiro fue creado por tu agencia. No es posible comprar plazas de un retiro propio. Otras agencias de la red pueden reservar plazas para sus clientes.
            </p>
            <button
              type="button"
              onClick={() => setShowSelfPurchaseModal(false)}
              className="w-full cursor-pointer bg-humana-ink py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
            >
              ENTENDIDO
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox carousel */}
      {lightboxIdx !== null && gallery.length > 0 && (
        <GalleryLightbox
          images={gallery}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}

/* ─── Gallery lightbox carousel ─── */
function GalleryLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  const prev = useCallback(() => setIdx((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setIdx((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center border border-white/20 bg-black/40 text-white transition-all hover:bg-black/60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <span className="absolute top-6 left-6 z-10 text-[13px] font-medium tracking-wider text-white/70">
        {idx + 1} / {images.length}
      </span>

      {/* Prev arrow */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-6 z-10 flex h-12 w-12 cursor-pointer items-center justify-center border border-white/20 bg-black/40 text-white transition-all hover:bg-black/60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Image */}
      <div
        className="relative z-10 h-[80vh] w-[80vw] max-w-[1200px] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[idx]}
          alt={`Gallery ${idx + 1}`}
          fill
          className="object-contain"
          sizes="80vw"
        />
      </div>

      {/* Next arrow */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-6 z-10 flex h-12 w-12 cursor-pointer items-center justify-center border border-white/20 bg-black/40 text-white transition-all hover:bg-black/60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`relative h-14 w-20 cursor-pointer overflow-hidden border-2 transition-all ${
              i === idx ? "border-humana-gold opacity-100" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

function SidebarRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-humana-muted">{label}</span>
      <span className={`text-[13px] text-humana-ink ${bold ? "font-semibold" : "font-medium"}`}>{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[d.getMonth()]}`;
}
