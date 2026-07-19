"use client";

import dynamic from "next/dynamic";
import type { Kneipe } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <MapLoadingText />,
});

function MapLoadingText() {
  const { dict } = useTranslation();
  return (
    <div className="h-full w-full flex items-center justify-center text-brass-400">
      {dict.map.ladeText}
    </div>
  );
}

export default function MapLoader({ kneipen }: { kneipen: Kneipe[] }) {
  return <MapView kneipen={kneipen} />;
}
