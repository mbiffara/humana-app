/**
 * Agency workspace API endpoints.
 * Used by agencies for onboarding and profile management.
 */
import { api } from "@/lib/api";
import type { Organization } from "@/lib/types";

export const agencyApi = {
  getProfile: () =>
    api.get<{ organization: Organization & { primary_contact?: string; phone?: string } }>("/agency/profile"),
  updateProfile: (data: Partial<AgencyProfileUpdate>, userName?: string) =>
    api.patch<{ organization: Organization }>("/agency/profile", { organization: data, user_name: userName }),
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
}
