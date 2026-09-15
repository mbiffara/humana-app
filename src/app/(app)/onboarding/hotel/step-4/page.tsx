"use client";

import { useState } from "react";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { LogoUpload } from "@/components/hotel/LogoUpload";
import { PhotoGrid } from "@/components/hotel/PhotoGrid";
import { VideoField } from "@/components/hotel/VideoField";
import { createPreviewUrl, uploadImage } from "@/lib/upload";

export default function HotelWizardStep4() {
  const {
    state,
    set,
    addPhoto,
    removePhoto,
    reorderPhotos,
    swapPhotoUrl,
    setPhotoCategory,
    setPhotoCover,
    markVideoTouched,
    isUploading,
    setIsUploading,
  } = useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const v = t.visualInfo;
  const [isDragOver, setIsDragOver] = useState(false);
  // The logo has its own flag: a slow logo upload must not look like (or gate)
  // the gallery upload, which is what `isUploading` tracks.
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Track blob URL → file pairs for upload
    const entries: { blobUrl: string; file: File }[] = [];

    // Immediately show previews
    for (const file of fileArray) {
      try {
        const previewUrl = createPreviewUrl(file);
        addPhoto(previewUrl);
        entries.push({ blobUrl: previewUrl, file });
      } catch {
        // skip invalid files
      }
    }

    if (entries.length === 0) return;

    // Upload in background and swap blob URLs with server URLs
    setIsUploading(true);
    Promise.allSettled(
      entries.map(async ({ blobUrl, file }) => {
        const serverUrl = await uploadImage(file);
        if (serverUrl.startsWith("http")) {
          swapPhotoUrl(blobUrl, serverUrl);
        }
      })
    ).finally(() => setIsUploading(false));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }

  /** The logo travels with the step save, so only a real server URL is kept —
   *  a failed upload falls back to a blob URL the API could not resolve. */
  async function handleLogoFile(file: File) {
    setIsUploadingLogo(true);
    try {
      const url = await uploadImage(file);
      if (url.startsWith("http")) set({ logoUrl: url });
    } finally {
      setIsUploadingLogo(false);
    }
  }

  const RECOMMENDED = 10;
  const inputId = "step4-photo-upload";

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[700px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          {h.step4Eyebrow}
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          {h.step4Title}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-[15px] leading-[22px] text-humana-muted">
          {h.step4Subtitle}
        </p>

        {/* Hidden file input */}
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

        {/* Upload zone — uses label to natively trigger file input */}
        <label
          htmlFor={inputId}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
          onDrop={handleDrop}
          className={`upload-zone mt-10 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg py-14 transition-all ${
            isDragOver ? "upload-zone-active" : ""
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-gold border-t-transparent" />
              <span className="text-[13px] text-humana-muted">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-humana-gold-light">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[14px] font-medium text-humana-ink">
                  {h.uploadDrag}{" "}
                  <span className="text-humana-gold underline underline-offset-2">{h.uploadBrowse}</span>
                </span>
                <span className="text-[12px] text-humana-subtle">{h.uploadFormats}</span>
              </div>
            </>
          )}
        </label>

        {/* Photo grid — drag to reorder, categorise, promote to cover */}
        {state.photos.length > 0 && (
          <div className="mt-8">
            <PhotoGrid
              photos={state.photos}
              alt={state.hotelName}
              onReorder={reorderPhotos}
              onRemove={removePhoto}
              onCategoryChange={setPhotoCategory}
              onSetCover={setPhotoCover}
              variant="wizard"
            />

            {/* Counter + upload more */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-[13px] text-humana-muted">
                {h.photoCount(state.photos.length, RECOMMENDED)}
                {state.photos.length > 1 && (
                  <span className="text-humana-subtle"> &middot; {h.dragToReorder}</span>
                )}
              </span>
              <label
                htmlFor={inputId}
                className="cursor-pointer flex items-center gap-1.5 text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
              >
                {h.uploadMore}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </label>
            </div>
          </div>
        )}

        {/* Hotel logo */}
        <div className="mt-10 border-t border-humana-line pt-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {v.logoTitle}
          </span>
          <div className="mt-4 flex items-center gap-4">
            <LogoUpload
              logoUrl={state.logoUrl || null}
              name={state.hotelName}
              uploading={isUploadingLogo}
              onFile={handleLogoFile}
            />
            <p className="max-w-[420px] text-[12px] leading-relaxed text-humana-muted">
              {v.logoHint}
            </p>
          </div>
        </div>

        {/* Video or reel */}
        <div className="mt-10 border-t border-humana-line pt-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
            {v.videoTitle}
          </span>
          <div className="mt-4">
            <VideoField
              value={state.videoUrl}
              onChange={(value) => {
                markVideoTouched();
                set({ videoUrl: value });
              }}
              title={state.hotelName}
              variant="wizard"
            />
          </div>
        </div>

        {/* Tip card */}
        {state.photos.length < 5 && (
          <div className="mt-10 flex items-center gap-3 rounded-lg border border-humana-line/60 bg-white p-5 animate-fade-in-up-delay-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-humana-ink">{h.photoTipsTitle}</span>
              <span className="text-[12px] leading-relaxed text-humana-muted">{h.photoTipsDescription}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
