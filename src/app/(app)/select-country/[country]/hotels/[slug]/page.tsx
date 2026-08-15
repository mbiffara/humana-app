"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import { countries, countrySlugToId } from "@/data/countries";
import { useBooking } from "@/contexts/BookingContext";
import { agencyApi, type PublicHotelFull, type PublicRoomType, type HotelAvailabilityRoomType, type ApiExperience } from "@/lib/api/agency";
import { retreatToExperience } from "@/lib/retreat-experience";
import { amenityIdForName } from "@/lib/amenity-catalog";
import {
  MONTH_NAMES, WEEKDAY_NAMES, daysInMonth, firstDayOfMonth, toDateStr,
  formatDateShort, diffDays, todayStr,
} from "@/lib/calendar-utils";

export default function HotelDetailPage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = React.use(params);
  const { t, locale } = useLocale();
  const router = useRouter();
  const { set } = useBooking();
  const [hotel, setHotel] = useState<PublicHotelFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<PublicRoomType | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Room modal state
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [roomImgIdx, setRoomImgIdx] = useState(0);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [availability, setAvailability] = useState<HotelAvailabilityRoomType[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Tab state
  type TabKey = "rooms" | "retreats" | "info";
  const [activeTab, setActiveTab] = useState<TabKey>("rooms");
  const [hotelExperiences, setHotelExperiences] = useState<ApiExperience[]>([]);

  const countryId = countrySlugToId[country] ?? country;
  const countryData = countries.find((c) => c.id === countryId);
  const countryName = countryData?.name ?? country.charAt(0).toUpperCase() + country.slice(1);

  const localeIdx = locale === "es" ? 1 : locale === "pt" ? 2 : 0;
  const months = MONTH_NAMES[localeIdx];
  const weekdays = WEEKDAY_NAMES[localeIdx];
  const today = todayStr();

  useEffect(() => {
    const hotelId = parseInt(slug, 10);
    if (isNaN(hotelId)) {
      setLoading(false);
      return;
    }
    agencyApi
      .getHotel(hotelId)
      .then((res) => setHotel(res.hotel))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  // Fetch experiences + public retreats for this hotel
  useEffect(() => {
    if (!hotel) return;
    Promise.all([
      agencyApi.listExperiences({ hotel_id: hotel.id }).then((res) => res.experiences).catch(() => [] as ApiExperience[]),
      agencyApi.listPublicRetreats({ hotel_id: hotel.id }).then((res) => res.retreats.map(retreatToExperience)).catch(() => [] as ApiExperience[]),
    ]).then(([exps, retreats]) => {
      // Deduplicate by slug
      const seen = new Set<string>();
      const merged: ApiExperience[] = [];
      for (const e of [...exps, ...retreats]) {
        if (!seen.has(e.slug)) { seen.add(e.slug); merged.push(e); }
      }
      setHotelExperiences(merged);
    });
  }, [hotel]);

  // Reset modal state when selectedRoom changes
  useEffect(() => {
    setModalStep(1);
    setRoomImgIdx(0);
    setCheckIn(null);
    setCheckOut(null);
    setAvailability([]);
    const n = new Date();
    setCalMonth(n.getMonth());
    setCalYear(n.getFullYear());
  }, [selectedRoom]);

  // Fetch availability for the visible calendar months (pre-fetch for calendar coloring)
  useEffect(() => {
    if (!hotel || !selectedRoom) return;
    let cancelled = false;
    setLoadingAvailability(true);
    // Fetch from 1st of current visible month to end of second visible month
    const from = toDateStr(calYear, calMonth, 1);
    const endMonth = calMonth === 11 ? 0 : calMonth + 1;
    const endYear = calMonth === 11 ? calYear + 1 : calYear;
    const lastDay = daysInMonth(endYear, endMonth);
    const to = toDateStr(endYear, endMonth, lastDay);
    agencyApi
      .getHotelAvailability(hotel.id, from, to)
      .then((res) => {
        if (!cancelled) setAvailability(res.room_types ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingAvailability(false);
      });
    return () => { cancelled = true; };
  }, [calMonth, calYear, hotel, selectedRoom]);

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
      const total = hotel.images.length;
      if (total === 0) return;
      if (e.key === "ArrowRight") setLightboxIdx((prev) => (prev !== null ? (prev + 1) % total : null));
      if (e.key === "ArrowLeft") setLightboxIdx((prev) => (prev !== null ? (prev - 1 + total) % total : null));
    }
  }, [lightboxIdx, hotel]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

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

  const gallery = hotel.images.map((i) => i.image_url);
  const location = [hotel.city, hotel.country].filter(Boolean).join(", ");

  // Room images for carousel
  const roomImages = selectedRoom?.images?.length
    ? selectedRoom.images.sort((a, b) => a.position - b.position).map((img) => img.image_url)
    : selectedRoom?.image_url
      ? [selectedRoom.image_url]
      : [];

  // Calendar date click handler
  function handleDateClick(dateStr: string) {
    if (dateStr < today) return;
    const dayAvail = availByDate[dateStr];
    if (dayAvail !== undefined && dayAvail <= 0) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      if (dateStr <= checkIn) {
        setCheckIn(dateStr);
        setCheckOut(null);
      } else {
        setCheckOut(dateStr);
      }
    }
  }

  // Calendar navigation
  function handlePrevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  }
  function handleNextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  }
  const secondMonth = calMonth === 11 ? 0 : calMonth + 1;
  const secondYear = calMonth === 11 ? calYear + 1 : calYear;

  function renderCalMonth(year: number, month: number) {
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }
    for (let d = 1; d <= days; d++) {
      const dateStr = toDateStr(year, month, d);
      const isPast = dateStr < today;
      const isCheckIn = dateStr === checkIn;
      const isCheckOut = dateStr === checkOut;
      const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
      const isToday = dateStr === today;
      const dayAvail = availByDate[dateStr];
      const isSoldOut = dayAvail !== undefined && dayAvail <= 0;
      const isDisabled = isPast || isSoldOut;

      let cls = "flex h-7 w-7 items-center justify-center text-[12px] transition-all duration-100 relative ";
      if (isDisabled) {
        cls += "text-humana-line cursor-default line-through";
      } else if (isCheckIn) {
        cls += "bg-humana-gold text-white font-semibold rounded-l-full cursor-pointer";
      } else if (isCheckOut) {
        cls += "bg-humana-gold text-white font-semibold rounded-r-full cursor-pointer";
      } else if (isInRange) {
        cls += "bg-humana-gold/15 text-humana-ink cursor-pointer";
      } else if (dayAvail !== undefined && dayAvail <= 2) {
        cls += "text-amber-600 hover:bg-humana-gold/10 cursor-pointer";
        if (isToday) cls += " ring-1 ring-humana-gold/40 rounded-full";
      } else {
        cls += "text-humana-muted hover:bg-humana-gold/10 cursor-pointer";
        if (isToday) cls += " ring-1 ring-humana-gold/40 rounded-full";
      }

      cells.push(
        <button
          key={d}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateClick(dateStr)}
          className={cls}
        >
          {d}
        </button>
      );
    }
    return (
      <div className="flex flex-1 flex-col">
        <h3 className="py-1.5 text-center text-[12px] font-medium tracking-[-0.01em] text-humana-ink">
          {months[month]} {year}
        </h3>
        <div className="grid grid-cols-7 px-0.5">
          {weekdays.map((wd, i) => (
            <div key={`${wd}-${i}`} className="flex h-6 items-center justify-center text-[9px] font-semibold uppercase tracking-[0.16em] text-humana-subtle">
              {wd}
            </div>
          ))}
          {cells}
        </div>
      </div>
    );
  }

  // Pricing calculations for the modal
  const nights = checkIn && checkOut ? diffDays(checkIn, checkOut) : 0;
  const pricePerNight = selectedRoom ? selectedRoom.price_per_night_cents / 100 : 0;
  const totalPrice = nights * pricePerNight;
  const commissionRate = 0.16;
  const commission = Math.round(totalPrice * commissionRate);

  // Room availability map: date → available count
  const roomAvail = selectedRoom ? availability.find((a) => a.room_type.id === selectedRoom.id) : null;
  const availByDate: Record<string, number> = {};
  if (roomAvail) {
    for (const d of roomAvail.days) {
      availByDate[d.date] = d.available;
    }
  }
  // Min availability for the selected date range
  const rangeAvail = (checkIn && checkOut && roomAvail)
    ? roomAvail.days.filter((d) => d.date >= checkIn && d.date < checkOut)
    : [];
  const minAvail = rangeAvail.length > 0 ? Math.min(...rangeAvail.map((d) => d.available)) : null;
  const isAvailable = minAvail === null || minAvail > 0;

  function handleBookNow() {
    if (!selectedRoom || !checkIn || !checkOut || !hotel) return;
    set({
      flowType: "hotels",
      country,
      hotelApiId: hotel.id,
      hotelSlug: slug,
      experienceId: null,
      retreatApiId: null,
      retreatSlug: null,
      dates: { start: checkIn, end: checkOut },
      roomTypeId: String(selectedRoom.id),
      roomTypeApiId: selectedRoom.id,
      guests: 1,
      preNights: 0,
      postNights: 0,
      display: {
        hotelName: hotel.name,
        hotelImage: hotel.images[0]?.image_url ?? "",
        hotelLocation: location,
        roomTypeName: selectedRoom.name,
        retreatName: "",
        pricePerNightCents: selectedRoom.price_per_night_cents,
        currency: selectedRoom.currency,
        commissionRate,
      },
    });
    router.push(`/select-country/${country}/step-3-assign-client`);
  }

  // Room specs grid items
  function roomSpecs() {
    if (!selectedRoom) return [];
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const specs: { label: string; value: string }[] = [];
    if (selectedRoom.bed_type) specs.push({ label: "Cama", value: cap(selectedRoom.bed_type) });
    if (selectedRoom.view_type) specs.push({ label: "Vista", value: cap(selectedRoom.view_type) });
    if (selectedRoom.area_sqm) specs.push({ label: "Area", value: `${selectedRoom.area_sqm} m²` });
    specs.push({ label: t.hotelDetail.capacity, value: t.hotelDetail.personCount(selectedRoom.capacity) });
    return specs;
  }

  return (
    <div className="animate-fade-in-up mx-auto flex max-w-[1400px] flex-col">
      {/* Gallery — click to open lightbox */}
      {gallery.length > 0 && (
        <div className="flex gap-2 px-16 pt-8">
          <button type="button" onClick={() => setLightboxIdx(0)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ flex: "0 0 65%", height: 400 }}>
            <Image src={gallery[0]} alt={hotel.name} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </button>
          <div className="flex flex-col gap-2" style={{ flex: "0 0 35%" }}>
            <button type="button" onClick={() => setLightboxIdx(1)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ height: 198 }}>
              <Image src={gallery[1] ?? gallery[0]} alt={`${hotel.name} 2`} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </button>
            <button type="button" onClick={() => setLightboxIdx(2)} className="relative cursor-pointer overflow-hidden bg-humana-stone" style={{ height: 198 }}>
              <Image src={gallery[2] ?? gallery[0]} alt={`${hotel.name} 3`} fill className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
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
            { label: t.breadcrumb.hotels, href: `/select-country/${country}/hotels` },
            { label: hotel.name },
          ]}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8 px-16 pt-8 pb-16">
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.hotelDetail.certifiedHotel.toUpperCase()} &middot; {location.toUpperCase()}
          </span>
          <h1 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-humana-ink">{hotel.name}</h1>
          {hotel.description && (
            <p className="max-w-[960px] text-[15px] leading-[24px] text-humana-muted">{hotel.description}</p>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-8 border-b border-humana-line">
          <button type="button" onClick={() => setActiveTab("rooms")}
            className={`border-b-2 pb-3 text-[14px] font-bold transition-colors ${activeTab === "rooms" ? "border-humana-ink text-humana-ink" : "border-transparent text-humana-muted hover:text-humana-ink"}`}>
            {t.hotelDetail.rooms}
          </button>
          <button type="button" onClick={() => hotelExperiences.length > 0 && setActiveTab("retreats")}
            className={`border-b-2 pb-3 text-[14px] font-medium transition-colors ${activeTab === "retreats" ? "border-humana-ink text-humana-ink font-bold" : hotelExperiences.length > 0 ? "border-transparent text-humana-muted hover:text-humana-ink cursor-pointer" : "border-transparent text-humana-muted/40 cursor-default"}`}>
            {t.breadcrumb.retreats}
            {hotelExperiences.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-humana-gold/15 text-[11px] font-semibold text-humana-gold">{hotelExperiences.length}</span>
            )}
          </button>
          <button type="button" onClick={() => setActiveTab("info")}
            className={`border-b-2 pb-3 text-[14px] font-medium transition-colors ${activeTab === "info" ? "border-humana-ink text-humana-ink font-bold" : "border-transparent text-humana-muted hover:text-humana-ink cursor-pointer"}`}>
            {t.hotelDetail.info}
          </button>
        </div>

        {/* ── Tab: Rooms ── */}
        {activeTab === "rooms" && (
        <div className="flex flex-col gap-5">
          {hotel.room_types.map((rt) => (
            <div
              key={rt.id}
              className="flex overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative w-[320px] shrink-0 bg-humana-stone">
                {rt.image_url && <Image src={rt.image_url} alt={rt.name} fill className="object-cover" />}
                <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-[11px] font-semibold text-humana-ink">{rt.capacity}</span>
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
                      {rt.currency} {rt.price_per_night}
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
        )}

        {/* ── Tab: Retreats ── */}
        {activeTab === "retreats" && (
          <div>
            {hotelExperiences.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e6e2d6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                <p className="text-[15px] text-humana-muted">Este hotel aun no tiene retiros publicados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {hotelExperiences.map((exp) => {
                  const nights = exp.starts_on && exp.ends_on ? diffDays(exp.starts_on, exp.ends_on) : 0;
                  const kindLabel = exp.kind.toUpperCase();
                  const startFmt = exp.starts_on ? formatDateShort(exp.starts_on) : "";
                  const endFmt = exp.ends_on ? formatDateShort(exp.ends_on) : "";
                  const pricePerGuest = exp.price_cents > 0 ? exp.price_cents / 100 : 0;
                  const commRate = exp.commission_rate ?? 0.16;
                  const totalCommRate = Math.round((commRate + 0.02) * 100);

                  return (
                    <div
                      key={exp.id}
                      className="flex flex-col overflow-hidden border border-humana-line bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Image with badge */}
                      <div className="relative h-[220px] bg-humana-stone">
                        {exp.image_url && <Image src={exp.image_url} alt={exp.title} fill className="object-cover" />}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-humana-ink">
                            {kindLabel} &middot; {nights} {nights === 1 ? "NOCHE" : "NOCHES"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        <p className="text-[12px] text-humana-muted">
                          {hotel.name} &middot; {location} &middot; {startFmt} – {endFmt}
                        </p>
                        <h3 className="text-[18px] font-medium leading-snug tracking-[-0.01em] text-humana-ink">
                          {exp.title}
                        </h3>
                        {exp.description && (
                          <p className="line-clamp-3 text-[13px] leading-[20px] text-humana-muted">
                            {exp.description}
                          </p>
                        )}

                        <div className="mt-auto flex flex-col gap-4 pt-3">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">DESDE</span>
                            <span className="text-[22px] font-light tracking-[-0.01em] text-humana-ink">
                              {exp.currency} {pricePerGuest.toLocaleString("en-US")}
                            </span>
                            <span className="text-[13px] text-humana-muted">/ por huésped</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-medium text-humana-gold">Comisión {totalCommRate}%</span>
                          </div>
                          <Link
                            href={`/select-country/${country}/retreats/${exp.slug}`}
                            className="flex items-center justify-center gap-2 bg-humana-ink py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                          >
                            RESERVAR ESTE RETIRO
                            <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 5h14M10 1l4 4-4 4" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Info ── */}
        {activeTab === "info" && (
          <div className="flex flex-col gap-8">
            {/* Hotel details grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {hotel.stars && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Estrellas</span>
                  <span className="text-[14px] text-humana-muted">{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}</span>
                </div>
              )}
              {hotel.total_rooms && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Habitaciones totales</span>
                  <span className="text-[14px] text-humana-muted">{hotel.total_rooms}</span>
                </div>
              )}
              {hotel.check_in_time && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Check-in</span>
                  <span className="text-[14px] text-humana-muted">{hotel.check_in_time}</span>
                </div>
              )}
              {hotel.check_out_time && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Check-out</span>
                  <span className="text-[14px] text-humana-muted">{hotel.check_out_time}</span>
                </div>
              )}
              {hotel.address && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Direccion</span>
                  <span className="text-[14px] text-humana-muted">{[hotel.address, hotel.postal_code].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {hotel.phone && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Telefono</span>
                  <span className="text-[14px] text-humana-muted">{hotel.phone}</span>
                </div>
              )}
              {hotel.contact_email && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Email</span>
                  <span className="text-[14px] text-humana-muted">{hotel.contact_email}</span>
                </div>
              )}
              {hotel.website && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Website</span>
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-[14px] text-humana-gold hover:underline">{hotel.website}</a>
                </div>
              )}
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <>
                <div className="h-px bg-humana-line" />
                <div className="flex flex-col gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">{t.hotelDetail.amenities}</span>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-3 md:grid-cols-3">
                    {hotel.amenities.map((a) => {
                      const amenityKey = amenityIdForName(a.name);
                      const translated = amenityKey ? (t.onboarding.hotel.amenityNames as Record<string, string>)[amenityKey] : null;
                      return (
                        <div key={a.id} className="flex items-center gap-2.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <circle cx="12" cy="12" r="11" stroke="#d4af37" strokeWidth="1.5" />
                            <polyline points="7.5 12 10.5 15 16.5 9" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[14px] text-humana-muted">{translated || a.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Room detail modal — portaled to body so it covers the TopNav */}
      {selectedRoom && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedRoom(null)}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] animate-fade-in" />

          {/* Modal card */}
          <div
            className="relative flex w-full max-w-[1120px] h-[580px] overflow-hidden bg-white shadow-2xl animate-fade-in-up"
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

            {/* Left side — Image carousel */}
            <div className="relative w-[480px] shrink-0 flex flex-col bg-humana-stone">
              {/* Main image */}
              <div className="relative flex-1 min-h-[400px]">
                {roomImages.length > 0 ? (
                  <Image src={roomImages[roomImgIdx]} alt={selectedRoom.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-humana-subtle text-[14px]">No image</div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Prev/Next arrows */}
                {roomImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setRoomImgIdx((roomImgIdx - 1 + roomImages.length) % roomImages.length)}
                      className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/80 text-humana-ink shadow-sm transition-all hover:bg-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomImgIdx((roomImgIdx + 1) % roomImages.length)}
                      className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/80 text-humana-ink shadow-sm transition-all hover:bg-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </>
                )}

                {/* Image counter */}
                {roomImages.length > 1 && (
                  <span className="absolute bottom-3 right-3 z-10 bg-black/50 px-3 py-1 text-[12px] font-medium text-white">
                    {roomImgIdx + 1} / {roomImages.length}
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              {roomImages.length > 1 && (
                <div className="flex gap-1 bg-black/5 p-2 overflow-x-auto">
                  {roomImages.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRoomImgIdx(i)}
                      className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden transition-all ${
                        i === roomImgIdx ? "ring-2 ring-humana-gold" : "opacity-60 hover:opacity-90"
                      }`}
                    >
                      <Image src={src} alt={`${selectedRoom.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side — scrollable panel */}
            <div className="flex flex-1 flex-col overflow-y-auto">
              {/* ─── Step 1: Room details ─── */}
              {modalStep === 1 && (
                <>
                  <div className="flex flex-1 flex-col gap-4 p-8 pb-0">
                    {/* Header */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                        {hotel.name}
                      </span>
                      <h2 className="text-[24px] font-light tracking-[-0.02em] text-humana-ink">
                        {selectedRoom.name}
                      </h2>
                    </div>

                    <div className="h-px bg-humana-line" />

                    {/* Room specs grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {roomSpecs().map((spec) => (
                        <div key={spec.label} className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-humana-ink">{spec.label}</span>
                          <span className="text-[13px] text-humana-muted">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-humana-line" />

                    {/* Room amenities */}
                    {selectedRoom.amenities_list && selectedRoom.amenities_list.length > 0 && (
                      <>
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                            {t.hotelDetail.amenities}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedRoom.amenities_list.map((a) => {
                              const roomItems = t.hotelWs.roomEditor.amenitiesStep.items as Record<string, string>;
                              const translated = roomItems[a] ?? a;
                              return (
                                <span
                                  key={a}
                                  className="flex items-center gap-1.5 border border-humana-line px-3 py-1 text-[12px] text-humana-muted"
                                  style={{ borderRadius: 9999 }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                    <circle cx="12" cy="12" r="11" stroke="#d4af37" strokeWidth="1.5" />
                                    <polyline points="7.5 12 10.5 15 16.5 9" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  {translated}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="h-px bg-humana-line" />
                      </>
                    )}

                    {/* Description */}
                    {selectedRoom.description && (
                      <p className="text-[14px] leading-[22px] text-humana-muted">{selectedRoom.description}</p>
                    )}

                    {/* Price preview */}
                    <div className="mt-auto flex items-baseline gap-1.5 pt-4">
                      <span className="text-[24px] font-semibold tracking-[-0.02em] text-humana-ink">
                        {selectedRoom.currency} {selectedRoom.price_per_night}
                      </span>
                      <span className="text-[13px] text-humana-muted">/ noche</span>
                    </div>
                  </div>

                  {/* Step 1 CTA */}
                  <div className="sticky bottom-0 border-t border-humana-line bg-white p-8 pt-5">
                    <button
                      type="button"
                      onClick={() => setModalStep(2)}
                      className="flex w-full cursor-pointer items-center justify-center gap-3 bg-humana-gold py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-humana-ink active:scale-[0.98]"
                    >
                      Seleccionar fechas →
                    </button>
                  </div>
                </>
              )}

              {/* ─── Step 2: Date selection + booking ─── */}
              {modalStep === 2 && (
                <>
                  <div className="flex flex-1 flex-col gap-3 p-6 pb-0">
                    {/* Room summary row */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                          {hotel.name}
                        </span>
                        <h2 className="text-[18px] font-light tracking-[-0.02em] text-humana-ink">
                          {selectedRoom.name}
                        </h2>
                      </div>
                    </div>

                    <div className="h-px bg-humana-line" />

                    {/* Calendar header + nav */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                        Seleccionar fechas
                      </span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={handlePrevMonth}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-humana-line bg-white text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink cursor-pointer">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <button type="button" onClick={handleNextMonth}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-humana-line bg-white text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink cursor-pointer">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                      </div>
                    </div>

                    {/* Two-month calendar */}
                    <div className="flex gap-2">
                      {renderCalMonth(calYear, calMonth)}
                      {renderCalMonth(secondYear, secondMonth)}
                    </div>

                    {/* Selected dates */}
                    <div className="flex items-center gap-6 rounded-lg bg-humana-stone/60 px-4 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-humana-gold">Check-in</span>
                        <span className="text-[14px] font-medium text-humana-ink">{checkIn ? formatDateShort(checkIn) : "—"}</span>
                      </div>
                      <div className="h-8 w-px bg-humana-line" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-humana-gold">Check-out</span>
                        <span className="text-[14px] font-medium text-humana-ink">{checkOut ? formatDateShort(checkOut) : "—"}</span>
                      </div>
                      {nights > 0 && (
                        <>
                          <div className="h-8 w-px bg-humana-line" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-humana-subtle">Noches</span>
                            <span className="text-[14px] font-medium text-humana-ink">{nights}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Availability indicator */}
                    <div className="flex items-center gap-2 rounded-lg border border-humana-line px-4 py-2">
                      {loadingAvailability ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border border-humana-line border-t-humana-gold" />
                          <span className="text-[12px] text-humana-subtle">Verificando disponibilidad...</span>
                        </>
                      ) : checkIn && checkOut && minAvail !== null ? (
                        <>
                          <span className={`inline-block h-2 w-2 rounded-full ${minAvail <= 0 ? "bg-red-500" : minAvail <= 2 ? "bg-amber-400" : "bg-emerald-400"}`} />
                          <span className={`text-[13px] font-semibold ${minAvail <= 0 ? "text-red-600" : minAvail <= 2 ? "text-amber-600" : "text-emerald-600"}`}>
                            {minAvail <= 0 ? "Sin disponibilidad" : `${minAvail} ${minAvail === 1 ? "habitacion disponible" : "habitaciones disponibles"}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block h-2 w-2 rounded-full bg-humana-line" />
                          <span className="text-[12px] text-humana-subtle">Selecciona fechas para ver disponibilidad</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price summary + CTA */}
                  <div className="mt-auto flex flex-col gap-2 border-t border-humana-line bg-white px-6 py-4">
                    {checkIn && checkOut && nights > 0 && (
                      <div className="flex flex-col gap-2 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-humana-muted">
                            {nights} {nights === 1 ? "noche" : "noches"} x {selectedRoom.currency} {selectedRoom.price_per_night}
                          </span>
                          <span className="text-[18px] font-semibold tracking-[-0.01em] text-humana-ink">
                            {selectedRoom.currency} {totalPrice.toLocaleString("en-US")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-humana-gold">
                            Comision estimada ({Math.round(commissionRate * 100)}%)
                          </span>
                          <span className="text-[13px] font-semibold text-humana-gold">
                            {selectedRoom.currency} {commission.toLocaleString("en-US")}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setModalStep(1)}
                        className="flex items-center justify-center gap-2 border border-humana-line px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink cursor-pointer"
                      >
                        ← Volver
                      </button>
                      <button
                        type="button"
                        onClick={handleBookNow}
                        disabled={!checkIn || !checkOut || nights <= 0 || (minAvail !== null && !isAvailable)}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-3 bg-humana-gold py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-humana-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-humana-gold"
                      >
                        {t.hotelDetail.bookNow} →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Gallery lightbox — portaled to body */}
      {lightboxIdx !== null && gallery.length > 0 && createPortal(
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
            {lightboxIdx + 1} / {gallery.length}
          </span>

          {/* Prev arrow */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + gallery.length) % gallery.length); }}
            className="absolute left-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % gallery.length); }}
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
              src={gallery[lightboxIdx]}
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
            {gallery.map((src, i) => (
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
