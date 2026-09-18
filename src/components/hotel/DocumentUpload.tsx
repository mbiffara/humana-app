"use client";

/**
 * Single-document picker for the verification block. The document only counts
 * once the server holds it, so unlike the image uploads there is no local
 * preview fallback — a rejected file and a failed upload say different things
 * and the rest of the form is left untouched either way.
 */

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { DocumentUploadError, uploadDocument } from "@/lib/upload";

export type DocumentUploadProps = {
  /** Stored document URL, or "" when none was uploaded. */
  value: string;
  onChange: (url: string) => void;
  /** Error owned by the parent (e.g. a 422 on the field). */
  error?: string;
};

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

/** The file name the URL ends with, falling back to the whole URL. */
export function documentFileName(url: string): string {
  try {
    const path = new URL(url, "https://humana.invalid").pathname;
    return decodeURIComponent(path.split("/").filter(Boolean).pop() ?? url);
  } catch {
    return url;
  }
}

export function DocumentUpload({ value, onChange, error }: DocumentUploadProps) {
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadDocument(file);
      onChange(url);
    } catch (err) {
      setUploadError(
        err instanceof DocumentUploadError && err.kind === "type"
          ? h.documentTypeError
          : err instanceof DocumentUploadError && err.kind === "size"
            ? h.documentSizeError
            : h.documentUploadError,
      );
    } finally {
      setUploading(false);
    }
  }

  const shownError = uploadError ?? error;

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[6px] border border-humana-line bg-white px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-[14px] text-humana-ink underline underline-offset-2 transition-colors hover:text-humana-gold"
          >
            {documentFileName(value)}
          </a>
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              onChange("");
            }}
            className="cursor-pointer shrink-0 text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-muted transition-colors hover:text-humana-ink"
          >
            {h.removeDocument}
          </button>
        </div>
      ) : (
        <label
          className={`flex w-fit items-center gap-2 rounded-[6px] border border-humana-line bg-white px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-humana-ink transition-colors ${
            uploading ? "cursor-wait opacity-60" : "cursor-pointer hover:border-humana-gold"
          }`}
        >
          {uploading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          {h.uploadDocument}
          <input
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
      )}
      {shownError && <p className="text-[12px] text-red-600">{shownError}</p>}
    </div>
  );
}
