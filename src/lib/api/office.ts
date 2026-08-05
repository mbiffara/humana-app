/**
 * Office workspace API endpoints.
 * Used by office managers for regional oversight, metrics, and user creation.
 */
import { api } from "@/lib/api";
import type {
  Organization,
  PaginationMeta,
  OfficeDashboard,
  OfficeAgencySummary,
  OfficeBooking,
  OfficeBookingSummary,
  OfficeRevenue,
  OfficeHotelSummary,
  OfficeRetreatSummary,
  User,
  Invitation,
} from "@/lib/types";

/** Builds a query string from a params object, omitting empty values. */
function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== "",
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export const officeApi = {
  // Profile
  getProfile: () =>
    api.get<{ organization: Organization & { primary_contact?: string; phone?: string } }>("/office/profile"),
  updateProfile: (data: Partial<OfficeProfileUpdate>, userName?: string) =>
    api.patch<{ organization: Organization }>("/office/profile", { organization: data, user_name: userName }),

  // Dashboard
  getDashboard: () =>
    api.get<{ dashboard: OfficeDashboard }>("/office/dashboard"),
  contactAdmin: (data: { subject: string; message: string }) =>
    api.post<{ success: boolean; message: string }>("/office/dashboard/contact_admin", data),

  // Hotels (read-only)
  listHotels: (params?: { q?: string; page?: number; per_page?: number }) =>
    api.get<{ hotels: OfficeHotelSummary[]; meta: PaginationMeta }>(`/office/hotels${qs(params || {})}`),
  getHotel: (id: number) =>
    api.get<{ hotel: OfficeHotelSummary }>(`/office/hotels/${id}`),

  // Agencies (read-only)
  listAgencies: (params?: { q?: string; page?: number; per_page?: number }) =>
    api.get<{ agencies: OfficeAgencySummary[]; meta: PaginationMeta }>(`/office/agencies${qs(params || {})}`),
  getAgency: (id: number) =>
    api.get<{ agency: OfficeAgencySummary }>(`/office/agencies/${id}`),

  // Bookings (read-only)
  listBookings: (params?: { status?: string; agency_id?: number; page?: number; per_page?: number }) =>
    api.get<{ bookings: OfficeBooking[]; summary: OfficeBookingSummary; meta: PaginationMeta }>(`/office/bookings${qs(params || {})}`),
  getBooking: (id: number) =>
    api.get<{ booking: OfficeBooking }>(`/office/bookings/${id}`),

  // Retreats (read-only)
  listRetreats: (params?: { status?: string; type?: string; page?: number; per_page?: number }) =>
    api.get<{ retreats: OfficeRetreatSummary[]; meta: PaginationMeta }>(`/office/retreats${qs(params || {})}`),
  getRetreat: (id: number) =>
    api.get<{ retreat: OfficeRetreatSummary }>(`/office/retreats/${id}`),

  // Revenue
  getRevenue: () =>
    api.get<{ revenue: OfficeRevenue }>("/office/revenue"),

  // Members (office team)
  listMembers: () =>
    api.get<{ members: User[]; pending_invitations: Invitation[] }>("/office/members"),
  inviteMember: (email: string, role: string) =>
    api.post<{ invitation: Invitation }>("/office/members/invite", { email, role }),

  // Users (regional hotel/agency users)
  listUsers: (params?: { q?: string; kind?: string; page?: number; per_page?: number }) =>
    api.get<{ users: User[]; meta: PaginationMeta }>(`/office/users${qs(params || {})}`),
  getUser: (id: number) =>
    api.get<{ user: User }>(`/office/users/${id}`),
  inviteUser: (data: { email: string; org_name: string; org_kind: string; country_code?: string }) =>
    api.post<{ invitation: Invitation }>("/office/users/invite", { invitation: data }),
};

export interface OfficeProfileUpdate {
  name: string;
  primary_contact: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  country_code: string;
  contact_email: string;
}
