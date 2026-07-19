"use client";

import { useTranslation } from "@/lib/i18n/LocaleProvider";

export default function RouteButton({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const { dict } = useTranslation();

  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-felt text-cream px-4 py-2 rounded-full text-sm font-semibold hover:brightness-110 transition-all"
    >
      🧭 {dict.kneipeDetailExtra.route}
    </a>
  );
}
