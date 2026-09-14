"use client";

/**
 * Property form blocks shared by the hotel onboarding wizard (step 1) and the
 * hotel settings "Property" tab, so both screens capture the same contract
 * fields with the same behaviour. Every component is defined at module level —
 * defining them inside a render would remount the inputs on each keystroke.
 */

import { TimePicker } from "@/components/TimePicker";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  AIRPORT_TRANSFERS,
  ENVIRONMENTS,
  PET_NOTES_MAX,
  PROPERTY_TYPES,
  decimalOrNull,
  googleMapsUrl,
  isAirportTransfer,
  isPropertyType,
  type Environment,
} from "@/lib/property-catalog";
import {
  CLEARED_PET_DETAILS,
  groupRangeInvalid,
  type PropertyFormValues,
} from "@/lib/property-form";

export type PropertyFormVariant = "wizard" | "settings";

const INPUT_CLASS: Record<PropertyFormVariant, string> = {
  wizard:
    "w-full bg-white rounded-[6px] border border-humana-line px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20",
  settings:
    "w-full bg-white border border-humana-line px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold",
};

const LABEL_CLASS: Record<PropertyFormVariant, string> = {
  wizard: "text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted",
  settings: "text-[10px] font-semibold uppercase tracking-[0.12em] text-humana-subtle",
};

const SECTION_CLASS: Record<PropertyFormVariant, string> = {
  wizard: "text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted",
  settings: "text-[13px] font-semibold text-humana-ink",
};

export type PropertyBlockProps = {
  values: PropertyFormValues;
  onChange: (patch: Partial<PropertyFormValues>) => void;
  variant?: PropertyFormVariant;
};

/* ─── Primitives ─── */

function Field({
  label,
  variant,
  className,
  children,
}: {
  label: string;
  variant: PropertyFormVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label className={LABEL_CLASS[variant]}>{label}</label>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onValueChange,
  variant,
  placeholder,
  type = "text",
  step,
  min,
  maxLength,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  variant: PropertyFormVariant;
  placeholder?: string;
  type?: "text" | "number" | "url";
  step?: string;
  min?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <Field label={label} variant={variant} className={className}>
      <input
        type={type}
        step={step}
        min={min}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS[variant]}
      />
    </Field>
  );
}

