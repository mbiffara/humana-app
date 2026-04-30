"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { clients } from "@/data/clients";
import { hotels } from "@/data/hotels";

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDate();
  const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function ConfirmationPage() {
  const { t } = useLocale();
  const { state, reset } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const client = clients.find((c) => c.id === state.clientId);
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);
  const room = hotel?.roomTypes.find((r) => r.id === state.roomTypeId);

  const retreatNights = retreat?.nights ?? 7;
  const pricePerNight = room?.pricePerNight ?? 185;
  const preNights = state.preNights;
  const postNights = state.postNights;
  const total = (retreatNights + preNights + postNights) * pricePerNight;
  const commission = Math.round(total * 0.16);
  const reservationId = `HUM-2025-0847`;

  const retreatStart = state.dates?.start ?? retreat?.startDate ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? retreat?.endDate ?? "2026-06-01";
  const computedCheckIn = preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart;
  const computedCheckOut = postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd;

  return (
    <div className="flex flex-col items-center gap-10 px-16 py-20">
      {/* Gold HUMANA logo */}
      <div className="animate-checkmark">
        <Image
          src="/brand/isotipo.png"
          alt="HUMANA"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

      <div className="animate-fade-in-up flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          RESERVA CONFIRMADA
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Reserva creada exitosamente
        </h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">
          Se ha enviado un email de confirmacion a {client?.email ?? "maria.lopez@email.com"}
        </p>
      </div>

      {/* Detail card */}
      <div className="animate-fade-in-up-delay-1 flex w-full max-w-[640px] flex-col gap-6 border border-humana-line p-10">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            REFERENCIA
          </span>
          <span className="text-[16px] font-bold tracking-[0.05em] text-humana-ink">{reservationId}</span>
        </div>

        <div className="h-px bg-humana-line" />

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">HOTEL</span>
            <span className="text-[14px] font-medium text-humana-ink">
              {hotel?.name ?? "Hotel Itzamna"} · {room?.name ?? "Suite Selva"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">CHECK-IN</span>
            <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">UBICACION</span>
            <span className="text-[14px] font-medium text-humana-ink">{hotel?.location ?? "Tulum, Mexico"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">CHECK-OUT</span>
            <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">CLIENTE</span>
            <span className="text-[14px] font-medium text-humana-ink">{client?.name ?? "Maria Lopez Fernandez"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-subtle">TOTAL PAGADO</span>
            <span className="text-[14px] font-medium text-humana-ink">${total.toLocaleString()}.00 USD</span>
          </div>
        </div>

        <div className="h-px bg-humana-line" />

        {/* Commission highlight */}
        <div className="flex items-center justify-between bg-humana-stone p-4">
          <span className="text-[13px] font-medium text-humana-ink">
            Comision ganada por esta reserva
          </span>
          <span className="text-[18px] font-medium text-humana-gold">${commission.toLocaleString()}.00 USD</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="animate-fade-in-up-delay-2 flex items-center gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-humana-line px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-all duration-150 hover:border-humana-ink hover:text-humana-ink active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          DESCARGAR PDF
        </button>
        <Link
          href="/dashboard"
          onClick={reset}
          className="group/cta flex items-center justify-center gap-3 bg-humana-ink px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98]"
        >
          VER MIS RESERVAS
          <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
            <path d="M1 5h14M10 1l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
