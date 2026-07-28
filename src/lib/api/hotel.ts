/**
 * Hotel workspace API endpoints.
 * Used by hotel owners for onboarding and property management.
 */
import { api } from "@/lib/api";

export const hotelApi = {
  // Profile
  getProfile: () => api.get<{ hotel: HotelProfile | null; organization: OrgProfile }>("/hotel/profile"),
  updateProfile: (data: Partial<HotelProfileUpdate>) =>
    api.patch<{ hotel: HotelProfile; organization: OrgProfile }>("/hotel/profile", { hotel: data }),
  submitForReview: () => api.post<{ user: import("@/lib/types").User }>("/hotel/profile/submit_for_review"),

  // Room types
  listRoomTypes: () => api.get<{ room_types: RoomType[] }>("/hotel/room_types"),
  getRoomType: (id: number) => api.get<{ room_type: RoomTypeDetail }>(`/hotel/room_types/${id}`),
  createRoomType: (data: RoomTypeCreate) =>
    api.post<{ room_type: RoomType }>("/hotel/room_types", { room_type: data }),
  updateRoomType: (id: number, data: Partial<RoomTypeCreate>) =>
    api.patch<{ room_type: RoomType }>(`/hotel/room_types/${id}`, { room_type: data }),
  deleteRoomType: (id: number) => api.delete(`/hotel/room_types/${id}`),

  // Room type gallery (replace-all; first image becomes primary/thumbnail)
  batchRoomTypeImages: (roomTypeId: number, images: { image_url: string; alt_text?: string }[]) =>
    api.post<{ images: RoomTypeImage[] }>(`/hotel/room_types/${roomTypeId}/images/batch`, {
      images,
    }),

  // Room type volume pricing tiers
  createRateTier: (roomTypeId: number, data: RateTierCreate) =>
    api.post<{ rate_tier: RateTier }>(`/hotel/room_types/${roomTypeId}/rate_tiers`, {
      rate_tier: data,
    }),
  updateRateTier: (roomTypeId: number, tierId: number, data: Partial<RateTierCreate>) =>
    api.patch<{ rate_tier: RateTier }>(`/hotel/room_types/${roomTypeId}/rate_tiers/${tierId}`, {
      rate_tier: data,
    }),
  deleteRateTier: (roomTypeId: number, tierId: number) =>
    api.delete(`/hotel/room_types/${roomTypeId}/rate_tiers/${tierId}`),

  // Amenities
  listAmenities: () => api.get<{ amenities: Amenity[] }>("/hotel/amenities"),
  batchAmenities: (amenities: AmenityCreate[]) =>
    api.post<{ amenities: Amenity[] }>("/hotel/amenities/batch", { amenities }),

  // Images
  listImages: () => api.get<{ images: HotelImage[] }>("/hotel/images"),
  batchImages: (images: ImageCreate[]) =>
    api.post<{ images: HotelImage[] }>("/hotel/images/batch", { images }),

  // Rooms (physical, numbered rooms within each room type)
  listRooms: (params?: { room_type_id?: number; status?: string }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    return api.get<{ rooms: Room[] }>(`/hotel/rooms${query ? `?${query}` : ""}`);
  },
  createRoom: (data: RoomCreate) => api.post<{ room: Room }>("/hotel/rooms", { room: data }),
  updateRoom: (id: number, data: Partial<RoomCreate>) =>
    api.patch<{ room: Room }>(`/hotel/rooms/${id}`, { room: data }),
  deleteRoom: (id: number) => api.delete(`/hotel/rooms/${id}`),

  // Availability blocks (date-ranged closures; all dates open by default)
  listAvailabilityBlocks: (roomTypeId?: number) =>
    api.get<{ availability_blocks: ApiAvailabilityBlock[] }>(
      `/hotel/availability_blocks${roomTypeId ? `?room_type_id=${roomTypeId}` : ""}`,
    ),
  createAvailabilityBlock: (data: AvailabilityBlockCreate) =>
    api.post<{ availability_block: ApiAvailabilityBlock }>("/hotel/availability_blocks", {
      availability_block: data,
    }),
  deleteAvailabilityBlock: (id: number) => api.delete(`/hotel/availability_blocks/${id}`),

  // Availability calendar
  getCalendar: (from: string, to: string) =>
    api.get<CalendarResponse>(`/hotel/calendar?from=${from}&to=${to}`),

  // Retreats
  listRetreats: (status?: string) =>
    api.get<{ retreats: ApiRetreat[] }>(`/hotel/retreats${status ? `?status=${status}` : ""}`),
  getRetreat: (id: number) => api.get<{ retreat: ApiRetreatDetail }>(`/hotel/retreats/${id}`),
  createRetreat: (data: RetreatCreate) =>
    api.post<{ retreat: ApiRetreatDetail }>("/hotel/retreats", { retreat: data }),
  updateRetreat: (id: number, data: Partial<RetreatCreate>) =>
    api.patch<{ retreat: ApiRetreatDetail }>(`/hotel/retreats/${id}`, { retreat: data }),
  deleteRetreat: (id: number) => api.delete(`/hotel/retreats/${id}`),
  publishRetreat: (id: number) =>
    api.post<{ retreat: ApiRetreatDetail }>(`/hotel/retreats/${id}/publish`),

  // Retreat program (days + activities)
  createRetreatDay: (retreatId: number, data: RetreatDayCreate) =>
    api.post<{ day: ApiRetreatDay }>(`/hotel/retreats/${retreatId}/days`, { retreat_day: data }),
  updateRetreatDay: (retreatId: number, dayId: number, data: Partial<RetreatDayCreate>) =>
    api.patch<{ day: ApiRetreatDay }>(`/hotel/retreats/${retreatId}/days/${dayId}`, {
      retreat_day: data,
    }),
  deleteRetreatDay: (retreatId: number, dayId: number) =>
    api.delete(`/hotel/retreats/${retreatId}/days/${dayId}`),
  createRetreatActivity: (retreatId: number, dayId: number, data: RetreatActivityCreate) =>
    api.post<{ activity: ApiRetreatActivity }>(
      `/hotel/retreats/${retreatId}/days/${dayId}/activities`,
      { retreat_activity: data },
    ),
  updateRetreatActivity: (
    retreatId: number,
    dayId: number,
    activityId: number,
    data: Partial<RetreatActivityCreate>,
  ) =>
    api.patch<{ activity: ApiRetreatActivity }>(
      `/hotel/retreats/${retreatId}/days/${dayId}/activities/${activityId}`,
      { retreat_activity: data },
    ),
  deleteRetreatActivity: (retreatId: number, dayId: number, activityId: number) =>
    api.delete(`/hotel/retreats/${retreatId}/days/${dayId}/activities/${activityId}`),

  // Retreat facilitators
  createRetreatFacilitator: (retreatId: number, data: RetreatFacilitatorCreate) =>
    api.post<{ facilitator: ApiRetreatFacilitator }>(`/hotel/retreats/${retreatId}/facilitators`, {
      retreat_facilitator: data,
    }),
  updateRetreatFacilitator: (
    retreatId: number,
    facilitatorId: number,
    data: Partial<RetreatFacilitatorCreate>,
  ) =>
    api.patch<{ facilitator: ApiRetreatFacilitator }>(
      `/hotel/retreats/${retreatId}/facilitators/${facilitatorId}`,
      { retreat_facilitator: data },
    ),
  deleteRetreatFacilitator: (retreatId: number, facilitatorId: number) =>
    api.delete(`/hotel/retreats/${retreatId}/facilitators/${facilitatorId}`),

  // Retreat inclusions ("what's included" chips)
  createRetreatInclusion: (retreatId: number, data: RetreatInclusionCreate) =>
    api.post<{ inclusion: ApiRetreatInclusion }>(`/hotel/retreats/${retreatId}/inclusions`, {
      retreat_inclusion: data,
    }),
  deleteRetreatInclusion: (retreatId: number, inclusionId: number) =>
    api.delete(`/hotel/retreats/${retreatId}/inclusions/${inclusionId}`),

  // Retreat pricing (per room type)
  createRetreatPricing: (retreatId: number, data: RetreatPricingCreate) =>
    api.post<{ pricing: ApiRetreatPricing }>(`/hotel/retreats/${retreatId}/pricings`, {
      retreat_pricing: data,
    }),
  updateRetreatPricing: (retreatId: number, pricingId: number, data: Partial<RetreatPricingCreate>) =>
    api.patch<{ pricing: ApiRetreatPricing }>(
      `/hotel/retreats/${retreatId}/pricings/${pricingId}`,
      { retreat_pricing: data },
    ),
  deleteRetreatPricing: (retreatId: number, pricingId: number) =>
    api.delete(`/hotel/retreats/${retreatId}/pricings/${pricingId}`),

  // Retreat gallery (replace-all; first image becomes the cover)
  batchRetreatImages: (retreatId: number, images: RetreatImageCreate[]) =>
    api.post<{ images: ApiRetreatImage[] }>(`/hotel/retreats/${retreatId}/images/batch`, {
      images,
    }),
};

