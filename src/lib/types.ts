/** API response types — matches Rails serializer output. */

export interface Organization {
  id: number;
  name: string;
  kind: "hotel" | "agency" | "admin" | "office";
  status: "pending" | "verified" | "suspended";
  city: string | null;
  country: string | null;
  country_code: string | null;
  contact_email: string | null;
  website: string | null;
  onboarding_completed: boolean;
  user_count?: number;
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "owner" | "member" | "admin";
  status: "pending" | "active" | "suspended" | "rejected";
  locale: string;
  platform_admin: boolean;
  last_login_at: string | null;
  created_at: string | null;
  organization: Organization;
  invited_by_organization?: { id: number; name: string; kind: string } | null;
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
  features: Record<string, boolean>;
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
}
