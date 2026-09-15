"use client";

/**
 * The single form for a common space, shared by the onboarding wizard (step 3)
 * and the hotel workspace page, so both capture exactly the same fields.
 *
 * The parent owns the draft: this component only reports the next value. Photos
 * are uploaded here — a preview URL shows straight away and is swapped for the
 * server URL once the upload lands, which is why the parent is told while an
 * upload is in flight (only http URLs survive a save).
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { PhotoGrid } from "@/components/hotel/PhotoGrid";
import { SpaceEquipmentPicker } from "@/components/hotel/SpaceEquipmentPicker";
import {
  Field,
  INPUT_CLASS,
  SECTION_CLASS,
  TextField,
  YesNoField,
  type PropertyFormVariant,
} from "@/components/hotel/PropertyFormBlocks";
import { decimalOrNull, integerOrNull, numberToInput } from "@/lib/property-catalog";
import {
  CAPACITY_KINDS,
  SPACE_NAME_MAX,
  FLOOR_TYPES,
  MAX_SPACE_PHOTOS,
  SPACE_TYPES,
  type CommonSpaceDraft,
  type CommonSpaceErrors,
} from "@/lib/space-catalog";
import { createPreviewUrl, uploadImage } from "@/lib/upload";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-[12px] text-red-600">{message}</span>;
}

export type CommonSpaceFormProps = {
  value: CommonSpaceDraft;
  onChange: (next: CommonSpaceDraft) => void;
  variant?: PropertyFormVariant;
  errors?: CommonSpaceErrors;
  /** Raised while photos are uploading so the parent can hold back the save. */
  onUploadingChange?: (uploading: boolean) => void;
};

