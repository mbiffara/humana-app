/**
 * AuthContext — manages JWT authentication state.
 * Provides: user, loading, login(), logout(), isAdmin, subscription.
 * Persists token in localStorage, hydrates on mount via GET /auth/me.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, tokenStore, ApiError } from "@/lib/api";
import type { User, Subscription, LoginResponse, MeResponse } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  /** Set user directly (e.g. after invitation acceptance). */
  setUser: (user: User) => void;
  isAdmin: boolean;
  isOffice: boolean;
  /** Active subscription for hotel/agency users (null if none). */
  subscription: Subscription | null;
  /** Update subscription state (e.g. after selecting a plan or cancelling). */
  setSubscription: (sub: Subscription | null) => void;
  /** Re-fetch user + subscription from /auth/me. */
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get<MeResponse>("/auth/me");
      setUserState(res.user);
      setSubscription(res.subscription ?? null);
    } catch {
      tokenStore.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // Hydrate from existing token on mount.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/auth/login", {
      auth: { email, password },
    });
    tokenStore.set(res.token);
    setUserState(res.user);
    // Fetch subscription after login
    try {
      const meRes = await api.get<MeResponse>("/auth/me");
      setSubscription(meRes.subscription ?? null);
    } catch {
      // ignore — subscription fetch is best-effort
    }
    return res.user;
  }, []);

  const logout = useCallback(() => {
    api.delete("/auth/logout").catch(() => {});
    tokenStore.clear();
    setUserState(null);
    setSubscription(null);
    if (typeof window !== "undefined") window.location.href = "/";
  }, []);

  const setUser = useCallback((u: User) => {
    setUserState(u);
  }, []);

  const refreshAuth = useCallback(async () => {
    const token = tokenStore.get();
    if (!token) return;
    try {
      const res = await api.get<MeResponse>("/auth/me");
      setUserState(res.user);
      setSubscription(res.subscription ?? null);
    } catch {
      // ignore
    }
  }, []);

  // Listen for auth-expired events dispatched by api.ts on 401
  useEffect(() => {
    function handleAuthExpired() {
      setUserState(null);
      setSubscription(null);
      if (typeof window !== "undefined") window.location.href = "/";
    }
    window.addEventListener("humana:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("humana:auth-expired", handleAuthExpired);
  }, []);

  const isAdmin = user?.platform_admin ?? false;
  const isOffice = user?.organization?.kind === "office";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, isAdmin, isOffice, subscription, setSubscription, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
