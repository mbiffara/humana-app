"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { hotelApi } from "@/lib/api/hotel";
import { amenityIdForName } from "@/lib/amenity-catalog";
import {
  normalizeImageCategory,
  sanitizeEnvironments,
  type ImageCategory,
  type PhotoEntry,
} from "@/lib/property-catalog";
import {
  EMPTY_PROPERTY_FORM,
  propertyFormFromProfile,
  type PropertyFormValues,
} from "@/lib/property-form";
import { useAuth } from "@/contexts/AuthContext";

export type AvailabilityBlock = {
  id: string;
  startDate: string;
  endDate: string;
  units: number;
  blocked: boolean;
};

export type RoomTypeEntry = {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  totalUnits: number;
  baseRate: number;
  roomSize: number;
  bedType: string;
  photos: string[];
  availability: AvailabilityBlock[];
};

/** The wizard state is the shared property form plus the owner/identity fields
 *  and the per-step collections the wizard owns. */
export type HotelWizardState = PropertyFormValues & {
  /* Personal data */
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  /* Property identity */
  hotelName: string;
  address: string;
  description: string;
  phone: string;
  contactEmail: string;
  /* Room types */
  roomTypes: RoomTypeEntry[];
  /* Amenities */
  amenities: string[];
  customAmenities: string[];
  /* Property visual material */
  photos: PhotoEntry[];
  logoUrl: string;
  videoUrl: string;
  /* Wizard meta */
  currentStep: number;
};

const initial: HotelWizardState = {
  ...EMPTY_PROPERTY_FORM,
  ownerFirstName: "",
  ownerLastName: "",
  ownerPhone: "",
  hotelName: "",
  address: "",
  description: "",
  phone: "",
  contactEmail: "",
  roomTypes: [],
  amenities: [],
  customAmenities: [],
  photos: [],
  logoUrl: "",
  videoUrl: "",
  currentStep: 1,
};

const STORAGE_KEY = "humana.hotel-wizard";

/** Max photos per room type — keep in sync with the roomPhotosMax copy. */
export const MAX_ROOM_PHOTOS = 8;

type HotelWizardContextValue = {
  state: HotelWizardState;
  set: (patch: Partial<HotelWizardState>) => void;
  reset: () => void;
  addRoomType: (room: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => void;
  updateRoomType: (id: string, room: Partial<RoomTypeEntry>) => void;
  removeRoomType: (id: string) => void;
  addRoomPhoto: (roomId: string, url: string) => void;
  removeRoomPhoto: (roomId: string, index: number) => void;
  swapRoomPhotoUrl: (roomId: string, oldUrl: string, newUrl: string) => void;
  addAvailabilityBlock: (roomId: string, block: Omit<AvailabilityBlock, "id">) => void;
  removeAvailabilityBlock: (roomId: string, blockId: string) => void;
  toggleAmenity: (amenity: string) => void;
  addCustomAmenity: (amenity: string) => void;
  removeCustomAmenity: (amenity: string) => void;
  addPhoto: (url: string) => void;
  removePhoto: (index: number) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  swapPhotoUrl: (oldUrl: string, newUrl: string) => void;
  setPhotoCategory: (index: number, category: ImageCategory) => void;
  setPhotoCover: (index: number) => void;
  hideBottomBar: boolean;
  setHideBottomBar: (v: boolean) => void;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
};

const HotelWizardContext = createContext<HotelWizardContextValue | null>(null);

/** Gallery entries used to be plain URLs — an old session migrates to the
 *  categorised shape with everything under "Other". */
function migratePhotos(value: unknown): PhotoEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): PhotoEntry[] => {
    if (typeof entry === "string") return [{ url: entry, category: "general" }];
    if (entry && typeof entry === "object" && typeof (entry as PhotoEntry).url === "string") {
      const photo = entry as { url: string; category?: unknown };
      return [{ url: photo.url, category: normalizeImageCategory(photo.category) }];
    }
    return [];
  });
}

