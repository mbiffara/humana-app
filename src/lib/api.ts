/**
 * Core API client for the HUMANA platform.
 * Handles JWT authentication, error normalization, and token management.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

/** Standardized API error with typed details. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** JWT token management via localStorage. */
export const tokenStore = {
  get: () =>
    typeof window !== "undefined"
      ? localStorage.getItem("humana.token")
      : null,
  set: (token: string) => localStorage.setItem("humana.token", token),
  clear: () => {
    localStorage.removeItem("humana.token");
    localStorage.removeItem("humana.user");
  },
};

/** Core fetch wrapper with auth headers and error handling. */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    tokenStore.clear();
    if (typeof window !== "undefined") window.location.href = "/";
    throw new ApiError(401, "Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.error || `HTTP ${res.status}`,
      body.details,
    );
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

/** Typed API client with methods for all HTTP verbs. */
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
