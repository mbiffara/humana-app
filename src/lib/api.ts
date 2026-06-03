// Thin client for the HUMANA Rails API (sibling `../humana-api`).
// Base URL is configurable so the same build works against local dev and prod.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_HUMANA_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:3001";

export type Organization = {
  id: number;
  name: string;
  kind: "hotel" | "agency" | "admin";
  status: string;
  city: string | null;
  country: string | null;
  country_code: string | null;
  website: string | null;
};

export type AuthUser = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  locale: string;
  platform_admin: boolean;
  last_login_at: string | null;
  organization: Organization | null;
};

export type LoginResult = { token: string; user: AuthUser };

// Raised when the API responds with a non-2xx status. `status` lets callers
// distinguish bad credentials (401) from other failures.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    // Network/CORS failure — the API is unreachable.
    throw new ApiError("network", 0);
  }

  const body = (await res.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!res.ok) {
    throw new ApiError(body?.error ?? "request_failed", res.status);
  }
  return body as T;
}

export function login(email: string, password: string): Promise<LoginResult> {
  return request<LoginResult>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ auth: { email, password } }),
  });
}

export function fetchMe(token: string): Promise<{ user: AuthUser }> {
  return request<{ user: AuthUser }>("/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
