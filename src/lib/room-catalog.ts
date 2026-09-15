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

export type RoomAmenityGroup = "comfort" | "equipment" | "accessibility";

export const ROOM_AMENITIES: { group: RoomAmenityGroup; items: string[] }[] = [
  { group: "comfort", items: ["fan", "air_conditioning", "heating"] },
  { group: "equipment", items: ["smart_tv", "minibar", "safe_box", "hair_dryer"] },
  { group: "accessibility", items: ["wheelchair_accessible"] },
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
  return items[id] ?? id;
}
