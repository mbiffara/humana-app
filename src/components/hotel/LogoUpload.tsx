"use client";

/**
 * Hotel logo picker, shared by the settings "Profile" tab (where it saves on
 * the spot) and the onboarding wizard (where it travels with the step save).
 * The caller owns the upload so each screen keeps its own persistence rules.
 */

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";

export type LogoUploadProps = {
  logoUrl: string | null;
  /** Property name — used for the alt text and the initials placeholder. */
  name: string;
  uploading: boolean;
  onFile: (file: File) => void;
  /** Square side in pixels. */
  size?: number;
};

function initialsFor(name: string): string {
  const letters = name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return letters || "H";
}

export function LogoUpload({ logoUrl, name, uploading, onFile, size = 64 }: LogoUploadProps) {
  const { t } = useLocale();

  return (
    <label
      aria-label={t.visualInfo.logoUpload}
      style={{ width: size, height: size }}
      className={`group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-humana-gold transition-all ${
        uploading ? "cursor-wait" : "cursor-pointer hover:opacity-90"
      }`}
    >
      {logoUrl ? (
        <Image src={logoUrl} alt={name} fill className="object-cover" unoptimized />
      ) : (
        <span className="text-[20px] font-semibold text-white">{initialsFor(name)}</span>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        {uploading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}
