/**
 * AuthContext — manages JWT authentication state.
 * Provides: user, loading, login(), logout(), isAdmin.
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
import type { User, LoginResponse, MeResponse } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  /** Set user directly (e.g. after invitation acceptance). */
  setUser: (user: User) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from existing token on mount.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<MeResponse>("/auth/me")
      .then((res) => setUserState(res.user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/auth/login", {
      auth: { email, password },
    });
    tokenStore.set(res.token);
    setUserState(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    api.delete("/auth/logout").catch(() => {});
    tokenStore.clear();
    setUserState(null);
    if (typeof window !== "undefined") window.location.href = "/";
  }, []);

  const setUser = useCallback((u: User) => {
    setUserState(u);
  }, []);

  const isAdmin = user?.platform_admin ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