// Types
export interface HotelProfile {
  id: number;
  name: string;
  city: string;
  country: string;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  certified: boolean;
  wellness_standard: string | null;
  description: string | null;
  address: string | null;
  postal_code: string | null;
  phone: string | null;
  stars: number | null;
  total_rooms: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  logo_url: string | null;
  website: string | null;
  contact_email: string | null;
  room_types: RoomType[];
  amenities: Amenity[];
  images: HotelImage[];
}

export interface HotelProfileUpdate {
  name: string;
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  description: string;
  address: string;
  phone: string;
  stars: number;
  check_in_time: string;
  check_out_time: string;
  total_rooms: number;
  website: string;
  contact_email: string;
  postal_code: string;
  wellness_standard: string;
}

export interface OrgProfile {
  id: number;
  name: string;
  kind: string;
  status: string;
}

export type RoomTypeStatus = "active" | "draft" | "inactive";

export interface RoomType {
  id: number;
  name: string;
  category: string;
  status: RoomTypeStatus;
  capacity: number;
  area_sqm: number | null;
  price_per_night_cents: number;
  currency: string;
  description: string | null;
  image_url: string | null;
  total_rooms: number | null;
  bed_type: string | null;
  view_type: string | null;
  amenities_list: string[];
}

export interface RoomTypeDetail extends RoomType {
  images: RoomTypeImage[];
  rate_tiers: RateTier[];
}

