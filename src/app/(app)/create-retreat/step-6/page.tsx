"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWizard } from "@/contexts/WizardContext";
import { hotels } from "@/data/hotels";
import { inventoryBlocks } from "@/data/inventory";
import { StepIndicator } from "@/components/StepIndicator";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function fmtDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
function fmtRange(start: string, end: string) {
  const e = new Date(end + "T12:00:00");
  return `${fmtDate(start)} – ${fmtDate(end)} ${e.getFullYear()}`;
}

/* ─── Sidebar: retreat card styled like dashboard ─── */
function RetreatPreviewCard({ onPublish }: { onPublish: () => void }) {
  const { state } = useWizard();
  const hotel = hotels.find((h) => h.id === state.hotelId);
  const minPrice = state.pricing.length > 0 ? Math.min(...state.pricing.filter((p) => p.retailPrice > 0).map((p) => p.retailPrice)) : 0;
  const typeLabel = state.type === "retreat" ? "Retiro" : state.type === "masterclass" ? "Masterclass" : "Corporativo";
  const coverImg = state.gallery[0] ?? hotel?.image ?? "/images/retreat-ibiza.jpg";
  const location = hotel?.location ?? "";

  return (
    <div className="w-[340px] shrink-0">
      <div className="sticky top-[108px] flex flex-col gap-4">
        {/* Retreat card — same style as dashboard */}
        <article className="flex flex-col overflow-hidden border border-humana-line bg-white shadow-sm">
          {/* Cover image */}
          <div className="relative h-56 w-full bg-humana-stone">
            <Image src={coverImg} alt="" fill className="object-cover" />
            <div className="absolute left-4 top-4 bg-white px-3 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-ink">
                {typeLabel} · {state.nights} noches
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-7">
            {/* Location + dates */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-humana-muted">
                  {location}
                </span>
              </div>
              <span className="text-[12px] font-medium text-[#4A463E]">
                {state.startDate && state.endDate ? fmtRange(state.startDate, state.endDate) : "---"}
              </span>
            </div>

            {/* Title + hotel */}
            <h3 className="text-[20px] font-normal leading-[26px] tracking-[-0.01em] text-humana-ink">
              {state.name || "Sin nombre"}
              <br />
              <span className="text-humana-muted">{hotel?.name ?? ""}</span>
            </h3>

            {/* Description */}
            <p className="text-[14px] leading-[20px] text-humana-muted">
              {state.description || "Sin descripción"}
            </p>

            <div className="h-px bg-humana-line" />

            {/* Price + commission */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">Desde</span>
                <span className="text-[20px] font-light tracking-[-0.01em] text-humana-ink">
                  {minPrice > 0 ? `$${minPrice.toLocaleString("en-US")}` : "---"}
                  <span className="text-[13px] font-normal text-humana-subtle"> /huésped</span>
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-gold">16% comisión</span>
              </div>
            </div>
          </div>
        </article>

        {/* Progress */}
        <div className="border border-humana-line bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-humana-muted">Progreso</span>
            <span className="text-[13px] font-semibold text-humana-gold">100%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-humana-stone">
            <div className="h-full w-full rounded-full bg-humana-gold" />
          </div>
          <p className="mt-3 text-[13px] text-humana-muted">Listo para publicar</p>
        </div>

        {/* Nav buttons */}
        <div className="flex">
          <Link
            href="/create-retreat/step-5"
            className="flex flex-1 items-center justify-center border border-humana-line bg-white py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:border-humana-ink"
          >
            Atrás
          </Link>
          <button
            type="button"
            onClick={onPublish}
            className="flex flex-[1.5] items-center justify-center gap-3 bg-humana-gold py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            Publicar retiro
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WizardStep6() {
  const { t } = useLocale();
  const { state, reset } = useWizard();
  const hotel = hotels.find((h) => h.id === state.hotelId);
  const [published, setPublished] = useState(false);

  const hotelInv = inventoryBlocks.filter((b) => b.hotelId === state.hotelId && b.availableRooms > 0);

  if (published) {
    const typeLabel = state.type === "retreat" ? "Retiro" : state.type === "masterclass" ? "Masterclass" : "Corporativo";
    const minPrice = state.pricing.length > 0 ? Math.min(...state.pricing.filter((p) => p.retailPrice > 0).map((p) => p.retailPrice)) : 0;

    return (
      <div className="flex flex-col items-center gap-10 px-16 py-20">
        {/* Isotipo */}
        <div className="animate-checkmark">
          <Image src="/brand/isotipo.png" alt="HUMANA" width={80} height={80} className="opacity-90" />
        </div>

        {/* Title */}
        <div className="animate-fade-in-up flex flex-col items-center gap-3 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            Retiro publicado
          </span>
          <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
            {state.name || "Retiro"} publicado!
          </h1>
          <p className="text-[15px] leading-[22px] text-humana-muted">
            Tu retiro ya está disponible en la plataforma HUMANA.
          </p>
        </div>

        {/* Details card */}
        <div className="animate-fade-in-up-delay-1 w-full max-w-[600px] border border-humana-line bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-humana-line pb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              Referencia
            </span>
            <span className="text-[18px] font-semibold text-humana-ink">
              RET-2026-{String(Math.floor(Math.random() * 9000) + 1000)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">Retiro</span>
              <span className="text-[15px] text-humana-ink">{state.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">Hotel</span>
              <span className="text-[15px] text-humana-ink">{hotel?.name ?? "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">Tipo</span>
              <span className="text-[15px] text-humana-ink">{typeLabel} · {state.nights} noches</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">Fechas</span>
              <span className="text-[15px] text-humana-ink">
                {state.startDate && state.endDate ? fmtRange(state.startDate, state.endDate) : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">Capacidad</span>
              <span className="text-[15px] text-humana-ink">{state.capacity} personas</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-humana-subtle">Precio desde</span>
              <span className="text-[15px] text-humana-ink">${minPrice.toLocaleString("en-US")} USD</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded bg-humana-stone px-4 py-3">
            <span className="text-[14px] text-humana-muted">Habitaciones configuradas</span>
            <span className="text-[14px] font-semibold text-humana-gold">{state.pricing.length} tipos</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="animate-fade-in-up-delay-2 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 border border-humana-line px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-ink transition-all duration-150 hover:border-humana-ink active:scale-[0.98]"
          >
            Ver retiro
          </Link>
          <Link
            href="/dashboard"
            onClick={reset}
            className="group/cta flex items-center gap-3 bg-humana-ink px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
          >
            Volver al dashboard
            <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
              <path d="M1 5h14M10 1l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-0 px-16 py-10">
      <div className="flex gap-12">
        {/* LEFT: main content */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              PASO 6 DE 6
            </span>
            <h2 className="text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
              Revision y publicacion
            </h2>
            <p className="text-[15px] leading-[22px] text-humana-muted">
              Revisa todos los detalles antes de publicar tu retiro.
            </p>
          </div>

          <StepIndicator
            steps={t.createRetreat?.steps ?? ["Hotel", "Info básica", "Programa", "Precios", "Galería", "Revisión"]}
            currentStep={5}
            className="flex items-center gap-0 py-6"
          />

          {/* Review sections — ordered by wizard steps */}
          <div className="flex flex-col gap-4">

            {/* Step 1: Hotel */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  HOTEL
                </span>
                <Link
                  href="/create-retreat/step-1"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              {hotel && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-humana-line">
                    <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-medium text-humana-ink">{hotel.name}</span>
                    <span className="text-[13px] text-humana-muted">{hotel.location}</span>
                  </div>
                </div>
              )}
              {!hotel && (
                <span className="mt-4 block text-[14px] text-humana-muted">Sin hotel seleccionado</span>
              )}
            </div>

            {/* Step 2: Informacion basica */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  INFORMACION BASICA
                </span>
                <Link
                  href="/create-retreat/step-2"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Nombre</span>
                  <span className="text-[14px] text-humana-ink">{state.name || "---"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Tipo</span>
                  <span className="text-[14px] text-humana-ink">
                    {state.type === "retreat" ? "Retiro" : state.type === "masterclass" ? "Masterclass" : "Corporativo"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Fechas</span>
                  <span className="text-[14px] text-humana-ink">
                    {state.startDate && state.endDate ? fmtRange(state.startDate, state.endDate) : "---"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Duracion</span>
                  <span className="text-[14px] text-humana-ink">{state.nights} noches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Capacidad</span>
                  <span className="text-[14px] text-humana-ink">{state.capacity} personas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Idioma</span>
                  <span className="text-[14px] text-humana-ink">{state.language}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Programa */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  PROGRAMA
                </span>
                <Link
                  href="/create-retreat/step-3"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                {state.program.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-[14px] text-humana-ink">
                      Dia {day.day}{day.title ? ` — ${day.title}` : ""}
                    </span>
                    <span className="text-[14px] text-humana-muted">
                      {day.activities.length} actividades
                    </span>
                  </div>
                ))}
                {state.program.length === 0 && (
                  <span className="text-[14px] text-humana-muted">Sin programa definido</span>
                )}
              </div>
            </div>

            {/* Step 3: Facilitadores */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  FACILITADORES
                </span>
                <Link
                  href="/create-retreat/step-3"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {state.facilitators.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-humana-stone text-[11px] font-semibold text-humana-muted">
                      {f.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-[14px] font-medium text-humana-ink">{f.name}</span>
                      <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${i === 0 ? "text-humana-gold" : "text-humana-subtle"}`}>
                        {i === 0 ? "PRINCIPAL" : "ASISTENTE"}
                      </span>
                    </div>
                    <span className="text-[13px] text-humana-muted">{f.bio.split(".")[0]}</span>
                  </div>
                ))}
                {state.facilitators.length === 0 && (
                  <span className="text-[14px] text-humana-muted">Sin facilitadores definidos</span>
                )}
              </div>
            </div>

            {/* Step 3: Qué incluye */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  QUÉ INCLUYE
                </span>
                <Link
                  href="/create-retreat/step-3"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {state.included.map((item, i) => (
                  <span key={i} className="border border-humana-line px-4 py-1.5 text-[14px] text-humana-ink">
                    {item}
                  </span>
                ))}
                {state.included.length === 0 && (
                  <span className="text-[14px] text-humana-muted">Sin elementos definidos</span>
                )}
              </div>
            </div>

            {/* Step 4: Precios y habitaciones */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  PRECIOS Y HABITACIONES
                </span>
                <Link
                  href="/create-retreat/step-4"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                {state.pricing.map((p) => {
                  const rt = hotel?.roomTypes.find((r) => r.id === p.roomTypeId);
                  const inv = hotelInv.find((b) => b.roomTypeId === p.roomTypeId);
                  if (!rt) return null;
                  return (
                    <div key={p.roomTypeId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-10 shrink-0 overflow-hidden rounded">
                          <Image src={rt.image} alt={rt.name} fill className="object-cover" />
                        </div>
                        <span className="text-[14px] text-humana-ink">{rt.name}</span>
                        {inv && (
                          <span className="text-[12px] text-humana-subtle">{inv.availableRooms} habs</span>
                        )}
                      </div>
                      <span className="text-[14px] font-medium text-humana-ink">${p.retailPrice.toLocaleString("en-US")} /huésped</span>
                    </div>
                  );
                })}
                {state.pricing.length === 0 && (
                  <span className="text-[14px] text-humana-muted">Sin precios definidos</span>
                )}
              </div>
            </div>

            {/* Step 5: Galeria */}
            <div className="border border-humana-line bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                  GALERIA
                </span>
                <Link
                  href="/create-retreat/step-5"
                  className="text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                >
                  Editar
                </Link>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {state.gallery.slice(0, 5).map((img, i) => (
                  <div key={i} className={`relative h-16 w-20 overflow-hidden border border-humana-line ${i === 0 ? "ring-2 ring-humana-gold" : ""}`}>
                    <Image src={img} alt="" fill className="object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-humana-gold/90 py-0.5 text-center text-[8px] font-semibold uppercase tracking-[0.1em] text-white">
                        Portada
                      </div>
                    )}
                  </div>
                ))}
                {state.gallery.length > 5 && (
                  <span className="text-[13px] text-humana-muted">+{state.gallery.length - 5} más</span>
                )}
                {state.gallery.length === 0 && (
                  <span className="text-[14px] text-humana-muted">Sin imagenes</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Retreat card preview (same UI as dashboard) */}
        <RetreatPreviewCard onPublish={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setPublished(true); }} />
      </div>
    </div>
  );
}
