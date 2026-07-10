/** Invitation API — public endpoints for accepting invitations. */
import { api } from "@/lib/api";
import type { InvitationPublic, User } from "@/lib/types";

export const invitationsApi = {
  /** Validate an invitation token and return its details. */
  validate: (token: string) =>
    api.get<{ invitation: InvitationPublic }>(`/invitations/${token}`),

  /** Accept an invitation — creates the user and returns a JWT. */
  accept: (
    token: string,
    user: {
      name: string;
      password: string;
      password_confirmation: string;
      locale?: string;
    },
  ) =>
    api.post<{ token: string; user: User }>(
      `/invitations/${token}/accept`,
      { user },
    ),
};
