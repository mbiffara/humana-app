"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";
import { clients } from "@/data/clients";
import { countryIdToSlug } from "@/data/countries";

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

export default function AssignClientPage() {
  const { t } = useLocale();
  const { state, set } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const countrySlug = retreat ? (countryIdToSlug[retreat.country] ?? retreat.country) : "mexico";
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);
  const room = hotel?.roomTypes.find((r) => r.id === state.roomTypeId);

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(state.clientId);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassport, setNewPassport] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClient = clients.find((c) => c.id === selectedId);

  const retreatNights = retreat?.nights ?? 7;
  const preNights = state.preNights;
  const postNights = state.postNights;
  const totalNights = retreatNights + preNights + postNights;
  const pricePerNight = room?.pricePerNight ?? 185;
  const total = totalNights * pricePerNight;

  const retreatStart = state.dates?.start ?? retreat?.startDate ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? retreat?.endDate ?? "2026-06-01";

  const computedCheckIn = useMemo(() => {
    return preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart;
  }, [retreatStart, preNights]);

  const computedCheckOut = useMemo(() => {
    return postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd;
  }, [retreatEnd, postNights]);

  const nightsBreakdown = [
    preNights > 0 ? `${preNights} pre` : null,
    `${retreatNights} retiro`,
    postNights > 0 ? `${postNights} post` : null,
  ].filter(Boolean).join(" + ");

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: hotel?.name ?? "Hotel Itzamna", href: retreat ? `/select-country/${countrySlug}/retreats/${retreat.slug}` : "/select-country" },
          { label: "Alojamiento", href: "/select-accommodation" },
          { label: "Asignar cliente" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          PASO 4 DE 5
        </span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">
          Asignar cliente
        </h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">
          Busca un cliente existente o crea uno nuevo para esta reserva.
        </p>
      </div>

      <div className="flex gap-12">
        {/* Client area */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Search bar */}
          <div className="flex items-center gap-4 border border-humana-line px-5 py-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email o pasaporte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[15px] text-humana-ink outline-none placeholder:text-humana-subtle"
            />
          </div>

          {/* Client cards */}
          <div className="flex flex-col gap-4">
            {filtered.map((client) => {
              const isSelected = selectedId === client.id;
              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedId(client.id)}
                  className={`flex items-start gap-5 border p-6 text-left transition-all duration-200 ${
                    isSelected ? "border-humana-gold" : "border-humana-line hover:border-humana-ink"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-humana-stone">
                    <span className="text-[14px] font-semibold text-humana-ink">{client.initials}</span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-medium text-humana-ink">{client.name}</span>
                      {client.id === "c1" && (
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-humana-gold">
                          CLIENTE VIP
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4 text-[13px] text-humana-muted">
                        <span>{client.email}</span>
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[13px] text-humana-muted">
                        <span>Pasaporte: {client.nationality.slice(0, 3).toUpperCase()}****</span>
                        <span>3 reservas anteriores</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <span className="flex items-center gap-1.5 border border-humana-gold px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-humana-gold">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      SELECCIONADA
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider with text */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-humana-line" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">O CREAR NUEVO</span>
            <div className="h-px flex-1 bg-humana-line" />
          </div>

          {/* New client form */}
          <div className="flex flex-col gap-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              DATOS DEL NUEVO CLIENTE
            </span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">NOMBRE</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nombre completo"
                  className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">EMAIL</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@ejemplo.com"
                  className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">TELEFONO</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">PASAPORTE</label>
                <input
                  type="text"
                  value={newPassport}
                  onChange={(e) => setNewPassport(e.target.value)}
                  placeholder="ABC1234567"
                  className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[340px] shrink-0">
          <div className="sticky top-8 flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              RESUMEN DE RESERVA
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-humana-ink">
                {hotel?.name ?? "Hotel Itzamna"} · {room?.name ?? "Suite Cenote"}
              </span>
              <span className="text-[13px] text-humana-muted">{hotel?.location ?? "Tulum, Mexico"}</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Check-in</span>
                <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Check-out</span>
                <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-humana-muted">Noches totales</span>
                <span className="text-[14px] font-medium text-humana-ink">
                  {totalNights} ({nightsBreakdown})
                </span>
              </div>
            </div>

            <div className="h-px bg-humana-line" />

            {/* Client assigned */}
            {selectedClient && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
                  CLIENTE ASIGNADO
                </span>
                <span className="text-[15px] font-medium text-humana-ink">{selectedClient.name}</span>
                <span className="text-[13px] text-humana-muted">{selectedClient.email}</span>
              </div>
            )}

            {!selectedClient && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">
                  CLIENTE ASIGNADO
                </span>
                <span className="text-[14px] text-humana-subtle">Ningun cliente seleccionado</span>
              </div>
            )}

            <div className="h-px bg-humana-line" />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-humana-ink">Total</span>
              <span className="text-[18px] font-semibold text-humana-ink">${total.toLocaleString()} USD</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => {
                if (selectedId) set({ clientId: selectedId });
              }}
              className={`group/cta flex items-center justify-center gap-3 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] transition-all duration-150 active:scale-[0.98] ${
                selectedId
                  ? "bg-humana-ink text-white hover:bg-black"
                  : "pointer-events-none bg-humana-line text-humana-subtle"
              }`}
            >
              IR A CHECKOUT
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/cta:translate-x-0.5">
                <path d="M1 5h14M10 1l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
