"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  defaultLocale,
  dictionary,
  locales,
  type Locale,
} from "./dictionary";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (typeof dictionary)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "humana.locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && locales.includes(stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: dictionary[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className={`flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] ${className}`}
    >
      {locales.map((l, i) => (
        <div key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-humana-subtle">·</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            className={`cursor-pointer transition-colors ${
              locale === l
                ? "text-humana-ink"
                : "text-humana-muted hover:text-humana-ink"
            }`}
          >
            {l.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
}
