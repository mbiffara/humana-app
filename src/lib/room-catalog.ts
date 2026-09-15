/**
 * Bed types and amenities offered by the two room forms — onboarding step 2
 * and the room type editor — so both ask for exactly the same thing.
 *
 * The API keeps `bed_type` as a free string and `amenities` as a free
 * string[], so values saved before this catalog (or by another client) still
 * round-trip: they are surfaced as extra options / custom chips instead of
 * being dropped on save.
 */

/** Bed types the forms offer. */
export const BED_TYPES = ["single", "double", "bunk"] as const;

/** Every bed type the API accepts — used to keep an older value selectable. */
export const ALL_BED_TYPES = [
  "single",
  "double",
  "queen",
  "king",
  "twin",
  "bunk",
  "sofa_bed",
] as const;

export type RoomAmenityGroup = "comfort" | "equipment" | "accessibility" | "extras";

export const ROOM_AMENITIES: { group: RoomAmenityGroup; items: string[] }[] = [
  { group: "comfort", items: ["fan", "air_conditioning", "heating"] },
  { group: "equipment", items: ["smart_tv", "minibar", "safe_box", "hair_dryer"] },
  { group: "accessibility", items: ["wheelchair_accessible"] },
  // Offered before the client's list and still in use on saved rooms — kept
  // on offer so nothing that was reachable becomes custom-only.
  {
    group: "extras",
    items: [
      "free_wifi",
      "ocean_view",
      "garden_view",
      "private_terrace",
      "bathtub",
      "rainfall_shower",
      "organic_toiletries",
      "bidet",
      "desk",
      "closet",
      "king_bed",
      "bluetooth_speaker",
      "usb_charging",
      "hammock",
      "pool_access",
      "private_plunge_pool",
      "outdoor_shower",
    ],
  },
];

export const ROOM_AMENITY_IDS = new Set(ROOM_AMENITIES.flatMap((group) => group.items));

/** The offered bed types, plus `current` when the room already carries a type
 *  the forms no longer offer (king, queen…) so re-saving doesn't rewrite it. */
export function bedTypeOptions(current: string | null | undefined): string[] {
  const options: string[] = [...BED_TYPES];
  if (
    current &&
    !options.includes(current) &&
    (ALL_BED_TYPES as readonly string[]).includes(current)
  ) {
    options.push(current);
  }
  return options;
}

/** Label for an amenity id; custom amenities are stored as their own label. */
export function roomAmenityLabel(id: string, items: Record<string, string>): string {
  if (items[id]) return items[id];
  // Unknown snake_case ids (imported data, other clients) read as words; free-text
  // custom amenities keep the exact text the hotel typed.
  return /^[a-z0-9_]+$/.test(id) ? id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : id;
}
