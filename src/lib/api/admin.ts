/** Admin API — Organization and User management endpoints. */
import { api } from "@/lib/api";
import type {
  Organization,
  User,
  Invitation,
  PaginationMeta,
  SubscriptionPlan,
  Subscription,
  PlatformSetting,
  Country,
  AdminHotelPreview,
} from "@/lib/types";

interface OrganizationsResponse {
  organizations: Organization[];
  meta: PaginationMeta;
}

interface UsersResponse {
  users: User[];
  meta: PaginationMeta;
}

/** Builds a query string from a params object, omitting empty values. */
function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

interface StatsResponse {
  stats: {
    agencies: number;
    hotels: number;
    bookings: number;
    gmv_cents: number;
    pending_agencies: number;
    pending_hotels: number;
    platform_since: string;
  };
}

interface InvitationsResponse {
  invitations: Invitation[];
  meta: PaginationMeta;
}

export const adminApi = {
  /** Get dashboard KPI stats, optionally filtered by date range. */
  getStats: (params?: { from?: string; to?: string }) =>
    api.get<StatsResponse>(`/admin/stats${qs(params || {})}`),

  /** List invitations with optional status filter. */
  listInvitations: (params?: { status?: string; page?: number; per_page?: number }) =>
    api.get<InvitationsResponse>(`/admin/invitations${qs(params || {})}`),

  /** Resend an invitation. */
  resendInvitation: (id: number) =>
    api.post<{ invitation: Invitation }>(`/admin/invitations/${id}/resend`, {}),

  /** List all non-admin organizations with optional filters. */
  listOrganizations: (params?: {
    kind?: string;
    status?: string;
    country?: string;
    q?: string;
    page?: number;
    per_page?: number;
  }) => api.get<OrganizationsResponse>(`/admin/organizations${qs(params || {})}`),

  /** Get a single organization by ID. */
  getOrganization: (id: number) =>
    api.get<{ organization: Organization }>(`/admin/organizations/${id}`),

  /** Create a new organization. */
  createOrganization: (data: Partial<Organization>) =>
    api.post<{ organization: Organization }>("/admin/organizations", {
      organization: data,
    }),

  /** Update an organization. */
  updateOrganization: (id: number, data: Partial<Organization>) =>
    api.patch<{ organization: Organization }>(`/admin/organizations/${id}`, {
      organization: data,
    }),

  /** Delete an organization. */
  deleteOrganization: (id: number) =>
    api.delete<void>(`/admin/organizations/${id}`),

  /** List users across all organizations with optional filters. */
  listUsers: (params?: {
    status?: string;
    role?: string;
    kind?: string;
    organization_id?: number;
    q?: string;
    page?: number;
    per_page?: number;
  }) => api.get<UsersResponse>(`/admin/users${qs(params || {})}`),

  /** Get a single user by ID. */
  getUser: (id: number) => api.get<{ user: User }>(`/admin/users/${id}`),

  /** Send an invitation to a new user. */
  inviteUser: (data: {
    email: string;
    role: string;
    organization_id?: number;
    org_name?: string;
    org_kind?: string;
    assigned_office_id?: number;
    country_code?: string;
  }) =>
    api.post<{ invitation: Invitation }>("/admin/users/invite", {
      invitation: data,
    }),

  /** Approve a pending user. */
  approveUser: (id: number) =>
    api.post<{ user: User }>(`/admin/users/${id}/approve`),

  /** Reject a pending user with a reason. */
  rejectUser: (id: number, reason: string) =>
    api.post<{ user: User }>(`/admin/users/${id}/reject`, { reason }),

  /** Send feedback to a hotel without changing their status. */
  sendFeedback: (id: number, message: string) =>
    api.post<{ user: User }>(`/admin/users/${id}/send_feedback`, { message }),

  /** Suspend an active user. */
  suspendUser: (id: number) =>
    api.post<{ user: User }>(`/admin/users/${id}/suspend`),

  /** Reactivate a suspended user. */
  reactivateUser: (id: number) =>
    api.post<{ user: User }>(`/admin/users/${id}/reactivate`),

  /** Permanently delete a user. */
  deleteUser: (id: number) =>
    api.delete<void>(`/admin/users/${id}`),

  // ─── Subscription Plans ───────────────────────────────────────────

  /** List all subscription plans. */
  listSubscriptionPlans: (params?: {
    active?: string;
    target_audience?: string;
  }) =>
    api.get<{ subscription_plans: SubscriptionPlan[] }>(
      `/admin/subscription_plans${qs(params || {})}`,
    ),

  /** Get a single subscription plan. */
  getSubscriptionPlan: (id: number) =>
    api.get<{ subscription_plan: SubscriptionPlan }>(
      `/admin/subscription_plans/${id}`,
    ),

  /** Update a subscription plan. */
  updateSubscriptionPlan: (id: number, data: Partial<SubscriptionPlan>) =>
    api.patch<{ subscription_plan: SubscriptionPlan }>(
      `/admin/subscription_plans/${id}`,
      { subscription_plan: data },
    ),

  // ─── Subscriptions ────────────────────────────────────────────────

  /** List all active subscriptions. */
  listSubscriptions: (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }) =>
    api.get<{ subscriptions: Subscription[]; meta: PaginationMeta }>(
      `/admin/subscriptions${qs(params || {})}`,
    ),

  // ─── Platform Settings ────────────────────────────────────────────

  /** Get platform settings (singleton). */
  getPlatformSettings: () =>
    api.get<{ platform_setting: PlatformSetting }>("/admin/platform_settings"),

  /** Update platform settings. */
  updatePlatformSettings: (data: Partial<PlatformSetting>) =>
    api.patch<{ platform_setting: PlatformSetting }>("/admin/platform_settings", {
      platform_setting: data,
    }),

  // ─── Countries ──────────────────────────────────────────────────

  /** List all countries. */
  listCountries: (params?: {
    region?: string;
    enabled?: string;
    q?: string;
  }) =>
    api.get<{ countries: Country[] }>(`/admin/countries${qs(params || {})}`),

  /** Create a new country. */
  createCountry: (data: {
    name: string;
    code: string;
    flag_emoji?: string;
    region?: string;
    currency_code?: string;
    timezone?: string;
  }) =>
    api.post<{ country: Country }>("/admin/countries", { country: { ...data, status: "active", enabled: true } }),

  /** Update a country (e.g. toggle enabled). */
  updateCountry: (id: number, data: Partial<Country>) =>
    api.patch<{ country: Country }>(`/admin/countries/${id}`, {
      country: data,
    }),

  /** Delete a country with password + confirmation text verification. */
  deleteCountry: (id: number, data: { password: string; confirmation_text: string }) =>
    api.delete<void>(`/admin/countries/${id}`, data),

  // ─── Hotels (Preview) ──────────────────────────────────────────

  /** Get full hotel profile for admin preview. */
  getHotelPreview: (hotelId: number) =>
    api.get<{ hotel: AdminHotelPreview; organization: Organization; owner: User | null }>(
      `/admin/hotels/${hotelId}`,
    ),
};