export function CommonSpaceForm({
  value,
  onChange,
  variant = "wizard",
  errors,
  onUploadingChange,
}: CommonSpaceFormProps) {
  const { t } = useLocale();
  const c = t.commonSpaces;
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  // The draft changes while an upload is in flight, so the swap reads the
  // latest value instead of the one captured when the upload started. Event
  // handlers and upload callbacks only ever run after this effect.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);
  // Every preview → server URL swap made so far. Applying the whole map on
  // each upload keeps concurrent uploads from overwriting one another.
  const swaps = useRef<Record<string, string>>({});
  // Nothing stops a second batch being picked while the first is still going,
  // and a single boolean would let whichever settles first report "done" while
  // the other still holds blob: previews — so count the batches instead.
  const uploadsInFlight = useRef(0);
  // A batch can outlive the form: Cancel (or the workspace modal closing)
  // unmounts it while an upload is in flight. Writing the result back then
  // would hand the parent a draft it already discarded and reopen the editor.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function reportUploads() {
    const active = uploadsInFlight.current > 0;
    setUploading(active);
    onUploadingChange?.(active);
  }

  function patch(next: Partial<CommonSpaceDraft>) {
    onChange({ ...latest.current, ...next });
  }

  function setPhotos(photos: string[]) {
    onChange({ ...latest.current, photos });
  }

  function handleFiles(files: FileList | File[]) {
    const room = MAX_SPACE_PHOTOS - latest.current.photos.length;
    const selection = Array.from(files).slice(0, Math.max(0, room));

    const entries: { blobUrl: string; file: File }[] = [];
    for (const file of selection) {
      try {
        entries.push({ blobUrl: createPreviewUrl(file), file });
      } catch {
        // Wrong type or too large — skip it
      }
    }
    if (entries.length === 0) return;

    // Which space this batch belongs to: the form is reused for the next one
    const draftId = latest.current.localId;
    setPhotos([...latest.current.photos, ...entries.map((e) => e.blobUrl)]);
    uploadsInFlight.current += 1;
    reportUploads();
    Promise.allSettled(
      entries.map(async ({ blobUrl, file }) => {
        const serverUrl = await uploadImage(file);
        // Gone, or editing a different space by now — drop the result
        if (!mounted.current || latest.current.localId !== draftId) return;
        if (serverUrl.startsWith("http")) {
          swaps.current[blobUrl] = serverUrl;
          setPhotos(latest.current.photos.map((url) => swaps.current[url] ?? url));
        }
      }),
    ).finally(() => {
      uploadsInFlight.current -= 1;
      // The parent resets its own flag when it closes the form
      if (!mounted.current) return;
      reportUploads();
    });
  }

  const inputId = `space-photo-upload-${value.localId}`;
  const gallery = value.photos.map((url) => ({ url, category: "general" as const }));
  const canAddPhotos = value.photos.length < MAX_SPACE_PHOTOS;

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Identity ─── */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label={c.name} variant={variant}>
            <input
              type="text"
              value={value.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder={c.namePlaceholder}
              maxLength={SPACE_NAME_MAX}
              className={`${INPUT_CLASS[variant]} ${errors?.name ? "border-red-400" : ""}`}
            />
            <ErrorText message={errors?.name} />
          </Field>
          <Field label={c.type} variant={variant}>
            <select
              value={value.spaceType}
              onChange={(e) => {
                const next = e.target.value;
                patch({
                  spaceType: next,
                  ...(next === "other" ? {} : { spaceTypeOther: "" }),
                });
              }}
              className={`${INPUT_CLASS[variant]} cursor-pointer ${errors?.spaceType ? "border-red-400" : ""}`}
            >
              <option value="">{c.typePlaceholder}</option>
              {SPACE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {c.types[type]}
                </option>
              ))}
            </select>
            <ErrorText message={errors?.spaceType} />
          </Field>
          {value.spaceType === "other" && (
            <Field label={c.typeOther} variant={variant}>
              <input
                type="text"
                value={value.spaceTypeOther}
                onChange={(e) => patch({ spaceTypeOther: e.target.value })}
                className={`${INPUT_CLASS[variant]} ${errors?.spaceTypeOther ? "border-red-400" : ""}`}
              />
              <ErrorText message={errors?.spaceTypeOther} />
            </Field>
          )}
        </div>
      </div>

      {/* ─── Capacity ─── */}
      <div className="flex flex-col gap-4">
        <h3 className={SECTION_CLASS[variant]}>{c.capacitiesTitle}</h3>
        <div className="grid grid-cols-3 gap-4">
          {CAPACITY_KINDS.map((kind) => (
            <TextField
              key={kind}
              label={c.capacity[kind]}
              value={numberToInput(value.capacities[kind])}
              onValueChange={(v) => {
                // An empty field and a zero both mean "not measured this way"
                const parsed = integerOrNull(v);
                patch({
                  capacities: {
                    ...latest.current.capacities,
                    [kind]: parsed != null && parsed > 0 ? parsed : null,
                  },
                });
              }}
              variant={variant}
              type="number"
              min="1"
              step="1"
            />
          ))}
        </div>
      </div>

      {/* ─── Size, floor and exclusivity ─── */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label={c.area}
            value={numberToInput(value.areaSqm)}
            onValueChange={(v) => {
              const parsed = decimalOrNull(v, 1);
              patch({ areaSqm: parsed != null && parsed > 0 ? parsed : null });
            }}
            variant={variant}
            type="number"
            min="1"
            step="0.1"
          />
          <Field label={c.floor} variant={variant}>
            <select
              value={value.floorType}
              onChange={(e) => {
                const next = e.target.value;
                patch({
                  floorType: next,
                  ...(next === "other" ? {} : { floorTypeOther: "" }),
                });
              }}
              className={`${INPUT_CLASS[variant]} cursor-pointer`}
            >
              <option value="">{c.floorPlaceholder}</option>
              {FLOOR_TYPES.map((floor) => (
                <option key={floor} value={floor}>
                  {c.floors[floor]}
                </option>
              ))}
            </select>
          </Field>
          {value.floorType === "other" && (
            <Field label={c.floorOther} variant={variant}>
              <input
                type="text"
                value={value.floorTypeOther}
                onChange={(e) => patch({ floorTypeOther: e.target.value })}
                className={`${INPUT_CLASS[variant]} ${errors?.floorTypeOther ? "border-red-400" : ""}`}
              />
              <ErrorText message={errors?.floorTypeOther} />
            </Field>
          )}
        </div>
        <YesNoField
          label={c.exclusive}
          value={value.exclusiveForGroups}
          onValueChange={(v) => patch({ exclusiveForGroups: v })}
          variant={variant}
        />
      </div>

      {/* ─── Equipment ─── */}
      <div className="flex flex-col gap-4">
        <h3 className={SECTION_CLASS[variant]}>{c.equipmentTitle}</h3>
        <SpaceEquipmentPicker
          selected={value.equipment}
          onChange={(equipment) =>
            patch({
              equipment,
              ...(equipment.includes("other") ? {} : { equipmentOther: "" }),
            })
          }
        />
        {value.equipment.includes("other") && (
          <Field label={c.equipmentOther} variant={variant}>
            <input
              type="text"
              value={value.equipmentOther}
              onChange={(e) => patch({ equipmentOther: e.target.value })}
              className={`${INPUT_CLASS[variant]} ${errors?.equipmentOther ? "border-red-400" : ""}`}
            />
            <ErrorText message={errors?.equipmentOther} />
          </Field>
        )}
      </div>

      {/* ─── Photos ─── */}
      <div className="flex flex-col gap-4">
        <h3 className={SECTION_CLASS[variant]}>{c.photos}</h3>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
        <PhotoGrid
          photos={gallery}
          alt={value.name || c.title}
          variant={variant}
          showCategory={false}
          onReorder={(from, to) => {
            const next = [...latest.current.photos];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            setPhotos(next);
          }}
          onRemove={(index) => setPhotos(latest.current.photos.filter((_, i) => i !== index))}
          onCategoryChange={() => {
            /* a space gallery has no categories */
          }}
          onSetCover={(index) => {
            if (index <= 0 || index >= latest.current.photos.length) return;
            const next = [...latest.current.photos];
            const [moved] = next.splice(index, 1);
            next.unshift(moved);
            setPhotos(next);
          }}
          addSlot={
            canAddPhotos ? (
              <label
                htmlFor={inputId}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
                }}
                className={`flex ${variant === "wizard" ? "aspect-square" : "aspect-[4/3]"} cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[6px] border-2 border-dashed text-humana-muted transition-colors ${
                  isDragOver
                    ? "border-humana-gold bg-humana-gold-light/20 text-humana-gold"
                    : "border-humana-line hover:border-humana-gold hover:text-humana-gold"
                }`}
              >
                {uploading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {c.addPhotos}
                    </span>
                  </>
                )}
              </label>
            ) : null
          }
        />
        <p className="text-[12px] text-humana-subtle">
          {c.photosCounter(value.photos.length, MAX_SPACE_PHOTOS)} &middot; {c.photosHint}
        </p>
      </div>
    </div>
  );
}
