/** API response types — matches Rails serializer output. */

export interface Organization {
  id: number;
  name: string;
  kind: "hotel" | "agency" | "admin" | "office";
  status: "pending" | "verified" | "suspended";
  address?: string | null;
  city: string | null;
  country: string | null;
  country_code: string | null;
  flag_emoji?: string | null;
  contact_email: string | null;
  website: string | null;
  onboarding_completed: boolean;
  /** Sponsored orgs get full platform access without an active subscription. */
  sponsored?: boolean;
  /** True when the hotel edited content after submitting for review. */
  pending_changes?: boolean;
  /** Admin review comment; presence means "changes requested". */
  review_feedback?: string | null;
  review_feedback_at?: string | null;
  hotel_id?: number | null;
  user_count?: number;
  created_at?: string;
  // Bank details (hotel orgs, returned when include_onboarding)
  bank_account_holder?: string | null;
  bank_iban?: string | null;
  bank_swift?: string | null;
  bank_currency?: string | null;
  bank_country?: string | null;
  bank_status?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "owner" | "member" | "admin";
  status: "pending" | "active" | "suspended" | "rejected";
  locale: string;
  avatar_url: string | null;
  platform_admin: boolean;
  last_login_at: string | null;
  created_at: string | null;
  organization: Organization;
  invited_by_organization?: { id: number; name: string; kind: string } | null;
  invitation_id?: number | null;
  invitation_accepted?: boolean;
  invited_at?: string | null;
}

export interface Invitation {
  id: number;
  email: string;
  role: string;
  token?: string;
  magic_link?: string;
  organization: Organization;
  expires_at: string;
  invited_by: string;
  accepted_at?: string | null;
  created_at?: string;
  expired?: boolean;
}

export interface InvitationPublic {
  email: string;
  role: string;
  organization: Organization;
  expires_at: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  price_cents: number;
  price: string;
  currency: string;
  billing_interval: string;
  features: Record<string, boolean | number | string>;
  commission_rate: number;
  commission_percent: string;
  stripe_price_id: string | null;
  active: boolean;
  trial_days: number;
  target_audience: "agency" | "hotel";
  position: number;
}

export interface Subscription {
  id: number;
  status: string;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  plan: SubscriptionPlan;
  organization: Organization;
  created_at: string;
}

export interface PlatformSetting {
  id: number;
  platform_name: string;
  support_email: string;
  default_currency: string;
  default_language: string;
  agency_commission_rate: number;
  agency_commission_percent: string;
  office_fee_rate: number;
  office_fee_percent: string;
  hotel_net_rate: number;
  terms_url: string | null;
  privacy_url: string | null;
  logo_url: string | null;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  flag_emoji: string | null;
  status: "active" | "inactive";
  enabled: boolean;
  region: string | null;
  currency_code: string | null;
  timezone: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
  subscription?: Subscription | null;
}

// --- Office workspace types ---

export interface OfficeDashboard {
  hotels_count: number;
  agencies_count: number;
  total_bookings: number;
  confirmed_bookings: number;
  bookings_this_month: number;
  published_retreats: number;
  pending_retreats: number;
  volume_cents: number;
  office_revenue_cents: number;
  office_fee_rate: number;
  country: string;
  country_code: string;
  countries_count: number;
  member_since: string;
  top_hotels: OfficeDashboardHotel[];
  top_agencies: OfficeDashboardAgency[];
  pending_organizations: Organization[];
}

export interface OfficeDashboardAgency {
  id: number;
  name: string;
  city: string | null;
  country: string | null;
  total_volume_cents: number;
  booking_count: number;
}

export interface OfficeDashboardHotel extends OfficeHotelSummary {
  total_revenue_cents: number;
  booking_count: number;
}

export interface OfficeHotelSummary {
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

export interface OfficeAgencySummary extends Organization {
  user_count: number;
  booking_count: number;
  confirmed_count: number;
  volume_cents: number;
  office_fee_cents: number;
}

export interface OfficeBookingSummary {
  total: number;
  confirmed: number;
  volume_cents: number;
  office_revenue_cents: number;
}

export interface OfficeBooking {
  id: number;
  reference: string;
  status: string;
  booking_type: "retreat" | "lodging";
  guests: number;
  starts_on: string | null;
  ends_on: string | null;
  amount_cents: number;
  amount: number;
  currency: string;
  commission_cents: number;
  commission: number;
  notes: string | null;
  client: { id: number; name: string; email: string } | null;
  experience: { id: number; title: string; hotel: OfficeHotelSummary | null } | null;
  hotel: OfficeHotelSummary | null;
  agency: Organization;
  office_fee_cents: number;
  office_fee_rate: number;
  created_at: string;
}

export interface OfficeRevenue {
  total_volume_cents: number;
  total_office_revenue_cents: number;
  office_fee_rate: number;
  monthly: OfficeMonthlyRevenue[];
  top_hotels: OfficeTopEntity[];
  top_agencies: OfficeTopEntity[];
}

export interface OfficeMonthlyRevenue {
  month: string;
  label: string;
  volume_cents: number;
  office_revenue_cents: number;
  booking_count: number;
}

export interface OfficeTopEntity {
  id: number;
  name: string;
  city?: string;
  country?: string;
  volume_cents: number;
}

export interface OfficeRetreatSummary {
  id: number;
  name: string;
  slug: string;
  retreat_type: string;
  status: string;
  duration_nights: number;
  starts_on: string | null;
  ends_on: string | null;
  capacity: number;
  hotel: OfficeHotelSummary | null;
  created_at: string;
}

export interface AdminHotelPreview {
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
  onboarding_completed: boolean;
  room_types: AdminRoomType[];
  amenities: AdminAmenity[];
  images: AdminHotelImage[];
  room_images: AdminRoomImage[];
}

export interface AdminRoomType {
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

export interface AdminAmenity {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  position: number;
  featured: boolean;
}

export interface AdminHotelImage {
  id: number;
  image_url: string;
  category: string;
  position: number;
  is_cover: boolean;
  alt_text: string | null;
}

export interface AdminRoomImage {
  id: number;
  room_type_id: number;
  image_url: string;
  position: number;
  is_primary: boolean;
}

export interface AdminBooking {
  id: number;
  reference: string;
  status: string;
  booking_type: "retreat" | "lodging";
  guests: number;
  starts_on: string | null;
  ends_on: string | null;
  amount_cents: number;
  amount: number;
  currency: string;
  commission_cents: number;
  commission: number;
  notes: string | null;
  created_at: string;
  client: { id: number; name: string; email: string } | null;
  agency: Organization;
  hotel: { id: number; name: string; city: string; country: string; country_code: string } | null;
  experience: { id: number; title: string; kind: string } | null;
  room_type: { id: number; name: string } | null;
}

export interface AdminBookingsSummary {
  total_amount_cents: number;
  total_commission_cents: number;
  count: number;
}
