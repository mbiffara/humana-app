/** Retreat wizard step 2 — day-by-day program, facilitators, and inclusions.
 *  The day list stays in sync with the retreat's night count from step 1. */
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  generateId,
  useRetreatWizard,
  type FacilitatorEntry,
  type ProgramDayEntry,
} from "@/contexts/RetreatWizardContext";

const MAX_FACILITATORS = 3;

const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minutes}`;
});

const inputClass =
  "border border-humana-line bg-white px-3 py-2 text-[13px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

export default function RetreatProgramStep() {
  const { t } = useLocale();
  const tw = t.hotelWs.retreats.wizard;
  const { state, set } = useRetreatWizard();
  const [expandedDay, setExpandedDay] = useState(0);
  const [newInclusion, setNewInclusion] = useState("");

  // Keep one program day per night (adding/trimming as step 1 changes)
  useEffect(() => {
    if (state.nights > 0 && state.days.length !== state.nights) {
      const days: ProgramDayEntry[] = Array.from({ length: state.nights }, (_, i) => {
        return (
          state.days[i] ?? { id: generateId(), dayNumber: i + 1, title: "", activities: [] }
        );
      });
      set({ days });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.nights]);

  function updateDay(dayId: string, patch: Partial<ProgramDayEntry>) {
    set({
      days: state.days.map((d) => (d.id === dayId ? { ...d, ...patch } : d)),
    });
  }

  function addActivity(day: ProgramDayEntry) {
    updateDay(day.id, {
      activities: [...day.activities, { id: generateId(), time: "09:00", name: "" }],
    });
  }

  function updateFacilitator(id: string, patch: Partial<FacilitatorEntry>) {
    set({
      facilitators: state.facilitators.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  }

  function addInclusion() {
    const name = newInclusion.trim();
    if (!name || state.inclusions.includes(name)) return;
    set({ inclusions: [...state.inclusions, name] });
    setNewInclusion("");
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tw.stepOf(2, 5)}
        </p>
        <h2 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">{tw.program.title}</h2>
        <p className="mt-1 text-[15px] leading-[22px] text-humana-muted">{tw.program.subtitle(state.nights)}</p>

        {/* Day accordions */}
        <div className="mt-8 flex flex-col gap-3">
          {state.days.map((day, i) => {
            const isExpanded = expandedDay === i;
            return (
              <div key={day.id} className="overflow-hidden rounded-lg border border-humana-line">
                <button
                  onClick={() => setExpandedDay(isExpanded ? -1 : i)}
                  className="flex w-full cursor-pointer items-center gap-3 bg-white px-5 py-4 text-left transition-colors hover:bg-humana-stone/40"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-humana-ink text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[14px] font-medium text-humana-ink">
                    {tw.program.dayLabel(i + 1)}
                    {day.title.trim() ? ` — ${day.title.trim()}` : ""}
                  </span>
                  <span className="text-[12px] text-humana-subtle">
                    {tw.program.activitiesCount(day.activities.filter((a) => a.name.trim()).length)}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-humana-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="border-t border-humana-line bg-humana-stone/30 px-5 py-4">
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => updateDay(day.id, { title: e.target.value })}
                      placeholder={tw.program.dayTitlePlaceholder}
                      className={`${inputClass} mb-4 w-full`}
                    />
                    <div className="flex flex-col gap-2">
                      {day.activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3">
                          <select
                            value={activity.time}
                            onChange={(e) =>
                              updateDay(day.id, {
                                activities: day.activities.map((a) =>
                                  a.id === activity.id ? { ...a, time: e.target.value } : a,
                                ),
                              })
                            }
                            className={`${inputClass} w-[90px] cursor-pointer`}
                          >
                            {TIME_OPTIONS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={activity.name}
                            onChange={(e) =>
                              updateDay(day.id, {
                                activities: day.activities.map((a) =>
                                  a.id === activity.id ? { ...a, name: e.target.value } : a,
                                ),
                              })
                            }
                            placeholder={tw.program.activityPlaceholder}
                            className={`${inputClass} flex-1`}
                          />
                          <button
                            onClick={() =>
                              updateDay(day.id, {
                                activities: day.activities.filter((a) => a.id !== activity.id),
                              })
                            }
                            className="cursor-pointer p-1 text-humana-subtle transition-colors hover:text-red-500"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addActivity(day)}
                      className="mt-3 cursor-pointer text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
                    >
                      + {tw.program.addActivity}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Facilitators */}
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {tw.program.facilitators}
          </p>
          <span className="text-[12px] text-humana-subtle">
            {tw.program.facilitatorCount(state.facilitators.length, MAX_FACILITATORS)}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {state.facilitators.map((facilitator) => (
            <div
              key={facilitator.id}
              className="flex items-center gap-4 rounded-lg border border-humana-line px-4 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold-light text-[12px] font-semibold text-humana-ink">
                {facilitator.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "•"}
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <input
                  type="text"
                  value={facilitator.name}
                  onChange={(e) => updateFacilitator(facilitator.id, { name: e.target.value })}
                  placeholder={tw.program.facilitatorNamePlaceholder}
                  className={`${inputClass} w-full`}
                />
                <input
                  type="text"
                  value={facilitator.specialty}
                  onChange={(e) => updateFacilitator(facilitator.id, { specialty: e.target.value })}
                  placeholder={tw.program.specialtyPlaceholder}
                  className={`${inputClass} w-full`}
                />
              </div>
              <button
                onClick={() =>
                  updateFacilitator(facilitator.id, {
                    role: facilitator.role === "lead" ? "assistant" : "lead",
                  })
                }
                className={`cursor-pointer rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  facilitator.role === "lead"
                    ? "bg-humana-gold text-white"
                    : "bg-humana-stone text-humana-muted"
                }`}
              >
                {facilitator.role === "lead" ? tw.program.lead : tw.program.assistant}
              </button>
              <button
                onClick={() =>
                  set({ facilitators: state.facilitators.filter((f) => f.id !== facilitator.id) })
                }
                className="cursor-pointer p-1 text-humana-subtle transition-colors hover:text-red-500"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {state.facilitators.length < MAX_FACILITATORS && (
          <button
            onClick={() =>
              set({
                facilitators: [
                  ...state.facilitators,
                  {
                    id: generateId(),
                    name: "",
                    role: state.facilitators.length === 0 ? "lead" : "assistant",
                    specialty: "",
                  },
                ],
              })
            }
            className="mt-4 w-full cursor-pointer rounded-lg border border-dashed border-humana-gold py-3 text-[13px] font-medium text-humana-gold transition-colors hover:bg-humana-gold-light/40"
          >
            + {tw.program.addFacilitator}
          </button>
        )}
      </section>

      {/* What's included */}
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
          {tw.program.included}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {state.inclusions.map((inclusion) => (
            <span
              key={inclusion}
              className="flex items-center gap-2 border border-humana-line px-3 py-1.5 text-[13px] text-humana-ink"
            >
              {inclusion}
              <button
                onClick={() =>
                  set({ inclusions: state.inclusions.filter((i) => i !== inclusion) })
                }
                className="cursor-pointer text-humana-subtle transition-colors hover:text-red-500"
                aria-label="Remove"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={newInclusion}
            onChange={(e) => setNewInclusion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addInclusion();
            }}
            placeholder={tw.program.itemPlaceholder}
            className={`${inputClass} w-[280px]`}
          />
          <button
            onClick={addInclusion}
            className="cursor-pointer text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
          >
            + {tw.program.addItem}
          </button>
        </div>
      </section>
    </div>
  );
}
