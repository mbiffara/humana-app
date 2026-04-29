"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";
import { countryIdToSlug } from "@/data/countries";
import { clients } from "@/data/clients";

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

export default function CheckoutPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { state } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const countrySlug = retreat ? (countryIdToSlug[retreat.country] ?? retreat.country) : "mexico";
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);
  const client = clients.find((c) => c.id === state.clientId);
  const room = hotel?.roomTypes.find((r) => r.id === state.roomTypeId);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);

  const retreatNights = retreat?.nights ?? 7;
  const pricePerNight = room?.pricePerNight ?? 185;
  const preNights = state.preNights;
  const postNights = state.postNights;

  const retreatCost = retreatNights * pricePerNight;
  const preCost = preNights * pricePerNight;
  const postCost = postNights * pricePerNight;
  const total = retreatCost + preCost + postCost;

  const commissionAgency = Math.round(total * 0.16);
  const commissionOffice = Math.round(total * 0.02);
  const netCreator = total - commissionAgency - commissionOffice;

  const retreatStart = state.dates?.start ?? retreat?.startDate ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? retreat?.endDate ?? "2026-06-01";

  const computedCheckIn = useMemo(() => {
    return preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart;
  }, [retreatStart, preNights]);

  const computedCheckOut = useMemo(() => {
    return postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd;
  }, [retreatEnd, postNights]);

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  function handleSubmit() {
    setProcessing(true);
    setTimeout(() => {
      router.push("/confirmation");
    }, 1500);
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: hotel?.name ?? "Hotel Itzamna", href: retreat ? `/select-country/${countrySlug}/retreats/${retreat.slug}` : "/select-country" },
          { label: "Alojamiento", href: "/select-accommodation" },
          { label: "Checkout" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          PASO 5 DE 5
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Checkout y pago
        </h1>
      </div>

      <div className="flex gap-12">
        {/* Left side - Detail cards */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Reservation detail card */}
          <div className="flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              DETALLE DE LA RESERVA
            </span>

            {/* Hotel info with image */}
            <div className="flex items-center gap-4">
              <div className="relative h-[60px] w-[80px] shrink-0 overflow-hidden bg-humana-stone">
                <Image src={hotel?.image ?? "/images/retreat-tulum.jpg"} alt={hotel?.name ?? ""} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-humana-ink">{hotel?.name ?? "Hotel Itzamna"}</span>
                <span className="text-[13px] text-humana-muted">{room?.name ?? "Suite Cenote"} · {hotel?.location ?? "Tulum, Mexico"}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Detail rows */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Cliente</span>
                <span className="text-[14px] font-medium text-humana-ink">{client?.name ?? "\u2014"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Check-in</span>
                <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Check-out</span>
                <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)}</span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Price rows */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Retiro — {retreatNights} noches x ${pricePerNight}</span>
                <span className="text-[14px] font-medium text-humana-ink">${retreatCost.toLocaleString()}.00</span>
              </div>
              {preNights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Pre-retiro — {preNights} noches x ${pricePerNight}</span>
                  <span className="text-[14px] font-medium text-humana-ink">${preCost.toLocaleString()}.00</span>
                </div>
              )}
              {postNights > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-humana-muted">Post-retiro — {postNights} noches x ${pricePerNight}</span>
                  <span className="text-[14px] font-medium text-humana-ink">${postCost.toLocaleString()}.00</span>
                </div>
              )}
            </div>

            <div className="h-px bg-humana-line" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-humana-ink">Total a cobrar</span>
              <span className="text-[18px] font-semibold text-humana-ink">${total.toLocaleString()}.00 USD</span>
            </div>
          </div>

          {/* Commission card */}
          <div className="flex flex-col gap-5 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              DESGLOSE DE COMISIONES
            </span>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Comision agencia (16%)</span>
                <span className="text-[15px] font-medium text-humana-gold">${commissionAgency.toLocaleString()}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Comision oficina (2%)</span>
                <span className="text-[14px] font-medium text-humana-ink">${commissionOffice.toLocaleString()}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Neto al creador</span>
                <span className="text-[14px] font-medium text-humana-ink">${netCreator.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Payment form */}
        <div className="w-[380px] shrink-0">
          <div className="sticky top-8 flex flex-col gap-6 border border-humana-line p-8">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                PAGO SEGURO
              </span>
            </div>

            {/* Card number */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">NUMERO DE TARJETA</label>
              <div className="flex items-center gap-3 border-b border-humana-line py-3">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  className="flex-1 bg-transparent text-[16px] tracking-[0.08em] text-humana-ink outline-none placeholder:text-humana-subtle"
                />
                <span className="rounded bg-[#1a1f71] px-2 py-0.5 text-[11px] font-bold text-white">VISA</span>
              </div>
            </div>

            {/* Expiry + CVC row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">VENCIMIENTO</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="12 / 26"
                  className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">CVC</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="&bull;&bull;&bull;"
                  className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
            </div>

            {/* Cardholder */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">TITULAR DE LA TARJETA</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="NOMBRE APELLIDO"
                className="border-b border-humana-line bg-transparent py-3 text-[15px] uppercase text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
              />
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[12px] text-humana-subtle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Procesado de forma segura por Stripe</span>
            </div>

            {/* Pay button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={processing}
              className="flex items-center justify-center gap-2 bg-humana-ink py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98] disabled:opacity-60"
            >
              {processing ? (
                t.checkout.processing
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  PAGAR ${total.toLocaleString()}.00 USD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
