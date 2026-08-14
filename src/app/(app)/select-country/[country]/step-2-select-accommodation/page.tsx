"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { agencyApi, type PublicRoomType, type HotelAvailabilityRoomType } from "@/lib/api/agency";
import { formatDateShort, diffDays } from "@/lib/calendar-utils";

const AMENITY_LABELS: Record<string, Record<string, string>> = {
  en: {
    wifi: "Wi-Fi", minibar: "Minibar", safe: "Safe", air_conditioning: "Air Conditioning",
    bathrobe: "Bathrobe", terrace: "Terrace", tv: "TV", balcony: "Balcony",
    jacuzzi: "Jacuzzi", pool: "Pool", kitchen: "Kitchen", ocean_view: "Ocean View",
    garden_view: "Garden View", mountain_view: "Mountain View", room_service: "Room Service",
    coffee_maker: "Coffee Maker", hair_dryer: "Hair Dryer", iron: "Iron",
  },
  es: {
    wifi: "Wi-Fi", minibar: "Minibar", safe: "Caja Fuerte", air_conditioning: "Aire Acondicionado",
    bathrobe: "Albornoz", terrace: "Terraza", tv: "TV", balcony: "Balcón",
    jacuzzi: "Jacuzzi", pool: "Piscina", kitchen: "Cocina", ocean_view: "Vista al Mar",
    garden_view: "Vista al Jardín", mountain_view: "Vista a la Montaña", room_service: "Servicio a la Habitación",
    coffee_maker: "Cafetera", hair_dryer: "Secador de Pelo", iron: "Plancha",
  },
  pt: {
    wifi: "Wi-Fi", minibar: "Minibar", safe: "Cofre", air_conditioning: "Ar Condicionado",
    bathrobe: "Roupão", terrace: "Terraço", tv: "TV", balcony: "Varanda",
    jacuzzi: "Jacuzzi", pool: "Piscina", kitchen: "Cozinha", ocean_view: "Vista para o Mar",
    garden_view: "Vista para o Jardim", mountain_view: "Vista para a Montanha", room_service: "Serviço de Quarto",
    coffee_maker: "Cafeteira", hair_dryer: "Secador de Cabelo", iron: "Ferro de Passar",
  },
};

