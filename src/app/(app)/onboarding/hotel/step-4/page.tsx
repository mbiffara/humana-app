"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useHotelWizard } from "@/contexts/HotelWizardContext";

/* ─── Placeholder photo URLs for demo ─── */
const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
];

export default function HotelWizardStep4() {
  const { state, addPhoto, removePhoto } = useHotelWizard();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Simulated file upload -- adds a demo photo URL
  function handleBrowse() {
    // In a real implementation, this would open a file picker.
    // For demo, we cycle through placeholder URLs.
    const nextIndex = state.photos.length % DEMO_PHOTOS.length;
    addPhoto(DEMO_PHOTOS[nextIndex]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    // For demo, add a placeholder photo on drop
    const nextIndex = state.photos.length % DEMO_PHOTOS.length;
    addPhoto(DEMO_PHOTOS[nextIndex]);
  }

  // Photo reorder drag
  function handlePhotoReorderStart(index: number) {
    setDragIndex(index);
  }

  function handlePhotoReorderOver(e: React.DragEvent, _index: number) {
    e.preventDefault();
  }

  function handlePhotoReorderDrop(_targetIndex: number) {
    // Simplified reorder - in production, use a proper DnD library
    setDragIndex(null);
  }

  const RECOMMENDED = 10;

  return (
    <div className="flex justify-center px-16 py-16 animate-fade-in-up">
      <div className="w-full max-w-[640px]">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
          Step 4 of 4 &middot; Property Photos
        </span>

        {/* Title */}
        <h1 className="mt-3 text-[32px] font-light leading-[1.2] tracking-[-0.02em] text-humana-ink">
          Show your property at its best.
        </h1>

        {/* Subtitle */}
        <p className="mt-2 max-w-[520px] text-[15px] leading-[22px] text-humana-muted">
          Upload at least five photos that represent the space as guests will
          experience it. Drag to reorder.
        </p>

        {/* Upload zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowse}
          className={`upload-zone mt-10 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg py-14 transition-all ${
            isDragOver ? "upload-zone-active" : ""
          }`}
        >
          {/* Upload icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-humana-gold-light">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[14px] font-medium text-humana-ink">
              Drag images here or{" "}
              <span className="text-humana-gold underline underline-offset-2">
                browse files
              </span>
            </span>
            <span className="text-[12px] text-humana-subtle">
              JPG or PNG &middot; up to 8 MB each &middot; Minimum 1600 &times; 1067 px
            </span>
          </div>

          {/* Hidden file input for future real implementation */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={() => {
              // Placeholder -- would handle real file uploads
              handleBrowse();
            }}
          />
        </div>

        {/* Photo grid */}
        {state.photos.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-4 gap-3 stagger-children">
              {state.photos.map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  draggable
                  onDragStart={() => handlePhotoReorderStart(index)}
                  onDragOver={(e) => handlePhotoReorderOver(e, index)}
                  onDrop={() => handlePhotoReorderDrop(index)}
                  className={`group relative aspect-square cursor-grab overflow-hidden bg-humana-stone transition-all duration-200 hover:shadow-md active:cursor-grabbing ${
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
                      Cover
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="cursor-pointer absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Drag handle overlay */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/30 to-transparent py-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <circle cx="9" cy="6" r="1" />
                      <circle cx="15" cy="6" r="1" />
                      <circle cx="9" cy="12" r="1" />
                      <circle cx="15" cy="12" r="1" />
                      <circle cx="9" cy="18" r="1" />
                      <circle cx="15" cy="18" r="1" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Counter + upload more */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-[13px] text-humana-muted">
                {state.photos.length} of a recommended {RECOMMENDED} photos
                {state.photos.length > 1 && (
                  <span className="text-humana-subtle">
                    {" "}&middot; Drag tiles to reorder
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={handleBrowse}
                className="cursor-pointer flex items-center gap-1.5 text-[13px] font-medium text-humana-gold transition-colors hover:text-humana-ink"
              >
                Upload more
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tip card */}
        {state.photos.length < 5 && (
          <div className="mt-10 flex items-center gap-3 rounded-lg border border-humana-line/60 bg-white p-5 animate-fade-in-up-delay-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-humana-ink">
                Photo tips
              </span>
              <span className="text-[12px] leading-relaxed text-humana-muted">
                Properties with 8+ high-quality photos receive 40% more inquiries.
                Include rooms, common areas, views, and dining spaces.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
