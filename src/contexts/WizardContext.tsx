"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ProgramDay, Facilitator } from "@/data/types";
import type { PublicRoomType } from "@/lib/api/agency";

export type WizardHotelData = {
  name: string;
  city: string;
  country: string;
  image: string;
  description: string | null;
  roomTypes: PublicRoomType[];
};

export type WizardState = {
  hotelId: number | null;
  hotelData: WizardHotelData | null;
  name: string;
  type: "retreat" | "masterclass" | "meditation";
  nights: number;
  startDate: string;
  endDate: string;
  capacity: number;
  language: string;
  description: string;
  program: ProgramDay[];
  pricing: { roomTypeId: number; retailPrice: number }[];
  gallery: string[];
  coverIndex: number;
  facilitators: Facilitator[];
  included: string[];
};

const initial: WizardState = {
  hotelId: null,
  hotelData: null,
  name: "",
  type: "retreat",
  nights: 5,
  startDate: "",
  endDate: "",
  capacity: 0,
  language: "Español",
  description: "",
  program: [],
  pricing: [],
  gallery: [],
  coverIndex: 0,
  facilitators: [],
  included: [],
};

const STORAGE_KEY = "humana.wizard";

type WizardContextValue = {
  state: WizardState;
  set: (patch: Partial<WizardState>) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initial);
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

  const set = useCallback((patch: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setState(initial), []);

  return (
    <WizardContext.Provider value={{ state, set, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
