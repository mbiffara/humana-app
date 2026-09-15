/**
 * Common spaces catalog — the closed lists the API accepts for a
 * `common_space`, the draft shape the forms edit, and the translations of each
 * id. Shared by the onboarding wizard (step 3), the hotel workspace page, the
 * public hotel detail and the admin preview so all four offer the same thing.
 */
import type { CommonSpace, CommonSpaceCreate } from "@/lib/api/hotel";
import type { CommonSpacesCopy } from "@/i18n/dictionary";

export const SPACE_TYPES = [
  "salon",
  "yoga_room",
  "meditation_room",
  "auditorium",
  "terrace",
  "garden",
  "outdoor",
  "meeting_room",
  "restaurant",
  "other",
] as const;

export type SpaceType = (typeof SPACE_TYPES)[number];

export const FLOOR_TYPES = ["floating", "wood", "ceramic", "other"] as const;

export type FloorType = (typeof FLOOR_TYPES)[number];

export const SPACE_EQUIPMENT = [
  "projector",
  "screen",
  "sound",
  "microphones",
  "wifi",
  "air_conditioning",
  "chairs",
  "tables",
  "yoga_mats",
  "lighting",
  "other",
] as const;

export type SpaceEquipment = (typeof SPACE_EQUIPMENT)[number];

/** The capacity modes a space is measured in; every one of them is optional. */
export const CAPACITY_KINDS = ["seated", "yoga", "auditorium", "banquet", "workshop"] as const;

export type CapacityKind = (typeof CAPACITY_KINDS)[number];

/** Max photos per space — keep in sync with the photosHint copy. */
export const MAX_SPACE_PHOTOS = 8;

export function isSpaceType(value: unknown): value is SpaceType {
  return typeof value === "string" && (SPACE_TYPES as readonly string[]).includes(value);
}

export function isFloorType(value: unknown): value is FloorType {
  return typeof value === "string" && (FLOOR_TYPES as readonly string[]).includes(value);
}

/** Label for a space type; "other" reads as whatever the hotel typed. */
export function spaceTypeLabel(
  c: CommonSpacesCopy,
  type: string | null | undefined,
  other?: string | null,
): string | null {
  if (!type) return null;
  if (type === "other") return other?.trim() || c.types.other;
  return isSpaceType(type) ? c.types[type] : type;
}

export function floorTypeLabel(
  c: CommonSpacesCopy,
  floor: string | null | undefined,
  other?: string | null,
): string | null {
  if (!floor) return null;
  if (floor === "other") return other?.trim() || c.floors.other;
  return isFloorType(floor) ? c.floors[floor] : floor;
}

/** Label for an equipment id; ids from another client read as themselves. */
export function equipmentLabel(c: CommonSpacesCopy, id: string): string {
  return (c.equipment as Record<string, string | undefined>)[id] ?? id;
}

function highest(values: (number | null | undefined)[]): number | null {
  const numbers = values.filter((v): v is number => typeof v === "number" && v > 0);
  return numbers.length > 0 ? Math.max(...numbers) : null;
}

type CapacityCarrier = {
  capacity_seated?: number | null;
  capacity_yoga?: number | null;
  capacity_auditorium?: number | null;
  capacity_banquet?: number | null;
  capacity_workshop?: number | null;
};

/** The biggest capacity the space declared, or null when none was filled. */
export function maxCapacity(space: CapacityCarrier): number | null {
  return highest([
    space.capacity_seated,
    space.capacity_yoga,
    space.capacity_auditorium,
    space.capacity_banquet,
    space.capacity_workshop,
  ]);
}

export function draftMaxCapacity(draft: CommonSpaceDraft): number | null {
  return highest(CAPACITY_KINDS.map((kind) => draft.capacities[kind]));
}

/* ─── Draft ─── */

/** What the forms edit: one entry per space, with `id` set once the API knows
 *  about it and photos held as plain URLs (blob: while an upload is in flight). */
