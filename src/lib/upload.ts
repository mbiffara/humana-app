/**
 * Image upload utility.
 * Creates an object URL for immediate display, then attempts
 * backend upload in the background. Returns the best available URL.
 */

import { tokenStore, ApiError } from "./api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validates and creates a local preview URL from a File.
 * Returns immediately — no network call.
 */
export function createPreviewUrl(file: File): string {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum size is 10 MB.");
  }
  return URL.createObjectURL(file);
}

/**
 * Uploads a file to the backend and returns the server URL.
 * Falls back to object URL if the backend is unreachable.
 */
export async function uploadImage(file: File): Promise<string> {
  // Always create a local preview first
  const localUrl = createPreviewUrl(file);

  try {
    const token = tokenStore.get();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/uploads`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body.error || `Upload failed (${res.status})`);
    }

    const data = await res.json();
    // Revoke the object URL since we have a server URL now
    URL.revokeObjectURL(localUrl);
    return data.url;
  } catch {
    // Backend unavailable — use local preview URL
    return localUrl;
  }
}
