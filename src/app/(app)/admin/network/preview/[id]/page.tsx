/** Admin Hotel Preview — shows the hotel profile as the admin sees it for review. */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { AdminHotelPreview, AdminRoomType, AdminRoomImage, Organization, User } from "@/lib/types";

export default function HotelPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { locale } = useLocale();

  const [hotel, setHotel] = useState<AdminHotelPreview | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<AdminRoomType | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getHotelPreview(Number(id));
        setHotel(res.hotel);
        setOrg(res.organization);
        setOwner(res.owner);
      } catch {
        setError("Hotel not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    if (selectedRoom || lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [selectedRoom, lightboxIdx]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (lightboxIdx !== null) setLightboxIdx(null);
      else setSelectedRoom(null);
    }
    if (lightboxIdx !== null && hotel) {
      const total = hotel.images.length;
      if (e.key === "ArrowRight") setLightboxIdx((prev) => (prev !== null ? (prev + 1) % total : null));
      if (e.key === "ArrowLeft") setLightboxIdx((prev) => (prev !== null ? (prev - 1 + total) % total : null));
    }
  }, [lightboxIdx, hotel]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Helpers ── */

  function getRoomImages(roomId: number): AdminRoomImage[] {
    return hotel?.room_images.filter((ri) => ri.room_type_id === roomId) || [];
  }

  function getRoomPrimaryImage(room: AdminRoomType): string {
    const imgs = getRoomImages(room.id);
    const primary = imgs.find((i) => i.is_primary);
    return primary?.image_url || imgs[0]?.image_url || room.image_url || hotel?.images[0]?.image_url || "";
  }

  function formatPrice(cents: number): string {
    return (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 });
  }

  function capitalizeAmenity(name: string): string {
    return name.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const stars = hotel?.stars ? "★".repeat(hotel.stars) + "☆".repeat(5 - hotel.stars) : null;
  const galleryImages = hotel?.images || [];
  const allAmenities = hotel?.amenities || [];
  const totalRooms = hotel?.total_rooms || hotel?.room_types.reduce((sum, rt) => sum + (rt.total_rooms || 1), 0) || 0;

  /* ── Render ── */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="px-16 py-20 text-center">
        <h1 className="text-[24px] font-light text-humana-ink">{error || "Hotel not found"}</h1>
        <Link href="/admin/network" className="mt-4 inline-block text-[14px] text-humana-gold underline">
          {locale === "es" ? "Volver a la red" : locale === "pt" ? "Voltar à rede" : "Back to network"}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col">
     <div className="mx-auto w-full max-w-[1480px] px-10">
      {/* Admin preview banner */}
      <div className="mt-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-5 py-3">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-amber-800">
              {locale === "es" ? "Vista previa del hotel" : locale === "pt" ? "Pré-visualização do hotel" : "Hotel preview"}
            </p>
            <p className="text-[12px] text-amber-600">
              {locale === "es"
                ? "Así se verá este hotel en la plataforma una vez aprobado."
                : locale === "pt"
                  ? "É assim que este hotel será exibido na plataforma após aprovação."
                  : "This is how this hotel will appear on the platform once approved."}
            </p>
          </div>
        </div>
        <Link
          href="/admin/network?tab=pending"
          className="cursor-pointer rounded-lg border border-amber-300 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-amber-700 transition-colors hover:bg-amber-50"
        >
          {locale === "es" ? "Volver" : locale === "pt" ? "Voltar" : "Back"}
        </Link>
      </div>

      {/* Gallery — click to open lightbox */}
      {galleryImages.length > 0 ? (
        <div className="flex gap-2 pt-6">
          <button type="button" onClick={() => setLightboxIdx(0)} className="relative cursor-pointer overflow-hidden rounded-l-lg bg-humana-stone" style={{ flex: "0 0 65%", height: 400 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={galleryImages[0].image_url} alt={galleryImages[0].alt_text || hotel.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </button>
          <div className="flex flex-col gap-2" style={{ flex: "0 0 calc(35% - 8px)" }}>
            <button type="button" onClick={() => setLightboxIdx(1)} className="relative cursor-pointer overflow-hidden rounded-tr-lg bg-humana-stone" style={{ height: 196 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(galleryImages[1] ?? galleryImages[0]).image_url} alt={(galleryImages[1] ?? galleryImages[0]).alt_text || `${hotel.name} 2`} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </button>
            <button type="button" onClick={() => setLightboxIdx(2)} className="relative cursor-pointer overflow-hidden rounded-br-lg bg-humana-stone" style={{ height: 196 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(galleryImages[2] ?? galleryImages[0]).image_url} alt={(galleryImages[2] ?? galleryImages[0]).alt_text || `${hotel.name} 3`} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
              {galleryImages.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                  <span className="text-[15px] font-semibold">+{galleryImages.length - 3} more</span>
                </div>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-humana-line bg-humana-stone/50" style={{ height: 280 }}>
          <div className="flex flex-col items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-[13px] text-humana-subtle">
              {locale === "es" ? "Sin imágenes" : locale === "pt" ? "Sem imagens" : "No images uploaded"}
            </span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="pt-6">
        <nav className="flex items-center gap-2 text-[12px]">
          <Link href="/admin/dashboard" className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink">Dashboard</Link>
          <span className="text-humana-subtle">&rsaquo;</span>
          <Link href="/admin/network" className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink">
            {locale === "es" ? "Red" : locale === "pt" ? "Rede" : "Network"}
          </Link>
          <span className="text-humana-subtle">&rsaquo;</span>
          <span className="font-medium text-humana-ink">{hotel.name}</span>
        </nav>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8 pt-8 pb-16">
        {/* Hotel info header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {hotel.wellness_standard?.toUpperCase() || "WELLNESS HOTEL"} &middot; {hotel.city?.toUpperCase()}, {hotel.country?.toUpperCase()}
            </span>
            {hotel.certified && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-emerald-600">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {locale === "es" ? "Certificado" : locale === "pt" ? "Certificado" : "Certified"}
              </span>
            )}
          </div>
          <h1 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-humana-ink">{hotel.name}</h1>
          {stars && <span className="text-[16px] tracking-[0.1em] text-humana-gold">{stars}</span>}
          <p className="max-w-[720px] text-[15px] leading-[24px] text-humana-muted">{hotel.description}</p>
        </div>

        {/* Hotel details grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 rounded-lg border border-humana-line bg-white px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
              {locale === "es" ? "Habitaciones" : locale === "pt" ? "Quartos" : "Rooms"}
            </span>
            <span className="text-[20px] font-light text-humana-ink">{totalRooms || "—"}</span>
            {hotel.room_types.length > 0 && (
              <span className="text-[11px] text-humana-subtle">
                {hotel.room_types.map((rt) => `${rt.name}: ${rt.total_rooms || 1}`).join(" · ")}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-humana-line bg-white px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">Check-in</span>
            <span className="text-[20px] font-light text-humana-ink">{hotel.check_in_time || "—"}</span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-humana-line bg-white px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">Check-out</span>
            <span className="text-[20px] font-light text-humana-ink">{hotel.check_out_time || "—"}</span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-humana-line bg-white px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
              {locale === "es" ? "Dirección" : locale === "pt" ? "Endereço" : "Address"}
            </span>
            <span className="text-[14px] leading-snug text-humana-ink">{hotel.address || "—"}</span>
          </div>
        </div>

        {/* Amenities */}
        {allAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((a) => (
              <span key={a.id} className="flex items-center gap-2 rounded-full border border-humana-line px-4 py-2 text-[13px] text-humana-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="11" stroke="#d4af37" strokeWidth="1.5" />
                  <polyline points="7.5 12 10.5 15 16.5 9" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {capitalizeAmenity(a.name)}
              </span>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-8 border-b border-humana-line">
          <span className="border-b-2 border-humana-ink pb-3 text-[14px] font-bold text-humana-ink">
            {locale === "es" ? "Habitaciones" : locale === "pt" ? "Quartos" : "Rooms"}
          </span>
          <span className="cursor-default pb-3 text-[14px] font-medium text-humana-muted/50">
            {locale === "es" ? "Retiros" : locale === "pt" ? "Retiros" : "Retreats"}
          </span>
          <span className="cursor-default pb-3 text-[14px] font-medium text-humana-muted/50">
            {locale === "es" ? "Amenities" : locale === "pt" ? "Amenidades" : "Amenities"}
          </span>
          <span className="cursor-default pb-3 text-[14px] font-medium text-humana-muted/50">
            Info
          </span>
        </div>

        {/* Room type cards */}
        <div className="flex flex-col gap-5">
          {hotel.room_types.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-humana-line bg-white py-16">
              <span className="text-[14px] text-humana-subtle">
                {locale === "es" ? "No hay tipos de habitación registrados" : locale === "pt" ? "Nenhum tipo de quarto registrado" : "No room types registered"}
              </span>
            </div>
          )}
          {hotel.room_types.map((rt) => {
            const primaryImg = getRoomPrimaryImage(rt);
            return (
              <div
                key={rt.id}
                className="flex overflow-hidden rounded-lg border border-humana-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative w-[320px] shrink-0 bg-humana-stone">
                  {primaryImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={primaryImg} alt={rt.name} className="h-full w-full object-cover" style={{ minHeight: 220 }} />
                  ) : (
                    <div className="flex h-full min-h-[220px] items-center justify-center text-humana-subtle">No image</div>
                  )}
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[11px] font-semibold text-humana-ink">{rt.capacity}</span>
                  </div>
                  {rt.bed_type && (
                    <div className="absolute right-4 top-4 rounded-md bg-humana-ink/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                      {rt.bed_type}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[20px] font-medium tracking-[-0.01em] text-humana-ink">{rt.name}</h3>
                      {rt.area_sqm && <span className="text-[12px] text-humana-subtle">{rt.area_sqm} m²</span>}
                      {rt.view_type && (
                        <span className="rounded-full bg-humana-stone px-2.5 py-0.5 text-[11px] font-medium capitalize text-humana-muted">
                          {rt.view_type} view
                        </span>
                      )}
                    </div>
                    <p className="max-w-[480px] text-[14px] leading-[22px] text-humana-muted">{rt.description}</p>
                    {rt.amenities_list && rt.amenities_list.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {rt.amenities_list.map((a) => (
                          <span key={a} className="rounded-full bg-humana-stone px-2.5 py-0.5 text-[11px] text-humana-muted">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">
                        {locale === "es" ? "DESDE" : locale === "pt" ? "A PARTIR DE" : "FROM"}
                      </span>
                      <span className="text-[24px] font-light tracking-[-0.01em] text-humana-ink">
                        USD ${formatPrice(rt.price_per_night_cents)}
                        <span className="text-[13px] font-normal text-humana-muted">
                          {" "}/ {locale === "es" ? "noche" : locale === "pt" ? "noite" : "night"}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRoom(rt)}
                      className="shrink-0 cursor-pointer rounded-lg bg-humana-ink px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
                    >
                      {locale === "es" ? "Ver detalles" : locale === "pt" ? "Ver detalhes" : "View details"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Owner & contact info */}
        {(owner || hotel.contact_email || hotel.website) && (
          <div className="mt-4 rounded-lg border border-humana-line bg-white p-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {locale === "es" ? "INFORMACIÓN DE CONTACTO" : locale === "pt" ? "INFORMAÇÕES DE CONTATO" : "CONTACT INFORMATION"}
            </span>
            <div className="mt-4 grid grid-cols-3 gap-6">
              {owner && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-humana-muted">
                    {locale === "es" ? "Propietario" : locale === "pt" ? "Proprietário" : "Owner"}
                  </span>
                  <span className="text-[14px] font-medium text-humana-ink">{owner.name}</span>
                  <span className="text-[13px] text-humana-muted">{owner.email}</span>
                  {owner.phone && <span className="text-[13px] text-humana-subtle">{owner.phone}</span>}
                </div>
              )}
              {hotel.contact_email && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-humana-muted">Email</span>
                  <span className="text-[14px] text-humana-ink">{hotel.contact_email}</span>
                </div>
              )}
              {hotel.website && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-humana-muted">Website</span>
                  <span className="text-[14px] text-humana-gold">{hotel.website}</span>
                </div>
              )}
              {hotel.phone && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-humana-muted">
                    {locale === "es" ? "Teléfono" : locale === "pt" ? "Telefone" : "Phone"}
                  </span>
                  <span className="text-[14px] text-humana-ink">{hotel.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

     </div>
      {/* Room detail modal */}
      {selectedRoom && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-8" onClick={() => setSelectedRoom(null)}>
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] animate-fade-in" />
          <div className="relative flex w-full max-w-[1040px] overflow-hidden rounded-lg bg-white shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button type="button" onClick={() => setSelectedRoom(null)} className="absolute right-5 top-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-humana-line bg-white shadow-sm transition-all hover:border-humana-ink hover:shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            {/* Image side */}
            <div className="relative w-[520px] shrink-0 bg-humana-stone">
              {getRoomPrimaryImage(selectedRoom) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getRoomPrimaryImage(selectedRoom)} alt={selectedRoom.name} className="h-full w-full object-cover" style={{ minHeight: 500 }} />
              ) : (
                <div className="flex h-full min-h-[500px] items-center justify-center text-humana-subtle">No image</div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Info side */}
            <div className="flex flex-1 flex-col justify-between p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">{hotel.name}</span>
                  <h2 className="text-[24px] font-light tracking-[-0.02em] text-humana-ink">{selectedRoom.name}</h2>
                </div>

                <div className="h-px bg-humana-line" />

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                      {locale === "es" ? "Capacidad" : locale === "pt" ? "Capacidade" : "Capacity"}
                    </span>
                    <span className="text-[14px] text-humana-muted">{selectedRoom.capacity} {locale === "es" ? "personas" : locale === "pt" ? "pessoas" : "guests"}</span>
                  </div>

                  {selectedRoom.area_sqm && (
                    <div className="flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                      </svg>
                      <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                        {locale === "es" ? "Área" : locale === "pt" ? "Área" : "Area"}
                      </span>
                      <span className="text-[14px] text-humana-muted">{selectedRoom.area_sqm} m²</span>
                    </div>
                  )}

                  {selectedRoom.bed_type && (
                    <div className="flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" /><path d="M21 10H3" /><path d="M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
                      </svg>
                      <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-humana-ink">
                        {locale === "es" ? "Cama" : locale === "pt" ? "Cama" : "Bed"}
                      </span>
                      <span className="text-[14px] capitalize text-humana-muted">{selectedRoom.bed_type}</span>
                    </div>
                  )}

                  {selectedRoom.description && (
                    <div className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e6a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      <p className="text-[14px] leading-[22px] text-humana-muted">{selectedRoom.description}</p>
                    </div>
                  )}
                </div>

                <div className="h-px bg-humana-line" />

                {selectedRoom.amenities_list && selectedRoom.amenities_list.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-humana-ink">Amenities</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.amenities_list.map((a) => (
                        <span key={a} className="flex items-center gap-2 rounded-full border border-humana-line px-4 py-1.5 text-[13px] text-humana-ink">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <circle cx="12" cy="12" r="11" stroke="#d4af37" strokeWidth="1.5" />
                            <polyline points="7.5 12 10.5 15 16.5 9" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer: price */}
              <div className="flex items-center justify-between gap-4 pt-8">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">
                    {locale === "es" ? "DESDE" : locale === "pt" ? "A PARTIR DE" : "FROM"}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="whitespace-nowrap text-[26px] font-light tracking-[-0.02em] text-humana-gold">
                      USD ${formatPrice(selectedRoom.price_per_night_cents)}
                    </span>
                    <span className="whitespace-nowrap text-[13px] text-humana-muted">/ {locale === "es" ? "noche" : locale === "pt" ? "noite" : "night"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Gallery lightbox */}
      {lightboxIdx !== null && hotel && galleryImages.length > 0 && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] animate-fade-in" />

          <button type="button" onClick={() => setLightboxIdx(null)} className="absolute right-6 top-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <span className="absolute left-6 top-6 z-10 text-[13px] font-medium text-white/70">
            {lightboxIdx + 1} / {galleryImages.length}
          </span>

          <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + galleryImages.length) % galleryImages.length); }} className="absolute left-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % galleryImages.length); }} className="absolute right-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>

          <div className="relative z-10 h-[75vh] w-[75vw] max-w-[1200px] animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImages[lightboxIdx].image_url}
              alt={galleryImages[lightboxIdx].alt_text || `${hotel.name} ${lightboxIdx + 1}`}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2" onClick={(e) => e.stopPropagation()}>
            {galleryImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIdx(i)}
                className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded transition-all ${
                  i === lightboxIdx ? "ring-2 ring-humana-gold ring-offset-2 ring-offset-black" : "opacity-50 hover:opacity-80"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
