/**
 * Editable shape of the property profile, shared by the hotel onboarding
 * wizard (step 1) and the hotel settings form so both screens capture exactly
 * the same contract fields.
 *
 * Numeric fields are held as strings while editing and converted at the
 * payload boundary by `propertyFormPayload`.
 */
import type { HotelProfile, HotelProfileUpdate } from "@/lib/api/hotel";
import type { PlaceResult } from "@/components/PlacesAutocomplete";
import {
  decimalOrNull,
  integerOrNull,
  numberToInput,
  sanitizeEnvironments,
  textOrNull,
  type AirportTransfer,
  type Environment,
  type PropertyType,
} from "@/lib/property-catalog";

export type PropertyFormValues = {
  /* Property type */
  propertyType: PropertyType | "";
  propertyTypeOther: string;
  /* Location */
  city: string;
  stateRegion: string;
  country: string;
  countryCode: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  website: string;
  instagram: string;
  /* Getting here */
  nearestAirport: string;
  airportDistanceKm: string;
  airportTimeMin: string;
  airportTransfer: AirportTransfer | "";
  airportTransferNotes: string;
  distanceToCenterKm: string;
  /* Environment */
  environments: Environment[];
  /* Schedule — "HH:MM" or "flexible" */
  checkInTime: string;
  checkOutTime: string;
  /* Pet policy */
  petFriendly: boolean | null;
  petDogs: boolean | null;
  petCats: boolean | null;
  petSizeRestriction: boolean | null;
  petSizeRestrictionNotes: string;
  petExtraCost: boolean | null;
  petExtraCostNotes: string;
  petCommonAreas: boolean | null;
  petSpecificRooms: boolean | null;
  /* Group capacity */
  groupMinGuests: string;
  groupMaxGuests: string;
};

export const EMPTY_PROPERTY_FORM: PropertyFormValues = {
  propertyType: "",
  propertyTypeOther: "",
  city: "",
  stateRegion: "",
  country: "",
  countryCode: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  website: "",
  instagram: "",
  nearestAirport: "",
  airportDistanceKm: "",
  airportTimeMin: "",
  airportTransfer: "",
  airportTransferNotes: "",
  distanceToCenterKm: "",
  environments: [],
  checkInTime: "15:00",
  checkOutTime: "11:00",
  petFriendly: null,
  petDogs: null,
  petCats: null,
  petSizeRestriction: null,
  petSizeRestrictionNotes: "",
  petExtraCost: null,
  petExtraCostNotes: "",
  petCommonAreas: null,
  petSpecificRooms: null,
  groupMinGuests: "",
  groupMaxGuests: "",
};

/** Hotels saved before this contract come back with nulls — fall back to the
 *  empty form rather than rendering "null" in the inputs. */
export function propertyFormFromProfile(hotel: HotelProfile): PropertyFormValues {
  return {
    propertyType: hotel.property_type ?? "",
    propertyTypeOther: hotel.property_type_other ?? "",
    city: hotel.city ?? "",
    stateRegion: hotel.state_region ?? "",
    country: hotel.country ?? "",
    countryCode: hotel.country_code ?? "",
    postalCode: hotel.postal_code ?? "",
    latitude: numberToInput(hotel.latitude),
    longitude: numberToInput(hotel.longitude),
    website: hotel.website ?? "",
    instagram: hotel.instagram ?? "",
    nearestAirport: hotel.nearest_airport ?? "",
    airportDistanceKm: numberToInput(hotel.airport_distance_km),
    airportTimeMin: numberToInput(hotel.airport_time_min),
    airportTransfer: hotel.airport_transfer ?? "",
    airportTransferNotes: hotel.airport_transfer_notes ?? "",
    distanceToCenterKm: numberToInput(hotel.distance_to_center_km),
    environments: sanitizeEnvironments(hotel.environments),
    checkInTime: hotel.check_in_time || EMPTY_PROPERTY_FORM.checkInTime,
    checkOutTime: hotel.check_out_time || EMPTY_PROPERTY_FORM.checkOutTime,
    petFriendly: hotel.pet_friendly ?? null,
    petDogs: hotel.pet_dogs ?? null,
    petCats: hotel.pet_cats ?? null,
    petSizeRestriction: hotel.pet_size_restriction ?? null,
    petSizeRestrictionNotes: hotel.pet_size_restriction_notes ?? "",
    petExtraCost: hotel.pet_extra_cost ?? null,
    petExtraCostNotes: hotel.pet_extra_cost_notes ?? "",
    petCommonAreas: hotel.pet_common_areas ?? null,
    petSpecificRooms: hotel.pet_specific_rooms ?? null,
    groupMinGuests: numberToInput(hotel.group_min_guests),
    groupMaxGuests: numberToInput(hotel.group_max_guests),
  };
}