function generateId(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function HotelWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HotelWizardState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [hideBottomBar, setHideBottomBar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const apiLoaded = useRef(false);
  const { user } = useAuth();

  // Hydrate the owner fields (step 1) from the authenticated user — they are
  // saved on the user record, not the hotel, so the profile fetch below
  // doesn't cover them.
  useEffect(() => {
    if (!user) return;
    setState((prev) => {
      const patch: Partial<HotelWizardState> = {};
      if (user.name && !prev.ownerFirstName && !prev.ownerLastName) {
        const [first, ...rest] = user.name.trim().split(/\s+/);
        patch.ownerFirstName = first;
        patch.ownerLastName = rest.join(" ");
      }
      if (user.phone && !prev.ownerPhone) {
        patch.ownerPhone = user.phone;
      }
      // The property's public email defaults to the account email until the
      // owner overrides it in step 1.
      if (user.email && !prev.contactEmail) {
        patch.contactEmail = user.email;
      }
      return Object.keys(patch).length > 0 ? { ...prev, ...patch } : prev;
    });
  }, [user]);

  // Hydrate: the DB is the source of truth — saved data always wins over
  // sessionStorage. Session data is only used while the API loads (so
  // in-progress edits reappear instantly) and as fallback when the API has
  // no hotel yet or is unreachable.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure room types have the new fields (photos, availability)
        if (Array.isArray(parsed.roomTypes)) {
          parsed.roomTypes = parsed.roomTypes.map((rt: Record<string, unknown>) => ({
            photos: [],
            availability: [],
            ...rt,
          }));
        }
        const merged = { ...initial, ...parsed };
        // Sessions saved before the property contract may carry a stale shape
        merged.environments = sanitizeEnvironments(merged.environments);
        // Sessions saved before the gallery categories held plain URLs
        merged.photos = migratePhotos(merged.photos);
        if (merged.hotelName || merged.ownerFirstName || merged.roomTypes.length > 0) {
          setState(merged);
        }
      }
    } catch {
      /* empty */
    }

    if (!apiLoaded.current) {
      apiLoaded.current = true;
      Promise.all([
        hotelApi.getProfile(),
        hotelApi.listAvailabilityBlocks().catch(() => ({ availability_blocks: [] })),
      ]).then(([res, blocksRes]) => {
        const h = res.hotel;
        // No hotel saved yet — keep whatever the session had
        if (!h) return;

        const patch: Partial<HotelWizardState> = {};

        // The property block is assigned wholesale, including the values the
        // server cleared (null / [] / ""): a truthy-only merge would keep a
        // stale sessionStorage answer and write it straight back on save.
        Object.assign(patch, propertyFormFromProfile(h));

        // Wizard-only identity fields keep the "only if present" merge so an
        // in-progress draft (and the account email prefill) is not wiped.
        if (h.name) patch.hotelName = h.name;
        if (h.address) patch.address = h.address;
        if (h.description) patch.description = h.description;
        if (h.phone) patch.phone = h.phone;
        if (h.contact_email) patch.contactEmail = h.contact_email;

        // Hydrate room types, including their saved photos and blocked dates
        if (h.room_types && h.room_types.length > 0) {
          const blocks = blocksRes.availability_blocks;
          patch.roomTypes = h.room_types.map((rt) => ({
            id: `api_${rt.id}`,
            name: rt.name,
            description: rt.description || "",
            maxGuests: rt.capacity,
            totalUnits: rt.total_rooms || 1,
            baseRate: rt.price_per_night_cents / 100,
            roomSize: rt.area_sqm || 0,
            bedType: rt.bed_type || "King",
            photos: (rt.images ?? []).map((img) => img.image_url),
            availability: blocks
              .filter((b) => b.room_type_id === rt.id)
              .map((b) => ({
                id: `api_block_${b.id}`,
                startDate: b.starts_on,
                endDate: b.ends_on,
                // null units means the whole room type is closed
                units: b.units ?? rt.total_rooms ?? 1,
                blocked: true,
              })),
          }));
        }

        // Hydrate amenities — match stored display names back to catalog ids
        if (h.amenities && h.amenities.length > 0) {
          const amenityIds: string[] = [];
          const customNames: string[] = [];
          for (const a of h.amenities) {
            const id = amenityIdForName(a.name);
            if (id) amenityIds.push(id);
            else customNames.push(a.name);
          }
          patch.amenities = amenityIds;
          patch.customAmenities = customNames;
        }

        // Hydrate the gallery — the cover leads the grid, as in the batch
        // payload, and unknown API categories fall back to "Other".
        if (h.images && h.images.length > 0) {
          const images = [...h.images].sort(
            (a, b) => Number(b.is_cover) - Number(a.is_cover),
          );
          patch.photos = images.map((img) => ({
            url: img.image_url,
            category: normalizeImageCategory(img.category),
          }));
        }

        // Logo and video are server-owned like the property block: assign them
        // wholesale so a cleared value is not re-sent from a stale session.
        patch.logoUrl = h.logo_url ?? "";
        patch.videoUrl = h.video_url ?? "";

        if (Object.keys(patch).length > 0) {
          setState((prev) => ({ ...prev, ...patch }));
        }
      }).catch(() => {
        // API unavailable — continue with session state
      });
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const set = useCallback((patch: Partial<HotelWizardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setState(initial), []);

  const addRoomType = useCallback((room: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => {
    setState((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { ...room, id: generateId(), photos: [], availability: [] }],
    }));
  }, []);

  const updateRoomType = useCallback((id: string, patch: Partial<RoomTypeEntry>) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === id ? { ...rt, ...patch } : rt
      ),
    }));
  }, []);

  const removeRoomType = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((rt) => rt.id !== id),
    }));
  }, []);

  const addRoomPhoto = useCallback((roomId: string, url: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId && rt.photos.length < MAX_ROOM_PHOTOS
          ? { ...rt, photos: [...rt.photos, url] }
          : rt
      ),
    }));
  }, []);

  const removeRoomPhoto = useCallback((roomId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, photos: rt.photos.filter((_, i) => i !== index) }
          : rt
      ),
    }));
  }, []);

  const swapRoomPhotoUrl = useCallback((roomId: string, oldUrl: string, newUrl: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, photos: rt.photos.map((u) => (u === oldUrl ? newUrl : u)) }
          : rt
      ),
    }));
  }, []);

  const addAvailabilityBlock = useCallback((roomId: string, block: Omit<AvailabilityBlock, "id">) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, availability: [...rt.availability, { ...block, id: generateId() }] }
          : rt
      ),
    }));
  }, []);

  const removeAvailabilityBlock = useCallback((roomId: string, blockId: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, availability: rt.availability.filter((b) => b.id !== blockId) }
          : rt
      ),
    }));
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setState((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  const addCustomAmenity = useCallback((amenity: string) => {
    setState((prev) => {
      if (prev.customAmenities.includes(amenity)) return prev;
      return { ...prev, customAmenities: [...prev.customAmenities, amenity] };
    });
  }, []);

  const removeCustomAmenity = useCallback((amenity: string) => {
    setState((prev) => ({
      ...prev,
      customAmenities: prev.customAmenities.filter((a) => a !== amenity),
    }));
  }, []);

  const addPhoto = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      photos: [...prev.photos, { url, category: "general" }],
    }));
  }, []);

  const removePhoto = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }, []);

  const reorderPhotos = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      if (fromIndex === toIndex) return prev;
      const photos = [...prev.photos];
      const [moved] = photos.splice(fromIndex, 1);
      photos.splice(toIndex, 0, moved);
      return { ...prev, photos };
    });
  }, []);

  const swapPhotoUrl = useCallback((oldUrl: string, newUrl: string) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((photo) =>
        photo.url === oldUrl ? { ...photo, url: newUrl } : photo,
      ),
    }));
  }, []);

  const setPhotoCategory = useCallback((index: number, category: ImageCategory) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, i) => (i === index ? { ...photo, category } : photo)),
    }));
  }, []);

  /** The cover is the first photo of the batch, so promoting one moves it. */
  const setPhotoCover = useCallback((index: number) => {
    setState((prev) => {
      if (index <= 0 || index >= prev.photos.length) return prev;
      const photos = [...prev.photos];
      const [moved] = photos.splice(index, 1);
      photos.unshift(moved);
      return { ...prev, photos };
    });
  }, []);

  return (
    <HotelWizardContext.Provider
      value={{
        state,
        set,
        reset,
        addRoomType,
        updateRoomType,
        removeRoomType,
        addRoomPhoto,
        removeRoomPhoto,
        swapRoomPhotoUrl,
        addAvailabilityBlock,
        removeAvailabilityBlock,
        toggleAmenity,
        addCustomAmenity,
        removeCustomAmenity,
        addPhoto,
        removePhoto,
        reorderPhotos,
        swapPhotoUrl,
        setPhotoCategory,
        setPhotoCover,
        hideBottomBar,
        setHideBottomBar,
        isUploading,
        setIsUploading,
      }}
    >
      {children}
    </HotelWizardContext.Provider>
  );
}

export function useHotelWizard() {
  const ctx = useContext(HotelWizardContext);
  if (!ctx)
    throw new Error("useHotelWizard must be used within HotelWizardProvider");
  return ctx;
}
