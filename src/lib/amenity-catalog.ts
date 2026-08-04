/**
 * Predefined amenity catalog shared by the hotel onboarding wizard.
 * The wizard tracks amenities by id; the API stores them by display name.
 * Keep ids in sync with the step-3 amenity picker.
 */

export interface CatalogAmenity {
  name: string;
  category: string;
  featured: boolean;
}

export const AMENITY_CATALOG: Record<string, CatalogAmenity> = {
  wifi: { name: "Wi-Fi", category: "facilities", featured: true },
  pool: { name: "Pool", category: "facilities", featured: true },
  spa: { name: "Spa & Sauna", category: "wellness", featured: true },
  breakfast: { name: "Breakfast", category: "dining", featured: true },
  parking: { name: "Parking", category: "facilities", featured: true },
  ac: { name: "Air Conditioning", category: "facilities", featured: true },
  "yoga-studio": { name: "Yoga Studio", category: "wellness", featured: true },
  gym: { name: "Gym", category: "facilities", featured: true },
  "meditation-room": { name: "Meditation Room", category: "wellness", featured: false },
  "private-garden": { name: "Private Garden", category: "recreation", featured: false },
  "ocean-terrace": { name: "Ocean Terrace", category: "recreation", featured: false },
  "private-chef": { name: "Private Chef", category: "dining", featured: false },
};

/** Maps a stored amenity display name back to its catalog id (case-insensitive). */
export function amenityIdForName(name: string): string | null {
  const needle = name.trim().toLowerCase();
  for (const [id, entry] of Object.entries(AMENITY_CATALOG)) {
    if (entry.name.toLowerCase() === needle || id === needle) return id;
  }
  return null;
}
