/** Hotel workspace — the property's common spaces (salons, yoga rooms,
 *  terraces…). Same list/edit contract as the onboarding step, but saving one
 *  space at a time straight to the API. */
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { apiErrorMessage } from "@/lib/api";
import { hotelApi, type CommonSpace } from "@/lib/api/hotel";
import { CommonSpaceForm } from "@/components/hotel/CommonSpaceForm";
import {
  draftToPayload,
  emptySpaceDraft,
  equipmentLabel,
  maxCapacity,
  spaceToDraft,
  spaceTypeLabel,
  validateDraft,
  type CommonSpaceDraft,
  type CommonSpaceErrors,
} from "@/lib/space-catalog";

export default function CommonSpacesPage() {
  const { t } = useLocale();
  const c = t.commonSpaces;

  const [spaces, setSpaces] = useState<CommonSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const [draft, setDraft] = useState<CommonSpaceDraft | null>(null);
  const [errors, setErrors] = useState<CommonSpaceErrors>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // The confirmation is a flash, not a state to dismiss
  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [justSaved]);

  const load = useCallback(async () => {
    try {
      const res = await hotelApi.listCommonSpaces();
      setSpaces(res.common_spaces);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setDraft(emptySpaceDraft());
    setErrors({});
    setSaveError(null);
  }

  function openEdit(space: CommonSpace) {
    setDraft(spaceToDraft(space));
    setErrors({});
    setSaveError(null);
  }

  async function handleSave() {
    if (!draft) return;
    const found = validateDraft(draft, c);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const payload = draftToPayload(draft);
      const saved = draft.id
        ? await hotelApi.updateCommonSpace(draft.id, payload)
        : await hotelApi.createCommonSpace(payload);
      // Replace the gallery, empty list included, so removals stick. Blob
      // previews that never finished uploading are skipped.
      await hotelApi.batchCommonSpaceImages(
        saved.common_space.id,
        draft.photos.filter((url) => url.startsWith("http")).map((url) => ({ image_url: url })),
      );
      await load();
      setDraft(null);
      setJustSaved(true);
    } catch (err) {
      setSaveError(apiErrorMessage(err, c.saveFailed));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await hotelApi.deleteCommonSpace(id);
      setSpaces((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.hotelWs.nav.spaces}
          </p>
          <h1 className="mt-2 text-[32px] font-bold text-humana-ink">{c.title}</h1>
          <p className="mt-1 text-[14px] text-humana-muted">{c.subtitle}</p>
        </div>
        {justSaved && (
          <span className="ml-auto mr-6 flex items-center gap-2 text-[13px] font-medium text-emerald-600 animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {c.saved}
          </span>
        )}
        <button
          type="button"
          onClick={openAdd}
          className="cursor-pointer bg-humana-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-85"
        >
          + {c.add}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{c.loadFailed}</p>
        </div>
      ) : spaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-humana-line bg-white py-24 text-center">
          <p className="text-[18px] font-medium text-humana-ink">{c.empty}</p>
          <p className="mt-2 max-w-md text-[14px] text-humana-muted">{c.subtitle}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 stagger-children">
          {spaces.map((space) => {
            const typeLabel = spaceTypeLabel(c, space.space_type, space.space_type_other);
            const capacity = maxCapacity(space);
            return (
              <article
                key={space.id}
                className="flex overflow-hidden rounded-xl border border-humana-line bg-white card-hover"
              >
                <div className="relative w-[200px] shrink-0 bg-humana-stone">
                  {space.image_url ? (
                    <Image src={space.image_url} alt={space.name} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c9c4b4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between px-7 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-[18px] font-semibold text-humana-ink">{space.name}</h2>
                      {typeLabel && (
                        <p className="mt-0.5 text-[13px] text-humana-muted">{typeLabel}</p>
                      )}
                    </div>
                    {space.exclusive_for_groups && (
                      <span className="shrink-0 rounded-full border border-humana-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-humana-gold">
                        {c.exclusiveHint}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-10">
                    {capacity != null && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                          {c.capacitiesTitle}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-humana-ink">
                          {c.maxCapacity(capacity)}
                        </p>
                      </div>
                    )}
                    {space.area_sqm != null && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                          {c.area}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-humana-ink">
                          {space.area_sqm} m&sup2;
                        </p>
                      </div>
                    )}
                    {space.equipment.length > 0 && (
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-humana-subtle">
                          {c.equipmentTitle}
                        </p>
                        <p className="mt-1 truncate text-[14px] font-medium text-humana-ink">
                          {space.equipment.map((id) => equipmentLabel(c, id)).join(" · ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-6 border-t border-humana-line pt-4">
                    <button
                      type="button"
                      onClick={() => openEdit(space)}
                      className="cursor-pointer text-[13px] font-medium text-humana-gold transition-opacity hover:opacity-75"
                    >
                      {c.edit}
                    </button>
                    {pendingDelete === space.id ? (
                      <span className="ml-auto flex items-center gap-3 text-[13px]">
                        <span className="text-humana-muted">{c.confirmRemove}</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(space.id)}
                          className="cursor-pointer font-medium text-red-600 hover:opacity-75"
                        >
                          {c.remove}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(null)}
                          className="cursor-pointer text-humana-muted hover:text-humana-ink"
                        >
                          {c.cancel}
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(space.id)}
                        className="ml-auto cursor-pointer text-[13px] text-humana-muted transition-colors hover:text-red-600"
                      >
                        {c.remove}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Editor panel */}
      {draft && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-8 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[860px] rounded-xl bg-white p-8 shadow-2xl animate-fade-in-scale">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[22px] font-medium text-humana-ink">
                {draft.id ? c.edit : c.add}
              </h2>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label={c.cancel}
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full text-humana-subtle transition-colors hover:bg-humana-stone hover:text-humana-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <CommonSpaceForm
              value={draft}
              onChange={setDraft}
              variant="settings"
              errors={errors}
              onUploadingChange={setUploading}
            />

            {saveError && (
              <div className="mt-6 rounded-[6px] bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                {saveError}
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3 border-t border-humana-line pt-6">
              <button
                type="button"
                onClick={() => setDraft(null)}
                disabled={saving}
                className="cursor-pointer rounded-[6px] border border-humana-line px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-muted transition-all hover:border-humana-ink hover:text-humana-ink disabled:opacity-40"
              >
                {c.cancel}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="cursor-pointer flex items-center gap-2 rounded-[6px] bg-humana-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {c.saving}
                  </>
                ) : (
                  c.save
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
