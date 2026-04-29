"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useBooking } from "@/contexts/BookingContext";
import { retreats } from "@/data/retreats";
import { hotels } from "@/data/hotels";
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

export default function AssignClientPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const { t } = useLocale();
  const { state, set } = useBooking();
  const retreat = retreats.find((r) => r.slug === state.retreatSlug);
  const hotel = hotels.find((h) => h.id === retreat?.hotelId);
  const room = hotel?.roomTypes.find((r) => r.id === state.roomTypeId);

  /* ── mode: "client" or "inventory" ── */
  const [mode, setMode] = useState<"client" | "inventory">(state.inventoryMode ? "inventory" : "client");

  /* ── client selection ── */
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(state.clientId);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassport, setNewPassport] = useState("");
  const [newClientCreated, setNewClientCreated] = useState(false);
  const [inventoryConfirmed, setInventoryConfirmed] = useState(false);

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  const selectedClient = clients.find((c) => c.id === selectedId);

  /* ── pricing ── */
  const retreatNights = retreat?.nights ?? 7;
  const preNights = state.preNights;
  const postNights = state.postNights;
  const totalNights = retreatNights + preNights + postNights;
  const pricePerNight = room?.pricePerNight ?? 185;
  const total = totalNights * pricePerNight;

  const retreatStart = state.dates?.start ?? retreat?.startDate ?? "2026-05-28";
  const retreatEnd = state.dates?.end ?? retreat?.endDate ?? "2026-06-01";
  const computedCheckIn = useMemo(() => preNights > 0 ? addDays(retreatStart, -preNights) : retreatStart, [retreatStart, preNights]);
  const computedCheckOut = useMemo(() => postNights > 0 ? addDays(retreatEnd, postNights) : retreatEnd, [retreatEnd, postNights]);
  const nightsBreakdown = [preNights > 0 ? `${preNights} pre` : null, `${retreatNights} retiro`, postNights > 0 ? `${postNights} post` : null].filter(Boolean).join(" + ");

  /* ── can continue? ── */
  const canContinueClient = !!(selectedId || (newClientCreated && newName.trim()));
  const canContinue = (mode === "inventory" && inventoryConfirmed) || canContinueClient;

  function handleCreateClient() {
    setNewClientCreated(true);
    setSelectedId(null);
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-10 px-20 py-14">
      <Breadcrumb
        items={[
          { label: t.breadcrumb.home, href: "/dashboard" },
          { label: hotel?.name ?? "Hotel", href: retreat ? `/select-country/${country}/retreats/${retreat.slug}` : `/select-country/${country}` },
          { label: "Alojamiento", href: `/select-country/${country}/step-2-select-accommodation` },
          { label: "Asignar cliente" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">PASO 3 DE 5</span>
        <h1 className="text-[36px] font-light leading-[44px] tracking-[-0.02em] text-humana-ink">Asignar cliente</h1>
        <p className="text-[15px] leading-[22px] text-humana-muted">Asigna un cliente a esta reserva o guarda las plazas en tu inventario para reventa.</p>
      </div>

      {/* ── Tab toggle ── */}
      <div className="flex gap-0 border-b border-humana-line">
        <button type="button" onClick={() => setMode("client")}
          className={`flex items-center gap-2.5 border-b-2 px-6 pb-4 pt-1 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${mode === "client" ? "border-humana-gold text-humana-ink" : "border-transparent text-humana-subtle hover:text-humana-ink"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Asignar cliente
        </button>
        <button type="button" onClick={() => setMode("inventory")}
          className={`flex items-center gap-2.5 border-b-2 px-6 pb-4 pt-1 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${mode === "inventory" ? "border-humana-gold text-humana-ink" : "border-transparent text-humana-subtle hover:text-humana-ink"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Guardar en inventario
        </button>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-1 flex-col gap-8">
          {mode === "client" ? (
            <>
              {/* ── Search ── */}
              <div className="flex items-center gap-4 border border-humana-line px-5 py-3.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input type="text" placeholder="Buscar por nombre, email o pasaporte..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-[15px] text-humana-ink outline-none placeholder:text-humana-subtle" />
              </div>

              {/* ── Client list ── */}
              <div className="flex flex-col gap-4">
                {filtered.map((client) => {
                  const isSelected = selectedId === client.id && !newClientCreated;
                  return (
                    <button key={client.id} type="button" onClick={() => { setSelectedId(client.id); setNewClientCreated(false); }}
                      className={`flex cursor-pointer items-start gap-5 border p-6 text-left transition-all duration-200 ${isSelected ? "border-humana-gold" : "border-humana-line hover:border-humana-ink"}`}>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-humana-stone"><span className="text-[14px] font-semibold text-humana-ink">{client.initials}</span></div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[16px] font-medium text-humana-ink">{client.name}</span>
                          {client.id === "c1" && <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-humana-gold">CLIENTE VIP</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-4 text-[13px] text-humana-muted"><span>{client.email}</span><span>{client.phone}</span></div>
                          <div className="flex items-center gap-4 text-[13px] text-humana-muted"><span>Pasaporte: {client.nationality.slice(0, 3).toUpperCase()}****</span><span>3 reservas anteriores</span></div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-humana-gold">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d4af37" strokeWidth="2" /><path d="M8 12l3 3 5-5" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          SELECCIONADO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── New client section ── */}
              {!showNewForm ? (
                <button type="button" onClick={() => setShowNewForm(true)}
                  className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-humana-line py-5 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-all duration-200 hover:border-humana-gold hover:text-humana-gold">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Nuevo cliente
                </button>
              ) : (
                <div className={`flex flex-col gap-6 border p-8 transition-all duration-200 ${newClientCreated ? "border-humana-gold" : "border-humana-line"} animate-fade-in-up`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">NUEVO CLIENTE</span>
                    {newClientCreated && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-humana-gold">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d4af37" strokeWidth="2" /><path d="M8 12l3 3 5-5" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        CREADO Y ASIGNADO
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-2"><label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">NOMBRE COMPLETO</label><input type="text" value={newName} onChange={(e) => { setNewName(e.target.value); setNewClientCreated(false); }} placeholder="Nombre y apellido" className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold" /></div>
                    <div className="flex flex-col gap-2"><label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">EMAIL</label><input type="email" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setNewClientCreated(false); }} placeholder="email@ejemplo.com" className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold" /></div>
                    <div className="flex flex-col gap-2"><label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">TELEFONO</label><input type="tel" value={newPhone} onChange={(e) => { setNewPhone(e.target.value); setNewClientCreated(false); }} placeholder="+34 612 345 678" className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold" /></div>
                    <div className="flex flex-col gap-2"><label className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">PASAPORTE</label><input type="text" value={newPassport} onChange={(e) => { setNewPassport(e.target.value); setNewClientCreated(false); }} placeholder="ABC1234567" className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold" /></div>
                  </div>
                  {!newClientCreated && (
                    <button type="button" onClick={handleCreateClient} disabled={!newName.trim() || !newEmail.trim()}
                      className="flex items-center justify-center gap-2 self-start bg-humana-ink px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-150 hover:bg-black active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-humana-ink">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      Crear y asignar
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* ── Inventory mode ── */
            <div className="flex flex-col gap-8 animate-fade-in-up">
              <div className="flex flex-col gap-6 border border-humana-line bg-humana-stone/40 p-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-humana-gold/10">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[18px] font-medium text-humana-ink">Compra de plazas para inventario</h3>
                    <p className="text-[14px] leading-[22px] text-humana-muted">Reserva estas plazas sin asignar un cliente. Podras asignarlas mas adelante desde tu inventario.</p>
                  </div>
                </div>
                <div className="h-px bg-humana-line" />
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" /></svg>
                    <span className="text-[14px] leading-[22px] text-humana-ink">Las plazas quedan bloqueadas a tu nombre y puedes revenderlas a un cliente en el futuro.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" /></svg>
                    <span className="text-[14px] leading-[22px] text-humana-ink">Aparecera en tu seccion de Inventario como plaza disponible para asignacion.</span>
                  </div>
                </div>
              </div>

              {/* Inventory confirmation */}
              <button type="button" onClick={() => setInventoryConfirmed(!inventoryConfirmed)}
                className={`flex cursor-pointer items-center gap-4 border p-6 text-left transition-all duration-200 ${inventoryConfirmed ? "border-humana-gold" : "border-humana-line hover:border-humana-ink"}`}>
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${inventoryConfirmed ? "border-humana-gold bg-humana-gold" : "border-humana-line"}`}>
                  {inventoryConfirmed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12l3 3 5-5" /></svg>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium text-humana-ink">Confirmo guardar en inventario</span>
                  <span className="text-[13px] text-humana-muted">Comprar estas plazas sin asignar cliente por ahora</span>
                </div>
              </button>

              <div className="flex flex-col gap-4 border border-humana-line p-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">DETALLE DE LA COMPRA</span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-humana-muted">Retiro</span>
                    <span className="text-[14px] font-medium text-humana-ink">{retreat?.name ?? "Retiro"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-humana-muted">Habitacion</span>
                    <span className="text-[14px] font-medium text-humana-ink">{room?.name ?? "Suite"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-humana-muted">Fechas</span>
                    <span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)} — {formatDateShort(computedCheckOut)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-humana-muted">Plazas</span>
                    <span className="text-[14px] font-medium text-humana-ink">{room?.maxGuests ?? 2} huespedes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="w-[340px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 border border-humana-line p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">RESUMEN DE RESERVA</span>
            <div className="flex flex-col gap-1"><span className="text-[15px] font-medium text-humana-ink">{hotel?.name ?? "Hotel Itzamna"} · {room?.name ?? "Suite Cenote"}</span><span className="text-[13px] text-humana-muted">{hotel?.location ?? "Tulum, Mexico"}</span></div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Check-in</span><span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckIn)} · 15:00</span></div>
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Check-out</span><span className="text-[14px] font-medium text-humana-ink">{formatDateShort(computedCheckOut)} · 11:00</span></div>
              <div className="flex items-center justify-between"><span className="text-[14px] text-humana-muted">Noches totales</span><span className="text-[14px] font-medium text-humana-ink">{totalNights} ({nightsBreakdown})</span></div>
            </div>
            <div className="h-px bg-humana-line" />

            {mode === "inventory" ? (
              <div className="flex items-center gap-3 bg-humana-gold/8 p-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">INVENTARIO</span>
                  <span className="text-[12px] text-humana-muted">Sin cliente asignado</span>
                </div>
              </div>
            ) : selectedClient && !newClientCreated ? (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">CLIENTE ASIGNADO</span>
                <span className="text-[15px] font-medium text-humana-ink">{selectedClient.name}</span>
                <span className="text-[13px] text-humana-muted">{selectedClient.email}</span>
              </div>
            ) : newClientCreated && newName.trim() ? (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">CLIENTE NUEVO</span>
                <span className="text-[15px] font-medium text-humana-ink">{newName}</span>
                <span className="text-[13px] text-humana-muted">{newEmail || "—"}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-gold">CLIENTE ASIGNADO</span>
                <span className="text-[14px] text-humana-subtle">Ningun cliente seleccionado</span>
              </div>
            )}

            <div className="h-px bg-humana-line" />
            <div className="flex items-center justify-between"><span className="text-[15px] font-medium text-humana-ink">Total</span><span className="text-[18px] font-semibold text-humana-ink">${total.toLocaleString()} USD</span></div>

            <Link
              href={`/select-country/${country}/step-4-checkout`}
              onClick={() => {
                if (mode === "inventory") {
                  set({ clientId: null, inventoryMode: true });
                } else if (selectedId && !newClientCreated) {
                  set({ clientId: selectedId, inventoryMode: false });
                } else {
                  set({ clientId: null, inventoryMode: false });
                }
              }}
              className={`flex items-center justify-center gap-3 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] transition-all duration-150 active:scale-[0.98] ${canContinue ? "bg-humana-ink text-white hover:bg-black" : "pointer-events-none bg-humana-line text-humana-subtle"}`}>
              {mode === "inventory" ? "COMPRAR PLAZAS" : "IR A CHECKOUT"}
              <svg width="14" height="9" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 5h14M10 1l4 4-4 4" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