/** Everything the property form owns, in the snake_case shape the API expects. */
export function propertyFormPayload(v: PropertyFormValues): Partial<HotelProfileUpdate> {
  const petFriendly = v.petFriendly;
  return {
    property_type: v.propertyType || null,
    property_type_other: v.propertyType === "other" ? textOrNull(v.propertyTypeOther) : null,
    city: v.city.trim(),
    state_region: textOrNull(v.stateRegion),
    country: v.country.trim(),
    country_code: v.countryCode.trim(),
    postal_code: v.postalCode.trim(),
    latitude: decimalOrNull(v.latitude, 6),
    longitude: decimalOrNull(v.longitude, 6),
    website: v.website.trim(),
    instagram: textOrNull(v.instagram),
    nearest_airport: textOrNull(v.nearestAirport),
    airport_distance_km: decimalOrNull(v.airportDistanceKm, 1),
    airport_time_min: integerOrNull(v.airportTimeMin),
    airport_transfer: v.airportTransfer || null,
    airport_transfer_notes:
      v.airportTransfer && v.airportTransfer !== "none"
        ? textOrNull(v.airportTransferNotes)
        : null,
    distance_to_center_km: decimalOrNull(v.distanceToCenterKm, 1),
    environments: v.environments,
    check_in_time: v.checkInTime,
    check_out_time: v.checkOutTime,
    pet_friendly: petFriendly,
    pet_dogs: petFriendly ? v.petDogs : null,
    pet_cats: petFriendly ? v.petCats : null,
    pet_size_restriction: petFriendly ? v.petSizeRestriction : null,
    pet_size_restriction_notes:
      petFriendly && v.petSizeRestriction ? textOrNull(v.petSizeRestrictionNotes) : null,
    pet_extra_cost: petFriendly ? v.petExtraCost : null,
    pet_extra_cost_notes:
      petFriendly && v.petExtraCost ? textOrNull(v.petExtraCostNotes) : null,
    pet_common_areas: petFriendly ? v.petCommonAreas : null,
    pet_specific_rooms: petFriendly ? v.petSpecificRooms : null,
    group_min_guests: integerOrNull(v.groupMinGuests),
    group_max_guests: integerOrNull(v.groupMaxGuests),
  };
}

/** Patch that clears every pet sub-answer — applied when pet friendly goes to No. */
export const CLEARED_PET_DETAILS: Partial<PropertyFormValues> = {
  petDogs: null,
  petCats: null,
  petSizeRestriction: null,
  petSizeRestrictionNotes: "",
  petExtraCost: null,
  petExtraCostNotes: "",
  petCommonAreas: null,
  petSpecificRooms: null,
};

/** True only when both bounds are filled in and the maximum is below the minimum. */
export function groupRangeInvalid(v: Pick<PropertyFormValues, "groupMinGuests" | "groupMaxGuests">): boolean {
  const min = integerOrNull(v.groupMinGuests);
  const max = integerOrNull(v.groupMaxGuests);
  if (min == null || max == null) return false;
  return max < min;
}

/** Location fields filled in from a Google Places selection. */
export function placeToPropertyForm(place: PlaceResult): Partial<PropertyFormValues> {
  const patch: Partial<PropertyFormValues> = {
    city: place.city,
    country: place.country,
    countryCode: place.country_code,
  };
  if (place.state_region) patch.stateRegion = place.state_region;
  if (place.postal_code) patch.postalCode = place.postal_code;
  if (place.latitude != null) patch.latitude = numberToInput(place.latitude);
  if (place.longitude != null) patch.longitude = numberToInput(place.longitude);
  return patch;
}
