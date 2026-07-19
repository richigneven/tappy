"use client";

import KneipeForm from "@/components/KneipeForm";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function NeueKneipePage() {
  const { dict } = useTranslation();

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-3xl text-brass-500 mb-2">
        {dict.kneipeNeu.titel}
      </h1>
      <p className="text-sm opacity-80 mb-6">
        {dict.kneipeNeu.beschreibungstext}
      </p>
      <KneipeForm modus="neu" />
    </div>
  );
}
