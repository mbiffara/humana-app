/**
 * Agency workspace API endpoints.
 * Used by agencies for onboarding, profile management, bookings, and client CRUD.
 */
import { api } from "@/lib/api";
import type { Organization, PaginationMeta } from "@/lib/types";

/* ─── Response Types ─── */

export interface PublicHotel {
  id: number;
  name: string;
  city: string;
  country: string;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  certified: boolean;
  wellness_standard: string | null;
}

export interface PublicHotelImage {
  id: number;
  image_url: string;
  category: string;
  position: number;
  is_cover: boolean;
  alt_text: string | null;
}

export interface PublicHotelAmenity {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  position: number;
  featured: boolean;
}

export interface PublicHotelFull extends PublicHotel {
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
  room_types: PublicRoomType[];
  amenities: PublicHotelAmenity[];
  images: PublicHotelImage[];
}

export interface PublicRoomType {
  id: number;
  hotel_id: number;
  name: string;
  category: string;
  capacity: number;
  area_sqm: number | null;
  price_per_night_cents: number;
  price_per_night: string;
  currency: string;
  description: string | null;
  image_url: string | null;
  total_rooms: number | null;
  position: number;
  bed_type: string | null;
  view_type: string | null;
  amenities_list: string[];
}

export interface ApiExperience {
  id: number;
  slug: string;
  kind: string;
  status: string;
  title: string;
  description: string | null;
  location: string | null;
  country: string | null;
  country_code: string | null;
  starts_on: string;
  ends_on: string;
  price_cents: number;
  price: number;
  currency: string;
  capacity: number;
  image_url: string | null;
  commission_rate?: number;
  commission_percent?: string;
  hotel?: PublicHotel;
}

export interface ApiClient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface ApiBooking {
  id: number;
  reference: string;
  status: string;
  guests: number;
  starts_on: string;
  ends_on: string;
  amount_cents: number;
  amount: number;
  currency: string;
  commission_cents: number;
  commission: number;
  notes: string | null;
  client: ApiClient | null;
  room_type: PublicRoomType | null;
  experience?: ApiExperience;
  created_at: string;
}

export interface HotelAvailabilityDay {
  date: string;
  total: number;
  available: number;
}

export interface HotelAvailabilityRoomType {
  room_type: PublicRoomType;
  days: HotelAvailabilityDay[];
}

export interface HotelAvailabilityResponse {
  hotel_id: number;
  from: string;
  to: string;
  room_types: HotelAvailabilityRoomType[];
}

export interface AgencyDashboard {
  total_bookings: number;
  confirmed_count: number;
  commission_earned_cents: number;
  volume_cents: number;
  active_clients: number;
  member_since: string;
}

/* ─── Retreat Types ─── */

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

export interface ApiRetreatDay {
  id: number;
  day_number: number;
  title: string | null;
  description: string | null;
  activities: ApiRetreatActivity[];
}

export interface ApiRetreatFacilitator {
  id: number;
  name: string;
  role: string;
  specialty: string | null;
  avatar_url: string | null;
  bio: string | null;
  position: number;
}

export interface ApiRetreatInclusion {
  id: number;
  name: string;
  category: string | null;
  icon: string | null;
  position: number;
}

export interface ApiRetreatPricing {
  id: number;
  room_type: PublicRoomType;
  price_per_guest_cents: number;
  price_per_guest: number;
  currency: string;
  occupancy_label: string | null;
  max_guests: number | null;
}

export interface ApiRetreatImage {
  id: number;
  image_url: string;
  position: number;
  alt_text: string | null;
  is_cover: boolean;
}

export interface ApiRetreat {
  id: number;
  name: string;
  slug: string;
  retreat_type: string;
  status: string;
  duration_nights: number;
  starts_on: string;
  ends_on: string;
  capacity: number;
  language: string;
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
  created_at: string;
  hotel: PublicHotel;
  commission_rate?: number;
  commission_percent?: number;
  days?: ApiRetreatDay[];
  facilitators?: ApiRetreatFacilitator[];
  inclusions?: ApiRetreatInclusion[];
  pricing?: ApiRetreatPricing[];
  images?: ApiRetreatImage[];
}

/* ─── API Client ─── */

