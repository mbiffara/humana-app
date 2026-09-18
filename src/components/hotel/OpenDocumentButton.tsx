"use client";

/**
 * Opens a private document. The stored URL is not readable on its own, so the
 * click exchanges it for a signed link that lives ten minutes and opens that
 * in a new tab. Shared by the hotel's own verification form and the admin
 * preview, which both hold the same kind of URL.
 */

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { apiErrorMessage } from "@/lib/api";
import { documentsApi } from "@/lib/api/documents";

export type OpenDocumentButtonProps = {
  /** The stored `ownership_document_url`. */
  url: string;
  className?: string;
};

export function OpenDocumentButton({ url, className }: OpenDocumentButtonProps) {
  const { t } = useLocale();
  const h = t.onboarding.hotel;
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    // Safari only lets a click open a tab synchronously, so the tab is claimed
    // here and pointed at the signed link once it arrives. The destination is
    // the API's own origin (it redirects to storage), so no noopener.
    const tab = window.open("about:blank", "_blank");
    if (!tab) {
      setError(h.documentLinkError);
      return;
    }
    setOpening(true);
    setError(null);
    try {
      const res = await documentsApi.link(url);
      tab.location.href = res.url;
    } catch (err) {
      tab.close();
      setError(apiErrorMessage(err, h.documentLinkError));
    } finally {
      setOpening(false);
    }
  }

  return (
    <span className="flex shrink-0 flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={handleOpen}
        disabled={opening}
        className={
          className ??
          "cursor-pointer text-[12px] font-semibold uppercase tracking-[0.18em] text-humana-gold transition-opacity hover:opacity-70 disabled:cursor-wait disabled:opacity-60"
        }
      >
        {opening ? h.openingDocument : h.viewDocument}
      </button>
      {error && <span className="text-[12px] font-normal normal-case text-red-600">{error}</span>}
    </span>
  );
}
