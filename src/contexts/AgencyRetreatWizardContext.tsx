"use client";

/**
 * State for the agency retreat creation wizard (/agency/retreats/create).
 * Persisted to sessionStorage; hydrates from the API when editing an
 * existing retreat (deep links pass ?id=). The wizard saves each step to
 * the API on NEXT, so this context mirrors — not replaces — server state.
 *
 * Differs from RetreatWizardContext in that:
 * - Agencies must choose a hotel (step 2) and room from inventory blocks (step 3)
 * - Pricing uses inventory block cost data instead of hotel room types
 * - The final action is "Submit for Review" not "Publish"
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { agencyApi, type ApiRetreat } from "@/lib/api/agency";
import { inclusionIdForName } from "@/lib/inclusion-catalog";

// Re-export shared types for convenience
export type RetreatType =
  | "wellness"
  | "spiritual"
  | "liderazgo_mujeres"
  | "constelaciones_familiares"
  | "breathwork"
  | "neurociencia"
  | "kabbalah"
  | "mindfulness";

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

export type AgencyPricingEntry = {
  inventoryBlockId: number;
  roomTypeId: number;
  price: string;
  included?: boolean;
  availableRooms: number;
  costPerNightCents: number;
};

export type AgencyRetreatWizardState = {
  retreatId: number | null;
  /* Step 1 — Basic info */
  name: string;
  retreatType: RetreatType;
  nights: number;
  startDate: string;
  capacity: number;
  language: string;
  description: string;
  /* Step 2 — Hotel selection */
  hotelId: number | null;
  hotelName: string;
  hotelCity: string;
  hotelCountry: string;
  hotelCountryCode: string;
  /* Step 3 — Room / inventory selection */
  pricing: AgencyPricingEntry[];
  capacityCovered: number | null;
  /* Step 4 — Program */
  days: ProgramDayEntry[];
  facilitators: FacilitatorEntry[];
  inclusions: string[];
  customInclusions: string[];
  /* Step 5 — Gallery */
  photos: string[];
  failedUploads: string[];
  /* Misc */
  isUploading?: boolean;
};

const initial: AgencyRetreatWizardState = {
  retreatId: null,
  name: "",
  retreatType: "wellness",
  nights: 5,
  startDate: "",
  capacity: 12,
  language: "es",
  description: "",
  hotelId: null,
  hotelName: "",
  hotelCity: "",
  hotelCountry: "",
  hotelCountryCode: "",
  pricing: [],
  capacityCovered: null,
  days: [],
  facilitators: [],
  inclusions: [],
  customInclusions: [],
  photos: [],
  failedUploads: [],
};

const STORAGE_KEY = "humana.agency-retreat-wizard";

export function generateId(): string {
  return `arw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function computeEndDate(startDate: string, nights: number): string {
  if (!startDate) return "";
  const d = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() + Math.max(nights, 0));
  return d.toISOString().slice(0, 10);
}

function stateFromApi(r: ApiRetreat): AgencyRetreatWizardState {
  return {
    retreatId: r.id,
    name: r.name,
    retreatType: r.retreat_type as RetreatType,
    nights: r.duration_nights,
    startDate: r.starts_on ?? "",
    capacity: r.capacity ?? 12,
    language: r.language ?? "es",
    description: r.description ?? "",
    hotelId: r.hotel?.id ?? null,
    hotelName: r.hotel?.name ?? "",
    hotelCity: r.hotel?.city ?? "",
    hotelCountry: r.hotel?.country ?? "",
    hotelCountryCode: r.hotel?.country_code ?? "",
    pricing: (r.pricing ?? []).map((p) => ({
      inventoryBlockId: 0,
      roomTypeId: p.room_type.id,
      price: p.price_per_guest_cents ? String(p.price_per_guest_cents / 100) : "",
      included: true,
      availableRooms: 0,
      costPerNightCents: 0,
    })),
    capacityCovered: null,
    days: (r.days ?? []).map((d) => ({
      id: `api_${d.id}`,
      dayNumber: d.day_number,
      title: d.title ?? "",
      activities: (d.activities ?? []).map((a) => ({
        id: `api_${a.id}`,
        time: a.time ?? "",
        name: a.name,
      })),
    })),
    facilitators: (r.facilitators ?? []).map((f) => ({
      id: `api_${f.id}`,
      name: f.name,
      role: f.role as "lead" | "assistant",
      specialty: f.specialty ?? "",
    })),
    inclusions: (r.inclusions ?? []).map((i) => inclusionIdForName(i.name)).filter((id): id is string => id !== null),
    customInclusions: (r.inclusions ?? []).filter((i) => inclusionIdForName(i.name) === null).map((i) => i.name),
    photos: (r.images ?? []).map((img) => img.image_url),
    failedUploads: [],
  };
}

type AgencyRetreatWizardContextValue = {
  state: AgencyRetreatWizardState;
  set: (patch: Partial<AgencyRetreatWizardState>) => void;
  reset: () => void;
  hydrated: boolean;
  swapPhotoUrl: (oldUrl: string, newUrl: string) => void;
  markUploadFailed: (url: string) => void;
  clearUploadFailed: (url: string) => void;
  loadRetreat: (id: number) => Promise<void>;
  loadingRetreat: boolean;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
};

const AgencyRetreatWizardContext = createContext<AgencyRetreatWizardContextValue | null>(null);

export function AgencyRetreatWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AgencyRetreatWizardState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [loadingRetreat, setLoadingRetreat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const merged = { ...initial, ...JSON.parse(stored) } as AgencyRetreatWizardState;
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

  const set = useCallback((patch: Partial<AgencyRetreatWizardState>) => {
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
      const res = await agencyApi.getRetreat(id);
      setState(stateFromApi(res.retreat));
    } finally {
      setLoadingRetreat(false);
    }
  }, []);

  return (
    <AgencyRetreatWizardContext.Provider
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
    </AgencyRetreatWizardContext.Provider>
  );
}

export function useAgencyRetreatWizard() {
  const ctx = useContext(AgencyRetreatWizardContext);
  if (!ctx) throw new Error("useAgencyRetreatWizard must be used within AgencyRetreatWizardProvider");
  return ctx;
}
