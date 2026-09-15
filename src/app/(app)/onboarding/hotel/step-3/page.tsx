/** Step 3 — Common spaces. The salons, yoga rooms and terraces groups can
 *  use. Entirely optional: the step can be completed with an empty list. */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { CommonSpaceForm } from "@/components/hotel/CommonSpaceForm";
import {
  draftMaxCapacity,
  emptySpaceDraft,
  MAX_SPACE_PHOTOS,
  spaceTypeLabel,
  validateDraft,
  type CommonSpaceDraft,
  type CommonSpaceErrors,
} from "@/lib/space-catalog";

function SpaceCard({
  space,
  onEdit,
  onRemove,
}: {
  space: CommonSpaceDraft;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { t } = useLocale();
  const c = t.commonSpaces;
  const [confirming, setConfirming] = useState(false);
  const typeLabel = spaceTypeLabel(c, space.spaceType, space.spaceTypeOther);
  const capacity = draftMaxCapacity(space);

  return (
    <div className="group flex items-center justify-between rounded-[6px] border border-humana-line bg-white p-5 transition-all duration-200 hover:border-humana-gold/30 hover:shadow-sm">
      <div className="flex gap-4">
        {space.photos.length > 0 ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[4px] bg-humana-stone">
            <Image src={space.photos[0]} alt={space.name} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[4px] bg-humana-stone text-humana-subtle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-[16px] font-medium text-humana-ink">{space.name}</span>
          <div className="flex items-center gap-4">
            {typeLabel && <span className="text-[13px] text-humana-muted">{typeLabel}</span>}
            {capacity != null && (
              <span className="text-[12px] text-humana-subtle">{c.maxCapacity(capacity)}</span>
            )}
          </div>
          {space.photos.length > 0 && (
            <span className="text-[12px] text-humana-subtle">
              {c.photosCounter(space.photos.length, MAX_SPACE_PHOTOS)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {confirming ? (
          <span className="flex items-center gap-3 text-[13px]">
            <span className="text-humana-muted">{c.confirmRemove}</span>
            <button
              type="button"
              onClick={onRemove}
              className="cursor-pointer font-medium text-red-600 hover:opacity-75"
            >
              {c.remove}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="cursor-pointer text-humana-muted hover:text-humana-ink"
            >
              {c.cancel}
            </button>
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="cursor-pointer rounded border border-humana-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors hover:border-humana-ink"
            >
              {c.edit}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded text-humana-subtle transition-colors hover:text-red-500"
              aria-label={c.remove}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function HotelWizardStep3() {
  const { state, addCommonSpace, updateCommonSpace, removeCommonSpace, setHideBottomBar } =
    useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const c = t.commonSpaces;

  const [draft, setDraft] = useState<CommonSpaceDraft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<CommonSpaceErrors>({});
  const [uploading, setUploading] = useState(false);

  // The form has its own bottom bar; the wizard's would sit on top of it.
  useEffect(() => {
    setHideBottomBar(draft !== null);
    return () => setHideBottomBar(false);
  }, [draft, setHideBottomBar]);

  function startAdd() {
    setDraft(emptySpaceDraft());
    setIsNew(true);
    setErrors({});
    setUploading(false);
  }

  function startEdit(space: CommonSpaceDraft) {
    setDraft({ ...space });
    setIsNew(false);
    setErrors({});
    setUploading(false);
  }

  /** Leaving unmounts the form, so a batch still in flight will never report
   *  back — clear the flag here or it stays raised for the next space. */
  function closeForm() {
    setDraft(null);
    setUploading(false);
  }

  function handleSave() {
    if (!draft) return;
    const found = validateDraft(draft, c);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    if (isNew) addCommonSpace(draft);
    else updateCommonSpace(draft.localId, draft);
    closeForm();
  }

  /* ─── Form view ─── */
  if (draft) {
    return (
      <>
        <div className="flex justify-center px-16 pt-16 pb-32 animate-fade-in-up">
          <div className="w-full max-w-[700px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {h.step3Eyebrow} &middot; {isNew ? c.add : c.edit}
            </span>
            <h2 className="mt-3 mb-8 text-[28px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
              {c.title}
            </h2>
            <CommonSpaceForm
              value={draft}
              onChange={setDraft}
              errors={errors}
              onUploadingChange={setUploading}
            />
          </div>
        </div>

        {/* Fixed bar — outside the animated block so it is not a containing block */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-humana-line bg-white px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            <button
              type="button"
              onClick={closeForm}
              className="cursor-pointer flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-muted transition-colors hover:text-humana-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {c.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={uploading}
              className="cursor-pointer flex items-center gap-2 whitespace-nowrap bg-humana-ink px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {c.save}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ─── List view ─── */
  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[700px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step3Eyebrow}
        </span>
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.step3Title}
        </h1>
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">{h.step3Subtitle}</p>

        {state.commonSpaces.length > 0 && (
          <div className="mt-8 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[13px] font-medium text-humana-ink">
              {h.spaceConfigured(state.commonSpaces.length)}
            </span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 stagger-children">
          {state.commonSpaces.map((space) => (
            <SpaceCard
              key={space.localId}
              space={space}
              onEdit={() => startEdit(space)}
              onRemove={() => removeCommonSpace(space.localId)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={startAdd}
          className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-humana-gold/40 bg-transparent py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-humana-gold transition-all duration-200 hover:border-humana-gold hover:bg-humana-gold-light/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {c.add}
        </button>

        {state.commonSpaces.length === 0 && (
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-humana-line/60 bg-white p-5 animate-fade-in-up-delay-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-humana-ink">{c.empty}</span>
              <span className="text-[12px] leading-relaxed text-humana-muted">{c.skipHint}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
