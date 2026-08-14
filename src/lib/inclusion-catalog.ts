/**
 * Predefined inclusion catalog shared by both retreat creation wizards.
 * The wizard tracks inclusions by id; the API stores them by display name.
 */

export interface CatalogInclusion {
  name: string;
  category: string;
}

export const INCLUSION_CATALOG: Record<string, CatalogInclusion> = {
  // meals
  "full-board": { name: "Pensión completa", category: "meals" },
  "healthy-snacks": { name: "Snacks saludables", category: "meals" },
  "welcome-dinner": { name: "Cena de bienvenida", category: "meals" },
  "detox-juices": { name: "Jugos detox y tés", category: "meals" },
  // wellness
  "spa-access": { name: "Acceso al spa", category: "wellness" },
  "one-on-one": { name: "Sesión 1:1", category: "wellness" },
  "sound-healing": { name: "Sanación sonora", category: "wellness" },
  "organic-products": { name: "Productos orgánicos", category: "wellness" },
  // transport
  "airport-transfer": { name: "Transfer aeropuerto", category: "transport" },
  "local-transport": { name: "Transporte local", category: "transport" },
  // amenity
  "welcome-kit": { name: "Kit de bienvenida", category: "amenity" },
  "towels-robes": { name: "Toallas y batas", category: "amenity" },
  "journal-materials": { name: "Diario y materiales", category: "amenity" },
  // activity
  "guided-excursion": { name: "Excursión guiada", category: "activity" },
  "guided-meditation": { name: "Meditación guiada", category: "activity" },
  "opening-closing": { name: "Ceremonia apertura/cierre", category: "activity" },
  // equipment
  "yoga-mat": { name: "Mat de yoga", category: "equipment" },
  "meditation-supplies": { name: "Materiales de meditación", category: "equipment" },
  "ceremony-supplies": { name: "Suministros de ceremonia", category: "equipment" },
};

export const INCLUSION_CATEGORIES = [
  "meals",
  "wellness",
  "transport",
  "amenity",
  "activity",
  "equipment",
] as const;

export type InclusionCategory = (typeof INCLUSION_CATEGORIES)[number];

/** Maps a stored inclusion display name back to its catalog id (case-insensitive). */
export function inclusionIdForName(name: string): string | null {
  const needle = name.trim().toLowerCase();
  for (const [id, entry] of Object.entries(INCLUSION_CATALOG)) {
    if (entry.name.toLowerCase() === needle || id === needle) return id;
  }
  return null;
}

/** Returns catalog entries grouped by category in display order. */
export function inclusionsByCategory(): { category: InclusionCategory; items: { id: string; name: string }[] }[] {
  return INCLUSION_CATEGORIES.map((category) => ({
    category,
    items: Object.entries(INCLUSION_CATALOG)
      .filter(([, entry]) => entry.category === category)
      .map(([id, entry]) => ({ id, name: entry.name })),
  }));
}
