"use client";

import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => setLocale("de")}
        className={`px-2 py-1 rounded-full transition-colors ${
          locale === "de"
            ? "bg-brass-500 text-bar-950 font-semibold"
            : "text-cream/60 hover:text-brass-400"
        }`}
        aria-pressed={locale === "de"}
      >
        DE
      </button>
      <span className="text-cream/30">/</span>
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 rounded-full transition-colors ${
          locale === "en"
            ? "bg-brass-500 text-bar-950 font-semibold"
            : "text-cream/60 hover:text-brass-400"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