export interface RoomTypeImage {
  id: number;
  image_url: string;
  position: number;
  alt_text: string | null;
  is_primary: boolean;
}

export interface RateTier {
  id: number;
  min_rooms: number;
  starts_on: string | null;
  ends_on: string | null;
  price_per_night_cents: number;
  price_per_night: number;
  position: number;
}

export interface RateTierCreate {
  min_rooms: number;
  starts_on?: string | null;
  ends_on?: string | null;
  price_per_night_cents: number;
  position?: number;
}

export interface RoomTypeCreate {
  name: string;
  category?: string;
  status?: RoomTypeStatus;
  capacity: number;
  area_sqm?: number | null;
  price_per_night_cents: number;
  currency?: string;
  description?: string;
  total_rooms?: number;
  bed_type?: string;
  view_type?: string;
  amenities?: string[];
}

export type RoomStatus = "available" | "maintenance" | "out_of_service";

export interface Room {
  id: number;
  hotel_id: number;
  room_type_id: number;
  number: string;
  status: RoomStatus;
  auto_generated: boolean;
  notes: string | null;
}

export interface RoomCreate {
  room_type_id: number;
  number: string;
  status?: RoomStatus;
  notes?: string;
}

export interface ApiAvailabilityBlock {
  id: number;
  hotel_id: number;
  room_type_id: number;
  starts_on: string;
  ends_on: string;
  units: number | null;
  reason: string | null;
}

export interface AvailabilityBlockCreate {
  room_type_id: number;
  starts_on: string;
  ends_on: string;
  units?: number;
  reason?: string;
}

export interface CalendarDay {
  date: string;
  booked: number;
  blocked: number;
  available: number;
}

export interface CalendarRoomType {
  room_type: RoomType & { price_per_night: number };
  rooms_total: number;
  rooms_operational: number;
  days: CalendarDay[];
}

