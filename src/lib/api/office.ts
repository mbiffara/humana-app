/**
 * Office workspace API endpoints.
 * Used by office managers for onboarding and profile management.
 */
import { api } from "@/lib/api";
import type { Organization } from "@/lib/types";

export const officeApi = {
  getProfile: () =>
    api.get<{ organization: Organization & { primary_contact?: string; phone?: string } }>("/office/profile"),
  updateProfile: (data: Partial<OfficeProfileUpdate>, userName?: string) =>
    api.patch<{ organization: Organization }>("/office/profile", { organization: data, user_name: userName }),
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
