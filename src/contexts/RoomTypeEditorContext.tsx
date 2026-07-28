"use client";

/**
 * State for the room type editor (/hotel/rooms/edit). Persisted to
 * sessionStorage; hydrates from the API when editing (?id= deep links).
 * Each step saves to the API on NEXT, so this mirrors server state.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { hotelApi, type RoomTypeDetail, type RoomTypeStatus } from "@/lib/api/hotel";

export type TierEntry = {
  localId: string;
  /** Server id when the tier already exists */
  id: number | null;
  minRooms: string;
  startsOn: string;
  endsOn: string;
  /** dollars, raw string so the input can be cleared */
  price: string;
};

export type RoomTypeEditorState = {
  roomTypeId: number | null;
  name: string;
  description: string;
  capacity: number;
  totalRooms: number;
  bedType: string;
  areaSqm: string;
  status: RoomTypeStatus;
  amenities: string[];
  photos: string[];
  failedUploads: string[];
  baseRate: string;
  tiers: TierEntry[];
  /** Server ids of tiers removed locally, deleted on save */
  removedTierIds: number[];
};

const initial: RoomTypeEditorState = {
  roomTypeId: null,
  name: "",
  description: "",
  capacity: 2,
  totalRooms: 1,
  bedType: "king",
  areaSqm: "",
  status: "active",
  amenities: [],
  photos: [],
  failedUploads: [],
  baseRate: "",
  tiers: [],
  removedTierIds: [],
};

const STORAGE_KEY = "humana.room-editor";

export function generateId(): string {
  return `re_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function stateFromApi(rt: RoomTypeDetail): RoomTypeEditorState {
  return {
    roomTypeId: rt.id,
    name: rt.name,
    description: rt.description ?? "",
    capacity: rt.capacity,
    totalRooms: rt.total_rooms ?? 0,
    bedType: rt.bed_type ?? "king",
    areaSqm: rt.area_sqm != null ? String(rt.area_sqm) : "",
    status: rt.status,
    amenities: rt.amenities_list ?? [],
    photos: rt.images.map((img) => img.image_url),
    failedUploads: [],
    baseRate: rt.price_per_night_cents ? String(rt.price_per_night_cents / 100) : "",
    tiers: rt.rate_tiers.map((tier) => ({
      localId: `api_${tier.id}`,
      id: tier.id,
      minRooms: String(tier.min_rooms),
      startsOn: tier.starts_on ?? "",
      endsOn: tier.ends_on ?? "",
      price: tier.price_per_night_cents ? String(tier.price_per_night_cents / 100) : "",
    })),
    removedTierIds: [],
  };
}

type RoomTypeEditorContextValue = {
  state: RoomTypeEditorState;
  set: (patch: Partial<RoomTypeEditorState>) => void;
  reset: () => void;
  hydrated: boolean;
  swapPhotoUrl: (oldUrl: string, newUrl: string) => void;
  markUploadFailed: (url: string) => void;
  clearUploadFailed: (url: string) => void;
  loadRoomType: (id: number) => Promise<void>;
  loadingRoomType: boolean;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
};

const RoomTypeEditorContext = createContext<RoomTypeEditorContextValue | null>(null);

export function RoomTypeEditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RoomTypeEditorState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [loadingRoomType, setLoadingRoomType] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const merged = { ...initial, ...JSON.parse(stored) } as RoomTypeEditorState;
        // blob: URLs don't survive a reload
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
    if (hydrated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const set = useCallback((patch: Partial<RoomTypeEditorState>) => {
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

  const loadRoomType = useCallback(async (id: number) => {
    setLoadingRoomType(true);
    try {
      const res = await hotelApi.getRoomType(id);
      setState(stateFromApi(res.room_type));
    } finally {
      setLoadingRoomType(false);
    }
  }, []);

  return (
    <RoomTypeEditorContext.Provider
      value={{
        state,
        set,
        reset,
        hydrated,
        swapPhotoUrl,
        markUploadFailed,
        clearUploadFailed,
        loadRoomType,
        loadingRoomType,
        isUploading,
        setIsUploading,
      }}
    >
      {children}
    </RoomTypeEditorContext.Provider>
  );
}

export function useRoomTypeEditor() {
  const ctx = useContext(RoomTypeEditorContext);
  if (!ctx) throw new Error("useRoomTypeEditor must be used within RoomTypeEditorProvider");
  return ctx;
}