export type CommonSpaceDraft = {
  id?: number;
  localId: string;
  name: string;
  spaceType: string;
  spaceTypeOther: string;
  capacities: Record<CapacityKind, number | null>;
  areaSqm: number | null;
  floorType: string;
  floorTypeOther: string;
  exclusiveForGroups: boolean;
  equipment: string[];
  equipmentOther: string;
  photos: string[];
};

export function generateSpaceLocalId(): string {
  return `cs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function emptySpaceDraft(): CommonSpaceDraft {
  return {
    localId: generateSpaceLocalId(),
    name: "",
    spaceType: "",
    spaceTypeOther: "",
    capacities: { seated: null, yoga: null, auditorium: null, banquet: null, workshop: null },
    areaSqm: null,
    floorType: "",
    floorTypeOther: "",
    exclusiveForGroups: false,
    equipment: [],
    equipmentOther: "",
    photos: [],
  };
}

/** A saved space as the forms edit it. Images arrive ordered by the API, with
 *  the primary one first, which is exactly the order the batch endpoint wants. */
export function spaceToDraft(space: CommonSpace): CommonSpaceDraft {
  const images = [...(space.images ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position,
  );
  return {
    id: space.id,
    localId: `api_${space.id}`,
    name: space.name,
    spaceType: space.space_type ?? "",
    spaceTypeOther: space.space_type_other ?? "",
    capacities: {
      seated: space.capacity_seated ?? null,
      yoga: space.capacity_yoga ?? null,
      auditorium: space.capacity_auditorium ?? null,
      banquet: space.capacity_banquet ?? null,
      workshop: space.capacity_workshop ?? null,
    },
    areaSqm: space.area_sqm ?? null,
    floorType: space.floor_type ?? "",
    floorTypeOther: space.floor_type_other ?? "",
    exclusiveForGroups: !!space.exclusive_for_groups,
    equipment: space.equipment ?? [],
    equipmentOther: space.equipment_other ?? "",
    photos: images.map((image) => image.image_url),
  };
}

/** The draft as the API wants it — a cleared field is sent as null so the
 *  server drops the old value instead of keeping it. */
export function draftToPayload(draft: CommonSpaceDraft): CommonSpaceCreate {
  const isOtherType = draft.spaceType === "other";
  const isOtherFloor = draft.floorType === "other";
  const hasOtherEquipment = draft.equipment.includes("other");
  return {
    name: draft.name.trim(),
    space_type: draft.spaceType,
    space_type_other: isOtherType ? draft.spaceTypeOther.trim() || null : null,
    capacity_seated: draft.capacities.seated,
    capacity_yoga: draft.capacities.yoga,
    capacity_auditorium: draft.capacities.auditorium,
    capacity_banquet: draft.capacities.banquet,
    capacity_workshop: draft.capacities.workshop,
    area_sqm: draft.areaSqm,
    floor_type: draft.floorType || null,
    floor_type_other: isOtherFloor ? draft.floorTypeOther.trim() || null : null,
    exclusive_for_groups: draft.exclusiveForGroups,
    equipment: draft.equipment,
    equipment_other: hasOtherEquipment ? draft.equipmentOther.trim() || null : null,
  };
}

export type CommonSpaceErrors = Partial<Record<keyof CommonSpaceDraft, string>>;

/** Name and type are the only required fields; "Other" needs its free text. */
export function validateDraft(draft: CommonSpaceDraft, c: CommonSpacesCopy): CommonSpaceErrors {
  const errors: CommonSpaceErrors = {};
  if (!draft.name.trim()) errors.name = c.nameRequired;
  if (!draft.spaceType) errors.spaceType = c.typeRequired;
  else if (draft.spaceType === "other" && !draft.spaceTypeOther.trim())
    errors.spaceTypeOther = c.otherRequired;
  if (draft.floorType === "other" && !draft.floorTypeOther.trim())
    errors.floorTypeOther = c.otherRequired;
  if (draft.equipment.includes("other") && !draft.equipmentOther.trim())
    errors.equipmentOther = c.otherRequired;
  return errors;
}

export function isDraftValid(draft: CommonSpaceDraft, c: CommonSpacesCopy): boolean {
  return Object.keys(validateDraft(draft, c)).length === 0;
}
