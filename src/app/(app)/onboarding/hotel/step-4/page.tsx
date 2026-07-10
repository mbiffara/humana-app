"use client";

import { useState } from "react";
import Image from "next/image";
import { useHotelWizard } from "@/contexts/HotelWizardContext";
import { useLocale } from "@/i18n/LocaleProvider";
import { createPreviewUrl, uploadImage } from "@/lib/upload";

export default function HotelWizardStep4() {
  const { state, addPhoto, removePhoto, reorderPhotos, swapPhotoUrl, isUploading, setIsUploading } = useHotelWizard();
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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

  // Photo reorder drag
  function handlePhotoReorderStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handlePhotoReorderOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handlePhotoReorderDrop(targetIndex: number) {
    if (dragIndex !== null && dragIndex !== targetIndex) {
      reorderPhotos(dragIndex, targetIndex);
    }
    setDragIndex(null);
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

        {/* Photo grid */}
        {state.photos.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {state.photos.map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  draggable
                  onDragStart={(e) => handlePhotoReorderStart(e, index)}
                  onDragOver={handlePhotoReorderOver}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handlePhotoReorderDrop(index); }}
                  className={`group relative aspect-square cursor-grab overflow-hidden rounded-[6px] bg-humana-stone transition-all duration-200 hover:shadow-md active:cursor-grabbing ${
                    dragIndex === index ? "opacity-50 scale-95" : ""
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`Property photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Cover badge */}
                  {index === 0 && (
                    <div className="absolute left-2 top-2 rounded bg-humana-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                      {h.coverBadge}
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                    className="cursor-pointer absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Drag handle overlay */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/30 to-transparent py-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
                      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
                      <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

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
