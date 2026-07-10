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
  createRoomType: (data: RoomTypeCreate) =>
    api.post<{ room_type: RoomType }>("/hotel/room_types", { room_type: data }),
  updateRoomType: (id: number, data: Partial<RoomTypeCreate>) =>
    api.patch<{ room_type: RoomType }>(`/hotel/room_types/${id}`, { room_type: data }),
  deleteRoomType: (id: number) => api.delete(`/hotel/room_types/${id}`),

  // Amenities
  listAmenities: () => api.get<{ amenities: Amenity[] }>("/hotel/amenities"),
  batchAmenities: (amenities: AmenityCreate[]) =>
    api.post<{ amenities: Amenity[] }>("/hotel/amenities/batch", { amenities }),

  // Images
  listImages: () => api.get<{ images: HotelImage[] }>("/hotel/images"),
  batchImages: (images: ImageCreate[]) =>
    api.post<{ images: HotelImage[] }>("/hotel/images/batch", { images }),
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

export interface RoomType {
  id: number;
  name: string;
  category: string;
  capacity: number;
  area_sqm: number | null;
  price_per_night_cents: number;
  currency: string;
  description: string | null;
  total_rooms: number | null;
  bed_type: string | null;
}

export interface RoomTypeCreate {
  name: string;
  category?: string;
  capacity: number;
  area_sqm?: number;
  price_per_night_cents: number;
  currency?: string;
  description?: string;
  total_rooms?: number;
  bed_type?: string;
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
