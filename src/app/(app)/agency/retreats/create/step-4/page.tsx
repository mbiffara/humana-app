/** Agency retreat wizard step 4 — program (days, activities, facilitators, inclusions).
 *  Adapted from hotel wizard step-2. All fields required. */
"use client";

import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  useAgencyRetreatWizard,
  generateId,
  type ProgramDayEntry,
  type FacilitatorEntry,
} from "@/contexts/AgencyRetreatWizardContext";

const MAX_FACILITATORS = 6;
const inputClass =
  "w-full border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

export default function AgencyRetreatProgramStep() {
  const { t } = useLocale();
  const tw = t.agencyWs.retreats.wizard;
  const { state, set } = useAgencyRetreatWizard();

  // Auto-populate days to match duration if empty
  useEffect(() => {
    if (state.days.length === 0 && state.nights > 0) {
      const days: ProgramDayEntry[] = Array.from({ length: state.nights + 1 }, (_, i) => ({
        id: generateId(),
        dayNumber: i + 1,
        title: "",
        activities: [{ id: generateId(), time: "", name: "" }],
      }));
      set({ days });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.days.length, state.nights]);

  function updateDay(dayId: string, patch: Partial<ProgramDayEntry>) {
    set({
      days: state.days.map((d) => (d.id === dayId ? { ...d, ...patch } : d)),
    });
  }

  function addActivity(dayId: string) {
    set({
      days: state.days.map((d) =>
        d.id === dayId
          ? { ...d, activities: [...d.activities, { id: generateId(), time: "", name: "" }] }
          : d,
      ),
    });
  }

  function updateActivity(dayId: string, actId: string, patch: { time?: string; name?: string }) {
    set({
      days: state.days.map((d) =>
        d.id === dayId
          ? {
              ...d,
              activities: d.activities.map((a) => (a.id === actId ? { ...a, ...patch } : a)),
            }
          : d,
      ),
    });
  }

  function removeActivity(dayId: string, actId: string) {
    set({
      days: state.days.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.filter((a) => a.id !== actId) }
          : d,
      ),
    });
  }

  function addFacilitator() {
    if (state.facilitators.length >= MAX_FACILITATORS) return;
    set({
      facilitators: [
        ...state.facilitators,
        { id: generateId(), name: "", role: "assistant", specialty: "" },
      ],
    });
  }

  function updateFacilitator(id: string, patch: Partial<FacilitatorEntry>) {
    set({
      facilitators: state.facilitators.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  }

  function removeFacilitator(id: string) {
    set({ facilitators: state.facilitators.filter((f) => f.id !== id) });
  }

  function addInclusion() {
    set({ inclusions: [...state.inclusions, ""] });
  }

  function updateInclusion(idx: number, value: string) {
    set({ inclusions: state.inclusions.map((v, i) => (i === idx ? value : v)) });
  }

  function removeInclusion(idx: number) {
    set({ inclusions: state.inclusions.filter((_, i) => i !== idx) });
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Day-by-day program */}
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {tw.stepOf(4, 6)}
        </p>
        <h2 className="mt-2 text-[32px] font-light leading-[40px] tracking-[-0.01em] text-humana-ink">
          {tw.program.title}
        </h2>
        <p className="mt-1 text-[15px] leading-[22px] text-humana-muted">
          {tw.program.subtitle(state.nights)}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {state.days.map((day, dayIdx) => (
            <div key={day.id} className="rounded-lg border border-humana-line bg-humana-stone/20 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-humana-ink text-[11px] font-semibold text-white">
                  {dayIdx + 1}
                </span>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => updateDay(day.id, { title: e.target.value })}
                  placeholder={tw.program.dayTitlePlaceholder}
                  className={`${inputClass} flex-1`}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2 pl-10">
                {day.activities.map((act) => (
                  <div key={act.id} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={act.time}
                      onChange={(e) => updateActivity(day.id, act.id, { time: e.target.value })}
                      className="w-[100px] border border-humana-line bg-white px-2 py-2 text-[13px] text-humana-ink outline-none focus:border-humana-gold"
                    />
                    <input
                      type="text"
                      value={act.name}
                      onChange={(e) => updateActivity(day.id, act.id, { name: e.target.value })}
                      placeholder={tw.program.activityPlaceholder}
                      className={`${inputClass} flex-1`}
                    />
                    {day.activities.length > 1 && (
                      <button
                        onClick={() => removeActivity(day.id, act.id)}
                        className="cursor-pointer text-[12px] text-humana-subtle transition-colors hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addActivity(day.id)}
                  className="mt-1 cursor-pointer self-start text-[12px] font-medium text-humana-gold transition-opacity hover:opacity-75"
                >
                  + {tw.program.addActivity}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilitators */}
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {tw.program.facilitators}
            </p>
            <p className="mt-0.5 text-[12px] text-humana-subtle">
              {tw.program.facilitatorCount(state.facilitators.length, MAX_FACILITATORS)}
            </p>
          </div>
          {state.facilitators.length < MAX_FACILITATORS && (
            <button
              onClick={addFacilitator}
              className="cursor-pointer text-[12px] font-medium text-humana-gold transition-opacity hover:opacity-75"
            >
              + {tw.program.addFacilitator}
            </button>
          )}
        </div>

        {state.facilitators.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {state.facilitators.map((f) => (
              <div key={f.id} className="flex items-center gap-3 rounded-lg border border-humana-line bg-humana-stone/20 p-4">
                <input
                  type="text"
                  value={f.name}
                  onChange={(e) => updateFacilitator(f.id, { name: e.target.value })}
                  placeholder={tw.program.facilitatorNamePlaceholder}
                  className={`${inputClass} flex-1`}
                />
                <select
                  value={f.role}
                  onChange={(e) => updateFacilitator(f.id, { role: e.target.value as "lead" | "assistant" })}
                  className="cursor-pointer border border-humana-line bg-white px-3 py-2.5 text-[13px] text-humana-ink outline-none focus:border-humana-gold"
                >
                  <option value="lead">{tw.program.lead}</option>
                  <option value="assistant">{tw.program.assistant}</option>
                </select>
                <input
                  type="text"
                  value={f.specialty}
                  onChange={(e) => updateFacilitator(f.id, { specialty: e.target.value })}
                  placeholder={tw.program.specialtyPlaceholder}
                  className={`${inputClass} w-[200px]`}
                />
                <button
                  onClick={() => removeFacilitator(f.id)}
                  className="cursor-pointer text-[12px] text-humana-subtle transition-colors hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* What's included */}
      <section className="rounded-xl border border-humana-line bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {tw.program.included}
          </p>
          <button
            onClick={addInclusion}
            className="cursor-pointer text-[12px] font-medium text-humana-gold transition-opacity hover:opacity-75"
          >
            + {tw.program.addItem}
          </button>
        </div>
        {state.inclusions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {state.inclusions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 rounded border border-humana-line bg-humana-stone/20 px-3 py-1.5">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateInclusion(idx, e.target.value)}
                  placeholder={tw.program.itemPlaceholder}
                  className="w-[160px] border-none bg-transparent text-[13px] text-humana-ink outline-none"
                />
                <button
                  onClick={() => removeInclusion(idx)}
                  className="cursor-pointer text-[11px] text-humana-subtle transition-colors hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
