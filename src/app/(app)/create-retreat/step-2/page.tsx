"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { StepIndicator } from "@/components/StepIndicator";
import { WizardVistaPrevia } from "@/components/WizardVistaPrevia";
import { useWizard } from "@/contexts/WizardContext";
import { hotels } from "@/data/hotels";
import { inventoryBlocks } from "@/data/inventory";


export default function WizardStep2() {
  const { t } = useLocale();
  const { state, set } = useWizard();

  /* Auto-fill from selected hotel inventory */
  useEffect(() => {
    if (!state.hotelId) return;
    const blocks = inventoryBlocks.filter(
      (b) => b.hotelId === state.hotelId && b.availableRooms > 0 && b.status !== "sold_out"
    );
    if (blocks.length === 0) return;

    const hotel = hotels.find((h) => h.id === state.hotelId);
    const totalPlazas = blocks.reduce((sum, b) => {
      const rt = hotel?.roomTypes.find((r) => r.id === b.roomTypeId);
      return sum + b.availableRooms * (rt?.maxGuests ?? 2);
    }, 0);

    const earliest = blocks.reduce((min, b) => (b.dateStart < min ? b.dateStart : min), blocks[0].dateStart);

    const patch: Partial<typeof state> = {};
    if (!state.capacity || state.capacity === 12) patch.capacity = totalPlazas;
    if (!state.startDate) patch.startDate = earliest;
    if (Object.keys(patch).length > 0) set(patch);
  }, [state.hotelId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Auto-calculate end date from start date + nights */
  useEffect(() => {
    if (state.startDate && state.nights > 0) {
      const start = new Date(state.startDate);
      start.setDate(start.getDate() + state.nights);
      const endStr = start.toISOString().split("T")[0];
      if (endStr !== state.endDate) {
        set({ endDate: endStr });
      }
    }
  }, [state.startDate, state.nights, state.endDate, set]);

  return (
    <div className="animate-fade-in-up flex flex-col gap-0 px-16 py-10">
      <div className="flex gap-12">
        {/* LEFT: main content */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              Paso 2 de 6
            </span>
            <h2 className="text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
              Información básica
            </h2>
            <p className="text-[15px] leading-[22px] text-humana-muted">
              Completa los datos generales de tu retiro.
            </p>
          </div>

          <StepIndicator
            steps={t.createRetreat?.steps ?? ["Hotel", "Info básica", "Programa", "Precios", "Galería", "Revisión"]}
            currentStep={1}
            className="flex items-center gap-0 py-4"
          />

          {/* Form card */}
          <div className="border border-humana-line bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-6">
              {/* Nombre del retiro */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                  Nombre del retiro <span className="text-humana-gold">*</span>
                </label>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="Raíz y Ceremonia"
                  className="w-full border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>

              {/* Row: Tipo + Duracion */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    Tipo de experiencia <span className="text-humana-gold">*</span>
                  </label>
                  <select
                    value={state.type}
                    onChange={(e) => set({ type: e.target.value as "retreat" | "masterclass" | "corporate" })}
                    className="w-full border border-humana-line bg-white px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  >
                    <option value="retreat">{t.createRetreat.step2.types.retreat}</option>
                    <option value="masterclass">{t.createRetreat.step2.types.masterclass}</option>
                    <option value="corporate">{t.createRetreat.step2.types.corporate}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    Duración (noches) <span className="text-humana-gold">*</span>
                  </label>
                  <input
                    type="number"
                    value={state.nights}
                    onChange={(e) => set({ nights: parseInt(e.target.value) || 0 })}
                    min={1}
                    className="w-full border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  />
                </div>
              </div>

              {/* Row: Fecha inicio + Fecha fin */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    Fecha inicio <span className="text-humana-gold">*</span>
                  </label>
                  <input
                    type="date"
                    value={state.startDate}
                    onChange={(e) => set({ startDate: e.target.value })}
                    className="w-full border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={state.endDate}
                    onChange={(e) => {
                      const end = e.target.value;
                      if (end && state.startDate) {
                        const diff = Math.round((new Date(end).getTime() - new Date(state.startDate).getTime()) / 86400000);
                        set({ endDate: end, nights: Math.max(1, diff) });
                      } else {
                        set({ endDate: end });
                      }
                    }}
                    className="w-full border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  />
                </div>
              </div>

              {/* Row: Capacidad + Idioma */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    Capacidad máxima <span className="text-humana-gold">*</span>
                  </label>
                  <input
                    type="number"
                    value={state.capacity}
                    onChange={(e) => set({ capacity: parseInt(e.target.value) || 0 })}
                    min={1}
                    className="w-full border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                    Idioma del retiro
                  </label>
                  <select
                    value={state.language}
                    onChange={(e) => set({ language: e.target.value })}
                    className="w-full border border-humana-line bg-white px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
                  >
                    <option value="Español">Español</option>
                    <option value="English">English</option>
                    <option value="Português">Português</option>
                  </select>
                </div>
              </div>

              {/* Descripcion */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                  Descripción <span className="text-humana-gold">*</span>
                </label>
                <textarea
                  value={state.description}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder="Inmersión en medicina ancestral maya, yoga al amanecer y círculos de cacao guiados por facilitadores certificados."
                  rows={4}
                  className="w-full border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle focus:border-humana-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: VISTA PREVIA sidebar */}
        <WizardVistaPrevia currentStep={2} />
      </div>
    </div>
  );
}
