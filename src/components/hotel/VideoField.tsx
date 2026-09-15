"use client";

/**
 * Video / reel URL field and its preview, shared by the hotel onboarding
 * wizard (step 4), the settings "Property" tab and the public hotel detail.
 *
 * Only the player URL that `videoEmbed` builds from the parsed id ever reaches
 * an iframe — the raw string the owner typed is never embedded. A host the API
 * rejects (anything but YouTube, Vimeo or Instagram) shows the inline error
 * instead of a preview, so the form never sends a 422 on purpose.
 */

import { useLocale } from "@/i18n/LocaleProvider";
import { videoEmbed } from "@/lib/property-catalog";

export type VideoFieldVariant = "wizard" | "settings";

const INPUT_CLASS: Record<VideoFieldVariant, string> = {
  wizard:
    "w-full rounded-[6px] border border-humana-line bg-white px-4 py-3 text-[15px] text-humana-ink outline-none transition-all duration-200 placeholder:text-humana-subtle/50 focus:border-humana-gold focus:ring-1 focus:ring-humana-gold/20",
  settings:
    "w-full border border-humana-line bg-white px-3.5 py-2.5 text-[14px] text-humana-ink outline-none transition-colors placeholder:text-humana-subtle/50 focus:border-humana-gold",
};

/** Player embed (YouTube / Vimeo) or a card linking out to Instagram. */
export function VideoPreview({ url, title }: { url: string | null | undefined; title: string }) {
  const { t } = useLocale();
  const embed = videoEmbed(url);
  if (!embed) return null;

  if (embed.embedUrl) {
    return (
      <div className="relative w-full overflow-hidden rounded-[6px] bg-black" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={embed.embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <a
      href={url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-[6px] border border-humana-line bg-white px-4 py-3 text-[14px] text-humana-ink transition-colors hover:border-humana-gold"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold-light">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </span>
      <span className="font-medium">{t.visualInfo.videoWatchOnInstagram}</span>
    </a>
  );
}

export type VideoFieldProps = {
  value: string;
  onChange: (value: string) => void;
  /** Preview title — the property name. */
  title: string;
  variant?: VideoFieldVariant;
};

export function VideoField({ value, onChange, title, variant = "wizard" }: VideoFieldProps) {
  const { t } = useLocale();
  const v = t.visualInfo;
  const trimmed = value.trim();
  const invalid = trimmed.length > 0 && videoEmbed(trimmed) === null;

  return (
    <div className="flex flex-col gap-2">
      <input
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={v.videoPlaceholder}
        aria-invalid={invalid}
        className={`${INPUT_CLASS[variant]} ${invalid ? "border-red-400 focus:border-red-400" : ""}`}
      />
      {invalid ? (
        <p className="text-[12px] font-medium text-red-600">{v.videoInvalid}</p>
      ) : (
        <p className="text-[12px] text-humana-muted">{v.videoHint}</p>
      )}
      {!invalid && trimmed.length > 0 && (
        <div className="mt-2 max-w-[520px]">
          <VideoPreview url={trimmed} title={title} />
        </div>
      )}
    </div>
  );
}
