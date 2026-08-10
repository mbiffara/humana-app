import type { Country } from "./types";

/** URL slug ↔ country ID mappings (shared across routes) */
export const countrySlugToId: Record<string, string> = {
  spain: "es",
  colombia: "co",
  ecuador: "ec",
  peru: "pe",
  brazil: "br",
  paraguay: "py",
  chile: "cl",
  argentina: "ar",
  uruguay: "uy",
  "costa-rica": "cr",
  "el-salvador": "sv",
  panama: "pa",
  "dominican-republic": "do",
  usa: "us",
  mexico: "mx",
};

export const countryIdToSlug: Record<string, string> = {
  es: "spain",
  co: "colombia",
  ec: "ecuador",
  pe: "peru",
  br: "brazil",
  py: "paraguay",
  cl: "chile",
  ar: "argentina",
  uy: "uruguay",
  cr: "costa-rica",
  sv: "el-salvador",
  pa: "panama",
  do: "dominican-republic",
  us: "usa",
  mx: "mexico",
};

export const countries: Country[] = [
  { id: "es", name: "España", code: "ES", flag: "🇪🇸", retreatCount: 0, hotelCount: 0 },
  { id: "co", name: "Colombia", code: "CO", flag: "🇨🇴", retreatCount: 0, hotelCount: 0 },
  { id: "ec", name: "Ecuador", code: "EC", flag: "🇪🇨", retreatCount: 0, hotelCount: 0 },
  { id: "pe", name: "Perú", code: "PE", flag: "🇵🇪", retreatCount: 0, hotelCount: 0 },
  { id: "br", name: "Brasil", code: "BR", flag: "🇧🇷", retreatCount: 0, hotelCount: 0 },
  { id: "py", name: "Paraguay", code: "PY", flag: "🇵🇾", retreatCount: 0, hotelCount: 0 },
  { id: "cl", name: "Chile", code: "CL", flag: "🇨🇱", retreatCount: 0, hotelCount: 0 },
  { id: "ar", name: "Argentina", code: "AR", flag: "🇦🇷", retreatCount: 0, hotelCount: 0 },
  { id: "uy", name: "Uruguay", code: "UY", flag: "🇺🇾", retreatCount: 0, hotelCount: 0 },
  { id: "cr", name: "Costa Rica", code: "CR", flag: "🇨🇷", retreatCount: 0, hotelCount: 0 },
  { id: "sv", name: "El Salvador", code: "SV", flag: "🇸🇻", retreatCount: 0, hotelCount: 0 },
  { id: "pa", name: "Panamá", code: "PA", flag: "🇵🇦", retreatCount: 0, hotelCount: 0 },
  { id: "do", name: "República Dominicana", code: "DO", flag: "🇩🇴", retreatCount: 0, hotelCount: 0 },
  { id: "us", name: "Estados Unidos", code: "US", flag: "🇺🇸", retreatCount: 0, hotelCount: 0 },
  { id: "mx", name: "México", code: "MX", flag: "🇲🇽", retreatCount: 8, hotelCount: 8 },
];
