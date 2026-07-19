"use client";

import { createContext, useContext, useState } from "react";
import {
  LOCALE_COOKIE,
  getDictionary,
  type Locale,
} from "./translations";

type LocaleContextValue = {
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  function setLocale(neu: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${neu}; path=/; max-age=31536000`;
    setLocaleState(neu);
  }

  return (
    <LocaleContext.Provider
      value={{ locale, dict: getDictionary(locale), setLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation muss innerhalb von LocaleProvider verwendet werden");
  }
  return ctx;
}
