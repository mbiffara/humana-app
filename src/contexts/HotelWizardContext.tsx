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

export type HotelWizardState = {
  /* Personal data */
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  /* Property identity */
  hotelName: string;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  description: string;
  stars: number;
  phone: string;
  contactEmail: string;
  website: string;
  checkInTime: string;
  checkOutTime: string;
  /* Room types */
  roomTypes: RoomTypeEntry[];
  /* Amenities */
  amenities: string[];
  customAmenities: string[];
  /* Property photos */
  photos: string[];
  /* Wizard meta */
  currentStep: number;
};

const initial: HotelWizardState = {
  ownerFirstName: "",
  ownerLastName: "",
  ownerPhone: "",
  hotelName: "",
  address: "",
  city: "",
  country: "",
  countryCode: "",
  description: "",
  stars: 0,
  phone: "",
  contactEmail: "",
  website: "",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  roomTypes: [],
  amenities: [],
  customAmenities: [],
  photos: [],
  currentStep: 1,
};

const STORAGE_KEY = "humana.hotel-wizard";

type HotelWizardContextValue = {
  state: HotelWizardState;
  set: (patch: Partial<HotelWizardState>) => void;
  reset: () => void;
  addRoomType: (room: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => void;
  updateRoomType: (id: string, room: Partial<RoomTypeEntry>) => void;
  removeRoomType: (id: string) => void;
  addRoomPhoto: (roomId: string, url: string) => void;
  removeRoomPhoto: (roomId: string, index: number) => void;
  addAvailabilityBlock: (roomId: string, block: Omit<AvailabilityBlock, "id">) => void;
  removeAvailabilityBlock: (roomId: string, blockId: string) => void;
  toggleAmenity: (amenity: string) => void;
  addCustomAmenity: (amenity: string) => void;
  removeCustomAmenity: (amenity: string) => void;
  addPhoto: (url: string) => void;
  removePhoto: (index: number) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  swapPhotoUrl: (oldUrl: string, newUrl: string) => void;
  hideBottomBar: boolean;
  setHideBottomBar: (v: boolean) => void;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
};

const HotelWizardContext = createContext<HotelWizardContextValue | null>(null);

function generateId(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function HotelWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HotelWizardState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [hideBottomBar, setHideBottomBar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const apiLoaded = useRef(false);

  // Hydrate: sessionStorage first, then API fallback
  useEffect(() => {
    let hasSessionData = false;

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
        // Only use session data if it has meaningful content
        if (merged.hotelName || merged.ownerFirstName || merged.roomTypes.length > 0) {
          setState(merged);
          hasSessionData = true;
        }
      }
    } catch {
      /* empty */
    }

    // If no meaningful session data, try loading from API
    if (!hasSessionData && !apiLoaded.current) {
      apiLoaded.current = true;
      hotelApi.getProfile().then((res) => {
        if (!res.hotel) return;
        const h = res.hotel;
        const patch: Partial<HotelWizardState> = {};

        if (h.name) patch.hotelName = h.name;
        if (h.address) patch.address = h.address;
        if (h.city) patch.city = h.city;
        if (h.country) patch.country = h.country;
        if (h.country_code) patch.countryCode = h.country_code;
        if (h.description) patch.description = h.description;
        if (h.stars) patch.stars = h.stars;
        if (h.phone) patch.phone = h.phone;
        if (h.contact_email) patch.contactEmail = h.contact_email;
        if (h.website) patch.website = h.website;
        if (h.check_in_time) patch.checkInTime = h.check_in_time;
        if (h.check_out_time) patch.checkOutTime = h.check_out_time;

        // Hydrate room types from API
        if (h.room_types && h.room_types.length > 0) {
          patch.roomTypes = h.room_types.map((rt) => ({
            id: `api_${rt.id}`,
            name: rt.name,
            description: rt.description || "",
            maxGuests: rt.capacity,
            totalUnits: rt.total_rooms || 1,
            baseRate: rt.price_per_night_cents / 100,
            roomSize: rt.area_sqm || 0,
            bedType: rt.bed_type || "King",
            photos: [],
            availability: [],
          }));
        }

        // Hydrate amenities
        if (h.amenities && h.amenities.length > 0) {
          const knownIds = ["wifi", "pool", "spa", "breakfast", "parking", "ac", "yoga-studio", "gym", "meditation-room", "private-garden", "ocean-terrace", "private-chef"];
          const amenityIds: string[] = [];
          const customNames: string[] = [];
          for (const a of h.amenities) {
            if (knownIds.includes(a.name)) amenityIds.push(a.name);
            else customNames.push(a.name);
          }
          if (amenityIds.length) patch.amenities = amenityIds;
          if (customNames.length) patch.customAmenities = customNames;
        }

        // Hydrate images
        if (h.images && h.images.length > 0) {
          patch.photos = h.images.map((img) => img.image_url);
        }

        if (Object.keys(patch).length > 0) {
          setState((prev) => ({ ...prev, ...patch }));
        }
      }).catch(() => {
        // API unavailable — continue with empty state
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
        rt.id === roomId && rt.photos.length < 4
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
      photos: [...prev.photos, url],
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
      photos: prev.photos.map((url) => (url === oldUrl ? newUrl : url)),
    }));
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
        addAvailabilityBlock,
        removeAvailabilityBlock,
        toggleAmenity,
        addCustomAmenity,
        removeCustomAmenity,
        addPhoto,
        removePhoto,
        reorderPhotos,
        swapPhotoUrl,
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