function YesNoField({
  label,
  value,
  onValueChange,
  variant,
}: {
  label: string;
  value: boolean | null;
  onValueChange: (v: boolean) => void;
  variant: PropertyFormVariant;
}) {
  const { t } = useLocale();
  const p = t.propertyForm;
  const options: { label: string; option: boolean }[] = [
    { label: p.yes, option: true },
    { label: p.no, option: false },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className={variant === "wizard" ? "text-[14px] text-humana-ink" : "text-[13px] text-humana-ink"}>
        {label}
      </span>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={String(o.option)}
            type="button"
            onClick={() => onValueChange(o.option)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-[13px] transition-all ${
              value === o.option
                ? "border-humana-ink bg-humana-ink text-white"
                : "border-humana-line bg-white text-humana-muted hover:border-humana-ink hover:text-humana-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── 1. Property type ─── */

export function PropertyTypeBlock({ values, onChange, variant = "wizard" }: PropertyBlockProps) {
  const { t } = useLocale();
  const p = t.propertyForm;

  return (
    <div className="flex flex-col gap-4">
      <h3 className={SECTION_CLASS[variant]}>{p.typeSection}</h3>
      <div className="grid grid-cols-2 gap-4">
        <Field label={p.typeLabel} variant={variant}>
          <select
            value={values.propertyType}
            onChange={(e) => {
              const next = e.target.value;
              onChange({
                propertyType: isPropertyType(next) ? next : "",
                ...(next === "other" ? {} : { propertyTypeOther: "" }),
              });
            }}
            className={`${INPUT_CLASS[variant]} cursor-pointer`}
          >
            <option value="">{p.typePlaceholder}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {p.types[type]}
              </option>
            ))}
          </select>
        </Field>
        {values.propertyType === "other" && (
          <TextField
            label={p.typeOtherLabel}
            value={values.propertyTypeOther}
            onValueChange={(v) => onChange({ propertyTypeOther: v })}
            variant={variant}
            placeholder={p.typeOtherPlaceholder}
          />
        )}
      </div>
    </div>
  );
}

/* ─── 2. Location + getting here ─── */

export function LocationBlock({ values, onChange, variant = "wizard" }: PropertyBlockProps) {
  const { t } = useLocale();
  const p = t.propertyForm;
  const mapsUrl = googleMapsUrl(
    decimalOrNull(values.latitude, 6),
    decimalOrNull(values.longitude, 6),
  );

  return (
    <div className="flex flex-col gap-4">
      <h3 className={SECTION_CLASS[variant]}>{p.locationSection}</h3>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label={p.cityLabel}
          value={values.city}
          onValueChange={(v) => onChange({ city: v })}
          variant={variant}
        />
        <TextField
          label={p.stateRegionLabel}
          value={values.stateRegion}
          onValueChange={(v) => onChange({ stateRegion: v })}
          variant={variant}
        />
        <TextField
          label={p.countryLabel}
          value={values.country}
          onValueChange={(v) => onChange({ country: v })}
          variant={variant}
        />
        <TextField
          label={p.postalCodeLabel}
          value={values.postalCode}
          onValueChange={(v) => onChange({ postalCode: v })}
          variant={variant}
        />
        <TextField
          label={p.latitudeLabel}
          value={values.latitude}
          onValueChange={(v) => onChange({ latitude: v })}
          variant={variant}
          type="number"
          step="any"
          placeholder="-34.6037"
        />
        <TextField
          label={p.longitudeLabel}
          value={values.longitude}
          onValueChange={(v) => onChange({ longitude: v })}
          variant={variant}
          type="number"
          step="any"
          placeholder="-58.3816"
        />
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 -mt-1 text-[13px] font-medium text-humana-gold hover:underline"
          >
            {p.viewOnMaps} →
          </a>
        )}
        <TextField
          label={p.websiteLabel}
          value={values.website}
          onValueChange={(v) => onChange({ website: v })}
          variant={variant}
          placeholder="https://"
        />
        <TextField
          label={p.instagramLabel}
          value={values.instagram}
          onValueChange={(v) => onChange({ instagram: v })}
          variant={variant}
          placeholder={p.instagramPlaceholder}
        />
      </div>

      {/* Getting here */}
      <div className="mt-2 flex flex-col gap-4 border-t border-humana-line pt-5">
        <h4 className={SECTION_CLASS[variant]}>{p.gettingHereSection}</h4>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label={p.nearestAirportLabel}
            value={values.nearestAirport}
            onValueChange={(v) => onChange({ nearestAirport: v })}
            variant={variant}
            placeholder={p.nearestAirportPlaceholder}
            className="col-span-2"
          />
          <TextField
            label={p.airportDistanceLabel}
            value={values.airportDistanceKm}
            onValueChange={(v) => onChange({ airportDistanceKm: v })}
            variant={variant}
            type="number"
            step="0.1"
            min="0"
          />
          <TextField
            label={p.airportTimeLabel}
            value={values.airportTimeMin}
            onValueChange={(v) => onChange({ airportTimeMin: v })}
            variant={variant}
            type="number"
            step="1"
            min="0"
          />
          <Field label={p.airportTransferLabel} variant={variant}>
            <select
              value={values.airportTransfer}
              onChange={(e) => {
                const next = e.target.value;
                onChange({
                  airportTransfer: isAirportTransfer(next) ? next : "",
                  ...(next === "included" || next === "paid" ? {} : { airportTransferNotes: "" }),
                });
              }}
              className={`${INPUT_CLASS[variant]} cursor-pointer`}
            >
              <option value="">{p.typePlaceholder}</option>
              {AIRPORT_TRANSFERS.map((key) => (
                <option key={key} value={key}>
                  {p.transfers[key]}
                </option>
              ))}
            </select>
          </Field>
          <TextField
            label={p.distanceToCenterLabel}
            value={values.distanceToCenterKm}
            onValueChange={(v) => onChange({ distanceToCenterKm: v })}
            variant={variant}
            type="number"
            step="0.1"
            min="0"
          />
          {values.airportTransfer !== "" && values.airportTransfer !== "none" && (
            <TextField
              label={p.airportTransferNotesLabel}
              value={values.airportTransferNotes}
              onValueChange={(v) => onChange({ airportTransferNotes: v })}
              variant={variant}
              className="col-span-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Environment ─── */

export function EnvironmentBlock({ values, onChange, variant = "wizard" }: PropertyBlockProps) {
  const { t } = useLocale();
  const p = t.propertyForm;

  function toggle(key: Environment) {
    const selected = values.environments.includes(key);
    onChange({
      environments: selected
        ? values.environments.filter((e) => e !== key)
        : [...values.environments, key],
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className={SECTION_CLASS[variant]}>{p.environmentSection}</h3>
      <p className="text-[12px] text-humana-muted">{p.environmentHint}</p>
      <div className="flex flex-wrap gap-2">
        {ENVIRONMENTS.map((key) => {
          const selected = values.environments.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${
                selected
                  ? "border-humana-ink bg-humana-ink text-white"
                  : "border-humana-line bg-white text-humana-muted hover:border-humana-ink hover:text-humana-ink"
              }`}
            >
              {p.environments[key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 4. Check-in / check-out ─── */

export function ScheduleBlock({ values, onChange, variant = "wizard" }: PropertyBlockProps) {
  const { t } = useLocale();
  const p = t.propertyForm;

  return (
    <div className="flex flex-col gap-4">
      <h3 className={SECTION_CLASS[variant]}>{p.scheduleSection}</h3>
      <div className="grid grid-cols-2 gap-4">
        <Field label={p.checkInLabel} variant={variant}>
          <TimePicker
            value={values.checkInTime}
            onChange={(v) => onChange({ checkInTime: v })}
            className={INPUT_CLASS[variant]}
          />
        </Field>
        <Field label={p.checkOutLabel} variant={variant}>
          <TimePicker
            value={values.checkOutTime}
            onChange={(v) => onChange({ checkOutTime: v })}
            className={INPUT_CLASS[variant]}
          />
        </Field>
      </div>
    </div>
  );
}

/* ─── 5. Policies & services (pets) ─── */

export function PetPolicyBlock({ values, onChange, variant = "wizard" }: PropertyBlockProps) {
  const { t } = useLocale();
  const p = t.propertyForm;

  return (
    <div className="flex flex-col gap-4">
      <h3 className={SECTION_CLASS[variant]}>{p.policiesSection}</h3>
      <YesNoField
        label={p.petFriendlyLabel}
        value={values.petFriendly}
        onValueChange={(v) =>
          // Turning pet friendly off clears every sub-answer so a stale "yes"
          // is never sent back to the API.
          onChange(v ? { petFriendly: true } : { petFriendly: false, ...CLEARED_PET_DETAILS })
        }
        variant={variant}
      />
      {values.petFriendly === true && (
        <div className="flex flex-col gap-3 rounded-[6px] border border-humana-line bg-humana-stone/40 p-4">
          <YesNoField
            label={p.petDogsLabel}
            value={values.petDogs}
            onValueChange={(v) => onChange({ petDogs: v })}
            variant={variant}
          />
          <YesNoField
            label={p.petCatsLabel}
            value={values.petCats}
            onValueChange={(v) => onChange({ petCats: v })}
            variant={variant}
          />
          <YesNoField
            label={p.petSizeRestrictionLabel}
            value={values.petSizeRestriction}
            onValueChange={(v) =>
              onChange(v ? { petSizeRestriction: true } : { petSizeRestriction: false, petSizeRestrictionNotes: "" })
            }
            variant={variant}
          />
          {values.petSizeRestriction === true && (
            <TextField
              label={p.petSizeRestrictionNotesLabel}
              value={values.petSizeRestrictionNotes}
              onValueChange={(v) => onChange({ petSizeRestrictionNotes: v })}
              variant={variant}
              maxLength={PET_NOTES_MAX}
            />
          )}
          <YesNoField
            label={p.petExtraCostLabel}
            value={values.petExtraCost}
            onValueChange={(v) =>
              onChange(v ? { petExtraCost: true } : { petExtraCost: false, petExtraCostNotes: "" })
            }
            variant={variant}
          />
          {values.petExtraCost === true && (
            <TextField
              label={p.petExtraCostNotesLabel}
              value={values.petExtraCostNotes}
              onValueChange={(v) => onChange({ petExtraCostNotes: v })}
              variant={variant}
              maxLength={PET_NOTES_MAX}
            />
          )}
          <YesNoField
            label={p.petCommonAreasLabel}
            value={values.petCommonAreas}
            onValueChange={(v) => onChange({ petCommonAreas: v })}
            variant={variant}
          />
          <YesNoField
            label={p.petSpecificRoomsLabel}
            value={values.petSpecificRooms}
            onValueChange={(v) => onChange({ petSpecificRooms: v })}
            variant={variant}
          />
        </div>
      )}
    </div>
  );
}

/* ─── 6. Group capacity ─── */

export function GroupCapacityBlock({ values, onChange, variant = "wizard" }: PropertyBlockProps) {
  const { t } = useLocale();
  const p = t.propertyForm;
  const invalid = groupRangeInvalid(values);

  return (
    <div className="flex flex-col gap-4">
      <h3 className={SECTION_CLASS[variant]}>{p.groupsSection}</h3>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label={p.groupMinLabel}
          value={values.groupMinGuests}
          onValueChange={(v) => onChange({ groupMinGuests: v })}
          variant={variant}
          type="number"
          step="1"
          min="1"
        />
        <TextField
          label={p.groupMaxLabel}
          value={values.groupMaxGuests}
          onValueChange={(v) => onChange({ groupMaxGuests: v })}
          variant={variant}
          type="number"
          step="1"
          min="1"
        />
      </div>
      {invalid && (
        <p className="text-[12px] font-medium text-red-600">{p.groupRangeError}</p>
      )}
    </div>
  );
}
