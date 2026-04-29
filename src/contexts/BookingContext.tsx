"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type BookingState = {
  country: string | null;
  flowType: "retreats" | "hotels" | null;
  retreatSlug: string | null;
  hotelSlug: string | null;
  dates: { start: string; end: string } | null;
  roomTypeId: string | null;
  guests: number;
  preNights: number;
  postNights: number;
  clientId: string | null;
  inventoryMode: boolean;
};

const initial: BookingState = {
  country: null,
  flowType: null,
  retreatSlug: null,
  hotelSlug: null,
  dates: null,
  roomTypeId: null,
  guests: 1,
  preNights: 0,
  postNights: 0,
  clientId: null,
  inventoryMode: false,
};

const STORAGE_KEY = "humana.booking";

type BookingContextValue = {
  state: BookingState;
  hydrated: boolean;
  set: (patch: Partial<BookingState>) => void;
  reset: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored));
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

  const set = useCallback((patch: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setState(initial), []);

  return (
    <BookingContext.Provider value={{ state, hydrated, set, reset }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
