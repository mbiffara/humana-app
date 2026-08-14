/**
 * Adapts hotel-published Retreats (public marketplace endpoints) into the
 * ApiExperience shape the agency browse and booking pages render, so both
 * catalog sources flow through the same UI. Adapted entries carry
 * `is_retreat: true` — bookings for them use the direct hotel path
 * (hotel_id) instead of experience_id.
 */
import { agencyApi, type ApiExperience, type ApiRetreatPricing, type PublicRetreat } from "@/lib/api/agency";

export function retreatToExperience(r: PublicRetreat): ApiExperience {
  // Compute fallback price from cheapest retreat pricing when min_price is 0
  let priceCents = r.min_price_cents;
  let price = r.min_price;
  if (priceCents <= 0 && r.pricing && r.pricing.length > 0) {
    const cheapest = Math.min(...r.pricing.map((p) => p.price_per_guest_cents));
    priceCents = cheapest;
    price = cheapest / 100;
  }

  return {
    id: r.id,
    slug: r.slug,
    kind: r.retreat_type ?? "wellness",
    status: "published",
    title: r.name,
    description: r.short_description || r.description,
    location: r.location,
    country: r.country,
    country_code: r.country_code,
    starts_on: r.starts_on ?? "",
    ends_on: r.ends_on ?? "",
    price_cents: priceCents,
    price,
    currency: r.currency,
    capacity: r.capacity ?? 0,
    spots_available: r.spots_available,
    image_url: r.cover_image_url,
    commission_rate: 0.16,
    commission_percent: "16",
    hotel: r.hotel,
    is_retreat: true,
    created_by_organization_id: r.created_by_organization_id,
    pricing: r.pricing,
    days: r.days,
    facilitators: r.facilitators,
    inclusions: r.inclusions,
    images: r.images,
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
