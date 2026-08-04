/**
 * Adapts hotel-published Retreats (public marketplace endpoints) into the
 * ApiExperience shape the agency browse and booking pages render, so both
 * catalog sources flow through the same UI. Adapted entries carry
 * `is_retreat: true` — bookings for them use the direct hotel path
 * (hotel_id) instead of experience_id.
 */
import { agencyApi, type ApiExperience, type PublicRetreat } from "@/lib/api/agency";

export function retreatToExperience(r: PublicRetreat): ApiExperience {
  return {
    id: r.id,
    slug: r.slug,
    kind: "retreat",
    status: "published",
    title: r.name,
    description: r.short_description || r.description,
    location: r.location,
    country: r.country,
    country_code: r.country_code,
    starts_on: r.starts_on ?? "",
    ends_on: r.ends_on ?? "",
    price_cents: r.min_price_cents,
    price: r.min_price,
    currency: r.currency,
    capacity: r.capacity ?? 0,
    image_url: r.cover_image_url,
    hotel: r.hotel,
    is_retreat: true,
  };
}

/** Loads a slug as an Experience first, falling back to a published Retreat. */
export async function fetchExperienceOrRetreat(slug: string): Promise<ApiExperience | null> {
  try {
    const res = await agencyApi.getExperience(slug);
    return res.experience;
  } catch {
    try {
      const res = await agencyApi.getPublicRetreat(slug);
      return retreatToExperience(res.retreat);
    } catch {
      return null;
    }
  }
}
