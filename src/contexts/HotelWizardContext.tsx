"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type RoomTypeEntry = {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  totalUnits: number;
  baseRate: number;
  roomSize: number;
  bedType: string;
};

export type HotelWizardState = {
  hotelName: string;
  address: string;
  city: string;
  country: string;
  roomTypes: RoomTypeEntry[];
  amenities: string[];
  customAmenities: string[];
  photos: string[];
  currentStep: number;
};

const initial: HotelWizardState = {
  hotelName: "",
  address: "",
  city: "",
  country: "",
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
  addRoomType: (room: Omit<RoomTypeEntry, "id">) => void;
  updateRoomType: (id: string, room: Partial<RoomTypeEntry>) => void;
  removeRoomType: (id: string) => void;
  toggleAmenity: (amenity: string) => void;
  addCustomAmenity: (amenity: string) => void;
  removeCustomAmenity: (amenity: string) => void;
  addPhoto: (url: string) => void;
  removePhoto: (index: number) => void;
};

const HotelWizardContext = createContext<HotelWizardContextValue | null>(null);

function generateId(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function HotelWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HotelWizardState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setState({ ...initial, ...JSON.parse(stored) });
    } catch {
      /* empty */
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

  const addRoomType = useCallback((room: Omit<RoomTypeEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { ...room, id: generateId() }],
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

  return (
    <HotelWizardContext.Provider
      value={{
        state,
        set,
        reset,
        addRoomType,
        updateRoomType,
        removeRoomType,
        toggleAmenity,
        addCustomAmenity,
        removeCustomAmenity,
        addPhoto,
        removePhoto,
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
