"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWizard } from "@/contexts/WizardContext";
import { WizardVistaPrevia } from "@/components/WizardVistaPrevia";
import { hotels } from "@/data/hotels";
import { inventoryBlocks } from "@/data/inventory";
import { countries } from "@/data/countries";

/* ─── Group inventory by hotel (only available rooms) ─── */
type HotelInventory = {
  hotelId: string;
  hotelName: string;
  location: string;
  country: string;
  image: string;
  blocks: typeof inventoryBlocks;
};

function getAvailableHotels(): HotelInventory[] {
  const available = inventoryBlocks.filter(
    (b) => b.availableRooms > 0 && b.status !== "sold_out"
  );

  const map = new Map<string, HotelInventory>();
  for (const block of available) {
    if (!map.has(block.hotelId)) {
      map.set(block.hotelId, {
        hotelId: block.hotelId,
        hotelName: block.hotelName,
        location: block.location,
        country: block.country,
        image: block.image,
        blocks: [],
      });
    }
    map.get(block.hotelId)!.blocks.push(block);
  }

  return Array.from(map.values());
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${s.getDate()} ${months[s.getMonth()]} — ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
}


/* ─── Main Page ─── */
export default function WizardStep1() {
  const { t } = useLocale();
  const { state, set } = useWizard();
  const [selectedHotel, setSelectedHotel] = useState<string | null>(state.hotelId);

  const availableHotels = getAvailableHotels();

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
                Solo aparecen hoteles con plazas disponibles en tu inventario contratado.
              </p>
            </div>

            {/* Hotel list */}
            <div className="flex flex-col gap-4">
              {availableHotels.map((inv) => {
                const isSelected = selectedHotel === inv.hotelId;
                const countryData = countries.find((c) => c.id === inv.country);
                const hotelData = hotels.find((h) => h.id === inv.hotelId);
                const totalPlazas = inv.blocks.reduce((sum, b) => {
                  const rt = hotelData?.roomTypes.find((r) => r.id === b.roomTypeId);
                  return sum + b.availableRooms * (rt?.maxGuests ?? 2);
                }, 0);

                return (
                  <button
                    key={inv.hotelId}
                    type="button"
                    onClick={() => setSelectedHotel(inv.hotelId)}
                    className={`group relative flex cursor-pointer flex-col border bg-white text-left transition-all duration-200 ${
                      isSelected
                        ? "border-humana-gold shadow-[0_0_0_1px_#d4af37]"
                        : "border-humana-line hover:border-humana-ink"
                    }`}
                  >
                    {/* Hotel header row */}
                    <div className="flex items-center gap-5 p-5">
                      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden bg-humana-stone">
                        <Image src={inv.image} alt={inv.hotelName} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="text-[17px] font-medium text-humana-ink">{inv.hotelName}</span>
                        <span className="text-[13px] text-humana-muted">
                          {countryData?.flag} {inv.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-humana-gold">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          {totalPlazas} {totalPlazas === 1 ? "plaza disponible" : "plazas disponibles"}
                        </span>
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

                    {/* Inventory sub-rows */}
                    <div className="border-t border-humana-line bg-humana-stone/30">
                      {inv.blocks.map((block) => {
                        const hotelData = hotels.find((h) => h.id === block.hotelId);
                        const roomType = hotelData?.roomTypes.find((rt) => rt.id === block.roomTypeId);
                        const maxGuests = roomType?.maxGuests ?? 2;

                        return (
                          <div
                            key={block.id}
                            className="flex items-center gap-4 border-b border-humana-line/60 px-5 py-3 last:border-b-0"
                          >
                            {/* Availability dot */}
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                "bg-emerald-500"
                              }`}
                            />

                            {/* Room type */}
                            <span className="min-w-[140px] text-[13px] font-medium text-humana-ink">
                              {block.roomTypeName}
                            </span>

                            {/* Available count */}
                            <span className="min-w-[60px] text-[12px] text-humana-muted">
                              {block.availableRooms} habs.
                            </span>

                            {/* Guest capacity */}
                            <span className="min-w-[70px] text-[12px] text-humana-subtle">
                              {block.availableRooms * maxGuests} plazas
                            </span>

                            {/* Date range */}
                            <span className="flex-1 text-[12px] text-humana-subtle">
                              {formatDateRange(block.dateStart, block.dateEnd)}
                            </span>

                            {/* Price */}
                            <span className="text-[13px] font-medium text-humana-ink">
                              ${block.pricePerNight}<span className="text-[11px] font-normal text-humana-muted">/noche</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: VISTA PREVIA sidebar */}
        <WizardVistaPrevia
          currentStep={1}
          canProceed={!!selectedHotel}
          onNext={() => { if (selectedHotel) set({ hotelId: selectedHotel }); }}
        />
      </div>
    </div>
  );
}
