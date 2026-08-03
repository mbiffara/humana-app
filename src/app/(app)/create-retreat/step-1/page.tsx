"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWizard } from "@/contexts/WizardContext";
import { WizardVistaPrevia } from "@/components/WizardVistaPrevia";
import { agencyApi, type PublicHotel, type PublicHotelFull } from "@/lib/api/agency";

export default function WizardStep1() {
  const { t } = useLocale();
  const { state, set } = useWizard();
  const [hotels, setHotels] = useState<PublicHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(state.hotelId);
  const [hotelDetail, setHotelDetail] = useState<PublicHotelFull | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    agencyApi
      .listHotels()
      .then((res) => setHotels(res.hotels))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* When page loads with an existing selection, fetch its details */
  useEffect(() => {
    if (state.hotelId && !hotelDetail) {
      setDetailLoading(true);
      agencyApi
        .getHotel(state.hotelId)
        .then((res) => setHotelDetail(res.hotel))
        .catch(() => {})
        .finally(() => setDetailLoading(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback(
    async (id: number) => {
      if (selectedId === id) return;
      setSelectedId(id);
      setDetailLoading(true);
      try {
        const res = await agencyApi.getHotel(id);
        const h = res.hotel;
        setHotelDetail(h);

        const coverImg =
          h.images?.find((img) => img.is_cover)?.image_url ??
          h.images?.[0]?.image_url ??
          "";

        set({
          hotelId: h.id,
          hotelData: {
            name: h.name,
            city: h.city,
            country: h.country,
            image: coverImg,
            description: h.description,
            roomTypes: h.room_types ?? [],
          },
        });
      } catch {
        // ignore
      } finally {
        setDetailLoading(false);
      }
    },
    [selectedId, set],
  );

  return (
    <div className="animate-fade-in-up flex flex-col gap-0 px-16 py-10">
      <div className="flex gap-12">
        {/* LEFT: main content */}
        <div className="flex flex-1 flex-col gap-8">
          <div className="border border-humana-line bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                Paso 1 · Seleccionar hotel
              </span>
              <p className="text-[15px] leading-[22px] text-humana-muted">
                Selecciona un hotel asociado para crear tu retiro.
              </p>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
              </div>
            ) : hotels.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-humana-muted">
                No hay hoteles disponibles en este momento.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {hotels.map((h) => {
                  const isSelected = selectedId === h.id;
                  const isThisDetail = isSelected && hotelDetail?.id === h.id;

                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleSelect(h.id)}
                      className={`group relative flex cursor-pointer flex-col border bg-white text-left transition-all duration-200 ${
                        isSelected
                          ? "border-humana-gold shadow-[0_0_0_1px_#d4af37]"
                          : "border-humana-line hover:border-humana-ink"
                      }`}
                    >
                      {/* Hotel header row */}
                      <div className="flex items-center gap-5 p-5">
                        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden bg-humana-stone">
                          {isThisDetail && hotelDetail.images?.[0]?.image_url ? (
                            <Image
                              src={hotelDetail.images.find((i) => i.is_cover)?.image_url ?? hotelDetail.images[0].image_url}
                              alt={h.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[20px] font-light text-humana-subtle">
                              {h.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          <span className="text-[17px] font-medium text-humana-ink">{h.name}</span>
                          <span className="text-[13px] text-humana-muted">
                            {h.city}, {h.country}
                          </span>
                          {isThisDetail && hotelDetail.room_types && (
                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-humana-gold">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              {hotelDetail.room_types.reduce((sum, rt) => sum + (rt.total_rooms ?? 0) * rt.capacity, 0)} plazas disponibles
                            </span>
                          )}
                        </div>

                        {/* Selection indicator */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-humana-gold bg-humana-gold"
                              : "border-humana-line bg-white group-hover:border-humana-muted"
                          }`}
                        >
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Room type sub-rows (shown for selected hotel) */}
                      {isSelected && detailLoading && (
                        <div className="flex items-center justify-center border-t border-humana-line bg-humana-stone/30 py-4">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
                        </div>
                      )}
                      {isThisDetail && hotelDetail.room_types && hotelDetail.room_types.length > 0 && (
                        <div className="border-t border-humana-line bg-humana-stone/30">
                          {hotelDetail.room_types.map((rt) => (
                            <div
                              key={rt.id}
                              className="flex items-center gap-4 border-b border-humana-line/60 px-5 py-3 last:border-b-0"
                            >
                              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              <span className="min-w-[140px] text-[13px] font-medium text-humana-ink">
                                {rt.name}
                              </span>
                              <span className="min-w-[60px] text-[12px] text-humana-muted">
                                {rt.total_rooms ?? 0} habs.
                              </span>
                              <span className="min-w-[70px] text-[12px] text-humana-subtle">
                                {(rt.total_rooms ?? 0) * rt.capacity} plazas
                              </span>
                              <span className="flex-1 text-[12px] text-humana-subtle">
                                Cap. {rt.capacity} pers.
                              </span>
                              <span className="text-[13px] font-medium text-humana-ink">
                                {rt.currency} {rt.price_per_night}
                                <span className="text-[11px] font-normal text-humana-muted">/noche</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: VISTA PREVIA sidebar */}
        <WizardVistaPrevia
          currentStep={1}
          canProceed={!!selectedId && !!hotelDetail}
        />
      </div>
    </div>
  );
}