export interface CalendarResponse {
  from: string;
  to: string;
  room_types: CalendarRoomType[];
  unassigned_bookings: { date: string; count: number }[];
}

export interface Amenity {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  position: number;
}

export interface AmenityCreate {
  name: string;
  category: string;
  icon?: string;
  featured?: boolean;
}

export interface HotelImage {
  id: number;
  image_url: string;
  category: string;
  position: number;
  is_cover: boolean;
}

export interface ImageCreate {
  image_url: string;
  category?: string;
}

// Retreats — shapes mirror ApiSerializers.retreat and friends
export type RetreatType = "wellness" | "spiritual" | "corporate" | "adventure" | "medical";
export type RetreatStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "upcoming"
  | "closed"
  | "cancelled";

export interface ApiRetreat {
  id: number;
  name: string;
  slug: string;
  retreat_type: RetreatType;
  status: RetreatStatus;
  duration_nights: number;
  starts_on: string | null;
  ends_on: string | null;
  capacity: number | null;
  language: string | null;
  description: string | null;
  short_description: string | null;
  location: string | null;
  country: string | null;
  country_code: string | null;
  min_price_cents: number;
  min_price: number;
  currency: string;
  cover_image_url: string | null;
  featured: boolean;
  certified: boolean;
  published_at: string | null;
  created_by_type: string;
  hotel: { id: number; name: string; city: string; country: string } | null;
  created_at: string;
  commission_rate?: number;
  commission_percent?: number;
}

export interface ApiRetreatDetail extends ApiRetreat {
  days: ApiRetreatDay[];
  facilitators: ApiRetreatFacilitator[];
  inclusions: ApiRetreatInclusion[];
  pricing: ApiRetreatPricing[];
  images: ApiRetreatImage[];
}

export interface RetreatCreate {
  name: string;
  retreat_type: RetreatType;
  duration_nights: number;
  starts_on?: string;
  ends_on?: string;
  capacity?: number;
  language?: string;
  description?: string;
  short_description?: string;
  location?: string;
  country?: string;
  country_code?: string;
  currency?: string;
  cover_image_url?: string;
}

export interface ApiRetreatDay {
  id: number;
  day_number: number;
  title: string | null;
  description: string | null;
  activities: ApiRetreatActivity[];
}

export interface RetreatDayCreate {
  day_number: number;
  title?: string;
  description?: string;
}

export interface ApiRetreatActivity {
  id: number;
  name: string;
  time: string | null;
  duration_minutes: number | null;
  position: number;
  description: string | null;
  category: string | null;
  icon: string | null;
}

export interface RetreatActivityCreate {
  name: string;
  time?: string;
  duration_minutes?: number;
  position?: number;
  description?: string;
  category?: string;
  icon?: string;
}

export interface ApiRetreatFacilitator {
  id: number;
  name: string;
  role: "lead" | "assistant";
  specialty: string | null;
  avatar_url: string | null;
  bio: string | null;
  position: number;
}

export interface RetreatFacilitatorCreate {
  name: string;
  role: "lead" | "assistant";
  specialty?: string;
  avatar_url?: string;
  bio?: string;
  position?: number;
}

export interface ApiRetreatInclusion {
  id: number;
  name: string;
  category: string | null;
  icon: string | null;
  position: number;
}

export interface RetreatInclusionCreate {
  name: string;
  category?: string;
  icon?: string;
  position?: number;
}

export interface ApiRetreatPricing {
  id: number;
  room_type: RoomType;
  price_per_guest_cents: number;
  price_per_guest: number;
  currency: string;
  occupancy_label: string | null;
  max_guests: number | null;
}

export interface RetreatPricingCreate {
  room_type_id: number;
  price_per_guest_cents: number;
  currency?: string;
  occupancy_label?: string;
  max_guests?: number;
}

export interface ApiRetreatImage {
  id: number;
  image_url: string;
  position: number;
  alt_text: string | null;
  is_cover: boolean;
}

export interface RetreatImageCreate {
  image_url: string;
  alt_text?: string;
}
