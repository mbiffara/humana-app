"use client";

/**
 * State for the hotel retreat creation wizard (/hotel/retreats/create).
 * Persisted to sessionStorage; hydrates from the API when editing an
 * existing retreat (deep links pass ?id=). The wizard saves each step to
 * the API on NEXT, so this context mirrors — not replaces — server state.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { hotelApi, type ApiRetreatDetail, type RetreatType } from "@/lib/api/hotel";

export type ProgramActivity = { id: string; time: string; name: string };

export type ProgramDayEntry = {
  id: string;
  dayNumber: number;
  title: string;
  activities: ProgramActivity[];
};

export type FacilitatorEntry = {
  id: string;
  name: string;
  role: "lead" | "assistant";
  specialty: string;
};

/** price is a raw dollar string so the input can be cleared while typing */
export type PricingEntry = {
  roomTypeId: number;
  price: string;
  /** Whether this room type is offered in the retreat (default true). */
  included?: boolean;
};

export type RetreatWizardState = {
  retreatId: number | null;
  name: string;
  retreatType: RetreatType;
  nights: number;
  startDate: string;
  capacity: number;
  language: string;
  description: string;
  days: ProgramDayEntry[];
  facilitators: FacilitatorEntry[];
  inclusions: string[];
  pricing: PricingEntry[];
  photos: string[];
  /** Blob URLs whose background upload failed — blocked from advancing until retried or removed */
  failedUploads: string[];
  /** Guests the included rooms can host on the retreat dates (null until step 3 computes it) */
  capacityCovered: number | null;
};

const initial: RetreatWizardState = {
  retreatId: null,
  name: "",
  retreatType: "wellness",
  nights: 5,
  startDate: "",
  capacity: 12,
  language: "es",
  description: "",
  days: [],
  facilitators: [],
  inclusions: [],
  pricing: [],
  photos: [],
  failedUploads: [],
  capacityCovered: null,
};

const STORAGE_KEY = "humana.retreat-wizard";

export function generateId(): string {
  return `rw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Derives the end date (start + nights) as yyyy-mm-dd, or "" if no start.
 *  Uses UTC throughout so the result never shifts across timezones. */
export function computeEndDate(startDate: string, nights: number): string {
  if (!startDate) return "";
  const d = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() + Math.max(nights, 0));
  return d.toISOString().slice(0, 10);
}

function stateFromApi(r: ApiRetreatDetail): RetreatWizardState {
  return {
    retreatId: r.id,
    name: r.name,
    retreatType: r.retreat_type,
    nights: r.duration_nights,
    startDate: r.starts_on ?? "",
    capacity: r.capacity ?? 12,
    language: r.language ?? "es",
    description: r.description ?? "",
    days: r.days.map((d) => ({
      id: `api_${d.id}`,
      dayNumber: d.day_number,
      title: d.title ?? "",
      activities: d.activities.map((a) => ({
        id: `api_${a.id}`,
        time: a.time ?? "",
        name: a.name,
      })),
    })),
    facilitators: r.facilitators.map((f) => ({
      id: `api_${f.id}`,
      name: f.name,
      role: f.role,
      specialty: f.specialty ?? "",
    })),
    inclusions: r.inclusions.map((i) => i.name),
    pricing: r.pricing.map((p) => ({
      roomTypeId: p.room_type.id,
      price: p.price_per_guest_cents ? String(p.price_per_guest_cents / 100) : "",
      // A pricing row on the retreat means the room is offered
      included: true,
    })),
    photos: r.images.map((img) => img.image_url),
    failedUploads: [],
    capacityCovered: null,
  };
}

type RetreatWizardContextValue = {
  state: RetreatWizardState;
  set: (patch: Partial<RetreatWizardState>) => void;
  reset: () => void;
  hydrated: boolean;
  /** Swaps a photo URL in place (blob preview → uploaded URL), race-safe. */
  swapPhotoUrl: (oldUrl: string, newUrl: string) => void;
  markUploadFailed: (url: string) => void;
  clearUploadFailed: (url: string) => void;
  /** Replaces the wizard state with a retreat loaded from the API. */
  loadRetreat: (id: number) => Promise<void>;
  loadingRetreat: boolean;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
};

const RetreatWizardContext = createContext<RetreatWizardContextValue | null>(null);

export function RetreatWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RetreatWizardState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [loadingRetreat, setLoadingRetreat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const merged = { ...initial, ...JSON.parse(stored) } as RetreatWizardState;
        // blob: URLs don't survive a reload — drop them so dead previews
        // can't count toward the gallery or linger as failed uploads
        merged.photos = (merged.photos ?? []).filter((url) => url.startsWith("http"));
        merged.failedUploads = [];
        setState(merged);
      }
    } catch {
      /* corrupt storage — start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const set = useCallback((patch: Partial<RetreatWizardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(initial);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const swapPhotoUrl = useCallback((oldUrl: string, newUrl: string) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((url) => (url === oldUrl ? newUrl : url)),
      failedUploads: prev.failedUploads.filter((url) => url !== oldUrl),
    }));
  }, []);

  const markUploadFailed = useCallback((url: string) => {
    setState((prev) =>
      prev.failedUploads.includes(url)
        ? prev
        : { ...prev, failedUploads: [...prev.failedUploads, url] },
    );
  }, []);

  const clearUploadFailed = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      failedUploads: prev.failedUploads.filter((u) => u !== url),
    }));
  }, []);

  const loadRetreat = useCallback(async (id: number) => {
    setLoadingRetreat(true);
    try {
      const res = await hotelApi.getRetreat(id);
      setState(stateFromApi(res.retreat));
    } finally {
      setLoadingRetreat(false);
    }
  }, []);

  return (
    <RetreatWizardContext.Provider
      value={{
        state,
        set,
        reset,
        hydrated,
        swapPhotoUrl,
        markUploadFailed,
        clearUploadFailed,
        loadRetreat,
        loadingRetreat,
        isUploading,
        setIsUploading,
      }}
    >
      {children}
    </RetreatWizardContext.Provider>
  );
}

export function useRetreatWizard() {
  const ctx = useContext(RetreatWizardContext);
  if (!ctx) throw new Error("useRetreatWizard must be used within RetreatWizardProvider");
  return ctx;
}
