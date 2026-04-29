"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWizard } from "@/contexts/WizardContext";
import { WizardVistaPrevia } from "@/components/WizardVistaPrevia";
import { hotels } from "@/data/hotels";
import { StepIndicator } from "@/components/StepIndicator";
import type { ProgramDay } from "@/data/types";
import type { Facilitator } from "@/data/types";

const TIME_OPTIONS = [
  "", "6:00 am", "6:30 am", "7:00 am", "7:30 am", "8:00 am", "8:30 am",
  "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am",
  "12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm",
  "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm",
  "6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm", "8:30 pm", "9:00 pm",
];


export default function WizardStep3() {
  const { t } = useLocale();
  const { state, set } = useWizard();
  const [program, setProgram] = useState<ProgramDay[]>(() => {
    if (state.program.length > 0) return state.program;
    const days = Math.max(1, state.nights);
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: "",
      activities: [{ time: "", name: "", description: "" }],
    }));
  });
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const hotel = hotels.find((h) => h.id === state.hotelId);

  /* Sync program days with state.nights */
  useEffect(() => {
    const targetDays = Math.max(1, state.nights);
    if (program.length === targetDays) return;
    setProgram((prev) => {
      if (prev.length < targetDays) {
        return [
          ...prev,
          ...Array.from({ length: targetDays - prev.length }, (_, i) => ({
            day: prev.length + i + 1,
            title: "",
            activities: [{ time: "", name: "", description: "" }],
          })),
        ];
      }
      return prev.slice(0, targetDays);
    });
  }, [state.nights]); // eslint-disable-line react-hooks/exhaustive-deps

  const [facilitators, setFacilitators] = useState<Facilitator[]>(
    state.facilitators.length > 0
      ? state.facilitators
      : hotel
        ? [{ name: hotel.name, role: "principal", bio: hotel.shortDescription ?? "" }]
        : []
  );

  /* Update default facilitator when hotel loads from sessionStorage */
  useEffect(() => {
    if (facilitators.length === 0 && hotel) {
      setFacilitators([{ name: hotel.name, role: "principal", bio: hotel.shortDescription ?? "" }]);
    }
  }, [hotel]); // eslint-disable-line react-hooks/exhaustive-deps
  const [newIncluded, setNewIncluded] = useState("");
  const [included, setIncluded] = useState<string[]>(
    state.included.length > 0
      ? state.included
      : ["Alojamiento", "Comidas plant-based", "Temazcal", "Yoga", "Excursión cenote", "Materiales"]
  );



  function updateDay(day: number, title: string) {
    setProgram(program.map((d) => (d.day === day ? { ...d, title } : d)));
  }

  function addActivity(day: number) {
    setProgram(
      program.map((d) =>
        d.day === day ? { ...d, activities: [...d.activities, { time: "", name: "", description: "" }] } : d
      )
    );
  }

  function updateActivity(day: number, idx: number, field: "time" | "name" | "description", value: string) {
    setProgram(
      program.map((d) =>
        d.day === day
          ? { ...d, activities: d.activities.map((a, i) => (i === idx ? { ...a, [field]: value } : a)) }
          : d
      )
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-0 px-16 py-10">
      <div className="flex gap-12">
        {/* LEFT: main content */}
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              PASO 3 DE 6
            </span>
            <h2 className="text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
              Programa del retiro
            </h2>
            <p className="text-[15px] leading-[22px] text-humana-muted">
              Define las actividades dia a dia para tu retiro de {state.nights} noches.
            </p>
          </div>

          <StepIndicator
            steps={t.createRetreat?.steps ?? ["Hotel", "Info básica", "Programa", "Precios", "Galería", "Revisión"]}
            currentStep={2}
            className="flex items-center gap-0 py-6"
          />

          {/* Day cards */}
          <div className="flex flex-col gap-4">
            {program.map((day) => {
              const isExpanded = expandedDay === day.day;
              return (
                <div key={day.day} className="overflow-hidden rounded-lg border border-humana-line bg-white">
                  {/* Day header */}
                  <button
                    type="button"
                    onClick={() => setExpandedDay(isExpanded ? -1 : day.day)}
                    className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-humana-stone"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold ${
                          isExpanded
                            ? "bg-humana-gold text-white"
                            : "bg-humana-stone text-humana-muted"
                        }`}
                      >
                        {day.day}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-medium text-humana-ink">
                          Día {day.day}
                        </span>
                        <span className="text-[13px] text-humana-muted">
                          {(() => {
                            if (!state.startDate) return "";
                            const d = new Date(state.startDate + "T12:00:00");
                            d.setDate(d.getDate() + day.day - 1);
                            const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
                            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                          })()}
                        </span>
                        {day.title && (
                          <span className="text-[15px] text-humana-ink">
                            &mdash; {day.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!isExpanded && (
                        <span className="text-[14px] text-humana-muted">
                          {day.activities.length} actividades
                        </span>
                      )}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#111"
                        strokeWidth="1.5"
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-humana-line px-6 py-5">
                      {/* Day title input */}
                      <div className="mb-4 flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
                          TITULO DEL DIA
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(day.day, e.target.value)}
                          placeholder="Llegada y bienvenida"
                          className="border border-humana-line px-3 py-2 text-[15px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
                        />
                      </div>

                      {/* Activity rows */}
                      <div className="flex flex-col gap-4">
                        {day.activities.map((act, i) => (
                          <div key={i} className="flex flex-col gap-1.5 border-l-2 border-humana-gold/30 pl-4">
                            <div className="flex items-center gap-3">
                              <select
                                value={act.time}
                                onChange={(e) => updateActivity(day.day, i, "time", e.target.value)}
                                className="w-[90px] shrink-0 appearance-none border-none bg-transparent text-[14px] text-humana-muted outline-none"
                              >
                                <option value="">Hora</option>
                                {TIME_OPTIONS.filter(Boolean).map((t) => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={act.name}
                                onChange={(e) => updateActivity(day.day, i, "name", e.target.value)}
                                placeholder={t.createRetreat.step3.activityName}
                                className="flex-1 text-[15px] font-medium text-humana-ink outline-none placeholder:text-humana-subtle"
                              />
                            </div>
                            <input
                              type="text"
                              value={act.description}
                              onChange={(e) => updateActivity(day.day, i, "description", e.target.value)}
                              placeholder="Descripción de la actividad..."
                              className="ml-[92px] text-[13px] text-humana-muted outline-none placeholder:text-humana-subtle"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Add activity */}
                      <button
                        type="button"
                        onClick={() => addActivity(day.day)}
                        className="mt-4 flex items-center gap-2 text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        + Anadir actividad
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Info: days come from step 2 duration */}
            <p className="py-2 text-center text-[12px] text-humana-subtle">
              La cantidad de días se define en el paso 2 (duración del retiro)
            </p>
          </div>

          {/* Facilitadores */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
                FACILITADORES
              </span>
              <span className="text-[12px] text-humana-muted">El primero es el principal · arrastra para reordenar</span>
            </div>
            {facilitators.map((f, i) => (
              <div key={i} className={`flex gap-4 border bg-white p-5 ${i === 0 ? "border-humana-gold/40" : "border-humana-line"}`}>
                {/* Drag handle / order */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => {
                      const updated = [...facilitators];
                      [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
                      setFacilitators(updated);
                    }}
                    className="text-humana-subtle transition-colors hover:text-humana-ink disabled:opacity-20"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <span className="text-[11px] font-bold text-humana-muted">{i + 1}</span>
                  <button
                    type="button"
                    disabled={i === facilitators.length - 1}
                    onClick={() => {
                      const updated = [...facilitators];
                      [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
                      setFacilitators(updated);
                    }}
                    className="text-humana-subtle transition-colors hover:text-humana-ink disabled:opacity-20"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>

                {/* Avatar */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${i === 0 ? "bg-humana-gold/10 text-humana-gold" : "bg-humana-stone text-humana-muted"}`}>
                  {f.name ? f.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?"}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={f.name}
                      onChange={(e) => {
                        const updated = [...facilitators];
                        updated[i] = { ...f, name: e.target.value };
                        setFacilitators(updated);
                      }}
                      placeholder="Nombre del facilitador"
                      className="flex-1 text-[15px] font-medium text-humana-ink outline-none placeholder:text-humana-subtle"
                    />
                    <span className={`shrink-0 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                      i === 0
                        ? "bg-humana-gold/10 text-humana-gold"
                        : "text-humana-subtle"
                    }`}>
                      {i === 0 ? "PRINCIPAL" : "ASISTENTE"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFacilitators(facilitators.filter((_, j) => j !== i))}
                      className="shrink-0 text-humana-subtle transition-colors hover:text-red-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={f.bio}
                    onChange={(e) => {
                      const updated = [...facilitators];
                      updated[i] = { ...f, bio: e.target.value };
                      setFacilitators(updated);
                    }}
                    placeholder="Descripción o especialidad..."
                    className="text-[13px] text-humana-muted outline-none placeholder:text-humana-subtle"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFacilitators([...facilitators, { name: "", role: "asistente", bio: "" }])}
              className="flex items-center justify-center gap-2 border border-dashed border-humana-line bg-white py-3.5 text-[13px] font-medium text-humana-gold transition-colors hover:border-humana-gold"
            >
              + Añadir facilitador
            </button>
          </div>

          {/* Qué incluye */}
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-subtle">
              QUÉ INCLUYE
            </span>
            <div className="flex flex-wrap gap-2">
              {included.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIncluded(included.filter((_, j) => j !== i))}
                  className="flex items-center gap-2 border border-humana-line bg-white px-4 py-2 text-[14px] text-humana-ink transition-colors hover:border-red-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="16 8 10 16 7 13" />
                  </svg>
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newIncluded}
                onChange={(e) => setNewIncluded(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newIncluded.trim()) {
                    setIncluded([...included, newIncluded.trim()]);
                    setNewIncluded("");
                  }
                }}
                placeholder="Escribir y presionar Enter..."
                className="flex-1 border border-humana-line px-4 py-2 text-[14px] text-humana-ink outline-none placeholder:text-humana-subtle focus:border-humana-gold"
              />
              <button
                type="button"
                onClick={() => {
                  if (newIncluded.trim()) {
                    setIncluded([...included, newIncluded.trim()]);
                    setNewIncluded("");
                  }
                }}
                className="px-4 py-2 text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
              >
                + Añadir
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: VISTA PREVIA sidebar */}
        <WizardVistaPrevia
          currentStep={3}
          onNext={() => set({ program, facilitators, included })}
        />
      </div>
    </div>
  );
}
