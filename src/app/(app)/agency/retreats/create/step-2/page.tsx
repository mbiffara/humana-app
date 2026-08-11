/** Agency retreat wizard step 2 — hotel selection.
 *  Shows hotels that have available inventory blocks for the retreat dates.
 *  Contextual empty states when no hotels match: no inventory, wrong dates,
 *  or all rooms committed. */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAgencyRetreatWizard, computeEndDate } from "@/contexts/AgencyRetreatWizardContext";
import { agencyApi, type ApiInventoryBlock, type PublicHotel } from "@/lib/api/agency";

type EmptyReason = "no_inventory" | "dates_not_covered" | "all_committed" | null;

export default function AgencyRetreatHotelStep() {
  const { t, locale } = useLocale();
  const tw = t.agencyWs.retreats.wizard;
  const { state, set } = useAgencyRetreatWizard();
  const [hotels, setHotels] = useState<(PublicHotel & { blockCount: number; totalRooms: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [emptyReason, setEmptyReason] = useState<EmptyReason>(null);
  const [inventoryRange, setInventoryRange] = useState<{ from: string; to: string } | null>(null);

  const endDate = computeEndDate(state.startDate, state.nights);

  useEffect(() => {
    if (!state.startDate || !endDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setEmptyReason(null);

    agencyApi
      .listInventoryBlocks({ from: state.startDate, to: endDate })
      .then(async (res) => {
        // Group blocks by hotel (only those with available rooms)
        const hotelMap = new Map<number, { hotel: PublicHotel; blockCount: number; totalRooms: number }>();
        for (const block of res.inventory_blocks) {
          if (block.available_rooms <= 0) continue;
          const existing = hotelMap.get(block.hotel_id);
          if (existing) {
            existing.blockCount++;
            existing.totalRooms += block.available_rooms;
          } else {
            hotelMap.set(block.hotel_id, {
              hotel: block.hotel,
              blockCount: 1,
              totalRooms: block.available_rooms,
            });
          }
        }

        const result = Array.from(hotelMap.values()).map(({ hotel, blockCount, totalRooms }) => ({
          ...hotel,
          blockCount,
          totalRooms,
        }));

        setHotels(result);

        // If no available hotels, figure out WHY
        if (result.length === 0) {
          try {
            // Check if blocks exist for the dates but all rooms are committed
            const hasBlocksForDates = res.inventory_blocks.length > 0;
            if (hasBlocksForDates) {
              setEmptyReason("all_committed");
              return;
            }

            // No blocks for these dates — check if agency has ANY blocks at all
            const allBlocks = await agencyApi.listInventoryBlocks({});
            if (allBlocks.inventory_blocks.length === 0) {
              setEmptyReason("no_inventory");
            } else {
              // Has inventory but not for these dates — compute the range
              const starts = allBlocks.inventory_blocks.map((b) => b.starts_on).sort();
              const ends = allBlocks.inventory_blocks.map((b) => b.ends_on).sort();
              const dateFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
              setInventoryRange({
                from: dateFmt.format(new Date(`${starts[0]}T00:00:00`)),
                to: dateFmt.format(new Date(`${ends[ends.length - 1]}T00:00:00`)),
              });
              setEmptyReason("dates_not_covered");
            }
          } catch {
            // Fallback to generic message
            setEmptyReason(null);
          }
        }
      })
      .catch(() => {
        setHotels([]);
        setEmptyReason(null);
      })
      .finally(() => setLoading(false));
  }, [state.startDate, endDate, locale]);

  function selectHotel(hotel: PublicHotel & { blockCount: number; totalRooms: number }) {
    set({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelCountry: hotel.country,
      hotelCountryCode: hotel.country_code,
      // Reset pricing when hotel changes
      pricing: [],
      capacityCovered: null,
    });
  }

  // Determine which empty state title/hint to show
  function getEmptyContent(): { title: string; hint: string } {
    switch (emptyReason) {
      case "no_inventory":
        return { title: tw.hotel.emptyNoInventoryTitle, hint: tw.hotel.emptyNoInventoryHint };
      case "dates_not_covered":
        return {
          title: tw.hotel.emptyDatesTitle,
          hint: inventoryRange
            ? tw.hotel.emptyDatesHint(inventoryRange.from, inventoryRange.to)
            : tw.hotel.emptyHint,
        };
      case "all_committed":
        return { title: tw.hotel.emptyCommittedTitle, hint: tw.hotel.emptyCommittedHint };
      default:
        return { title: tw.hotel.emptyTitle, hint: tw.hotel.emptyHint };
    }
  }

  return (
    <section className="animate-fade-in-up">
      <div className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tw.stepOf(2, 6)}
        </p>
        <h2 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
          {tw.hotel.title}
        </h2>
        <p className="mt-1 text-[15px] leading-[22px] text-humana-muted">{tw.hotel.subtitle}</p>

        {loading ? (
          <div className="mt-10 flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          </div>
        ) : hotels.length === 0 ? (
          /* Contextual empty state */
          (() => {
            const { title, hint } = getEmptyContent();
            const iconColor = emptyReason === "all_committed" ? "#d97706" : "#8a8578";
            return (
              <div className="mt-10 flex flex-col items-center rounded-lg border border-humana-line bg-humana-stone/30 py-16 text-center">
                {emptyReason === "all_committed" ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : emptyReason === "no_inventory" ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )}
                <p className="mt-4 text-[16px] font-medium text-humana-ink">{title}</p>
                <p className="mt-2 max-w-md text-[14px] text-humana-muted">{hint}</p>
                {emptyReason === "dates_not_covered" && (
                  <Link
                    href="/agency/retreats/create/step-1"
                    className="mt-6 border border-humana-ink bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:bg-humana-ink hover:text-white"
                  >
                    {tw.back}
                  </Link>
                )}
                {emptyReason !== "dates_not_covered" && (
                  <Link
                    href="/map"
                    className="mt-6 bg-humana-gold px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
                  >
                    {tw.hotel.searchAccommodations}
                  </Link>
                )}
              </div>
            );
          })()
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {hotels.map((hotel) => {
              const isSelected = state.hotelId === hotel.id;
              return (
                <button
                  key={hotel.id}
                  onClick={() => selectHotel(hotel)}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                    isSelected
                      ? "border-humana-gold bg-humana-gold-light/30 shadow-sm"
                      : "border-humana-line bg-white hover:border-humana-gold/50 hover:shadow-sm"
                  }`}
                >
                  {/* Hotel cover */}
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-humana-stone">
                    {hotel.cover_image_url ? (
                      <Image src={hotel.cover_image_url} alt={hotel.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-humana-subtle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15" />
                          <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Hotel info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-humana-ink">{hotel.name}</p>
                    <p className="mt-0.5 text-[13px] text-humana-muted">
                      {[hotel.city, hotel.country].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-1 text-[12px] text-humana-subtle">
                      {tw.hotel.roomsAvailable(hotel.totalRooms)} · {tw.hotel.roomTypes(hotel.blockCount)}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected ? "border-humana-gold bg-humana-gold" : "border-humana-line"
                    }`}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