function formatAmenity(key: string, locale: string): string {
  return AMENITY_LABELS[locale]?.[key] ?? AMENITY_LABELS.en[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SelectAccommodationPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t, locale } = useLocale();
  const { state, set } = useBooking();

  const [roomTypes, setRoomTypes] = useState<PublicRoomType[]>([]);
  const [availabilityData, setAvailabilityData] = useState<HotelAvailabilityRoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const retreatStart = state.dates?.start ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? "2026-06-01";
  const retreatNights = diffDays(retreatStart, retreatEnd);
  const retreatPricings = state.display?.retreatPricings ?? null;
  const hasRetreatPricing = retreatPricings && retreatPricings.length > 0;

  const computedCheckIn = retreatStart;
  const computedCheckOut = retreatEnd;

  useEffect(() => {
    if (!state.hotelApiId) return;
    let cancelled = false;

    async function fetchData() {
      try {
        const [hotelRes, availRes] = await Promise.all([
          agencyApi.getHotel(state.hotelApiId!),
          agencyApi.getHotelAvailability(state.hotelApiId!, computedCheckIn, computedCheckOut),
        ]);
        if (cancelled) return;
        let rts = hotelRes.hotel.room_types ?? [];
        // When retreat has explicit pricing, only show rooms included in the retreat
        const rp = state.display?.retreatPricings;
        if (rp && rp.length > 0) {
          const pricedIds = new Set(rp.map((p) => p.roomTypeId));
          rts = rts.filter((rt) => pricedIds.has(rt.id));
        }
        setRoomTypes(rts);
        setAvailabilityData(availRes.room_types ?? []);
        if (state.roomTypeApiId && rts.find((rt) => rt.id === state.roomTypeApiId)) {
          setSelectedRoom(state.roomTypeApiId);
        } else if (rts.length > 0) {
          setSelectedRoom(rts[0].id);
        }
      } catch {
        // Use fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [state.hotelApiId, computedCheckIn, computedCheckOut]);

  const room = roomTypes.find((r) => r.id === selectedRoom);
  // Use retreat per-guest pricing when available, otherwise fall back to per-night
  const retreatPriceForRoom = selectedRoom && retreatPricings?.find((p) => p.roomTypeId === selectedRoom);
  const pricePerGuest = retreatPriceForRoom ? retreatPriceForRoom.pricePerGuestCents / 100 : null;
  const pricePerNight = room ? room.price_per_night_cents / 100 : (state.display?.pricePerNightCents ? state.display.pricePerNightCents / 100 : 185);
  const displayPrice = pricePerGuest ?? retreatNights * pricePerNight;

  const commissionRate = state.display?.commissionRate ?? 0.16;
  const commission = Math.round(displayPrice * commissionRate);

  // Compute min availability per room type across the date range
  function getMinAvailability(rtId: number): number {
    const artData = availabilityData.find((a) => a.room_type.id === rtId);
    if (!artData || artData.days.length === 0) return 0;
    return Math.min(...artData.days.map((d) => d.available));
  }

  const displayHotelName = state.display?.hotelName ?? "Hotel";
  const displayHotelLocation = state.display?.hotelLocation ?? "";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 bg-humana-stone min-h-screen px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: displayHotelName, href: `/select-country/${country}` },
          { label: "Fechas", href: `/select-country/${country}/step-1-select-dates` },
          { label: "Alojamiento" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          PASO 2 DE 5
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Seleccionar alojamiento
        </h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">
          Elegi el tipo de habitacion para tu cliente.
        </p>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-1 flex-col gap-6">
          {roomTypes.map((rt) => {
            const isSelected = selectedRoom === rt.id;
            const availability = getMinAvailability(rt.id);
            const isUnavailable = availability === 0;
            const isLow = availability > 0 && availability <= 2;
            return (
              <button key={rt.id} type="button" onClick={() => !isUnavailable && setSelectedRoom(rt.id)}
                className={`flex overflow-hidden border bg-white text-left transition-all duration-200 ${isUnavailable ? "cursor-not-allowed opacity-60 border-humana-line" : "cursor-pointer"} ${isSelected && !isUnavailable ? "border-humana-gold" : "border-humana-line hover:border-humana-ink"}`}>
                {/* Image */}
                <div className={`relative shrink-0 bg-humana-stone transition-all duration-300 ${isSelected ? "w-[280px]" : "w-[180px]"}`}>
                  <Image src={rt.image_url ?? "/images/retreat-tulum.jpg"} alt={rt.name} fill className="object-cover" />
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[11px] font-semibold text-humana-ink">{rt.capacity}</span>
                  </div>
                  {isSelected && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        {isSelected && !isUnavailable && (
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                              <circle cx="12" cy="12" r="10" stroke="#d4af37" strokeWidth="2" />
                              <path d="M8 12l3 3 5-5" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            SELECCIONADA
                          </span>
                        )}
                        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-humana-ink">{rt.name}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">{t.hotelDetail.priceFrom}</span>
                        {(() => {
                          const rp = retreatPricings?.find((p) => p.roomTypeId === rt.id);
                          if (rp) {
                            return (
                              <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
                                U$D {(rp.pricePerGuestCents / 100).toLocaleString()}
                                <span className="text-[12px] font-normal text-humana-muted"> / huésped</span>
                              </span>
                            );
                          }
                          return (
                            <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
                              U$D {rt.price_per_night_cents / 100}
                              <span className="text-[12px] font-normal text-humana-muted"> / noche</span>
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                    <p className="text-[14px] leading-[22px] text-humana-muted">{rt.description}</p>
                  </div>

                  {/* Expanded detail — only when selected */}
                  {isSelected && !isUnavailable && (
                    <div className="flex flex-col gap-4 animate-fade-in-up">
                      <div className="h-px bg-humana-line" />
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                            <path d="M21 10H3" />
                            <path d="M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
                          </svg>
                          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.rooms}</span>
                          <span className="text-[14px] text-humana-muted">{rt.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.capacity}</span>
                          <span className="text-[14px] text-humana-muted">{t.hotelDetail.personCount(rt.capacity)}</span>
                        </div>
                      </div>

                      <div className="h-px bg-humana-line" />

                      {/* Amenities */}
                      {rt.amenities_list.length > 0 && (
                        <div className="flex flex-col gap-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.amenities}</span>
                          <div className="flex flex-wrap gap-2">
                            {rt.amenities_list.slice(0, 6).map((a) => (
                              <span key={a} className="border border-humana-line px-3 py-1.5 text-[12px] text-humana-muted">{formatAmenity(a, locale)}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer — availability */}
                  <div className="flex items-center gap-1.5 text-[13px]">
                    {isUnavailable ? (
                      <>
                        <span className="text-red-500">●</span>
                        <span className="text-red-600">Sin disponibilidad para tus fechas</span>
                      </>
                    ) : (
                      <>
                        <span className={isLow ? "text-yellow-500" : "text-green-500"}>●</span>
                        <span className={isLow ? "text-yellow-600" : "text-green-600"}>{availability} disponibles para tus fechas</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line bg-white p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">RESUMEN DE RESERVA</span>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-humana-ink">{displayHotelName}</span>
              <span className="text-[13px] text-humana-muted">{displayHotelLocation}</span>
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-humana-muted">Retiro</span>
              <span className="text-[13px] font-medium text-humana-ink">{formatDateShort(retreatStart)} — {formatDateShort(retreatEnd)}</span>
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">
                  {retreatNights} noches x U$D {hasRetreatPricing ? Math.round(displayPrice / retreatNights) : pricePerNight}
                </span>
                <span className="text-[14px] font-medium text-humana-ink">U$D {displayPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-px bg-humana-line" />
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-humana-ink">Total por huésped</span>
              <span className="text-[18px] font-semibold text-humana-ink">U$D {displayPrice.toLocaleString()}</span>
            </div>
            <span className="text-[14px] font-medium text-humana-gold">Tu comision estimada: U$D {commission.toLocaleString()} ({Math.round(commissionRate * 100)}%)</span>
            <Link href={`/select-country/${country}/step-3-assign-client`} onClick={() => set({
              roomTypeId: selectedRoom ? String(selectedRoom) : null,
              roomTypeApiId: selectedRoom,
              guests: room?.capacity ?? 1,
              preNights: 0,
              postNights: 0,
              display: state.display ? {
                ...state.display,
                roomTypeName: room?.name ?? "",
                pricePerNightCents: retreatPriceForRoom ? retreatPriceForRoom.pricePerGuestCents : (room?.price_per_night_cents ?? state.display.pricePerNightCents),
              } : null,
            })}
              className="group/cta flex items-center justify-center gap-3 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]">
              CONTINUAR
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5"><path d="M1 5h14M10 1l4 4-4 4" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
