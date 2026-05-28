import type { Country } from "./types";

/** URL slug ↔ country ID mappings (shared across routes) */
export const countrySlugToId: Record<string, string> = {
  mexico: "mx",
  argentina: "ar",
  usa: "us",
  spain: "es",
  brazil: "br",
  india: "in",
  indonesia: "id",
  portugal: "pt",
};

export const countryIdToSlug: Record<string, string> = {
  mx: "mexico",
  ar: "argentina",
  us: "usa",
  es: "spain",
  br: "brazil",
  in: "india",
  id: "indonesia",
  pt: "portugal",
};

export const countries: Country[] = [
  { id: "mx", name: "México", code: "MX", flag: "🇲🇽", retreatCount: 1, hotelCount: 8 },
  { id: "us", name: "Estados Unidos", code: "US", flag: "🇺🇸", retreatCount: 0, hotelCount: 0 },
  { id: "es", name: "España", code: "ES", flag: "🇪🇸", retreatCount: 1, hotelCount: 0 },
  { id: "br", name: "Brasil", code: "BR", flag: "🇧🇷", retreatCount: 0, hotelCount: 0 },
  { id: "in", name: "India", code: "IN", flag: "🇮🇳", retreatCount: 0, hotelCount: 0 },
  { id: "id", name: "Indonesia", code: "ID", flag: "🇮🇩", retreatCount: 1, hotelCount: 0 },
  { id: "ar", name: "Argentina", code: "AR", flag: "🇦🇷", retreatCount: 0, hotelCount: 0 },
  { id: "pt", name: "Portugal", code: "PT", flag: "🇵🇹", retreatCount: 1, hotelCount: 0 },
];
