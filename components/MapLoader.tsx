"use client";

import dynamic from "next/dynamic";
import type { Kneipe } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-brass-400">
      Karte wird gezapft …
    </div>
  ),
});

export default function MapLoader({ kneipen }: { kneipen: Kneipe[] }) {
  return <MapView kneipen={kneipen} />;
}
