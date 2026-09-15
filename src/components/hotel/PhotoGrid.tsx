"use client";

/**
 * Property gallery grid shared by the hotel onboarding wizard (step 4) and the
 * hotel settings "Property" tab: drag to reorder, pick a category per photo,
 * promote any photo to cover and remove it.
 *
 * The first photo is the cover — "Set as cover" moves the photo to the front
 * rather than flagging it, which is what the batch endpoint expects (the first
 * entry with `is_cover` wins). Every component is defined at module level:
 * declaring them inside a render would remount the tiles on each keystroke.
 */

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  IMAGE_CATEGORIES,
  type ImageCategory,
  type PhotoEntry,
} from "@/lib/property-catalog";

export type PhotoGridVariant = "wizard" | "settings";

const TILE_CLASS: Record<PhotoGridVariant, string> = {
  wizard: "aspect-square",
  settings: "aspect-[4/3]",
};

const GRID_CLASS: Record<PhotoGridVariant, string> = {
  wizard: "grid grid-cols-4 gap-3",
  settings: "grid grid-cols-4 gap-3",
};

export type PhotoGridProps = {
  photos: PhotoEntry[];
  /** Alt text prefix — the property name. */
  alt: string;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  onCategoryChange: (index: number, category: ImageCategory) => void;
  onSetCover: (index: number) => void;
  variant?: PhotoGridVariant;
  /** Extra cell rendered after the photos (the settings "add photos" tile). */
  addSlot?: React.ReactNode;
  /** Galleries without categories (a common space) hide the per-tile select. */
  showCategory?: boolean;
};

export function PhotoGrid({
  photos,
  alt,
  onReorder,
  onRemove,
  onCategoryChange,
  onSetCover,
  variant = "wizard",
  addSlot,
  showCategory = true,
}: PhotoGridProps) {
  const { t } = useLocale();
  const v = t.visualInfo;
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(targetIndex: number) {
    if (dragIndex !== null && dragIndex !== targetIndex) {
      onReorder(dragIndex, targetIndex);
    }
    setDragIndex(null);
  }

  return (
    <div className={GRID_CLASS[variant]}>
      {photos.map((photo, index) => (
        <div key={`${photo.url}-${index}`} className="flex flex-col gap-1.5">
          <div
            draggable
            onDragStart={(e) => {
              setDragIndex(index);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(index);
            }}
            className={`group relative ${TILE_CLASS[variant]} cursor-grab overflow-hidden rounded-[6px] bg-humana-stone transition-all duration-200 hover:shadow-md active:cursor-grabbing ${
              dragIndex === index ? "scale-95 opacity-50" : ""
            }`}
          >
            <Image
              src={photo.url}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />

            {index === 0 && (
              <span className="absolute left-2 top-2 rounded bg-humana-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                {v.cover}
              </span>
            )}

            <button
              type="button"
              aria-label={v.removePhoto}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {index > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetCover(index);
                }}
                className="absolute inset-x-0 bottom-0 cursor-pointer bg-black/55 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                {v.setAsCover}
              </button>
            )}
          </div>

          {showCategory && (
            <>
              <label className="sr-only" htmlFor={`photo-category-${index}`}>
                {v.categoryLabel}
              </label>
              <select
                id={`photo-category-${index}`}
                value={photo.category}
                onChange={(e) => onCategoryChange(index, e.target.value as ImageCategory)}
                className="w-full cursor-pointer rounded-[6px] border border-humana-line bg-white px-2 py-1.5 text-[12px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
              >
                {IMAGE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {v.categories[category]}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      ))}
      {addSlot}
    </div>
  );
}
