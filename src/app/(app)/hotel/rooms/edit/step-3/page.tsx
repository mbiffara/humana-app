/** Room type editor step 3 — photos (HT-03c). Blob previews appear
 *  instantly, uploads run in the background with visible failure/retry,
 *  first photo is the cover. Max 8. */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRoomTypeEditor } from "@/contexts/RoomTypeEditorContext";
import { createPreviewUrl, uploadImage } from "@/lib/upload";

const MAX_IMAGES = 8;

export default function RoomPhotosStep() {
  const { t } = useLocale();
  const te = t.hotelWs.roomEditor;
  const { state, set, swapPhotoUrl, markUploadFailed, clearUploadFailed, setIsUploading } =
    useRoomTypeEditor();
  const [dragOver, setDragOver] = useState(false);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);

  function handleFiles(files: FileList | File[]) {
    const room = MAX_IMAGES - state.photos.length;
    const selected = Array.from(files).slice(0, Math.max(room, 0));
    if (!selected.length) return;

    const previews: { file: File; url: string }[] = [];
    for (const file of selected) {
      try {
        previews.push({ file, url: createPreviewUrl(file) });
      } catch {
        // invalid type/size — skip silently, the hint states the limits
      }
    }
    if (!previews.length) return;

    set({ photos: [...state.photos, ...previews.map((p) => p.url)] });

    setIsUploading(true);
    Promise.allSettled(
      previews.map(async ({ file, url }) => {
        const serverUrl = await uploadImage(file);
        if (serverUrl.startsWith("blob:")) {
          markUploadFailed(url);
        } else {
          swapPhotoUrl(url, serverUrl);
        }
      }),
    ).finally(() => setIsUploading(false));
  }

  async function retryUpload(url: string) {
    setIsUploading(true);
    try {
      const blob = await fetch(url).then((res) => res.blob());
      const file = new File([blob], "room-image", { type: blob.type || "image/jpeg" });
      const serverUrl = await uploadImage(file);
      if (!serverUrl.startsWith("blob:")) swapPhotoUrl(url, serverUrl);
    } catch {
      /* still failed — the tile keeps its retry state */
    } finally {
      setIsUploading(false);
    }
  }

  function removePhoto(index: number) {
    clearUploadFailed(state.photos[index]);
    set({ photos: state.photos.filter((_, i) => i !== index) });
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const photos = [...state.photos];
    const [moved] = photos.splice(from, 1);
    photos.splice(to, 0, moved);
    set({ photos });
  }

  return (
    <section className="rounded-xl border border-humana-line bg-white p-8 animate-fade-in-up">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
        {te.stepOf(3, 5)}
      </p>
      <h2 className="mt-2 text-[24px] font-bold text-humana-ink">{te.photos.title}</h2>
      <p className="mt-1 text-[13px] text-humana-muted">{te.photos.subtitle}</p>

      <label
        htmlFor="room-photos-input"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors ${
          dragOver
            ? "border-humana-gold bg-humana-gold-light/30"
            : "border-humana-line bg-humana-stone/30 hover:border-humana-gold/60"
        }`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b5a642" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-3 text-[15px] font-medium text-humana-ink">{te.photos.dropHint}</p>
        <p className="mt-1 text-[13px] text-humana-muted">{te.photos.browse}</p>
        <p className="mt-2 text-[11px] text-humana-subtle">{te.photos.formats}</p>
      </label>
      <input
        id="room-photos-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {state.photos.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-muted">
              {te.photos.count(state.photos.length, MAX_IMAGES)}
            </p>
            <p className="text-[12px] text-humana-subtle">{te.photos.reorderHint}</p>
          </div>
          {state.failedUploads.length > 0 && (
            <p className="mt-2 text-[12px] font-medium text-red-600">{te.photos.uploadFailedHint}</p>
          )}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {state.photos.map((url, i) => {
              const failed = state.failedUploads.includes(url);
              return (
                <div
                  key={`${url}-${i}`}
                  draggable
                  onDragStart={() => {
                    dragIdx.current = i;
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropTarget(i);
                  }}
                  onDragLeave={() => setDropTarget(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIdx.current !== null) reorder(dragIdx.current, i);
                    dragIdx.current = null;
                    setDropTarget(null);
                  }}
                  className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-lg border transition-all ${
                    failed
                      ? "border-red-400 ring-2 ring-red-200"
                      : dropTarget === i
                        ? "border-humana-gold ring-2 ring-humana-gold/40"
                        : "border-humana-line"
                  }`}
                >
                  <Image src={url} alt="" fill unoptimized className="object-cover" />
                  {failed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                        {te.photos.uploadFailed}
                      </span>
                      <button
                        onClick={() => retryUpload(url)}
                        className="cursor-pointer rounded bg-white px-2.5 py-1 text-[11px] font-semibold text-humana-ink transition-opacity hover:opacity-85"
                      >
                        {te.photos.retry}
                      </button>
                    </div>
                  ) : (
                    i === 0 && (
                      <span className="absolute left-2 top-2 bg-humana-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                        {te.photos.cover}
                      </span>
                    )
                  )}
                  <button
                    onClick={() => removePhoto(i)}
                    className={`absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-[11px] text-white transition-opacity hover:bg-red-600 ${
                      failed ? "" : "opacity-0 group-hover:opacity-100"
                    }`}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