export const agencyApi = {
  // Dashboard
  getDashboard: () =>
    api.get<{ dashboard: AgencyDashboard }>("/agency/dashboard"),

  // Profile
  getProfile: () =>
    api.get<{ organization: Organization & { primary_contact?: string; phone?: string } }>("/agency/profile"),
  updateProfile: (data: Partial<AgencyProfileUpdate>, userName?: string) =>
    api.patch<{ organization: Organization }>("/agency/profile", { organization: data, user_name: userName }),

  // Clients
  listClients: (params?: { page?: number; per_page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    const q = qs.toString();
    return api.get<{ clients: ApiClient[]; meta: PaginationMeta }>(`/clients${q ? `?${q}` : ""}`);
  },
  getClient: (id: number) =>
    api.get<{ client: ApiClient }>(`/clients/${id}`),
  createClient: (data: { name: string; email: string; phone?: string; notes?: string }) =>
    api.post<{ client: ApiClient }>("/clients", { client: data }),
  updateClient: (id: number, data: Partial<{ name: string; email: string; phone: string; notes: string }>) =>
    api.put<{ client: ApiClient }>(`/clients/${id}`, { client: data }),
  deleteClient: (id: number) =>
    api.delete(`/clients/${id}`),

  // Bookings
  listBookings: (params?: { page?: number; per_page?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.per_page) qs.set("per_page", String(params.per_page));
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return api.get<{ bookings: ApiBooking[]; meta: PaginationMeta; summary?: { total: number; confirmed: number; commission_cents: number; volume_cents: number } }>(`/bookings${q ? `?${q}` : ""}`);
  },
  getBooking: (id: number) =>
    api.get<{ booking: ApiBooking }>(`/bookings/${id}`),
  createBooking: (data: {
    experience_id?: number;
    hotel_id?: number;
    client_id?: number;
    room_type_id?: number;
    guests?: number;
    notes?: string;
    starts_on?: string;
    ends_on?: string;
  }) =>
    api.post<{ booking: ApiBooking }>("/bookings", { booking: data }),

  // Experiences (authenticated)
  listExperiences: (params?: { country_code?: string }) => {
    const qs = new URLSearchParams();
    if (params?.country_code) qs.set("country_code", params.country_code);
    const q = qs.toString();
    return api.get<{ experiences: ApiExperience[] }>(`/experiences${q ? `?${q}` : ""}`);
  },
  getExperience: (idOrSlug: number | string) =>
    api.get<{ experience: ApiExperience }>(`/experiences/${idOrSlug}`),

  // Public hotels
  getHotel: (id: number) =>
    api.get<{ hotel: PublicHotelFull }>(`/public/hotels/${id}`),
  listHotels: (params?: { country?: string }) => {
    const qs = new URLSearchParams();
    if (params?.country) qs.set("country", params.country);
    const q = qs.toString();
    return api.get<{ hotels: PublicHotel[] }>(`/public/hotels${q ? `?${q}` : ""}`);
  },

  // Hotel availability
  getHotelAvailability: (hotelId: number, from: string, to: string) =>
    api.get<HotelAvailabilityResponse>(`/public/hotels/${hotelId}/availability?from=${from}&to=${to}`),

  // Agency retreats
  listRetreats: (params?: { status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return api.get<{ retreats: ApiRetreat[] }>(`/agency/retreats${q ? `?${q}` : ""}`);
  },
  getRetreat: (id: number) =>
    api.get<{ retreat: ApiRetreat }>(`/agency/retreats/${id}`),
  createRetreat: (data: Record<string, unknown>) =>
    api.post<{ retreat: ApiRetreat }>("/agency/retreats", { retreat: data }),
  updateRetreat: (id: number, data: Record<string, unknown>) =>
    api.put<{ retreat: ApiRetreat }>(`/agency/retreats/${id}`, { retreat: data }),
  deleteRetreat: (id: number) =>
    api.delete(`/agency/retreats/${id}`),
  submitRetreatForReview: (id: number) =>
    api.post<{ retreat: ApiRetreat }>(`/agency/retreats/${id}/submit_for_review`),
  replaceRetreatProgram: (id: number, data: Record<string, unknown>) =>
    api.put<{ retreat: ApiRetreat }>(`/agency/retreats/${id}/program`, data),

  // Subscription
  getSubscriptionPlans: () =>
    api.get<{ plans: import("@/lib/types").SubscriptionPlan[] }>("/agency/subscription/plans"),
  getSubscription: () =>
    api.get<{ subscription: import("@/lib/types").Subscription | null }>("/agency/subscription"),
  selectPlan: (planId: number) =>
    api.post<{ subscription?: import("@/lib/types").Subscription; checkout_url?: string }>("/agency/subscription", { plan_id: planId }),
  cancelSubscription: () =>
    api.delete<{ subscription: import("@/lib/types").Subscription }>("/agency/subscription"),
};

export interface AgencyProfileUpdate {
  name: string;
  legal_name: string;
  phone: string;
  primary_contact: string;
  address: string;
  city: string;
  country: string;
  country_code: string;
  contact_email: string;
  logo_url: string;
  website: string;
  tax_id: string;
}
