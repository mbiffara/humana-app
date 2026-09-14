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
