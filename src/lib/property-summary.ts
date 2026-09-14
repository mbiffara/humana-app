/**
 * Read-only renderings of the property contract fields, shared by the wizard
 * review step, the admin preview, the hotel list and the public hotel detail.
 * Every helper returns null when there is nothing to show so callers can hide
 * the line for hotels saved before these fields existed.
 */
import type { PropertyFormCopy } from "@/i18n/dictionary";
import {
  isAirportTransfer,
  type AirportTransfer,
  type Environment,
  type PropertyType,
} from "@/lib/property-catalog";

export function propertyTypeLabel(
  p: PropertyFormCopy,
  type: PropertyType | null | undefined,
  other?: string | null,
): string | null {
  if (!type) return null;
  if (type === "other") return other?.trim() || p.types.other;
  return p.types[type];
}

export function environmentLabels(
  p: PropertyFormCopy,
  environments: Environment[] | null | undefined,
): string[] {
  if (!environments) return [];
  return environments.map((key) => p.environments[key]).filter(Boolean);
}

export function airportTransferLabel(
  p: PropertyFormCopy,
  transfer: AirportTransfer | null | undefined,
): string | null {
  return isAirportTransfer(transfer) ? p.transfers[transfer] : null;
}

export type PetPolicyFields = {
  pet_friendly: boolean | null;
  pet_dogs: boolean | null;
  pet_cats: boolean | null;
  pet_size_restriction: boolean | null;
  pet_extra_cost: boolean | null;
  pet_common_areas: boolean | null;
  pet_specific_rooms: boolean | null;
};

/** e.g. "Pet friendly: Yes · dogs, cats · no extra cost", or the "not allowed"
 *  copy. Null when the hotel never answered. */
export function petPolicySummary(p: PropertyFormCopy, v: PetPolicyFields): string | null {
  if (v.pet_friendly == null) return null;
  if (!v.pet_friendly) return p.petsNotAllowed;

  const parts: string[] = [`${p.petFriendlyLabel}: ${p.yes}`];
  const animals: string[] = [];
  if (v.pet_dogs) animals.push(p.petSummary.dogs);
  if (v.pet_cats) animals.push(p.petSummary.cats);
  if (animals.length > 0) parts.push(animals.join(", "));
  if (v.pet_size_restriction) parts.push(p.petSummary.sizeRestriction);
  if (v.pet_extra_cost === true) parts.push(p.petSummary.extraCost);
  else if (v.pet_extra_cost === false) parts.push(p.petSummary.noExtraCost);
  if (v.pet_common_areas) parts.push(p.petSummary.commonAreas);
  if (v.pet_specific_rooms) parts.push(p.petSummary.specificRooms);
  return parts.join(" · ");
}

export function groupCapacitySummary(
  p: PropertyFormCopy,
  min: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (min != null && max != null) return p.groupsRange(min, max);
  if (min != null) return p.groupsFrom(min);
  if (max != null) return p.groupsUpTo(max);
  return null;
}

/** "12.5 km · 40 min" for the airport distance/time pair. */
export function distanceAndTime(
  p: PropertyFormCopy,
  km: number | null | undefined,
  minutes: number | null | undefined,
): string | null {
  const parts: string[] = [];
  if (km != null) parts.push(`${km} ${p.kmSuffix}`);
  if (minutes != null) parts.push(`${minutes} ${p.minSuffix}`);
  return parts.length > 0 ? parts.join(" · ") : null;
}
