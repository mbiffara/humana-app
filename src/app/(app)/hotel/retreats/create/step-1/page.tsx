/** Retreat wizard step 1 — basic information (HT-05 Step 2 in the design;
 *  the hotel-select step is skipped since hotel users manage one property). */
"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { computeEndDate, useRetreatWizard } from "@/contexts/RetreatWizardContext";
import type { RetreatType } from "@/lib/api/hotel";

const RETREAT_TYPES: RetreatType[] = ["wellness", "spiritual", "corporate", "adventure", "medical"];
const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
        {label} {required && <span className="text-humana-gold">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold";

export default function RetreatInfoStep() {
  const { t, locale } = useLocale();
  const tw = t.hotelWs.retreats.wizard;
  const { state, set } = useRetreatWizard();

  const endDate = computeEndDate(state.startDate, state.nights);
  const endDateLabel = endDate
    ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(`${endDate}T00:00:00`),
      )
    : "";

  return (
    <section className="rounded-xl border border-humana-line bg-white p-8 animate-fade-in-up">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {tw.stepOf(1, 5)}
      </p>
      <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{tw.info.title}</h2>
      <p className="mt-1 text-[13px] text-humana-muted">{tw.info.subtitle}</p>

      <div className="mt-8 flex flex-col gap-6">
        <Field label={tw.info.name} required>
          <input
            type="text"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder={tw.info.namePlaceholder}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label={tw.info.type} required>
            <select
              value={state.retreatType}
              onChange={(e) => set({ retreatType: e.target.value as RetreatType })}
              className={`${inputClass} cursor-pointer`}
            >
              {RETREAT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {tw.types[type]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={tw.info.nights} required>
            <input
              type="number"
              min={1}
              max={60}
              value={state.nights || ""}
              onChange={(e) => set({ nights: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label={tw.info.startDate} required>
            <input
              type="date"
              value={state.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
              className={`${inputClass} cursor-pointer`}
            />
          </Field>
          <Field label={tw.info.endDate}>
            <input
              type="text"
              value={endDateLabel ? `${endDateLabel} ${tw.info.endDateAuto}` : ""}
              readOnly
              tabIndex={-1}
              className={`${inputClass} pointer-events-none bg-humana-stone text-humana-muted`}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label={tw.info.capacity} required>
            <input
              type="number"
              min={1}
              max={500}
              value={state.capacity || ""}
              onChange={(e) => set({ capacity: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className={inputClass}
            />
          </Field>
          <Field label={tw.info.language}>
            <select
              value={state.language}
              onChange={(e) => set({ language: e.target.value })}
              className={`${inputClass} cursor-pointer`}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={tw.info.description} required>
          <textarea
            value={state.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder={tw.info.descriptionPlaceholder}
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>
    </section>
  );
}
