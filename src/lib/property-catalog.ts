/**
 * Property catalog shared by the hotel onboarding wizard, the hotel settings
 * form and the public/admin hotel views.
 *
 * The keys below are the values the API stores and returns (snake_case, exactly
 * as in the JSON contract). Human labels live in the dictionary under
 * `propertyForm` so every screen renders them in the active locale.
 */

export const PROPERTY_TYPES = [
  "hotel",
  "resort",
  "retreat_center",
  "eco_lodge",
  "boutique_hotel",
  "villa",
  "hacienda",
  "other",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const ENVIRONMENTS = [
  "countryside",
  "beach",
  "jungle",
  "urban",
  "mountain",
  "hills",
  "island",
] as const;

export type Environment = (typeof ENVIRONMENTS)[number];

export const AIRPORT_TRANSFERS = ["none", "included", "paid"] as const;

export type AirportTransfer = (typeof AIRPORT_TRANSFERS)[number];

/** Sentinel stored in `check_in_time` / `check_out_time` instead of "HH:MM". */
export const FLEXIBLE_TIME = "flexible";

/** Max length accepted by the API for the free-text pet policy notes. */
export const PET_NOTES_MAX = 200;

/**
 * Property fields shared by every hotel serializer (hotel workspace, public
 * agency view and admin preview). Kept in one place so the four type lists
 * cannot drift apart.
 */
export interface PropertyProfileFields {
  state_region: string | null;
  instagram: string | null;
  nearest_airport: string | null;
  airport_distance_km: number | null;
  airport_time_min: number | null;
  airport_transfer: AirportTransfer | null;
  airport_transfer_notes: string | null;
  distance_to_center_km: number | null;
  property_type: PropertyType | null;
  property_type_other: string | null;
  environments: Environment[];
  pet_friendly: boolean | null;
  pet_dogs: boolean | null;
  pet_cats: boolean | null;
  pet_size_restriction: boolean | null;
  pet_extra_cost: boolean | null;
  pet_common_areas: boolean | null;
  pet_specific_rooms: boolean | null;
  pet_size_restriction_notes: string | null;
  pet_extra_cost_notes: string | null;
  group_min_guests: number | null;
  group_max_guests: number | null;
}

export function isPropertyType(value: unknown): value is PropertyType {
  return typeof value === "string" && (PROPERTY_TYPES as readonly string[]).includes(value);
}

export function isEnvironment(value: unknown): value is Environment {
  return typeof value === "string" && (ENVIRONMENTS as readonly string[]).includes(value);
}

export function isAirportTransfer(value: unknown): value is AirportTransfer {
  return typeof value === "string" && (AIRPORT_TRANSFERS as readonly string[]).includes(value);
}

/** Keeps only the values the contract allows; tolerates null/legacy payloads. */
export function sanitizeEnvironments(value: unknown): Environment[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isEnvironment);
}

/** Google Maps link for a pair of coordinates, or null when either is missing. */
export function googleMapsUrl(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): string | null {
  if (latitude == null || longitude == null) return null;
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

/** Accepts a full URL or a bare handle (with or without "@"). */
export function instagramUrl(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, "").replace(/^instagram\.com\//i, "").replace(/\/+$/, "");
  if (!handle) return null;
  return `https://instagram.com/${handle}`;
}

/* ─── Form <-> payload helpers ───
 * Numeric fields are held as strings while editing (so a half-typed "12." is
 * not destroyed) and converted at the payload boundary. */

export function textOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Parses a decimal field, rounding to `decimals` places. Invalid input → null. */
export function decimalOrNull(value: string, decimals = 1): number | null {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  const factor = 10 ** decimals;
  return Math.round(parsed * factor) / factor;
}

/** Parses an integer field. Invalid input → null. */
export function integerOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed);
}

/** Renders a numeric API value back into its editable string form. */
export function numberToInput(value: number | null | undefined): string {
  return value == null ? "" : String(value);
}

/* ─── Visual material: gallery categories and video ─── */

/**
 * Gallery categories the app offers when the owner classifies a photo. The API
 * accepts a wider list (`lobby`, `restaurant`, `room`, `pool`, `garden`), so
 * anything outside these four is folded into `general` ("Other") for display.
 */
export const IMAGE_CATEGORIES = ["common_area", "spa", "exterior", "general"] as const;

export type ImageCategory = (typeof IMAGE_CATEGORIES)[number];

/** Any value the API may return (or a legacy session) → one of the four. */
export function normalizeImageCategory(value: unknown): ImageCategory {
  return typeof value === "string" && (IMAGE_CATEGORIES as readonly string[]).includes(value)
    ? (value as ImageCategory)
    : "general";
}

/** A gallery photo as the forms hold it while editing. */
export type PhotoEntry = {
  url: string;
  category: ImageCategory;
};

/** One rendered gallery section: a category and the photos that belong to it,
 *  each keeping the index it has in the full gallery so a thumbnail can open
 *  the lightbox on the right slide. */
export type ImageGroup<T> = {
  category: ImageCategory;
  items: { image: T; index: number }[];
};

/** Groups a gallery in `IMAGE_CATEGORIES` order, dropping empty sections. */
export function groupImagesByCategory<T extends { category?: string | null }>(
  images: T[],
): ImageGroup<T>[] {
  return IMAGE_CATEGORIES.map((category) => ({
    category,
    items: images
      .map((image, index) => ({ image, index }))
      .filter(({ image }) => normalizeImageCategory(image.category) === category),
  })).filter((group) => group.items.length > 0);
}

export type VideoEmbed = {
  kind: "youtube" | "vimeo" | "instagram";
  /** Player URL built from the parsed id. Absent for Instagram, which has no
   *  embeddable player here — those render as a card linking out. */
  embedUrl?: string;
};

/** True when `host` is `domain` or a subdomain of it (www., m., player.…). */
function hostMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;
const VIMEO_ID = /^\d+$/;

/**
 * Recognises the video hosts the API accepts and derives a safe player URL.
 *
 * Only the parsed id is ever interpolated into the embed URL — the raw string
 * the owner typed is never handed to an iframe. Returns null for any other
 * host, or for a known host whose id could not be read: that is what the form
 * shows as invalid and what the API answers with a 422.
 */
export function videoEmbed(url: string | null | undefined): VideoEmbed | null {
  const raw = url?.trim();
  if (!raw) return null;

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const segments = parsed.pathname.split("/").filter(Boolean);

  if (hostMatches(host, "youtu.be")) {
    const id = segments[0];
    return id && YOUTUBE_ID.test(id)
      ? { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` }
      : null;
  }

  if (hostMatches(host, "youtube.com")) {
    const watchId = parsed.searchParams.get("v");
    const pathId =
      segments[0] === "shorts" || segments[0] === "embed" ? segments[1] : undefined;
    const id = watchId ?? pathId;
    return id && YOUTUBE_ID.test(id)
      ? { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` }
      : null;
  }

  if (hostMatches(host, "vimeo.com")) {
    // vimeo.com/<id> and the player form player.vimeo.com/video/<id>
    const id = segments[0] === "video" ? segments[1] : segments[0];
    return id && VIMEO_ID.test(id)
      ? { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` }
      : null;
  }

  // Instagram has no id to parse here — any link on the host the API accepts
  // renders as a card that opens the post in a new tab.
  if (hostMatches(host, "instagram.com")) {
    return { kind: "instagram" };
  }

  return null;
}
